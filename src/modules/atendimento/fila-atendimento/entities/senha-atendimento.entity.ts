import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Paciente } from '../../../cadastros/pacientes/entities/paciente.entity';
import { Usuario } from '../../../autenticacao/usuarios/entities/usuario.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';

export enum TipoSenha {
  PRIORIDADE = 'prioridade',
  GERAL = 'geral',
}

export enum StatusSenha {
  AGUARDANDO = 'aguardando',
  CHAMADO = 'chamado',
  EM_ATENDIMENTO = 'em_atendimento',
  FINALIZADO = 'finalizado',
  DESISTIU = 'desistiu',
}

@Entity('senhas_atendimento')
@Index(['unidadeId', 'status', 'tipo'])
@Index(['unidadeId', 'ticket', 'horaChegada'])
export class SenhaAtendimento {
  @ApiProperty({ description: 'ID único da senha' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID da unidade de saúde' })
  @Column({ name: 'unidade_id', type: 'uuid' })
  @Index()
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @ApiProperty({ description: 'Número do ticket', example: 'PRIO0010' })
  @Column({ type: 'varchar', length: 10 })
  ticket: string;

  @ApiProperty({ description: 'Tipo da senha', enum: TipoSenha })
  @Column({ type: 'enum', enum: TipoSenha })
  tipo: TipoSenha;

  @ApiProperty({ description: 'Hora de chegada do paciente' })
  @Column({ name: 'hora_chegada', type: 'timestamp' })
  horaChegada: Date;

  @ApiProperty({
    description: 'ID do paciente (se identificado)',
    nullable: true,
  })
  @Column({ name: 'paciente_id', type: 'uuid', nullable: true })
  pacienteId: string;

  @ManyToOne(() => Paciente, { nullable: true })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ApiProperty({ description: 'Status da senha', enum: StatusSenha })
  @Column({ type: 'enum', enum: StatusSenha, default: StatusSenha.AGUARDANDO })
  status: StatusSenha;

  @ApiProperty({ description: 'Mesa de atendimento', nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  mesa: string;

  @ApiProperty({ description: 'ID do usuário atendente', nullable: true })
  @Column({ name: 'usuario_atendente_id', type: 'uuid', nullable: true })
  usuarioAtendenteId: string;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_atendente_id' })
  usuarioAtendente: Usuario;

  @ApiProperty({ description: 'Hora que foi chamado', nullable: true })
  @Column({ name: 'hora_chamada', type: 'timestamp', nullable: true })
  horaChamada: Date;

  @ApiProperty({ description: 'Hora de início do atendimento', nullable: true })
  @Column({
    name: 'hora_inicio_atendimento',
    type: 'timestamp',
    nullable: true,
  })
  horaInicioAtendimento: Date;

  @ApiProperty({ description: 'Hora de fim do atendimento', nullable: true })
  @Column({ name: 'hora_fim_atendimento', type: 'timestamp', nullable: true })
  horaFimAtendimento: Date;

  @ApiProperty({ description: 'Se tem agendamento prévio' })
  @Column({ name: 'tem_agendamento', type: 'boolean', default: false })
  temAgendamento: boolean;

  @ApiProperty({ description: 'ID do agendamento (se houver)', nullable: true })
  @Column({ name: 'agendamento_id', type: 'uuid', nullable: true })
  agendamentoId: string;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Helpers
  isIdentificado(): boolean {
    return !!this.pacienteId;
  }

  isPrioridade(): boolean {
    return this.tipo === TipoSenha.PRIORIDADE;
  }

  isAguardando(): boolean {
    return this.status === StatusSenha.AGUARDANDO;
  }

  isEmAtendimento(): boolean {
    return this.status === StatusSenha.EM_ATENDIMENTO;
  }

  getTempoEspera(): number {
    if (!this.horaChegada) return 0;
    const agora = new Date();
    return Math.floor(
      (agora.getTime() - new Date(this.horaChegada).getTime()) / 60000,
    ); // minutos
  }
}
