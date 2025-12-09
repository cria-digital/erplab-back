import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Integracao } from './integracao.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
/**
 * Entidade IntegracaoConfiguracao
 *
 * Armazena as configurações de uma integração no formato chave-valor.
 * Permite flexibilidade para cada integração ter seus próprios campos.
 *
 * Exemplo:
 * - chave: 'usuario', valor: 'hp_user_centro'
 * - chave: 'senha', valor: '[hash_criptografado]'
 * - chave: 'ambiente', valor: 'producao'
 */
@Entity('integracoes_configuracoes')
@Index(['integracaoId'])
@Index(['chave'])
@Index(['integracaoId', 'chave'], { unique: true })
export class IntegracaoConfiguracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ==========================================
  // RELACIONAMENTO
  // ==========================================

  @Column({
    type: 'uuid',
    name: 'integracao_id',
    comment: 'FK para integracoes.id',
  })
  integracaoId: string;

  @ManyToOne(() => Integracao, (integracao) => integracao.configuracoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'integracao_id' })
  integracao: Integracao;

  // ==========================================
  // CHAVE-VALOR
  // ==========================================

  /**
   * Chave da configuração
   * Ex: 'usuario', 'senha', 'ambiente', 'client_id', etc
   */
  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Chave da configuração (ex: usuario, senha, ambiente)',
  })
  chave: string;

  /**
   * Valor da configuração (sempre TEXT para flexibilidade)
   */
  @Column({
    type: 'text',
    comment: 'Valor da configuração',
  })
  valor: string;

  // ==========================================
  // AUDITORIA
  // ==========================================

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
