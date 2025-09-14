import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConfiguracaoAgenda } from './configuracao-agenda.entity';

@Entity('bloqueios_horario')
export class BloqueioHorario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  configuracaoAgendaId: string;

  @ManyToOne(() => ConfiguracaoAgenda, (config) => config.bloqueiosHorario)
  @JoinColumn({ name: 'configuracaoAgendaId' })
  configuracaoAgenda: ConfiguracaoAgenda;

  @Column({ type: 'date' })
  dataInicio: Date;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'date', nullable: true })
  dataFim: Date;

  @Column({ type: 'time', nullable: true })
  horaFim: string;

  @Column({ nullable: true })
  observacao: string;

  @Column({ nullable: true })
  motivoBloqueio: string;
}
