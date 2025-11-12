import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { TipoConta } from '../entities/conta-bancaria.entity';

export class CreateContaBancariaDto {
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
    description:
      'IDs das unidades de saúde vinculadas. Obrigatório na criação (mínimo 1). Na atualização, se fornecido, substitui completamente os vínculos anteriores.',
    example: ['uuid-1', 'uuid-2'],
    type: [String],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Pelo menos uma unidade deve ser informada' })
  @IsUUID('4', { each: true })
  unidades_ids: string[];
}
