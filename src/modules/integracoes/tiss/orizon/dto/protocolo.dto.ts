import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TipoRelatorioOrizon } from '../interfaces/orizon-endpoints.interface';

/**
 * DTO para consulta de status de protocolo
 */
export class ConsultarStatusProtocoloDto {
  @ApiProperty({
    description: 'Número do protocolo a ser consultado',
    example: '202511190001',
  })
  @IsNotEmpty({ message: 'O número do protocolo é obrigatório' })
  @IsString({ message: 'O número do protocolo deve ser uma string' })
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
 * Resposta da consulta de status de protocolo
 */
export class StatusProtocoloResponseDto {
  @ApiProperty({ description: 'Número do protocolo' })
  numeroProtocolo: string;

  @ApiProperty({
    description: 'Status do protocolo',
    examples: [
      'RECEBIDO',
      'EM_PROCESSAMENTO',
      'PROCESSADO',
      'REJEITADO',
      'ACEITO',
    ],
  })
  status: string;

  @ApiProperty({ description: 'Data/hora da última atualização' })
  dataAtualizacao: Date;

  @ApiProperty({
    description: 'Mensagem descritiva do status',
    required: false,
  })
  mensagem?: string;

  @ApiProperty({
    description: 'Detalhes adicionais do processamento',
    required: false,
  })
  detalhes?: {
    totalGuias?: number;
    guiasAceitas?: number;
    guiasRejeitadas?: number;
    erros?: Array<{
      codigo: string;
      descricao: string;
      guia?: string;
    }>;
  };
}

/**
 * DTO para gerar protocolo em PDF
 */
export class GerarProtocoloPdfDto {
  @ApiProperty({
    description: 'Tipo de relatório a gerar',
    enum: TipoRelatorioOrizon,
    example: TipoRelatorioOrizon.PROTOCOLO,
  })
  @IsNotEmpty({ message: 'O tipo de relatório é obrigatório' })
  @IsEnum(TipoRelatorioOrizon, { message: 'Tipo de relatório inválido' })
  tipoRelatorio: TipoRelatorioOrizon;

  @ApiProperty({
    description: 'Número do protocolo',
    example: '202511190001',
  })
  @IsNotEmpty({ message: 'O número do protocolo é obrigatório' })
  @IsString()
  numeroProtocolo: string;

  @ApiProperty({
    description: 'Sequência da transação',
    required: false,
  })
  @IsOptional()
  @IsString()
  seqTransacao?: string;

  @ApiProperty({
    description: 'Código do prestador na operadora',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoPrestador?: string;

  @ApiProperty({
    description: 'Usuário (credencial)',
    required: false,
  })
  @IsOptional()
  @IsString()
  usuario?: string;

  @ApiProperty({
    description: 'Senha (credencial)',
    required: false,
  })
  @IsOptional()
  @IsString()
  senha?: string;
}

/**
 * Resposta da geração de PDF
 */
export class ProtocoloPdfResponseDto {
  @ApiProperty({ description: 'Número do protocolo' })
  numeroProtocolo: string;

  @ApiProperty({ description: 'PDF em base64' })
  pdfBase64: string;

  @ApiProperty({ description: 'Status da operação' })
  status: number;

  @ApiProperty({ description: 'Mensagem de status', required: false })
  mensagem?: string;
}
