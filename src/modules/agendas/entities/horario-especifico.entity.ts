import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConfiguracaoAgenda } from './configuracao-agenda.entity';

@Entity('horarios_especificos')
export class HorarioEspecifico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  configuracaoAgendaId: string;

  @ManyToOne(() => ConfiguracaoAgenda, (config) => config.horariosEspecificos)
  @JoinColumn({ name: 'configuracaoAgendaId' })
  configuracaoAgenda: ConfiguracaoAgenda;

  @Column({ type: 'date' })
  data: Date;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFim: string;

  @Column({ type: 'int', nullable: true })
  capacidade: number;

  @Column({ default: false })
  isFeriado: boolean;

  @Column({ default: false })
  isPeriodoFacultativo: boolean;
}
