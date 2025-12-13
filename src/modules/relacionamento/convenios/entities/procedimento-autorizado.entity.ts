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
import { Plano } from './plano.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('procedimentos_autorizados')
export class ProcedimentoAutorizado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  plano_id: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_tuss: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_cbhpm: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  codigo_proprio: string;

  @Column({ type: 'varchar', length: 500 })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor_negociado: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentual_coparticipacao: number;

  @Column({ type: 'int', default: 0 })
  carencia_especifica_dias: number;

  @Column({ type: 'int', nullable: true })
  limite_utilizacao_mensal: number;

  @Column({ type: 'int', nullable: true })
  limite_utilizacao_anual: number;

  @Column({ type: 'boolean', default: false })
  necessita_autorizacao: boolean;

  @Column({ type: 'json', nullable: true })
  documentacao_necessaria: string[];

  @Column({ type: 'int', default: 1 })
  prazo_autorizacao_dias: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Plano, (plano) => plano.procedimentos_autorizados, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plano_id' })
  plano: Plano;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
