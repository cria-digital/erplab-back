import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
/**
 * Entidade para armazenar preferências e configurações do usuário
 * Baseado nas telas do PDF (chunk_025, p498)
 */
@Entity('preferencias_usuario')
export class PreferenciaUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com Usuário (OneToOne)
  @Column({ name: 'usuario_id', type: 'uuid', unique: true })
  usuarioId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Notificações
  @Column({ name: 'notificar_email', type: 'boolean', default: true })
  notificarEmail: boolean;

  @Column({ name: 'notificar_whatsapp', type: 'boolean', default: false })
  notificarWhatsapp: boolean;

  @Column({ name: 'notificar_sms', type: 'boolean', default: false })
  notificarSms: boolean;

  @Column({ name: 'notificar_sistema', type: 'boolean', default: true })
  notificarSistema: boolean;

  // Configurações de Interface (para futuro)
  @Column({ name: 'tema', type: 'varchar', length: 20, default: 'claro' })
  tema: string; // 'claro', 'escuro', 'auto'

  @Column({ name: 'idioma', type: 'varchar', length: 10, default: 'pt-BR' })
  idioma: string;

  @Column({
    name: 'timezone',
    type: 'varchar',
    length: 50,
    default: 'America/Sao_Paulo',
  })
  timezone: string;

  // Configurações de Privacidade
  @Column({ name: 'perfil_publico', type: 'boolean', default: false })
  perfilPublico: boolean;

  @Column({ name: 'mostrar_email', type: 'boolean', default: false })
  mostrarEmail: boolean;

  @Column({ name: 'mostrar_telefone', type: 'boolean', default: false })
  mostrarTelefone: boolean;

  // Configurações de Sessão
  @Column({ name: 'sessao_multipla', type: 'boolean', default: true })
  sessaoMultipla: boolean; // Permitir login em múltiplos dispositivos

  @Column({ name: 'tempo_inatividade', type: 'int', default: 30 })
  tempoInatividade: number; // Minutos até logout automático

  // Outras configurações
  @Column({ name: 'configuracoes_adicionais', type: 'jsonb', nullable: true })
  configuracoesAdicionais: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
