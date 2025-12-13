import { IntegracaoSchema, TipoCampo, ProtocoloIntegracao } from './types';
import { TipoIntegracao } from '../entities/integracao.entity';

/**
 * Schema da integração DB Diagnósticos (Diagnósticos do Brasil)
 *
 * Integração SOAP com o laboratório de apoio DB para:
 * - Envio de pedidos/requisições de exames
 * - Recebimento de laudos/resultados
 * - Consulta de status e rastreabilidade
 * - Cancelamento de exames
 * - Consulta de pendências técnicas
 * - Reimpressão de etiquetas
 *
 * WSDL Produção: https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl
 * WSDL Homologação: https://wsmb.diagnosticosdobrasil.com.br/dbsynchomol/wsrvProtocoloDBSync.dbsync.svc?wsdl
 */
export const DB_DIAGNOSTICOS_SCHEMA: IntegracaoSchema = {
  // ==========================================
  // IDENTIFICAÇÃO
  // ==========================================
  slug: 'db-diagnosticos',
  nome: 'DB Diagnósticos (Diagnósticos do Brasil)',
  descricao:
    'Integração SOAP com DB Diagnósticos para envio de requisições, recebimento de laudos e gestão de exames laboratoriais',
  versao: '1.0.0',

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
      chave: 'codigo_apoiado',
      label: 'Código Apoiado',
      tipo: TipoCampo.STRING,
      obrigatorio: true,
    },
    {
      chave: 'senha_integracao',
      label: 'Senha de Integração',
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
      chave: 'wsdl_url',
      label: 'URL do WSDL',
      tipo: TipoCampo.URL,
      obrigatorio: true,
      valorPadrao:
        'https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl',
    },

    // --- Configurações de Conexão ---
    {
      chave: 'timeout',
      label: 'Timeout (milissegundos)',
      tipo: TipoCampo.NUMBER,
      obrigatorio: false,
      valorPadrao: 60000,
      min: 5000,
      max: 300000,
    },

    // --- Configurações Opcionais ---
    {
      chave: 'posto_coleta',
      label: 'Código Posto de Coleta',
      tipo: TipoCampo.STRING,
      obrigatorio: false,
    },
    {
      chave: 'uso_apoiado',
      label: 'Uso Apoiado (identificador)',
      tipo: TipoCampo.STRING,
      obrigatorio: false,
    },
  ],

  ativo: true,
};

/**
 * Endpoints do DB Diagnósticos por ambiente
 */
export const DB_DIAGNOSTICOS_ENDPOINTS = {
  PRODUCAO: {
    WSDL: 'https://wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc?wsdl',
  },
  HOMOLOGACAO: {
    WSDL: 'https://wsmb.diagnosticosdobrasil.com.br/dbsynchomol/wsrvProtocoloDBSync.dbsync.svc?wsdl',
  },
};

/**
 * Métodos SOAP disponíveis no DB Diagnósticos
 */
export const DB_DIAGNOSTICOS_METODOS = {
  // Envio de pedidos
  RECEBE_ATENDIMENTO: 'RecebeAtendimento',

  // Consulta de resultados
  ENVIA_LAUDO_ATENDIMENTO: 'EnviaLaudoAtendimento',
  ENVIA_LAUDO_ATENDIMENTO_LISTA: 'EnviaLaudoAtendimentoLista',
  ENVIA_LAUDO_ATENDIMENTO_POR_PERIODO: 'EnviaLaudoAtendimentoPorPeriodo',
  ENVIA_LOTE_RESULTADOS: 'EnviaLoteResultados',
  ENVIA_RESULTADO_BASE64: 'EnviaResultadoBase64',

  // Consultas de status
  CONSULTA_STATUS_ATENDIMENTO: 'ConsultaStatusAtendimento',

  // Amostras e etiquetas
  ENVIA_AMOSTRAS: 'EnviaAmostras',
  ENVIA_AMOSTRAS_PROCEDIMENTOS_PENDENTES: 'EnviaAmostrasProcedimentosPendentes',

  // Pendências
  LISTA_PROCEDIMENTOS_PENDENTES: 'ListaProcedimentosPendentes',

  // Relatórios
  RELATORIO_REQUISICOES_ENVIADAS: 'RelatorioRequisicoesEnviadas',

  // Consulta de procedimentos
  BUSCA_PROCEDIMENTOS: 'BuscaProcedimentos',
};

/**
 * Interface para configuração tipada do DB Diagnósticos
 */
export interface DbDiagnosticosConfigValues {
  codigoApoiado: string;
  senhaIntegracao: string;
  ambiente: 'homologacao' | 'producao';
  wsdlUrl: string;
  timeout: number;
  postoColeta?: string;
  usoApoiado?: string;
}

/**
 * Converte configurações do banco para objeto tipado
 */
export function parseDbDiagnosticosConfig(
  configuracoes: Array<{ chave: string; valor: string }>,
): DbDiagnosticosConfigValues {
  const configMap = new Map(configuracoes.map((c) => [c.chave, c.valor]));

  const ambiente = (configMap.get('ambiente') ||
    'producao') as DbDiagnosticosConfigValues['ambiente'];

  // Determina URL com base no ambiente se não especificada
  const defaultWsdl =
    ambiente === 'homologacao'
      ? DB_DIAGNOSTICOS_ENDPOINTS.HOMOLOGACAO.WSDL
      : DB_DIAGNOSTICOS_ENDPOINTS.PRODUCAO.WSDL;

  return {
    codigoApoiado: configMap.get('codigo_apoiado') || '',
    senhaIntegracao: configMap.get('senha_integracao') || '',
    ambiente,
    wsdlUrl: configMap.get('wsdl_url') || defaultWsdl,
    timeout: parseInt(configMap.get('timeout') || '60000', 10),
    postoColeta: configMap.get('posto_coleta'),
    usoApoiado: configMap.get('uso_apoiado'),
  };
}
