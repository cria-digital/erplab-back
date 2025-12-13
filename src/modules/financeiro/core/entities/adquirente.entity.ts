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
import { ContaBancaria } from './conta-bancaria.entity';
import { RestricaoAdquirente } from './restricao-adquirente.entity';
import { AdquirenteUnidade } from './adquirente-unidade.entity';
import { AdquirenteTipoCartao } from './adquirente-tipo-cartao.entity';
import { Integracao } from '../../../atendimento/integracoes/entities/integracao.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
export enum StatusAdquirente {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

@Entity('adquirentes')
export class Adquirente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 255 })
  nome_adquirente: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  // Conta Associada (FK)
  @Column({ type: 'uuid' })
  conta_bancaria_id: string;

  @ManyToOne(() => ContaBancaria)
  @JoinColumn({ name: 'conta_bancaria_id' })
  conta_bancaria: ContaBancaria;

  // Tipos de cartão suportados (FK para alternativas_campo_formulario via tabela intermediária)
  @OneToMany(
    () => AdquirenteTipoCartao,
    (tipoCartao) => tipoCartao.adquirente,
    { cascade: true },
  )
  tipos_cartao: AdquirenteTipoCartao[];

  // Opção de parcelamento (FK para alternativas_campo_formulario)
  @Column({ type: 'uuid', nullable: true })
  opcao_parcelamento_id: string;

  @ManyToOne(() => AlternativaCampoFormulario, { nullable: true })
  @JoinColumn({ name: 'opcao_parcelamento_id' })
  opcao_parcelamento: AlternativaCampoFormulario;

  // Taxa por transação (%)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_transacao: number;

  // Taxa por parcelamento (%)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_parcelamento: number;

  // Porcentagem de repasse (%)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_repasse: number;

  // Prazo de repasse (em dias ou texto como "5 DIAS ÚTEIS")
  @Column({ type: 'varchar', length: 50, nullable: true })
  prazo_repasse: string;

  // Status (ativo/inativo)
  @Column({
    type: 'enum',
    enum: StatusAdquirente,
    default: StatusAdquirente.ATIVO,
  })
  status: StatusAdquirente;

  // === ABA INTEGRAÇÃO ===

  // Integração vinculada (FK)
  @Column({ type: 'uuid', nullable: true })
  integracao_id: string;

  @ManyToOne(() => Integracao, { nullable: true })
  @JoinColumn({ name: 'integracao_id' })
  integracao: Integracao;

  // Validade de configuração da API
  @Column({ type: 'date', nullable: true })
  validade_configuracao_api: Date;

  // Contingência (chave de API alternativa)
  @Column({ type: 'varchar', length: 500, nullable: true })
  chave_contingencia: string;

  // === RELACIONAMENTOS ===

  // Unidades Associadas (ManyToMany via tabela intermediária)
  @OneToMany(
    () => AdquirenteUnidade,
    (adquirenteUnidade) => adquirenteUnidade.adquirente,
    { cascade: true },
  )
  unidades_associadas: AdquirenteUnidade[];

  // Restrições por unidade
  @OneToMany(() => RestricaoAdquirente, (restricao) => restricao.adquirente)
  restricoes: RestricaoAdquirente[];

  // === TIMESTAMPS ===

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
