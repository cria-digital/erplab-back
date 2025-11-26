import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsInt,
  IsBoolean,
  IsArray,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TipoAdquirente,
  StatusAdquirente,
  TipoCartao,
  OpcaoParcelamento,
} from '../entities/adquirente.entity';

export class UnidadeAssociadaDto {
  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  unidade_saude_id: string;

  @ApiProperty({
    description: 'Se o vínculo está ativo',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}

export class CreateAdquirenteDto {
  @ApiProperty({
    description: 'ID da conta bancária associada',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  conta_bancaria_id: string;

  @ApiProperty({
    description: 'Código interno único do adquirente',
    example: 'ADQ001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo_interno: string;

  @ApiProperty({
    description: 'Nome do adquirente',
    example: 'Cielo',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome_adquirente: string;

  @ApiProperty({
    description: 'Descrição do adquirente',
    example: 'Adquirente principal para cartões de crédito',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo do adquirente',
    enum: TipoAdquirente,
    example: TipoAdquirente.CIELO,
  })
  @IsEnum(TipoAdquirente)
  @IsNotEmpty()
  tipo_adquirente: TipoAdquirente;

  @ApiProperty({
    description: 'Tipos de cartão suportados',
    type: [String],
    enum: TipoCartao,
    example: [TipoCartao.MASTERCARD, TipoCartao.VISA],
    required: false,
  })
  @IsArray()
  @IsEnum(TipoCartao, { each: true })
  @IsOptional()
  tipos_cartao_suportados?: TipoCartao[];

  @ApiProperty({
    description: 'Opção de parcelamento',
    enum: OpcaoParcelamento,
    example: OpcaoParcelamento['12X'],
    default: OpcaoParcelamento['12X'],
    required: false,
  })
  @IsEnum(OpcaoParcelamento)
  @IsOptional()
  opcao_parcelamento?: OpcaoParcelamento;

  @ApiProperty({
    description: 'Taxa de transação (%)',
    example: 1.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_transacao?: number;

  @ApiProperty({
    description: 'Percentual de repasse (%)',
    example: 10.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  percentual_repasse?: number;

  @ApiProperty({
    description: 'Código do estabelecimento',
    example: '1234567890',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  codigo_estabelecimento?: string;

  @ApiProperty({
    description: 'ID do terminal',
    example: 'TERM001',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  terminal_id?: string;

  @ApiProperty({
    description: 'Taxa de antecipação (%)',
    example: 2.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_antecipacao?: number;

  @ApiProperty({
    description: 'Prazo de recebimento (dias)',
    example: 30,
    default: 30,
    required: false,
  })
  @IsInt()
  @IsOptional()
  prazo_recebimento?: number;

  @ApiProperty({
    description: 'Permite parcelamento',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  permite_parcelamento?: boolean;

  @ApiProperty({
    description: 'Número máximo de parcelas',
    example: 12,
    default: 12,
    required: false,
  })
  @IsInt()
  @IsOptional()
  parcela_maxima?: number;

  @ApiProperty({
    description: 'Taxa de parcelamento (%)',
    example: 3.2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_parcelamento?: number;

  @ApiProperty({
    description: 'Valor mínimo por parcela',
    example: 50.0,
    default: 50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  valor_minimo_parcela?: number;

  @ApiProperty({
    description: 'Status do adquirente',
    enum: StatusAdquirente,
    example: StatusAdquirente.ATIVO,
    default: StatusAdquirente.ATIVO,
    required: false,
  })
  @IsEnum(StatusAdquirente)
  @IsOptional()
  status?: StatusAdquirente;

  @ApiProperty({
    description: 'Nome do contato comercial',
    example: 'João Silva',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  contato_comercial?: string;

  @ApiProperty({
    description: 'Telefone do suporte',
    example: '(11) 3000-0000',
    maxLength: 20,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefone_suporte?: string;

  @ApiProperty({
    description: 'Email do suporte',
    example: 'suporte@cielo.com.br',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  email_suporte?: string;

  @ApiProperty({
    description: 'Observações sobre o adquirente',
    example: 'Adquirente principal para cartões',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'ID da integração vinculada',
    example: 'uuid',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  integracao_id?: string;

  @ApiProperty({
    description: 'Lista de unidades associadas ao adquirente',
    type: [UnidadeAssociadaDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnidadeAssociadaDto)
  @IsOptional()
  unidades_associadas?: UnidadeAssociadaDto[];
}
