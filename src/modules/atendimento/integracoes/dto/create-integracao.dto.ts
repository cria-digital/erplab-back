import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsObject,
  Length,
  IsEnum,
} from 'class-validator';
import { TipoIntegracao } from '../entities/integracao.entity';

/**
 * DTO para criação de integração usando sistema de schemas
 */
export class CreateIntegracaoDto {
  @ApiProperty({
    description: 'Slug do template de integração (ex: hermes-pardini)',
    example: 'hermes-pardini',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  templateSlug: string;

  @ApiProperty({
    description: 'Código único de identificação da instância',
    example: 'HP-001',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  codigoIdentificacao: string;

  @ApiProperty({
    description: 'Nome descritivo da instância da integração',
    example: 'Hermes Pardini - Unidade Centro',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  nomeInstancia: string;

  @ApiProperty({
    description: 'Descrição opcional da integração',
    example: 'Integração para exames laboratoriais da unidade centro',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Tipos de contexto onde a integração será usada',
    example: ['LABORATORIO_APOIO'],
    isArray: true,
    enum: TipoIntegracao,
  })
  @IsArray()
  @IsEnum(TipoIntegracao, { each: true })
  tiposContexto: TipoIntegracao[];

  @ApiProperty({
    description: 'Objeto com configurações específicas do template',
    example: {
      usuario: 'hp_user',
      senha: 'SenhaSegura123!',
      ambiente: 'homologacao',
      url_wsdl: 'https://api.hermespardini.com.br/service?wsdl',
      timeout: 30,
    },
  })
  @IsObject()
  configuracoes: Record<string, any>;

  @ApiProperty({
    description: 'Observações sobre a integração',
    example: 'Configurada para ambiente de homologação',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
