import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  Length,
  IsNotEmpty,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  TipoIntegracaoTelemedicina,
  TipoPlataforma,
  StatusIntegracao,
} from '../entities/telemedicina.entity';
import { CreateEmpresaDto } from '../../../cadastros/empresas/dto/create-empresa.dto';

export class CreateTelemedicinaDto {
  @ApiProperty({ description: 'Dados da empresa', type: CreateEmpresaDto })
  @ValidateNested()
  @Type(() => CreateEmpresaDto)
  @IsNotEmpty()
  empresa: CreateEmpresaDto;

  @ApiProperty({ description: 'Código da telemedicina', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo_telemedicina: string;

  // Configurações de Integração
  @ApiProperty({
    enum: TipoIntegracaoTelemedicina,
    description: 'Tipo de integração',
  })
  @IsOptional()
  @IsEnum(TipoIntegracaoTelemedicina)
  tipo_integracao?: TipoIntegracaoTelemedicina;

  @ApiProperty({ description: 'URL de integração', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  url_integracao?: string;

  @ApiProperty({ description: 'Token de integração', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  token_integracao?: string;

  @ApiProperty({ description: 'Usuário de integração', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  usuario_integracao?: string;

  @ApiProperty({ description: 'Senha de integração', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  senha_integracao?: string;

  @ApiProperty({
    description: 'Configuração adicional em JSON',
    required: false,
  })
  @IsOptional()
  @IsString()
  configuracao_adicional?: string;

  @ApiProperty({ enum: StatusIntegracao, description: 'Status da integração' })
  @IsOptional()
  @IsEnum(StatusIntegracao)
  status_integracao?: StatusIntegracao;

  // Informações da Plataforma
  @ApiProperty({ enum: TipoPlataforma, description: 'Tipo da plataforma' })
  @IsOptional()
  @IsEnum(TipoPlataforma)
  tipo_plataforma?: TipoPlataforma;

  @ApiProperty({ description: 'URL da plataforma', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  url_plataforma?: string;

  @ApiProperty({ description: 'Versão do sistema', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  versao_sistema?: string;

  // Especialidades e Serviços
  @ApiProperty({
    description: 'Especialidades atendidas',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  especialidades_atendidas?: string[];

  @ApiProperty({
    description: 'Tipos de consulta',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tipos_consulta?: string[];

  @ApiProperty({ description: 'Oferece teleconsulta', default: false })
  @IsOptional()
  @IsBoolean()
  teleconsulta?: boolean;

  @ApiProperty({ description: 'Oferece telediagnóstico', default: false })
  @IsOptional()
  @IsBoolean()
  telediagnostico?: boolean;

  @ApiProperty({ description: 'Oferece telecirurgia', default: false })
  @IsOptional()
  @IsBoolean()
  telecirurgia?: boolean;

  @ApiProperty({ description: 'Oferece telemonitoramento', default: false })
  @IsOptional()
  @IsBoolean()
  telemonitoramento?: boolean;

  // Configurações de Atendimento
  @ApiProperty({
    description: 'Tempo padrão de consulta em minutos',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(240)
  tempo_consulta_padrao?: number;

  @ApiProperty({ description: 'Permite agendamento online', default: false })
  @IsOptional()
  @IsBoolean()
  permite_agendamento_online?: boolean;

  @ApiProperty({ description: 'Permite cancelamento online', default: false })
  @IsOptional()
  @IsBoolean()
  permite_cancelamento_online?: boolean;

  @ApiProperty({
    description: 'Antecedência mínima para agendamento em horas',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(168) // 1 semana
  antecedencia_minima_agendamento?: number;

  @ApiProperty({
    description: 'Antecedência mínima para cancelamento em horas',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(48)
  antecedencia_minima_cancelamento?: number;

  // Configurações Técnicas
  @ApiProperty({ description: 'Certificado digital', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  certificado_digital?: string;

  @ApiProperty({ description: 'Suporte à gravação', default: false })
  @IsOptional()
  @IsBoolean()
  suporte_gravacao?: boolean;

  @ApiProperty({ description: 'Suporte à streaming', default: false })
  @IsOptional()
  @IsBoolean()
  suporte_streaming?: boolean;

  @ApiProperty({ description: 'Criptografia end-to-end', default: true })
  @IsOptional()
  @IsBoolean()
  criptografia_end_to_end?: boolean;

  @ApiProperty({ description: 'Protocolo de segurança', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  protocolo_seguranca?: string;

  // Valores e Cobrança
  @ApiProperty({ description: 'Valor da consulta particular', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_consulta_particular?: number;

  @ApiProperty({ description: 'Percentual de repasse', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentual_repasse?: number;

  @ApiProperty({ description: 'Taxa da plataforma', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxa_plataforma?: number;

  // Observações
  @ApiProperty({ description: 'Observações gerais', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ description: 'Requisitos técnicos', required: false })
  @IsOptional()
  @IsString()
  requisitos_tecnicos?: string;
}
