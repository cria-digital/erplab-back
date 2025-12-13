import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Sala } from '../../../configuracoes/estrutura/salas/entities/sala.entity';
import { Profissional } from '../../../cadastros/profissionais/entities/profissional.entity';
import { Especialidade } from '../../../cadastros/profissionais/entities/especialidade.entity';
import { Equipamento } from '../../../configuracoes/estrutura/equipamentos/entities/equipamento.entity';
import { PeriodoAtendimento } from './periodo-atendimento.entity';
import { HorarioEspecifico } from './horario-especifico.entity';
import { BloqueioHorario } from './bloqueio-horario.entity';
import { VinculacaoAgenda } from './vinculacao-agenda.entity';
import { DiaSemanaEnum } from '../enums/agendas.enum';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('agendas')
export class Agenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo_interno', unique: true })
  @Index('IDX_agendas_codigo_interno')
  codigoInterno: string;

  @Column({ name: 'nome_agenda' })
  nomeAgenda: string;

  @Column({ name: 'unidade_id' })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude, { nullable: false })
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({ name: 'setor', nullable: true })
  setor: string; // Campo de formulário (string), não FK

  @Column({ name: 'sala_id', nullable: true })
  salaId: string;

  @ManyToOne(() => Sala, { nullable: true })
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @Column({ name: 'profissional_id', nullable: true })
  profissionalId: string;

  @ManyToOne(() => Profissional, { nullable: true })
  @JoinColumn({ name: 'profissional_id' })
  profissional: Profissional;

  @Column({ name: 'especialidade_id', nullable: true })
  especialidadeId: string;

  @ManyToOne(() => Especialidade, { nullable: true })
  @JoinColumn({ name: 'especialidade_id' })
  especialidade: Especialidade;

  @Column({ name: 'equipamento_id', nullable: true })
  equipamentoId: string;

  @ManyToOne(() => Equipamento, { nullable: true })
  @JoinColumn({ name: 'equipamento_id' })
  equipamento: Equipamento;

  @Column({ nullable: true })
  descricao: string;

  // === CONFIGURAÇÃO DE AGENDA ===

  @Column('simple-array', { name: 'dias_semana' })
  diasSemana: DiaSemanaEnum[];

  @Column({
    name: 'intervalo_agendamento',
    type: 'int',
    comment: 'Intervalo em minutos',
  })
  intervaloAgendamento: number;

  @Column({ name: 'capacidade_por_horario', type: 'int', nullable: true })
  capacidadePorHorario: number;

  @Column({ name: 'capacidade_total', type: 'int', nullable: true })
  capacidadeTotal: number;

  // === NOTIFICAÇÕES ===

  @Column({ name: 'notificar_email', default: false })
  notificarEmail: boolean;

  @Column({ name: 'notificar_whatsapp', default: false })
  notificarWhatsapp: boolean;

  @Column({
    name: 'prazo_lembrete',
    nullable: true,
    comment: 'Prazo em horas para lembrete',
  })
  prazoLembrete: string; // Dropdown no Figma (ex: "24 horas", "48 horas")

  // === INTEGRAÇÃO ===

  @Column({ name: 'integracao_convenios', default: false })
  integracaoConvenios: boolean;

  // === RELACIONAMENTOS ===

  @OneToMany(() => PeriodoAtendimento, (periodo) => periodo.agenda, {
    cascade: true,
    eager: true,
  })
  periodosAtendimento: PeriodoAtendimento[];

  @OneToMany(() => HorarioEspecifico, (horario) => horario.agenda, {
    cascade: true,
  })
  horariosEspecificos: HorarioEspecifico[];

  @OneToMany(() => BloqueioHorario, (bloqueio) => bloqueio.agenda, {
    cascade: true,
  })
  bloqueiosHorario: BloqueioHorario[];

  @OneToMany(() => VinculacaoAgenda, (vinculacao) => vinculacao.agenda, {
    cascade: true,
  })
  vinculacoes: VinculacaoAgenda[];

  // === CONTROLE ===

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
