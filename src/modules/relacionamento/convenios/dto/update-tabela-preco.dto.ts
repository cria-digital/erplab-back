import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoTabelaPreco } from '../entities/tabela-preco.entity';

/**
 * DTO para atualização de Tabela de Preços
 *
 * Todos os campos são opcionais (PATCH).
 * Os itens da tabela são gerenciados separadamente via endpoints de TabelaPrecoItem.
 */
export class UpdateTabelaPrecoDto {
  // ==========================================
  // CAMPOS DO FIGMA - Informações básicas
  // ==========================================

  @ApiPropertyOptional({
    description: 'Código interno da tabela de preços (único)',
    example: 'TAB001',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Código interno deve ser uma string' })
  @MaxLength(50, { message: 'Código interno deve ter no máximo 50 caracteres' })
  codigo_interno?: string;

  @ApiPropertyOptional({
    description: 'Nome da tabela de preços',
    example: 'Tabela Convênio X',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome?: string;

  @ApiPropertyOptional({
    description: 'Tipo de tabela de preços',
    enum: TipoTabelaPreco,
    example: TipoTabelaPreco.SERVICO,
    enumName: 'TipoTabelaPreco',
  })
  @IsOptional()
  @IsEnum(TipoTabelaPreco, {
    message: `Tipo de tabela deve ser: ${Object.values(TipoTabelaPreco).join(', ')}`,
  })
  tipo_tabela?: TipoTabelaPreco;

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
}
