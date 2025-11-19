import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

/**
 * DTO para solicitar demonstrativo
 */
export class SolicitarDemonstrativoDto {
  @ApiProperty({
    description: 'Data inicial do período',
    example: '2025-01-01',
  })
  @IsNotEmpty({ message: 'A data inicial é obrigatória' })
  @IsDateString({}, { message: 'Data inicial inválida' })
  dataInicio: string;

  @ApiProperty({
    description: 'Data final do período',
    example: '2025-01-31',
  })
  @IsNotEmpty({ message: 'A data final é obrigatória' })
  @IsDateString({}, { message: 'Data final inválida' })
  dataFim: string;

  @ApiProperty({
    description: 'Número do protocolo específico (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  numeroProtocolo?: string;

  @ApiProperty({
    description: 'Código do prestador na operadora',
    required: false,
  })
  @IsOptional()
  @IsString()
  codigoPrestador?: string;
}

/**
 * Resposta da solicitação de demonstrativo
 */
export class DemonstrativoResponseDto {
  @ApiProperty({ description: 'Número do protocolo do demonstrativo' })
  numeroProtocolo: string;

  @ApiProperty({ description: 'Data de geração' })
  dataGeracao: Date;

  @ApiProperty({ description: 'Período consultado' })
  periodo: {
    inicio: Date;
    fim: Date;
  };

  @ApiProperty({ description: 'Resumo financeiro' })
  resumo: {
    totalApresentado?: number;
    totalGlosas?: number;
    totalLiberado?: number;
    quantidadeGuias?: number;
  };

  @ApiProperty({
    description: 'XML completo do demonstrativo',
    required: false,
  })
  xmlDemonstrativo?: string;

  @ApiProperty({
    description: 'Lista de guias do demonstrativo',
    required: false,
  })
  guias?: Array<{
    numeroGuia: string;
    valor: number;
    status: string;
    glosa?: number;
    motivoGlosa?: string;
  }>;
}
