import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

export enum TipoEvento {
  LOGIN_SUCESSO = 'login_sucesso',
  LOGIN_FALHA = 'login_falha',
  LOGOUT = 'logout',
  TENTATIVA_MFA = 'tentativa_mfa',
  MFA_SUCESSO = 'mfa_sucesso',
  MFA_FALHA = 'mfa_falha',
  SENHA_ALTERADA = 'senha_alterada',
  CONTA_BLOQUEADA = 'conta_bloqueada',
  CONTA_DESBLOQUEADA = 'conta_desbloqueada',
  TOKEN_EXPIRADO = 'token_expirado',
  ACESSO_NEGADO = 'acesso_negado',
}

export enum NivelRisco {
  BAIXO = 'baixo',
  MEDIO = 'medio',
  ALTO = 'alto',
  CRITICO = 'critico',
}

@Entity('logs_acesso')
export class LogAcesso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  usuario_id: string;

  @Column({ length: 100, nullable: true })
  email_tentativa: string;

  @Column({
    type: 'enum',
    enum: TipoEvento,
  })
  evento: TipoEvento;

  @Column({
    type: 'enum',
    enum: NivelRisco,
    default: NivelRisco.BAIXO,
  })
  nivel_risco: NivelRisco;

  @Column({ length: 45 })
  ip_address: string;

  @Column({ length: 500, nullable: true })
  user_agent: string;

  @Column({ length: 100, nullable: true })
  dispositivo: string;

  @Column({ length: 100, nullable: true })
  localizacao: string;

  @Column({ default: false })
  sucesso: boolean;

  @Column({ length: 500, nullable: true })
  detalhes: string;

  @Column({ length: 100, nullable: true })
  codigo_erro: string;

  @Column({ length: 100, nullable: true })
  sessao_id: string;

  @Column({ type: 'json', nullable: true })
  metadados: any;

  // Relacionamentos
  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Auditoria
  @CreateDateColumn()
  criado_em: Date;
}