import { Injectable, Logger } from '@nestjs/common';
import * as soap from 'soap';
import * as xml2js from 'xml2js';
import { SoapConfig, SoapResponse } from './interfaces/soap-config.interface';

/**
 * Cliente SOAP genérico e reutilizável
 *
 * Fornece funcionalidades base para consumo de webservices SOAP:
 * - Criação de clientes SOAP
 * - Chamada de métodos
 * - Tratamento de erros
 * - Logging
 * - Conversão XML <-> JSON
 */
@Injectable()
export class SoapClientService {
  private readonly logger = new Logger(SoapClientService.name);

  /**
   * Cria um cliente SOAP
   */
  async criarCliente(config: SoapConfig): Promise<soap.Client> {
    try {
      const options: soap.IOptions = {
        disableCache: config.options?.disableCache ?? true,
        escapeXML: config.options?.escapeXML ?? true,
        forceSoap12Headers: config.options?.forceSoap12Headers ?? false,
        ...config.options,
      };

      // Criar cliente SOAP
      const client = await soap.createClientAsync(config.wsdl, options);

      // Configurar endpoint customizado
      if (config.endpoint) {
        client.setEndpoint(config.endpoint);
      }

      // Configurar timeout
      if (config.timeout) {
        // @ts-expect-error - httpClient é privado mas necessário para timeout
        client.httpClient.request['timeout'] = config.timeout;
      }

      // Configurar autenticação básica
      if (config.auth?.usuario && config.auth?.senha) {
        client.setSecurity(
          new soap.BasicAuthSecurity(config.auth.usuario, config.auth.senha),
        );
      }

      // Configurar headers customizados
      if (config.headers) {
        Object.keys(config.headers).forEach((key) => {
          client.addHttpHeader(key, config.headers[key]);
        });
      }

      this.logger.log(`Cliente SOAP criado: ${config.wsdl}`);
      return client;
    } catch (erro) {
      this.logger.error(
        `Erro ao criar cliente SOAP: ${erro.message}`,
        erro.stack,
      );
      throw new Error(`Falha ao criar cliente SOAP: ${erro.message}`);
    }
  }

  /**
   * Chama um método do webservice SOAP
   */
  async chamarMetodo<T = any>(
    client: soap.Client,
    metodo: string,
    parametros: any = {},
    salvarXml = false,
  ): Promise<SoapResponse<T>> {
    try {
      this.logger.debug(`Chamando método SOAP: ${metodo}`);

      // Obter último request/response para debug
      let lastRequest: string | undefined;
      let lastResponse: string | undefined;

      if (salvarXml) {
        client.on('request', (xml) => {
          lastRequest = xml;
        });
        client.on('response', (xml) => {
          lastResponse = xml;
        });
      }

      // Chamar método
      const [resultado, rawResponse, soapHeader, rawRequest] =
        await client[metodo + 'Async'](parametros);

      this.logger.debug(`Método ${metodo} executado com sucesso`);

      return {
        sucesso: true,
        dados: resultado as T,
        detalhes: salvarXml
          ? {
              request: lastRequest || rawRequest,
              response: lastResponse || rawResponse,
              headers: soapHeader,
            }
          : undefined,
      };
    } catch (erro) {
      // IMPORTANTE: A biblioteca SOAP pode lançar exceção mesmo com resposta válida
      // Verificar se erro.body contém uma resposta SOAP válida com dados

      // Extrair response body de diferentes locais
      let responseBody: string | undefined;
      if (erro?.body && typeof erro.body === 'string') {
        responseBody = erro.body;
      } else if (
        erro?.response?.body &&
        typeof erro.response.body === 'string'
      ) {
        responseBody = erro.response.body;
      }

      // Verificar se a resposta contém dados SOAP válidos (não é um Fault)
      if (
        responseBody &&
        responseBody.includes('Response>') &&
        !responseBody.includes('Fault>')
      ) {
        this.logger.debug(
          `Método ${metodo}: Resposta SOAP válida detectada em exceção`,
        );

        // Retornar como sucesso mas com dados brutos no erro para processamento downstream
        // O serviço específico pode extrair os dados do campo erro
        return {
          sucesso: false,
          erro: responseBody,
          codigoErro: 'SOAP_RESPONSE_IN_EXCEPTION',
          detalhes: {
            request:
              typeof erro?.request === 'string' ? erro.request : undefined,
            response: responseBody,
          },
        };
      }

      // Extrair mensagem de erro de diferentes formatos SOAP
      // IMPORTANTE: Evitar referências circulares que existem em objetos HTTP
      let mensagemErro = 'Erro desconhecido na chamada SOAP';
      let codigoErro: string | undefined;

      // Tentar extrair mensagem de diferentes formatos de erro SOAP
      if (typeof erro === 'string') {
        mensagemErro = erro;
      } else if (erro?.message) {
        mensagemErro = erro.message;
      }

      // Tentar extrair detalhes de SOAP Fault
      try {
        if (erro?.root?.Envelope?.Body?.Fault) {
          const fault = erro.root.Envelope.Body.Fault;
          mensagemErro = fault.faultstring || fault.faultcode || mensagemErro;
          codigoErro = fault.faultcode;
        }
      } catch {
        // Ignorar erros ao acessar estrutura SOAP
      }

      // Extrair código de erro se disponível
      if (erro?.code && typeof erro.code === 'string') {
        codigoErro = erro.code;
      }

      // Extrair dados de request/response de forma segura (apenas strings)
      let requestData: string | undefined;
      let responseData: string | undefined;

      if (typeof erro?.request === 'string') {
        requestData = erro.request;
      }
      if (typeof erro?.response === 'string') {
        responseData = erro.response;
      }

      // Se há response body como string, tentar extrair
      if (erro?.response?.body && typeof erro.response.body === 'string') {
        responseData = erro.response.body;
      }

      this.logger.error(
        `Erro ao chamar método ${metodo}: ${mensagemErro}`,
        erro?.stack,
      );

      return {
        sucesso: false,
        erro: mensagemErro,
        codigoErro,
        detalhes:
          requestData || responseData
            ? {
                request: requestData,
                response: responseData,
              }
            : undefined,
      };
    }
  }

  /**
   * Converte XML string para objeto JavaScript
   */
  async xmlParaObjeto(xml: string): Promise<any> {
    try {
      const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        trim: true,
        strict: false, // Mais tolerante com XML malformado
        normalize: true,
        normalizeTags: false,
      });

      return await parser.parseStringPromise(xml);
    } catch (erro) {
      this.logger.error(`Erro ao converter XML para objeto: ${erro.message}`);
      throw new Error(`Falha ao parsear XML: ${erro.message}`);
    }
  }

  /**
   * Converte objeto JavaScript para XML string
   */
  objetoParaXml(objeto: any): string {
    try {
      const builder = new xml2js.Builder({
        headless: false,
        renderOpts: { pretty: true, indent: '  ' },
      });

      return builder.buildObject(objeto);
    } catch (erro) {
      this.logger.error(`Erro ao converter objeto para XML: ${erro.message}`);
      throw new Error(`Falha ao gerar XML: ${erro.message}`);
    }
  }

  /**
   * Obtém descrição dos serviços disponíveis no WSDL
   */
  async descreverServicos(config: SoapConfig): Promise<string> {
    try {
      const client = await this.criarCliente(config);
      return client.describe();
    } catch (erro) {
      this.logger.error(`Erro ao descrever serviços: ${erro.message}`);
      throw new Error(`Falha ao descrever WSDL: ${erro.message}`);
    }
  }

  /**
   * Lista métodos disponíveis no webservice
   */
  async listarMetodos(config: SoapConfig): Promise<string[]> {
    try {
      const client = await this.criarCliente(config);
      const descricao = client.describe();

      const metodos: string[] = [];
      for (const servico in descricao) {
        for (const porta in descricao[servico]) {
          for (const metodo in descricao[servico][porta]) {
            metodos.push(metodo);
          }
        }
      }

      return metodos;
    } catch (erro) {
      this.logger.error(`Erro ao listar métodos: ${erro.message}`);
      throw new Error(`Falha ao listar métodos: ${erro.message}`);
    }
  }
}
