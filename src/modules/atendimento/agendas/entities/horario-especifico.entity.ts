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
@Entity('horarios_especificos')
export class HorarioEspecifico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agenda_id' })
  agendaId: string;

  @ManyToOne(() => Agenda, (agenda) => agenda.horariosEspecificos)
  @JoinColumn({ name: 'agenda_id' })
  agenda: Agenda;

  @Column({ name: 'data_especifica', type: 'date' })
  dataEspecifica: Date;

  @Column({ name: 'horario_especifico', type: 'time' })
  horarioEspecifico: string;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
