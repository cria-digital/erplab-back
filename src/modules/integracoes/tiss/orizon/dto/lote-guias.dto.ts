import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

/**
 * DTO para envio de lote de guias TISS
 */
export class EnviarLoteGuiasDto {
  @ApiProperty({
    description: 'XML do lote de guias no padrão TISS v4.01.00',
    example: '<loteGuiasWS>...</loteGuiasWS>',
  })
  @IsNotEmpty({ message: 'O XML do lote de guias é obrigatório' })
  @IsString({ message: 'O XML deve ser uma string' })
  xmlLote: string;

  @ApiProperty({
    description: 'Código do prestador na operadora',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoPrestador?: string;

  @ApiProperty({
    description: 'Metadados adicionais do lote',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadados?: {
    descricao?: string;
    totalGuias?: number;
    [key: string]: any;
  };
}

/**
 * Resposta do envio de lote de guias
 */
export class LoteGuiasResponseDto {
  @ApiProperty({ description: 'Protocolo de recebimento do lote' })
  numeroProtocolo: string;

  @ApiProperty({ description: 'Data/hora do recebimento' })
  dataRecebimento: Date;

  @ApiProperty({ description: 'Status inicial do lote' })
  status: string;

  @ApiProperty({ description: 'Mensagem de retorno', required: false })
  mensagem?: string;

  @ApiProperty({ description: 'XML de resposta completo', required: false })
  xmlResposta?: string;
}
