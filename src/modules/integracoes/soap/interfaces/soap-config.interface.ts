/**
 * Configuração para cliente SOAP
 */
export interface SoapConfig {
  /**
   * URL do WSDL do webservice
   */
  wsdl: string;

  /**
   * Endpoint do serviço (sobrescreve o endpoint do WSDL se fornecido)
   */
  endpoint?: string;

  /**
   * Credenciais de autenticação
   */
  auth?: {
    usuario?: string;
    senha?: string;
    token?: string;
    certificado?: {
      pfx?: Buffer;
      passphrase?: string;
    };
  };

  /**
   * Headers HTTP customizados
   */
  headers?: Record<string, string>;

  /**
   * Timeout em milissegundos (padrão: 30000)
   */
  timeout?: number;

  /**
   * Opções adicionais do SOAP Client
   */
  options?: {
    disableCache?: boolean;
    escapeXML?: boolean;
    forceSoap12Headers?: boolean;
    [key: string]: any;
  };
}

/**
 * Resposta genérica de operação SOAP
 */
export interface SoapResponse<T = any> {
  /**
   * Sucesso da operação
   */
  sucesso: boolean;

  /**
   * Dados retornados pelo webservice
   */
  dados?: T;

  /**
   * Mensagem de erro (quando sucesso = false)
   */
  erro?: string;

  /**
   * Código de erro
   */
  codigoErro?: string;

  /**
   * Detalhes técnicos (útil para debug)
   */
  detalhes?: {
    request?: string;
    response?: string;
    headers?: Record<string, any>;
    body?: any;
    root?: any;
  };
}
