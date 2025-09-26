import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ContaBancaria } from './conta-bancaria.entity';
import { RestricaoAdquirente } from './restricao-adquirente.entity';

export enum StatusAdquirente {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
}

export enum OpcaoParcelamento {
  '12X' = '12x',
  '6X' = '6x',
  '3X' = '3x',
  'AVISTA' = 'avista',
}

export enum TipoCartao {
  MASTERCARD = 'mastercard',
  VISA = 'visa',
  ELO = 'elo',
  AMERICAN_EXPRESS = 'american_express',
  HIPERCARD = 'hipercard',
  DINERS = 'diners',
  OUTRO = 'outro',
}

@Entity('adquirentes')
export class Adquirente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 255 })
  nome_adquirente: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusAdquirente,
    default: StatusAdquirente.ATIVO,
  })
  status: StatusAdquirente;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  tipos_cartao_suportados: TipoCartao[];

  @Column({
    type: 'enum',
    enum: OpcaoParcelamento,
    default: OpcaoParcelamento['12X'],
  })
  opcao_parcelamento: OpcaoParcelamento;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 1,
  })
  taxa_transacao: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 3,
  })
  taxa_parcelamento: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 10,
  })
  percentual_repasse: number;

  @Column({ type: 'integer', default: 5 })
  prazo_repasse: number;

  @Column({ type: 'uuid', nullable: true })
  conta_associada_id: string;

  @ManyToOne(() => ContaBancaria)
  @JoinColumn({ name: 'conta_associada_id' })
  conta_associada: ContaBancaria;

  @OneToMany(() => RestricaoAdquirente, (restricao) => restricao.adquirente)
  restricoes: RestricaoAdquirente[];

  @Column({ type: 'jsonb', nullable: true })
  configuracao_integracao: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
