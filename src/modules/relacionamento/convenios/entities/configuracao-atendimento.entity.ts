import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

@Entity('configuracoes_atendimento_convenio')
export class ConfiguracaoAtendimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ name: 'tipo_atendimento' })
  tipoAtendimento: string;

  @Column({ default: true, name: 'permite_urgencia' })
  permiteUrgencia: boolean;

  @Column({ default: true, name: 'permite_domiciliar' })
  permiteDomiciliar: boolean;

  @Column({ default: true, name: 'permite_agendamento' })
  permiteAgendamento: boolean;

  @Column({ nullable: true, name: 'prazo_agendamento_dias' })
  prazoAgendamentoDias: number;

  @Column({ nullable: true, name: 'horario_inicio' })
  horarioInicio: string;

  @Column({ nullable: true, name: 'horario_fim' })
  horarioFim: string;

  @Column({ default: true, name: 'atende_fim_semana' })
  atendeFimSemana: boolean;

  @Column({ default: true, name: 'atende_feriado' })
  atendeFeriado: boolean;

  @Column({ nullable: true, name: 'tempo_medio_atendimento_minutos' })
  tempoMedioAtendimentoMinutos: number;

  @Column({ nullable: true, name: 'observacoes', type: 'text' })
  observacoes: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
