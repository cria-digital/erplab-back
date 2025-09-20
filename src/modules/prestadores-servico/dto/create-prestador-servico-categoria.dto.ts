import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { TipoServicoCategoria } from '../entities/prestador-servico-categoria.entity';

export class CreatePrestadorServicoCategoriaDto {
  @ApiProperty({
    description: 'ID do prestador de serviço',
    example: 'uuid-do-prestador',
  })
  @IsUUID()
  @IsNotEmpty()
  prestadorServicoId: string;

  @ApiProperty({
    description: 'Tipo de serviço',
    enum: TipoServicoCategoria,
    example: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
  })
  @IsEnum(TipoServicoCategoria)
  @IsNotEmpty()
  tipoServico: TipoServicoCategoria;

  @ApiProperty({
    description: 'Descrição do serviço',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricaoServico?: string;

  @ApiProperty({
    description: 'Valor padrão do serviço',
    example: 500.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorPadrao?: number;

  @ApiProperty({
    description: 'Unidade de medida',
    example: 'hora',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  unidadeMedida?: string;

  @ApiProperty({
    description: 'Prazo de execução em dias',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  prazoExecucao?: number;

  @ApiProperty({
    description: 'Periodicidade do serviço',
    example: 'mensal',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  periodicidade?: string;

  @ApiProperty({
    description: 'Responsável técnico',
    example: 'João Silva',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  responsavelTecnico?: string;

  @ApiProperty({
    description: 'Telefone do responsável',
    example: '(11) 98765-4321',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefoneResponsavel?: string;

  @ApiProperty({
    description: 'Email do responsável',
    example: 'joao.silva@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  emailResponsavel?: string;

  @ApiProperty({
    description: 'Requer aprovação',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  requerAprovacao?: boolean;

  @ApiProperty({
    description: 'Requer orçamento',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requerOrcamento?: boolean;

  @ApiProperty({
    description: 'Valor limite sem aprovação',
    example: 1000.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  valorLimiteSemAprovacao?: number;

  @ApiProperty({
    description: 'Categoria ativa',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty({
    description: 'Observações',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
