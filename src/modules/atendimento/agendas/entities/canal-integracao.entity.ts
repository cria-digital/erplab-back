import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoIntegracaoEnum } from '../enums/agendas.enum';
import { Agenda } from './agenda.entity';

@Entity('canais_integracao')
export class CanalIntegracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agendaId: string;

  @ManyToOne(() => Agenda, (agenda) => agenda.canaisIntegracao)
  @JoinColumn({ name: 'agendaId' })
  agenda: Agenda;

  @Column()
  nomeCanal: string;

  @Column({
    type: 'enum',
    enum: TipoIntegracaoEnum,
  })
  tipoIntegracao: TipoIntegracaoEnum;

  @Column({ default: false })
  integracaoConvenios: boolean;

  @Column({ type: 'json', nullable: true })
  configuracaoJson: string;
}
