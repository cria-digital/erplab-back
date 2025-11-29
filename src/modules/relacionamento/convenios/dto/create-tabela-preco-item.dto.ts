import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsInt,
  MaxLength,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para criação de Item da Tabela de Preços
 *
 * Campos obrigatórios conforme Figma (chunk_021, página 1 - Valores da tabela):
 * - exame_id* (Cód Exame / Nome do exame - vínculo com cadastro de exames)
 * - valor*
 *
 * Campos opcionais:
 * - codigo_convenio (Cód Convênio)
 * - moeda (default: BRL)
 * - quantidade_filme (Qntd Filme, default: 0)
 * - filme_separado (Filme separado, default: false)
 * - porte (default: 0)
 * - custo_operacional
 * - ativo (default: true)
 */
export class CreateTabelaPrecoItemDto {
  // ==========================================
  // CAMPOS OBRIGATÓRIOS (Figma)
  // ==========================================

  @ApiProperty({
    description: 'ID do exame (vínculo com cadastro de exames)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty({ message: 'ID do exame é obrigatório' })
  @IsUUID('4', { message: 'ID do exame deve ser um UUID válido' })
  exame_id: string;

  @ApiProperty({
    description: 'Valor do exame na tabela',
    example: 150.0,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Valor deve ser um número com no máximo 2 casas decimais' },
  )
  @Min(0, { message: 'Valor não pode ser negativo' })
  valor: number;

  // ==========================================
  // CAMPOS OPCIONAIS (Figma - Valores da tabela)
  // ==========================================

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
    default: 'BRL',
    maxLength: 10,
  })
  @IsOptional()
  @IsString({ message: 'Moeda deve ser uma string' })
  @MaxLength(10, { message: 'Moeda deve ter no máximo 10 caracteres' })
  moeda?: string;

  @ApiPropertyOptional({
    description: 'Quantidade de filme',
    example: 2.5,
    default: 0,
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
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Filme separado deve ser um booleano' })
  filme_separado?: boolean;

  @ApiPropertyOptional({
    description: 'Porte anestésico',
    example: 1,
    default: 0,
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
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um booleano' })
  ativo?: boolean;

  // ==========================================
  // CAMPO OPCIONAL - Para uso em batch/update
  // ==========================================

  @ApiPropertyOptional({
    description:
      'ID da tabela de preços (usado em criação de itens individuais)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da tabela de preços deve ser um UUID válido' })
  tabela_preco_id?: string;
}
