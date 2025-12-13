import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Repasse } from './repasse.entity';
import { EntidadeTipoFiltro } from '../enums/contas-pagar.enum';

import { Tenant } from '../../../../tenants/entities/tenant.entity';
@Entity('repasses_filtros')
@Index(['repasseId', 'entidadeTipo', 'entidadeId'], { unique: true })
export class RepasseFiltro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'repasse_id', type: 'uuid' })
  repasseId: string;

  @ManyToOne(() => Repasse, (repasse) => repasse.filtros)
  @JoinColumn({ name: 'repasse_id' })
  repasse: Repasse;

  @Column({ name: 'entidade_tipo', type: 'enum', enum: EntidadeTipoFiltro })
  entidadeTipo: EntidadeTipoFiltro;

  @Column({ name: 'entidade_id', type: 'uuid' })
  entidadeId: string;

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
