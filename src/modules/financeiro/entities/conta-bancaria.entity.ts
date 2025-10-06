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
import { Banco } from './banco.entity';
import { GatewayPagamento } from './gateway-pagamento.entity';
import { UnidadeSaude } from '../../unidade-saude/entities/unidade-saude.entity';

export enum TipoConta {
  CORRENTE = 'corrente',
  POUPANCA = 'poupanca',
  PAGAMENTO = 'pagamento',
  SALARIO = 'salario',
  INVESTIMENTO = 'investimento',
}

export enum StatusConta {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
  BLOQUEADA = 'bloqueada',
  ENCERRADA = 'encerrada',
}

@Entity('contas_bancarias')
export class ContaBancaria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 255 })
  nome_conta: string;

  @Column({
    type: 'enum',
    enum: TipoConta,
    default: TipoConta.CORRENTE,
  })
  tipo_conta: TipoConta;

  @Column({ type: 'varchar', length: 10 })
  agencia: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  digito_agencia: string;

  @Column({ type: 'varchar', length: 20 })
  numero_conta: string;

  @Column({ type: 'varchar', length: 2 })
  digito_conta: string;

  @Column({ type: 'varchar', length: 255 })
  titular: string;

  @Column({ type: 'varchar', length: 20 })
  cpf_cnpj_titular: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pix_tipo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pix_chave: string;

  @Column({
    type: 'enum',
    enum: StatusConta,
    default: StatusConta.ATIVA,
  })
  status: StatusConta;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  saldo_inicial: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'uuid' })
  banco_id: string;

  @ManyToOne(() => Banco, (banco) => banco.contas)
  @JoinColumn({ name: 'banco_id' })
  banco: Banco;

  @Column({ type: 'uuid' })
  unidade_saude_id: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_saude_id' })
  unidade_saude: UnidadeSaude;

  @OneToMany(() => GatewayPagamento, (gateway) => gateway.conta_bancaria)
  gateways_pagamento: GatewayPagamento[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
