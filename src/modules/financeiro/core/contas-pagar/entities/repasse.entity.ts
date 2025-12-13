import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { RepasseFiltro } from './repasse-filtro.entity';
import { StatusRepasse } from '../enums/contas-pagar.enum';

import { Tenant } from '../../../../tenants/entities/tenant.entity';
@Entity('repasses')
export class Repasse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'data_inicio', type: 'date' })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'date' })
  dataFim: Date;

  @Column({ name: 'unidade_id', type: 'uuid' })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'enum', enum: StatusRepasse, default: StatusRepasse.ATIVO })
  status: StatusRepasse;

  @OneToMany(() => RepasseFiltro, (filtro) => filtro.repasse, { cascade: true })
  filtros: RepasseFiltro[];

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
