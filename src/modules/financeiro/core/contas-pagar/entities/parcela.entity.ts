import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ContaPagar } from './conta-pagar.entity';
import { PagamentoParcela } from './pagamento-parcela.entity';
import { StatusParcela } from '../enums/contas-pagar.enum';

import { Tenant } from '../../../../tenants/entities/tenant.entity';
@Entity('parcelas')
@Index(['contaPagarId', 'numeroParcela'])
export class Parcela {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conta_pagar_id', type: 'uuid' })
  contaPagarId: string;

  @ManyToOne(() => ContaPagar, (conta) => conta.parcelas)
  @JoinColumn({ name: 'conta_pagar_id' })
  contaPagar: ContaPagar;

  @Column({ name: 'numero_parcela', type: 'int' })
  numeroParcela: number;

  @Column({ name: 'total_parcelas', type: 'int' })
  totalParcelas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ name: 'data_vencimento', type: 'date' })
  dataVencimento: Date;

  @Column({ name: 'data_pagamento', type: 'date', nullable: true })
  dataPagamento: Date;

  @Column({ name: 'data_agendamento', type: 'date', nullable: true })
  dataAgendamento: Date;

  @Column({
    type: 'enum',
    enum: StatusParcela,
    default: StatusParcela.PENDENTE,
  })
  status: StatusParcela;

  @OneToOne(() => PagamentoParcela, (pag) => pag.parcela, { cascade: true })
  pagamento: PagamentoParcela;

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
