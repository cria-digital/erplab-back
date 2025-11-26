import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAmostra } from '../entities/amostra.entity';

export class CreateAmostraDto {
  @ApiProperty({
    description: 'Nome da amostra',
    example: 'Sangue Total com EDTA',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Código interno único da amostra',
    example: 'AMO001',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Código interno é obrigatório' })
  @IsString({ message: 'Código interno deve ser uma string' })
  @MinLength(3, { message: 'Código interno deve ter no mínimo 3 caracteres' })
  @MaxLength(50, { message: 'Código interno deve ter no máximo 50 caracteres' })
  codigoInterno: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da amostra',
    example: 'Amostra de sangue total coletada com anticoagulante EDTA',
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Status da amostra',
    enum: StatusAmostra,
    example: StatusAmostra.EM_REVISAO,
    default: StatusAmostra.EM_REVISAO,
  })
  @IsOptional()
  @IsEnum(StatusAmostra, {
    message: 'Status deve ser: ativo, inativo ou em_revisao',
  })
  status?: StatusAmostra;
}
