import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsObject,
  MaxLength,
} from 'class-validator';
import {
  TipoGateway,
  ModalidadeGateway,
  AmbienteGateway,
  StatusGateway,
} from '../entities/gateway-pagamento.entity';

export class CreateGatewayPagamentoDto {
  @ApiProperty({
    description: 'ID da conta bancária associada',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  conta_bancaria_id: string;

  @ApiProperty({
    description: 'Código interno único do gateway',
    example: 'GWAY001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo_interno: string;

  @ApiProperty({
    description: 'Nome identificador do gateway',
    example: 'Mercado Pago - Clínica São Paulo',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome_gateway: string;

  @ApiProperty({
    description: 'Tipo do gateway de pagamento',
    enum: TipoGateway,
    example: TipoGateway.MERCADOPAGO,
  })
  @IsEnum(TipoGateway)
  @IsNotEmpty()
  tipo_gateway: TipoGateway;

  @ApiProperty({
    description: 'Modalidade de pagamento',
    enum: ModalidadeGateway,
    example: ModalidadeGateway.TODOS,
    default: ModalidadeGateway.TODOS,
    required: false,
  })
  @IsEnum(ModalidadeGateway)
  @IsOptional()
  modalidade?: ModalidadeGateway;

  @ApiProperty({
    description: 'ID do estabelecimento (Merchant ID)',
    example: 'MERCHANT_123',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  merchant_id?: string;

  @ApiProperty({
    description: 'Chave do estabelecimento (Merchant Key)',
    example: 'KEY_SECRET_123',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  merchant_key?: string;

  @ApiProperty({
    description: 'Chave de API',
    example: 'TEST-123456789-abcdef',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  api_key?: string;

  @ApiProperty({
    description: 'Secret da API',
    example: 'SECRET_123',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  api_secret?: string;

  @ApiProperty({
    description: 'URL do webhook para notificações',
    example: 'https://api.clinica.com/webhook/mercadopago',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  webhook_url?: string;

  @ApiProperty({
    description: 'Secret do webhook',
    example: 'WEBHOOK_SECRET_123',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  webhook_secret?: string;

  @ApiProperty({
    description: 'Ambiente do gateway',
    enum: AmbienteGateway,
    example: AmbienteGateway.TESTE,
    default: AmbienteGateway.TESTE,
    required: false,
  })
  @IsEnum(AmbienteGateway)
  @IsOptional()
  ambiente?: AmbienteGateway;

  @ApiProperty({
    description: 'Taxa percentual para cartão de crédito',
    example: 2.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_credito?: number;

  @ApiProperty({
    description: 'Taxa percentual para cartão de débito',
    example: 1.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_debito?: number;

  @ApiProperty({
    description: 'Taxa percentual para PIX',
    example: 0.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_pix?: number;

  @ApiProperty({
    description: 'Taxa em reais para boleto',
    example: 3.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxa_boleto?: number;

  @ApiProperty({
    description: 'Prazo de recebimento em dias',
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  prazo_recebimento?: number;

  @ApiProperty({
    description: 'Status do gateway',
    enum: StatusGateway,
    example: StatusGateway.EM_CONFIGURACAO,
    default: StatusGateway.EM_CONFIGURACAO,
    required: false,
  })
  @IsEnum(StatusGateway)
  @IsOptional()
  status?: StatusGateway;

  @ApiProperty({
    description: 'Configurações adicionais do gateway (JSON)',
    example: { timeout: 30, retry: 3 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  configuracao_adicional?: any;

  @ApiProperty({
    description: 'Observações sobre o gateway',
    example: 'Gateway principal para pagamentos online',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
