import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  Min,
  Length,
} from 'class-validator';
import { StatusAlternativa } from '../entities/alternativa-campo.entity';

export class CreateAlternativaCampoDto {
  @ApiProperty({
    description: 'ID do campo formulário',
    example: 'uuid-do-campo',
  })
  @IsUUID()
  campoFormularioId: string;

  @ApiProperty({
    description: 'Código único da alternativa',
    example: 'ALT001',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  codigoAlternativa: string;

  @ApiProperty({
    description: 'Valor da alternativa',
    example: 'M',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  valor: string;

  @ApiProperty({
    description: 'Rótulo exibido da alternativa',
    example: 'Masculino',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  textoAlternativa: string;

  @ApiProperty({
    description: 'Descrição detalhada da alternativa',
    example: 'Opção para seleção do sexo masculino',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Ordem de exibição da alternativa',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  ordem?: number;

  @ApiProperty({
    description: 'Se a alternativa está selecionada por padrão',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  selecionadoPadrao?: boolean;

  @ApiProperty({
    description: 'Se a alternativa é exclusiva (deseleciona outras)',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  exclusiva?: boolean;

  @ApiProperty({
    description: 'Score/pontuação da alternativa',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pontuacao?: number;

  @ApiProperty({
    description: 'Peso da alternativa para cálculos',
    example: 1.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiProperty({
    description: 'Cor de exibição da alternativa',
    example: '#FF0000',
    maxLength: 7,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 7)
  cor?: string;

  @ApiProperty({
    description: 'Ícone da alternativa',
    example: 'fas fa-check',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  icone?: string;

  @ApiProperty({
    description: 'URL de imagem da alternativa',
    example: 'https://exemplo.com/imagem.png',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  imagemUrl?: string;

  @ApiProperty({
    description: 'Condições para exibir a alternativa',
    example: { showIf: { field: 'idade', greaterThan: 18 } },
    required: false,
  })
  @IsOptional()
  @IsObject()
  condicoesExibicao?: any;

  @ApiProperty({
    description: 'Ações executadas quando selecionada',
    example: { action: 'show', targets: ['campo2', 'campo3'] },
    required: false,
  })
  @IsOptional()
  @IsObject()
  acoesTrigger?: any;

  @ApiProperty({
    description: 'Campos que devem ser exibidos ao selecionar',
    example: ['campo_detalhes', 'campo_observacoes'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  camposExibir?: string[];

  @ApiProperty({
    description: 'Campos que devem ser ocultados ao selecionar',
    example: ['campo_outro'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  camposOcultar?: string[];

  @ApiProperty({
    description: 'Grupos de campos afetados pela seleção',
    example: ['grupo_endereco', 'grupo_contato'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  gruposAfetados?: string[];

  @ApiProperty({
    description: 'URL para buscar dados relacionados',
    example: 'https://api.exemplo.com/dados/{valor}',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  urlDadosRelacionados?: string;

  @ApiProperty({
    description: 'Mapeamento de dados externos',
    example: { sourceField: 'name', targetField: 'nome' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  mapeamentoDados?: any;

  @ApiProperty({
    description: 'Status da alternativa',
    enum: StatusAlternativa,
    example: StatusAlternativa.ATIVA,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusAlternativa)
  status?: StatusAlternativa;

  @ApiProperty({
    description: 'Se a alternativa está ativa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Se é visível na impressão',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  visivelImpressao?: boolean;

  @ApiProperty({
    description: 'Se é visível no portal do paciente',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  visivelPortal?: boolean;

  @ApiProperty({
    description: 'Estilos CSS customizados',
    example: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  estilosCss?: any;

  @ApiProperty({
    description: 'Classes CSS da alternativa',
    example: ['option-primary', 'highlighted'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  classesCss?: string[];

  @ApiProperty({
    description: 'Atributos HTML customizados',
    example: { 'data-toggle': 'tooltip', title: 'Informação adicional' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  atributosHtml?: any;

  @ApiProperty({
    description: 'Validações específicas da alternativa',
    example: { required: ['campo_observacao'] },
    required: false,
  })
  @IsOptional()
  @IsObject()
  validacoesEspecificas?: any;

  @ApiProperty({
    description: 'Configurações extras da alternativa',
    example: { allowCustomInput: true, maxLength: 100 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  configuracoesExtras?: any;

  @ApiProperty({
    description: 'Metadados adicionais',
    example: { category: 'demographics', analytics_track: true },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadados?: any;

  @ApiProperty({
    description: 'Observações sobre a alternativa',
    example: 'Alternativa padrão para novos formulários',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
