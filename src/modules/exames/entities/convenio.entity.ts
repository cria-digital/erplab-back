import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('convenios')
@Index(['codigo'])
@Index(['nome'])
@Index(['cnpj'])
export class Convenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Código interno do convênio',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Nome do convênio',
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
    comment: 'CNPJ do convênio',
  })
  cnpj: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Registro ANS',
  })
  registro_ans: string;

  // Configurações de integração
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
    comment: 'URL da API do convênio',
  })
  url_api: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Token/chave de acesso',
  })
  token_api: string;

  // Configurações de autorização
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se requer autorização prévia',
  })
  requer_autorizacao: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se requer senha de autorização',
  })
  requer_senha: boolean;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Validade padrão da guia em dias',
  })
  validade_guia_dias: number;

  // Configurações de faturamento
  @Column({
    type: 'enum',
    enum: ['tiss', 'proprio', 'manual'],
    default: 'tiss',
    comment: 'Tipo de faturamento',
  })
  tipo_faturamento: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Portal de envio (SAVI, Orizon, etc)',
  })
  portal_envio: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Dia de fechamento do faturamento',
  })
  dia_fechamento: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Prazo de pagamento em dias',
  })
  prazo_pagamento_dias: number;

  // Tabela de preços
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: 'Percentual de desconto padrão',
  })
  percentual_desconto: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Tabela de preços utilizada',
  })
  tabela_precos: string;

  // Contato
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Telefone de contato',
  })
  telefone: string;

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

  // Observações
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações gerais',
  })
  observacoes: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Regras específicas do convênio',
  })
  regras_especificas: any;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
    comment: 'Status do convênio',
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
}
