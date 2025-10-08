import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PeriodoEnum, DiaSemanaEnum } from '../enums/agendas.enum';
import { ConfiguracaoAgenda } from './configuracao-agenda.entity';

@Entity('periodos_atendimento')
export class PeriodoAtendimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  configuracaoAgendaId: string;

  @ManyToOne(() => ConfiguracaoAgenda, (config) => config.periodosAtendimento)
  @JoinColumn({ name: 'configuracaoAgendaId' })
  configuracaoAgenda: ConfiguracaoAgenda;

  @Column({
    type: 'enum',
    enum: PeriodoEnum,
  })
  periodo: PeriodoEnum;

  @Column({ type: 'time' })
  horarioInicio: string;

  @Column({ type: 'time' })
  horarioFim: string;

  @Column('simple-array', { nullable: true })
  diasSemana: DiaSemanaEnum[];

  @Column({ type: 'date', nullable: true })
  dataEspecifica: Date;

  @Column({ type: 'int', nullable: true, comment: 'Intervalo em minutos' })
  intervaloPeriodo: number;

  @Column({ type: 'int', nullable: true })
  capacidadePeriodo: number;
}
