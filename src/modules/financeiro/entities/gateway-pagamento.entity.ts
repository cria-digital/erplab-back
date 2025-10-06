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

export enum TipoGateway {
  CIELO = 'cielo',
  REDE = 'rede',
  GETNET = 'getnet',
  STONE = 'stone',
  PAGSEGURO = 'pagseguro',
  MERCADOPAGO = 'mercadopago',
  PAGARME = 'pagarme',
  IFOOD = 'ifood',
  RAPPI = 'rappi',
  OUTRO = 'outro',
}

export enum ModalidadeGateway {
  CREDITO = 'credito',
  DEBITO = 'debito',
  PIX = 'pix',
  BOLETO = 'boleto',
  TODOS = 'todos',
}

export enum AmbienteGateway {
  PRODUCAO = 'producao',
  HOMOLOGACAO = 'homologacao',
  TESTE = 'teste',
}

export enum StatusGateway {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
  EM_CONFIGURACAO = 'em_configuracao',
}

@Entity('gateways_pagamento')
export class GatewayPagamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conta_bancaria_id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 255 })
  nome_gateway: string;

  @Column({
    type: 'enum',
    enum: TipoGateway,
  })
  tipo_gateway: TipoGateway;

  @Column({
    type: 'enum',
    enum: ModalidadeGateway,
    default: ModalidadeGateway.TODOS,
  })
  modalidade: ModalidadeGateway;

  @Column({ type: 'varchar', length: 100, nullable: true })
  merchant_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  merchant_key: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  api_key: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  api_secret: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  webhook_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  webhook_secret: string;

  @Column({
    type: 'enum',
    enum: AmbienteGateway,
    default: AmbienteGateway.TESTE,
  })
  ambiente: AmbienteGateway;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_credito: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_debito: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_pix: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_boleto: number;

  @Column({ type: 'int', default: 1 })
  prazo_recebimento: number;

  @Column({
    type: 'enum',
    enum: StatusGateway,
    default: StatusGateway.EM_CONFIGURACAO,
  })
  status: StatusGateway;

  @Column({ type: 'jsonb', nullable: true })
  configuracao_adicional: any;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

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
