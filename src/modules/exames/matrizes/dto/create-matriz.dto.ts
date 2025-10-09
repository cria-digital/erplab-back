import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMatriz, StatusMatriz } from '../entities/matriz-exame.entity';
import { CreateCampoMatrizDto } from './create-campo-matriz.dto';

export class CreateMatrizDto {
  @ApiProperty({
    description: 'Código interno único da matriz',
    example: 'MTZ-AUDIO-001',
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  codigoInterno: string;

  @ApiProperty({
    description: 'Nome da matriz',
    example: 'Audiometria Tonal Padrão',
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da matriz',
    example:
      'Matriz para exame de audiometria tonal com medições em 6 frequências',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo da matriz',
    enum: TipoMatriz,
    example: TipoMatriz.AUDIOMETRIA,
  })
  @IsEnum(TipoMatriz)
  tipoMatriz: TipoMatriz;

  @ApiPropertyOptional({
    description: 'ID do tipo de exame',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  tipoExameId?: string;

  @ApiPropertyOptional({
    description: 'ID do exame específico (para matrizes exclusivas)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  exameId?: string;

  @ApiPropertyOptional({
    description: 'Versão da matriz',
    example: '1.0',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  versao?: string;

  @ApiPropertyOptional({
    description: 'Se é uma matriz padrão do sistema',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  padraoSistema?: boolean;

  @ApiPropertyOptional({
    description: 'Se possui cálculos automáticos',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  temCalculoAutomatico?: boolean;

  @ApiPropertyOptional({
    description: 'Fórmulas de cálculo em JSON',
    example: { campo_resultado: '{campo1} + {campo2}' },
  })
  @IsOptional()
  @IsObject()
  formulasCalculo?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Configurações de layout',
    example: {
      tipo: 'grid',
      colunas: 12,
      espacamento: 2,
    },
  })
  @IsOptional()
  @IsObject()
  layoutVisualizacao?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Template HTML/Handlebars para impressão',
    example: '<div>{{#each campos}}{{label}}: {{valor}}{{/each}}</div>',
  })
  @IsOptional()
  @IsString()
  templateImpressao?: string;

  @ApiPropertyOptional({
    description: 'Se requer assinatura digital',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requerAssinaturaDigital?: boolean;

  @ApiPropertyOptional({
    description: 'Se permite edição após liberação',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteEdicaoAposLiberacao?: boolean;

  @ApiPropertyOptional({
    description: 'Regras de validação customizadas',
    example: { minCamposPreenchidos: 5 },
  })
  @IsOptional()
  @IsObject()
  regrasValidacao?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Instruções para preenchimento',
    example:
      'Preencher todos os campos obrigatórios antes de liberar o resultado',
  })
  @IsOptional()
  @IsString()
  instrucoesPreenchimento?: string;

  @ApiPropertyOptional({
    description: 'Observações gerais',
    example: 'Matriz baseada na norma ANSI S3.1-1999',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Referências bibliográficas',
    example: 'ANSI S3.1-1999 - Maximum Permissible Ambient Noise Levels',
  })
  @IsOptional()
  @IsString()
  referenciasBibliograficas?: string;

  @ApiPropertyOptional({
    description: 'Status da matriz',
    enum: StatusMatriz,
    example: StatusMatriz.ATIVO,
  })
  @IsOptional()
  @IsEnum(StatusMatriz)
  status?: StatusMatriz;

  @ApiPropertyOptional({
    description: 'Se a matriz está ativa',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({
    description: 'Campos da matriz',
    type: [CreateCampoMatrizDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCampoMatrizDto)
  campos?: CreateCampoMatrizDto[];
}
