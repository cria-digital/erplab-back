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
  ValidateNested,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  CategoriaInsumo,
  MetodoTransporte,
  FormaPagamentoFornecedor,
  StatusFornecedor,
} from '../entities/fornecedor.entity';
import { CreateEmpresaDto } from '../../empresas/dto/create-empresa.dto';

export class CreateFornecedorDto {
  @ApiProperty({ description: 'Dados da empresa', type: CreateEmpresaDto })
  @ValidateNested()
  @Type(() => CreateEmpresaDto)
  @IsNotEmpty()
  empresa: CreateEmpresaDto;

  @ApiProperty({ description: 'Código do fornecedor', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo_fornecedor: string;

  // Informações Específicas do Fornecedor
  @ApiProperty({
    description: 'Categorias de insumos fornecidas',
    enum: CategoriaInsumo,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CategoriaInsumo, { each: true })
  categorias_fornecidas?: CategoriaInsumo[];

  @ApiProperty({
    description: 'Métodos de transporte disponíveis',
    enum: MetodoTransporte,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MetodoTransporte, { each: true })
  metodos_transporte?: MetodoTransporte[];

  @ApiProperty({
    description: 'Formas de pagamento aceitas',
    enum: FormaPagamentoFornecedor,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(FormaPagamentoFornecedor, { each: true })
  formas_pagamento_aceitas?: FormaPagamentoFornecedor[];

  // Prazos e Condições
  @ApiProperty({ description: 'Prazo de entrega padrão em dias', default: 7 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  prazo_entrega_padrao?: number;

  @ApiProperty({
    description: 'Prazo de entrega urgente em dias',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  prazo_entrega_urgente?: number;

  @ApiProperty({
    description: 'Orçamento mínimo para pedidos',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  orcamento_minimo?: number;

  @ApiProperty({
    description: 'Orçamento máximo para pedidos',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  orcamento_maximo?: number;

  @ApiProperty({
    description: 'Desconto padrão em percentual',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  desconto_padrao?: number;

  // Avaliação e Qualificação
  @ApiProperty({ description: 'Avaliação média de 0 a 5', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  avaliacao_media?: number;

  @ApiProperty({ description: 'Total de avaliações', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_avaliacoes?: number;

  @ApiProperty({ enum: StatusFornecedor, description: 'Status do fornecedor' })
  @IsOptional()
  @IsEnum(StatusFornecedor)
  status_fornecedor?: StatusFornecedor;

  // Certificações e Qualidade
  @ApiProperty({
    description: 'Certificações do fornecedor',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificacoes?: string[];

  @ApiProperty({ description: 'Possui certificação ISO', default: false })
  @IsOptional()
  @IsBoolean()
  possui_certificacao_iso?: boolean;

  @ApiProperty({ description: 'Possui licença ANVISA', default: false })
  @IsOptional()
  @IsBoolean()
  possui_licenca_anvisa?: boolean;

  @ApiProperty({
    description: 'Data de vencimento das licenças',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  data_vencimento_licencas?: Date;

  // Informações Comerciais
  @ApiProperty({
    description: 'Nome do representante comercial',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  representante_comercial?: string;

  @ApiProperty({ description: 'Telefone comercial', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefone_comercial?: string;

  @ApiProperty({ description: 'Email comercial', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  email_comercial?: string;

  @ApiProperty({ description: 'Gerente de conta', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  gerente_conta?: string;

  // Configurações de Pedido
  @ApiProperty({ description: 'Aceita pedido urgente', default: false })
  @IsOptional()
  @IsBoolean()
  aceita_pedido_urgente?: boolean;

  @ApiProperty({ description: 'Faz entrega aos sábados', default: false })
  @IsOptional()
  @IsBoolean()
  entrega_sabado?: boolean;

  @ApiProperty({ description: 'Faz entrega aos domingos', default: false })
  @IsOptional()
  @IsBoolean()
  entrega_domingo?: boolean;

  @ApiProperty({
    description: 'Horário de início das entregas (HH:mm)',
    required: false,
  })
  @IsOptional()
  @IsString()
  horario_inicio_entrega?: string;

  @ApiProperty({
    description: 'Horário de fim das entregas (HH:mm)',
    required: false,
  })
  @IsOptional()
  @IsString()
  horario_fim_entrega?: string;

  // Área de Atendimento
  @ApiProperty({
    description: 'Estados atendidos (UF)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  estados_atendidos?: string[];

  @ApiProperty({
    description: 'Cidades específicas atendidas',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cidades_atendidas?: string[];

  @ApiProperty({ description: 'Atende todo o Brasil', default: false })
  @IsOptional()
  @IsBoolean()
  atende_todo_brasil?: boolean;

  // Observações e Notas
  @ApiProperty({ description: 'Observações gerais', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ description: 'Condições especiais', required: false })
  @IsOptional()
  @IsString()
  condicoes_especiais?: string;

  @ApiProperty({ description: 'Histórico de problemas', required: false })
  @IsOptional()
  @IsString()
  historico_problemas?: string;

  // Campos de Auditoria
  @ApiProperty({ description: 'Data do último pedido', required: false })
  @IsOptional()
  @IsDateString()
  data_ultimo_pedido?: Date;

  @ApiProperty({ description: 'Data da próxima avaliação', required: false })
  @IsOptional()
  @IsDateString()
  data_proxima_avaliacao?: Date;

  @ApiProperty({ description: 'ID do usuário que aprovou', required: false })
  @IsOptional()
  @IsUUID()
  aprovado_por?: string;

  @ApiProperty({ description: 'Data da aprovação', required: false })
  @IsOptional()
  @IsDateString()
  data_aprovacao?: Date;
}
