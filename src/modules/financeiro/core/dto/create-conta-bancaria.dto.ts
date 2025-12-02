import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoConta, StatusConta } from '../entities/conta-bancaria.entity';

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

  @ApiPropertyOptional({
    description: 'Observações sobre a conta',
    example: 'Conta principal para recebimentos',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Status da conta bancária',
    enum: StatusConta,
    example: StatusConta.ATIVO,
    default: StatusConta.ATIVO,
  })
  @IsEnum(StatusConta)
  @IsOptional()
  status?: StatusConta;

  @ApiPropertyOptional({
    description: 'Chave PIX da conta',
    example: '12345678000190',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  chave_pix?: string;

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

  @ApiPropertyOptional({
    description:
      'IDs das unidades de saúde vinculadas. Opcional. Na atualização, se fornecido, substitui completamente os vínculos anteriores.',
    example: ['uuid-1', 'uuid-2'],
    type: [String],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  unidades_ids?: string[];
}

export class CreateContaBancariaBatchDto {
  @ApiProperty({
    description: 'Lista de contas bancárias a serem criadas',
    type: [CreateContaBancariaDto],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Pelo menos uma conta deve ser informada' })
  @ValidateNested({ each: true })
  @Type(() => CreateContaBancariaDto)
  contas: CreateContaBancariaDto[];
}
