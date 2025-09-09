import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

export enum StatusSessao {
  ATIVA = 'ativa',
  EXPIRADA = 'expirada',
  ENCERRADA = 'encerrada',
  BLOQUEADA = 'bloqueada',
}

@Entity('sessoes_usuario')
export class SessaoUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuario_id: string;

  @Column({ length: 500 })
  refresh_token: string;

  @Column({ length: 45 })
  ip_address: string;

  @Column({ length: 500, nullable: true })
  user_agent: string;

  @Column({
    type: 'enum',
    enum: StatusSessao,
    default: StatusSessao.ATIVA,
  })
  status: StatusSessao;

  @Column({ type: 'timestamp' })
  expira_em: Date;

  @Column({ type: 'timestamp', nullable: true })
  ultimo_acesso: Date;

  @Column({ length: 100, nullable: true })
  dispositivo: string;

  @Column({ length: 100, nullable: true })
  localizacao: string;

  @Column({ default: false })
  confiavel: boolean;

  // Relacionamentos
  @ManyToOne(() => Usuario, (usuario) => usuario.sessoes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Auditoria
  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @Column({ nullable: true })
  encerrado_por: string;

  @Column({ type: 'timestamp', nullable: true })
  encerrado_em: Date;
}
