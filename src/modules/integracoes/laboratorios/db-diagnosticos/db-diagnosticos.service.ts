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

@Injectable()
export class DbDiagnosticosService {
  private readonly logger = new Logger(DbDiagnosticosService.name);
  private config: DbDiagnosticosConfig;
  private soapClientInstance: soap.Client | null = null;

  constructor(
    private readonly soapClient: SoapClientService,
    private readonly configService: ConfigService,
  ) {
    this.config = {
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
   * Obtém ou cria o cliente SOAP
   */
  private async getClient(): Promise<soap.Client> {
    if (!this.soapClientInstance) {
      this.soapClientInstance = await this.soapClient.criarCliente({
        wsdl: this.config.wsdlUrl,
        timeout: this.config.timeout,
      });
    }
    return this.soapClientInstance;
  }

  /**
   * Chama um método SOAP
   */
  private async callSoapMethod<T>(metodo: string, params: any): Promise<T> {
    const client = await this.getClient();
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosRecebeAtendimentoResult>> {
    this.logger.log(
      `Enviando pedido: ${dto.numeroAtendimentoApoiado} com ${dto.procedimentos.length} procedimentos`,
    );

    try {
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
        UsoApoiado: dto.usoApoiado,
        PostoColeta: dto.postoColeta,
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
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        Pedido: pedido,
      };

      const result = await this.callSoapMethod<any>('RecebeAtendimento', {
        atendimento,
      });

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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo>> {
    this.logger.log(
      `Consultando laudo: apoiado=${dto.numeroAtendimentoApoiado}, db=${dto.numeroAtendimentoDb}`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        NumeroAtendimentoApoiado: dto.numeroAtendimentoApoiado,
        NumeroAtendimentoDB: dto.numeroAtendimentoDb,
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLaudoAtendimento',
        params,
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
    numerosAtendimentoDb: string[],
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo[]>> {
    this.logger.log(
      `Consultando laudos em lista: ${numerosAtendimentoDb.length} pedidos`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        ListaNumeroAtendimentoDB: numerosAtendimentoDb,
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLaudoAtendimentoLista',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo[]>> {
    this.logger.log(
      `Consultando laudos por período: ${dto.dataInicio} a ${dto.dataFim}`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        DataInicio: dto.dataInicio,
        DataFim: dto.dataFim,
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLaudoAtendimentoPorPeriodo',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosStatusAtendimento>> {
    this.logger.log(
      `Consultando status: apoiado=${dto.numeroAtendimentoApoiado}, db=${dto.numeroAtendimentoDb}`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        NumeroAtendimentoApoiado: dto.numeroAtendimentoApoiado,
        NumeroAtendimentoDB: dto.numeroAtendimentoDb,
      };

      const result = await this.callSoapMethod<any>(
        'ConsultaStatusAtendimento',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosAmostraEtiqueta[]>> {
    this.logger.log(
      `Reimprimindo etiquetas: apoiado=${dto.numeroAtendimentoApoiado}, db=${dto.numeroAtendimentoDb}`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        NumeroAtendimentoApoiado: dto.numeroAtendimentoApoiado,
        NumeroAtendimentoDB: dto.numeroAtendimentoDb,
      };

      const result = await this.callSoapMethod<any>('EnviaAmostras', params);

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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosProcedimentoPendente[]>> {
    this.logger.log(
      `Consultando pendências: ${dto.dataInicio || 'sem'} a ${dto.dataFim || 'sem'}`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        DataInicio: dto.dataInicio,
        DataFim: dto.dataFim,
      };

      const result = await this.callSoapMethod<any>(
        'ListaProcedimentosPendentes',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosAmostraEtiqueta[]>> {
    this.logger.log(
      `Gerando etiqueta recoleta: ${dto.numeroAtendimentoDb} - ${dto.codigoExameDb}`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        NumeroAtendimentoDB: dto.numeroAtendimentoDb,
        CodigoExameDB: dto.codigoExameDb,
      };

      const result = await this.callSoapMethod<any>(
        'EnviaAmostrasProcedimentosPendentes',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudo[]>> {
    this.logger.log(`Consultando lote de resultados: ${dto.numeroLote}`);

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        NumeroLote: dto.numeroLote,
      };

      const result = await this.callSoapMethod<any>(
        'EnviaLoteResultados',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosLaudoPdf>> {
    this.logger.log(`Consultando laudo PDF: ${dto.numeroAtendimentoDb}`);

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        NumeroAtendimentoDB: dto.numeroAtendimentoDb,
      };

      const result = await this.callSoapMethod<any>(
        'EnviaResultadoBase64',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosRequisicaoEnviada[]>> {
    this.logger.log(
      `Consultando relatório de requisições: ${dto.dataInicio} a ${dto.dataFim}`,
    );

    try {
      const params = {
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        DataInicio: dto.dataInicio,
        DataFim: dto.dataFim,
      };

      const result = await this.callSoapMethod<any>(
        'RelatorioRequisicoesEnviadas',
        params,
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
  ): Promise<DbDiagnosticosResponse<DbDiagnosticosRecebeAtendimentoResult>> {
    this.logger.log(
      `Cancelando exame: ${dto.codigoExameDb} do pedido ${dto.numeroAtendimentoApoiado}`,
    );

    try {
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
        CodigoApoiado: this.config.codigoApoiado,
        CodigoSenhaIntegracao: this.config.codigoSenhaIntegracao,
        Pedido: pedido,
      };

      const result = await this.callSoapMethod<any>('RecebeAtendimento', {
        atendimento,
      });

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
}
