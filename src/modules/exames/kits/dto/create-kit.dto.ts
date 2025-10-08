import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TipoKitEnum, StatusKitEnum } from '../entities/kit.entity';

export class CreateKitExameDto {
  @ApiProperty({
    description: 'ID do exame a ser vinculado ao kit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  exameId: string;

  @ApiPropertyOptional({
    description: 'Quantidade do exame no kit',
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantidade?: number;

  @ApiPropertyOptional({
    description: 'Ordem de inserção/exibição do exame no kit',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  ordemInsercao?: number;

  @ApiPropertyOptional({
    description: 'Observações específicas para este exame no kit',
    example: 'Jejum de 12 horas necessário',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class CreateKitUnidadeDto {
  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  unidadeId: string;

  @ApiPropertyOptional({
    description: 'Se o kit está disponível nesta unidade',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @ApiPropertyOptional({
    description: 'Observações específicas para esta unidade',
    example: 'Disponível apenas às segundas e quartas',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class CreateKitConvenioDto {
  @ApiProperty({
    description: 'ID do convênio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  convenioId: string;

  @ApiPropertyOptional({
    description: 'Valor do kit para este convênio específico',
    example: 250.0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorConvenio?: number;

  @ApiPropertyOptional({
    description: 'Se o kit está disponível para este convênio',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @ApiPropertyOptional({
    description: 'Se requer autorização do convênio',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requerAutorizacao?: boolean;

  @ApiPropertyOptional({
    description: 'Observações específicas para este convênio',
    example: 'Necessária autorização prévia para maiores de 60 anos',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class CreateKitDto {
  @ApiProperty({
    description: 'Código interno único do kit',
    example: 'KIT001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigoInterno: string;

  @ApiProperty({
    description: 'Nome do kit',
    example: 'Kit Check-up Básico',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nomeKit: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do kit',
    example: 'Conjunto de exames básicos para check-up anual',
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo do kit',
    enum: TipoKitEnum,
    example: TipoKitEnum.CHECK_UP,
  })
  @IsEnum(TipoKitEnum)
  @IsNotEmpty()
  tipoKit: TipoKitEnum;

  @ApiPropertyOptional({
    description: 'Status do kit',
    enum: StatusKitEnum,
    example: StatusKitEnum.ATIVO,
    default: StatusKitEnum.ATIVO,
  })
  @IsEnum(StatusKitEnum)
  @IsOptional()
  statusKit?: StatusKitEnum;

  @ApiProperty({
    description: 'ID da empresa proprietária do kit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  empresaId: string;

  @ApiPropertyOptional({
    description: 'Prazo padrão de entrega em dias',
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  prazoPadraoEntrega?: number;

  @ApiPropertyOptional({
    description: 'Valor total do kit',
    example: 350.0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorTotal?: number;

  @ApiPropertyOptional({
    description: 'Preço de venda do kit',
    example: 400.0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  precoKit?: number;

  @ApiPropertyOptional({
    description: 'Observações gerais sobre o kit',
    example: 'Kit especial para campanhas de saúde',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Lista de exames do kit',
    type: [CreateKitExameDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKitExameDto)
  @IsOptional()
  exames?: CreateKitExameDto[];

  @ApiPropertyOptional({
    description: 'Lista de unidades onde o kit está disponível',
    type: [CreateKitUnidadeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKitUnidadeDto)
  @IsOptional()
  unidades?: CreateKitUnidadeDto[];

  @ApiPropertyOptional({
    description: 'Lista de convênios que aceitam o kit',
    type: [CreateKitConvenioDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKitConvenioDto)
  @IsOptional()
  convenios?: CreateKitConvenioDto[];
}
