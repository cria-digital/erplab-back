import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
  Length,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  TipoPlano,
  CategoriaPlano,
  ModalidadePlano,
  StatusPlano,
  CoberturaGeografica,
} from '../entities/plano.entity';

export class CreatePlanoDto {
  @ApiProperty({ description: 'ID do convênio' })
  @IsNotEmpty()
  @IsUUID()
  convenio_id: string;

  @ApiProperty({ description: 'Código do plano', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  codigo_plano: string;

  @ApiProperty({ description: 'Nome do plano', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome_plano: string;

  @ApiProperty({ enum: TipoPlano, description: 'Tipo do plano' })
  @IsNotEmpty()
  @IsEnum(TipoPlano)
  tipo_plano: TipoPlano;

  @ApiProperty({ enum: CategoriaPlano, description: 'Categoria do plano' })
  @IsNotEmpty()
  @IsEnum(CategoriaPlano)
  categoria: CategoriaPlano;

  @ApiProperty({ enum: ModalidadePlano, description: 'Modalidade do plano' })
  @IsNotEmpty()
  @IsEnum(ModalidadePlano)
  modalidade: ModalidadePlano;

  @ApiProperty({ description: 'Data de início da vigência' })
  @IsNotEmpty()
  @IsDateString()
  vigencia_inicio: Date;

  @ApiProperty({ description: 'Data de fim da vigência', required: false })
  @IsOptional()
  @IsDateString()
  vigencia_fim?: Date;

  @ApiProperty({
    enum: StatusPlano,
    description: 'Status do plano',
    default: StatusPlano.ATIVO,
  })
  @IsOptional()
  @IsEnum(StatusPlano)
  status?: StatusPlano;

  @ApiProperty({ description: 'Carência em dias', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carencia_dias?: number;

  @ApiProperty({
    enum: CoberturaGeografica,
    description: 'Cobertura geográfica',
  })
  @IsNotEmpty()
  @IsEnum(CoberturaGeografica)
  cobertura_geografica: CoberturaGeografica;

  @ApiProperty({ description: 'Valor da consulta', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_consulta?: number;

  @ApiProperty({ description: 'Valor CH', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_ch?: number;

  @ApiProperty({ description: 'Valor UCO', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_uco?: number;

  @ApiProperty({ description: 'Valor do filme', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_filme?: number;

  @ApiProperty({ description: 'Percentual de coparticipação', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentual_coparticipacao?: number;

  @ApiProperty({ description: 'Limite mensal', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limite_mensal?: number;

  @ApiProperty({ description: 'Limite anual', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limite_anual?: number;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
