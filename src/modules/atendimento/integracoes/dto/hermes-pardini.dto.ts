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
