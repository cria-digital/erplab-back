import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TabelaPrecoItem } from './tabela-preco-item.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
/**
 * Tipo de tabela de preços
 * - servico: Tabela de serviços/exames
 * - material_medicamento: Tabela de materiais e medicamentos (evolução futura)
 */
export enum TipoTabelaPreco {
  SERVICO = 'servico',
  MATERIAL_MEDICAMENTO = 'material_medicamento',
}

/**
 * Tabela de Preços
 *
 * Cadastro independente de tabelas de preços que posteriormente
 * são vinculadas aos convênios. Um convênio pode usar até 2 tabelas:
 * - Tabela de serviço (principal)
 * - Tabela base (fallback - se não encontrar preço na principal, busca aqui)
 *
 * Conforme Figma: chunk_020 páginas 17-20 e chunk_021 páginas 1-4
 */
@Entity('tabelas_preco')
export class TabelaPreco {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno da tabela',
  })
  codigo_interno: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Nome da tabela',
  })
  nome: string;

  @Column({
    type: 'enum',
    enum: TipoTabelaPreco,
    default: TipoTabelaPreco.SERVICO,
    comment: 'Tipo de tabela: servico ou material_medicamento',
  })
  tipo_tabela: TipoTabelaPreco;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações gerais da tabela',
  })
  observacoes: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Tabela ativa?',
  })
  ativo: boolean;

  // ==========================================
  // MULTI-TENANT
  // ==========================================

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK → empresas (multi-tenant)',
  })
  empresa_id: string;

  @ManyToOne(() => Empresa, { nullable: true })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  // ==========================================
  // RELACIONAMENTOS
  // ==========================================

  @OneToMany(() => TabelaPrecoItem, (item) => item.tabelaPreco, {
    cascade: true,
  })
  itens: TabelaPrecoItem[];

  // ==========================================
  // CONTROLE
  // ==========================================

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
