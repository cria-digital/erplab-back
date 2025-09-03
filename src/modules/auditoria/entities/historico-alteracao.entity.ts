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

@Entity('historico_alteracoes')
@Index(['tabela_origem', 'registro_id', 'criado_em'])
@Index(['usuario_id', 'criado_em'])
export class HistoricoAlteracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  usuario_id: string;

  @Column({ length: 100 })
  tabela_origem: string;

  @Column()
  registro_id: string;

  @Column({ length: 100 })
  campo_alterado: string;

  @Column({ type: 'text', nullable: true })
  valor_anterior: string;

  @Column({ type: 'text', nullable: true })
  valor_novo: string;

  @Column({ length: 50 })
  tipo_campo: string; // varchar, int, boolean, date, etc.

  @Column({ length: 500, nullable: true })
  motivo_alteracao: string;

  @Column({ length: 45 })
  ip_address: string;

  @Column({ length: 500, nullable: true })
  user_agent: string;

  @Column({ default: false })
  alteracao_critica: boolean;

  @Column({ default: false })
  requer_aprovacao: boolean;

  @Column({ default: false })
  aprovada: boolean;

  @Column({ nullable: true })
  aprovada_por: string;

  @Column({ type: 'timestamp', nullable: true })
  aprovada_em: Date;

  @Column({ type: 'json', nullable: true })
  contexto_adicional: any;

  // Relacionamentos
  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'aprovada_por' })
  aprovador: Usuario;

  // Auditoria
  @CreateDateColumn()
  criado_em: Date;
}