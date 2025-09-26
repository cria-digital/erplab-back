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
  INVESTIMENTO = 'investimento',
}

export enum StatusConta {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  BLOQUEADO = 'bloqueado',
}

@Entity('contas_bancarias')
export class ContaBancaria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 20 })
  agencia: string;

  @Column({ type: 'varchar', length: 20 })
  numero_conta: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  digito_verificador: string;

  @Column({
    type: 'enum',
    enum: TipoConta,
    default: TipoConta.CORRENTE,
  })
  tipo_conta: TipoConta;

  @Column({ type: 'varchar', length: 50, nullable: true })
  chave_pix: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusConta,
    default: StatusConta.ATIVO,
  })
  status: StatusConta;

  @Column({ type: 'boolean', default: false })
  conta_principal: boolean;

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
