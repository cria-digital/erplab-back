import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PrestadorServico } from './prestador-servico.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
export enum TipoServicoCategoria {
  MANUTENCAO_EQUIPAMENTOS = 'manutencao_equipamentos',
  PRESTADORES_EXAMES = 'prestadores_exames',
  HONORARIO_CONTABEIS = 'honorario_contabeis',
  HONORARIO_CONSULTORIA = 'honorario_consultoria',
  HONORARIO_ADVOCATICIO = 'honorario_advocaticio',
  INTERNET_TELEFONIA = 'internet_telefonia',
  AGUA = 'agua',
  ENERGIA = 'energia',
  SUPORTE_SOFTWARE = 'suporte_software',
  DESENVOLVIMENTO_SOFTWARE = 'desenvolvimento_software',
  SEGURANCA_MONITORAMENTO = 'seguranca_monitoramento',
  OUTROS_SERVICOS_PF = 'outros_servicos_pf',
  OUTROS_SERVICOS_PJ = 'outros_servicos_pj',
  LIMPEZA_CONSERVACAO = 'limpeza_conservacao',
  TRANSPORTE_LOGISTICA = 'transporte_logistica',
  MARKETING_PUBLICIDADE = 'marketing_publicidade',
  RECURSOS_HUMANOS = 'recursos_humanos',
  TREINAMENTO_CAPACITACAO = 'treinamento_capacitacao',
  ARQUITETURA_ENGENHARIA = 'arquitetura_engenharia',
  VIGILANCIA_SANITARIA = 'vigilancia_sanitaria',
  CALIBRACAO_METROLOGIA = 'calibracao_metrologia',
}

@Entity('prestador_servico_categorias')
@Index(['prestadorServicoId', 'tipoServico'], { unique: true })
@Index(['ativo'])
export class PrestadorServicoCategoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PrestadorServico, (prestador) => prestador.categorias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prestador_servico_id' })
  prestadorServico: PrestadorServico;

  @Column({ name: 'prestador_servico_id', type: 'uuid' })
  prestadorServicoId: string;

  @Column({
    name: 'tipo_servico',
    type: 'enum',
    enum: TipoServicoCategoria,
  })
  tipoServico: TipoServicoCategoria;

  @Column({
    name: 'descricao_servico',
    type: 'text',
    nullable: true,
  })
  descricaoServico: string;

  @Column({
    name: 'valor_padrao',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  valorPadrao: number;

  @Column({
    name: 'unidade_medida',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'hora, dia, mês, serviço, etc',
  })
  unidadeMedida: string;

  @Column({
    name: 'prazo_execucao',
    type: 'int',
    nullable: true,
    comment: 'Prazo padrão em dias',
  })
  prazoExecucao: number;

  @Column({
    name: 'periodicidade',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'diário, semanal, mensal, etc',
  })
  periodicidade: string;

  @Column({
    name: 'responsavel_tecnico',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  responsavelTecnico: string;

  @Column({
    name: 'telefone_responsavel',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefoneResponsavel: string;

  @Column({
    name: 'email_responsavel',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  emailResponsavel: string;

  @Column({
    name: 'requer_aprovacao',
    type: 'boolean',
    default: true,
  })
  requerAprovacao: boolean;

  @Column({
    name: 'requer_orcamento',
    type: 'boolean',
    default: false,
  })
  requerOrcamento: boolean;

  @Column({
    name: 'valor_limite_sem_aprovacao',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  valorLimiteSemAprovacao: number;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
  })
  ativo: boolean;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
  })
  observacoes: string;

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
