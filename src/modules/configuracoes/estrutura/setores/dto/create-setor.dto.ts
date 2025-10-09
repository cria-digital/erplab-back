import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TipoSetor } from '../entities/setor.entity';

export class CreateSetorDto {
  @ApiProperty({
    description: 'Código único do setor',
    example: 'LAB-HEMA',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  codigoSetor: string;

  @ApiProperty({
    description: 'Nome do setor',
    example: 'Laboratório de Hematologia',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do setor',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo/categoria do setor',
    enum: TipoSetor,
    example: TipoSetor.LABORATORIAL,
  })
  @IsEnum(TipoSetor)
  tipoSetor: TipoSetor;

  @ApiPropertyOptional({
    description: 'ID do setor pai (para hierarquia)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  setorPaiId?: string;

  @ApiPropertyOptional({
    description: 'ID do profissional responsável',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  responsavelId?: string;

  @ApiPropertyOptional({
    description: 'Observações gerais',
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
