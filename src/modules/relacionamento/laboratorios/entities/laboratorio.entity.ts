import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { Integracao } from '../../../atendimento/integracoes/entities/integracao.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('laboratorios')
export class Laboratorio {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_laboratorio: string;

  @Column({ type: 'uuid', nullable: true })
  integracao_id: string;

  @ManyToOne(() => Integracao, { nullable: true })
  @JoinColumn({ name: 'integracao_id' })
  integracao: Integracao;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
