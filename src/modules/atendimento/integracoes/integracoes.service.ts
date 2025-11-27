import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateIntegracaoDto } from './dto/create-integracao.dto';
import { UpdateIntegracaoDto } from './dto/update-integracao.dto';
import {
  Integracao,
  TipoIntegracao,
  StatusIntegracao,
} from './entities/integracao.entity';
import { IntegracaoConfiguracao } from './entities/integracao-configuracao.entity';
import { getSchemaBySlug } from './schemas/index';
import { IntegracaoFiltersDto } from './dto/integracao-filters.dto';
import { PaginationDto } from '../../infraestrutura/common/dto/pagination.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function toPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0,
  };
}

@Injectable()
export class IntegracoesService {
  constructor(
    @InjectRepository(Integracao)
    private integracaoRepository: Repository<Integracao>,
    @InjectRepository(IntegracaoConfiguracao)
    private configuracaoRepository: Repository<IntegracaoConfiguracao>,
    private dataSource: DataSource,
  ) {}

  /**
   * Cria nova integração com configurações usando transação
   */
  async create(createDto: CreateIntegracaoDto): Promise<Integracao> {
    // Validar se schema existe
    const schema = getSchemaBySlug(createDto.templateSlug);
    if (!schema) {
      throw new BadRequestException(
        `Template '${createDto.templateSlug}' não encontrado`,
      );
    }

    // Validar se código já existe
    const existingByCode = await this.integracaoRepository.findOne({
      where: { codigoIdentificacao: createDto.codigoIdentificacao },
    });

    if (existingByCode) {
      throw new ConflictException(
        `Já existe uma integração com o código ${createDto.codigoIdentificacao}`,
      );
    }

    // Validar campos obrigatórios do schema
    this.validateConfiguracoes(schema, createDto.configuracoes);

    // Criar integração e configurações em transação
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Criar integração
      const integracao = this.integracaoRepository.create({
        templateSlug: createDto.templateSlug,
        codigoIdentificacao: createDto.codigoIdentificacao,
        nomeInstancia: createDto.nomeInstancia,
        descricao: createDto.descricao,
        tiposContexto: createDto.tiposContexto,
        observacoes: createDto.observacoes,
      });

      const integracaoSalva = await queryRunner.manager.save(integracao);

      // Criar configurações (key-value pairs)
      const configuracoes = Object.entries(createDto.configuracoes).map(
        ([chave, valor]) => {
          return this.configuracaoRepository.create({
            integracaoId: integracaoSalva.id,
            chave,
            valor:
              typeof valor === 'object' ? JSON.stringify(valor) : String(valor),
          });
        },
      );

      await queryRunner.manager.save(configuracoes);
      await queryRunner.commitTransaction();

      // Retornar integração com configurações
      return this.findOne(integracaoSalva.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Valida se as configurações obrigatórias do schema foram fornecidas
   */
  private validateConfiguracoes(
    schema: any,
    configuracoes: Record<string, any>,
  ): void {
    const camposObrigatorios = schema.campos
      .filter((campo) => campo.obrigatorio)
      .map((campo) => campo.chave);

    const chavesConfiguradas = Object.keys(configuracoes);
    const faltando = camposObrigatorios.filter(
      (chave) => !chavesConfiguradas.includes(chave),
    );

    if (faltando.length > 0) {
      throw new BadRequestException(
        `Campos obrigatórios faltando: ${faltando.join(', ')}`,
      );
    }
  }

  /**
   * Lista todas as integrações com configurações, paginação e filtros
   */
  async findAll(
    filters: IntegracaoFiltersDto = {},
  ): Promise<PaginatedResult<Integracao>> {
    const {
      page = 1,
      limit = 20,
      searchTerm,
      status,
      tipo,
      ativo,
      templateSlug,
    } = filters;
    const skip = (page - 1) * limit;

    let query = this.integracaoRepository
      .createQueryBuilder('integracao')
      .leftJoinAndSelect('integracao.configuracoes', 'configuracoes');

    // Filtro por termo de busca (nome, descrição ou código)
    if (searchTerm) {
      query = query.andWhere(
        '(integracao.nome_instancia ILIKE :termo OR integracao.descricao ILIKE :termo OR integracao.codigo_identificacao ILIKE :termo)',
        { termo: `%${searchTerm}%` },
      );
    }

    // Filtro por status
    if (status) {
      query = query.andWhere('integracao.status = :status', { status });
    }

    // Filtro por tipo/contexto
    if (tipo) {
      query = query.andWhere(':tipo = ANY(integracao.tipos_contexto)', {
        tipo,
      });
    }

    // Filtro por ativo
    if (ativo !== undefined) {
      query = query.andWhere('integracao.ativo = :ativo', { ativo });
    }

    // Filtro por template
    if (templateSlug) {
      query = query.andWhere('integracao.template_slug = :templateSlug', {
        templateSlug,
      });
    }

    const [data, total] = await query
      .orderBy('integracao.nomeInstancia', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    };
  }

  /**
   * Lista integrações ativas com paginação
   */
  async findAtivos(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResult<Integracao>> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.integracaoRepository.findAndCount({
      where: { ativo: true },
      relations: ['configuracoes'],
      order: { nomeInstancia: 'ASC' },
      skip,
      take: limit,
    });

    return toPaginatedResult(data, total, page, limit);
  }

  /**
   * Busca por tipo de integração com paginação
   */
  async findByTipo(
    tipo: TipoIntegracao,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResult<Integracao>> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 20;
    const skip = (page - 1) * limit;

    // Converter enum key para valor (LABORATORIO_APOIO -> laboratorio_apoio)
    const tipoValue = TipoIntegracao[tipo] || tipo.toLowerCase();

    const [data, total] = await this.integracaoRepository
      .createQueryBuilder('integracao')
      .leftJoinAndSelect('integracao.configuracoes', 'configuracoes')
      .where(':tipo = ANY(integracao.tipos_contexto)', { tipo: tipoValue })
      .orderBy('integracao.nomeInstancia', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return toPaginatedResult(data, total, page, limit);
  }

  /**
   * Busca por status com paginação
   */
  async findByStatus(
    status: StatusIntegracao,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResult<Integracao>> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.integracaoRepository.findAndCount({
      where: { status },
      relations: ['configuracoes'],
      order: { nomeInstancia: 'ASC' },
      skip,
      take: limit,
    });

    return toPaginatedResult(data, total, page, limit);
  }

  /**
   * Busca por código
   */
  async findByCodigo(codigo: string): Promise<Integracao> {
    const integracao = await this.integracaoRepository.findOne({
      where: { codigoIdentificacao: codigo },
      relations: ['configuracoes'],
    });

    if (!integracao) {
      throw new NotFoundException(
        `Integração com código ${codigo} não encontrada`,
      );
    }

    return integracao;
  }

  /**
   * Busca por termo (nome, descrição, código) com paginação
   */
  async search(
    termo: string,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResult<Integracao>> {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.integracaoRepository
      .createQueryBuilder('integracao')
      .leftJoinAndSelect('integracao.configuracoes', 'configuracoes')
      .where('integracao.nome_instancia ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('integracao.descricao ILIKE :termo', { termo: `%${termo}%` })
      .orWhere('integracao.codigo_identificacao ILIKE :termo', {
        termo: `%${termo}%`,
      })
      .orderBy('integracao.nomeInstancia', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return toPaginatedResult(data, total, page, limit);
  }

  /**
   * Busca por ID
   */
  async findOne(id: string): Promise<Integracao> {
    const integracao = await this.integracaoRepository.findOne({
      where: { id },
      relations: ['configuracoes'],
    });

    if (!integracao) {
      throw new NotFoundException(`Integração com ID ${id} não encontrada`);
    }

    return integracao;
  }

  /**
   * Atualiza integração e configurações
   */
  async update(
    id: string,
    updateDto: UpdateIntegracaoDto,
  ): Promise<Integracao> {
    const integracao = await this.findOne(id);

    // Validar código único se está mudando
    if (
      updateDto.codigoIdentificacao &&
      updateDto.codigoIdentificacao !== integracao.codigoIdentificacao
    ) {
      const existingByCode = await this.integracaoRepository.findOne({
        where: { codigoIdentificacao: updateDto.codigoIdentificacao },
      });

      if (existingByCode) {
        throw new ConflictException(
          `Já existe uma integração com o código ${updateDto.codigoIdentificacao}`,
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Atualizar dados da integração
      Object.assign(integracao, {
        codigoIdentificacao: updateDto.codigoIdentificacao,
        nomeInstancia: updateDto.nomeInstancia,
        descricao: updateDto.descricao,
        tiposContexto: updateDto.tiposContexto,
        observacoes: updateDto.observacoes,
      });

      const integracaoAtualizada = await queryRunner.manager.save(integracao);

      // Atualizar configurações se fornecidas
      if (updateDto.configuracoes) {
        const schema = getSchemaBySlug(integracao.templateSlug);
        if (schema) {
          // Validar configurações
          const camposObrigatorios = schema.campos
            .filter((campo) => campo.obrigatorio)
            .map((campo) => campo.chave);

          // Para cada campo obrigatório, verificar se está nas configurações atuais ou no update
          for (const chave of camposObrigatorios) {
            const existe =
              updateDto.configuracoes[chave] !== undefined ||
              integracao.configuracoes.some((c) => c.chave === chave);

            if (!existe) {
              throw new BadRequestException(
                `Campo obrigatório '${chave}' não pode ser removido`,
              );
            }
          }
        }

        // Atualizar ou criar configurações
        for (const [chave, valor] of Object.entries(updateDto.configuracoes)) {
          const configExistente = await queryRunner.manager.findOne(
            IntegracaoConfiguracao,
            {
              where: { integracaoId: integracao.id, chave },
            },
          );

          if (configExistente) {
            configExistente.valor =
              typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
            await queryRunner.manager.save(configExistente);
          } else {
            const novaConfig = this.configuracaoRepository.create({
              integracaoId: integracao.id,
              chave,
              valor:
                typeof valor === 'object'
                  ? JSON.stringify(valor)
                  : String(valor),
            });
            await queryRunner.manager.save(novaConfig);
          }
        }
      }

      await queryRunner.commitTransaction();
      return this.findOne(integracaoAtualizada.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Alterna status ativo/inativo
   */
  async toggleStatus(id: string): Promise<Integracao> {
    const integracao = await this.findOne(id);
    integracao.ativo = !integracao.ativo;
    await this.integracaoRepository.save(integracao);
    return this.findOne(id);
  }

  /**
   * Atualiza status da integração
   */
  async updateStatus(
    id: string,
    status: StatusIntegracao,
  ): Promise<Integracao> {
    const integracao = await this.findOne(id);
    integracao.status = status;
    await this.integracaoRepository.save(integracao);
    return this.findOne(id);
  }

  /**
   * Remove integração (cascade remove configurações)
   */
  async remove(id: string): Promise<void> {
    const integracao = await this.findOne(id);
    await this.integracaoRepository.remove(integracao);
  }

  /**
   * Retorna estatísticas das integrações
   */
  async getEstatisticas() {
    const [total, ativos, inativos] = await Promise.all([
      this.integracaoRepository.count(),
      this.integracaoRepository.count({ where: { ativo: true } }),
      this.integracaoRepository.count({ where: { ativo: false } }),
    ]);

    // Contar por template
    const porTemplate = await this.integracaoRepository
      .createQueryBuilder('integracao')
      .select('integracao.templateSlug', 'template')
      .addSelect('COUNT(*)', 'total')
      .groupBy('integracao.templateSlug')
      .getRawMany();

    // Contar por status
    const porStatus = await this.integracaoRepository
      .createQueryBuilder('integracao')
      .select('integracao.status', 'status')
      .addSelect('COUNT(*)', 'total')
      .groupBy('integracao.status')
      .getRawMany();

    return {
      total,
      ativos,
      inativos,
      porTemplate,
      porStatus,
    };
  }

  /**
   * Testa conexão com a integração
   */
  async testarConexao(
    id: string,
  ): Promise<{ sucesso: boolean; mensagem: string; detalhes?: any }> {
    const integracao = await this.findOne(id);

    try {
      if (!integracao.ativo) {
        return {
          sucesso: false,
          mensagem: 'Integração está inativa',
        };
      }

      // TODO: Implementar lógica específica de teste por template
      // Por enquanto, retorna sucesso se tiver configurações mínimas
      const temConfiguracoes = integracao.configuracoes.length > 0;

      return {
        sucesso: temConfiguracoes,
        mensagem: temConfiguracoes
          ? 'Configurações carregadas - Implementar teste real'
          : 'Nenhuma configuração encontrada',
        detalhes: {
          template: integracao.templateSlug,
          totalConfiguracoes: integracao.configuracoes.length,
          timestampTeste: new Date(),
        },
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: `Erro ao testar conexão: ${error.message}`,
      };
    }
  }

  /**
   * Sincroniza dados da integração
   */
  async sincronizar(id: string): Promise<{
    sucesso: boolean;
    dadosSincronizados?: number;
    ultimaSincronizacao?: Date;
  }> {
    const integracao = await this.findOne(id);

    if (!integracao.ativo) {
      return {
        sucesso: false,
      };
    }

    // TODO: Implementar lógica real de sincronização por template
    const agora = new Date();
    integracao.ultimaSincronizacao = agora;
    integracao.tentativasFalhas = 0;

    await this.integracaoRepository.save(integracao);

    return {
      sucesso: true,
      dadosSincronizados: 0,
      ultimaSincronizacao: agora,
    };
  }
}
