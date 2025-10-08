import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Fornecedor } from '../entities/fornecedor.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { CreateFornecedorDto } from '../dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from '../dto/update-fornecedor.dto';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar código único
      const existingCodigo = await this.fornecedorRepository.findOne({
        where: { codigo_fornecedor: createFornecedorDto.codigo_fornecedor },
      });

      if (existingCodigo) {
        throw new ConflictException('Já existe um fornecedor com este código');
      }

      // Verificar CNPJ único na tabela empresas
      const existingCnpj = await this.empresaRepository.findOne({
        where: { cnpj: createFornecedorDto.empresa.cnpj },
      });

      if (existingCnpj) {
        throw new ConflictException('Já existe uma empresa com este CNPJ');
      }

      // Criar empresa primeiro
      const empresaData = {
        ...createFornecedorDto.empresa,
        tipoEmpresa: TipoEmpresaEnum.FORNECEDORES,
      };
      const empresa = this.empresaRepository.create(empresaData);
      const savedEmpresa = await queryRunner.manager.save(empresa);

      // Criar fornecedor vinculado à empresa
      const fornecedorData = {
        ...createFornecedorDto,
        empresa_id: savedEmpresa.id,
        empresa: undefined,
      };
      delete fornecedorData.empresa;

      const fornecedor = this.fornecedorRepository.create(fornecedorData);
      const savedFornecedor = await queryRunner.manager.save(fornecedor);

      await queryRunner.commitTransaction();

      // Buscar com relacionamento
      return await this.findOne(savedFornecedor.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Fornecedor[]> {
    const fornecedores = await this.fornecedorRepository.find({
      relations: ['empresa'],
    });

    // Ordenar pelo nome fantasia da empresa
    return fornecedores.sort((a, b) =>
      a.empresa.nomeFantasia.localeCompare(b.empresa.nomeFantasia),
    );
  }

  async findOne(id: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorRepository.findOne({
      where: { id },
      relations: ['empresa'],
    });

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado`);
    }

    return fornecedor;
  }

  async findByCodigo(codigo: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorRepository.findOne({
      where: { codigo_fornecedor: codigo },
      relations: ['empresa'],
    });

    if (!fornecedor) {
      throw new NotFoundException(
        `Fornecedor com código ${codigo} não encontrado`,
      );
    }

    return fornecedor;
  }

  async findByCnpj(cnpj: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where('empresa.cnpj = :cnpj', { cnpj })
      .getOne();

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
    }

    return fornecedor;
  }

  async findAtivos(): Promise<Fornecedor[]> {
    return await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where('empresa.ativo = :ativo', { ativo: true })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  async findByStatus(status: string): Promise<Fornecedor[]> {
    return await this.fornecedorRepository.find({
      where: { status_fornecedor: status as any },
      relations: ['empresa'],
    });
  }

  async findByCategoria(categoria: string): Promise<Fornecedor[]> {
    return await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where(':categoria = ANY(fornecedor.categorias_fornecidas)', {
        categoria,
      })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  async findByRegiao(estados: string[]): Promise<Fornecedor[]> {
    return await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where(
        'fornecedor.atende_todo_brasil = true OR fornecedor.estados_atendidos && :estados',
        { estados },
      )
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  async findPendentesAprovacao(): Promise<Fornecedor[]> {
    return await this.fornecedorRepository.find({
      where: { status_fornecedor: 'pendente_aprovacao' as any },
      relations: ['empresa'],
      order: { created_at: 'ASC' },
    });
  }

  async update(
    id: string,
    updateFornecedorDto: UpdateFornecedorDto,
  ): Promise<Fornecedor> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fornecedor = await this.findOne(id);

      // Verificar código único se foi alterado
      if (
        updateFornecedorDto.codigo_fornecedor &&
        updateFornecedorDto.codigo_fornecedor !== fornecedor.codigo_fornecedor
      ) {
        const existingCodigo = await this.fornecedorRepository.findOne({
          where: { codigo_fornecedor: updateFornecedorDto.codigo_fornecedor },
        });

        if (existingCodigo) {
          throw new ConflictException(
            'Já existe um fornecedor com este código',
          );
        }
      }

      // Atualizar dados da empresa se fornecidos
      if (updateFornecedorDto.empresa) {
        // Verificar CNPJ único se foi alterado
        if (
          updateFornecedorDto.empresa.cnpj &&
          updateFornecedorDto.empresa.cnpj !== fornecedor.empresa.cnpj
        ) {
          const existingCnpj = await this.empresaRepository.findOne({
            where: { cnpj: updateFornecedorDto.empresa.cnpj },
          });

          if (existingCnpj && existingCnpj.id !== fornecedor.empresa_id) {
            throw new ConflictException('Já existe uma empresa com este CNPJ');
          }
        }

        Object.assign(fornecedor.empresa, updateFornecedorDto.empresa);
        await queryRunner.manager.save(fornecedor.empresa);
      }

      // Atualizar dados do fornecedor
      const fornecedorData = { ...updateFornecedorDto };
      delete fornecedorData.empresa;
      Object.assign(fornecedor, fornecedorData);
      const savedFornecedor = await queryRunner.manager.save(fornecedor);

      await queryRunner.commitTransaction();
      return await this.findOne(savedFornecedor.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const fornecedor = await this.findOne(id);
    await this.fornecedorRepository.remove(fornecedor);
  }

  async toggleStatus(id: string): Promise<Fornecedor> {
    const fornecedor = await this.findOne(id);
    // Toggle status na empresa
    fornecedor.empresa.ativo = !fornecedor.empresa.ativo;
    await this.empresaRepository.save(fornecedor.empresa);
    return await this.findOne(id);
  }

  async aprovarFornecedor(
    id: string,
    aprovadoPor: string,
  ): Promise<Fornecedor> {
    const fornecedor = await this.findOne(id);
    fornecedor.status_fornecedor = 'ativo' as any;
    fornecedor.aprovado_por = aprovadoPor;
    fornecedor.data_aprovacao = new Date();
    await this.fornecedorRepository.save(fornecedor);
    return await this.findOne(id);
  }

  async reprovarFornecedor(id: string): Promise<Fornecedor> {
    const fornecedor = await this.findOne(id);
    fornecedor.status_fornecedor = 'bloqueado' as any;
    await this.fornecedorRepository.save(fornecedor);
    return await this.findOne(id);
  }

  async atualizarAvaliacao(
    id: string,
    novaAvaliacao: number,
  ): Promise<Fornecedor> {
    const fornecedor = await this.findOne(id);

    const totalAvaliacoes = fornecedor.total_avaliacoes || 0;
    const avaliacaoAtual = fornecedor.avaliacao_media || 0;

    const novaMedia =
      (avaliacaoAtual * totalAvaliacoes + novaAvaliacao) /
      (totalAvaliacoes + 1);

    fornecedor.avaliacao_media = Math.round(novaMedia * 100) / 100; // 2 casas decimais
    fornecedor.total_avaliacoes = totalAvaliacoes + 1;

    await this.fornecedorRepository.save(fornecedor);
    return await this.findOne(id);
  }

  async search(query: string): Promise<Fornecedor[]> {
    return await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .leftJoinAndSelect('fornecedor.empresa', 'empresa')
      .where('empresa.nomeFantasia ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.razaoSocial ILIKE :query', { query: `%${query}%` })
      .orWhere('empresa.cnpj LIKE :query', { query: `%${query}%` })
      .orWhere('fornecedor.codigo_fornecedor LIKE :query', {
        query: `%${query}%`,
      })
      .orWhere('fornecedor.representante_comercial ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('empresa.nomeFantasia', 'ASC')
      .getMany();
  }

  async getEstatisticas(): Promise<any> {
    const total = await this.fornecedorRepository.count();
    const ativos = await this.fornecedorRepository.count({
      where: { empresa: { ativo: true } },
      relations: ['empresa'],
    });

    const porStatus = await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .select('fornecedor.status_fornecedor', 'status')
      .addSelect('COUNT(*)', 'total')
      .groupBy('fornecedor.status_fornecedor')
      .getRawMany();

    const porCategoria = await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .select('unnest(fornecedor.categorias_fornecidas)', 'categoria')
      .addSelect('COUNT(*)', 'total')
      .groupBy('categoria')
      .getRawMany();

    const avaliacaoMedia = await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .select('AVG(fornecedor.avaliacao_media)', 'media')
      .where('fornecedor.avaliacao_media IS NOT NULL')
      .getRawOne();

    return {
      total,
      ativos,
      inativos: total - ativos,
      porStatus,
      porCategoria,
      avaliacaoGeral: avaliacaoMedia?.media || 0,
    };
  }

  async getFornecedoresPorRegiao(): Promise<any> {
    const nacionais = await this.fornecedorRepository.count({
      where: { atende_todo_brasil: true },
    });

    const regionais = await this.fornecedorRepository
      .createQueryBuilder('fornecedor')
      .select('unnest(fornecedor.estados_atendidos)', 'estado')
      .addSelect('COUNT(*)', 'total')
      .where('fornecedor.atende_todo_brasil = false')
      .groupBy('estado')
      .getRawMany();

    return {
      nacionais,
      regionais,
    };
  }
}
