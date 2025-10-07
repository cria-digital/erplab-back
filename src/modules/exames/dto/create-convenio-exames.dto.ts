import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  MaxLength,
  IsEmail,
  Min,
  Max,
} from 'class-validator';

export class CreateConvenioExamesDto {
  @ApiProperty({
    description: 'Código interno único do convênio',
    example: 'CONV001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @ApiProperty({
    description: 'Nome do convênio',
    example: 'Unimed São Paulo',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description: 'Razão social',
    example: 'Unimed São Paulo Cooperativa de Trabalho Médico',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  razao_social: string;

  @ApiProperty({
    description: 'CNPJ do convênio (somente números)',
    example: '12345678901234',
    required: false,
    maxLength: 14,
  })
  @IsString()
  @IsOptional()
  @MaxLength(14)
  cnpj?: string;

  @ApiProperty({
    description: 'Registro ANS',
    example: '123456',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  registro_ans?: string;

  @ApiProperty({
    description: 'Se tem integração via API',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  tem_integracao_api?: boolean;

  @ApiProperty({
    description: 'URL da API do convênio',
    example: 'https://api.unimed.com.br/v1',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  url_api?: string;

  @ApiProperty({
    description: 'Token/chave de acesso da API',
    example: 'sk_live_123456789',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  token_api?: string;

  @ApiProperty({
    description: 'Se requer autorização prévia',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requer_autorizacao?: boolean;

  @ApiProperty({
    description: 'Se requer senha de autorização',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requer_senha?: boolean;

  @ApiProperty({
    description: 'Validade padrão da guia em dias',
    example: 30,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  validade_guia_dias?: number;

  @ApiProperty({
    description: 'Tipo de faturamento',
    enum: ['tiss', 'proprio', 'manual'],
    default: 'tiss',
  })
  @IsEnum(['tiss', 'proprio', 'manual'])
  @IsOptional()
  tipo_faturamento?: string;

  @ApiProperty({
    description: 'Portal de envio (SAVI, Orizon, etc)',
    example: 'SAVI',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  portal_envio?: string;

  @ApiProperty({
    description: 'Dia de fechamento do faturamento',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 31,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  dia_fechamento?: number;

  @ApiProperty({
    description: 'Prazo de pagamento em dias',
    example: 30,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  prazo_pagamento_dias?: number;

  @ApiProperty({
    description: 'Percentual de desconto padrão',
    example: 10.5,
    default: 0,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  percentual_desconto?: number;

  @ApiProperty({
    description: 'Tabela de preços utilizada',
    example: 'CBHPM 2023',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  tabela_precos?: string;

  @ApiProperty({
    description: 'Telefone de contato',
    example: '11987654321',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefone?: string;

  @ApiProperty({
    description: 'E-mail de contato',
    example: 'contato@unimed.com.br',
    required: false,
    maxLength: 255,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'Nome da pessoa de contato',
    example: 'João Silva',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  contato_nome?: string;

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Autorização via portal web, envio de guias até dia 20',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'Regras específicas do convênio',
    example: {
      requisitosPrevios: ['carteirinha', 'pedido médico'],
      examesExcluidos: ['COVID-19 PCR'],
    },
    required: false,
  })
  @IsOptional()
  regras_especificas?: any;

  @ApiProperty({
    description: 'Status do convênio',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
  })
  @IsEnum(['ativo', 'inativo', 'suspenso'])
  @IsOptional()
  status?: string;
}
