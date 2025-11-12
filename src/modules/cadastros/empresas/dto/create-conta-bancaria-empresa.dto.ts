import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  MaxLength,
} from 'class-validator';
import {
  TipoConta,
  StatusConta,
} from '../../../financeiro/core/entities/conta-bancaria.entity';

export class CreateContaBancariaEmpresaDto {
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

  @ApiPropertyOptional({
    description: 'Dígito da agência',
    example: '5',
    maxLength: 2,
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

  @ApiPropertyOptional({
    description: 'Tipo de chave PIX',
    example: 'cnpj',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  pix_tipo?: string;

  @ApiPropertyOptional({
    description: 'Chave PIX da conta',
    example: '12.345.678/0001-90',
    maxLength: 255,
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

  @ApiPropertyOptional({
    description: 'Observações sobre a conta',
    example: 'Conta principal para recebimentos',
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
}
