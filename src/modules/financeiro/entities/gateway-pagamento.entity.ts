import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContaBancaria } from './conta-bancaria.entity';

export enum StatusGateway {
  CONECTADO = 'conectado',
  DESCONECTADO = 'desconectado',
  ERRO = 'erro',
  PENDENTE = 'pendente',
}

export enum TipoGateway {
  PAGSEGURO = 'pagseguro',
  MERCADO_PAGO = 'mercado_pago',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  CIELO = 'cielo',
  REDE = 'rede',
  STONE = 'stone',
  GETNET = 'getnet',
  OUTRO = 'outro',
}

@Entity('gateways_pagamento')
export class GatewayPagamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoGateway,
  })
  tipo: TipoGateway;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({
    type: 'enum',
    enum: StatusGateway,
    default: StatusGateway.PENDENTE,
  })
  status: StatusGateway;

  @Column({ type: 'date', nullable: true })
  validade_api: Date;

  @Column({ type: 'text', nullable: true })
  chave_api: string;

  @Column({ type: 'text', nullable: true })
  contingencia: string;

  @Column({ type: 'jsonb', nullable: true })
  configuracao: any;

  @Column({ type: 'uuid' })
  conta_bancaria_id: string;

  @ManyToOne(
    () => ContaBancaria,
    (contaBancaria) => contaBancaria.gateways_pagamento,
  )
  @JoinColumn({ name: 'conta_bancaria_id' })
  conta_bancaria: ContaBancaria;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
