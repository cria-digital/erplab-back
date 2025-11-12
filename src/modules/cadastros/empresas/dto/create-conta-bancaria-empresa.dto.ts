import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TipoConta } from '../../../financeiro/core/entities/conta-bancaria.entity';

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
