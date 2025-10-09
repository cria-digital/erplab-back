import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsObject,
  MaxLength,
  Min,
} from 'class-validator';
import {
  OrientacaoEtiqueta,
  TipoImpressora,
} from '../entities/etiqueta-amostra.entity';

export class CreateEtiquetaAmostraDto {
  @ApiProperty({
    description: 'Nome do template de etiqueta',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição do template',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Largura da etiqueta em milímetros',
    example: 50.0,
  })
  @IsNumber()
  @Min(1)
  larguraMm: number;

  @ApiProperty({
    description: 'Altura da etiqueta em milímetros',
    example: 25.0,
  })
  @IsNumber()
  @Min(1)
  alturaMm: number;

  @ApiPropertyOptional({
    description: 'Orientação da etiqueta',
    enum: OrientacaoEtiqueta,
    example: OrientacaoEtiqueta.RETRATO,
    default: OrientacaoEtiqueta.RETRATO,
  })
  @IsOptional()
  @IsEnum(OrientacaoEtiqueta)
  orientacao?: OrientacaoEtiqueta;

  @ApiPropertyOptional({
    description: 'Margem superior em mm',
    example: 2.0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  margemTopoMm?: number;

  @ApiPropertyOptional({
    description: 'Margem direita em mm',
    example: 2.0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  margemDireitaMm?: number;

  @ApiPropertyOptional({
    description: 'Margem inferior em mm',
    example: 2.0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  margemInferiorMm?: number;

  @ApiPropertyOptional({
    description: 'Margem esquerda em mm',
    example: 2.0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  margemEsquerdaMm?: number;

  @ApiProperty({
    description: 'Array de campos a serem exibidos',
    example: [
      { campo: 'nome_paciente', posicao: 'topo', tamanho: 12 },
      { campo: 'data_coleta', posicao: 'centro', tamanho: 10 },
    ],
  })
  @IsObject()
  campos: object;

  @ApiPropertyOptional({
    description: 'Se deve exibir código de barras',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  exibirCodigoBarras?: boolean;

  @ApiPropertyOptional({
    description: 'Tipo do código de barras',
    example: 'CODE128',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipoCodigoBarras?: string;

  @ApiPropertyOptional({
    description: 'Se deve exibir logo',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  exibirLogo?: boolean;

  @ApiPropertyOptional({
    description: 'URL da logo',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  urlLogo?: string;

  @ApiPropertyOptional({
    description: 'Template ZPL',
  })
  @IsOptional()
  @IsString()
  templateZpl?: string;

  @ApiPropertyOptional({
    description: 'Template EPL',
  })
  @IsOptional()
  @IsString()
  templateEpl?: string;

  @ApiPropertyOptional({
    description: 'Template HTML',
  })
  @IsOptional()
  @IsString()
  templateHtml?: string;

  @ApiPropertyOptional({
    description: 'CSS customizado',
  })
  @IsOptional()
  @IsString()
  templateCss?: string;

  @ApiPropertyOptional({
    description: 'Tipo de impressora recomendada',
    enum: TipoImpressora,
    example: TipoImpressora.TERMICA,
    default: TipoImpressora.TERMICA,
  })
  @IsOptional()
  @IsEnum(TipoImpressora)
  tipoImpressora?: TipoImpressora;

  @ApiPropertyOptional({
    description: 'Velocidade de impressão',
  })
  @IsOptional()
  @IsNumber()
  velocidadeImpressao?: number;

  @ApiPropertyOptional({
    description: 'Temperatura de impressão',
  })
  @IsOptional()
  @IsNumber()
  temperaturaImpressao?: number;

  @ApiPropertyOptional({
    description: 'Observações',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Se é template padrão',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  padrao?: boolean;

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
