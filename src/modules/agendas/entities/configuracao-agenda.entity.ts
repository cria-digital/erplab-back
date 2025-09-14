import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DiaSemanaEnum } from '../enums/agendas.enum';
import { Agenda } from './agenda.entity';
import { PeriodoAtendimento } from './periodo-atendimento.entity';
import { HorarioEspecifico } from './horario-especifico.entity';
import { BloqueioHorario } from './bloqueio-horario.entity';

@Entity('configuracoes_agenda')
export class ConfiguracaoAgenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agendaId: string;

  @OneToOne(() => Agenda, (agenda) => agenda.configuracaoAgenda)
  @JoinColumn({ name: 'agendaId' })
  agenda: Agenda;

  @Column('simple-array')
  diasSemana: DiaSemanaEnum[];

  @OneToMany(
    () => PeriodoAtendimento,
    (periodo) => periodo.configuracaoAgenda,
    {
      cascade: true,
      eager: true,
    },
  )
  periodosAtendimento: PeriodoAtendimento[];

  @Column({ type: 'int', comment: 'Intervalo em minutos' })
  intervaloAgendamento: number;

  @Column({ type: 'int', nullable: true })
  capacidadeTotal: number;

  @Column({ type: 'int', nullable: true })
  capacidadePorHorario: number;

  @OneToMany(() => HorarioEspecifico, (horario) => horario.configuracaoAgenda, {
    cascade: true,
  })
  horariosEspecificos: HorarioEspecifico[];

  @OneToMany(() => BloqueioHorario, (bloqueio) => bloqueio.configuracaoAgenda, {
    cascade: true,
  })
  bloqueiosHorario: BloqueioHorario[];
}
