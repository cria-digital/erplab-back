import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integracao, TipoIntegracao } from '../entities/integracao.entity';
import { IntegracaoConfiguracao } from '../entities/integracao-configuracao.entity';

/**
 * Configurações de uma integração com valores parseados
 */
export interface IntegracaoConfig {
  integracaoId: string;
  templateSlug: string;
  codigoIdentificacao: string;
  nomeInstancia: string;
  tiposContexto: TipoIntegracao[];
  ativo: boolean;
  tenantId: string;
  /** Configurações key-value como objeto */
  valores: Record<string, string>;
}

/**
 * Opções para busca de integração
 */
export interface BuscarIntegracaoOptions {
  templateSlug: string;
  tenantId: string;
  /** Se true, retorna apenas integrações ativas (default: true) */
  apenasAtivas?: boolean;
  /** Se true, lança exceção se não encontrar (default: true) */
  throwIfNotFound?: boolean;
}

/**
 * Service para buscar configurações de integrações por tenant
 *
 * Este service é usado pelos services de integração (DbDiagnosticosService,
 * HermesPardiniService, etc) para obter as configurações específicas
 * de cada tenant do banco de dados.
 */
@Injectable()
export class IntegracaoConfigService {
  private readonly logger = new Logger(IntegracaoConfigService.name);

  constructor(
    @InjectRepository(Integracao)
    private integracaoRepository: Repository<Integracao>,
    @InjectRepository(IntegracaoConfiguracao)
    private configuracaoRepository: Repository<IntegracaoConfiguracao>,
  ) {}

  /**
   * Busca configurações de uma integração por templateSlug e tenantId
   *
   * @example
   * ```typescript
   * const config = await this.integracaoConfigService.buscarConfiguracao({
   *   templateSlug: 'db-diagnosticos',
   *   tenantId: 'tenant-uuid',
   * });
   *
   * // Usar os valores
   * const codigoApoiado = config.valores.codigo_apoiado;
   * ```
   */
  async buscarConfiguracao(
    options: BuscarIntegracaoOptions,
  ): Promise<IntegracaoConfig | null> {
    const {
      templateSlug,
      tenantId,
      apenasAtivas = true,
      throwIfNotFound = true,
    } = options;

    this.logger.debug(
      `Buscando configuração: template=${templateSlug}, tenant=${tenantId}`,
    );

    const whereClause: any = {
      templateSlug,
      tenantId,
    };

    if (apenasAtivas) {
      whereClause.ativo = true;
    }

    const integracao = await this.integracaoRepository.findOne({
      where: whereClause,
      relations: ['configuracoes'],
    });

    if (!integracao) {
      if (throwIfNotFound) {
        throw new NotFoundException(
          `Integração '${templateSlug}' não encontrada para o tenant ${tenantId}`,
        );
      }
      return null;
    }

    // Converte configurações para objeto key-value
    const valores: Record<string, string> = {};
    for (const config of integracao.configuracoes || []) {
      valores[config.chave] = config.valor;
    }

    return {
      integracaoId: integracao.id,
      templateSlug: integracao.templateSlug,
      codigoIdentificacao: integracao.codigoIdentificacao,
      nomeInstancia: integracao.nomeInstancia,
      tiposContexto: integracao.tiposContexto,
      ativo: integracao.ativo,
      tenantId: integracao.tenantId,
      valores,
    };
  }

  /**
   * Busca todas as integrações de um tipo para um tenant
   *
   * @example
   * ```typescript
   * const labs = await this.integracaoConfigService.buscarPorTipo({
   *   tipo: TipoIntegracao.LABORATORIO_APOIO,
   *   tenantId: 'tenant-uuid',
   * });
   * ```
   */
  async buscarPorTipo(options: {
    tipo: TipoIntegracao;
    tenantId: string;
    apenasAtivas?: boolean;
  }): Promise<IntegracaoConfig[]> {
    const { tipo, tenantId, apenasAtivas = true } = options;

    this.logger.debug(
      `Buscando integrações por tipo: tipo=${tipo}, tenant=${tenantId}`,
    );

    let query = this.integracaoRepository
      .createQueryBuilder('integracao')
      .leftJoinAndSelect('integracao.configuracoes', 'configuracoes')
      .where(':tipo = ANY(integracao.tipos_contexto)', { tipo })
      .andWhere('integracao.tenant_id = :tenantId', { tenantId });

    if (apenasAtivas) {
      query = query.andWhere('integracao.ativo = true');
    }

    const integracoes = await query.getMany();

    return integracoes.map((integracao) => {
      const valores: Record<string, string> = {};
      for (const config of integracao.configuracoes || []) {
        valores[config.chave] = config.valor;
      }

      return {
        integracaoId: integracao.id,
        templateSlug: integracao.templateSlug,
        codigoIdentificacao: integracao.codigoIdentificacao,
        nomeInstancia: integracao.nomeInstancia,
        tiposContexto: integracao.tiposContexto,
        ativo: integracao.ativo,
        tenantId: integracao.tenantId,
        valores,
      };
    });
  }

  /**
   * Busca um valor específico de configuração
   *
   * @example
   * ```typescript
   * const senha = await this.integracaoConfigService.buscarValor({
   *   templateSlug: 'db-diagnosticos',
   *   tenantId: 'tenant-uuid',
   *   chave: 'senha_integracao',
   *   valorPadrao: '',
   * });
   * ```
   */
  async buscarValor(options: {
    templateSlug: string;
    tenantId: string;
    chave: string;
    valorPadrao?: string;
  }): Promise<string> {
    const { templateSlug, tenantId, chave, valorPadrao = '' } = options;

    const config = await this.buscarConfiguracao({
      templateSlug,
      tenantId,
      throwIfNotFound: false,
    });

    if (!config) {
      return valorPadrao;
    }

    return config.valores[chave] ?? valorPadrao;
  }

  /**
   * Verifica se uma integração existe e está ativa para um tenant
   */
  async integracaoExiste(options: {
    templateSlug: string;
    tenantId: string;
  }): Promise<boolean> {
    const { templateSlug, tenantId } = options;

    const count = await this.integracaoRepository.count({
      where: {
        templateSlug,
        tenantId,
        ativo: true,
      },
    });

    return count > 0;
  }

  /**
   * Lista todos os templates de integração disponíveis para um tenant
   */
  async listarTemplatesDisponiveis(tenantId: string): Promise<string[]> {
    const integracoes = await this.integracaoRepository.find({
      where: {
        tenantId,
        ativo: true,
      },
      select: ['templateSlug'],
    });

    return [...new Set(integracoes.map((i) => i.templateSlug))];
  }
}
