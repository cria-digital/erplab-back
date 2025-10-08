import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StatusBanco } from '../entities/banco.entity';

export class CreateBancoDto {
  @ApiProperty({
    description: 'Código FEBRABAN do banco',
    example: '001',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3)
  codigo: string;

  @ApiProperty({
    description: 'Nome do banco',
    example: 'Banco do Brasil S.A.',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description: 'Código interno do banco',
    example: 'BB',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo_interno: string;

  @ApiProperty({
    description: 'Descrição adicional do banco',
    example: 'Banco do Brasil - Código FEBRABAN: 001',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'Status do banco',
    enum: StatusBanco,
    default: StatusBanco.ATIVO,
    required: false,
  })
  @IsEnum(StatusBanco)
  @IsOptional()
  status?: StatusBanco;
}
