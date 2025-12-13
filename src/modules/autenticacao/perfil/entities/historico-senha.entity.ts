import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
/**
 * Entidade para armazenar histórico de senhas do usuário
 * Necessário para validar: "Senha deve ser diferente da senha anterior"
 * Conforme requisito do PDF (chunk_025, p500)
 */
@Entity('historico_senhas')
export class HistoricoSenha {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com Usuário
  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Hash da senha anterior
  @Column({ name: 'senha_hash', type: 'varchar', length: 255 })
  senhaHash: string;

  // Metadados da alteração
  @Column({
    name: 'motivo_alteracao',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  motivoAlteracao: string; // 'usuario_solicitou', 'administrador_forçou', 'expiracao', 'reset'

  @Column({ name: 'ip_origem', type: 'varchar', length: 45, nullable: true })
  ipOrigem: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ name: 'alterado_por_usuario_id', type: 'uuid', nullable: true })
  alteradoPorUsuarioId: string; // Caso administrador tenha alterado

  @CreateDateColumn({ name: 'data_alteracao' })
  dataAlteracao: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
