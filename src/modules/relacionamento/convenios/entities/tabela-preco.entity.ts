import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plano } from './plano.entity';

export enum TipoTabela {
  TUSS = 'tuss',
  CBHPM = 'cbhpm',
  PROPRIA = 'propria',
  BRASINDICE = 'brasindice',
  SIMPRO = 'simpro',
}

@Entity('tabelas_preco')
export class TabelaPreco {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  plano_id: string;

  @Column({ type: 'varchar', length: 50 })
  codigo_tabela: string;

  @Column({ type: 'varchar', length: 255 })
  descricao: string;

  @Column({ type: 'enum', enum: TipoTabela })
  tipo_tabela: TipoTabela;

  @Column({ type: 'varchar', length: 20, nullable: true })
  versao: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  edicao: string;

  @Column({ type: 'date' })
  data_vigencia: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentual_desconto: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentual_acrescimo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_ch: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_uco: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_porte_anestesico: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_filme: number;

  @Column({ type: 'boolean', default: true })
  ativa: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Plano, (plano) => plano.tabelas_preco, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plano_id' })
  plano: Plano;
}
