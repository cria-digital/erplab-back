import { TipoIntegracao } from '../entities/integracao.entity';

/**
 * Tipos de campos disponíveis nos schemas
 */
export enum TipoCampo {
  STRING = 'string',
  NUMBER = 'number',
  PASSWORD = 'password',
  EMAIL = 'email',
  URL = 'url',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  JSON = 'json',
}

/**
 * Protocolo de comunicação da integração
 */
export enum ProtocoloIntegracao {
  REST = 'REST',
  SOAP = 'SOAP',
  GRAPHQL = 'GRAPHQL',
  FTP = 'FTP',
  SFTP = 'SFTP',
  EMAIL = 'EMAIL',
  WEBHOOK = 'WEBHOOK',
}

/**
 * Opção de um campo do tipo SELECT
 */
export interface OpcaoSelect {
  valor: string;
  label: string;
  descricao?: string;
}

/**
 * Definição de um campo do schema
 */
export interface CampoSchema {
  // Obrigatórios
  chave: string;
  label: string;
  tipo: TipoCampo;
  obrigatorio: boolean;

  // Opcionais
  valorPadrao?: any;
  opcoes?: OpcaoSelect[];
  criptografar?: boolean;
  min?: number;
  max?: number;
}

/**
 * Schema completo de uma integração
 */
export interface IntegracaoSchema {
  slug: string;
  nome: string;
  descricao: string;
  versao: string;
  tipos_contexto: TipoIntegracao[];
  protocolo: ProtocoloIntegracao;
  campos: CampoSchema[];
  ativo: boolean;
}
