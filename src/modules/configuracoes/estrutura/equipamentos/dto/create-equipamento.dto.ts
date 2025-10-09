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
import { SituacaoEquipamento } from '../entities/equipamento.entity';

export class CreateEquipamentoDto {
  @ApiProperty({
    description: 'Número do patrimônio/tombamento',
    example: 'PATR-001',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  patrimonio: string;

  @ApiProperty({
    description: 'Nome/descrição do equipamento',
    example: 'Analisador Hematológico',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Marca do equipamento',
    example: 'Roche',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  marca?: string;

  @ApiPropertyOptional({
    description: 'Modelo do equipamento',
    example: 'XN-1000',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  modelo?: string;

  @ApiPropertyOptional({
    description: 'Número de série',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroSerie?: string;

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

  @ApiPropertyOptional({
    description: 'ID do fornecedor',
  })
  @IsOptional()
  @IsUUID()
  fornecedorId?: string;

  @ApiPropertyOptional({
    description: 'Data de aquisição',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  dataAquisicao?: Date;

  @ApiPropertyOptional({
    description: 'Valor de aquisição',
    example: 150000.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorAquisicao?: number;

  @ApiPropertyOptional({
    description: 'Data da última manutenção',
  })
  @IsOptional()
  @IsDateString()
  dataUltimaManutencao?: Date;

  @ApiPropertyOptional({
    description: 'Data prevista para próxima manutenção',
  })
  @IsOptional()
  @IsDateString()
  dataProximaManutencao?: Date;

  @ApiPropertyOptional({
    description: 'Periodicidade da manutenção em dias',
    example: 180,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  periodicidadeManutencaoDias?: number;

  @ApiPropertyOptional({
    description: 'Situação atual do equipamento',
    enum: SituacaoEquipamento,
    example: SituacaoEquipamento.ATIVO,
    default: SituacaoEquipamento.ATIVO,
  })
  @IsOptional()
  @IsEnum(SituacaoEquipamento)
  situacao?: SituacaoEquipamento;

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
