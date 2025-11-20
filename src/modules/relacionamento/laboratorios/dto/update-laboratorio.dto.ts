import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';

enum TipoIntegracao {
  API = 'api',
  WEBSERVICE = 'webservice',
  MANUAL = 'manual',
  FTP = 'ftp',
  EMAIL = 'email',
}

export class UpdateLaboratorioDto {
  @ApiPropertyOptional({ example: 'Dr. João Silva' })
  @IsOptional()
  @IsString()
  responsavelTecnico?: string;

  @ApiPropertyOptional({ example: 'CRF' })
  @IsOptional()
  @IsString()
  conselhoResponsavel?: string;

  @ApiPropertyOptional({ example: '12345-SP' })
  @IsOptional()
  @IsString()
  numeroConselho?: string;

  @ApiPropertyOptional({ enum: TipoIntegracao })
  @IsOptional()
  @IsEnum(TipoIntegracao)
  tipoIntegracao?: string;

  @ApiPropertyOptional({ example: 'https://api.laboratorio.com.br/v1' })
  @IsOptional()
  @IsString()
  urlIntegracao?: string;

  @ApiPropertyOptional({ example: 'token-secreto' })
  @IsOptional()
  @IsString()
  tokenIntegracao?: string;

  @ApiPropertyOptional({ example: 'usuario_api' })
  @IsOptional()
  @IsString()
  usuarioIntegracao?: string;

  @ApiPropertyOptional({ example: 'senha_api' })
  @IsOptional()
  @IsString()
  senhaIntegracao?: string;

  @ApiPropertyOptional({ example: '{"timeout": 30}' })
  @IsOptional()
  @IsString()
  configuracaoAdicional?: string;

  @ApiPropertyOptional({ example: ['email', 'portal'] })
  @IsOptional()
  @IsArray()
  metodosEnvioResultado?: string[];

  @ApiPropertyOptional({ example: 'https://portal.resultados.com.br' })
  @IsOptional()
  @IsString()
  portalResultadosUrl?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  prazoEntregaNormal?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  prazoEntregaUrgente?: number;

  @ApiPropertyOptional({ example: 50.0 })
  @IsOptional()
  @IsNumber()
  taxaUrgencia?: number;

  @ApiPropertyOptional({ example: 65.0 })
  @IsOptional()
  @IsNumber()
  percentualRepasse?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  aceitaUrgencia?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enviaResultadoAutomatico?: boolean;

  @ApiPropertyOptional({ example: 'Laboratório com certificação PALC' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
