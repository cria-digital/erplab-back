import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Convenio } from './convenio.entity';
import { TabelaPreco } from './tabela-preco.entity';
import { ProcedimentoAutorizado } from './procedimento-autorizado.entity';
import { Restricao } from './restricao.entity';

export enum TipoPlano {
  AMBULATORIAL = 'ambulatorial',
  HOSPITALAR = 'hospitalar',
  COMPLETO = 'completo',
  ODONTOLOGICO = 'odontologico',
}

export enum CategoriaPlano {
  BASICO = 'basico',
  INTERMEDIARIO = 'intermediario',
  PREMIUM = 'premium',
  EXECUTIVO = 'executivo',
}

export enum ModalidadePlano {
  PRE_PAGAMENTO = 'pre_pagamento',
  POS_PAGAMENTO = 'pos_pagamento',
  COPARTICIPACAO = 'coparticipacao',
}

export enum StatusPlano {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
}

export enum CoberturaGeografica {
  MUNICIPAL = 'municipal',
  ESTADUAL = 'estadual',
  NACIONAL = 'nacional',
  INTERNACIONAL = 'internacional',
}

@Entity('planos')
export class Plano {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  convenio_id: string;

  @Column({ type: 'varchar', length: 50 })
  codigo_plano: string;

  @Column({ type: 'varchar', length: 255 })
  nome_plano: string;

  @Column({ type: 'enum', enum: TipoPlano })
  tipo_plano: TipoPlano;

  @Column({ type: 'enum', enum: CategoriaPlano })
  categoria: CategoriaPlano;

  @Column({ type: 'enum', enum: ModalidadePlano })
  modalidade: ModalidadePlano;

  @Column({ type: 'date' })
  vigencia_inicio: Date;

  @Column({ type: 'date', nullable: true })
  vigencia_fim: Date;

  @Column({ type: 'enum', enum: StatusPlano, default: StatusPlano.ATIVO })
  status: StatusPlano;

  @Column({ type: 'int', default: 0 })
  carencia_dias: number;

  @Column({ type: 'enum', enum: CoberturaGeografica })
  cobertura_geografica: CoberturaGeografica;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_consulta: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_ch: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_uco: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_filme: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_coparticipacao: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  limite_mensal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  limite_anual: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Convenio, (convenio) => convenio.planos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'convenio_id' })
  convenio: Convenio;

  @OneToMany(() => TabelaPreco, (tabelaPreco) => tabelaPreco.plano)
  tabelas_preco: TabelaPreco[];

  @OneToMany(() => ProcedimentoAutorizado, (procedimento) => procedimento.plano)
  procedimentos_autorizados: ProcedimentoAutorizado[];

  @OneToMany(() => Restricao, (restricao) => restricao.plano)
  restricoes: Restricao[];
}
