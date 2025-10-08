import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusMetodo } from '../entities/metodo.entity';

export class CreateMetodoDto {
  @ApiProperty({
    description: 'Nome do método',
    example: 'ELISA - Enzyme-Linked Immunosorbent Assay',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Código interno único do método',
    example: 'MET123',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Código interno é obrigatório' })
  @IsString({ message: 'Código interno deve ser uma string' })
  @MinLength(3, { message: 'Código interno deve ter no mínimo 3 caracteres' })
  @MaxLength(50, { message: 'Código interno deve ter no máximo 50 caracteres' })
  codigoInterno: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do método',
    example: 'Método imunoenzimático para detecção de anticorpos',
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Status do método',
    enum: StatusMetodo,
    example: StatusMetodo.EM_VALIDACAO,
    default: StatusMetodo.EM_VALIDACAO,
  })
  @IsOptional()
  @IsEnum(StatusMetodo, {
    message: 'Status deve ser: ativo, inativo ou em_validacao',
  })
  status?: StatusMetodo;
}
