import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Agenda } from './agenda.entity';

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
}
