import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanoTenant {
  TRIAL = 'trial',
  BASICO = 'basico',
  PROFISSIONAL = 'profissional',
  ENTERPRISE = 'enterprise',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ length: 14, unique: true, nullable: true })
  cnpj: string;

  @Column({
    type: 'enum',
    enum: PlanoTenant,
    default: PlanoTenant.TRIAL,
  })
  plano: PlanoTenant;

  @Column({ name: 'limite_usuarios', type: 'int', default: 5 })
  limiteUsuarios: number;

  @Column({ name: 'limite_unidades', type: 'int', default: 1 })
  limiteUnidades: number;

  @Column({ name: 'data_expiracao', type: 'date', nullable: true })
  dataExpiracao: Date;

  @Column({ type: 'jsonb', nullable: true })
  configuracoes: Record<string, any>;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
