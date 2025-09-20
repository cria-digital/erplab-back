import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmpresaDto } from '../../empresas/dto/create-empresa.dto';
import {
  TipoContrato,
  FormaPagamento,
  StatusContrato,
  FrequenciaPagamento,
} from '../entities/prestador-servico.entity';

export class CreatePrestadorServicoDto {
  @ApiProperty({ description: 'Dados da empresa', type: CreateEmpresaDto })
  @ValidateNested()
  @Type(() => CreateEmpresaDto)
  @IsNotEmpty()
  empresa: CreateEmpresaDto;

  @ApiProperty({
    description: 'Código único do prestador',
    example: 'PSV001',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  codigoPrestador: string;

  // Informações do Contrato
  @ApiProperty({
    description: 'Tipo de contrato',
    enum: TipoContrato,
    example: TipoContrato.POR_DEMANDA,
  })
  @IsEnum(TipoContrato)
  @IsOptional()
  tipoContrato?: TipoContrato;

  @ApiProperty({
    description: 'Número do contrato',
    example: 'CONT-2025-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  numeroContrato?: string;

  @ApiProperty({
    description: 'Data de início do contrato',
    example: '2025-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dataInicioContrato?: string;

  @ApiProperty({
    description: 'Data de fim do contrato',
    example: '2025-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dataFimContrato?: string;

  @ApiProperty({
    description: 'Renovação automática do contrato',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  renovacaoAutomatica?: boolean;

  @ApiProperty({
    description: 'Prazo em dias para aviso de renovação',
    example: 30,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(365)
  prazoAvisoRenovacao?: number;

  // Informações de Pagamento
  @ApiProperty({
    description: 'Forma de pagamento',
    enum: FormaPagamento,
    example: FormaPagamento.POR_SERVICO,
  })
  @IsEnum(FormaPagamento)
  @IsOptional()
  formaPagamento?: FormaPagamento;

  @ApiProperty({
    description: 'Valor por hora',
    example: 150.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorHora?: number;

  @ApiProperty({
    description: 'Valor mensal',
    example: 5000.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorMensal?: number;

  @ApiProperty({
    description: 'Valor mínimo',
    example: 500.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorMinimo?: number;

  @ApiProperty({
    description: 'Prazo de pagamento em dias',
    example: 30,
    default: 30,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(365)
  prazoPagamento?: number;

  @ApiProperty({
    description: 'Dia do vencimento',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  diaVencimento?: number;

  @ApiProperty({
    description: 'Frequência de pagamento',
    enum: FrequenciaPagamento,
    example: FrequenciaPagamento.MENSAL,
  })
  @IsEnum(FrequenciaPagamento)
  @IsOptional()
  frequenciaPagamento?: FrequenciaPagamento;

  // PIX Settings
  @ApiProperty({
    description: 'Tipo de chave PIX',
    example: 'CNPJ',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  tipoPix?: string;

  @ApiProperty({
    description: 'Chave PIX',
    example: '11.222.333/0001-44',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  chavePix?: string;

  // Dados Bancários
  @ApiProperty({
    description: 'Código do banco',
    example: '001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  banco?: string;

  @ApiProperty({
    description: 'Agência bancária',
    example: '1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  agencia?: string;

  @ApiProperty({
    description: 'Conta bancária',
    example: '12345-6',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  conta?: string;

  @ApiProperty({
    description: 'Tipo de conta',
    example: 'corrente',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  tipoConta?: string;

  // Controles
  @ApiProperty({
    description: 'Status do contrato',
    enum: StatusContrato,
    example: StatusContrato.EM_ANALISE,
  })
  @IsEnum(StatusContrato)
  @IsOptional()
  statusContrato?: StatusContrato;

  @ApiProperty({
    description: 'SLA de resposta em horas',
    example: 4,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  slaResposta?: number;

  @ApiProperty({
    description: 'SLA de resolução em horas',
    example: 24,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  slaResolucao?: number;

  @ApiProperty({
    description: 'Horário de atendimento',
    example: '08:00 - 18:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  horarioAtendimento?: string;

  @ApiProperty({
    description: 'Dias de atendimento',
    example: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  diasAtendimento?: string[];

  @ApiProperty({
    description: 'Suporte 24x7',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  suporte24x7?: boolean;

  @ApiProperty({
    description: 'Atende urgência',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  atendeUrgencia?: boolean;

  @ApiProperty({
    description: 'Taxa de urgência (%)',
    example: 50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  taxaUrgencia?: number;

  // Observações e configurações
  @ApiProperty({
    description: 'Observações',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'Requisitos de acesso',
    required: false,
  })
  @IsString()
  @IsOptional()
  requisitosAcesso?: string;

  @ApiProperty({
    description: 'Certificações',
    example: ['ISO 9001', 'ISO 27001'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certificacoes?: string[];

  @ApiProperty({
    description: 'Seguros',
    example: ['Responsabilidade Civil', 'Seguro Profissional'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seguros?: string[];
}
