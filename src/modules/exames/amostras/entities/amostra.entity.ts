import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LaboratorioAmostra } from './laboratorio-amostra.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';

export enum StatusAmostra {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  EM_REVISAO = 'em_revisao',
}

@Entity('amostras')
@Index(['codigoInterno'])
@Index(['nome'])
export class Amostra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome da amostra',
  })
  nome: string;

  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno da amostra (ex: AMO001)',
  })
  codigoInterno: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada da amostra',
  })
  descricao: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusAmostra,
    default: StatusAmostra.EM_REVISAO,
    comment: 'Status da amostra',
  })
  status: StatusAmostra;

  @OneToMany(
    () => LaboratorioAmostra,
    (laboratorioAmostra) => laboratorioAmostra.amostra,
    {
      cascade: false,
    },
  )
  laboratorioAmostras: LaboratorioAmostra[];

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
