import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agenda } from './agenda.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('bloqueios_horario')
export class BloqueioHorario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agenda_id' })
  agendaId: string;

  @ManyToOne(() => Agenda, (agenda) => agenda.bloqueiosHorario)
  @JoinColumn({ name: 'agenda_id' })
  agenda: Agenda;

  @Column({ name: 'dia_bloquear', type: 'date' })
  diaBloquear: Date;

  @Column({ name: 'horario_inicio', type: 'time' })
  horarioInicio: string;

  @Column({ name: 'horario_fim', type: 'time' })
  horarioFim: string;

  @Column({ nullable: true })
  observacao: string;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
