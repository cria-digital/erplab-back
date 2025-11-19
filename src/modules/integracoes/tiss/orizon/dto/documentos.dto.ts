import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * DTO para envio de documentos
 */
export class EnviarDocumentosDto {
  @ApiProperty({
    description: 'XML de envio de documentos no padrão TISS v4.02.00',
    example: '<envioDocumentoWS>...</envioDocumentoWS>',
  })
  @IsNotEmpty({ message: 'O XML de documentos é obrigatório' })
  @IsString()
  xmlDocumentos: string;

  @ApiProperty({
    description: 'Código do prestador na operadora',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoPrestador?: string;
}

/**
 * Resposta do envio de documentos
 */
export class DocumentosResponseDto {
  @ApiProperty({ description: 'Número do recibo de envio' })
  numeroRecibo: string;

  @ApiProperty({ description: 'Data/hora do recebimento' })
  dataRecebimento: Date;

  @ApiProperty({ description: 'Status do envio' })
  status: string;

  @ApiProperty({ description: 'Mensagem de retorno', required: false })
  mensagem?: string;

  @ApiProperty({ description: 'Documentos aceitos', required: false })
  documentosAceitos?: string[];

  @ApiProperty({ description: 'Erros ocorridos', required: false })
  erros?: Array<{
    documento: string;
    codigo: string;
    descricao: string;
  }>;
}
