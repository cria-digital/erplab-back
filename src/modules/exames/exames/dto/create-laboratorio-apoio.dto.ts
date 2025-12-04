import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  MaxLength,
  IsArray,
} from 'class-validator';

export class CreateLaboratorioApoioDto {
  @ApiProperty({
    description: 'Código único do laboratório',
    example: 'LAB001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @ApiProperty({
    description: 'Nome do laboratório',
    example: 'Laboratório DB Diagnósticos',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description: 'Razão social',
    example: 'DB Diagnósticos Médicos Ltda',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  razao_social: string;

  @ApiProperty({
    description: 'CNPJ (somente números)',
    example: '12345678000199',
    required: false,
    maxLength: 14,
  })
  @IsString()
  @IsOptional()
  @MaxLength(14)
  cnpj?: string;

  @ApiProperty({
    description: 'Se o laboratório tem integração via API',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  tem_integracao_api?: boolean;

  @ApiProperty({
    description: 'URL da API de integração',
    example: 'https://api.laboratorio.com.br/v1',
    required: false,
  })
  @IsString()
  @IsOptional()
  url_api?: string;

  @ApiProperty({
    description: 'Usuário/login para API',
    example: 'usuario_api',
    required: false,
  })
  @IsString()
  @IsOptional()
  usuario_api?: string;

  @ApiProperty({
    description: 'Senha/token da API',
    example: 'token_secreto',
    required: false,
  })
  @IsString()
  @IsOptional()
  senha_api?: string;

  @ApiProperty({
    description: 'Forma de envio de amostras',
    enum: ['api', 'portal', 'email', 'manual'],
    default: 'manual',
    required: false,
  })
  @IsEnum(['api', 'portal', 'email', 'manual'])
  @IsOptional()
  forma_envio?: string;

  @ApiProperty({
    description: 'URL do portal web do laboratório',
    example: 'https://portal.laboratorio.com.br',
    required: false,
  })
  @IsString()
  @IsOptional()
  url_portal?: string;

  @ApiProperty({
    description: 'E-mail para envio de amostras',
    example: 'amostras@laboratorio.com.br',
    required: false,
  })
  @IsString()
  @IsOptional()
  email_envio?: string;

  @ApiProperty({
    description: 'Horário de coleta das amostras (HH:MM)',
    example: '08:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  horario_coleta?: string;

  @ApiProperty({
    description: 'Dias da semana de coleta',
    example: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  dias_coleta?: string[];

  @ApiProperty({
    description: 'Responsável pela coleta/transporte',
    example: 'Transportadora XYZ',
    required: false,
  })
  @IsString()
  @IsOptional()
  responsavel_coleta?: string;

  @ApiProperty({
    description: 'Prazo padrão em dias úteis',
    example: 3,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  prazo_padrao_dias?: number;

  @ApiProperty({
    description: 'Se aceita exames urgentes',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  aceita_urgencia?: boolean;

  @ApiProperty({
    description: 'Prazo de urgência em horas',
    example: 24,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  prazo_urgencia_horas?: number;

  @ApiProperty({
    description: 'Percentual de desconto',
    example: 10.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  percentual_desconto?: number;

  @ApiProperty({
    description: 'Periodicidade de faturamento',
    enum: ['mensal', 'quinzenal', 'semanal'],
    default: 'mensal',
    required: false,
  })
  @IsEnum(['mensal', 'quinzenal', 'semanal'])
  @IsOptional()
  periodicidade_faturamento?: string;

  @ApiProperty({
    description: 'Prazo de pagamento em dias',
    example: 30,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  prazo_pagamento_dias?: number;

  @ApiProperty({
    description: 'Telefone comercial',
    example: '11987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({
    description: 'WhatsApp',
    example: '11987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({
    description: 'E-mail de contato',
    example: 'contato@laboratorio.com.br',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Nome da pessoa de contato',
    example: 'João Silva',
    required: false,
  })
  @IsString()
  @IsOptional()
  contato_nome?: string;

  @ApiProperty({
    description: 'Observações',
    example: 'Laboratório parceiro para exames especializados',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'Status do laboratório',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
    required: false,
  })
  @IsEnum(['ativo', 'inativo', 'suspenso'])
  @IsOptional()
  status?: string;
}
