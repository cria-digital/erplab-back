import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SoapClientService } from '../../soap/soap-client.service';
import {
  SoapConfig,
  SoapResponse,
} from '../../soap/interfaces/soap-config.interface';
import {
  ORIZON_ENDPOINTS,
  OrizonConfig,
} from './interfaces/orizon-endpoints.interface';
import { EnviarLoteGuiasDto, LoteGuiasResponseDto } from './dto/lote-guias.dto';
import {
  ConsultarStatusProtocoloDto,
  StatusProtocoloResponseDto,
  GerarProtocoloPdfDto,
  ProtocoloPdfResponseDto,
} from './dto/protocolo.dto';
import {
  CancelarGuiaDto,
  CancelamentoGuiaResponseDto,
} from './dto/cancelamento.dto';
import {
  SolicitarDemonstrativoDto,
  DemonstrativoResponseDto,
} from './dto/demonstrativo.dto';
import {
  EnviarRecursoGlosaDto,
  RecursoGlosaResponseDto,
  ConsultarStatusRecursoDto,
  StatusRecursoResponseDto,
} from './dto/recurso-glosa.dto';
import {
  EnviarDocumentosDto,
  DocumentosResponseDto,
} from './dto/documentos.dto';

/**
 * Serviço para integração com webservices TISS da Orizon
 *
 * Funcionalidades:
 * - Envio de lotes de guias
 * - Consulta de status de protocolos
 * - Geração de comprovantes PDF
 * - Cancelamento de guias
 * - Solicitação de demonstrativos
 * - Envio e consulta de recursos de glosa
 * - Envio de documentos anexos
 */
@Injectable()
export class OrizonTissService {
  private readonly logger = new Logger(OrizonTissService.name);
  private readonly config: OrizonConfig;

  constructor(
    private readonly soapClient: SoapClientService,
    private readonly configService: ConfigService,
  ) {
    // Configuração a partir de variáveis de ambiente
    this.config = {
      ambiente:
        (this.configService.get<string>('ORIZON_AMBIENTE') as
          | 'HOMOLOGACAO'
          | 'PRODUCAO') || 'HOMOLOGACAO',
      credenciais: {
        usuario: this.configService.get<string>('ORIZON_USUARIO'),
        senha: this.configService.get<string>('ORIZON_SENHA'),
      },
      codigoPrestador: this.configService.get<string>(
        'ORIZON_CODIGO_PRESTADOR',
      ),
      timeout: parseInt(
        this.configService.get<string>('ORIZON_TIMEOUT') || '30000',
        10,
      ),
    };
  }

  /**
   * Cria configuração SOAP para um endpoint específico
   */
  private criarConfigSoap(wsdlUrl: string): SoapConfig {
    return {
      wsdl: wsdlUrl,
      auth: this.config.credenciais,
      timeout: this.config.timeout,
      options: {
        disableCache: true,
        escapeXML: true,
      },
    };
  }

  /**
   * Obtém o endpoint baseado no ambiente configurado
   */
  private obterEndpoint(
    tipo: keyof typeof ORIZON_ENDPOINTS.HOMOLOGACAO,
  ): string {
    return ORIZON_ENDPOINTS[this.config.ambiente][tipo];
  }

  /**
   * 1. Enviar Lote de Guias
   */
  async enviarLoteGuias(
    dto: EnviarLoteGuiasDto,
  ): Promise<SoapResponse<LoteGuiasResponseDto>> {
    try {
      this.logger.log('Enviando lote de guias para Orizon...');

      const wsdl = this.obterEndpoint('LOTE_GUIAS');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      // Preparar parâmetros
      const parametros = {
        loteGuiasWS: dto.xmlLote,
      };

      // Chamar método SOAP
      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'tissLoteGuias_Operation',
        parametros,
        true, // Salvar XML para auditoria
      );

      if (!resposta.sucesso) {
        this.logger.error(`Erro ao enviar lote de guias: ${resposta.erro}`);
        return resposta;
      }

      // Processar resposta
      const dados: LoteGuiasResponseDto = {
        numeroProtocolo:
          resposta.dados?.protocoloRecebimentoWS?.numeroProtocolo || '',
        dataRecebimento: new Date(
          resposta.dados?.protocoloRecebimentoWS?.dataRecebimento || Date.now(),
        ),
        status: 'RECEBIDO',
        mensagem: resposta.dados?.protocoloRecebimentoWS?.mensagem,
        xmlResposta: resposta.detalhes?.response,
      };

      this.logger.log(
        `Lote enviado com sucesso. Protocolo: ${dados.numeroProtocolo}`,
      );
      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(
        `Erro ao enviar lote de guias: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * 2. Consultar Status de Protocolo
   */
  async consultarStatusProtocolo(
    dto: ConsultarStatusProtocoloDto,
  ): Promise<SoapResponse<StatusProtocoloResponseDto>> {
    try {
      this.logger.log(
        `Consultando status do protocolo: ${dto.numeroProtocolo}`,
      );

      const wsdl = this.obterEndpoint('STATUS_PROTOCOLO');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        solicitacaoStatusProtocolo: {
          numeroProtocolo: dto.numeroProtocolo,
          codigoPrestador: dto.codigoPrestador || this.config.codigoPrestador,
        },
      };

      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'tissSolicitacaoStatusProtocolo_Operation',
        parametros,
      );

      if (!resposta.sucesso) {
        return resposta;
      }

      const situacao = resposta.dados?.situacaoProtocolo || {};
      const dados: StatusProtocoloResponseDto = {
        numeroProtocolo: dto.numeroProtocolo,
        status: situacao.status || 'DESCONHECIDO',
        dataAtualizacao: new Date(situacao.dataAtualizacao || Date.now()),
        mensagem: situacao.mensagem,
        detalhes: situacao.detalhes,
      };

      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(
        `Erro ao consultar status do protocolo: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * 3. Gerar Protocolo em PDF
   */
  async gerarProtocoloPdf(
    dto: GerarProtocoloPdfDto,
  ): Promise<SoapResponse<ProtocoloPdfResponseDto>> {
    try {
      this.logger.log(`Gerando PDF do protocolo: ${dto.numeroProtocolo}`);

      const wsdl = this.obterEndpoint('GERAR_PROTOCOLO');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        SOLIC_PROTOLOCO: {
          Usuario: dto.usuario || this.config.credenciais?.usuario,
          Senha: dto.senha || this.config.credenciais?.senha,
          Relatorio: dto.tipoRelatorio,
          NumeroProtocolo: parseInt(dto.numeroProtocolo, 10),
          SeqTransacao: dto.seqTransacao,
          CodPrestadorNaOperadora:
            dto.codigoPrestador || this.config.codigoPrestador,
        },
      };

      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'GerarProtocolo',
        parametros,
      );

      if (!resposta.sucesso) {
        return resposta;
      }

      const resultado = resposta.dados?.SOLIC_PROTOLOCO_RESP || {};
      const dados: ProtocoloPdfResponseDto = {
        numeroProtocolo: String(
          resultado.NumeroProtocolo || dto.numeroProtocolo,
        ),
        pdfBase64: resultado.Imagem || '',
        status: resultado.Status || 0,
        mensagem: resultado.Mensagem,
      };

      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(`Erro ao gerar PDF: ${erro.message}`, erro.stack);
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * 4. Cancelar Guia
   */
  async cancelarGuia(
    dto: CancelarGuiaDto,
  ): Promise<SoapResponse<CancelamentoGuiaResponseDto>> {
    try {
      this.logger.log('Cancelando guia...');

      const wsdl = this.obterEndpoint('CANCELA_GUIA');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        cancelaGuia: dto.xmlCancelamento,
      };

      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'tissCancelaGuia_Operation',
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return resposta;
      }

      const recibo = resposta.dados?.reciboCancelaGuia || {};
      const dados: CancelamentoGuiaResponseDto = {
        numeroRecibo: recibo.numeroRecibo || '',
        dataCancelamento: new Date(recibo.dataCancelamento || Date.now()),
        status: 'CANCELADO',
        mensagem: recibo.mensagem,
        guiasCanceladas: recibo.guiasCanceladas,
        erros: recibo.erros,
      };

      this.logger.log(`Guia cancelada. Recibo: ${dados.numeroRecibo}`);
      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(`Erro ao cancelar guia: ${erro.message}`, erro.stack);
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * 5. Solicitar Demonstrativo
   */
  async solicitarDemonstrativo(
    dto: SolicitarDemonstrativoDto,
  ): Promise<SoapResponse<DemonstrativoResponseDto>> {
    try {
      this.logger.log(
        `Solicitando demonstrativo: ${dto.dataInicio} a ${dto.dataFim}`,
      );

      const wsdl = this.obterEndpoint('DEMONSTRATIVO');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        solicitacaoDemonstrativo: {
          dataInicio: dto.dataInicio,
          dataFim: dto.dataFim,
          numeroProtocolo: dto.numeroProtocolo,
          codigoPrestador: dto.codigoPrestador || this.config.codigoPrestador,
        },
      };

      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'tissSolicitaDemonstrativo_Operation',
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return resposta;
      }

      const demo = resposta.dados?.demonstrativo || {};
      const dados: DemonstrativoResponseDto = {
        numeroProtocolo: demo.numeroProtocolo || '',
        dataGeracao: new Date(demo.dataGeracao || Date.now()),
        periodo: {
          inicio: new Date(dto.dataInicio),
          fim: new Date(dto.dataFim),
        },
        resumo: demo.resumo || {},
        xmlDemonstrativo: resposta.detalhes?.response,
        guias: demo.guias,
      };

      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(
        `Erro ao solicitar demonstrativo: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * 6. Enviar Recurso de Glosa
   */
  async enviarRecursoGlosa(
    dto: EnviarRecursoGlosaDto,
  ): Promise<SoapResponse<RecursoGlosaResponseDto>> {
    try {
      this.logger.log('Enviando recurso de glosa...');

      const wsdl = this.obterEndpoint('ENVIA_RECURSO_GLOSA');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        recursoGlosa: dto.xmlRecurso,
      };

      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'tissRecursoGlosa_Operation',
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return resposta;
      }

      const recibo = resposta.dados?.reciboRecursoGlosa || {};
      const dados: RecursoGlosaResponseDto = {
        numeroProtocolo: recibo.numeroProtocolo || '',
        dataRecebimento: new Date(recibo.dataRecebimento || Date.now()),
        status: 'RECEBIDO',
        mensagem: recibo.mensagem,
        xmlResposta: resposta.detalhes?.response,
      };

      this.logger.log(`Recurso enviado. Protocolo: ${dados.numeroProtocolo}`);
      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(
        `Erro ao enviar recurso de glosa: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * 7. Consultar Status de Recurso
   */
  async consultarStatusRecurso(
    dto: ConsultarStatusRecursoDto,
  ): Promise<SoapResponse<StatusRecursoResponseDto>> {
    try {
      this.logger.log(`Consultando status do recurso: ${dto.numeroProtocolo}`);

      const wsdl = this.obterEndpoint('STATUS_RECURSO');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        solicitacaoStatusProtocoloRecurso: {
          numeroProtocolo: dto.numeroProtocolo,
          codigoPrestador: dto.codigoPrestador || this.config.codigoPrestador,
        },
      };

      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'tissSolicitacaoStatusProtocoloRecurso_Operation',
        parametros,
      );

      if (!resposta.sucesso) {
        return resposta;
      }

      const situacao = resposta.dados?.situacaoProtocoloRecurso || {};
      const dados: StatusRecursoResponseDto = {
        numeroProtocolo: dto.numeroProtocolo,
        status: situacao.status || 'DESCONHECIDO',
        dataAtualizacao: new Date(situacao.dataAtualizacao || Date.now()),
        mensagem: situacao.mensagem,
        detalhes: situacao.detalhes,
      };

      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(
        `Erro ao consultar status do recurso: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }

  /**
   * 8. Enviar Documentos
   */
  async enviarDocumentos(
    dto: EnviarDocumentosDto,
  ): Promise<SoapResponse<DocumentosResponseDto>> {
    try {
      this.logger.log('Enviando documentos...');

      const wsdl = this.obterEndpoint('ENVIO_DOCUMENTOS');
      const soapConfig = this.criarConfigSoap(wsdl);
      const client = await this.soapClient.criarCliente(soapConfig);

      const parametros = {
        envioDocumentos: dto.xmlDocumentos,
      };

      const resposta = await this.soapClient.chamarMetodo<any>(
        client,
        'tissEnvioDocumentos_Operation',
        parametros,
        true,
      );

      if (!resposta.sucesso) {
        return resposta;
      }

      const recibo = resposta.dados?.reciboDocumentos || {};
      const dados: DocumentosResponseDto = {
        numeroRecibo: recibo.numeroRecibo || '',
        dataRecebimento: new Date(recibo.dataRecebimento || Date.now()),
        status: 'RECEBIDO',
        mensagem: recibo.mensagem,
        documentosAceitos: recibo.documentosAceitos,
        erros: recibo.erros,
      };

      this.logger.log(`Documentos enviados. Recibo: ${dados.numeroRecibo}`);
      return { ...resposta, dados };
    } catch (erro) {
      this.logger.error(
        `Erro ao enviar documentos: ${erro.message}`,
        erro.stack,
      );
      return {
        sucesso: false,
        erro: erro.message,
      };
    }
  }
}
