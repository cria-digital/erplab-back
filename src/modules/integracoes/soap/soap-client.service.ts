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
      this.logger.error(
        `Erro ao chamar método ${metodo}: ${erro.message}`,
        erro.stack,
      );

      return {
        sucesso: false,
        erro: erro.message,
        codigoErro: erro.code,
        detalhes: {
          request: erro.request,
          response: erro.response,
        },
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
