import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Agenda } from './agenda.entity';

@Entity('periodos_atendimento')
export class PeriodoAtendimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agenda_id' })
  agendaId: string;

  @ManyToOne(() => Agenda, (agenda) => agenda.periodosAtendimento)
  @JoinColumn({ name: 'agenda_id' })
  agenda: Agenda;

  @Column({ name: 'horario_inicio', type: 'time' })
  horarioInicio: string;

  @Column({ name: 'horario_fim', type: 'time' })
  horarioFim: string;
}
