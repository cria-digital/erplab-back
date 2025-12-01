import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HierarquiaCfo } from './entities/hierarquia-cfo.entity';
import { ClasseCfo } from './entities/classe-cfo.entity';
import { CreateHierarquiaCfoDto } from './dto/create-hierarquia-cfo.dto';
import { UpdateHierarquiaCfoDto } from './dto/update-hierarquia-cfo.dto';
import { PaginatedResultDto } from '../../infraestrutura/common/dto/pagination.dto';

export interface FiltroHierarquiaCfo {
  ativo?: boolean;
  pesquisar?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class HierarquiaCfoService {
  constructor(
    @InjectRepository(HierarquiaCfo)
    private readonly repository: Repository<HierarquiaCfo>,
    @InjectRepository(ClasseCfo)
    private readonly classeRepository: Repository<ClasseCfo>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Criar nova hierarquia CFO
   */
  async create(createDto: CreateHierarquiaCfoDto): Promise<HierarquiaCfo> {
    // Verifica se já existe hierarquia com o mesmo código interno
    const existente = await this.repository.findOne({
      where: { codigo_interno: createDto.codigo_interno },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe uma hierarquia CFO com o código interno: ${createDto.codigo_interno}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { classes, ...hierarquiaData } = createDto;

      // Criar hierarquia
      const hierarquia = this.repository.create(hierarquiaData);
      const hierarquiaSalva = await queryRunner.manager.save(hierarquia);

      // Criar classes se fornecidas
      if (classes && classes.length > 0) {
        const classesEntities = classes.map((c, index) =>
          this.classeRepository.create({
            hierarquiaId: hierarquiaSalva.id,
            tipo: c.tipo,
            nivelClassificacao: c.nivel_classificacao,
            codigoHierarquico: c.codigo_hierarquico,
            codigoContabil: c.codigo_contabil,
            nomeClasse: c.nome_classe,
            ordem: c.ordem ?? index,
            ativo: c.ativo ?? true,
          }),
        );
        await queryRunner.manager.save(classesEntities);
      }

      await queryRunner.commitTransaction();
      return this.findOne(hierarquiaSalva.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Listar todas as hierarquias com filtros opcionais e paginação
   */
  async findAll(
    filtros?: FiltroHierarquiaCfo,
  ): Promise<PaginatedResultDto<HierarquiaCfo>> {
    const page = filtros?.page || 1;
    const limit = filtros?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('hierarquia')
      .leftJoinAndSelect('hierarquia.classes', 'classes')
      .orderBy('hierarquia.descricao', 'ASC')
      .addOrderBy('classes.ordem', 'ASC');

    // Filtro por status
    if (filtros?.ativo !== undefined) {
      queryBuilder.andWhere('hierarquia.ativo = :ativo', {
        ativo: filtros.ativo,
      });
    }

    // Filtro por pesquisa (descrição ou código)
    if (filtros?.pesquisar) {
      queryBuilder.andWhere(
        '(hierarquia.descricao ILIKE :pesquisar OR hierarquia.codigo_interno ILIKE :pesquisar)',
        { pesquisar: `%${filtros.pesquisar}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResultDto(data, total, page, limit);
  }

  /**
   * Buscar hierarquia por ID
   */
  async findOne(id: string): Promise<HierarquiaCfo> {
    const hierarquia = await this.repository.findOne({
      where: { id },
      relations: ['classes'],
      order: {
        classes: {
          ordem: 'ASC',
        },
      },
    });

    if (!hierarquia) {
      throw new NotFoundException(`Hierarquia CFO com ID ${id} não encontrada`);
    }

    return hierarquia;
  }

  /**
   * Atualizar hierarquia
   */
  async update(
    id: string,
    updateDto: UpdateHierarquiaCfoDto,
  ): Promise<HierarquiaCfo> {
    const hierarquia = await this.findOne(id);

    // Se está alterando o código interno, verifica se não existe outro com o mesmo
    if (
      updateDto.codigo_interno &&
      updateDto.codigo_interno !== hierarquia.codigo_interno
    ) {
      const existente = await this.repository.findOne({
        where: { codigo_interno: updateDto.codigo_interno },
      });

      if (existente) {
        throw new ConflictException(
          `Já existe uma hierarquia CFO com o código interno: ${updateDto.codigo_interno}`,
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { classes, ...hierarquiaData } = updateDto;

      // Atualizar hierarquia
      Object.assign(hierarquia, hierarquiaData);
      await queryRunner.manager.save(hierarquia);

      // Atualizar classes se fornecido
      if (classes !== undefined) {
        // Remover classes antigas
        await queryRunner.manager.delete(ClasseCfo, {
          hierarquiaId: id,
        });

        // Criar novas classes
        if (classes.length > 0) {
          const classesEntities = classes.map((c, index) =>
            this.classeRepository.create({
              hierarquiaId: id,
              tipo: c.tipo,
              nivelClassificacao: c.nivel_classificacao,
              codigoHierarquico: c.codigo_hierarquico,
              codigoContabil: c.codigo_contabil,
              nomeClasse: c.nome_classe,
              ordem: c.ordem ?? index,
              ativo: c.ativo ?? true,
            }),
          );
          await queryRunner.manager.save(classesEntities);
        }
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Excluir hierarquia
   */
  async remove(id: string): Promise<{ affected: number }> {
    const hierarquia = await this.findOne(id);
    await this.repository.remove(hierarquia);
    return { affected: 1 };
  }

  /**
   * Alternar status da hierarquia (ativo/inativo)
   */
  async toggleStatus(id: string): Promise<HierarquiaCfo> {
    const hierarquia = await this.findOne(id);
    hierarquia.ativo = !hierarquia.ativo;
    return await this.repository.save(hierarquia);
  }

  /**
   * Estatísticas das hierarquias (para o contador)
   */
  async getEstatisticas(): Promise<{
    total: number;
    ativas: number;
    inativas: number;
  }> {
    const total = await this.repository.count();
    const ativas = await this.repository.count({
      where: { ativo: true },
    });
    const inativas = await this.repository.count({
      where: { ativo: false },
    });

    return { total, ativas, inativas };
  }

  /**
   * Adicionar classe à hierarquia
   */
  async adicionarClasse(
    hierarquiaId: string,
    classeDto: CreateHierarquiaCfoDto['classes'][0],
  ): Promise<HierarquiaCfo> {
    await this.findOne(hierarquiaId);

    const classe = this.classeRepository.create({
      hierarquiaId,
      tipo: classeDto.tipo,
      nivelClassificacao: classeDto.nivel_classificacao,
      codigoHierarquico: classeDto.codigo_hierarquico,
      codigoContabil: classeDto.codigo_contabil,
      nomeClasse: classeDto.nome_classe,
      ordem: classeDto.ordem ?? 0,
      ativo: classeDto.ativo ?? true,
    });

    await this.classeRepository.save(classe);
    return this.findOne(hierarquiaId);
  }

  /**
   * Remover classe da hierarquia
   */
  async removerClasse(
    hierarquiaId: string,
    classeId: string,
  ): Promise<HierarquiaCfo> {
    await this.classeRepository.delete({
      id: classeId,
      hierarquiaId,
    });

    return this.findOne(hierarquiaId);
  }

  /**
   * Atualizar classe da hierarquia
   */
  async atualizarClasse(
    hierarquiaId: string,
    classeId: string,
    classeDto: Partial<CreateHierarquiaCfoDto['classes'][0]>,
  ): Promise<HierarquiaCfo> {
    const classe = await this.classeRepository.findOne({
      where: { id: classeId, hierarquiaId },
    });

    if (!classe) {
      throw new NotFoundException(
        `Classe CFO com ID ${classeId} não encontrada na hierarquia ${hierarquiaId}`,
      );
    }

    if (classeDto.tipo !== undefined) classe.tipo = classeDto.tipo;
    if (classeDto.nivel_classificacao !== undefined)
      classe.nivelClassificacao = classeDto.nivel_classificacao;
    if (classeDto.codigo_hierarquico !== undefined)
      classe.codigoHierarquico = classeDto.codigo_hierarquico;
    if (classeDto.codigo_contabil !== undefined)
      classe.codigoContabil = classeDto.codigo_contabil;
    if (classeDto.nome_classe !== undefined)
      classe.nomeClasse = classeDto.nome_classe;
    if (classeDto.ordem !== undefined) classe.ordem = classeDto.ordem;
    if (classeDto.ativo !== undefined) classe.ativo = classeDto.ativo;

    await this.classeRepository.save(classe);
    return this.findOne(hierarquiaId);
  }

  /**
   * Buscar hierarquia em formato de árvore
   */
  async findAsTree(id: string): Promise<any> {
    const hierarquia = await this.findOne(id);

    // Organizar classes em estrutura de árvore
    const titulos = hierarquia.classes.filter((c) => c.tipo === 'TITULO');
    const niveis = hierarquia.classes.filter((c) => c.tipo === 'NIVEL');

    const arvore = titulos.map((titulo) => {
      const filhos = this.buildTree(titulo.codigoHierarquico, niveis);
      return {
        ...titulo,
        filhos,
      };
    });

    return {
      ...hierarquia,
      arvore,
    };
  }

  private buildTree(codigoPai: string, niveis: ClasseCfo[]): any[] {
    const filhos = niveis.filter((n) => {
      const partes = n.codigoHierarquico.split('.');
      partes.pop();
      return (
        partes.join('.') === codigoPai ||
        n.codigoHierarquico.startsWith(codigoPai + '.')
      );
    });

    return filhos
      .filter((n) => {
        const partes = n.codigoHierarquico.split('.');
        const partesPai = codigoPai.split('.');
        return partes.length === partesPai.length + 1;
      })
      .map((filho) => ({
        ...filho,
        filhos: this.buildTree(filho.codigoHierarquico, niveis),
      }));
  }
}
