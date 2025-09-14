import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StatusAgendaEnum } from '../enums/agendas.enum';
import { ConfiguracaoAgenda } from './configuracao-agenda.entity';
import { VinculacaoAgenda } from './vinculacao-agenda.entity';
import { NotificacaoAgenda } from './notificacao-agenda.entity';
import { CanalIntegracao } from './canal-integracao.entity';
import { UnidadeSaude } from '../../unidade-saude/entities/unidade-saude.entity';

@Entity('agendas')
export class Agenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigoInterno: string;

  @Column()
  nomeAgenda: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ nullable: true })
  unidadeAssociadaId: string;

  @ManyToOne(() => UnidadeSaude, { nullable: true })
  @JoinColumn({ name: 'unidadeAssociadaId' })
  unidadeAssociada: UnidadeSaude;

  @Column({ nullable: true })
  setorId: string;

  @Column({ nullable: true })
  salaId: string;

  @Column({ nullable: true })
  profissionalId: string;

  @Column({ nullable: true })
  especialidadeId: string;

  @Column({ nullable: true })
  equipamentoId: string;

  @OneToOne(() => ConfiguracaoAgenda, (config) => config.agenda, {
    cascade: true,
    eager: true,
  })
  configuracaoAgenda: ConfiguracaoAgenda;

  @OneToMany(() => VinculacaoAgenda, (vinculacao) => vinculacao.agenda, {
    cascade: true,
  })
  vinculacoes: VinculacaoAgenda[];

  @OneToOne(() => NotificacaoAgenda, (notificacao) => notificacao.agenda, {
    cascade: true,
  })
  notificacoes: NotificacaoAgenda;

  @OneToMany(() => CanalIntegracao, (canal) => canal.agenda, {
    cascade: true,
  })
  canaisIntegracao: CanalIntegracao[];

  @Column({
    type: 'enum',
    enum: StatusAgendaEnum,
    default: StatusAgendaEnum.ATIVO,
  })
  status: StatusAgendaEnum;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
