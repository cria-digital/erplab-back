import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';

export enum TipoOperacao {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SELECT = 'SELECT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SIGN = 'SIGN',
}

export enum ModuloOperacao {
  AUTH = 'auth',
  ATENDIMENTO = 'atendimento',
  EXAMES = 'exames',
  FINANCEIRO = 'financeiro',
  CRM = 'crm',
  AUDITORIA = 'auditoria',
  ESTOQUE = 'estoque',
  TISS = 'tiss',
  TAREFAS = 'tarefas',
  BI = 'bi',
  PORTAL_CLIENTE = 'portal_cliente',
  PORTAL_MEDICO = 'portal_medico',
  INTEGRACOES = 'integracoes',
  ADMIN = 'admin',
}

@Entity('logs_auditoria')
@Index(['modulo', 'tabela', 'criado_em'])
@Index(['usuario_id', 'criado_em'])
@Index(['tipo_operacao', 'criado_em'])
export class LogAuditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  usuario_id: string;

  @Column({
    type: 'enum',
    enum: ModuloOperacao,
  })
  modulo: ModuloOperacao;

  @Column({ length: 100 })
  tabela: string;

  @Column({ nullable: true })
  registro_id: string;

  @Column({
    type: 'enum',
    enum: TipoOperacao,
  })
  tipo_operacao: TipoOperacao;

  @Column({ type: 'json', nullable: true })
  valores_anteriores: any;

  @Column({ type: 'json', nullable: true })
  valores_novos: any;

  @Column({ type: 'json', nullable: true })
  valores_alterados: any;

  @Column({ length: 45 })
  ip_address: string;

  @Column({ length: 500, nullable: true })
  user_agent: string;

  @Column({ length: 500, nullable: true })
  endpoint: string;

  @Column({ length: 10, nullable: true })
  metodo_http: string;

  @Column({ nullable: true })
  status_http: number;

  @Column({ nullable: true })
  tempo_execucao_ms: number;

  @Column({ length: 1000, nullable: true })
  observacoes: string;

  @Column({ type: 'json', nullable: true })
  metadados_adicionais: any;

  @Column({ length: 100, nullable: true })
  sessao_id: string;

  @Column({ default: false })
  operacao_sensivel: boolean;

  @Column({ default: false })
  falha_operacao: boolean;

  @Column({ length: 500, nullable: true })
  erro_detalhes: string;

  // Relacionamentos
  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Auditoria
  @CreateDateColumn()
  criado_em: Date;
}
