import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';

export enum CategoriaInsumo {
  REAGENTES_INSUMOS = 'reagentes_insumos',
  EQUIPAMENTOS_MEDICOS = 'equipamentos_medicos',
  MATERIAL_ESCRITORIO = 'material_escritorio',
  UNIFORMES_EPI = 'uniformes_epi',
  MEDICAMENTOS = 'medicamentos',
  OUTROS = 'outros',
}

export enum MetodoTransporte {
  CORREIOS = 'correios',
  TRANSPORTADORA = 'transportadora',
  PROPRIO = 'proprio',
  ENTREGA_LOCAL = 'entrega_local',
  RETIRADA = 'retirada',
}

export enum FormaPagamentoFornecedor {
  BOLETO = 'boleto',
  PIX = 'pix',
  TRANSFERENCIA = 'transferencia',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  DINHEIRO = 'dinheiro',
  CHEQUE = 'cheque',
  PRAZO_30_DIAS = 'prazo_30_dias',
  PRAZO_60_DIAS = 'prazo_60_dias',
  PRAZO_90_DIAS = 'prazo_90_dias',
}

export enum StatusFornecedor {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  BLOQUEADO = 'bloqueado',
  PENDENTE_APROVACAO = 'pendente_aprovacao',
}

@Entity('fornecedores')
export class Fornecedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_fornecedor: string;

  // Informações Específicas do Fornecedor
  @Column({ type: 'simple-array', nullable: true })
  categorias_fornecidas: string[]; // Array de CategoriaInsumo

  @Column({ type: 'simple-array', nullable: true })
  metodos_transporte: string[]; // Array de MetodoTransporte

  @Column({ type: 'simple-array', nullable: true })
  formas_pagamento_aceitas: string[]; // Array de FormaPagamentoFornecedor

  // Prazos e Condições
  @Column({ type: 'int', default: 7 })
  prazo_entrega_padrao: number; // em dias

  @Column({ type: 'int', nullable: true })
  prazo_entrega_urgente: number; // em dias

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  orcamento_minimo: number; // valor mínimo de pedido

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  orcamento_maximo: number; // valor máximo de pedido

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  desconto_padrao: number; // percentual de desconto padrão

  // Avaliação e Qualificação
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  avaliacao_media: number; // de 0 a 5

  @Column({ type: 'int', default: 0 })
  total_avaliacoes: number;

  @Column({
    type: 'enum',
    enum: StatusFornecedor,
    default: StatusFornecedor.PENDENTE_APROVACAO,
  })
  status_fornecedor: StatusFornecedor;

  // Certificações e Qualidade
  @Column({ type: 'simple-array', nullable: true })
  certificacoes: string[]; // ISO 9001, ANVISA, etc.

  @Column({ type: 'boolean', default: false })
  possui_certificacao_iso: boolean;

  @Column({ type: 'boolean', default: false })
  possui_licenca_anvisa: boolean;

  @Column({ type: 'date', nullable: true })
  data_vencimento_licencas: Date;

  // Informações Comerciais
  @Column({ type: 'varchar', length: 100, nullable: true })
  representante_comercial: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone_comercial: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email_comercial: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gerente_conta: string;

  // Configurações de Pedido
  @Column({ type: 'boolean', default: false })
  aceita_pedido_urgente: boolean;

  @Column({ type: 'boolean', default: false })
  entrega_sabado: boolean;

  @Column({ type: 'boolean', default: false })
  entrega_domingo: boolean;

  @Column({ type: 'time', nullable: true })
  horario_inicio_entrega: string;

  @Column({ type: 'time', nullable: true })
  horario_fim_entrega: string;

  // Área de Atendimento
  @Column({ type: 'simple-array', nullable: true })
  estados_atendidos: string[]; // Array de UFs

  @Column({ type: 'simple-array', nullable: true })
  cidades_atendidas: string[]; // Array de cidades específicas

  @Column({ type: 'boolean', default: false })
  atende_todo_brasil: boolean;

  // Observações e Notas
  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'text', nullable: true })
  condicoes_especiais: string;

  @Column({ type: 'text', nullable: true })
  historico_problemas: string;

  // Campos de Auditoria
  @Column({ type: 'date', nullable: true })
  data_ultimo_pedido: Date;

  @Column({ type: 'date', nullable: true })
  data_proxima_avaliacao: Date;

  @Column({ type: 'uuid', nullable: true })
  aprovado_por: string; // ID do usuário que aprovou

  @Column({ type: 'date', nullable: true })
  data_aprovacao: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // TODO: Relacionamentos futuros
  // @OneToMany(() => FornecedorInsumo, (fi) => fi.fornecedor)
  // insumos: FornecedorInsumo[];

  // @OneToMany(() => PedidoCompra, (pc) => pc.fornecedor)
  // pedidos_compra: PedidoCompra[];

  // @OneToMany(() => AvaliacaoFornecedor, (af) => af.fornecedor)
  // avaliacoes: AvaliacaoFornecedor[];
}
