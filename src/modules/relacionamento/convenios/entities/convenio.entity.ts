import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Plano } from './plano.entity';
import { Instrucao } from './instrucao.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

export enum TipoFaturamento {
  MENSAL = 'mensal',
  QUINZENAL = 'quinzenal',
  SEMANAL = 'semanal',
  AVULSO = 'avulso',
}

export enum StatusConvenio {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
  BLOQUEADO = 'bloqueado',
}

@Entity('convenios')
export class Convenio {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_convenio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nome: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  registro_ans: string;

  @Column({ type: 'boolean', default: false })
  tem_integracao_api: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_api: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token_api: string;

  @Column({ type: 'boolean', default: true })
  requer_autorizacao: boolean;

  @Column({ type: 'boolean', default: false })
  requer_senha: boolean;

  @Column({ type: 'int', nullable: true })
  validade_guia_dias: number;

  @Column({ type: 'enum', enum: TipoFaturamento, nullable: true })
  tipo_faturamento: TipoFaturamento;

  @Column({ type: 'varchar', length: 255, nullable: true })
  portal_envio: string;

  @Column({ type: 'int', nullable: true })
  dia_fechamento: number;

  @Column({ type: 'int', default: 30 })
  prazo_pagamento_dias: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_desconto: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tabela_precos: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contato_nome: string;

  @Column({ type: 'jsonb', nullable: true })
  regras_especificas: any;

  @Column({ type: 'enum', enum: StatusConvenio, default: StatusConvenio.ATIVO })
  status: StatusConvenio;

  @Column({ type: 'boolean', default: false })
  aceita_atendimento_online: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_coparticipacao: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_consulta: number;

  @Column({ type: 'text', nullable: true })
  observacoes_convenio: string;

  @CreateDateColumn({ name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizado_em: Date;

  @OneToMany(() => Plano, (plano) => plano.convenio)
  planos: Plano[];

  @OneToMany(() => Instrucao, (instrucao) => instrucao.convenio)
  instrucoes: Instrucao[];
}
