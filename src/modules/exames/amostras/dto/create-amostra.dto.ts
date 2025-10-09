import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import {
  TipoAmostra,
  UnidadeVolume,
  TemperaturaArmazenamento,
  TemperaturaTransporte,
} from '../entities/amostra.entity';

export class CreateAmostraDto {
  @ApiProperty({
    description: 'Código único da amostra',
    example: 'SANG-EDTA-001',
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  codigoInterno: string;

  @ApiProperty({
    description: 'Nome da amostra',
    example: 'Sangue Total com EDTA',
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da amostra',
    example:
      'Sangue venoso coletado em tubo com anticoagulante EDTA para hemograma',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo da amostra',
    enum: TipoAmostra,
    example: TipoAmostra.SANGUE,
  })
  @IsEnum(TipoAmostra)
  tipoAmostra: TipoAmostra;

  // Coleta
  @ApiPropertyOptional({
    description: 'Tipo de recipiente padrão',
    example: 'Tubo EDTA 4mL',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  recipientePadrao?: string;

  @ApiPropertyOptional({
    description: 'Cor da tampa do tubo',
    example: 'Roxa',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  corTampa?: string;

  @ApiPropertyOptional({
    description: 'Volume mínimo necessário',
    example: 2.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  volumeMinimo?: number;

  @ApiPropertyOptional({
    description: 'Volume ideal recomendado',
    example: 4.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  volumeIdeal?: number;

  @ApiPropertyOptional({
    description: 'Unidade de medida do volume',
    enum: UnidadeVolume,
    example: UnidadeVolume.ML,
  })
  @IsOptional()
  @IsEnum(UnidadeVolume)
  unidadeVolume?: UnidadeVolume;

  @ApiPropertyOptional({
    description: 'Instruções detalhadas de coleta',
    example: 'Coletar sangue venoso em tubo EDTA. Homogeneizar por inversão.',
  })
  @IsOptional()
  @IsString()
  instrucoesColeta?: string;

  @ApiPropertyOptional({
    description: 'Array de materiais necessários',
    example: ['Agulha 21G', 'Seringa 5mL', 'Tubo EDTA', 'Algodão', 'Álcool'],
  })
  @IsOptional()
  @IsArray()
  materiaisNecessarios?: string[];

  // Preparo do Paciente
  @ApiPropertyOptional({
    description: 'Se requer jejum',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requerJejum?: boolean;

  @ApiPropertyOptional({
    description: 'Tempo de jejum em horas',
    example: 8,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(48)
  tempoJejum?: number;

  @ApiPropertyOptional({
    description: 'Instruções de preparo do paciente',
    example: 'Paciente deve estar em repouso há pelo menos 15 minutos',
  })
  @IsOptional()
  @IsString()
  instrucoesPreparoPaciente?: string;

  @ApiPropertyOptional({
    description: 'Restrições para o paciente',
    example: 'Não fumar 2 horas antes da coleta',
  })
  @IsOptional()
  @IsString()
  restricoes?: string;

  // Armazenamento
  @ApiPropertyOptional({
    description: 'Temperatura de armazenamento',
    enum: TemperaturaArmazenamento,
    example: TemperaturaArmazenamento.REFRIGERADO,
  })
  @IsOptional()
  @IsEnum(TemperaturaArmazenamento)
  temperaturaArmazenamento?: TemperaturaArmazenamento;

  @ApiPropertyOptional({
    description: 'Temperatura mínima em °C',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(-200)
  @Max(100)
  temperaturaMin?: number;

  @ApiPropertyOptional({
    description: 'Temperatura máxima em °C',
    example: 8,
  })
  @IsOptional()
  @IsNumber()
  @Min(-200)
  @Max(100)
  temperaturaMax?: number;

  @ApiPropertyOptional({
    description: 'Prazo de validade em horas',
    example: 24,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prazoValidadeHoras?: number;

  @ApiPropertyOptional({
    description: 'Condições especiais de armazenamento',
    example: 'Manter refrigerado e protegido da luz',
  })
  @IsOptional()
  @IsString()
  condicoesArmazenamento?: string;

  @ApiPropertyOptional({
    description: 'Se é sensível à luz',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  sensibilidadeLuz?: boolean;

  @ApiPropertyOptional({
    description: 'Se requer centrifugação',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requerCentrifugacao?: boolean;

  @ApiPropertyOptional({
    description: 'Tempo de centrifugação em minutos',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tempoCentrifugacao?: number;

  @ApiPropertyOptional({
    description: 'Rotação da centrífuga em RPM',
    example: 3000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rotacaoCentrifugacao?: number;

  // Transporte
  @ApiPropertyOptional({
    description: 'Instruções de transporte',
    example: 'Transportar em caixa térmica com gelo',
  })
  @IsOptional()
  @IsString()
  instrucoesTransporte?: string;

  @ApiPropertyOptional({
    description: 'Temperatura de transporte',
    enum: TemperaturaTransporte,
    example: TemperaturaTransporte.REFRIGERADO,
  })
  @IsOptional()
  @IsEnum(TemperaturaTransporte)
  temperaturaTransporte?: TemperaturaTransporte;

  @ApiPropertyOptional({
    description: 'Se requer embalagem especial',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  embalagemEspecial?: boolean;

  @ApiPropertyOptional({
    description: 'Observações sobre transporte',
    example: 'Evitar agitação durante o transporte',
  })
  @IsOptional()
  @IsString()
  observacoesTransporte?: string;

  // Etiquetagem
  @ApiPropertyOptional({
    description: 'Cor da etiqueta (hex)',
    example: '#9370DB',
    maxLength: 7,
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  corEtiqueta?: string;

  @ApiPropertyOptional({
    description: 'Se deve gerar código de barras',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  codigoBarras?: boolean;

  @ApiPropertyOptional({
    description: 'Template customizado de etiqueta',
  })
  @IsOptional()
  @IsString()
  templateEtiqueta?: string;

  // Controle
  @ApiPropertyOptional({
    description: 'Se exige autorização especial',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  exigeAutorizacao?: boolean;

  @ApiPropertyOptional({
    description: 'Observações gerais',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Se a amostra está ativa',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
