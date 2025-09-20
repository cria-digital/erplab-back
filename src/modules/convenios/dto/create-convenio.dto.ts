import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  Length,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TipoConvenio, Modalidade } from '../entities/convenio.entity';
import { CreateEmpresaDto } from '../../empresas/dto/create-empresa.dto';

export class CreateConvenioDto {
  @ApiProperty({ description: 'Dados da empresa', type: CreateEmpresaDto })
  @ValidateNested()
  @Type(() => CreateEmpresaDto)
  @IsNotEmpty()
  empresa: CreateEmpresaDto;

  @ApiProperty({ description: 'Código do convênio', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo_convenio: string;

  @ApiProperty({ description: 'Registro ANS', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  registro_ans?: string;

  @ApiProperty({ enum: TipoConvenio, description: 'Tipo do convênio' })
  @IsNotEmpty()
  @IsEnum(TipoConvenio)
  tipo_convenio: TipoConvenio;

  @ApiProperty({ enum: Modalidade, description: 'Modalidade do convênio' })
  @IsNotEmpty()
  @IsEnum(Modalidade)
  modalidade: Modalidade;

  @ApiProperty({ description: 'Prazo de pagamento em dias', default: 30 })
  @IsOptional()
  @IsNumber()
  prazo_pagamento?: number;

  @ApiProperty({ description: 'Dia de vencimento', required: false })
  @IsOptional()
  @IsNumber()
  dia_vencimento?: number;

  @ApiProperty({ description: 'Email de faturamento', required: false })
  @IsOptional()
  @IsEmail()
  email_faturamento?: string;

  @ApiProperty({ description: 'Chave PIX', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  pix_key?: string;

  @ApiProperty({ description: 'Observações do convênio', required: false })
  @IsOptional()
  @IsString()
  observacoes_convenio?: string;

  @ApiProperty({ description: 'Data do contrato', required: false })
  @IsOptional()
  @IsDateString()
  data_contrato?: Date;

  @ApiProperty({ description: 'Data de início da vigência', required: false })
  @IsOptional()
  @IsDateString()
  data_vigencia_inicio?: Date;

  @ApiProperty({ description: 'Data de fim da vigência', required: false })
  @IsOptional()
  @IsDateString()
  data_vigencia_fim?: Date;

  @ApiProperty({ description: 'Requer autorização', default: true })
  @IsOptional()
  @IsBoolean()
  requer_autorizacao?: boolean;

  @ApiProperty({ description: 'Aceita atendimento online', default: false })
  @IsOptional()
  @IsBoolean()
  aceita_atendimento_online?: boolean;

  @ApiProperty({ description: 'Percentual de coparticipação', required: false })
  @IsOptional()
  @IsNumber()
  percentual_coparticipacao?: number;

  @ApiProperty({ description: 'Valor da consulta', required: false })
  @IsOptional()
  @IsNumber()
  valor_consulta?: number;
}
