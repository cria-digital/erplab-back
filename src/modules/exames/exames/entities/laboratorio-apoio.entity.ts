import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../../../tenants/entities/tenant.entity';

@Entity('laboratorios_apoio')
@Index(['codigo'])
@Index(['nome'])
export class LaboratorioApoio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Código do laboratório',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Nome do laboratório (DB, Hermes Pardini, etc)',
  })
  nome: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Razão social',
  })
  razao_social: string;

  @Column({
    type: 'varchar',
    length: 14,
    nullable: true,
    comment: 'CNPJ',
  })
  cnpj: string;

  // Integração
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se tem integração via API',
  })
  tem_integracao_api: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL da API',
  })
  url_api: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Usuário/login da API',
  })
  usuario_api: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Senha/token da API',
  })
  senha_api: string;

  // Configurações de envio
  @Column({
    type: 'enum',
    enum: ['api', 'portal', 'email', 'manual'],
    default: 'manual',
    comment: 'Forma de envio de amostras',
  })
  forma_envio: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Portal web do laboratório',
  })
  url_portal: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'E-mail para envio',
  })
  email_envio: string;

  // Logística
  @Column({
    type: 'time',
    nullable: true,
    comment: 'Horário de coleta das amostras',
  })
  horario_coleta: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Dias da semana de coleta',
  })
  dias_coleta: any;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Responsável pela coleta/transporte',
  })
  responsavel_coleta: string;

  // Prazos
  @Column({
    type: 'int',
    nullable: true,
    comment: 'Prazo padrão em dias úteis',
  })
  prazo_padrao_dias: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se aceita urgências',
  })
  aceita_urgencia: boolean;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Prazo de urgência em horas',
  })
  prazo_urgencia_horas: number;

  // Financeiro
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: 'Percentual de desconto',
  })
  percentual_desconto: number;

  @Column({
    type: 'enum',
    enum: ['mensal', 'quinzenal', 'semanal'],
    default: 'mensal',
    comment: 'Periodicidade de faturamento',
  })
  periodicidade_faturamento: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Prazo de pagamento em dias',
  })
  prazo_pagamento_dias: number;

  // Contato
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Telefone comercial',
  })
  telefone: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'WhatsApp',
  })
  whatsapp: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'E-mail de contato',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Pessoa de contato',
  })
  contato_nome: string;

  // Configurações específicas
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Mapeamento de códigos de exames',
  })
  mapeamento_exames: any;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Configurações adicionais',
  })
  configuracoes: any;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações',
  })
  observacoes: string;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
    comment: 'Status',
  })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação',
  })
  criado_em: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data de atualização',
  })
  atualizado_em: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
