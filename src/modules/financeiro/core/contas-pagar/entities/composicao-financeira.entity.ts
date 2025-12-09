import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContaPagar } from './conta-pagar.entity';
import { ContaContabil } from '../../entities/conta-contabil.entity';
import { CentroCusto } from './centro-custo.entity';
import { Profissional } from '../../../../cadastros/profissionais/entities/profissional.entity';

import { Tenant } from '../../../../tenants/entities/tenant.entity';
@Entity('composicoes_financeiras')
export class ComposicaoFinanceira {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conta_pagar_id', type: 'uuid' })
  contaPagarId: string;

  @ManyToOne(() => ContaPagar, (conta) => conta.composicoesFinanceiras)
  @JoinColumn({ name: 'conta_pagar_id' })
  contaPagar: ContaPagar;

  @Column({ name: 'conta_contabil_id', type: 'uuid' })
  contaContabilId: string;

  @ManyToOne(() => ContaContabil)
  @JoinColumn({ name: 'conta_contabil_id' })
  contaContabil: ContaContabil;

  @Column({ name: 'centro_custo_id', type: 'uuid', nullable: true })
  centroCustoId: string;

  @ManyToOne(() => CentroCusto, { nullable: true })
  @JoinColumn({ name: 'centro_custo_id' })
  centroCusto: CentroCusto;

  @Column({ name: 'colaborador_id', type: 'uuid', nullable: true })
  colaboradorId: string;

  @ManyToOne(() => Profissional, { nullable: true })
  @JoinColumn({ name: 'colaborador_id' })
  colaborador: Profissional;

  @Column({
    name: 'colaborador_nome',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  colaboradorNome: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

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
