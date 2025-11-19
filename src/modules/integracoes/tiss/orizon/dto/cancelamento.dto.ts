import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * DTO para cancelamento de guia
 */
export class CancelarGuiaDto {
  @ApiProperty({
    description: 'XML de cancelamento no padrão TISS',
    example: '<cancelaGuiaWS>...</cancelaGuiaWS>',
  })
  @IsNotEmpty({ message: 'O XML de cancelamento é obrigatório' })
  @IsString()
  xmlCancelamento: string;

  @ApiProperty({
    description: 'Código do prestador na operadora',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoPrestador?: string;
}

/**
 * Resposta do cancelamento de guia
 */
export class CancelamentoGuiaResponseDto {
  @ApiProperty({ description: 'Número do recibo de cancelamento' })
  numeroRecibo: string;

  @ApiProperty({ description: 'Data/hora do cancelamento' })
  dataCancelamento: Date;

  @ApiProperty({ description: 'Status do cancelamento' })
  status: string;

  @ApiProperty({ description: 'Mensagem de retorno', required: false })
  mensagem?: string;

  @ApiProperty({ description: 'Guias canceladas com sucesso', required: false })
  guiasCanceladas?: string[];

  @ApiProperty({ description: 'Erros ocorridos', required: false })
  erros?: Array<{
    guia: string;
    codigo: string;
    descricao: string;
  }>;
}
