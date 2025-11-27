import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  StatusIntegracao,
  TipoIntegracao,
} from '../entities/integracao.entity';

export class IntegracaoFiltersDto {
  @ApiProperty({
    required: false,
    default: 1,
    description: 'Número da página',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 20,
    description: 'Quantidade de itens por página',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({
    required: false,
    description: 'Termo de busca (nome, descrição ou código)',
    example: 'pardini',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({
    required: false,
    enum: StatusIntegracao,
    description: 'Filtrar por status da integração',
    example: StatusIntegracao.ATIVA,
  })
  @IsOptional()
  @IsEnum(StatusIntegracao)
  status?: StatusIntegracao;

  @ApiProperty({
    required: false,
    enum: TipoIntegracao,
    description: 'Filtrar por tipo/contexto da integração',
    example: TipoIntegracao.LABORATORIO_APOIO,
  })
  @IsOptional()
  @IsEnum(TipoIntegracao)
  tipo?: TipoIntegracao;

  @ApiProperty({
    required: false,
    description: 'Filtrar por status ativo/inativo',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filtrar por template/slug da integração',
    example: 'hermes-pardini',
  })
  @IsOptional()
  @IsString()
  templateSlug?: string;
}
