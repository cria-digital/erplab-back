import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { ComposicaoFinanceira } from './composicao-financeira.entity';
import { ImpostoRetido } from './imposto-retido.entity';
import { Parcela } from './parcela.entity';
import { Anexo } from './anexo.entity';
import { ParcelamentoConfig } from './parcelamento-config.entity';
import { Tenant } from '../../../../tenants/entities/tenant.entity';
import {
  CredorTipo,
  TipoDocumento,
  StatusContaPagar,
} from '../enums/contas-pagar.enum';

@Entity('contas_pagar')
@Index(['codigoInterno'], { unique: true })
@Index(['credorTipo', 'credorId'])
@Index(['unidadeDevedoraId'])
@Index(['status'])
export class ContaPagar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'credor_tipo', type: 'enum', enum: CredorTipo })
  credorTipo: CredorTipo;

  @Column({ name: 'credor_id', type: 'uuid' })
  credorId: string;

  @Column({ name: 'unidade_devedora_id', type: 'uuid' })
  unidadeDevedoraId: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_devedora_id' })
  unidadeDevedora: UnidadeSaude;

  @Column({ name: 'tipo_documento', type: 'enum', enum: TipoDocumento })
  tipoDocumento: TipoDocumento;

  @Column({ name: 'numero_documento', type: 'varchar', length: 100 })
  numeroDocumento: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ name: 'valor_bruto', type: 'decimal', precision: 10, scale: 2 })
  valorBruto: number;

  @Column({ name: 'valor_liquido', type: 'decimal', precision: 10, scale: 2 })
  valorLiquido: number;

  @Column({ type: 'varchar', length: 7 })
  competencia: string;

  @Column({ name: 'data_emissao', type: 'date' })
  dataEmissao: Date;

  @Column({ name: 'codigo_interno', type: 'varchar', length: 50, unique: true })
  codigoInterno: string;

  @Column({
    type: 'enum',
    enum: StatusContaPagar,
    default: StatusContaPagar.A_PAGAR,
  })
  status: StatusContaPagar;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @OneToMany(() => ComposicaoFinanceira, (comp) => comp.contaPagar, {
    cascade: true,
  })
  composicoesFinanceiras: ComposicaoFinanceira[];

  @OneToMany(() => ImpostoRetido, (imp) => imp.contaPagar, { cascade: true })
  impostosRetidos: ImpostoRetido[];

  @OneToMany(() => Parcela, (parc) => parc.contaPagar, { cascade: true })
  parcelas: Parcela[];

  @OneToMany(() => Anexo, (anx) => anx.contaPagar, { cascade: true })
  anexos: Anexo[];

  @OneToOne(() => ParcelamentoConfig, (parc) => parc.contaPagar)
  parcelamentoConfig: ParcelamentoConfig;

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
