import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateSalaDto {
  @ApiProperty({
    description: 'Código interno único da sala',
    example: 'SALA080',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  codigoInterno: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  unidadeId: string;

  @ApiProperty({
    description: 'Setor da sala (valor do campo de formulário)',
    example: 'Hematologia',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  setor: string;

  @ApiProperty({
    description: 'Nome da sala',
    example: 'IMG-04',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Se a sala está ativa',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
