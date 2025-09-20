import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Telemedicina } from '../entities/telemedicina.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { CreateTelemedicinaDto } from '../dto/create-telemedicina.dto';
import { UpdateTelemedicinaDto } from '../dto/update-telemedicina.dto';
import { TipoEmpresaEnum } from '../../empresas/enums/empresas.enum';

@Injectable()
export class TelemedicinaService {
  constructor(
    @InjectRepository(Telemedicina)
    private readonly telemedicinaRepository: Repository<Telemedicina>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTelemedicinaDto: CreateTelemedicinaDto,
  ): Promise<Telemedicina> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar código único
      const existingCodigo = await this.telemedicinaRepository.findOne({
        where: {
          codigo_telemedicina: createTelemedicinaDto.codigo_telemedicina,
        },
      });

      if (existingCodigo) {
        throw new ConflictException(
          'Já existe uma telemedicina com este código',
        );
      }

      // Verificar CNPJ único na tabela empresas
      const existingCnpj = await this.empresaRepository.findOne({
        where: { cnpj: createTelemedicinaDto.empresa.cnpj },
      });

      if (existingCnpj) {
        throw new ConflictException('Já existe uma empresa com este CNPJ');
      }

      // Criar empresa primeiro
      const empresaData = {
        ...createTelemedicinaDto.empresa,
        tipoEmpresa: TipoEmpresaEnum.TELEMEDICINA,
      };
      const empresa = this.empresaRepository.create(empresaData);
      const savedEmpresa = await queryRunner.manager.save(empresa);

      // Criar telemedicina vinculada à empresa
      const telemedicinaData = {
        ...createTelemedicinaDto,
        empresa_id: savedEmpresa.id,
        empresa: undefined,
      };
      delete telemedicinaData.empresa;

      const telemedicina = this.telemedicinaRepository.create(telemedicinaData);
      const savedTelemedicina = await queryRunner.manager.save(telemedicina);

      await queryRunner.commitTransaction();

      // Buscar com relacionamento
      return await this.findOne(savedTelemedicina.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Telemedicina[]> {
    const telemedicinas = await this.telemedicinaRepository.find({
      relations: ['empresa'],
    });

    // Ordenar pelo nome fantasia da empresa
    return telemedicinas.sort((a, b) =>
      a.empresa.nomeFantasia.localeCompare(b.empresa.nomeFantasia),
    );
  }

  async findOne(id: string): Promise<Telemedicina> {
    const telemedicina = await this.telemedicinaRepository.findOne({
      where: { id },
      relations: ['empresa'],
    });

    if (!telemedicina) {
      throw new NotFoundException(`Telemedicina com ID ${id} não encontrada`);
    }

    return telemedicina;
  }

  async findByCodigo(codigo: string): Promise<Telemedicina> {
    const telemedicina = await this.telemedicinaRepository.findOne({
      where: { codigo_telemedicina: codigo },
      relations: ['empresa'],
    });

    if (!telemedicina) {
      throw new NotFoundException(
        `Telemedicina com código ${codigo} não encontrada`,
      );
    }

    return telemedicina;
  }

  async findByCnpj(cnpj: string): Promise<Telemedicina> {
    const telemedicina = await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .leftJoinAndSelect('telemedicina.empresa', 'empresa')
      .where('empresa.cnpj = :cnpj', { cnpj })
      .getOne();

    if (!telemedicina) {
      throw new NotFoundException(
        `Telemedicina com CNPJ ${cnpj} não encontrada`,
      );
    }

    return telemedicina;
  }

  async findAtivos(): Promise<Telemedicina[]> {
    return await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .leftJoinAndSelect('telemedicina.empresa', 'empresa')
      .where('empresa.ativo = :ativo', { ativo: true })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  async findByIntegracao(tipo_integracao: string): Promise<Telemedicina[]> {
    return await this.telemedicinaRepository.find({
      where: { tipo_integracao: tipo_integracao as any },
      relations: ['empresa'],
    });
  }

  async findByPlataforma(tipo_plataforma: string): Promise<Telemedicina[]> {
    return await this.telemedicinaRepository.find({
      where: { tipo_plataforma: tipo_plataforma as any },
      relations: ['empresa'],
    });
  }

  async update(
    id: string,
    updateTelemedicinaDto: UpdateTelemedicinaDto,
  ): Promise<Telemedicina> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const telemedicina = await this.findOne(id);

      // Verificar código único se foi alterado
      if (
        updateTelemedicinaDto.codigo_telemedicina &&
        updateTelemedicinaDto.codigo_telemedicina !==
          telemedicina.codigo_telemedicina
      ) {
        const existingCodigo = await this.telemedicinaRepository.findOne({
          where: {
            codigo_telemedicina: updateTelemedicinaDto.codigo_telemedicina,
          },
        });

        if (existingCodigo) {
          throw new ConflictException(
            'Já existe uma telemedicina com este código',
          );
        }
      }

      // Atualizar dados da empresa se fornecidos
      if (updateTelemedicinaDto.empresa) {
        // Verificar CNPJ único se foi alterado
        if (
          updateTelemedicinaDto.empresa.cnpj &&
          updateTelemedicinaDto.empresa.cnpj !== telemedicina.empresa.cnpj
        ) {
          const existingCnpj = await this.empresaRepository.findOne({
            where: { cnpj: updateTelemedicinaDto.empresa.cnpj },
          });

          if (existingCnpj && existingCnpj.id !== telemedicina.empresa_id) {
            throw new ConflictException('Já existe uma empresa com este CNPJ');
          }
        }

        Object.assign(telemedicina.empresa, updateTelemedicinaDto.empresa);
        await queryRunner.manager.save(telemedicina.empresa);
      }

      // Atualizar dados da telemedicina
      const telemedicinaData = { ...updateTelemedicinaDto };
      delete telemedicinaData.empresa;
      Object.assign(telemedicina, telemedicinaData);
      const savedTelemedicina = await queryRunner.manager.save(telemedicina);

      await queryRunner.commitTransaction();
      return await this.findOne(savedTelemedicina.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const telemedicina = await this.findOne(id);
    await this.telemedicinaRepository.remove(telemedicina);
  }

  async toggleStatus(id: string): Promise<Telemedicina> {
    const telemedicina = await this.findOne(id);
    // Toggle status na empresa
    telemedicina.empresa.ativo = !telemedicina.empresa.ativo;
    await this.empresaRepository.save(telemedicina.empresa);
    return await this.findOne(id);
  }

  async search(query: string): Promise<Telemedicina[]> {
    return await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .leftJoinAndSelect('telemedicina.empresa', 'empresa')
      .where('empresa.nomeFantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.razaoSocial ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('telemedicina.codigo_telemedicina LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  // Métodos específicos para telemedicina
  async updateStatusIntegracao(
    id: string,
    status: string,
  ): Promise<Telemedicina> {
    const telemedicina = await this.findOne(id);
    telemedicina.status_integracao = status as any;
    await this.telemedicinaRepository.save(telemedicina);
    return await this.findOne(id);
  }

  async getEstatisticas(): Promise<any> {
    const total = await this.telemedicinaRepository.count();
    const ativos = await this.telemedicinaRepository.count({
      where: { empresa: { ativo: true } },
      relations: ['empresa'],
    });

    const porTipoIntegracao = await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .select('telemedicina.tipo_integracao', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .groupBy('telemedicina.tipo_integracao')
      .getRawMany();

    const porTipoPlataforma = await this.telemedicinaRepository
      .createQueryBuilder('telemedicina')
      .select('telemedicina.tipo_plataforma', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .groupBy('telemedicina.tipo_plataforma')
      .getRawMany();

    return {
      total,
      ativos,
      inativos: total - ativos,
      porTipoIntegracao,
      porTipoPlataforma,
    };
  }
}
