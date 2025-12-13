import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { Kit } from './kit.entity';
import { Convenio } from '../../../relacionamento/convenios/entities/convenio.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('kit_convenios')
@Unique(['kit', 'convenio']) // Garante que um convênio não seja duplicado no mesmo kit
@Index('IDX_kit_convenio_kit', ['kit'])
@Index('IDX_kit_convenio_convenio', ['convenio'])
export class KitConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Kit, (kit) => kit.kitConvenios, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'kit_id' })
  kit: Kit;

  @Column({ name: 'kit_id', type: 'uuid' })
  kitId: string;

  @ManyToOne(() => Convenio, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'convenio_id' })
  convenio: Convenio;

  @Column({ name: 'convenio_id', type: 'uuid' })
  convenioId: string;

  @CreateDateColumn({
    name: 'created_at',
    comment: 'Data/hora de criação do registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Data/hora da última atualização',
  })
  updatedAt: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
