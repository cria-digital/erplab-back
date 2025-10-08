import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  TipoLog,
  NivelLog,
  OperacaoLog,
} from '../entities/auditoria-log.entity';

export class FiltrosAuditoriaDto {
  @ApiPropertyOptional({
    description: 'Tipo do log',
    enum: TipoLog,
  })
  @IsOptional()
  @IsEnum(TipoLog)
  tipoLog?: TipoLog;

  @ApiPropertyOptional({
    description: 'Nível de severidade',
    enum: NivelLog,
  })
  @IsOptional()
  @IsEnum(NivelLog)
  nivel?: NivelLog;

  @ApiPropertyOptional({
    description: 'Tipo de operação',
    enum: OperacaoLog,
  })
  @IsOptional()
  @IsEnum(OperacaoLog)
  operacao?: OperacaoLog;

  @ApiPropertyOptional({
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4')
  usuarioId?: string;

  @ApiPropertyOptional({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4')
  unidadeSaudeId?: string;

  @ApiPropertyOptional({
    description: 'Nome do módulo',
    example: 'Pacientes',
  })
  @IsOptional()
  @IsString()
  modulo?: string;

  @ApiPropertyOptional({
    description: 'Nome da entidade',
    example: 'pacientes',
  })
  @IsOptional()
  @IsString()
  entidade?: string;

  @ApiPropertyOptional({
    description: 'ID da entidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4')
  entidadeId?: string;

  @ApiPropertyOptional({
    description: 'Endereço IP',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Data inicial (formato YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Data final (formato YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({
    description: 'Página atual',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Itens por página',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    example: 'dataHora',
    default: 'dataHora',
  })
  @IsOptional()
  @IsString()
  orderBy?: string = 'dataHora';

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC' = 'DESC';
}
