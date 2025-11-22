import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExameDto {
  @ApiProperty({ example: 'HEMO', description: 'Código do exame' })
  @IsString()
  @IsNotEmpty()
  codigoExame: string;

  @ApiProperty({ example: 'Sangue EDTA', description: 'Material biológico' })
  @IsString()
  @IsNotEmpty()
  material: string;
}

export class RecebeAtendimentoDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;

  @ApiProperty({
    example: '2025-11-20',
    description: 'Data da requisição (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  dataRequisicao: string;

  @ApiProperty({ example: 'PAC001', description: 'Código do paciente' })
  @IsString()
  @IsNotEmpty()
  codigoPaciente: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do paciente' })
  @IsString()
  @IsNotEmpty()
  nomePaciente: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Data de nascimento (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  dataNascimento: string;

  @ApiProperty({ example: 'M', description: 'Sexo (M/F)' })
  @IsString()
  @IsNotEmpty()
  sexo: string;

  @ApiProperty({
    type: [ExameDto],
    description: 'Lista de exames solicitados',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExameDto)
  exames: ExameDto[];
}

export class ConsultaLaudoDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;
}

export class ConsultaLaudoListaDto {
  @ApiProperty({
    example: ['REQ-2025-001', 'REQ-2025-002'],
    description: 'Lista de números de requisição',
  })
  @IsArray()
  @IsString({ each: true })
  numerosRequisicao: string[];
}

export class ConsultaLaudoPeriodoDto {
  @ApiProperty({
    example: '2025-11-01',
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: string;

  @ApiProperty({
    example: '2025-11-20',
    description: 'Data final (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  dataFim: string;
}

export class ConsultaStatusDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;
}

export class CancelaExameDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;

  @ApiProperty({ example: 'HEMO', description: 'Código do exame a cancelar' })
  @IsString()
  @IsNotEmpty()
  codigoExame: string;

  @ApiProperty({
    example: 'Solicitação do médico',
    description: 'Motivo do cancelamento',
  })
  @IsString()
  @IsNotEmpty()
  motivo: string;
}

export class ConsultaRastreabilidadeDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;
}

export class EnviaResultadoBase64Dto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;
}

export class RelatorioRequisicoesDto {
  @ApiProperty({
    example: '2025-11-01',
    description: 'Data inicial (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  dataInicio: string;

  @ApiProperty({
    example: '2025-11-20',
    description: 'Data final (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  dataFim: string;
}

// ========== NOVOS DTOs PARA MÉTODOS ADICIONAIS ==========

export class AmostraDto {
  @ApiProperty({ example: 'TUBO001', description: 'Código da amostra' })
  @IsString()
  @IsNotEmpty()
  codigoAmostra: string;

  @ApiProperty({ example: 'HEMO', description: 'Código do exame' })
  @IsString()
  @IsNotEmpty()
  codigoExame: string;

  @ApiProperty({ example: 'Sangue EDTA', description: 'Tipo de material' })
  @IsString()
  @IsNotEmpty()
  tipoMaterial: string;

  @ApiProperty({
    example: '2025-11-20 08:30:00',
    description: 'Data/hora da coleta',
  })
  @IsString()
  @IsNotEmpty()
  dataHoraColeta: string;
}

export class EnviaAmostrasDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;

  @ApiProperty({
    type: [AmostraDto],
    description: 'Lista de amostras coletadas',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AmostraDto)
  amostras: AmostraDto[];
}

export class EnviaAmostrasPendentesDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;
}

export class ResultadoDto {
  @ApiProperty({ example: 'HEMO', description: 'Código do exame' })
  @IsString()
  @IsNotEmpty()
  codigoExame: string;

  @ApiProperty({ example: 'Hemoglobina', description: 'Nome do parâmetro' })
  @IsString()
  @IsNotEmpty()
  parametro: string;

  @ApiProperty({ example: '14.5', description: 'Valor do resultado' })
  @IsString()
  @IsNotEmpty()
  valor: string;

  @ApiProperty({ example: 'g/dL', description: 'Unidade de medida' })
  @IsString()
  @IsNotEmpty()
  unidade: string;

  @ApiProperty({
    example: '12.0 - 16.0',
    description: 'Valor de referência',
  })
  @IsString()
  @IsNotEmpty()
  valorReferencia: string;
}

export class EnviaLoteResultadosDto {
  @ApiProperty({
    example: 'LOTE-2025-001',
    description: 'Número do lote',
  })
  @IsString()
  @IsNotEmpty()
  numeroLote: string;

  @ApiProperty({
    type: [ResultadoDto],
    description: 'Lista de resultados do lote',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultadoDto)
  resultados: ResultadoDto[];
}

export class CancelaAmostraDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;

  @ApiProperty({ example: 'TUBO001', description: 'Código da amostra' })
  @IsString()
  @IsNotEmpty()
  codigoAmostra: string;

  @ApiProperty({
    example: 'Amostra inadequada',
    description: 'Motivo do cancelamento',
  })
  @IsString()
  @IsNotEmpty()
  motivo: string;
}

export class ConsultaPendenciaTecnicaDto {
  @ApiProperty({
    example: 'REQ-2025-001',
    description: 'Número da requisição',
  })
  @IsString()
  @IsNotEmpty()
  numeroRequisicao: string;
}

export class GrupoFracionamentoDto {
  @ApiProperty({
    example: 'GRUPO-001',
    description: 'Código do grupo',
  })
  @IsString()
  @IsNotEmpty()
  codigoGrupo: string;

  @ApiProperty({
    example: 'Exames de Rotina',
    description: 'Descrição do grupo',
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({
    example: ['HEMO', 'GLI', 'CREA'],
    description: 'Códigos dos exames do grupo',
  })
  @IsArray()
  @IsString({ each: true })
  exames: string[];
}
