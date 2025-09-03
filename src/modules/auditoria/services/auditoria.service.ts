import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAuditoria, TipoOperacao, ModuloOperacao } from '../entities/log-auditoria.entity';
import { HistoricoAlteracao } from '../entities/historico-alteracao.entity';

export interface DadosAuditoria {
  usuarioId?: string;
  modulo: ModuloOperacao;
  tabela: string;
  registroId?: string;
  tipoOperacao: TipoOperacao;
  valoresAnteriores?: any;
  valoresNovos?: any;
  ipAddress: string;
  userAgent?: string;
  endpoint?: string;
  metodoHttp?: string;
  statusHttp?: number;
  tempoExecucaoMs?: number;
  observacoes?: string;
  metadadosAdicionais?: any;
  sessaoId?: string;
  operacaoSensivel?: boolean;
  falhaOperacao?: boolean;
  erroDetalhes?: string;
}

export interface DadosHistoricoAlteracao {
  usuarioId?: string;
  tabelaOrigem: string;
  registroId: string;
  campoAlterado: string;
  valorAnterior?: string;
  valorNovo?: string;
  tipoCampo: string;
  motivoAlteracao?: string;
  ipAddress: string;
  userAgent?: string;
  alteracaoCritica?: boolean;
  requerAprovacao?: boolean;
  contextoAdicional?: any;
}

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(LogAuditoria)
    private logAuditoriaRepository: Repository<LogAuditoria>,
    @InjectRepository(HistoricoAlteracao)
    private historicoAlteracaoRepository: Repository<HistoricoAlteracao>,
  ) {}

  async registrarLog(dados: DadosAuditoria): Promise<LogAuditoria> {
    const log = this.logAuditoriaRepository.create({
      usuario_id: dados.usuarioId,
      modulo: dados.modulo,
      tabela: dados.tabela,
      registro_id: dados.registroId,
      tipo_operacao: dados.tipoOperacao,
      valores_anteriores: dados.valoresAnteriores,
      valores_novos: dados.valoresNovos,
      valores_alterados: this.calcularValoresAlterados(
        dados.valoresAnteriores,
        dados.valoresNovos,
      ),
      ip_address: dados.ipAddress,
      user_agent: dados.userAgent,
      endpoint: dados.endpoint,
      metodo_http: dados.metodoHttp,
      status_http: dados.statusHttp,
      tempo_execucao_ms: dados.tempoExecucaoMs,
      observacoes: dados.observacoes,
      metadados_adicionais: dados.metadadosAdicionais,
      sessao_id: dados.sessaoId,
      operacao_sensivel: dados.operacaoSensivel || false,
      falha_operacao: dados.falhaOperacao || false,
      erro_detalhes: dados.erroDetalhes,
    });

    return await this.logAuditoriaRepository.save(log);
  }

  async registrarHistoricoAlteracao(
    dados: DadosHistoricoAlteracao,
  ): Promise<HistoricoAlteracao> {
    const historico = this.historicoAlteracaoRepository.create({
      usuario_id: dados.usuarioId,
      tabela_origem: dados.tabelaOrigem,
      registro_id: dados.registroId,
      campo_alterado: dados.campoAlterado,
      valor_anterior: dados.valorAnterior,
      valor_novo: dados.valorNovo,
      tipo_campo: dados.tipoCampo,
      motivo_alteracao: dados.motivoAlteracao,
      ip_address: dados.ipAddress,
      user_agent: dados.userAgent,
      alteracao_critica: dados.alteracaoCritica || false,
      requer_aprovacao: dados.requerAprovacao || false,
      contexto_adicional: dados.contextoAdicional,
    });

    return await this.historicoAlteracaoRepository.save(historico);
  }

  async registrarAlteracaoCompleta(
    valoresAnteriores: any,
    valoresNovos: any,
    dadosBase: Omit<DadosHistoricoAlteracao, 'campoAlterado' | 'valorAnterior' | 'valorNovo' | 'tipoCampo'>,
  ): Promise<HistoricoAlteracao[]> {
    const historicos: HistoricoAlteracao[] = [];

    if (!valoresAnteriores || !valoresNovos) {
      return historicos;
    }

    for (const campo in valoresNovos) {
      const valorAnterior = valoresAnteriores[campo];
      const valorNovo = valoresNovos[campo];

      if (valorAnterior !== valorNovo) {
        const historico = await this.registrarHistoricoAlteracao({
          ...dadosBase,
          campoAlterado: campo,
          valorAnterior: this.converterParaString(valorAnterior),
          valorNovo: this.converterParaString(valorNovo),
          tipoCampo: typeof valorNovo,
        });

        historicos.push(historico);
      }
    }

    return historicos;
  }

  async obterLogsAuditoria(
    filtros: {
      usuarioId?: string;
      modulo?: ModuloOperacao;
      tabela?: string;
      tipoOperacao?: TipoOperacao;
      dataInicio?: Date;
      dataFim?: Date;
      operacaoSensivel?: boolean;
      falhaOperacao?: boolean;
    },
    paginacao: { page: number; limit: number } = { page: 1, limit: 50 },
  ) {
    const query = this.logAuditoriaRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.usuario', 'usuario')
      .orderBy('log.criado_em', 'DESC');

    if (filtros.usuarioId) {
      query.andWhere('log.usuario_id = :usuarioId', { usuarioId: filtros.usuarioId });
    }

    if (filtros.modulo) {
      query.andWhere('log.modulo = :modulo', { modulo: filtros.modulo });
    }

    if (filtros.tabela) {
      query.andWhere('log.tabela = :tabela', { tabela: filtros.tabela });
    }

    if (filtros.tipoOperacao) {
      query.andWhere('log.tipo_operacao = :tipoOperacao', { tipoOperacao: filtros.tipoOperacao });
    }

    if (filtros.dataInicio) {
      query.andWhere('log.criado_em >= :dataInicio', { dataInicio: filtros.dataInicio });
    }

    if (filtros.dataFim) {
      query.andWhere('log.criado_em <= :dataFim', { dataFim: filtros.dataFim });
    }

    if (filtros.operacaoSensivel !== undefined) {
      query.andWhere('log.operacao_sensivel = :operacaoSensivel', { operacaoSensivel: filtros.operacaoSensivel });
    }

    if (filtros.falhaOperacao !== undefined) {
      query.andWhere('log.falha_operacao = :falhaOperacao', { falhaOperacao: filtros.falhaOperacao });
    }

    const total = await query.getCount();
    const logs = await query
      .skip((paginacao.page - 1) * paginacao.limit)
      .take(paginacao.limit)
      .getMany();

    return {
      dados: logs,
      total,
      pagina: paginacao.page,
      limite: paginacao.limit,
      totalPaginas: Math.ceil(total / paginacao.limit),
    };
  }

  async obterHistoricoAlteracoes(
    filtros: {
      usuarioId?: string;
      tabelaOrigem?: string;
      registroId?: string;
      campoAlterado?: string;
      dataInicio?: Date;
      dataFim?: Date;
      alteracaoCritica?: boolean;
      requerAprovacao?: boolean;
      aprovada?: boolean;
    },
    paginacao: { page: number; limit: number } = { page: 1, limit: 50 },
  ) {
    const query = this.historicoAlteracaoRepository.createQueryBuilder('historico')
      .leftJoinAndSelect('historico.usuario', 'usuario')
      .leftJoinAndSelect('historico.aprovador', 'aprovador')
      .orderBy('historico.criado_em', 'DESC');

    if (filtros.usuarioId) {
      query.andWhere('historico.usuario_id = :usuarioId', { usuarioId: filtros.usuarioId });
    }

    if (filtros.tabelaOrigem) {
      query.andWhere('historico.tabela_origem = :tabelaOrigem', { tabelaOrigem: filtros.tabelaOrigem });
    }

    if (filtros.registroId) {
      query.andWhere('historico.registro_id = :registroId', { registroId: filtros.registroId });
    }

    if (filtros.campoAlterado) {
      query.andWhere('historico.campo_alterado = :campoAlterado', { campoAlterado: filtros.campoAlterado });
    }

    if (filtros.dataInicio) {
      query.andWhere('historico.criado_em >= :dataInicio', { dataInicio: filtros.dataInicio });
    }

    if (filtros.dataFim) {
      query.andWhere('historico.criado_em <= :dataFim', { dataFim: filtros.dataFim });
    }

    if (filtros.alteracaoCritica !== undefined) {
      query.andWhere('historico.alteracao_critica = :alteracaoCritica', { alteracaoCritica: filtros.alteracaoCritica });
    }

    if (filtros.requerAprovacao !== undefined) {
      query.andWhere('historico.requer_aprovacao = :requerAprovacao', { requerAprovacao: filtros.requerAprovacao });
    }

    if (filtros.aprovada !== undefined) {
      query.andWhere('historico.aprovada = :aprovada', { aprovada: filtros.aprovada });
    }

    const total = await query.getCount();
    const historicos = await query
      .skip((paginacao.page - 1) * paginacao.limit)
      .take(paginacao.limit)
      .getMany();

    return {
      dados: historicos,
      total,
      pagina: paginacao.page,
      limite: paginacao.limit,
      totalPaginas: Math.ceil(total / paginacao.limit),
    };
  }

  private calcularValoresAlterados(valoresAnteriores: any, valoresNovos: any): any {
    if (!valoresAnteriores || !valoresNovos) {
      return null;
    }

    const alterados: any = {};

    for (const campo in valoresNovos) {
      if (valoresAnteriores[campo] !== valoresNovos[campo]) {
        alterados[campo] = {
          anterior: valoresAnteriores[campo],
          novo: valoresNovos[campo],
        };
      }
    }

    return Object.keys(alterados).length > 0 ? alterados : null;
  }

  private converterParaString(valor: any): string {
    if (valor === null || valor === undefined) {
      return null;
    }

    if (typeof valor === 'object') {
      return JSON.stringify(valor);
    }

    return String(valor);
  }
}