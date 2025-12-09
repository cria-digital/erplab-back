import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Metodo } from './metodo.entity';
import { Laboratorio } from '../../../relacionamento/laboratorios/entities/laboratorio.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('laboratorios_metodos')
@Unique(['laboratorioId', 'metodoId'])
@Index(['laboratorioId'])
@Index(['metodoId'])
export class LaboratorioMetodo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'laboratorio_id',
    type: 'uuid',
    comment: 'ID do laboratório',
  })
  laboratorioId: string;

  @ManyToOne(() => Laboratorio, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'laboratorio_id' })
  laboratorio: Laboratorio;

  @Column({
    name: 'metodo_id',
    type: 'uuid',
    comment: 'ID do método',
  })
  metodoId: string;

  @ManyToOne(() => Metodo, (metodo) => metodo.laboratorioMetodos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'metodo_id' })
  metodo: Metodo;

  @Column({
    name: 'validado',
    type: 'boolean',
    default: false,
    comment: 'Indica se o laboratório está validado para usar este método',
  })
  validado: boolean;

  @Column({
    name: 'data_validacao',
    type: 'timestamp',
    nullable: true,
    comment: 'Data de validação do laboratório para o método',
  })
  dataValidacao: Date;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações sobre o vínculo laboratório-método',
  })
  observacoes: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
