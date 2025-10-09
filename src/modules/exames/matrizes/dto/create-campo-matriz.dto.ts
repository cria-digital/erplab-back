import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsObject,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import {
  TipoCampoMatriz,
  UnidadeMedida,
} from '../entities/campo-matriz.entity';

export class CreateCampoMatrizDto {
  @ApiProperty({
    description: 'Código único do campo dentro da matriz',
    example: 'audio_od_500hz',
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  codigoCampo: string;

  @ApiProperty({
    description: 'Rótulo/label do campo',
    example: 'Orelha Direita 500Hz',
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  label: string;

  @ApiProperty({
    description: 'Tipo do campo',
    enum: TipoCampoMatriz,
    example: TipoCampoMatriz.NUMERO,
  })
  @IsEnum(TipoCampoMatriz)
  tipoCampo: TipoCampoMatriz;

  @ApiPropertyOptional({
    description: 'Texto de placeholder',
    example: 'Digite o valor em dB',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeholder?: string;

  @ApiPropertyOptional({
    description: 'Descrição/ajuda do campo',
    example: 'Medição da audição na frequência de 500Hz',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Opções para campos select/radio/checkbox',
    example: [
      { value: 'normal', label: 'Normal' },
      { value: 'alterado', label: 'Alterado' },
    ],
  })
  @IsOptional()
  @IsArray()
  opcoes?: Array<{ value: string | number; label: string }>;

  @ApiPropertyOptional({
    description: 'Valor padrão do campo',
    example: '0',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  valorPadrao?: string;

  @ApiPropertyOptional({
    description: 'Unidade de medida',
    enum: UnidadeMedida,
    example: UnidadeMedida.DB,
  })
  @IsOptional()
  @IsEnum(UnidadeMedida)
  unidadeMedida?: UnidadeMedida;

  @ApiPropertyOptional({
    description: 'Unidade de medida customizada',
    example: 'UI/L',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unidadeMedidaCustomizada?: string;

  @ApiPropertyOptional({
    description: 'Valor mínimo de referência',
    example: -10,
  })
  @IsOptional()
  @IsNumber()
  valorReferenciaMin?: number;

  @ApiPropertyOptional({
    description: 'Valor máximo de referência',
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  valorReferenciaMax?: number;

  @ApiPropertyOptional({
    description: 'Texto descritivo dos valores de referência',
    example: 'Normal: -10 a 25 dB',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  textoReferencia?: string;

  @ApiPropertyOptional({
    description: 'Se o campo é obrigatório',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  obrigatorio?: boolean;

  @ApiPropertyOptional({
    description: 'Valor mínimo permitido (validação)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  valorMin?: number;

  @ApiPropertyOptional({
    description: 'Valor máximo permitido (validação)',
    example: 120,
  })
  @IsOptional()
  @IsNumber()
  valorMax?: number;

  @ApiPropertyOptional({
    description: 'Máscara de formatação',
    example: '##/##/####',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mascara?: string;

  @ApiPropertyOptional({
    description: 'Expressão regular para validação',
    example: '^\\d{1,3}$',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  regexValidacao?: string;

  @ApiPropertyOptional({
    description: 'Mensagem de erro customizada',
    example: 'Valor deve estar entre 0 e 120',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  mensagemValidacao?: string;

  @ApiPropertyOptional({
    description: 'Fórmula para cálculo automático',
    example: '{campo1} + {campo2} * 2',
  })
  @IsOptional()
  @IsString()
  formulaCalculo?: string;

  @ApiPropertyOptional({
    description: 'IDs dos campos dependentes para cálculo',
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @IsArray()
  camposDependentes?: string[];

  @ApiPropertyOptional({
    description: 'Ordem de exibição',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ordemExibicao?: number;

  @ApiPropertyOptional({
    description: 'Linha no grid de layout',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  linha?: number;

  @ApiPropertyOptional({
    description: 'Coluna no grid de layout',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  coluna?: number;

  @ApiPropertyOptional({
    description: 'Largura do campo em colunas',
    example: 6,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  largura?: number;

  @ApiPropertyOptional({
    description: 'Se o campo é visível',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  visivel?: boolean;

  @ApiPropertyOptional({
    description: 'Se o campo é somente leitura',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  somenteLeitura?: boolean;

  @ApiPropertyOptional({
    description: 'Se deve destacar quando alterado',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  destacarAlterado?: boolean;

  @ApiPropertyOptional({
    description: 'Nome do grupo',
    example: 'Orelha Direita',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  grupo?: string;

  @ApiPropertyOptional({
    description: 'Nome da seção',
    example: 'Audiometria Tonal',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secao?: string;

  @ApiPropertyOptional({
    description: 'Configurações adicionais',
    example: { cor: 'blue', icone: 'audio' },
  })
  @IsOptional()
  @IsObject()
  configuracoes?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Se o campo está ativo',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
