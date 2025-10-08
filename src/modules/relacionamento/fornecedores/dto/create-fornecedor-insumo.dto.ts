import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  Length,
  IsNotEmpty,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CategoriaInsumo,
  MetodoTransporte,
  FormaPagamentoFornecedor,
} from '../entities/fornecedor.entity';
import {
  UnidadeMedida,
  StatusInsumo,
} from '../entities/fornecedor-insumo.entity';

export class CreateFornecedorInsumoDto {
  @ApiProperty({ description: 'ID do fornecedor' })
  @IsNotEmpty()
  @IsUUID()
  fornecedor_id: string;

  // Identificação do Insumo
  @ApiProperty({ description: 'Código interno do fornecedor', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  codigo_interno: string;

  @ApiProperty({
    description: 'Código do fabricante',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  codigo_fabricante?: string;

  @ApiProperty({
    description: 'Código de barras',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  codigo_barras?: string;

  @ApiProperty({ description: 'Nome do insumo', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome_insumo: string;

  @ApiProperty({ description: 'Descrição detalhada', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Marca do produto',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  marca?: string;

  @ApiProperty({ description: 'Fabricante', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  fabricante?: string;

  // Categorização
  @ApiProperty({ enum: CategoriaInsumo, description: 'Categoria do insumo' })
  @IsNotEmpty()
  @IsEnum(CategoriaInsumo)
  categoria: CategoriaInsumo;

  @ApiProperty({ description: 'Subcategoria', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  subcategoria?: string;

  @ApiProperty({
    description: 'Grupo do produto',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  grupo_produto?: string;

  // Especificações Técnicas
  @ApiProperty({ description: 'Modelo', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  modelo?: string;

  @ApiProperty({
    description: 'Especificação técnica',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  especificacao_tecnica?: string;

  @ApiProperty({ description: 'Cor', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  cor?: string;

  @ApiProperty({ description: 'Tamanho', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  tamanho?: string;

  @ApiProperty({ description: 'Voltagem', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  voltagem?: string;

  // Unidades e Quantidades
  @ApiProperty({ enum: UnidadeMedida, description: 'Unidade de medida' })
  @IsNotEmpty()
  @IsEnum(UnidadeMedida)
  unidade_medida: UnidadeMedida;

  @ApiProperty({ description: 'Quantidade por embalagem', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantidade_embalagem?: number;

  @ApiProperty({ description: 'Quantidade mínima de pedido', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantidade_minima_pedido?: number;

  @ApiProperty({ description: 'Quantidade máxima de pedido', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantidade_maxima_pedido?: number;

  @ApiProperty({ description: 'Estoque disponível', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estoque_disponivel?: number;

  // Preços e Condições
  @ApiProperty({ description: 'Preço unitário', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preco_unitario?: number;

  @ApiProperty({ description: 'Preço promocional', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preco_promocional?: number;

  @ApiProperty({ description: 'Data de início da promoção', required: false })
  @IsOptional()
  @IsDateString()
  data_inicio_promocao?: Date;

  @ApiProperty({ description: 'Data de fim da promoção', required: false })
  @IsOptional()
  @IsDateString()
  data_fim_promocao?: Date;

  @ApiProperty({
    description: 'Percentual de desconto por quantidade',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  desconto_quantidade?: number;

  @ApiProperty({
    description: 'Quantidade mínima para desconto',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantidade_desconto?: number;

  // Prazos de Entrega
  @ApiProperty({ description: 'Prazo de entrega em dias', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(365)
  prazo_entrega_dias?: number;

  @ApiProperty({
    enum: MetodoTransporte,
    description: 'Método de transporte preferencial',
    required: false,
  })
  @IsOptional()
  @IsEnum(MetodoTransporte)
  metodo_transporte_preferencial?: MetodoTransporte;

  @ApiProperty({ description: 'Custo do frete', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  custo_frete?: number;

  @ApiProperty({
    description: 'Frete grátis acima de um valor',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  frete_gratis_acima_valor?: boolean;

  @ApiProperty({ description: 'Valor para frete grátis', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_frete_gratis?: number;

  // Pagamento
  @ApiProperty({
    description: 'Formas de pagamento aceitas',
    enum: FormaPagamentoFornecedor,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(FormaPagamentoFornecedor, { each: true })
  formas_pagamento?: FormaPagamentoFornecedor[];

  @ApiProperty({ description: 'Prazo de pagamento em dias', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(365)
  prazo_pagamento_dias?: number;

  // Status e Disponibilidade
  @ApiProperty({ enum: StatusInsumo, description: 'Status do insumo' })
  @IsOptional()
  @IsEnum(StatusInsumo)
  status?: StatusInsumo;

  @ApiProperty({ description: 'Insumo ativo', default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Data de validade (produtos perecíveis)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  data_validade?: Date;

  @ApiProperty({
    description: 'Prazo de validade padrão em meses',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(240)
  prazo_validade_meses?: number;

  // Certificações e Regulamentações
  @ApiProperty({
    description: 'Registro ANVISA',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  registro_anvisa?: string;

  @ApiProperty({
    description: 'Registro INMETRO',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  registro_inmetro?: string;

  @ApiProperty({
    description: 'Certificações do produto',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificacoes_produto?: string[];

  @ApiProperty({ description: 'Requer receita médica', default: false })
  @IsOptional()
  @IsBoolean()
  requer_receita_medica?: boolean;

  @ApiProperty({ description: 'Produto controlado', default: false })
  @IsOptional()
  @IsBoolean()
  produto_controlado?: boolean;

  // Informações Adicionais
  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({
    description: 'Link do catálogo',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  link_catalogo?: string;

  @ApiProperty({
    description: 'URL da imagem',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  imagem_url?: string;

  @ApiProperty({ description: 'Ficha técnica', required: false })
  @IsOptional()
  @IsString()
  ficha_tecnica?: string;

  @ApiProperty({ description: 'Avaliação do produto (0-5)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  avaliacao_produto?: number;
}
