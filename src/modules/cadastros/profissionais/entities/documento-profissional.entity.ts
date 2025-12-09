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
import {
  TipoDocumentoProfissionalEnum,
  StatusDocumentoEnum,
} from '../enums/profissionais.enum';
import { Profissional } from './profissional.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('documentos_profissional')
export class DocumentoProfissional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profissionalId: string;

  @ManyToOne(() => Profissional, (profissional) => profissional.documentos)
  @JoinColumn({ name: 'profissionalId' })
  profissional: Profissional;

  @Column({
    type: 'enum',
    enum: TipoDocumentoProfissionalEnum,
  })
  tipo: TipoDocumentoProfissionalEnum;

  @Column({ nullable: true })
  arquivo: string;

  @Column({ type: 'date', nullable: true })
  validade: Date;

  @Column({
    type: 'enum',
    enum: StatusDocumentoEnum,
    default: StatusDocumentoEnum.PENDENTE,
  })
  status: StatusDocumentoEnum;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
