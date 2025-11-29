import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUUID,
  IsArray,
  ValidateNested,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TipoTabelaPreco } from '../entities/tabela-preco.entity';
import { CreateTabelaPrecoItemDto } from './create-tabela-preco-item.dto';

/**
 * DTO para criação de Tabela de Preços
 *
 * Campos obrigatórios conforme Figma (chunk_021, página 1):
 * - codigo_interno*
 * - nome*
 * - tipo_tabela*
 *
 * Campos opcionais:
 * - observacoes
 * - ativo (default: true)
 * - empresa_id (multi-tenant)
 * - itens (array de itens da tabela)
 */
export class CreateTabelaPrecoDto {
  // ==========================================
  // CAMPOS OBRIGATÓRIOS (Figma)
  // ==========================================

  @ApiProperty({
    description: 'Código interno da tabela de preços (único)',
    example: 'TAB001',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Código interno é obrigatório' })
  @IsString({ message: 'Código interno deve ser uma string' })
  @MaxLength(50, { message: 'Código interno deve ter no máximo 50 caracteres' })
  codigo_interno: string;

  @ApiProperty({
    description: 'Nome da tabela de preços',
    example: 'Tabela Convênio X',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome da tabela é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Tipo de tabela de preços',
    enum: TipoTabelaPreco,
    example: TipoTabelaPreco.SERVICO,
    enumName: 'TipoTabelaPreco',
  })
  @IsNotEmpty({ message: 'Tipo de tabela é obrigatório' })
  @IsEnum(TipoTabelaPreco, {
    message: `Tipo de tabela deve ser: ${Object.values(TipoTabelaPreco).join(', ')}`,
  })
  tipo_tabela: TipoTabelaPreco;

  // ==========================================
  // CAMPOS OPCIONAIS (Figma)
  // ==========================================

  @ApiPropertyOptional({
    description: 'Observações gerais da tabela',
    example: 'Tabela válida para atendimentos ambulatoriais',
  })
  @IsOptional()
  @IsString({ message: 'Observações deve ser uma string' })
  observacoes?: string;

  // ==========================================
  // CONTROLE
  // ==========================================

  @ApiPropertyOptional({
    description: 'Tabela ativa?',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um booleano' })
  ativo?: boolean;

  // ==========================================
  // MULTI-TENANT
  // ==========================================

  @ApiPropertyOptional({
    description: 'ID da empresa (multi-tenant)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da empresa deve ser um UUID válido' })
  empresa_id?: string;

  // ==========================================
  // ITENS DA TABELA (opcional na criação)
  // ==========================================

  @ApiPropertyOptional({
    description: 'Itens/linhas da tabela de preços',
    type: [CreateTabelaPrecoItemDto],
    example: [
      {
        exame_id: '550e8400-e29b-41d4-a716-446655440001',
        valor: 150.0,
        codigo_convenio: 'EXA001',
        moeda: 'BRL',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: 'Itens deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateTabelaPrecoItemDto)
  itens?: CreateTabelaPrecoItemDto[];
}
