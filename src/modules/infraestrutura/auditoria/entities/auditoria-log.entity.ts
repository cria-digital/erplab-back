import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Usuario } from '../../../autenticacao/usuarios/entities/usuario.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';

export enum TipoLog {
  ACESSO = 'ACESSO',
  ALTERACAO = 'ALTERACAO',
  ERRO = 'ERRO',
  ACAO = 'ACAO',
}

export enum NivelLog {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum OperacaoLog {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FALHA = 'LOGIN_FALHA',
}

@Entity('auditoria_logs')
@Index(['tipoLog'])
@Index(['usuarioId'])
@Index(['dataHora'])
@Index(['entidade', 'entidadeId'])
export class AuditoriaLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'tipo_log',
    type: 'enum',
    enum: TipoLog,
  })
  tipoLog: TipoLog;

  // Dados comuns
  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @Column({ name: 'data_hora', type: 'timestamp' })
  dataHora: Date;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'unidade_saude_id', type: 'uuid', nullable: true })
  unidadeSaudeId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modulo: string;

  // Para logs de acesso
  @Column({ type: 'varchar', length: 100, nullable: true })
  acao: string;

  // Para logs de alteração
  @Column({ type: 'varchar', length: 100, nullable: true })
  entidade: string;

  @Column({ name: 'entidade_id', type: 'uuid', nullable: true })
  entidadeId: string;

  @Column({
    type: 'enum',
    enum: OperacaoLog,
    nullable: true,
  })
  operacao: OperacaoLog;

  @Column({ name: 'usuario_alterou_id', type: 'uuid', nullable: true })
  usuarioAlterouId: string;

  // Dados da alteração (formato JSON para flexibilidade)
  @Column({ name: 'dados_alteracao', type: 'jsonb', nullable: true })
  dadosAlteracao: any;

  // Detalhes adicionais
  @Column({ type: 'text', nullable: true })
  detalhes: string;

  @Column({
    type: 'enum',
    enum: NivelLog,
    default: NivelLog.INFO,
  })
  nivel: NivelLog;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relacionamentos
  @ManyToOne(() => Usuario, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Usuario, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'usuario_alterou_id' })
  usuarioAlterou: Usuario;

  @ManyToOne(() => UnidadeSaude, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;
}
