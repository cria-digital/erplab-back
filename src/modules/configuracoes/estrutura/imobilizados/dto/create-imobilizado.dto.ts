import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
import {
  CategoriaImobilizado,
  SituacaoImobilizado,
} from '../entities/imobilizado.entity';

export class CreateImobilizadoDto {
  @ApiProperty({
    description: 'Número do patrimônio',
    example: 'IMOB-001',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  patrimonio: string;

  @ApiProperty({
    description: 'Descrição do bem imobilizado',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  descricao: string;

  @ApiProperty({
    description: 'Categoria do imobilizado',
    enum: CategoriaImobilizado,
    example: CategoriaImobilizado.EQUIPAMENTO,
  })
  @IsEnum(CategoriaImobilizado)
  categoria: CategoriaImobilizado;

  @ApiProperty({
    description: 'Data de aquisição do bem',
    example: '2024-01-15',
  })
  @IsDateString()
  dataAquisicao: Date;

  @ApiProperty({
    description: 'Valor pago na aquisição',
    example: 50000.0,
  })
  @IsNumber()
  @Min(0)
  valorAquisicao: number;

  @ApiPropertyOptional({
    description: 'Número da nota fiscal',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroNotaFiscal?: string;

  @ApiPropertyOptional({
    description: 'ID do fornecedor',
  })
  @IsOptional()
  @IsUUID()
  fornecedorId?: string;

  @ApiPropertyOptional({
    description: 'ID da sala onde está localizado',
  })
  @IsOptional()
  @IsUUID()
  salaId?: string;

  @ApiPropertyOptional({
    description: 'ID do setor responsável',
  })
  @IsOptional()
  @IsUUID()
  setorId?: string;

  @ApiProperty({
    description: 'Vida útil do bem em anos',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  vidaUtilAnos: number;

  @ApiProperty({
    description: 'Taxa de depreciação anual (%)',
    example: 10.0,
  })
  @IsNumber()
  @Min(0)
  taxaDepreciacaoAnual: number;

  @ApiPropertyOptional({
    description: 'Valor residual estimado',
    example: 5000.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorResidual?: number;

  @ApiPropertyOptional({
    description: 'Situação atual',
    enum: SituacaoImobilizado,
    example: SituacaoImobilizado.ATIVO,
    default: SituacaoImobilizado.ATIVO,
  })
  @IsOptional()
  @IsEnum(SituacaoImobilizado)
  situacao?: SituacaoImobilizado;

  @ApiPropertyOptional({
    description: 'Observações gerais',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
  })
  @IsUUID()
  unidadeId: string;

  @ApiPropertyOptional({
    description: 'ID da empresa',
  })
  @IsOptional()
  @IsUUID()
  empresaId?: string;
}
