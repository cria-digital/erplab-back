import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsUUID,
  IsArray,
  ValidateNested,
  IsDateString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  CredorTipo,
  TipoDocumento,
  StatusContaPagar,
} from '../enums/contas-pagar.enum';

export class CreateImpostoRetidoDto {
  @ApiProperty({
    enum: ['iss', 'irrf', 'csll', 'pis', 'cofins', 'ibs', 'cbs'],
    description: 'Tipo de imposto retido',
  })
  @IsEnum(['iss', 'irrf', 'csll', 'pis', 'cofins', 'ibs', 'cbs'])
  tipoImposto: string;

  @ApiProperty({ description: 'Percentual do imposto', example: 5.0 })
  @IsNumber()
  percentual: number;

  @ApiProperty({ description: 'Valor calculado do imposto', example: 50.0 })
  @IsNumber()
  valorCalculado: number;
}

export class CreateComposicaoFinanceiraDto {
  @ApiProperty({ description: 'ID da conta contábil (classe financeira)' })
  @IsUUID()
  contaContabilId: string;

  @ApiProperty({ description: 'ID do centro de custo', required: false })
  @IsOptional()
  @IsUUID()
  centroCustoId?: string;

  @ApiProperty({
    description: 'ID do colaborador (para folha)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  colaboradorId?: string;

  @ApiProperty({ description: 'Nome do colaborador', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  colaboradorNome?: string;

  @ApiProperty({ description: 'Valor da composição', example: 1000.0 })
  @IsNumber()
  valor: number;
}

export class CreateParcelaDto {
  @ApiProperty({ description: 'Número da parcela', example: 1 })
  @IsNumber()
  numeroParcela: number;

  @ApiProperty({ description: 'Total de parcelas', example: 3 })
  @IsNumber()
  totalParcelas: number;

  @ApiProperty({ description: 'Valor da parcela', example: 333.33 })
  @IsNumber()
  valor: number;

  @ApiProperty({ description: 'Data de vencimento', example: '2025-10-05' })
  @IsDateString()
  dataVencimento: string;
}

export class CreateContaPagarDto {
  @ApiProperty({
    enum: CredorTipo,
    description: 'Tipo do credor',
    example: CredorTipo.EMPRESA,
  })
  @IsEnum(CredorTipo)
  credorTipo: CredorTipo;

  @ApiProperty({ description: 'ID do credor (empresa, prestador, etc)' })
  @IsUUID()
  credorId: string;

  @ApiProperty({ description: 'ID da unidade devedora' })
  @IsUUID()
  unidadeDevedoraId: string;

  @ApiProperty({
    enum: TipoDocumento,
    description: 'Tipo do documento',
    example: TipoDocumento.NOTA_FISCAL,
  })
  @IsEnum(TipoDocumento)
  tipoDocumento: TipoDocumento;

  @ApiProperty({ description: 'Número do documento', example: 'NF-12345' })
  @IsString()
  @Length(1, 100)
  numeroDocumento: string;

  @ApiProperty({ description: 'Descrição da conta', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Valor bruto', example: 1000.0 })
  @IsNumber()
  valorBruto: number;

  @ApiProperty({ description: 'Valor líquido após impostos', example: 950.0 })
  @IsNumber()
  valorLiquido: number;

  @ApiProperty({ description: 'Competência (MM/YYYY)', example: '04/2025' })
  @IsString()
  @Length(7, 7)
  competencia: string;

  @ApiProperty({ description: 'Data de emissão', example: '2025-09-30' })
  @IsDateString()
  dataEmissao: string;

  @ApiProperty({
    description: 'Código interno',
    example: 'CAP001234',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  codigoInterno?: string;

  @ApiProperty({
    enum: StatusContaPagar,
    description: 'Status da conta',
    default: StatusContaPagar.A_PAGAR,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusContaPagar)
  status?: StatusContaPagar;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({
    type: [CreateComposicaoFinanceiraDto],
    description: 'Composições financeiras',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComposicaoFinanceiraDto)
  composicoesFinanceiras: CreateComposicaoFinanceiraDto[];

  @ApiProperty({
    type: [CreateImpostoRetidoDto],
    description: 'Impostos retidos',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImpostoRetidoDto)
  impostosRetidos?: CreateImpostoRetidoDto[];

  @ApiProperty({
    type: [CreateParcelaDto],
    description: 'Parcelas',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateParcelaDto)
  parcelas?: CreateParcelaDto[];
}
