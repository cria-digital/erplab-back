import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoVinculacaoEnum } from '../enums/agendas.enum';
import { Agenda } from './agenda.entity';

@Entity('vinculacoes_agenda')
export class VinculacaoAgenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agenda_id' })
  agendaId: string;

  @ManyToOne(() => Agenda, (agenda) => agenda.vinculacoes)
  @JoinColumn({ name: 'agenda_id' })
  agenda: Agenda;

  @Column({
    type: 'enum',
    enum: TipoVinculacaoEnum,
  })
  tipo: TipoVinculacaoEnum;

  @Column({ name: 'entidade_vinculada_id' })
  entidadeVinculadaId: string;
}
