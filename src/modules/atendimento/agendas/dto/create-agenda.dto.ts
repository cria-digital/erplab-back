import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiaSemanaEnum } from '../enums/agendas.enum';

class CreatePeriodoAtendimentoDto {
  @ApiProperty({ example: '08:00', description: 'Horário de início' })
  @IsString()
  horarioInicio: string;

  @ApiProperty({ example: '12:00', description: 'Horário de fim' })
  @IsString()
  horarioFim: string;
}

export class CreateAgendaDto {
  @ApiProperty({ example: 'AGE001', description: 'Código interno da agenda' })
  @IsString()
  @IsNotEmpty()
  codigoInterno: string;

  @ApiProperty({ example: 'ULTRASSONOGRAFIA - UNIDADE SÃO ROQUE' })
  @IsString()
  @IsNotEmpty()
  nomeAgenda: string;

  @ApiProperty({ description: 'ID da unidade de saúde' })
  @IsUUID()
  unidadeId: string;

  @ApiPropertyOptional({ example: 'Setor de Imagem' })
  @IsOptional()
  @IsString()
  setor?: string;

  @ApiPropertyOptional({ description: 'ID da sala' })
  @IsOptional()
  @IsUUID()
  salaId?: string;

  @ApiPropertyOptional({ description: 'ID do profissional' })
  @IsOptional()
  @IsUUID()
  profissionalId?: string;

  @ApiPropertyOptional({ description: 'ID da especialidade' })
  @IsOptional()
  @IsUUID()
  especialidadeId?: string;

  @ApiPropertyOptional({ description: 'ID do equipamento' })
  @IsOptional()
  @IsUUID()
  equipamentoId?: string;

  @ApiPropertyOptional({ example: 'Agenda para exames de ultrassonografia' })
  @IsOptional()
  @IsString()
  descricao?: string;

  // === CONFIGURAÇÃO DE AGENDA ===

  @ApiProperty({ enum: DiaSemanaEnum, isArray: true })
  @IsArray()
  @IsEnum(DiaSemanaEnum, { each: true })
  diasSemana: DiaSemanaEnum[];

  @ApiProperty({
    example: 30,
    description: 'Intervalo entre agendamentos em minutos',
  })
  @IsNumber()
  intervaloAgendamento: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  capacidadePorHorario?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  capacidadeTotal?: number;

  // === NOTIFICAÇÕES ===

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  notificarEmail?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  notificarWhatsapp?: boolean;

  @ApiPropertyOptional({ example: '24 horas' })
  @IsOptional()
  @IsString()
  prazoLembrete?: string;

  // === INTEGRAÇÃO ===

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  integracaoConvenios?: boolean;

  // === PERÍODOS DE ATENDIMENTO ===

  @ApiPropertyOptional({ type: [CreatePeriodoAtendimentoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePeriodoAtendimentoDto)
  periodosAtendimento?: CreatePeriodoAtendimentoDto[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
