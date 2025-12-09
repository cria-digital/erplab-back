import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Parcela } from './parcela.entity';
import { ContaBancaria } from '../../entities/conta-bancaria.entity';
import { FormaPagamentoParcela } from '../enums/contas-pagar.enum';

import { Tenant } from '../../../../tenants/entities/tenant.entity';
@Entity('pagamentos_parcelas')
export class PagamentoParcela {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parcela_id', type: 'uuid', unique: true })
  parcelaId: string;

  @OneToOne(() => Parcela, (parcela) => parcela.pagamento)
  @JoinColumn({ name: 'parcela_id' })
  parcela: Parcela;

  @Column({
    name: 'forma_pagamento',
    type: 'enum',
    enum: FormaPagamentoParcela,
  })
  formaPagamento: FormaPagamentoParcela;

  @Column({ name: 'conta_bancaria_id', type: 'uuid', nullable: true })
  contaBancariaId: string;

  @ManyToOne(() => ContaBancaria, { nullable: true })
  @JoinColumn({ name: 'conta_bancaria_id' })
  contaBancaria: ContaBancaria;

  @Column({
    name: 'codigo_barras',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  codigoBarras: string;

  @Column({ name: 'chave_pix', type: 'varchar', length: 255, nullable: true })
  chavePix: string;

  @Column({ name: 'dados_bancarios', type: 'jsonb', nullable: true })
  dadosBancarios: any;

  @Column({ name: 'informacoes_adicionais', type: 'jsonb', nullable: true })
  informacoesAdicionais: any;

  @Column({
    name: 'comprovante_path',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  comprovantePath: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
