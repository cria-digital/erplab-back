import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from '../../../tenants/entities/tenant.entity';

@Entity('servicos_saude')
export class ServicoSaude {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'varchar', length: 10 })
  codigo_grupo: string;

  @Column({ type: 'varchar', length: 100 })
  nome_grupo: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
