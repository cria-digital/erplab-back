import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * DTO para enviar recurso de glosa
 */
export class EnviarRecursoGlosaDto {
  @ApiProperty({
    description: 'XML do recurso de glosa no padrão TISS',
    example: '<loteRecursoGlosaWS>...</loteRecursoGlosaWS>',
  })
  @IsNotEmpty({ message: 'O XML do recurso de glosa é obrigatório' })
  @IsString()
  xmlRecurso: string;

  @ApiProperty({
    description: 'Código do prestador na operadora',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoPrestador?: string;
}

/**
 * Resposta do envio de recurso de glosa
 */
export class RecursoGlosaResponseDto {
  @ApiProperty({ description: 'Número do protocolo do recurso' })
  numeroProtocolo: string;

  @ApiProperty({ description: 'Data/hora do recebimento' })
  dataRecebimento: Date;

  @ApiProperty({ description: 'Status inicial do recurso' })
  status: string;

  @ApiProperty({ description: 'Mensagem de retorno', required: false })
  mensagem?: string;

  @ApiProperty({ description: 'XML de resposta completo', required: false })
  xmlResposta?: string;
}

/**
 * DTO para consultar status de recurso de glosa
 */
export class ConsultarStatusRecursoDto {
  @ApiProperty({
    description: 'Número do protocolo do recurso',
    example: '202511190001',
  })
  @IsNotEmpty({ message: 'O número do protocolo é obrigatório' })
  @IsString()
  numeroProtocolo: string;

  @ApiProperty({
    description: 'Código do prestador na operadora',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoPrestador?: string;
}

/**
 * Resposta da consulta de status de recurso
 */
export class StatusRecursoResponseDto {
  @ApiProperty({ description: 'Número do protocolo' })
  numeroProtocolo: string;

  @ApiProperty({
    description: 'Status do recurso',
    examples: [
      'RECEBIDO',
      'EM_ANALISE',
      'DEFERIDO',
      'INDEFERIDO',
      'PARCIALMENTE_DEFERIDO',
    ],
  })
  status: string;

  @ApiProperty({ description: 'Data/hora da última atualização' })
  dataAtualizacao: Date;

  @ApiProperty({ description: 'Mensagem descritiva', required: false })
  mensagem?: string;

  @ApiProperty({ description: 'Detalhes do resultado', required: false })
  detalhes?: {
    valorRecursado?: number;
    valorDeferido?: number;
    valorIndeferido?: number;
    justificativa?: string;
  };
}
