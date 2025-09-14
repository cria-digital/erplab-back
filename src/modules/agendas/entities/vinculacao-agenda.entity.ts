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

  @Column()
  agendaId: string;

  @ManyToOne(() => Agenda, (agenda) => agenda.vinculacoes)
  @JoinColumn({ name: 'agendaId' })
  agenda: Agenda;

  @Column({
    type: 'enum',
    enum: TipoVinculacaoEnum,
  })
  tipo: TipoVinculacaoEnum;

  @Column()
  entidadeVinculadaId: string;

  @Column({ nullable: true })
  entidadeVinculadaNome: string;

  @Column({ default: false })
  opcaoAdicional: boolean;
}
