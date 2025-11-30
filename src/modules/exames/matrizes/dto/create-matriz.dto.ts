import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCampoMatrizDto } from './create-campo-matriz.dto';

/**
 * DTO para criação de Matriz de Exame
 * Conforme Figma: Tipo de exame, Exame vinculado, Nome da matriz, Código interno
 */
export class CreateMatrizDto {
  @ApiProperty({
    description: 'Código interno único da matriz',
    example: 'HEM123',
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  codigoInterno: string;

  @ApiProperty({
    description: 'Nome da matriz',
    example: 'Hemograma 1',
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description:
      'ID do tipo de exame (EXTERNO, IMAGEM, LABORATORIAL, AUDIOMETRIA)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  tipoExameId: string;

  @ApiProperty({
    description: 'ID do exame vinculado',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  exameId: string;

  @ApiPropertyOptional({
    description: 'Caminho ou nome do arquivo de template importado',
    example: 'template-densitometria-ossea.pdf',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  templateArquivo?: string;

  @ApiPropertyOptional({
    description: 'Conteúdo do template em JSON para preview da matriz',
    example: {
      titulo: 'DENSITOMETRIA ÓSSEA',
      campos: [
        { nome: 'COLUNA LOMBAR (BMD)', valor: 'xxxxx' },
        { nome: 'FÊMUR DIREITO (BMD)', valor: 'xxxxx' },
      ],
    },
  })
  @IsOptional()
  @IsObject()
  templateDados?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Se a matriz está ativa',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({
    description: 'Campos da matriz',
    type: [CreateCampoMatrizDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCampoMatrizDto)
  campos?: CreateCampoMatrizDto[];
}
