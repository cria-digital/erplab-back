import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TipoSenha, StatusSenha } from '../entities/senha-atendimento.entity';

export class FiltroFilaDto {
  @ApiPropertyOptional({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de senha',
    enum: TipoSenha,
  })
  @IsOptional()
  @IsEnum(TipoSenha, { message: 'Tipo deve ser prioridade ou geral' })
  tipo?: TipoSenha;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: StatusSenha,
  })
  @IsOptional()
  @IsEnum(StatusSenha, { message: 'Status inválido' })
  status?: StatusSenha;

  @ApiPropertyOptional({
    description: 'Data para filtrar (formato: YYYY-MM-DD)',
    example: '2025-12-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data deve estar no formato YYYY-MM-DD' })
  data?: string;
}
