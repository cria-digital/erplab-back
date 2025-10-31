import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  MaxLength,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { TipoConta, StatusConta } from '../entities/conta-bancaria.entity';

export class CreateContaBancariaDto {
  @ApiProperty({
    description: 'Código interno único da conta bancária',
    example: 'CC001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo_interno: string;

  @ApiProperty({
    description: 'Nome/Apelido da conta',
    example: 'Conta Corrente Principal',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome_conta: string;

  @ApiProperty({
    description: 'Tipo de conta bancária',
    enum: TipoConta,
    example: TipoConta.CORRENTE,
    default: TipoConta.CORRENTE,
  })
  @IsEnum(TipoConta)
  @IsOptional()
  tipo_conta?: TipoConta;

  @ApiProperty({
    description: 'Número da agência',
    example: '1234',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  agencia: string;

  @ApiProperty({
    description: 'Dígito da agência',
    example: '5',
    maxLength: 2,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(2)
  digito_agencia?: string;

  @ApiProperty({
    description: 'Número da conta',
    example: '12345678',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numero_conta: string;

  @ApiProperty({
    description: 'Dígito verificador da conta',
    example: '9',
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  digito_conta: string;

  @ApiProperty({
    description: 'Nome do titular da conta',
    example: 'Clínica Saúde Total Ltda',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titular: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do titular',
    example: '12.345.678/0001-90',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  cpf_cnpj_titular: string;

  @ApiProperty({
    description: 'Tipo de chave PIX',
    example: 'cnpj',
    maxLength: 20,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  pix_tipo?: string;

  @ApiProperty({
    description: 'Chave PIX da conta',
    example: '12.345.678/0001-90',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  pix_chave?: string;

  @ApiProperty({
    description: 'Status da conta',
    enum: StatusConta,
    example: StatusConta.ATIVA,
    default: StatusConta.ATIVA,
  })
  @IsEnum(StatusConta)
  @IsOptional()
  status?: StatusConta;

  @ApiProperty({
    description: 'Saldo inicial da conta',
    example: 1000.0,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  saldo_inicial?: number;

  @ApiProperty({
    description: 'Observações sobre a conta',
    example: 'Conta principal para recebimentos',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'ID do banco',
    example: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  banco_id: string;

  @ApiProperty({
    description: 'ID da unidade de saúde (deprecated - use unidades_ids)',
    example: 'uuid',
    required: false,
    deprecated: true,
  })
  @IsUUID()
  @IsOptional()
  unidade_saude_id?: string;

  @ApiProperty({
    description: 'IDs das unidades de saúde vinculadas (mínimo 1)',
    example: ['uuid-1', 'uuid-2'],
    type: [String],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Pelo menos uma unidade deve ser informada' })
  @IsUUID('4', { each: true })
  unidades_ids: string[];
}
