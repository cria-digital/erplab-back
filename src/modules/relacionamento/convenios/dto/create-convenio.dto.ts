import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TipoFaturamento, StatusConvenio } from '../entities/convenio.entity';
import { CreateEmpresaDto } from '../../../cadastros/empresas/dto/create-empresa.dto';

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

  @ApiProperty({ description: 'Nome do convênio', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  nome?: string;

  @ApiProperty({ description: 'Registro ANS', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  registro_ans?: string;

  @ApiProperty({ description: 'Tem integração API', default: false })
  @IsOptional()
  @IsBoolean()
  tem_integracao_api?: boolean;

  @ApiProperty({ description: 'URL da API', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  url_api?: string;

  @ApiProperty({ description: 'Token da API', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  token_api?: string;

  @ApiProperty({ description: 'Requer autorização', default: true })
  @IsOptional()
  @IsBoolean()
  requer_autorizacao?: boolean;

  @ApiProperty({ description: 'Requer senha', default: false })
  @IsOptional()
  @IsBoolean()
  requer_senha?: boolean;

  @ApiProperty({ description: 'Validade da guia em dias', required: false })
  @IsOptional()
  @IsNumber()
  validade_guia_dias?: number;

  @ApiProperty({
    enum: TipoFaturamento,
    description: 'Tipo de faturamento',
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoFaturamento)
  tipo_faturamento?: TipoFaturamento;

  @ApiProperty({ description: 'Portal de envio', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  portal_envio?: string;

  @ApiProperty({ description: 'Dia de fechamento', required: false })
  @IsOptional()
  @IsNumber()
  dia_fechamento?: number;

  @ApiProperty({ description: 'Prazo de pagamento em dias', default: 30 })
  @IsOptional()
  @IsNumber()
  prazo_pagamento_dias?: number;

  @ApiProperty({ description: 'Percentual de desconto', required: false })
  @IsOptional()
  @IsNumber()
  percentual_desconto?: number;

  @ApiProperty({ description: 'Tabela de preços', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  tabela_precos?: string;

  @ApiProperty({ description: 'Telefone', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefone?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Nome do contato', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  contato_nome?: string;

  @ApiProperty({ description: 'Regras específicas (JSON)', required: false })
  @IsOptional()
  regras_especificas?: any;

  @ApiProperty({
    enum: StatusConvenio,
    description: 'Status do convênio',
    default: StatusConvenio.ATIVO,
  })
  @IsOptional()
  @IsEnum(StatusConvenio)
  status?: StatusConvenio;

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

  @ApiProperty({ description: 'Observações do convênio', required: false })
  @IsOptional()
  @IsString()
  observacoes_convenio?: string;
}
