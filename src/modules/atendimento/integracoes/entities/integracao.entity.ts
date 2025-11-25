import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { IntegracaoConfiguracao } from './integracao-configuracao.entity';

/**
 * Tipos de contexto onde a integração pode aparecer
 * Uma integração pode ter múltiplos tipos
 */
export enum TipoIntegracao {
  LABORATORIO_APOIO = 'laboratorio_apoio',
  CONVENIOS = 'convenios',
  TELEMEDICINA = 'telemedicina',
  BANCO = 'banco',
  GATEWAY_PAGAMENTO = 'gateway_pagamento',
  NFSE = 'nfse',
  SEFAZ = 'sefaz',
  RECEITA_FEDERAL = 'receita_federal',
  POWER_BI = 'power_bi',
  PABX = 'pabx',
  CORREIOS = 'correios',
  OCR = 'ocr',
  ADQUIRENTES = 'adquirentes',
  PACS = 'pacs',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  CONCESSIONARIAS = 'concessionarias',
  OUTROS = 'outros',
}

/**
 * Status da integração
 */
export enum StatusIntegracao {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
  EM_CONFIGURACAO = 'em_configuracao',
  ERRO = 'erro',
  MANUTENCAO = 'manutencao',
}

/**
 * Entidade Integracao
 *
 * Representa uma INSTÂNCIA configurada de uma integração.
 * O schema de campos vem do código (schemas/*.ts).
 * As configurações (valores) ficam na tabela integracao_configuracoes (chave-valor).
 */
@Entity('integracoes')
@Index(['templateSlug'])
@Index(['unidadeSaudeId'])
@Index(['codigoIdentificacao'])
@Index(['status'])
@Index('idx_integracoes_tipos_contexto', { synchronize: false }) // GIN index para array
export class Integracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ==========================================
  // IDENTIFICAÇÃO DA INTEGRAÇÃO
  // ==========================================

  /**
   * Slug do template/schema no código
   * Ex: 'hermes-pardini', 'santander-api', 'orizon-tiss'
   */
  @Column({
    type: 'varchar',
    length: 100,
    name: 'template_slug',
    comment: 'Slug do schema no código (ex: hermes-pardini)',
  })
  templateSlug: string;

  /**
   * Código único da INSTÂNCIA
   * Ex: 'HP-UNIDADE-CENTRO-01', 'SANT-MATRIZ-01'
   */
  @Column({
    type: 'varchar',
    length: 100,
    name: 'codigo_identificacao',
    unique: true,
    comment: 'Código único da instância da integração',
  })
  codigoIdentificacao: string;

  /**
   * Nome dado a esta instância
   * Ex: 'Hermes Pardini - Unidade Centro'
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'nome_instancia',
    comment: 'Nome descritivo desta instância',
  })
  nomeInstancia: string;

  /**
   * Descrição opcional
   */
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descrição adicional da integração',
  })
  descricao: string;

  // ==========================================
  // CONTEXTO
  // ==========================================

  /**
   * Array de tipos onde esta integração aparece
   * Ex: ['laboratorio_apoio', 'convenios']
   * Permite que Hermes Pardini apareça tanto em Labs quanto em Convênios
   */
  @Column({
    type: 'text',
    array: true,
    name: 'tipos_contexto',
    comment: 'Contextos onde a integração está disponível',
  })
  tiposContexto: TipoIntegracao[];

  // ==========================================
  // RELACIONAMENTOS
  // ==========================================

  @Column({
    type: 'uuid',
    name: 'unidade_saude_id',
    nullable: true,
    comment: 'Unidade de saúde vinculada',
  })
  unidadeSaudeId: string;

  @ManyToOne(() => UnidadeSaude, { nullable: true })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;

  @Column({
    type: 'uuid',
    name: 'empresa_id',
    nullable: true,
    comment: 'Empresa vinculada (para multi-tenant futuro)',
  })
  empresaId: string;

  /**
   * Relacionamento com configurações (chave-valor)
   */
  @OneToMany(() => IntegracaoConfiguracao, (config) => config.integracao, {
    cascade: true,
  })
  configuracoes: IntegracaoConfiguracao[];

  // ==========================================
  // CONTROLE E MONITORAMENTO
  // ==========================================

  @Column({
    type: 'enum',
    enum: StatusIntegracao,
    default: StatusIntegracao.EM_CONFIGURACAO,
    comment: 'Status atual da integração',
  })
  status: StatusIntegracao;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Integração ativa?',
  })
  ativo: boolean;

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  @Column({
    type: 'timestamp',
    name: 'ultima_sincronizacao',
    nullable: true,
    comment: 'Última sincronização bem-sucedida',
  })
  ultimaSincronizacao: Date;

  @Column({
    type: 'timestamp',
    name: 'ultima_tentativa',
    nullable: true,
    comment: 'Última tentativa de conexão',
  })
  ultimaTentativa: Date;

  @Column({
    type: 'int',
    name: 'tentativas_falhas',
    default: 0,
    comment: 'Contador de tentativas falhadas',
  })
  tentativasFalhas: number;

  @Column({
    type: 'text',
    name: 'ultimo_erro',
    nullable: true,
    comment: 'Última mensagem de erro',
  })
  ultimoErro: string;

  @Column({
    type: 'int',
    name: 'requisicoes_hoje',
    default: 0,
    comment: 'Contador de requisições do dia',
  })
  requisicoesHoje: number;

  @Column({
    type: 'date',
    name: 'data_reset_contador',
    nullable: true,
    comment: 'Data do último reset do contador',
  })
  dataResetContador: Date;

  // ==========================================
  // LIMITES E CONFIGURAÇÕES
  // ==========================================

  @Column({
    type: 'int',
    name: 'timeout_segundos',
    default: 30,
    comment: 'Timeout padrão em segundos',
  })
  timeoutSegundos: number;

  @Column({
    type: 'int',
    name: 'intervalo_sincronizacao_minutos',
    nullable: true,
    comment: 'Intervalo de sincronização automática',
  })
  intervaloSincronizacaoMinutos: number;

  @Column({
    type: 'int',
    name: 'limite_requisicoes_dia',
    nullable: true,
    comment: 'Limite de requisições por dia',
  })
  limiteRequisicoesDia: number;

  // ==========================================
  // AUDITORIA
  // ==========================================

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações gerais',
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
