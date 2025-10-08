import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PrazoLembreteEnum } from '../enums/agendas.enum';
import { Agenda } from './agenda.entity';

@Entity('notificacoes_agenda')
export class NotificacaoAgenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agendaId: string;

  @OneToOne(() => Agenda, (agenda) => agenda.notificacoes)
  @JoinColumn({ name: 'agendaId' })
  agenda: Agenda;

  @Column({ default: false })
  notificarEmail: boolean;

  @Column({ default: false })
  notificarWhatsapp: boolean;

  @Column({ default: false })
  notificarSMS: boolean;

  @Column({ type: 'int', nullable: true })
  prazoLembrete: number;

  @Column({
    type: 'enum',
    enum: PrazoLembreteEnum,
    nullable: true,
  })
  prazoLembreteTipo: PrazoLembreteEnum;
}
