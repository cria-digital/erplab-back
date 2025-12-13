import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SoapClientService } from '../../soap/soap-client.service';
import { SoapConfig } from '../../soap/interfaces/soap-config.interface';
import {
  HERMES_PARDINI_ENDPOINTS,
  HERMES_PARDINI_METODOS,
} from '../../../atendimento/integracoes/schemas/hermes-pardini.schema';
import {
  HermesPardiniConfig,
  HermesPardiniResponse,
  HermesPardiniPedidoResponse,
  HermesPardiniResultado,
  HermesPardiniCancelamentoResponse,
  HermesPardiniPendenciaTecnica,
  HermesPardiniRastreabilidade,
  HermesPardiniStatusPedido,
  HermesPardiniGrupoFracionamento,
} from './interfaces/hermes-pardini.interface';
import {
  EnviarPedidoDto,
  ConsultarResultadoDto,
  CancelarAmostraDto,
  CancelarExameDto,
  ConsultarPendenciaTecnicaDto,
  ConsultarRastreabilidadeDto,
  ConsultarStatusPedidoDto,
} from './dto/hermes-pardini.dto';

/**
 * Serviço para integração com Hermes Pardini Lab-to-Lab
 *
 * Implementa todos os métodos SOAP disponíveis:
 * - Envio de pedidos
 * - Consulta de resultados
 * - Cancelamentos
 * - Consultas de pendências e rastreabilidade
 */
@Injectable()
export class HermesPardiniService {
  private readonly logger = new Logger(HermesPardiniService.name);
  private config: HermesPardiniConfig;

  constructor(
    private readonly soapClient: SoapClientService,
    private readonly configService: ConfigService,
  ) {
    this.loadConfig();
  }

  /**
   * Carrega configuração das variáveis de ambiente
   */
  private loadConfig(): void {
    const ambiente = this.configService.get<string>(
      'HERMES_PARDINI_AMBIENTE',
      'producao',
    ) as 'homologacao' | 'producao';

    this.config = {
      login: this.configService.get<string>('HERMES_PARDINI_LOGIN', ''),
      senha: this.configService.get<string>('HERMES_PARDINI_SENHA', ''),
      ambiente,
      urlWebservice:
        ambiente === 'homologacao'
          ? HERMES_PARDINI_ENDPOINTS.HOMOLOGACAO.WEBSERVICE
          : HERMES_PARDINI_ENDPOINTS.PRODUCAO.WEBSERVICE,
      valorReferencia: parseInt(
        this.configService.get<string>('HERMES_PARDINI_VALOR_REFERENCIA', '0'),
        10,
      ) as 0 | 1 | 2,
      papelTimbrado: parseInt(
        this.configService.get<string>('HERMES_PARDINI_PAPEL_TIMBRADO', '0'),
        10,
      ) as 0 | 1,
      versaoResultado: parseInt(
        this.configService.get<string>('HERMES_PARDINI_VERSAO_RESULTADO', '1'),
        10,
      ),
      timeout: parseInt(
        this.configService.get<string>('HERMES_PARDINI_TIMEOUT', '30000'),
        10,
      ),
      codigoCliente: this.configService.get<string>(
        'HERMES_PARDINI_CODIGO_CLIENTE',
      ),
    };
  }

  /**
   * Atualiza configuração em runtime
   */
  setConfig(config: Partial<HermesPardiniConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.log('Configuração atualizada');
  }

  /**
   * Retorna configuração atual (sem senha)
   */
  getConfig(): Omit<HermesPardiniConfig, 'senha'> {
    const { senha: _senha, ...configSemSenha } = this.config;
    return configSemSenha;
  }

  /**
   * Cria configuração SOAP
   */
  private criarSoapConfig(): SoapConfig {
    return {
      wsdl: this.config.urlWebservice + '?wsdl',
      endpoint: this.config.urlWebservice,
      timeout: this.config.timeout,
      options: {
        disableCache: true,
        escapeXML: true,
      },
    };
  }

  // ==========================================
  // ENVIO DE PEDIDOS
  // ==========================================

  /**
   * Envia um pedido para o Hermes Pardini
   */
  async enviarPedido(
    dto: EnviarPedidoDto,
  ): Promise<HermesPardiniResponse<HermesPardiniPedidoResponse>> {
    try {
      this.logger.log(`Enviando pedido: ${dto.codigoPedidoLab}`);

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      // Montar XML do pedido
      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
        pedido: this.montarXmlPedido(dto),
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.ENVIAR_PEDIDO,
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        this.logger.error(`Erro ao enviar pedido: ${resposta.erro}`);
        return {
          sucesso: false,
          erro: resposta.erro,
          codigoErro: resposta.codigoErro,
        };
      }

      // Processar resposta
      const dados = this.processarRespostaPedido(resposta.dados);

      this.logger.log(
        `Pedido enviado com sucesso. Código Apoio: ${dados.codigoPedidoApoio}`,
      );

      return {
        sucesso: true,
        dados,
        xmlRequest: resposta.detalhes?.request,
        xmlResponse: resposta.detalhes?.response,
      };
    } catch (erro) {
      this.logger.error(`Erro ao enviar pedido: ${erro.message}`, erro.stack);
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Monta XML do pedido no formato esperado pelo Pardini
   */
  private montarXmlPedido(dto: EnviarPedidoDto): string {
    const examesXml = dto.exames
      .map(
        (e) => `
      <exame>
        <codigo>${e.codigoExame}</codigo>
        ${e.materialCodigo ? `<material>${e.materialCodigo}</material>` : ''}
        ${e.observacao ? `<observacao>${e.observacao}</observacao>` : ''}
      </exame>`,
      )
      .join('');

    return `
      <pedido>
        <codigoPedidoLab>${dto.codigoPedidoLab}</codigoPedidoLab>
        <dataColeta>${dto.dataColeta}</dataColeta>
        ${dto.horaColeta ? `<horaColeta>${dto.horaColeta}</horaColeta>` : ''}
        <paciente>
          <nome>${dto.paciente.nome}</nome>
          <dataNascimento>${dto.paciente.dataNascimento}</dataNascimento>
          <sexo>${dto.paciente.sexo}</sexo>
          ${dto.paciente.cpf ? `<cpf>${dto.paciente.cpf}</cpf>` : ''}
        </paciente>
        <exames>${examesXml}</exames>
        ${dto.urgente ? '<urgente>S</urgente>' : ''}
        ${dto.observacoes ? `<observacoes>${dto.observacoes}</observacoes>` : ''}
      </pedido>
    `.trim();
  }

  /**
   * Processa resposta do envio de pedido
   */
  private processarRespostaPedido(dados: any): HermesPardiniPedidoResponse {
    return {
      codigoPedidoApoio: dados?.codigoPedidoApoio || dados?.CodPedApoio || '',
      anoPedidoApoio: parseInt(
        dados?.anoPedidoApoio || dados?.AnoCodPedApoio || '0',
        10,
      ),
      codigoPedidoLab: dados?.codigoPedidoLab || '',
      status: dados?.status || 'RECEBIDO',
      mensagem: dados?.mensagem,
      etiquetas: this.processarEtiquetas(dados?.etiquetas),
    };
  }

  /**
   * Processa etiquetas da resposta
   */
  private processarEtiquetas(
    etiquetas: any,
  ): HermesPardiniPedidoResponse['etiquetas'] {
    if (!etiquetas) return undefined;

    const lista = Array.isArray(etiquetas) ? etiquetas : [etiquetas];
    return lista.map((e) => ({
      codigoBarras: e.codigoBarras || e.codigo || '',
      material: e.material || '',
      tubo: e.tubo || '',
      corTampa: e.corTampa,
      quantidade: parseInt(e.quantidade || '1', 10),
      exames: Array.isArray(e.exames) ? e.exames : [e.exames].filter(Boolean),
    }));
  }

  // ==========================================
  // CONSULTA DE RESULTADOS
  // ==========================================

  /**
   * Consulta resultado de um pedido
   */
  async consultarResultado(
    dto: ConsultarResultadoDto,
  ): Promise<HermesPardiniResponse<HermesPardiniResultado>> {
    try {
      this.logger.log(
        `Consultando resultado: ${dto.anoCodPedApoio}/${dto.codPedApoio}`,
      );

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
        anoCodPedApoio: dto.anoCodPedApoio,
        CodPedApoio: dto.codPedApoio,
        CodExmApoio: dto.codExmApoio || '',
        PDF: dto.pdf ? 1 : 0,
        versaoResultado: dto.versaoResultado ?? this.config.versaoResultado,
        papelTimbrado: dto.papelTimbrado ? 1 : 0,
        valorReferencia: dto.valorReferencia ?? this.config.valorReferencia,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.GET_RESULTADO_PEDIDO,
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return {
          sucesso: false,
          erro: resposta.erro,
          codigoErro: resposta.codigoErro,
        };
      }

      const dados = this.processarResultado(resposta.dados);

      return {
        sucesso: true,
        dados,
        xmlRequest: resposta.detalhes?.request,
        xmlResponse: resposta.detalhes?.response,
      };
    } catch (erro) {
      this.logger.error(
        `Erro ao consultar resultado: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Processa resultado do exame
   */
  private processarResultado(dados: any): HermesPardiniResultado {
    return {
      codigoPedidoApoio: dados?.CodPedApoio || '',
      anoPedidoApoio: parseInt(dados?.AnoCodPedApoio || '0', 10),
      codigoPedidoLab: dados?.CodigoPedidoLab || '',
      status: dados?.Status || '',
      dataLiberacao: dados?.DataLiberacao,
      exames: this.processarExamesResultado(dados?.Exames),
      pdfBase64: dados?.Imagem || dados?.PDF,
    };
  }

  /**
   * Processa lista de exames do resultado
   */
  private processarExamesResultado(
    exames: any,
  ): HermesPardiniResultado['exames'] {
    if (!exames) return [];

    const lista = Array.isArray(exames) ? exames : [exames];
    return lista.map((e) => ({
      codigoExame: e.CodExame || e.Codigo || '',
      nomeExame: e.NomeExame || e.Nome || '',
      status: e.Status || '',
      dataLiberacao: e.DataLiberacao,
      resultados: this.processarItensResultado(e.Resultados || e.Analitos),
      observacoes: e.Observacoes,
      metodologia: e.Metodologia,
    }));
  }

  /**
   * Processa itens do resultado (analitos)
   */
  private processarItensResultado(
    itens: any,
  ): HermesPardiniResultado['exames'][0]['resultados'] {
    if (!itens) return [];

    const lista = Array.isArray(itens) ? itens : [itens];
    return lista.map((i) => ({
      analito: i.Analito || i.Nome || '',
      resultado: i.Resultado || i.Valor || '',
      unidade: i.Unidade,
      valorReferencia: i.ValorReferencia,
      valorReferenciaMin: i.ValorReferenciaMin,
      valorReferenciaMax: i.ValorReferenciaMax,
      flag: i.Flag,
    }));
  }

  // ==========================================
  // CANCELAMENTOS
  // ==========================================

  /**
   * Cancela uma amostra
   */
  async cancelarAmostra(
    dto: CancelarAmostraDto,
  ): Promise<HermesPardiniResponse<HermesPardiniCancelamentoResponse>> {
    try {
      this.logger.log(`Cancelando amostra: ${dto.codigoBarras}`);

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
        anoCodPedApoio: dto.anoCodPedApoio,
        CodPedApoio: dto.codPedApoio,
        codigoBarras: dto.codigoBarras,
        motivo: dto.motivo,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.CANCELAR_AMOSTRA,
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return {
          sucesso: false,
          erro: resposta.erro,
        };
      }

      return {
        sucesso: true,
        dados: {
          sucesso:
            resposta.dados?.Sucesso === 'S' || resposta.dados?.Status === 'OK',
          codigoPedidoApoio: dto.codPedApoio,
          codigoBarras: dto.codigoBarras,
          mensagem: resposta.dados?.Mensagem || 'Amostra cancelada com sucesso',
        },
      };
    } catch (erro) {
      this.logger.error(
        `Erro ao cancelar amostra: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Cancela um exame
   */
  async cancelarExame(
    dto: CancelarExameDto,
  ): Promise<HermesPardiniResponse<HermesPardiniCancelamentoResponse>> {
    try {
      this.logger.log(`Cancelando exame: ${dto.codigoExame}`);

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
        anoCodPedApoio: dto.anoCodPedApoio,
        CodPedApoio: dto.codPedApoio,
        CodExame: dto.codigoExame,
        motivo: dto.motivo,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.CANCELAR_EXAME,
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return {
          sucesso: false,
          erro: resposta.erro,
        };
      }

      return {
        sucesso: true,
        dados: {
          sucesso:
            resposta.dados?.Sucesso === 'S' || resposta.dados?.Status === 'OK',
          codigoPedidoApoio: dto.codPedApoio,
          codigoExame: dto.codigoExame,
          mensagem: resposta.dados?.Mensagem || 'Exame cancelado com sucesso',
        },
      };
    } catch (erro) {
      this.logger.error(`Erro ao cancelar exame: ${erro.message}`, erro.stack);
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  // ==========================================
  // CONSULTAS
  // ==========================================

  /**
   * Consulta pendências técnicas
   */
  async consultarPendenciaTecnica(
    dto: ConsultarPendenciaTecnicaDto,
  ): Promise<HermesPardiniResponse<HermesPardiniPendenciaTecnica[]>> {
    try {
      this.logger.log('Consultando pendências técnicas');

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
        anoCodPedApoio: dto.anoCodPedApoio,
        CodPedApoio: dto.codPedApoio,
        dataInicio: dto.dataInicio,
        dataFim: dto.dataFim,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.CONSULTA_PENDENCIA_TECNICA,
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return {
          sucesso: false,
          erro: resposta.erro,
        };
      }

      const pendencias = this.processarPendencias(resposta.dados);

      return {
        sucesso: true,
        dados: pendencias,
      };
    } catch (erro) {
      this.logger.error(
        `Erro ao consultar pendências: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Processa lista de pendências
   */
  private processarPendencias(dados: any): HermesPardiniPendenciaTecnica[] {
    if (!dados?.Pendencias) return [];

    const lista = Array.isArray(dados.Pendencias)
      ? dados.Pendencias
      : [dados.Pendencias];
    return lista.map((p) => ({
      codigoPedidoApoio: p.CodPedApoio || '',
      anoPedidoApoio: parseInt(p.AnoCodPedApoio || '0', 10),
      codigoExame: p.CodExame || '',
      nomeExame: p.NomeExame || '',
      tipoPendencia: p.TipoPendencia || '',
      descricao: p.Descricao || '',
      dataPendencia: p.DataPendencia || '',
      status: p.Status || '',
    }));
  }

  /**
   * Consulta rastreabilidade de amostra
   */
  async consultarRastreabilidade(
    dto: ConsultarRastreabilidadeDto,
  ): Promise<HermesPardiniResponse<HermesPardiniRastreabilidade>> {
    try {
      this.logger.log(`Consultando rastreabilidade: ${dto.codPedApoio}`);

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
        anoCodPedApoio: dto.anoCodPedApoio,
        CodPedApoio: dto.codPedApoio,
        codigoBarras: dto.codigoBarras,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.CONSULTA_RASTREABILIDADE,
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return {
          sucesso: false,
          erro: resposta.erro,
        };
      }

      return {
        sucesso: true,
        dados: {
          codigoPedidoApoio: dto.codPedApoio,
          anoPedidoApoio: dto.anoCodPedApoio,
          codigoBarras: dto.codigoBarras || '',
          eventos: this.processarEventosRastreio(resposta.dados),
        },
      };
    } catch (erro) {
      this.logger.error(
        `Erro ao consultar rastreabilidade: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Processa eventos de rastreio
   */
  private processarEventosRastreio(
    dados: any,
  ): HermesPardiniRastreabilidade['eventos'] {
    if (!dados?.Eventos) return [];

    const lista = Array.isArray(dados.Eventos)
      ? dados.Eventos
      : [dados.Eventos];
    return lista.map((e) => ({
      data: e.Data || '',
      hora: e.Hora || '',
      evento: e.Evento || e.Descricao || '',
      local: e.Local,
      usuario: e.Usuario,
      observacao: e.Observacao,
    }));
  }

  /**
   * Consulta status do pedido
   */
  async consultarStatusPedido(
    dto: ConsultarStatusPedidoDto,
  ): Promise<HermesPardiniResponse<HermesPardiniStatusPedido>> {
    try {
      this.logger.log(`Consultando status: ${dto.codPedApoio}`);

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
        anoCodPedApoio: dto.anoCodPedApoio,
        CodPedApoio: dto.codPedApoio,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.CONSULTA_STATUS_PEDIDO,
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return {
          sucesso: false,
          erro: resposta.erro,
        };
      }

      return {
        sucesso: true,
        dados: this.processarStatusPedido(resposta.dados, dto),
      };
    } catch (erro) {
      this.logger.error(
        `Erro ao consultar status: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Processa status do pedido
   */
  private processarStatusPedido(
    dados: any,
    dto: ConsultarStatusPedidoDto,
  ): HermesPardiniStatusPedido {
    return {
      codigoPedidoApoio: dto.codPedApoio,
      anoPedidoApoio: dto.anoCodPedApoio,
      codigoPedidoLab: dados?.CodigoPedidoLab || '',
      status: dados?.Status || 'DESCONHECIDO',
      dataStatus: dados?.DataStatus || '',
      exames: this.processarStatusExames(dados?.Exames),
    };
  }

  /**
   * Processa status dos exames
   */
  private processarStatusExames(
    exames: any,
  ): HermesPardiniStatusPedido['exames'] {
    if (!exames) return [];

    const lista = Array.isArray(exames) ? exames : [exames];
    return lista.map((e) => ({
      codigoExame: e.CodExame || '',
      nomeExame: e.NomeExame || '',
      status: e.Status || '',
      dataStatus: e.DataStatus || '',
    }));
  }

  /**
   * Busca grupos de fracionamento
   */
  async buscarGruposFracionamento(): Promise<
    HermesPardiniResponse<HermesPardiniGrupoFracionamento[]>
  > {
    try {
      this.logger.log('Buscando grupos de fracionamento');

      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.GET_GRUPO_FRACIONAMENTO,
        parametros,
        true,
      );

      // Verificar se resposta.erro contém XML válido (biblioteca SOAP pode marcar como erro)
      let xmlString: string | undefined;

      if (!resposta.sucesso) {
        // Verificar se o "erro" é na verdade uma resposta SOAP válida com dados
        const temTabela = resposta.erro?.includes('<TABELA>');
        const temResult = resposta.erro?.includes(
          'getGrupoFracionamentoResult',
        );

        if (temTabela || temResult) {
          // Extrair o XML interno do CDATA dentro da resposta SOAP
          const cdataMatch = resposta.erro.match(/<!\[CDATA\[([\s\S]*)\]\]>/);
          if (cdataMatch && cdataMatch[1]) {
            xmlString = cdataMatch[1].trim();
          }
        }

        if (!xmlString) {
          return {
            sucesso: false,
            erro: resposta.erro,
          };
        }
      } else {
        // A biblioteca SOAP já parseou o resultado
        xmlString = resposta.dados?.getGrupoFracionamentoResult;
      }

      if (typeof xmlString === 'string' && xmlString.includes('<TABELA>')) {
        // Extrair apenas a parte TABELA do XML
        const tabelaStart = xmlString.indexOf('<TABELA>');
        const tabelaEnd = xmlString.lastIndexOf('</TABELA>');

        if (tabelaStart === -1 || tabelaEnd === -1) {
          return {
            sucesso: false,
            erro: 'Não foi possível encontrar TABELA no XML',
          };
        }

        // Extrair e limpar XML
        let xmlInterno = xmlString.substring(
          tabelaStart,
          tabelaEnd + '</TABELA>'.length,
        );
        xmlInterno = xmlInterno
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n');

        try {
          // Tentar parsing XML padrão
          const xmlData = await this.soapClient.xmlParaObjeto(xmlInterno);
          return {
            sucesso: true,
            dados: this.processarGruposFracionamento(xmlData),
          };
        } catch (parseError) {
          this.logger.warn(
            `XML parsing falhou, usando fallback via regex: ${parseError.message}`,
          );

          // Fallback: extrair dados via regex
          try {
            const dados = this.extrairGruposViaRegex(xmlInterno);
            this.logger.log(
              `Regex extraiu ${dados.length} grupos de fracionamento`,
            );
            return {
              sucesso: true,
              dados,
            };
          } catch (regexError) {
            this.logger.error(`Erro no regex fallback: ${regexError.message}`);
            return {
              sucesso: false,
              erro: `Falha ao processar XML: ${parseError.message}`,
            };
          }
        }
      }

      return {
        sucesso: true,
        dados: this.processarGruposFracionamento(resposta.dados),
      };
    } catch (erro) {
      this.logger.error(`Erro ao buscar grupos: ${erro.message}`, erro.stack);
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Extrai conteúdo CDATA do envelope SOAP
   */
  private extrairCdataDoSoap(xml: string): string {
    // Se já começa com <?xml ou <TABELA, não há CDATA para extrair
    if (xml.startsWith('<?xml') || xml.startsWith('<TABELA')) {
      return xml;
    }

    // Procurar conteúdo dentro de CDATA (greedy para capturar todo o conteúdo)
    const cdataMatch = xml.match(/<!\[CDATA\[([\s\S]*)\]\]>/);
    if (cdataMatch && cdataMatch[1]) {
      return cdataMatch[1].trim();
    }

    // Se não tem CDATA, procurar pela TABELA diretamente
    const tabelaMatch = xml.match(/<TABELA[\s\S]*<\/TABELA>/);
    if (tabelaMatch) {
      return tabelaMatch[0];
    }

    return xml;
  }

  /**
   * Extrai grupos de fracionamento via regex (fallback quando XML parsing falha)
   */
  private extrairGruposViaRegex(
    xml: string,
  ): HermesPardiniGrupoFracionamento[] {
    const gruposMap = new Map<string, HermesPardiniGrupoFracionamento>();

    // Regex para capturar cada bloco EXAME
    const exameRegex = /<EXAME>([\s\S]*?)<\/EXAME>/g;
    let exameMatch;

    while ((exameMatch = exameRegex.exec(xml)) !== null) {
      const exameContent = exameMatch[1];

      // Extrair dados do exame
      const mnexaMatch = exameContent.match(/<MNEXA>(.*?)<\/MNEXA>/);
      const descexaMatch = exameContent.match(/<DESCEXA>(.*?)<\/DESCEXA>/);

      if (!mnexaMatch) continue;

      // Extrair grupos de amostra
      const amostraRegex = /<AMOSTRA>([\s\S]*?)<\/AMOSTRA>/g;
      let amostraMatch;

      while ((amostraMatch = amostraRegex.exec(exameContent)) !== null) {
        const amostraContent = amostraMatch[1];
        const grupoMatch = amostraContent.match(/<GRUPO>(.*?)<\/GRUPO>/);

        if (grupoMatch) {
          const grupoId = grupoMatch[1] || 'SEM_GRUPO';

          if (!gruposMap.has(grupoId)) {
            gruposMap.set(grupoId, {
              codigo: grupoId,
              nome: `Grupo ${grupoId}`,
              exames: [],
            });
          }

          const grupo = gruposMap.get(grupoId)!;
          grupo.exames.push({
            codigoExame: mnexaMatch[1] || '',
            nomeExame: descexaMatch ? descexaMatch[1] : '',
          });
        }
      }
    }

    return Array.from(gruposMap.values());
  }

  /**
   * Extrai resultado XML de resposta SOAP parseada
   */
  private extrairResultadoXml(dados: any): string | null {
    if (!dados) return null;

    // Hermes Pardini retorna resultado como string na propriedade 'getGrupoFracionamentoResult'
    if (dados.getGrupoFracionamentoResult) {
      const result = dados.getGrupoFracionamentoResult;
      // Se for string com XML, retornar
      if (
        typeof result === 'string' &&
        (result.includes('<?xml') || result.includes('<TABELA>'))
      ) {
        return this.extrairCdataDoSoap(result);
      }
      // Se for objeto com $value (CDATA parseado)
      if (result.$value) {
        return result.$value;
      }
    }

    // Tentar encontrar qualquer propriedade que termina com 'Result'
    const keys = Object.keys(dados);
    for (const key of keys) {
      if (key.endsWith('Result')) {
        const result = dados[key];
        if (typeof result === 'string' && result.includes('<TABELA>')) {
          return this.extrairCdataDoSoap(result);
        }
        if (result?.$value) {
          return result.$value;
        }
      }
    }

    return null;
  }

  /**
   * Processa grupos de fracionamento
   */
  private processarGruposFracionamento(
    dados: any,
  ): HermesPardiniGrupoFracionamento[] {
    // Verificar se veio como TABELA (formato Hermes Pardini)
    if (dados?.TABELA?.EXAME) {
      const exames = Array.isArray(dados.TABELA.EXAME)
        ? dados.TABELA.EXAME
        : [dados.TABELA.EXAME];

      // Agrupar por GRUPO de amostra
      const gruposMap = new Map<string, HermesPardiniGrupoFracionamento>();

      for (const exame of exames) {
        const amostras = exame.AMOSTRA
          ? Array.isArray(exame.AMOSTRA)
            ? exame.AMOSTRA
            : [exame.AMOSTRA]
          : [];

        for (const amostra of amostras) {
          const grupoId = amostra.GRUPO || 'SEM_GRUPO';

          if (!gruposMap.has(grupoId)) {
            gruposMap.set(grupoId, {
              codigo: grupoId,
              nome: `Grupo ${grupoId}`,
              exames: [],
            });
          }

          const grupo = gruposMap.get(grupoId)!;
          grupo.exames.push({
            codigoExame: exame.MNEXA || '',
            nomeExame: exame.DESCEXA || '',
          });
        }
      }

      return Array.from(gruposMap.values());
    }

    // Formato antigo esperado
    if (!dados?.Grupos) return [];

    const lista = Array.isArray(dados.Grupos) ? dados.Grupos : [dados.Grupos];
    return lista.map((g) => ({
      codigo: g.Codigo || '',
      nome: g.Nome || '',
      exames: (g.Exames || []).map((e: any) => ({
        codigoExame: e.CodExame || '',
        nomeExame: e.NomeExame || '',
      })),
    }));
  }

  // ==========================================
  // MÉTODOS UTILITÁRIOS
  // ==========================================

  /**
   * Testa conexão com o webservice
   */
  async testarConexao(): Promise<HermesPardiniResponse<{ metodos: string[] }>> {
    try {
      this.logger.log('Testando conexão com Hermes Pardini');

      const soapConfig = this.criarSoapConfig();
      const metodos = await this.soapClient.listarMetodos(soapConfig);

      return {
        sucesso: true,
        dados: { metodos },
      };
    } catch (erro) {
      this.logger.error(`Erro ao testar conexão: ${erro.message}`, erro.stack);
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * Busca tabela de exames disponíveis
   */
  async buscarTabelaExames(): Promise<HermesPardiniResponse<{ url: string }>> {
    const url =
      this.config.ambiente === 'homologacao'
        ? HERMES_PARDINI_ENDPOINTS.HOMOLOGACAO.TABELA_EXAMES
        : HERMES_PARDINI_ENDPOINTS.PRODUCAO.TABELA_EXAMES;

    return {
      sucesso: true,
      dados: { url },
    };
  }

  /**
   * Debug - retorna estrutura bruta da resposta SOAP
   */
  async debugGruposFracionamento(): Promise<any> {
    try {
      const soapConfig = this.criarSoapConfig();
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        login: this.config.login,
        passwd: this.config.senha,
      };

      const resposta = await this.soapClient.chamarMetodo(
        client,
        HERMES_PARDINI_METODOS.GET_GRUPO_FRACIONAMENTO,
        parametros,
        true,
      );

      // Retornar informações de debug
      const dadosKeys = resposta.dados ? Object.keys(resposta.dados) : [];
      const resultadoRaw = resposta.dados?.getGrupoFracionamentoResult;

      return {
        sucesso: resposta.sucesso,
        erro: resposta.erro,
        dadosKeys,
        temResultado: !!resultadoRaw,
        tipoResultado: typeof resultadoRaw,
        tamanhoResultado:
          typeof resultadoRaw === 'string' ? resultadoRaw.length : null,
        primeiros500chars:
          typeof resultadoRaw === 'string'
            ? resultadoRaw.substring(0, 500)
            : null,
        temTabela:
          typeof resultadoRaw === 'string'
            ? resultadoRaw.includes('<TABELA>')
            : false,
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message,
        stack: erro.stack,
      };
    }
  }
}
