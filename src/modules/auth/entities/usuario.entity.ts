import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Perfil } from './perfil.entity';
import { Unidade } from './unidade.entity';
import { SessaoUsuario } from './sessao-usuario.entity';
import { LogAcesso } from './log-acesso.entity';

export enum StatusUsuario {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  BLOQUEADO = 'bloqueado',
  PENDENTE_ATIVACAO = 'pendente_ativacao',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome_completo: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 14, nullable: true })
  cpf: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ length: 20, nullable: true })
  celular: string;

  @Exclude()
  @Column()
  senha_hash: string;

  @Column({
    type: 'enum',
    enum: StatusUsuario,
    default: StatusUsuario.PENDENTE_ATIVACAO,
  })
  status: StatusUsuario;

  // MFA (Multi-Factor Authentication)
  @Column({ default: false })
  mfa_habilitado: boolean;

  @Exclude()
  @Column({ nullable: true })
  mfa_secret: string;

  @Column({ type: 'simple-array', nullable: true })
  codigos_recuperacao_mfa: string[];

  @Column({ nullable: true })
  ultimo_login: Date;

  @Column({ default: 0 })
  tentativas_login_falhadas: number;

  @Column({ nullable: true })
  bloqueado_ate: Date;

  @Column({ default: false })
  deve_trocar_senha: boolean;

  @Column({ nullable: true })
  ultima_troca_senha: Date;

  // Relacionamentos
  @ManyToOne(() => Perfil, (perfil) => perfil.usuarios)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;

  @Column()
  perfil_id: string;

  @ManyToOne(() => Unidade, (unidade) => unidade.usuarios, { nullable: true })
  @JoinColumn({ name: 'unidade_id' })
  unidade: Unidade;

  @Column({ nullable: true })
  unidade_id: string;

  @OneToMany(() => SessaoUsuario, (sessao) => sessao.usuario)
  sessoes: SessaoUsuario[];

  @OneToMany(() => LogAcesso, (log) => log.usuario)
  logs_acesso: LogAcesso[];

  // Auditoria
  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @Column({ nullable: true })
  criado_por: string;

  @Column({ nullable: true })
  atualizado_por: string;
}