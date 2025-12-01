import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
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

export class RestricaoAdquirenteDto {
  @ApiProperty({
    description: 'ID da unidade de saúde com restrição',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  unidade_saude_id: string;

  @ApiProperty({
    description: 'Descrição da restrição',
    example: 'Não pode parcelar acima de 6x',
  })
  @IsString()
  @IsNotEmpty()
  restricao: string;
}

export class CreateAdquirenteDto {
  // === INFORMAÇÕES INICIAIS ===

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
    example: 'PicPay',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome_adquirente: string;

  @ApiProperty({
    description: 'Descrição do adquirente',
    example: 'Adquirente para pagamentos digitais',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'ID da conta bancária associada',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  conta_bancaria_id: string;

  // === INFORMAÇÕES ESPECÍFICAS ===

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

  // === INFORMAÇÕES FINANCEIRAS ===

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
    description: 'Taxa por transação (%)',
    example: 1.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_transacao?: number;

  @ApiProperty({
    description: 'Taxa por parcelamento (%)',
    example: 3.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_parcelamento?: number;

  @ApiProperty({
    description: 'Porcentagem de repasse (%)',
    example: 10.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  percentual_repasse?: number;

  @ApiProperty({
    description: 'Prazo de repasse (ex: "5 dias úteis")',
    example: '5 dias úteis',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  prazo_repasse?: string;

  // === RESTRIÇÕES ===

  @ApiProperty({
    description: 'Lista de restrições por unidade',
    type: [RestricaoAdquirenteDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RestricaoAdquirenteDto)
  @IsOptional()
  restricoes?: RestricaoAdquirenteDto[];

  // === ABA INTEGRAÇÃO ===

  @ApiProperty({
    description: 'ID da integração vinculada',
    example: 'uuid',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  integracao_id?: string;

  @ApiProperty({
    description: 'Validade de configuração da API',
    example: '2026-01-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  validade_configuracao_api?: string;

  @ApiProperty({
    description: 'Chave de API alternativa (contingência)',
    example: 'chave_api_alternativa_123',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  chave_contingencia?: string;

  // === STATUS ===

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
}
