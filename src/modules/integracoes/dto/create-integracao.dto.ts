import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsUrl,
  IsInt,
  IsBoolean,
  IsObject,
  Min,
  Max,
  Length,
} from 'class-validator';
import {
  TipoIntegracao,
  StatusIntegracao,
  PadraosComunicacao,
  FormatoRetorno,
} from '../entities/integracao.entity';

export class CreateIntegracaoDto {
  @ApiProperty({
    description: 'Tipo da integração',
    enum: TipoIntegracao,
    example: TipoIntegracao.LABORATORIO_APOIO,
  })
  @IsEnum(TipoIntegracao)
  tipoIntegracao: TipoIntegracao;

  @ApiProperty({
    description: 'Nome da integração',
    example: 'Integração Laboratório DB',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  nomeIntegracao: string;

  @ApiProperty({
    description: 'Descrição da API',
    example: 'Integração para busca de exames do laboratório DB',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  descricaoApi?: string;

  @ApiProperty({
    description: 'Código único de identificação',
    example: 'LAB001',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  codigoIdentificacao: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'uuid-da-unidade',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  unidadeSaudeId?: string;

  @ApiProperty({
    description: 'URL da API de exames',
    example: 'https://api.db.com.br/exames',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  urlApiExames?: string;

  @ApiProperty({
    description: 'URL da API de guia de exames',
    example: 'https://api.db.com.br/guias',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  urlApiGuiaExames?: string;

  @ApiProperty({
    description: 'Token de autenticação',
    example: 'bearer_token_aqui',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  tokenAutenticacao?: string;

  @ApiProperty({
    description: 'Chave da API',
    example: 'api_key_aqui',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  chaveApi?: string;

  @ApiProperty({
    description: 'Padrão de comunicação',
    enum: PadraosComunicacao,
    example: PadraosComunicacao.REST_API,
    required: false,
  })
  @IsOptional()
  @IsEnum(PadraosComunicacao)
  padraoComunicacao?: PadraosComunicacao;

  @ApiProperty({
    description: 'Formato de retorno',
    enum: FormatoRetorno,
    example: FormatoRetorno.JSON,
    required: false,
  })
  @IsOptional()
  @IsEnum(FormatoRetorno)
  formatoRetorno?: FormatoRetorno;

  @ApiProperty({
    description: 'Nome do laboratório (se aplicável)',
    example: 'Laboratório DB',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nomeLaboratorio?: string;

  @ApiProperty({
    description: 'Nome da prefeitura (se aplicável)',
    example: 'Prefeitura de São Roque',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nomePrefeitura?: string;

  @ApiProperty({
    description: 'Nome do banco (se aplicável)',
    example: 'Banco Bradesco',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nomeBanco?: string;

  @ApiProperty({
    description: 'Nome do gateway (se aplicável)',
    example: 'Mercado Pago',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nomeGateway?: string;

  @ApiProperty({
    description: 'Nome do convênio (se aplicável)',
    example: 'Intermédica',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nomeConvenio?: string;

  @ApiProperty({
    description: 'Nome do adquirente (se aplicável)',
    example: 'Cielo',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nomeAdquirente?: string;

  @ApiProperty({
    description: 'Nome da concessionária (se aplicável)',
    example: 'CPFL Energia',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nomeConcessionaria?: string;

  @ApiProperty({
    description: 'URL base da API',
    example: 'https://api.exemplo.com.br',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  urlBase?: string;

  @ApiProperty({
    description: 'URL de autenticação',
    example: 'https://api.exemplo.com.br/auth',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  urlAutenticacao?: string;

  @ApiProperty({
    description: 'URL de consulta',
    example: 'https://api.exemplo.com.br/consulta',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  urlConsulta?: string;

  @ApiProperty({
    description: 'URL de envio',
    example: 'https://api.exemplo.com.br/envio',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  urlEnvio?: string;

  @ApiProperty({
    description: 'URL de callback',
    example: 'https://meusite.com.br/webhook',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  urlCallback?: string;

  @ApiProperty({
    description: 'Usuário para autenticação',
    example: 'usuario_api',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  usuario?: string;

  @ApiProperty({
    description: 'Senha para autenticação',
    example: 'senha_secreta',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  senha?: string;

  @ApiProperty({
    description: 'Caminho do certificado digital',
    example: '/path/to/certificate.pfx',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  certificadoDigital?: string;

  @ApiProperty({
    description: 'Senha do certificado digital',
    example: 'senha_certificado',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  senhaCertificado?: string;

  @ApiProperty({
    description: 'Configurações adicionais em JSON',
    example: { retry: 3, timeout: 30000 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  configuracoesAdicionais?: any;

  @ApiProperty({
    description: 'Headers customizados em JSON',
    example: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  headersCustomizados?: any;

  @ApiProperty({
    description: 'Parâmetros de conexão em JSON',
    example: { pool_size: 10, keep_alive: true },
    required: false,
  })
  @IsOptional()
  @IsObject()
  parametrosConexao?: any;

  @ApiProperty({
    description: 'Status da integração',
    enum: StatusIntegracao,
    example: StatusIntegracao.EM_CONFIGURACAO,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusIntegracao)
  status?: StatusIntegracao;

  @ApiProperty({
    description: 'Se a integração está ativa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Timeout em segundos',
    example: 30,
    minimum: 1,
    maximum: 300,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(300)
  timeoutSegundos?: number;

  @ApiProperty({
    description: 'Intervalo de sincronização em minutos',
    example: 60,
    minimum: 1,
    maximum: 1440,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  intervaloSincronizacaoMinutos?: number;

  @ApiProperty({
    description: 'Limite de requisições por dia',
    example: 1000,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limiteRequisicoesDia?: number;

  @ApiProperty({
    description: 'Observações sobre a integração',
    example: 'Integração configurada para ambiente de produção',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  observacoes?: string;
}
