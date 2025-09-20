import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Convenio } from '../entities/convenio.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';
import { TipoEmpresaEnum } from '../../empresas/enums/empresas.enum';

@Injectable()
export class ConvenioService {
  constructor(
    @InjectRepository(Convenio)
    private readonly convenioRepository: Repository<Convenio>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createConvenioDto: CreateConvenioDto): Promise<Convenio> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar código único
      const existingCodigo = await this.convenioRepository.findOne({
        where: { codigo_convenio: createConvenioDto.codigo_convenio },
      });

      if (existingCodigo) {
        throw new ConflictException('Já existe um convênio com este código');
      }

      // Verificar CNPJ único na tabela empresas
      const existingCnpj = await this.empresaRepository.findOne({
        where: { cnpj: createConvenioDto.empresa.cnpj },
      });

      if (existingCnpj) {
        throw new ConflictException('Já existe uma empresa com este CNPJ');
      }

      // Criar empresa primeiro
      const empresaData = {
        ...createConvenioDto.empresa,
        tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
      };
      const empresa = this.empresaRepository.create(empresaData);
      const savedEmpresa = await queryRunner.manager.save(empresa);

      // Criar convênio vinculado à empresa
      const convenioData = {
        ...createConvenioDto,
        empresa_id: savedEmpresa.id,
        empresa: undefined, // Remover objeto empresa do convenioData
      };
      delete convenioData.empresa;

      const convenio = this.convenioRepository.create(convenioData);
      const savedConvenio = await queryRunner.manager.save(convenio);

      await queryRunner.commitTransaction();

      // Buscar com relacionamento
      return await this.findOne(savedConvenio.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Convenio[]> {
    const convenios = await this.convenioRepository.find({
      relations: ['empresa', 'planos', 'instrucoes'],
    });

    // Ordenar pelo nome fantasia da empresa
    return convenios.sort((a, b) =>
      a.empresa.nomeFantasia.localeCompare(b.empresa.nomeFantasia),
    );
  }

  async findOne(id: string): Promise<Convenio> {
    const convenio = await this.convenioRepository.findOne({
      where: { id },
      relations: ['empresa', 'planos', 'instrucoes'],
    });

    if (!convenio) {
      throw new NotFoundException(`Convênio com ID ${id} não encontrado`);
    }

    return convenio;
  }

  async findByCodigo(codigo: string): Promise<Convenio> {
    const convenio = await this.convenioRepository.findOne({
      where: { codigo_convenio: codigo },
      relations: ['empresa', 'planos', 'instrucoes'],
    });

    if (!convenio) {
      throw new NotFoundException(
        `Convênio com código ${codigo} não encontrado`,
      );
    }

    return convenio;
  }

  async findByCnpj(cnpj: string): Promise<Convenio> {
    const convenio = await this.convenioRepository
      .createQueryBuilder('convenio')
      .leftJoinAndSelect('convenio.empresa', 'empresa')
      .leftJoinAndSelect('convenio.planos', 'planos')
      .leftJoinAndSelect('convenio.instrucoes', 'instrucoes')
      .where('empresa.cnpj = :cnpj', { cnpj })
      .getOne();

    if (!convenio) {
      throw new NotFoundException(`Convênio com CNPJ ${cnpj} não encontrado`);
    }

    return convenio;
  }

  async findAtivos(): Promise<Convenio[]> {
    return await this.convenioRepository
      .createQueryBuilder('convenio')
      .leftJoinAndSelect('convenio.empresa', 'empresa')
      .leftJoinAndSelect('convenio.planos', 'planos')
      .where('empresa.ativo = :ativo', { ativo: true })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  async update(
    id: string,
    updateConvenioDto: UpdateConvenioDto,
  ): Promise<Convenio> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const convenio = await this.findOne(id);

      // Verificar código único se foi alterado
      if (
        updateConvenioDto.codigo_convenio &&
        updateConvenioDto.codigo_convenio !== convenio.codigo_convenio
      ) {
        const existingCodigo = await this.convenioRepository.findOne({
          where: { codigo_convenio: updateConvenioDto.codigo_convenio },
        });

        if (existingCodigo) {
          throw new ConflictException('Já existe um convênio com este código');
        }
      }

      // Atualizar dados da empresa se fornecidos
      if (updateConvenioDto.empresa) {
        // Verificar CNPJ único se foi alterado
        if (
          updateConvenioDto.empresa.cnpj &&
          updateConvenioDto.empresa.cnpj !== convenio.empresa.cnpj
        ) {
          const existingCnpj = await this.empresaRepository.findOne({
            where: { cnpj: updateConvenioDto.empresa.cnpj },
          });

          if (existingCnpj && existingCnpj.id !== convenio.empresa_id) {
            throw new ConflictException('Já existe uma empresa com este CNPJ');
          }
        }

        Object.assign(convenio.empresa, updateConvenioDto.empresa);
        await queryRunner.manager.save(convenio.empresa);
      }

      // Atualizar dados do convênio
      const convenioData = { ...updateConvenioDto };
      delete convenioData.empresa;
      Object.assign(convenio, convenioData);
      const savedConvenio = await queryRunner.manager.save(convenio);

      await queryRunner.commitTransaction();
      return await this.findOne(savedConvenio.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const convenio = await this.findOne(id);
    await this.convenioRepository.remove(convenio);
  }

  async toggleStatus(id: string): Promise<Convenio> {
    const convenio = await this.findOne(id);
    // Toggle status na empresa
    convenio.empresa.ativo = !convenio.empresa.ativo;
    await this.empresaRepository.save(convenio.empresa);
    return await this.findOne(id);
  }

  async search(query: string): Promise<Convenio[]> {
    return await this.convenioRepository
      .createQueryBuilder('convenio')
      .leftJoinAndSelect('convenio.empresa', 'empresa')
      .leftJoinAndSelect('convenio.planos', 'planos')
      .where('empresa.nomeFantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.razaoSocial ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('convenio.codigo_convenio LIKE :query', { query: `%${query}%` })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }
}
