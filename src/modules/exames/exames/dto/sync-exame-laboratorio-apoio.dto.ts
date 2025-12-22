import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

/**
 * DTO para um item de sync de ficha de laboratório de apoio
 * - Se tiver id: faz UPDATE
 * - Se não tiver id: faz CREATE
 */
export class SyncExameLaboratorioApoioItemDto {
  @ApiPropertyOptional({
    description: 'ID da ficha (se informado, faz update; se não, faz create)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'ID do laboratório de apoio',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  laboratorio_apoio_id: string;

  @ApiPropertyOptional({
    description: 'Código do exame no laboratório de apoio',
    example: 'HEM001',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  codigo_exame_apoio?: string;

  @ApiPropertyOptional({ description: 'ID da metodologia' })
  @IsString()
  @IsOptional()
  metodologia_id?: string;

  @ApiPropertyOptional({ description: 'ID da unidade de medida' })
  @IsString()
  @IsOptional()
  unidade_medida_id?: string;

  @ApiPropertyOptional({ description: 'Se requer peso', example: false })
  @IsBoolean()
  @IsOptional()
  peso?: boolean;

  @ApiPropertyOptional({ description: 'Se requer altura', example: false })
  @IsBoolean()
  @IsOptional()
  altura?: boolean;

  @ApiPropertyOptional({ description: 'Se requer volume', example: false })
  @IsBoolean()
  @IsOptional()
  volume?: boolean;

  @ApiPropertyOptional({ description: 'ID da amostra' })
  @IsString()
  @IsOptional()
  amostra_id?: string;

  @ApiPropertyOptional({ description: 'ID da amostra a enviar' })
  @IsString()
  @IsOptional()
  amostra_enviar_id?: string;

  @ApiPropertyOptional({ description: 'ID do tipo de recipiente' })
  @IsString()
  @IsOptional()
  tipo_recipiente_id?: string;

  @ApiPropertyOptional({
    description: 'IDs das regiões de coleta',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  regioes_coleta_ids?: string[];

  @ApiPropertyOptional({ description: 'ID do volume mínimo' })
  @IsString()
  @IsOptional()
  volume_minimo_id?: string;

  @ApiPropertyOptional({ description: 'ID da estabilidade' })
  @IsString()
  @IsOptional()
  estabilidade_id?: string;

  @ApiPropertyOptional({ description: 'Formulários de atendimento' })
  @IsOptional()
  formularios_atendimento?: any;

  @ApiPropertyOptional({ description: 'Preparo geral' })
  @IsString()
  @IsOptional()
  preparo_geral?: string;

  @ApiPropertyOptional({ description: 'Preparo feminino' })
  @IsString()
  @IsOptional()
  preparo_feminino?: string;

  @ApiPropertyOptional({ description: 'Preparo infantil' })
  @IsString()
  @IsOptional()
  preparo_infantil?: string;

  @ApiPropertyOptional({ description: 'Coleta geral' })
  @IsString()
  @IsOptional()
  coleta_geral?: string;

  @ApiPropertyOptional({ description: 'Coleta feminino' })
  @IsString()
  @IsOptional()
  coleta_feminino?: string;

  @ApiPropertyOptional({ description: 'Coleta infantil' })
  @IsString()
  @IsOptional()
  coleta_infantil?: string;

  @ApiPropertyOptional({ description: 'Técnica de coleta' })
  @IsString()
  @IsOptional()
  tecnica_coleta?: string;

  @ApiPropertyOptional({ description: 'Lembrete para coletora' })
  @IsString()
  @IsOptional()
  lembrete_coletora?: string;

  @ApiPropertyOptional({
    description: 'Lembrete para recepcionista - Agendamento',
  })
  @IsString()
  @IsOptional()
  lembrete_recepcionista_agendamento?: string;

  @ApiPropertyOptional({ description: 'Lembrete para recepcionista - OS' })
  @IsString()
  @IsOptional()
  lembrete_recepcionista_os?: string;

  @ApiPropertyOptional({ description: 'Distribuição' })
  @IsString()
  @IsOptional()
  distribuicao?: string;

  @ApiPropertyOptional({ description: 'Prazo de entrega em dias', example: 2 })
  @IsNumber()
  @IsOptional()
  prazo_entrega_dias?: number;

  @ApiPropertyOptional({
    description: 'Formatos de laudo aceitos',
    example: ['PDF', 'XML'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  formatos_laudo?: string[];

  @ApiPropertyOptional({ description: 'Se está ativo', example: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}

/**
 * DTO para sincronizar fichas de laboratório de apoio de um exame
 *
 * Lógica:
 * - Tem id na lista? → UPDATE
 * - Não tem id na lista? → CREATE
 * - Existe no banco mas NÃO está na lista? → DELETE
 */
export class SyncExameLaboratoriosApoioDto {
  @ApiProperty({
    description: 'ID do exame que está sendo sincronizado',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  exame_id: string;

  @ApiProperty({
    description:
      'Lista completa de fichas do exame. Com id = update, sem id = create. Fichas que existem no banco mas não estão aqui serão removidas.',
    type: [SyncExameLaboratorioApoioItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncExameLaboratorioApoioItemDto)
  items: SyncExameLaboratorioApoioItemDto[];
}
