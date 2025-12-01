import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsInt,
  MaxLength,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoClasseCfo } from '../entities/classe-cfo.entity';

export class ClasseCfoDto {
  @ApiProperty({
    description: 'Tipo da classe (TITULO ou NIVEL)',
    enum: TipoClasseCfo,
    example: TipoClasseCfo.TITULO,
  })
  @IsEnum(TipoClasseCfo)
  @IsNotEmpty()
  tipo: TipoClasseCfo;

  @ApiProperty({
    description: 'Nível de classificação (1-4). Apenas para tipo NIVEL',
    example: 1,
    required: false,
    minimum: 1,
    maximum: 4,
  })
  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  nivel_classificacao?: number;

  @ApiProperty({
    description: 'Código hierárquico para ordenação (ex: "1", "1.1", "1.1.1")',
    example: '1.1',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo_hierarquico: string;

  @ApiProperty({
    description: 'Código contábil (opcional)',
    example: '3.1.1.01',
    maxLength: 20,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  codigo_contabil?: string;

  @ApiProperty({
    description: 'Nome da classe ou título',
    example: 'Atos Cirúrgicos Gerais',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome_classe: string;

  @ApiProperty({
    description: 'Ordem de exibição',
    example: 0,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  ordem?: number;

  @ApiProperty({
    description: 'Se a classe está ativa',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}

export class CreateHierarquiaCfoDto {
  @ApiProperty({
    description: 'Código interno único da hierarquia',
    example: 'CFO-001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo_interno: string;

  @ApiProperty({
    description: 'Descrição da hierarquia',
    example: 'Hierarquia CFO Padrão',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @ApiProperty({
    description: 'Se a hierarquia está ativa',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty({
    description: 'Lista de classes/níveis da hierarquia',
    type: [ClasseCfoDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClasseCfoDto)
  @IsOptional()
  classes?: ClasseCfoDto[];
}
