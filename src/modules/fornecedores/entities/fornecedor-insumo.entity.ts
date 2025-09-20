import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import {
  Fornecedor,
  CategoriaInsumo,
  MetodoTransporte,
  FormaPagamentoFornecedor,
} from './fornecedor.entity';

export enum UnidadeMedida {
  UNIDADE = 'unidade',
  CAIXA = 'caixa',
  PACOTE = 'pacote',
  FRASCO = 'frasco',
  LITRO = 'litro',
  MILILITRO = 'mililitro',
  QUILOGRAMA = 'quilograma',
  GRAMA = 'grama',
  METRO = 'metro',
  CENTIMETRO = 'centimetro',
  PAR = 'par',
  CONJUNTO = 'conjunto',
}

export enum StatusInsumo {
  DISPONIVEL = 'disponivel',
  INDISPONIVEL = 'indisponivel',
  DESCONTINUADO = 'descontinuado',
  SOB_CONSULTA = 'sob_consulta',
}

@Entity('fornecedor_insumos')
@Unique(['fornecedor_id', 'codigo_interno'])
export class FornecedorInsumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fornecedor_id: string;

  @ManyToOne(() => Fornecedor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  // Identificação do Insumo
  @Column({ type: 'varchar', length: 50 })
  codigo_interno: string; // Código interno do fornecedor

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_fabricante: string; // Código do fabricante

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_barras: string;

  @Column({ type: 'varchar', length: 255 })
  nome_insumo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fabricante: string;

  // Categorização
  @Column({ type: 'enum', enum: CategoriaInsumo })
  categoria: CategoriaInsumo;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subcategoria: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  grupo_produto: string;

  // Especificações Técnicas
  @Column({ type: 'varchar', length: 50, nullable: true })
  modelo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  especificacao_tecnica: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tamanho: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  voltagem: string;

  // Unidades e Quantidades
  @Column({ type: 'enum', enum: UnidadeMedida })
  unidade_medida: UnidadeMedida;

  @Column({ type: 'int', default: 1 })
  quantidade_embalagem: number; // Quantas unidades por embalagem

  @Column({ type: 'int', nullable: true })
  quantidade_minima_pedido: number;

  @Column({ type: 'int', nullable: true })
  quantidade_maxima_pedido: number;

  @Column({ type: 'int', nullable: true })
  estoque_disponivel: number;

  // Preços e Condições
  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  preco_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  preco_promocional: number;

  @Column({ type: 'date', nullable: true })
  data_inicio_promocao: Date;

  @Column({ type: 'date', nullable: true })
  data_fim_promocao: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  desconto_quantidade: number; // Percentual de desconto por quantidade

  @Column({ type: 'int', nullable: true })
  quantidade_desconto: number; // A partir de quantas unidades tem desconto

  // Prazos de Entrega
  @Column({ type: 'int', nullable: true })
  prazo_entrega_dias: number;

  @Column({ type: 'enum', enum: MetodoTransporte, nullable: true })
  metodo_transporte_preferencial: MetodoTransporte;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  custo_frete: number;

  @Column({ type: 'boolean', default: false })
  frete_gratis_acima_valor: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_frete_gratis: number;

  // Pagamento
  @Column({ type: 'simple-array', nullable: true })
  formas_pagamento: string[]; // Array de FormaPagamentoFornecedor

  @Column({ type: 'int', nullable: true })
  prazo_pagamento_dias: number;

  // Status e Disponibilidade
  @Column({
    type: 'enum',
    enum: StatusInsumo,
    default: StatusInsumo.DISPONIVEL,
  })
  status: StatusInsumo;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'date', nullable: true })
  data_validade: Date; // Para produtos perecíveis

  @Column({ type: 'int', nullable: true })
  prazo_validade_meses: number; // Prazo de validade padrão

  // Certificações e Regulamentações
  @Column({ type: 'varchar', length: 100, nullable: true })
  registro_anvisa: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registro_inmetro: string;

  @Column({ type: 'simple-array', nullable: true })
  certificacoes_produto: string[];

  @Column({ type: 'boolean', default: false })
  requer_receita_medica: boolean;

  @Column({ type: 'boolean', default: false })
  produto_controlado: boolean;

  // Informações Adicionais
  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link_catalogo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagem_url: string;

  @Column({ type: 'text', nullable: true })
  ficha_tecnica: string; // URL ou texto da ficha técnica

  // Histórico
  @Column({ type: 'date', nullable: true })
  data_ultimo_pedido: Date;

  @Column({ type: 'int', default: 0 })
  total_pedidos: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  avaliacao_produto: number; // de 0 a 5

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
