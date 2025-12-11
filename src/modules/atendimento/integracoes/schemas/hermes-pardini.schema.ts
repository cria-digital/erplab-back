import { IntegracaoSchema, TipoCampo, ProtocoloIntegracao } from './types';
import { TipoIntegracao } from '../entities/integracao.entity';

/**
 * Schema da integração Hermes Pardini Lab-to-Lab
 *
 * Integração SOAP com o laboratório Hermes Pardini para:
 * - Envio de requisições de exames
 * - Recebimento de laudos/resultados
 * - Consulta de status e rastreabilidade
 * - Cancelamento de amostras/exames
 * - Consulta de pendências técnicas
 *
 * Documentação: www.hermespardini.com.br/cal/hpws_1/documentacao.html
 * URL Webservice: https://www.hermespardini.com.br/b2b/HPWS.XMLServer.cls
 */
export const HERMES_PARDINI_SCHEMA: IntegracaoSchema = {
  // ==========================================
  // IDENTIFICAÇÃO
  // ==========================================
  slug: 'hermes-pardini',
  nome: 'Hermes Pardini Lab-to-Lab',
  descricao:
    'Integração SOAP com Hermes Pardini para envio de requisições, recebimento de laudos e gestão de exames laboratoriais',
  versao: '2.0.0',

  // ==========================================
  // CONTEXTO
  // ==========================================
  tipos_contexto: [TipoIntegracao.LABORATORIO_APOIO],

  // ==========================================
  // PROTOCOLO
  // ==========================================
  protocolo: ProtocoloIntegracao.SOAP,

  // ==========================================
  // CAMPOS DE CONFIGURAÇÃO
  // ==========================================
  campos: [
    // --- Autenticação ---
    {
      chave: 'login',
      label: 'Login',
      tipo: TipoCampo.STRING,
      obrigatorio: true,
    },
    {
      chave: 'senha',
      label: 'Senha',
      tipo: TipoCampo.PASSWORD,
      obrigatorio: true,
      criptografar: true,
    },

    // --- Ambiente ---
    {
      chave: 'ambiente',
      label: 'Ambiente',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      valorPadrao: 'producao',
      opcoes: [
        { valor: 'homologacao', label: 'Homologação' },
        { valor: 'producao', label: 'Produção' },
      ],
    },

    // --- URLs ---
    {
      chave: 'url_webservice',
      label: 'URL do Webservice',
      tipo: TipoCampo.URL,
      obrigatorio: true,
      valorPadrao: 'https://www.hermespardini.com.br/b2b/HPWS.XMLServer.cls',
    },
    {
      chave: 'url_tabela_exames',
      label: 'URL Tabela de Exames (Envio)',
      tipo: TipoCampo.URL,
      obrigatorio: false,
      valorPadrao: 'http://www.hermespardini.com.br/cal/tabexalhpV2.xml',
    },
    {
      chave: 'url_modelos_retorno',
      label: 'URL Modelos de Retorno',
      tipo: TipoCampo.URL,
      obrigatorio: false,
      valorPadrao: 'https://www.hermespardini.com.br/cal/exames/modelos.xml',
    },

    // --- Configurações de Retorno ---
    {
      chave: 'valor_referencia',
      label: 'Formato Valor de Referência',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      valorPadrao: '0',
      opcoes: [
        { valor: '0', label: 'Estruturado' },
        { valor: '1', label: 'Bloco Texto' },
        { valor: '2', label: 'Bloco Texto Individualizado' },
      ],
    },
    {
      chave: 'papel_timbrado',
      label: 'Laudo com Papel Timbrado',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      valorPadrao: '0',
      opcoes: [
        { valor: '0', label: 'Não (Laudo Simples)' },
        { valor: '1', label: 'Sim (Laudo Personalizado)' },
      ],
    },
    {
      chave: 'versao_resultado',
      label: 'Versão do Resultado',
      tipo: TipoCampo.NUMBER,
      obrigatorio: false,
      valorPadrao: 1,
      min: 1,
      max: 10,
    },

    // --- Configurações Gerais ---
    {
      chave: 'timeout',
      label: 'Timeout (segundos)',
      tipo: TipoCampo.NUMBER,
      obrigatorio: false,
      valorPadrao: 30,
      min: 5,
      max: 300,
    },
    {
      chave: 'codigo_cliente',
      label: 'Código do Cliente (LC)',
      tipo: TipoCampo.STRING,
      obrigatorio: false,
    },
  ],

  ativo: true,
};

/**
 * Endpoints do Hermes Pardini
 */
export const HERMES_PARDINI_ENDPOINTS = {
  PRODUCAO: {
    WEBSERVICE: 'https://www.hermespardini.com.br/b2b/HPWS.XMLServer.cls',
    TABELA_EXAMES: 'http://www.hermespardini.com.br/cal/tabexalhpV2.xml',
    MODELOS_RETORNO: 'https://www.hermespardini.com.br/cal/exames/modelos.xml',
    DOCUMENTACAO:
      'http://www.hermespardini.com.br/cal/hpws_1/documentacao.html',
  },
  HOMOLOGACAO: {
    WEBSERVICE:
      'https://www.hermespardini.com.br/b2bhomologa/HPWS.XMLServer.cls',
    TABELA_EXAMES: 'http://www.hermespardini.com.br/cal/tabexalhpV2.xml',
    MODELOS_RETORNO: 'https://www.hermespardini.com.br/cal/exames/modelos.xml',
    DOCUMENTACAO:
      'http://www.hermespardini.com.br/cal/hpws_1/documentacao.html',
  },
};

/**
 * Métodos SOAP disponíveis
 */
export const HERMES_PARDINI_METODOS = {
  // Envio de pedidos
  ENVIAR_PEDIDO: 'incluirPedido',
  ENVIAR_PEDIDO_LOTE: 'incluirPedidoLote',

  // Consulta de resultados
  GET_RESULTADO_PEDIDO: 'getResultadoPedido',
  GET_RESULTADO_PEDIDO_LOTE: 'getResultadoPedidoLote',

  // Cancelamentos
  CANCELAR_AMOSTRA: 'cancelaAmostra',
  CANCELAR_EXAME: 'cancelaExame',

  // Consultas
  CONSULTA_PENDENCIA_TECNICA: 'consultaPendenciaTecnica',
  CONSULTA_RASTREABILIDADE: 'consultaRastreabilidade',
  GET_GRUPO_FRACIONAMENTO: 'getGrupoFracionamento',

  // Status
  CONSULTA_STATUS_PEDIDO: 'consultaStatusPedido',
};
