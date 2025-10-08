import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Plano } from './plano.entity';
import { Instrucao } from './instrucao.entity';

export enum TipoConvenio {
  PLANO_SAUDE = 'plano_saude',
  PARTICULAR = 'particular',
  SUS = 'sus',
  COOPERATIVA = 'cooperativa',
  OUTRO = 'outro',
}

export enum Modalidade {
  PRE_PAGAMENTO = 'pre_pagamento',
  POS_PAGAMENTO = 'pos_pagamento',
  COPARTICIPACAO = 'coparticipacao',
}

export enum FormaPagamento {
  BOLETO = 'boleto',
  TRANSFERENCIA = 'transferencia',
  DEPOSITO = 'deposito',
  PIX = 'pix',
}

@Entity('convenios')
export class Convenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  razao_social: string;

  @Column({ type: 'varchar', length: 255 })
  nome_fantasia: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscricao_estadual: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscricao_municipal: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  registro_ans: string;

  @Column({ type: 'enum', enum: TipoConvenio })
  tipo_convenio: TipoConvenio;

  @Column({ type: 'enum', enum: Modalidade })
  modalidade: Modalidade;

  @Column({ type: 'varchar', length: 255 })
  endereco: string;

  @Column({ type: 'varchar', length: 10 })
  numero: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento: string;

  @Column({ type: 'varchar', length: 100 })
  bairro: string;

  @Column({ type: 'varchar', length: 100 })
  cidade: string;

  @Column({ type: 'char', length: 2 })
  uf: string;

  @Column({ type: 'varchar', length: 8 })
  cep: string;

  @Column({ type: 'varchar', length: 20 })
  telefone_principal: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone_secundario: string;

  @Column({ type: 'varchar', length: 255 })
  email_principal: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email_faturamento: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'int', default: 30 })
  prazo_pagamento: number;

  @Column({ type: 'int', nullable: true })
  dia_vencimento: number;

  @Column({ type: 'enum', enum: FormaPagamento })
  forma_pagamento: FormaPagamento;

  @Column({ type: 'varchar', length: 100, nullable: true })
  banco: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  agencia: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  conta: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pix_key: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'date', nullable: true })
  data_contrato: Date;

  @Column({ type: 'date', nullable: true })
  data_vigencia_inicio: Date;

  @Column({ type: 'date', nullable: true })
  data_vigencia_fim: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Plano, (plano) => plano.convenio)
  planos: Plano[];

  @OneToMany(() => Instrucao, (instrucao) => instrucao.convenio)
  instrucoes: Instrucao[];
}
