import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para atualização de Item da Tabela de Preços
 *
 * Todos os campos são opcionais (PATCH).
 * Não permite alterar tabela_preco_id nem exame_id (identificadores do item).
 */
export class UpdateTabelaPrecoItemDto {
  // ==========================================
  // CAMPOS DO FIGMA - Valores da tabela
  // ==========================================

  @ApiPropertyOptional({
    description: 'Valor do exame na tabela',
    example: 150.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Valor deve ser um número com no máximo 2 casas decimais' },
  )
  @Min(0, { message: 'Valor não pode ser negativo' })
  valor?: number;

  @ApiPropertyOptional({
    description: 'Código do convênio para este exame (quando não usa TUSS/AMB)',
    example: 'CON001',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Código do convênio deve ser uma string' })
  @MaxLength(50, {
    message: 'Código do convênio deve ter no máximo 50 caracteres',
  })
  codigo_convenio?: string;

  @ApiPropertyOptional({
    description: 'Moeda do valor',
    example: 'BRL',
    maxLength: 10,
  })
  @IsOptional()
  @IsString({ message: 'Moeda deve ser uma string' })
  @MaxLength(10, { message: 'Moeda deve ter no máximo 10 caracteres' })
  moeda?: string;

  @ApiPropertyOptional({
    description: 'Quantidade de filme',
    example: 2.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 4 },
    {
      message:
        'Quantidade de filme deve ser um número com no máximo 4 casas decimais',
    },
  )
  @Min(0, { message: 'Quantidade de filme não pode ser negativa' })
  quantidade_filme?: number;

  @ApiPropertyOptional({
    description: 'Filme cobrado separadamente?',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Filme separado deve ser um booleano' })
  filme_separado?: boolean;

  @ApiPropertyOptional({
    description: 'Porte anestésico',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Porte deve ser um número inteiro' })
  @Min(0, { message: 'Porte não pode ser negativo' })
  porte?: number;

  @ApiPropertyOptional({
    description: 'Custo operacional',
    example: 50.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Custo operacional deve ser um número com no máximo 2 casas decimais',
    },
  )
  @Min(0, { message: 'Custo operacional não pode ser negativo' })
  custo_operacional?: number;

  // ==========================================
  // CONTROLE
  // ==========================================

  @ApiPropertyOptional({
    description: 'Item ativo?',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um booleano' })
  ativo?: boolean;

  // ==========================================
  // CAMPOS PARA BATCH UPDATE (opcional)
  // ==========================================

  @ApiPropertyOptional({
    description: 'ID do exame (para identificação em batch update)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID do exame deve ser um UUID válido' })
  exame_id?: string;
}
