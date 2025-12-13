import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as soap from 'soap';
import { SoapClientService } from '../../soap/soap-client.service';
import {
  DbDiagnosticosConfig,
  DbDiagnosticosResponse,
  DbDiagnosticosAtendimento,
  DbDiagnosticosPedido,
  DbDiagnosticosRecebeAtendimentoResult,
  DbDiagnosticosStatusAtendimento,
  DbDiagnosticosLaudo,
  DbDiagnosticosLaudoPdf,
  DbDiagnosticosAmostraEtiqueta,
  DbDiagnosticosProcedimentoPendente,
  DbDiagnosticosRequisicaoEnviada,
} from './interfaces/db-diagnosticos.interface';
import {
  EnviarPedidoDbDto,
  ConsultarStatusDbDto,
  ConsultarLaudoDbDto,
  ConsultarLaudoPeriodoDbDto,
  ConsultarLaudoPdfDbDto,
  ReimprimirEtiquetasDbDto,
  ConsultarPendenciasDbDto,
  GerarEtiquetaRecoletaDbDto,
  ConsultarLoteResultadosDbDto,
  RelatorioRequisicoesDbDto,
  CancelarExameDbDto,
  PrioridadeDb,
  TipoCancelamentoDb,
} from './dto/db-diagnosticos.dto';
import { IntegracaoConfigService } from '../../../atendimento/integracoes/services/integracao-config.service';
import {
  parseDbDiagnosticosConfig,
  DbDiagnosticosConfigValues,
} from '../../../atendimento/integracoes/schemas/db-diagnosticos.schema';

/**
 * Cache de clientes SOAP por tenant
 */
interface TenantSoapClient {
  client: soap.Client;
  config: DbDiagnosticosConfigValues;
  createdAt: Date;
}

@Injectable()
export class DbDiagnosticosService {
  private readonly logger = new Logger(DbDiagnosticosService.name);

  /** Cache de clientes SOAP por tenant (tenantId -> client) */
  private clientCache: Map<string, TenantSoapClient> = new Map();

  /** Tempo de vida do cache em ms (30 minutos) */
  private readonly CACHE_TTL_MS = 30 * 60 * 1000;

  /** Configuração fallback (do .env) para quando não há tenant */
  private fallbackConfig: DbDiagnosticosConfig;

  constructor(
    private readonly soapClient: SoapClientService,
    private readonly configService: ConfigService,
    private readonly integracaoConfigService: IntegracaoConfigService,
  ) {
    // Configuração fallback do .env (para desenvolvimento/testes)
    this.fallbackConfig = {
      codigoApoiado: this.configService.get<string>(
        'DB_DIAGNOSTICOS_CODIGO_APOIADO',
        '12588',
      ),
      codigoSenhaIntegracao: this.configService.get<string>(
        'DB_DIAGNOSTICOS_SENHA',
        'malore62',
      ),
      wsdlUrl: this.configService.get<string>(
        'DB_DIAGNOSTICOS_WSDL_URL',
        'https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl',
      ),
      timeout: this.configService.get<number>('DB_DIAGNOSTICOS_TIMEOUT', 60000),
    };
  }

  /**
   * Obtém configuração para um tenant específico
   * Se tenantId não fornecido, usa config do .env (fallback)
   */
  private async getConfigForTenant(
    tenantId?: string,
  ): Promise<DbDiagnosticosConfigValues> {
    if (!tenantId) {
      // Fallback para config do .env
      return {
        codigoApoiado: this.fallbackConfig.codigoApoiado,
        senhaIntegracao: this.fallbackConfig.codigoSenhaIntegracao,
        ambiente: 'producao',
        wsdlUrl: this.fallbackConfig.wsdlUrl,
        timeout: this.fallbackConfig.timeout,
      };
    }

    // Verifica se existe no cache e ainda é válido
    const cached = this.clientCache.get(tenantId);
    if (cached && Date.now() - cached.createdAt.getTime() < this.CACHE_TTL_MS) {
      return cached.config;
    }

    // Busca configuração do banco
    const integracaoConfig =
      await this.integracaoConfigService.buscarConfiguracao({
        templateSlug: 'db-diagnosticos',
        tenantId,
        throwIfNotFound: false,
      });

    if (!integracaoConfig) {
      this.logger.warn(
        `Integração db-diagnosticos não configurada para tenant ${tenantId}, usando fallback`,
      );
      return {
        codigoApoiado: this.fallbackConfig.codigoApoiado,
        senhaIntegracao: this.fallbackConfig.codigoSenhaIntegracao,
        ambiente: 'producao',
        wsdlUrl: this.fallbackConfig.wsdlUrl,
        timeout: this.fallbackConfig.timeout,
      };
    }

    // Converte configurações do formato key-value para objeto tipado
    const configs = Object.entries(integracaoConfig.valores).map(
      ([chave, valor]) => ({ chave, valor }),
    );
    return parseDbDiagnosticosConfig(configs);
  }

  /**
   * Obtém ou cria o cliente SOAP para um tenant
   */
  private async getClient(tenantId?: string): Promise<{
    client: soap.Client;
    config: DbDiagnosticosConfigValues;
  }> {
    const cacheKey = tenantId || '__fallback__';

    // Verifica cache
    const cached = this.clientCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt.getTime() < this.CACHE_TTL_MS) {
      return { client: cached.client, config: cached.config };
    }

    // Obtém configuração
    const config = await this.getConfigForTenant(tenantId);

    // Cria cliente SOAP
    const client = await this.soapClient.criarCliente({
      wsdl: config.wsdlUrl,
      timeout: config.timeout,
    });

    // Armazena no cache
    this.clientCache.set(cacheKey, {
      client,
      config,
      createdAt: new Date(),
    });

    return { client, config };
  }

  /**
   * Chama um método SOAP
   */
  private async callSoapMethod<T>(
    metodo: string,
    params: any,
    tenantId?: string,
  ): Promise<T> {
    const { client } = await this.getClient(tenantId);
    const response = await this.soapClient.chamarMetodo<T>(
      client,
      metodo,
      params,
    );

    if (!response.sucesso) {
      throw new Error(response.erro || 'Erro desconhecido na chamada SOAP');
    }

    return response.dados as T;
  }

  /**
   * Método 1: RecebeAtendimento
   * Gravar pedidos e gerar etiquetas
   */
  async enviarPedido(
    dto: EnviarPedidoDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosRecebeAtendimentoResult>> {
    this.logger.log(
      `Enviando pedido: ${dto.numeroAtendimentoApoiado} com ${dto.procedimentos.length} procedimentos (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const pedido: DbDiagnosticosPedido = {
        NumeroAtendimentoApoiado: dto.numeroAtendimentoApoiado,
        ListaPacienteApoiado: {
          RGPacienteApoiado: dto.paciente.rgPacienteApoiado,
          NomePaciente: dto.paciente.nomePaciente,
          SexoPaciente: dto.paciente.sexoPaciente,
          DataHoraPaciente: dto.paciente.dataNascimento,
          NumeroCPF: dto.paciente.cpf,
          NumeroCartaoNacionalSaude: dto.paciente.cartaoNacionalSaude,
        },
        NumeroAtendimentoDBReserva: dto.numeroAtendimentoDbReserva,
        CodigoPrioridade: dto.prioridade || PrioridadeDb.ROTINA,
        DescricaoDadosClinicos: dto.dadosClinicos,
        DescricaoMedicamentos: dto.medicamentos,
        DataHoraDUM: dto.dataDum,
        Altura: dto.altura,
        Peso: dto.peso,
        UsoApoiado: dto.usoApoiado || config.usoApoiado,
        PostoColeta: dto.postoColeta || config.postoColeta,
        ListaQuestionarios: dto.questionarios?.map((q) => ({
          CodigoPerguntaQuestionario: q.codigoPergunta,
          RespostaQuestionario: q.resposta,
        })),
        ListaSolicitante: dto.solicitantes?.map((s) => ({
          NomeSolicitante: s.nomeSolicitante,
          CodigoConselho: s.codigoConselho,
          CodigoUFConselhoSolicitante: s.ufConselho,
          CodigoConselhoSolicitante: s.numeroConselho,
        })),
        ListaProcedimento: dto.procedimentos.map((p) => ({
          CodigoExameDB: p.codigoExameDb,
          DescricaoRegiaoColeta: p.descricaoRegiaoColeta,
          VolumeUrinario: p.volumeUrinario,
          IdentificacaoExameApoiado: p.identificacaoExameApoiado,
          MaterialApoiado: p.materialApoiado,
          DescricaoMaterialApoiado: p.descricaoMaterialApoiado,
          DescricaoExameApoiado: p.descricaoExameApoiado,
          CodigoMPP: p.codigoMpp,
        })),
      };

      const atendimento: DbDiagnosticosAtendimento = {
        CodigoApoiado: config.codigoApoiado,
        CodigoSenhaIntegracao: config.senhaIntegracao,
        Pedido: pedido,
      };

      const result = await this.callSoapMethod<any>(
        'RecebeAtendimento',
        { atendimento },
        tenantId,
      );

      const response = this.parseRecebeAtendimentoResponse(result);
      this.logger.log(
        `Pedido enviado com sucesso. Lote: ${response.dados?.StatusLote?.NumeroLote}`,
      );

      return {
        sucesso: true,
        dados: response.dados,
      };
    } catch (error) {
      this.logger.error(`Erro ao enviar pedido: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 2: EnviaLaudoAtendimento
   * Retornar resultado por pedido
   */
  async consultarLaudo(
    dto: ConsultarLaudoDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo>> {
    this.logger.log(
      `Consultando laudo: apoiado=${dto.numeroAtendimentoApoiado}, db=${dto.numeroAtendimentoDb} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          NumeroAtendimentoApoiado:
            dto.numeroAtendimentoApoiado || dto.numeroAtendimentoDb,
          Procedimento: '',
        },
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLaudoAtendimento',
        params,
        tenantId,
      );

      const laudo = this.parseLaudoResponse(result);

      return {
        sucesso: true,
        dados: laudo,
      };
    } catch (error) {
      this.logger.error(`Erro ao consultar laudo: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 3: EnviaLaudoAtendimentoLista
   * Retornar resultados de lista de pedidos
   */
  async consultarLaudoLista(
    numerosAtendimentoApoiado: string[],
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo[]>> {
    this.logger.log(
      `Consultando laudos em lista: ${numerosAtendimentoApoiado.length} pedidos (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          NumeroAtendimentoApoiado: numerosAtendimentoApoiado,
        },
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLaudoAtendimentoLista',
        params,
        tenantId,
      );

      const laudos = this.parseLaudoListaResponse(result);

      return {
        sucesso: true,
        dados: laudos,
      };
    } catch (error) {
      this.logger.error(`Erro ao consultar laudos em lista: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 4: EnviaLaudoAtendimentoPorPeriodo
   * Retornar resultados por período
   */
  async consultarLaudoPorPeriodo(
    dto: ConsultarLaudoPeriodoDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo[]>> {
    this.logger.log(
      `Consultando laudos por período: ${dto.dataInicio} a ${dto.dataFim} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          dtInicial: dto.dataInicio,
          dtFinal: dto.dataFim,
        },
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLaudoAtendimentoPorPeriodo',
        params,
        tenantId,
      );

      const laudos = this.parseLaudoListaResponse(result);

      return {
        sucesso: true,
        dados: laudos,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao consultar laudos por período: ${error.message}`,
      );
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 5: ConsultaStatusAtendimento
   * Consultar status do pedido
   */
  async consultarStatus(
    dto: ConsultarStatusDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosStatusAtendimento>> {
    this.logger.log(
      `Consultando status: apoiado=${dto.numeroAtendimentoApoiado}, db=${dto.numeroAtendimentoDb} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          NumeroAtendimentoApoiado:
            dto.numeroAtendimentoApoiado || dto.numeroAtendimentoDb,
          Procedimento: '',
        },
      };

      const result = await this.callSoapMethod<any>(
        'ConsultaStatusAtendimento',
        params,
        tenantId,
      );

      const status = this.parseStatusResponse(result);

      return {
        sucesso: true,
        dados: status,
      };
    } catch (error) {
      this.logger.error(`Erro ao consultar status: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 6: EnviaAmostras
   * Reimprimir etiquetas
   */
  async reimprimirEtiquetas(
    dto: ReimprimirEtiquetasDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosAmostraEtiqueta[]>> {
    this.logger.log(
      `Reimprimindo etiquetas: apoiado=${dto.numeroAtendimentoApoiado}, db=${dto.numeroAtendimentoDb} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          NumeroAtendimentoApoiado:
            dto.numeroAtendimentoApoiado || dto.numeroAtendimentoDb,
        },
      };

      const result = await this.callSoapMethod<any>(
        'EnviaAmostras',
        params,
        tenantId,
      );

      const etiquetas = this.parseEtiquetasResponse(result);

      return {
        sucesso: true,
        dados: etiquetas,
      };
    } catch (error) {
      this.logger.error(`Erro ao reimprimir etiquetas: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 7: ListaProcedimentosPendentes
   * Listar procedimentos pendentes
   */
  async consultarPendencias(
    dto: ConsultarPendenciasDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosProcedimentoPendente[]>> {
    this.logger.log(
      `Consultando pendências: ${dto.dataInicio || 'sem'} a ${dto.dataFim || 'sem'} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          dtInicial: dto.dataInicio,
          dtFinal: dto.dataFim,
        },
      };

      const result = await this.callSoapMethod<any>(
        'ListaProcedimentosPendentes',
        params,
        tenantId,
      );

      const pendencias = this.parsePendenciasResponse(result);

      return {
        sucesso: true,
        dados: pendencias,
      };
    } catch (error) {
      this.logger.error(`Erro ao consultar pendências: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 8: EnviaAmostrasProcedimentosPendentes
   * Gerar etiquetas para recoletas
   */
  async gerarEtiquetaRecoleta(
    dto: GerarEtiquetaRecoletaDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosAmostraEtiqueta[]>> {
    this.logger.log(
      `Gerando etiqueta recoleta: ${dto.numeroAtendimentoDb} - ${dto.codigoExameDb} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          Amostras: {
            NumeroAtendimentoApoiado: dto.numeroAtendimentoApoiado,
            NumeroAtendimentoDB: dto.numeroAtendimentoDb,
            ListaProcedimentoMPP: [
              {
                CodigoExameDB: dto.codigoExameDb,
                SequenciaExameDB: dto.sequenciaExameDb || 1,
                Status: dto.status || 'MPP',
              },
            ],
          },
        },
      };

      const result = await this.callSoapMethod<any>(
        'EnviaAmostrasProcedimentosPendentes',
        params,
        tenantId,
      );

      const etiquetas = this.parseEtiquetasResponse(result);

      return {
        sucesso: true,
        dados: etiquetas,
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar etiqueta recoleta: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 9: EnviaLoteResultados
   * Retornar lote de resultados
   */
  async consultarLoteResultados(
    dto: ConsultarLoteResultadosDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo[]>> {
    this.logger.log(
      `Consultando lote de resultados: ${dto.numeroLote} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          LoteResultado: dto.numeroLote,
        },
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLoteResultados',
        params,
        tenantId,
      );

      const laudos = this.parseLaudoListaResponse(result);

      return {
        sucesso: true,
        dados: laudos,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao consultar lote de resultados: ${error.message}`,
      );
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 10: EnviaResultadoBase64
   * Retornar link do laudo PDF
   */
  async consultarLaudoPdf(
    dto: ConsultarLaudoPdfDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudoPdf>> {
    this.logger.log(
      `Consultando laudo PDF: ${dto.numeroAtendimentoDb} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        CodigoApoiado: config.codigoApoiado,
        CodigoSenhaIntegracao: config.senhaIntegracao,
        NumeroAtendimentoDB: dto.numeroAtendimentoDb,
      };

      const result = await this.callSoapMethod<any>(
        'EnviaResultadoBase64',
        params,
        tenantId,
      );

      const laudoPdf = this.parseLaudoPdfResponse(result);

      return {
        sucesso: true,
        dados: laudoPdf,
      };
    } catch (error) {
      this.logger.error(`Erro ao consultar laudo PDF: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Método 11: RelatorioRequisicoesEnviadas
   * Relatório de envios
   */
  async consultarRelatorioRequisicoes(
    dto: RelatorioRequisicoesDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosRequisicaoEnviada[]>> {
    this.logger.log(
      `Consultando relatório de requisições: ${dto.dataInicio} a ${dto.dataFim} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          DataInicial: dto.dataInicio,
          DataFinal: dto.dataFim,
        },
      };

      const result = await this.callSoapMethod<any>(
        'RelatorioRequisicoesEnviadas',
        params,
        tenantId,
      );

      const requisicoes = this.parseRelatorioResponse(result);

      return {
        sucesso: true,
        dados: requisicoes,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao consultar relatório de requisições: ${error.message}`,
      );
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Cancelar exame via CodigoMPP
   * Usa RecebeAtendimento com CodigoMPP preenchido
   */
  async cancelarExame(
    dto: CancelarExameDbDto,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosRecebeAtendimentoResult>> {
    this.logger.log(
      `Cancelando exame: ${dto.codigoExameDb} do pedido ${dto.numeroAtendimentoApoiado} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const pedido: DbDiagnosticosPedido = {
        NumeroAtendimentoApoiado: dto.numeroAtendimentoApoiado,
        ListaPacienteApoiado: dto.paciente
          ? {
              RGPacienteApoiado: dto.paciente.rgPacienteApoiado,
              NomePaciente: dto.paciente.nomePaciente,
              SexoPaciente: dto.paciente.sexoPaciente,
              DataHoraPaciente: dto.paciente.dataNascimento,
              NumeroCPF: dto.paciente.cpf,
              NumeroCartaoNacionalSaude: dto.paciente.cartaoNacionalSaude,
            }
          : {
              NomePaciente: 'CANCELAMENTO',
              SexoPaciente: 'M',
              DataHoraPaciente: '1900-01-01',
            },
        ListaSolicitante: dto.solicitantes?.map((s) => ({
          NomeSolicitante: s.nomeSolicitante,
          CodigoConselho: s.codigoConselho,
          CodigoUFConselhoSolicitante: s.ufConselho,
          CodigoConselhoSolicitante: s.numeroConselho,
        })),
        ListaProcedimento: [
          {
            CodigoExameDB: dto.codigoExameDb,
            CodigoMPP: dto.tipoCancelamento,
          },
        ],
      };

      const atendimento: DbDiagnosticosAtendimento = {
        CodigoApoiado: config.codigoApoiado,
        CodigoSenhaIntegracao: config.senhaIntegracao,
        Pedido: pedido,
      };

      const result = await this.callSoapMethod<any>(
        'RecebeAtendimento',
        { atendimento },
        tenantId,
      );

      const response = this.parseRecebeAtendimentoResponse(result);
      const tipoMsg =
        dto.tipoCancelamento === TipoCancelamentoDb.TEMPORARIO
          ? 'temporariamente'
          : 'definitivamente';
      this.logger.log(`Exame ${dto.codigoExameDb} cancelado ${tipoMsg}`);

      return {
        sucesso: true,
        dados: response.dados,
      };
    } catch (error) {
      this.logger.error(`Erro ao cancelar exame: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  // ============================================
  // MÉTODOS DE PARSE
  // ============================================

  private parseRecebeAtendimentoResponse(result: any): {
    dados?: DbDiagnosticosRecebeAtendimentoResult;
  } {
    const res = result?.RecebeAtendimentoResult;
    if (!res) return {};

    const statusLote = res?.StatusLote?.ct_StatusLote_v2;
    const confirmacao =
      res?.Confirmacao?.ConfirmacaoPedidov2?.ct_ConfirmacaoPedidoEtiqueta_v2;

    return {
      dados: {
        StatusLote: statusLote
          ? {
              NumeroLote: statusLote.NumeroLote,
              ArquivoSolicitacaoPedidos: statusLote.ArquivoSolicitacaoPedidos,
              Pedidos: this.parseArray(
                statusLote.Pedidos?.ct_StatusLotePedido_v2,
              ).map((p: any) => ({
                NomePaciente: p.NomePaciente,
                NumeroAtendimentoDB: p.NumeroAtendimentoDB,
                NumeroAtendimentoApoiado: p.NumeroAtendimentoApoiado,
                PostoColeta: p.PostoColeta,
                Procedimentos: this.parseArray(
                  p.Procedimentos?.ct_StatusLoteProcedimento_v2,
                ).map((proc: any) => ({
                  CodigoExameDB: proc.CodigoExameDB,
                  IdentificacaoExameApoiado: proc.IdentificacaoExameApoiado,
                  Material: proc.Material,
                  DescricaoExame: proc.DescricaoExame,
                })),
              })),
              DataHoraGravacao: statusLote.DataHoraGravacao,
            }
          : null,
        Confirmacao: confirmacao
          ? {
              NumeroAtendimentoApoiado: confirmacao.NumeroAtendimentoApoiado,
              Status: confirmacao.Status,
              NumeroAtendimentoDB: confirmacao.NumeroAtendimentoDB,
              Amostras: this.parseArray(
                confirmacao.Amostras?.ct_AmostraEtiqueta_v2,
              ).map((a: any) => this.parseAmostra(a)),
            }
          : null,
      },
    };
  }

  private parseAmostra(a: any): DbDiagnosticosAmostraEtiqueta {
    return {
      NumeroAmostra: a.NumeroAmostra,
      Exames: a.Exames,
      ContadorAmostra: a.ContadorAmostra,
      RGPacienteDB: a.RGPacienteDB,
      NomePaciente: a.NomePaciente,
      MeioColeta: a.MeioColeta,
      GrupoInterface: a.GrupoInterface,
      Material: a.Material,
      RegiaoColeta: a.RegiaoColeta,
      Volume: parseFloat(a.Volume) || 0,
      Prioridade: a.Prioridade,
      TipoCodigoBarras: a.TipoCodigoBarras,
      CodigoInstrumento: a.CodigoInstrumento,
      Origem: a.Origem,
      FlagAmostraMae: a.FlagAmostraMae === 'true',
      TextoAmostraMae: a.TextoAmostraMae,
      DataSistema: a.DataSistema,
      EtiquetaAmostra: a.EtiquetaAmostra,
    };
  }

  private parseLaudoResponse(result: any): DbDiagnosticosLaudo | null {
    const res = result?.EnviaLaudoAtendimentoResult;
    if (!res) return null;

    return {
      NumeroAtendimentoDB: res.NumeroAtendimentoDB,
      NumeroAtendimentoApoiado: res.NumeroAtendimentoApoiado,
      NomePaciente: res.NomePaciente,
      DataNascimento: res.DataNascimento,
      SexoPaciente: res.SexoPaciente,
      DataColeta: res.DataColeta,
      DataLiberacao: res.DataLiberacao,
      Exames: this.parseArray(res.Exames?.ct_ResultadoExame).map((e: any) => ({
        CodigoExameDB: e.CodigoExameDB,
        DescricaoExame: e.DescricaoExame,
        Material: e.Material,
        DataHoraLiberacao: e.DataHoraLiberacao,
        Resultado: e.Resultado,
        UnidadeMedida: e.UnidadeMedida,
        ValorReferencia: e.ValorReferencia,
        Observacao: e.Observacao,
      })),
    };
  }

  private parseLaudoListaResponse(result: any): DbDiagnosticosLaudo[] {
    const res =
      result?.EnviaLaudoAtendimentoListaResult ||
      result?.EnviaLaudoAtendimentoPorPeriodoResult ||
      result?.EnviaLoteResultadosResult;
    if (!res) return [];

    return this.parseArray(res.Laudos?.ct_Laudo).map((l: any) =>
      this.parseLaudoResponse({ EnviaLaudoAtendimentoResult: l }),
    );
  }

  private parseStatusResponse(
    result: any,
  ): DbDiagnosticosStatusAtendimento | null {
    const res = result?.ConsultaStatusAtendimentoResult;
    if (!res) return null;

    return {
      NumeroAtendimentoDB: res.NumeroAtendimentoDB,
      NumeroAtendimentoApoiado: res.NumeroAtendimentoApoiado,
      NomePaciente: res.NomePaciente,
      Status: res.Status,
      DataHoraStatus: res.DataHoraStatus,
      Exames: this.parseArray(res.Exames?.ct_StatusExame).map((e: any) => ({
        CodigoExameDB: e.CodigoExameDB,
        DescricaoExame: e.DescricaoExame,
        Status: e.Status,
        DataHoraStatus: e.DataHoraStatus,
        Material: e.Material,
      })),
    };
  }

  private parseEtiquetasResponse(result: any): DbDiagnosticosAmostraEtiqueta[] {
    const res =
      result?.EnviaAmostrasResult ||
      result?.EnviaAmostrasProcedimentosPendentesResult;
    if (!res) return [];

    return this.parseArray(res.Amostras?.ct_AmostraEtiqueta_v2).map((a: any) =>
      this.parseAmostra(a),
    );
  }

  private parsePendenciasResponse(
    result: any,
  ): DbDiagnosticosProcedimentoPendente[] {
    const res = result?.ListaProcedimentosPendentesResult;
    if (!res) return [];

    return this.parseArray(res.Pendencias?.ct_ProcedimentoPendente).map(
      (p: any) => ({
        NumeroAtendimentoDB: p.NumeroAtendimentoDB,
        NumeroAtendimentoApoiado: p.NumeroAtendimentoApoiado,
        NomePaciente: p.NomePaciente,
        CodigoExameDB: p.CodigoExameDB,
        DescricaoExame: p.DescricaoExame,
        Material: p.Material,
        MotivoPendencia: p.MotivoPendencia,
        DataPendencia: p.DataPendencia,
      }),
    );
  }

  private parseLaudoPdfResponse(result: any): DbDiagnosticosLaudoPdf | null {
    const res = result?.EnviaResultadoBase64Result;
    if (!res) return null;

    return {
      NumeroAtendimentoDB: res.NumeroAtendimentoDB,
      LinkLaudo: res.LinkLaudo,
      LaudoBase64: res.LaudoBase64,
    };
  }

  private parseRelatorioResponse(
    result: any,
  ): DbDiagnosticosRequisicaoEnviada[] {
    const res = result?.RelatorioRequisicoesEnviadasResult;
    if (!res) return [];

    return this.parseArray(res.Requisicoes?.ct_RequisicaoEnviada).map(
      (r: any) => ({
        NumeroAtendimentoDB: r.NumeroAtendimentoDB,
        NumeroAtendimentoApoiado: r.NumeroAtendimentoApoiado,
        NomePaciente: r.NomePaciente,
        DataEnvio: r.DataEnvio,
        Status: r.Status,
        QuantidadeExames: parseInt(r.QuantidadeExames) || 0,
      }),
    );
  }

  private parseArray(value: any): any[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  /**
   * Verifica saúde da integração
   */
  async healthCheck(tenantId?: string): Promise<{
    sucesso: boolean;
    status: string;
    endpoint: string;
    codigoApoiado: string;
    tenantId?: string;
    detalhes?: any;
    erro?: string;
  }> {
    try {
      const config = await this.getConfigForTenant(tenantId);

      // Verificar se configuração está presente
      if (!config.codigoApoiado || !config.senhaIntegracao) {
        return {
          sucesso: false,
          status: 'configuracao_incompleta',
          endpoint: config.wsdlUrl,
          codigoApoiado: config.codigoApoiado || 'não configurado',
          tenantId,
          erro: 'Credenciais não configuradas',
        };
      }

      // Tentar criar cliente SOAP
      const { client } = await this.getClient(tenantId);

      // Obter descrição do WSDL para verificar conexão
      const descricao = client.describe();
      const servicos = Object.keys(descricao);

      return {
        sucesso: true,
        status: 'conectado',
        endpoint: config.wsdlUrl,
        codigoApoiado: config.codigoApoiado,
        tenantId,
        detalhes: {
          servicosDisponiveis: servicos,
          timeout: config.timeout,
          ambiente: config.ambiente,
        },
      };
    } catch (error) {
      this.logger.error(`Health check falhou: ${error.message}`);
      return {
        sucesso: false,
        status: 'erro_conexao',
        endpoint: this.fallbackConfig.wsdlUrl,
        codigoApoiado: this.fallbackConfig.codigoApoiado,
        tenantId,
        erro: error.message,
      };
    }
  }

  /**
   * Descreve o WSDL para debug
   */
  async describeWsdl(tenantId?: string): Promise<any> {
    try {
      const { client } = await this.getClient(tenantId);
      return client.describe();
    } catch (error) {
      this.logger.error(`Erro ao descrever WSDL: ${error.message}`);
      return { erro: error.message };
    }
  }

  /**
   * Busca procedimentos no DB Diagnósticos
   * Útil para validar conexão e credenciais
   */
  async buscarProcedimentos(
    codigoProcedimento?: string,
    nomeProcedimento?: string,
    tenantId?: string,
  ): Promise<DbDiagnosticosResponse<any>> {
    this.logger.log(
      `Buscando procedimentos: codigo=${codigoProcedimento || '*'}, nome=${nomeProcedimento || '*'} (tenant: ${tenantId || 'fallback'})`,
    );

    try {
      const config = await this.getConfigForTenant(tenantId);

      const params = {
        request: {
          CodigoApoiado: config.codigoApoiado,
          CodigoSenhaIntegracao: config.senhaIntegracao,
          CodigoProcedimento: codigoProcedimento || '',
          NomeProcedimento: nomeProcedimento || '',
        },
      };

      const result = await this.callSoapMethod<any>(
        'BuscaProcedimentos',
        params,
        tenantId,
      );

      return {
        sucesso: true,
        dados: result,
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar procedimentos: ${error.message}`);
      return {
        sucesso: false,
        erro: error.message,
      };
    }
  }

  /**
   * Limpa cache de clientes SOAP (útil após atualização de credenciais)
   */
  clearCache(tenantId?: string): void {
    if (tenantId) {
      this.clientCache.delete(tenantId);
      this.logger.log(`Cache limpo para tenant ${tenantId}`);
    } else {
      this.clientCache.clear();
      this.logger.log('Cache de todos os tenants limpo');
    }
  }
}
