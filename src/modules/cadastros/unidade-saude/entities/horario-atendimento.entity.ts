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
import { UnidadeSaude } from './unidade-saude.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
export enum DiaSemana {
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO',
  FERIADOS = 'FERIADOS',
}

@Entity('horarios_atendimento')
export class HorarioAtendimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'unidade_saude_id', type: 'uuid' })
  unidadeSaudeId: string;

  @Column({
    name: 'dia_semana',
    type: 'enum',
    enum: DiaSemana,
  })
  diaSemana: DiaSemana;

  @Column({ name: 'horario_inicio', type: 'time' })
  horarioInicio: string;

  @Column({ name: 'horario_fim', type: 'time' })
  horarioFim: string;

  @Column({ name: 'intervalo_inicio', type: 'time', nullable: true })
  intervaloInicio: string;

  @Column({ name: 'intervalo_fim', type: 'time', nullable: true })
  intervaloFim: string;

  @Column({ name: 'sem_intervalo', type: 'boolean', default: false })
  semIntervalo: boolean;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => UnidadeSaude, (unidade) => unidade.horariosAtendimento, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
