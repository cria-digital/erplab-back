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
export enum TipoRestricao {
  PROCEDIMENTO = 'procedimento',
  ESPECIALIDADE = 'especialidade',
  PRESTADOR = 'prestador',
  MEDICAMENTO = 'medicamento',
  MATERIAL = 'material',
}

@Entity('restricoes')
export class Restricao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  plano_id: string;

  @Column({ type: 'enum', enum: TipoRestricao })
  tipo_restricao: TipoRestricao;

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_item: string;

  @Column({ type: 'varchar', length: 500 })
  descricao: string;

  @Column({ type: 'text' })
  motivo: string;

  @Column({ type: 'date' })
  data_inicio: Date;

  @Column({ type: 'date', nullable: true })
  data_fim: Date;

  @Column({ type: 'boolean', default: true })
  ativa: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Plano, (plano) => plano.restricoes, { onDelete: 'CASCADE' })
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
