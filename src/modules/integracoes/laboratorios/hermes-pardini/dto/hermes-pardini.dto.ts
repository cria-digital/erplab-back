import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  Length,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

// ==========================================
// ENUMS
// ==========================================

export enum SexoEnum {
  MASCULINO = 'M',
  FEMININO = 'F',
}

export enum ValorReferenciaEnum {
  ESTRUTURADO = 0,
  BLOCO_TEXTO = 1,
  BLOCO_TEXTO_INDIVIDUALIZADO = 2,
}

// ==========================================
// SUB-DTOs
// ==========================================

export class EnderecoDto {
  @ApiPropertyOptional({ example: 'Rua das Flores' })
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiPropertyOptional({ example: '123' })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiPropertyOptional({ example: 'Apto 45' })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiPropertyOptional({ example: 'Centro' })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  uf?: string;

  @ApiPropertyOptional({ example: '01234-567' })
  @IsOptional()
  @IsString()
  cep?: string;
}

export class PacienteDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '15/03/1985', description: 'Formato DD/MM/YYYY' })
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Data de nascimento deve estar no formato DD/MM/YYYY',
  })
  dataNascimento: string;

  @ApiProperty({ enum: SexoEnum, example: 'M' })
  @IsEnum(SexoEnum)
  sexo: SexoEnum;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({ example: '12.345.678-9' })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiPropertyOptional({ example: '11999998888' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ type: EnderecoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;
}

export class ExameDto {
  @ApiProperty({ example: 'HEMO', description: 'Código do exame no Pardini' })
  @IsString()
  @IsNotEmpty()
  codigoExame: string;

  @ApiPropertyOptional({ example: 'SG', description: 'Código do material' })
  @IsOptional()
  @IsString()
  materialCodigo?: string;

  @ApiPropertyOptional({ example: 'Paciente em jejum de 12h' })
  @IsOptional()
  @IsString()
  observacao?: string;
}

export class MedicoSolicitanteDto {
  @ApiProperty({ example: 'Dr. Carlos Souza' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  crm: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @Length(2, 2)
  uf: string;
}

export class ConvenioDto {
  @ApiProperty({ example: '001' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiPropertyOptional({ example: 'PLANO BASICO' })
  @IsOptional()
  @IsString()
  plano?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  matricula?: string;
}

// ==========================================
// DTOs PRINCIPAIS
// ==========================================

/**
 * DTO para envio de pedido
 */
export class EnviarPedidoDto {
  @ApiProperty({
    example: 'PED-2024-001',
    description: 'Código interno do pedido no laboratório',
  })
  @IsString()
  @IsNotEmpty()
  codigoPedidoLab: string;

  @ApiProperty({
    example: '11/12/2025',
    description: 'Data da coleta DD/MM/YYYY',
  })
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Data da coleta deve estar no formato DD/MM/YYYY',
  })
  dataColeta: string;

  @ApiPropertyOptional({
    example: '08:30',
    description: 'Hora da coleta HH:MM',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'Hora da coleta deve estar no formato HH:MM',
  })
  horaColeta?: string;

  @ApiProperty({ type: PacienteDto })
  @ValidateNested()
  @Type(() => PacienteDto)
  paciente: PacienteDto;

  @ApiProperty({ type: [ExameDto], description: 'Lista de exames solicitados' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExameDto)
  exames: ExameDto[];

  @ApiPropertyOptional({ type: MedicoSolicitanteDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MedicoSolicitanteDto)
  medicoSolicitante?: MedicoSolicitanteDto;

  @ApiPropertyOptional({ type: ConvenioDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConvenioDto)
  convenio?: ConvenioDto;

  @ApiPropertyOptional({ example: false, description: 'Pedido urgente?' })
  @IsOptional()
  @IsBoolean()
  urgente?: boolean;

  @ApiPropertyOptional({ example: 'Paciente com histórico de diabetes' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

/**
 * DTO para consulta de resultado
 */
export class ConsultarResultadoDto {
  @ApiProperty({
    example: 2024,
    description: 'Ano do código do pedido de apoio',
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  anoCodPedApoio: number;

  @ApiProperty({ example: '123456', description: 'Código do pedido de apoio' })
  @IsString()
  @IsNotEmpty()
  codPedApoio: string;

  @ApiPropertyOptional({
    example: 'HEMO',
    description: 'Código do exame específico',
  })
  @IsOptional()
  @IsString()
  codExmApoio?: string;

  @ApiPropertyOptional({ example: true, description: 'Retornar laudo em PDF?' })
  @IsOptional()
  @IsBoolean()
  pdf?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Versão do resultado' })
  @IsOptional()
  @IsNumber()
  versaoResultado?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Laudo com papel timbrado?',
  })
  @IsOptional()
  @IsBoolean()
  papelTimbrado?: boolean;

  @ApiPropertyOptional({
    enum: ValorReferenciaEnum,
    example: 0,
    description: '0=Estruturado, 1=Bloco texto, 2=Individualizado',
  })
  @IsOptional()
  @IsEnum(ValorReferenciaEnum)
  valorReferencia?: ValorReferenciaEnum;
}

/**
 * DTO para cancelamento de amostra
 */
export class CancelarAmostraDto {
  @ApiProperty({ example: 2024 })
  @IsNumber()
  anoCodPedApoio: number;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  codPedApoio: string;

  @ApiProperty({
    example: 'HP123456789',
    description: 'Código de barras da amostra',
  })
  @IsString()
  @IsNotEmpty()
  codigoBarras: string;

  @ApiProperty({ example: 'Amostra hemolisada' })
  @IsString()
  @IsNotEmpty()
  motivo: string;
}

/**
 * DTO para cancelamento de exame
 */
export class CancelarExameDto {
  @ApiProperty({ example: 2024 })
  @IsNumber()
  anoCodPedApoio: number;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  codPedApoio: string;

  @ApiProperty({ example: 'HEMO', description: 'Código do exame' })
  @IsString()
  @IsNotEmpty()
  codigoExame: string;

  @ApiProperty({ example: 'Solicitação do médico' })
  @IsString()
  @IsNotEmpty()
  motivo: string;
}

/**
 * DTO para consulta de pendência técnica
 */
export class ConsultarPendenciaTecnicaDto {
  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsNumber()
  anoCodPedApoio?: number;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  codPedApoio?: string;

  @ApiPropertyOptional({
    example: '01/12/2025',
    description: 'Data inicial DD/MM/YYYY',
  })
  @IsOptional()
  @IsString()
  dataInicio?: string;

  @ApiPropertyOptional({
    example: '11/12/2025',
    description: 'Data final DD/MM/YYYY',
  })
  @IsOptional()
  @IsString()
  dataFim?: string;
}

/**
 * DTO para consulta de rastreabilidade
 */
export class ConsultarRastreabilidadeDto {
  @ApiProperty({ example: 2024 })
  @IsNumber()
  anoCodPedApoio: number;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  codPedApoio: string;

  @ApiPropertyOptional({ example: 'HP123456789' })
  @IsOptional()
  @IsString()
  codigoBarras?: string;
}

/**
 * DTO para consulta de status do pedido
 */
export class ConsultarStatusPedidoDto {
  @ApiProperty({ example: 2024 })
  @IsNumber()
  anoCodPedApoio: number;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  codPedApoio: string;
}

/**
 * DTO para buscar resultado por código do lab
 */
export class ConsultarResultadoPorCodigoLabDto {
  @ApiProperty({ example: 'PED-2024-001' })
  @IsString()
  @IsNotEmpty()
  codigoPedidoLab: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  pdf?: boolean;
}
