import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Plano } from './plano.entity';
import { Instrucao } from './instrucao.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';

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

@Entity('convenios')
export class Convenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_convenio: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  registro_ans: string;

  @Column({ type: 'enum', enum: TipoConvenio })
  tipo_convenio: TipoConvenio;

  @Column({ type: 'enum', enum: Modalidade })
  modalidade: Modalidade;

  @Column({ type: 'int', default: 30 })
  prazo_pagamento: number;

  @Column({ type: 'int', nullable: true })
  dia_vencimento: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email_faturamento: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pix_key: string;

  @Column({ type: 'text', nullable: true })
  observacoes_convenio: string;

  @Column({ type: 'date', nullable: true })
  data_contrato: Date;

  @Column({ type: 'date', nullable: true })
  data_vigencia_inicio: Date;

  @Column({ type: 'date', nullable: true })
  data_vigencia_fim: Date;

  @Column({ type: 'boolean', default: true })
  requer_autorizacao: boolean;

  @Column({ type: 'boolean', default: false })
  aceita_atendimento_online: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_coparticipacao: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_consulta: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Plano, (plano) => plano.convenio)
  planos: Plano[];

  @OneToMany(() => Instrucao, (instrucao) => instrucao.convenio)
  instrucoes: Instrucao[];
}
