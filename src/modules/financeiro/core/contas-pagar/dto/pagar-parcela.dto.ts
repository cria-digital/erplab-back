import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FormaPagamentoParcela } from '../enums/contas-pagar.enum';

export class PagarParcelaDto {
  @ApiProperty({
    enum: FormaPagamentoParcela,
    description: 'Forma de pagamento',
    example: FormaPagamentoParcela.PIX,
  })
  @IsEnum(FormaPagamentoParcela)
  formaPagamento: FormaPagamentoParcela;

  @ApiProperty({ description: 'ID da conta bancária', required: false })
  @IsOptional()
  @IsUUID()
  contaBancariaId?: string;

  @ApiProperty({ description: 'Código de barras do boleto', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  codigoBarras?: string;

  @ApiProperty({ description: 'Chave PIX', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  chavePix?: string;

  @ApiProperty({ description: 'Dados bancários (JSON)', required: false })
  @IsOptional()
  dadosBancarios?: any;

  @ApiProperty({
    description: 'Informações adicionais (JSON)',
    required: false,
  })
  @IsOptional()
  informacoesAdicionais?: any;

  @ApiProperty({ description: 'Caminho do comprovante', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  comprovantePath?: string;

  @ApiProperty({ description: 'Data do pagamento', example: '2025-10-05' })
  @IsDateString()
  dataPagamento: string;
}
