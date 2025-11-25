import { IntegracaoSchema, TipoCampo, ProtocoloIntegracao } from './types';
import { TipoIntegracao } from '../entities/integracao.entity';

/**
 * Schema da integração Hermes Pardini
 *
 * Integração SOAP com o laboratório Hermes Pardini para:
 * - Envio de requisições de exames
 * - Recebimento de laudos
 * - Consulta de status
 * - Rastreamento de amostras
 */
export const HERMES_PARDINI_SCHEMA: IntegracaoSchema = {
  // ==========================================
  // IDENTIFICAÇÃO
  // ==========================================
  slug: 'hermes-pardini',
  nome: 'Hermes Pardini',
  descricao:
    'Integração SOAP com Hermes Pardini para envio de requisições e recebimento de laudos de exames laboratoriais',
  versao: '1.0.0',

  // ==========================================
  // CONTEXTO
  // ==========================================
  tipos_contexto: [TipoIntegracao.LABORATORIO_APOIO, TipoIntegracao.CONVENIOS],

  // ==========================================
  // PROTOCOLO
  // ==========================================
  protocolo: ProtocoloIntegracao.SOAP,

  // ==========================================
  // CAMPOS DE CONFIGURAÇÃO
  // ==========================================
  campos: [
    {
      chave: 'usuario',
      label: 'Usuário',
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
    {
      chave: 'ambiente',
      label: 'Ambiente',
      tipo: TipoCampo.SELECT,
      obrigatorio: true,
      valorPadrao: 'homologacao',
      opcoes: [
        { valor: 'homologacao', label: 'Homologação' },
        { valor: 'producao', label: 'Produção' },
      ],
    },
    {
      chave: 'url_wsdl',
      label: 'URL do WSDL',
      tipo: TipoCampo.URL,
      obrigatorio: false,
      valorPadrao: 'https://api.hermespardini.com.br/service?wsdl',
    },
    {
      chave: 'timeout',
      label: 'Timeout (segundos)',
      tipo: TipoCampo.NUMBER,
      obrigatorio: false,
      valorPadrao: 30,
      min: 5,
      max: 300,
    },
  ],

  ativo: true,
};
