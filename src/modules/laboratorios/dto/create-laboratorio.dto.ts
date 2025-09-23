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
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoIntegracao } from '../entities/laboratorio.entity';

export class CreateLaboratorioDto {
  @ApiProperty({ description: 'Código do laboratório', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo: string;

  @ApiProperty({ description: 'Razão social', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  razao_social: string;

  @ApiProperty({ description: 'Nome fantasia', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome_fantasia: string;

  @ApiProperty({ description: 'CNPJ', minLength: 14, maxLength: 14 })
  @IsNotEmpty()
  @IsString()
  @Length(14, 14)
  cnpj: string;

  @ApiPropertyOptional({ description: 'Inscrição estadual' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  inscricao_estadual?: string;

  @ApiPropertyOptional({ description: 'Inscrição municipal' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  inscricao_municipal?: string;

  // Contato
  @ApiProperty({ description: 'Endereço' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  endereco: string;

  @ApiProperty({ description: 'Número' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  numero: string;

  @ApiPropertyOptional({ description: 'Complemento' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  complemento?: string;

  @ApiProperty({ description: 'Bairro' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  bairro: string;

  @ApiProperty({ description: 'Cidade' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  cidade: string;

  @ApiProperty({ description: 'UF', minLength: 2, maxLength: 2 })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  uf: string;

  @ApiProperty({ description: 'CEP', minLength: 8, maxLength: 8 })
  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  cep: string;

  @ApiProperty({ description: 'Telefone principal' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  telefone_principal: string;

  @ApiPropertyOptional({ description: 'Telefone secundário' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefone_secundario?: string;

  @ApiProperty({ description: 'Email principal' })
  @IsNotEmpty()
  @IsEmail()
  email_principal: string;

  @ApiPropertyOptional({ description: 'Email faturamento' })
  @IsOptional()
  @IsEmail()
  email_faturamento?: string;

  @ApiPropertyOptional({ description: 'Website' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  website?: string;

  // Responsável Técnico
  @ApiPropertyOptional({ description: 'Responsável técnico' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  responsavel_tecnico?: string;

  @ApiPropertyOptional({ description: 'Conselho do responsável' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  conselho_responsavel?: string;

  @ApiPropertyOptional({ description: 'Número do conselho' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  numero_conselho?: string;

  // Integração
  @ApiPropertyOptional({
    enum: TipoIntegracao,
    description: 'Tipo de integração',
    default: TipoIntegracao.MANUAL,
  })
  @IsOptional()
  @IsEnum(TipoIntegracao)
  tipo_integracao?: TipoIntegracao;

  @ApiPropertyOptional({ description: 'URL de integração' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  url_integracao?: string;

  @ApiPropertyOptional({ description: 'Token de integração' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  token_integracao?: string;

  @ApiPropertyOptional({ description: 'Usuário de integração' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  usuario_integracao?: string;

  @ApiPropertyOptional({ description: 'Senha de integração' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  senha_integracao?: string;

  @ApiPropertyOptional({ description: 'Configuração adicional (JSON)' })
  @IsOptional()
  @IsString()
  configuracao_adicional?: string;

  // Métodos de Envio
  @ApiPropertyOptional({
    description: 'Métodos de envio de resultado',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metodos_envio_resultado?: string[];

  @ApiPropertyOptional({ description: 'URL do portal de resultados' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  portal_resultados_url?: string;

  // Prazos e Condições
  @ApiPropertyOptional({
    description: 'Prazo entrega normal (dias)',
    default: 3,
  })
  @IsOptional()
  @IsNumber()
  prazo_entrega_normal?: number;

  @ApiPropertyOptional({
    description: 'Prazo entrega urgente (dias)',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  prazo_entrega_urgente?: number;

  @ApiPropertyOptional({ description: 'Taxa de urgência' })
  @IsOptional()
  @IsNumber()
  taxa_urgencia?: number;

  @ApiPropertyOptional({
    description: 'Prazo de pagamento (dias)',
    default: 30,
  })
  @IsOptional()
  @IsNumber()
  prazo_pagamento?: number;

  @ApiPropertyOptional({ description: 'Percentual de repasse' })
  @IsOptional()
  @IsNumber()
  percentual_repasse?: number;

  // Financeiro
  @ApiPropertyOptional({ description: 'Banco' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  banco?: string;

  @ApiPropertyOptional({ description: 'Agência' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  agencia?: string;

  @ApiPropertyOptional({ description: 'Conta' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  conta?: string;

  @ApiPropertyOptional({ description: 'Chave PIX' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  pix_key?: string;

  // Status e Configurações
  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({ description: 'Ativo', default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({ description: 'Aceita urgência', default: false })
  @IsOptional()
  @IsBoolean()
  aceita_urgencia?: boolean;

  @ApiPropertyOptional({
    description: 'Envia resultado automático',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  envia_resultado_automatico?: boolean;

  @ApiPropertyOptional({ description: 'Data do contrato' })
  @IsOptional()
  @IsDateString()
  data_contrato?: Date;

  @ApiPropertyOptional({ description: 'Data início vigência' })
  @IsOptional()
  @IsDateString()
  data_vigencia_inicio?: Date;

  @ApiPropertyOptional({ description: 'Data fim vigência' })
  @IsOptional()
  @IsDateString()
  data_vigencia_fim?: Date;
}
