import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';

export enum TipoIntegracao {
  LABORATORIO_APOIO = 'laboratorio_apoio',
  TELEMEDICINA = 'telemedicina',
  GATEWAY_PAGAMENTO = 'gateway_pagamento',
  BANCO = 'banco',
  PREFEITURA_NFSE = 'prefeitura_nfse',
  SEFAZ = 'sefaz',
  RECEITA_FEDERAL = 'receita_federal',
  POWER_BI = 'power_bi',
  PABX = 'pabx',
  CORREIOS = 'correios',
  OCR = 'ocr',
  CONVENIOS = 'convenios',
  ADQUIRENTES = 'adquirentes',
  PACS = 'pacs',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  CONCESSIONARIAS = 'concessionarias',
  OUTROS = 'outros',
}

export enum StatusIntegracao {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
  EM_CONFIGURACAO = 'em_configuracao',
  ERRO = 'erro',
  MANUTENCAO = 'manutencao',
}

export enum PadraosComunicacao {
  REST_API = 'rest_api',
  SOAP = 'soap',
  GRAPHQL = 'graphql',
  WEBHOOK = 'webhook',
  FTP = 'ftp',
  SFTP = 'sftp',
  EMAIL = 'email',
  DATABASE = 'database',
  FILE = 'file',
  MANUAL = 'manual',
}

export enum FormatoRetorno {
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
  TXT = 'txt',
  PDF = 'pdf',
  HTML = 'html',
  BINARY = 'binary',
}

@Entity('integracoes')
@Index(['tipoIntegracao', 'unidadeSaudeId'])
@Index(['codigoIdentificacao'])
@Index(['status'])
export class Integracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoIntegracao,
    name: 'tipo_integracao',
  })
  tipoIntegracao: TipoIntegracao;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_integracao',
  })
  nomeIntegracao: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'descricao_api',
    nullable: true,
  })
  descricaoApi: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'codigo_identificacao',
    unique: true,
  })
  codigoIdentificacao: string;

  @Column({
    type: 'uuid',
    name: 'unidade_saude_id',
    nullable: true,
  })
  unidadeSaudeId: string;

  @ManyToOne(() => UnidadeSaude, { nullable: true })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;

  // Informações específicas da integração
  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_api_exames',
    nullable: true,
  })
  urlApiExames: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_api_guia_exames',
    nullable: true,
  })
  urlApiGuiaExames: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'token_autenticacao',
    nullable: true,
  })
  tokenAutenticacao: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'chave_api',
    nullable: true,
  })
  chaveApi: string;

  @Column({
    type: 'enum',
    enum: PadraosComunicacao,
    name: 'padrao_comunicacao',
    nullable: true,
  })
  padraoComunicacao: PadraosComunicacao;

  @Column({
    type: 'enum',
    enum: FormatoRetorno,
    name: 'formato_retorno',
    nullable: true,
  })
  formatoRetorno: FormatoRetorno;

  // Campos específicos por tipo
  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_laboratorio',
    nullable: true,
  })
  nomeLaboratorio: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_prefeitura',
    nullable: true,
  })
  nomePrefeitura: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_banco',
    nullable: true,
  })
  nomeBanco: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_gateway',
    nullable: true,
  })
  nomeGateway: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_convenio',
    nullable: true,
  })
  nomeConvenio: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_adquirente',
    nullable: true,
  })
  nomeAdquirente: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_concessionaria',
    nullable: true,
  })
  nomeConcessionaria: string;

  // URLs e endpoints adicionais
  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_base',
    nullable: true,
  })
  urlBase: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_autenticacao',
    nullable: true,
  })
  urlAutenticacao: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_consulta',
    nullable: true,
  })
  urlConsulta: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_envio',
    nullable: true,
  })
  urlEnvio: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_callback',
    nullable: true,
  })
  urlCallback: string;

  // Credenciais adicionais
  @Column({
    type: 'varchar',
    length: 255,
    name: 'usuario',
    nullable: true,
  })
  usuario: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'senha',
    nullable: true,
  })
  senha: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'certificado_digital',
    nullable: true,
  })
  certificadoDigital: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'senha_certificado',
    nullable: true,
  })
  senhaCertificado: string;

  // Configurações específicas
  @Column({
    type: 'jsonb',
    name: 'configuracoes_adicionais',
    nullable: true,
  })
  configuracoesAdicionais: any;

  @Column({
    type: 'jsonb',
    name: 'headers_customizados',
    nullable: true,
  })
  headersCustomizados: any;

  @Column({
    type: 'jsonb',
    name: 'parametros_conexao',
    nullable: true,
  })
  parametrosConexao: any;

  // Controle e monitoramento
  @Column({
    type: 'enum',
    enum: StatusIntegracao,
    default: StatusIntegracao.EM_CONFIGURACAO,
  })
  status: StatusIntegracao;

  @Column({
    type: 'boolean',
    default: true,
  })
  ativo: boolean;

  @Column({
    type: 'timestamp',
    name: 'ultima_sincronizacao',
    nullable: true,
  })
  ultimaSincronizacao: Date;

  @Column({
    type: 'timestamp',
    name: 'ultima_tentativa',
    nullable: true,
  })
  ultimaTentativa: Date;

  @Column({
    type: 'int',
    name: 'tentativas_falhas',
    default: 0,
  })
  tentativasFalhas: number;

  @Column({
    type: 'text',
    name: 'ultimo_erro',
    nullable: true,
  })
  ultimoErro: string;

  @Column({
    type: 'int',
    name: 'timeout_segundos',
    default: 30,
  })
  timeoutSegundos: number;

  @Column({
    type: 'int',
    name: 'intervalo_sincronizacao_minutos',
    nullable: true,
  })
  intervaloSincronizacaoMinutos: number;

  // Limites e controles
  @Column({
    type: 'int',
    name: 'limite_requisicoes_dia',
    nullable: true,
  })
  limiteRequisicoesDia: number;

  @Column({
    type: 'int',
    name: 'requisicoes_hoje',
    default: 0,
  })
  requisicoesHoje: number;

  @Column({
    type: 'date',
    name: 'data_reset_contador',
    nullable: true,
  })
  dataResetContador: Date;

  // Auditoria
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  observacoes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'created_by',
    nullable: true,
  })
  createdBy: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'updated_by',
    nullable: true,
  })
  updatedBy: string;
}
