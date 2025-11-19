/**
 * Endpoints dos webservices TISS da Orizon
 */
export const ORIZON_ENDPOINTS = {
  /**
   * HOMOLOGAÇÃO
   */
  HOMOLOGACAO: {
    // Cobrança - Envio de lotes de guias
    LOTE_GUIAS:
      'https://wsp.hom.orizonbrasil.com.br:6281/fature/tiss/v40100/tissLoteGuias?wsdl',

    // Consulta de status de protocolo
    STATUS_PROTOCOLO:
      'https://wsp.hom.orizonbrasil.com.br:6281/fature/tiss/v40100/tissSolicitacaoStatusProtocolo?wsdl',

    // Cancelamento de guia/lote
    CANCELA_GUIA:
      'https://wsp.hom.orizonbrasil.com.br:6281/tiss/v40100/tissCancelaGuia?wsdl',

    // Geração de comprovantes PDF
    GERAR_PROTOCOLO:
      'https://wsp.hom.orizonbrasil.com.br:6290/gerapdf/wsGerarProtocolo?wsdl',

    // Demonstrativos
    DEMONSTRATIVO:
      'https://wsp.hom.orizonbrasil.com.br:6281/fature/tiss/v40100/tissSolicitaDemonstrativo?wsdl',

    // Recurso de glosas
    ENVIA_RECURSO_GLOSA:
      'https://wsp.hom.orizonbrasil.com.br:6281/tiss/v40100/tissEnviaRecursoGlosa?wsdl',
    STATUS_RECURSO:
      'https://wsp.hom.orizonbrasil.com.br:6281/tiss/v40100/tissSolicitaStatusRecurso?wsdl',

    // Envio de documentos
    ENVIO_DOCUMENTOS:
      'https://tiss-hml-documentos.orizon.com.br/Service.asmx?wsdl',
  },

  /**
   * PRODUÇÃO (preencher quando disponível)
   */
  PRODUCAO: {
    LOTE_GUIAS: '',
    STATUS_PROTOCOLO: '',
    CANCELA_GUIA: '',
    GERAR_PROTOCOLO: '',
    DEMONSTRATIVO: '',
    ENVIA_RECURSO_GLOSA: '',
    STATUS_RECURSO: '',
    ENVIO_DOCUMENTOS: '',
  },
};

/**
 * Tipos de relatório para geração de PDF
 */
export enum TipoRelatorioOrizon {
  CAPA_LOTE = 'Capa_Lote',
  LISTA_GUIAS = 'Lista_Guias',
  PROTOCOLO = 'Protocolo',
}

/**
 * Configuração de ambiente Orizon
 */
export interface OrizonConfig {
  /**
   * Ambiente (homologação ou produção)
   */
  ambiente: 'HOMOLOGACAO' | 'PRODUCAO';

  /**
   * Credenciais de autenticação
   */
  credenciais?: {
    usuario?: string;
    senha?: string;
  };

  /**
   * Código do prestador na operadora
   */
  codigoPrestador?: string;

  /**
   * Timeout customizado (em ms)
   */
  timeout?: number;
}
