import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { TipoSala } from '../entities/sala.entity';

export class CreateSalaDto {
  @ApiProperty({
    description: 'Código único da sala',
    example: 'COL-01',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  codigoSala: string;

  @ApiProperty({
    description: 'Nome da sala',
    example: 'Sala de Coleta 1',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da sala',
    example: 'Sala equipada para coleta de sangue e urina',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo/finalidade da sala',
    enum: TipoSala,
    example: TipoSala.COLETA,
  })
  @IsEnum(TipoSala)
  tipoSala: TipoSala;

  @ApiPropertyOptional({
    description: 'Andar/pavimento',
    example: 'Térreo',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  andar?: string;

  @ApiPropertyOptional({
    description: 'Bloco/ala',
    example: 'Bloco A',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bloco?: string;

  @ApiPropertyOptional({
    description: 'Área em metros quadrados',
    example: 25.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiPropertyOptional({
    description: 'Capacidade máxima de pessoas',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capacidadePessoas?: number;

  @ApiPropertyOptional({
    description: 'ID do setor responsável pela sala',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  setorId?: string;

  @ApiPropertyOptional({
    description: 'Se possui ar-condicionado/climatização',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  possuiClimatizacao?: boolean;

  @ApiPropertyOptional({
    description: 'Se possui lavatório/pia',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  possuiLavatorio?: boolean;

  @ApiPropertyOptional({
    description: 'Se possui acessibilidade para cadeirantes',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  acessibilidade?: boolean;

  @ApiPropertyOptional({
    description: 'Observações gerais sobre a sala',
    example: 'Sala recém-reformada',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  unidadeId: string;

  @ApiPropertyOptional({
    description: 'ID da empresa',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;
}
