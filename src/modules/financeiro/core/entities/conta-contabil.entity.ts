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
import { PlanoContas } from './plano-contas.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
export enum TipoClassificacao {
  TITULO = 'titulo',
  NIVEL = 'nivel',
}

@Entity('contas_contabeis')
export class ContaContabil {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoClassificacao,
  })
  tipo_classificacao: TipoClassificacao;

  @Column({ type: 'varchar', length: 50 })
  codigo_hierarquico: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_contabil: string;

  @Column({ type: 'varchar', length: 255 })
  nome_classe: string;

  @Column({ type: 'uuid', nullable: true })
  vinculo_id: string;

  @Column({ type: 'boolean', default: false })
  excluir: boolean;

  @Column({ type: 'boolean', default: false })
  desativar: boolean;

  @Column({ type: 'uuid' })
  plano_contas_id: string;

  @ManyToOne(() => PlanoContas, (plano) => plano.contas_contabeis)
  @JoinColumn({ name: 'plano_contas_id' })
  plano_contas: PlanoContas;

  @Column({ type: 'uuid', nullable: true })
  conta_pai_id: string;

  @ManyToOne(() => ContaContabil, (conta) => conta.contas_filhas, {
    nullable: true,
  })
  @JoinColumn({ name: 'conta_pai_id' })
  conta_pai: ContaContabil;

  @OneToMany(() => ContaContabil, (conta) => conta.conta_pai)
  contas_filhas: ContaContabil[];

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
