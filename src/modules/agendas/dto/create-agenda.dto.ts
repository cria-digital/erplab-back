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
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  StatusAgendaEnum,
  DiaSemanaEnum,
  PeriodoEnum,
} from '../enums/agendas.enum';

class CreatePeriodoAtendimentoDto {
  @ApiProperty({ enum: PeriodoEnum, description: 'Período do atendimento' })
  @IsEnum(PeriodoEnum)
  periodo: PeriodoEnum;

  @ApiProperty({ example: '08:00', description: 'Horário de início' })
  @IsString()
  horarioInicio: string;

  @ApiProperty({ example: '12:00', description: 'Horário de fim' })
  @IsString()
  horarioFim: string;

  @ApiPropertyOptional({ enum: DiaSemanaEnum, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(DiaSemanaEnum, { each: true })
  diasSemana?: DiaSemanaEnum[];

  @ApiPropertyOptional({ example: 30, description: 'Intervalo em minutos' })
  @IsOptional()
  @IsNumber()
  intervaloPeriodo?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  capacidadePeriodo?: number;
}

class CreateConfiguracaoAgendaDto {
  @ApiProperty({ enum: DiaSemanaEnum, isArray: true })
  @IsArray()
  @IsEnum(DiaSemanaEnum, { each: true })
  diasSemana: DiaSemanaEnum[];

  @ApiProperty({ type: [CreatePeriodoAtendimentoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePeriodoAtendimentoDto)
  periodosAtendimento: CreatePeriodoAtendimentoDto[];

  @ApiProperty({
    example: 30,
    description: 'Intervalo entre agendamentos em minutos',
  })
  @IsNumber()
  intervaloAgendamento: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  capacidadeTotal?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  capacidadePorHorario?: number;
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

  @ApiPropertyOptional({ example: 'Agenda para exames de ultrassonografia' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ description: 'ID da unidade de saúde associada' })
  @IsOptional()
  @IsUUID()
  unidadeAssociadaId?: string;

  @ApiPropertyOptional({ description: 'ID do setor' })
  @IsOptional()
  @IsUUID()
  setorId?: string;

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

  @ApiProperty({ type: CreateConfiguracaoAgendaDto })
  @ValidateNested()
  @Type(() => CreateConfiguracaoAgendaDto)
  configuracaoAgenda: CreateConfiguracaoAgendaDto;

  @ApiPropertyOptional({
    enum: StatusAgendaEnum,
    default: StatusAgendaEnum.ATIVO,
  })
  @IsOptional()
  @IsEnum(StatusAgendaEnum)
  status?: StatusAgendaEnum;
}
