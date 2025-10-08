import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { PrestadorServicoCategoria } from './prestador-servico-categoria.entity';

export enum TipoContrato {
  FIXO = 'fixo',
  POR_DEMANDA = 'por_demanda',
  RETAINER = 'retainer',
  PROJETO = 'projeto',
}

export enum FormaPagamento {
  MENSALIDADE = 'mensalidade',
  POR_SERVICO = 'por_servico',
  HORA_TRABALHADA = 'hora_trabalhada',
  PACOTE_FECHADO = 'pacote_fechado',
  COMISSAO = 'comissao',
  MISTO = 'misto',
}

export enum StatusContrato {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
  EM_ANALISE = 'em_analise',
  CANCELADO = 'cancelado',
}

export enum FrequenciaPagamento {
  DIARIO = 'diario',
  SEMANAL = 'semanal',
  QUINZENAL = 'quinzenal',
  MENSAL = 'mensal',
  BIMESTRAL = 'bimestral',
  TRIMESTRAL = 'trimestral',
  SEMESTRAL = 'semestral',
  ANUAL = 'anual',
  POR_SERVICO = 'por_servico',
}

@Entity('prestadores_servico')
@Index(['codigoPrestador'], { unique: true })
@Index(['statusContrato'])
@Index(['tipoContrato'])
export class PrestadorServico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ name: 'empresa_id', type: 'uuid', unique: true })
  empresaId: string;

  @Column({
    name: 'codigo_prestador',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  codigoPrestador: string;

  @OneToMany(
    () => PrestadorServicoCategoria,
    (categoria) => categoria.prestadorServico,
    {
      cascade: true,
    },
  )
  categorias: PrestadorServicoCategoria[];

  // Informações do Contrato
  @Column({
    name: 'tipo_contrato',
    type: 'enum',
    enum: TipoContrato,
    default: TipoContrato.POR_DEMANDA,
  })
  tipoContrato: TipoContrato;

  @Column({
    name: 'numero_contrato',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  numeroContrato: string;

  @Column({
    name: 'data_inicio_contrato',
    type: 'date',
    nullable: true,
  })
  dataInicioContrato: Date;

  @Column({
    name: 'data_fim_contrato',
    type: 'date',
    nullable: true,
  })
  dataFimContrato: Date;

  @Column({
    name: 'renovacao_automatica',
    type: 'boolean',
    default: false,
  })
  renovacaoAutomatica: boolean;

  @Column({
    name: 'prazo_aviso_renovacao',
    type: 'int',
    nullable: true,
    comment: 'Dias de antecedência para aviso de renovação',
  })
  prazoAvisoRenovacao: number;

  // Informações de Pagamento
  @Column({
    name: 'forma_pagamento',
    type: 'enum',
    enum: FormaPagamento,
    default: FormaPagamento.POR_SERVICO,
  })
  formaPagamento: FormaPagamento;

  @Column({
    name: 'valor_hora',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  valorHora: number;

  @Column({
    name: 'valor_mensal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  valorMensal: number;

  @Column({
    name: 'valor_minimo',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  valorMinimo: number;

  @Column({
    name: 'prazo_pagamento',
    type: 'int',
    default: 30,
    comment: 'Prazo em dias',
  })
  prazoPagamento: number;

  @Column({
    name: 'dia_vencimento',
    type: 'int',
    nullable: true,
    comment: 'Dia do mês para vencimento',
  })
  diaVencimento: number;

  @Column({
    name: 'frequencia_pagamento',
    type: 'enum',
    enum: FrequenciaPagamento,
    default: FrequenciaPagamento.MENSAL,
  })
  frequenciaPagamento: FrequenciaPagamento;

  // PIX Settings
  @Column({
    name: 'tipo_pix',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  tipoPix: string;

  @Column({
    name: 'chave_pix',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  chavePix: string;

  // Dados Bancários
  @Column({
    name: 'banco',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  banco: string;

  @Column({
    name: 'agencia',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  agencia: string;

  @Column({
    name: 'conta',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  conta: string;

  @Column({
    name: 'tipo_conta',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  tipoConta: string;

  // Controles
  @Column({
    name: 'status_contrato',
    type: 'enum',
    enum: StatusContrato,
    default: StatusContrato.EM_ANALISE,
  })
  statusContrato: StatusContrato;

  @Column({
    name: 'sla_resposta',
    type: 'int',
    nullable: true,
    comment: 'SLA de resposta em horas',
  })
  slaResposta: number;

  @Column({
    name: 'sla_resolucao',
    type: 'int',
    nullable: true,
    comment: 'SLA de resolução em horas',
  })
  slaResolucao: number;

  @Column({
    name: 'horario_atendimento',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  horarioAtendimento: string;

  @Column({
    name: 'dias_atendimento',
    type: 'text',
    array: true,
    nullable: true,
  })
  diasAtendimento: string[];

  @Column({
    name: 'suporte_24x7',
    type: 'boolean',
    default: false,
  })
  suporte24x7: boolean;

  @Column({
    name: 'atende_urgencia',
    type: 'boolean',
    default: false,
  })
  atendeUrgencia: boolean;

  @Column({
    name: 'taxa_urgencia',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: 'Percentual adicional para urgência',
  })
  taxaUrgencia: number;

  // Avaliação
  @Column({
    name: 'avaliacao_media',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  avaliacaoMedia: number;

  @Column({
    name: 'total_avaliacoes',
    type: 'int',
    default: 0,
  })
  totalAvaliacoes: number;

  @Column({
    name: 'total_servicos_prestados',
    type: 'int',
    default: 0,
  })
  totalServicosPrestados: number;

  // Observações e configurações
  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
  })
  observacoes: string;

  @Column({
    name: 'requisitos_acesso',
    type: 'text',
    nullable: true,
    comment: 'Requisitos para acesso às instalações',
  })
  requisitosAcesso: string;

  @Column({
    name: 'certificacoes',
    type: 'text',
    array: true,
    nullable: true,
  })
  certificacoes: string[];

  @Column({
    name: 'seguros',
    type: 'text',
    array: true,
    nullable: true,
  })
  seguros: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
