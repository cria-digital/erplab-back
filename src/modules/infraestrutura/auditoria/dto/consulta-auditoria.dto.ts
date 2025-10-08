import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TipoOperacao, ModuloOperacao } from '../entities/log-auditoria.entity';

export class ConsultaAuditoriaDto {
  @ApiProperty({
    description: 'ID do usuário que executou a operação',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiProperty({
    description: 'Módulo do sistema onde ocorreu a operação',
    enum: ModuloOperacao,
    required: false,
  })
  @IsOptional()
  @IsEnum(ModuloOperacao)
  modulo?: ModuloOperacao;

  @ApiProperty({
    description: 'Nome da tabela/entidade afetada',
    required: false,
    example: 'usuarios',
  })
  @IsOptional()
  tabela?: string;

  @ApiProperty({
    description: 'Tipo de operação realizada',
    enum: TipoOperacao,
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoOperacao)
  tipoOperacao?: TipoOperacao;

  @ApiProperty({
    description: 'Data de início do filtro (ISO 8601)',
    required: false,
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiProperty({
    description: 'Data de fim do filtro (ISO 8601)',
    required: false,
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiProperty({
    description: 'Filtrar apenas operações sensíveis',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  operacaoSensivel?: boolean;

  @ApiProperty({
    description: 'Filtrar apenas operações que falharam',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  falhaOperacao?: boolean;

  @ApiProperty({
    description: 'Número da página',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Quantidade de registros por página',
    minimum: 1,
    maximum: 100,
    default: 50,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

export class ConsultaHistoricoDto {
  @ApiProperty({
    description: 'ID do usuário que fez a alteração',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiProperty({
    description: 'Nome da tabela origem da alteração',
    required: false,
    example: 'usuarios',
  })
  @IsOptional()
  tabelaOrigem?: string;

  @ApiProperty({
    description: 'ID do registro que foi alterado',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  registroId?: string;

  @ApiProperty({
    description: 'Nome do campo que foi alterado',
    required: false,
    example: 'email',
  })
  @IsOptional()
  campoAlterado?: string;

  @ApiProperty({
    description: 'Data de início do filtro (ISO 8601)',
    required: false,
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiProperty({
    description: 'Data de fim do filtro (ISO 8601)',
    required: false,
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiProperty({
    description: 'Filtrar apenas alterações críticas',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  alteracaoCritica?: boolean;

  @ApiProperty({
    description: 'Filtrar apenas alterações que requerem aprovação',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  requerAprovacao?: boolean;

  @ApiProperty({
    description: 'Filtrar por status de aprovação',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  aprovada?: boolean;

  @ApiProperty({
    description: 'Número da página',
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Quantidade de registros por página',
    minimum: 1,
    maximum: 100,
    default: 50,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
