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
  IsArray,
  Min,
  Max,
  Length,
} from 'class-validator';
import { TipoCampo, StatusCampo } from '../entities/campo-formulario.entity';

export class CreateCampoFormularioDto {
  @ApiProperty({
    description: 'ID do formulário',
    example: 'uuid-do-formulario',
  })
  @IsUUID()
  formularioId: string;

  @ApiProperty({
    description: 'Código único do campo',
    example: 'CAMPO001',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  codigoCampo: string;

  @ApiProperty({
    description: 'Nome do campo',
    example: 'Nome do Paciente',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  nomeCampo: string;

  @ApiProperty({
    description: 'Descrição do campo',
    example: 'Campo para inserir o nome completo do paciente',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Texto placeholder',
    example: 'Digite o nome completo',
    required: false,
  })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiProperty({
    description: 'Texto de ajuda',
    example: 'Insira o nome completo sem abreviações',
    required: false,
  })
  @IsOptional()
  @IsString()
  textoAjuda?: string;

  @ApiProperty({
    description: 'Tipo do campo',
    enum: TipoCampo,
    example: TipoCampo.TEXTO,
  })
  @IsEnum(TipoCampo)
  tipoCampo: TipoCampo;

  @ApiProperty({
    description: 'Ordem do campo no formulário',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  ordem?: number;

  @ApiProperty({
    description: 'Se o campo é obrigatório',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  obrigatorio?: boolean;

  @ApiProperty({
    description: 'Se o campo é somente leitura',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  somenteLeitura?: boolean;

  @ApiProperty({
    description: 'Tamanho mínimo (caracteres ou valor)',
    example: 3,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  tamanhoMinimo?: number;

  @ApiProperty({
    description: 'Tamanho máximo (caracteres ou valor)',
    example: 100,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  tamanhoMaximo?: number;

  @ApiProperty({
    description: 'Valor mínimo (para campos numéricos)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  valorMinimo?: number;

  @ApiProperty({
    description: 'Valor máximo (para campos numéricos)',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  valorMaximo?: number;

  @ApiProperty({
    description: 'Máscara de formatação',
    example: '(##) #####-####',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  mascara?: string;

  @ApiProperty({
    description: 'Expressão regular para validação',
    example: '^[a-zA-Z\\s]+$',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  regex?: string;

  @ApiProperty({
    description: 'Mensagem de erro personalizada',
    example: 'Por favor, insira um nome válido',
    required: false,
  })
  @IsOptional()
  @IsString()
  mensagemErro?: string;

  @ApiProperty({
    description: 'Valor padrão do campo',
    example: 'Não informado',
    required: false,
  })
  @IsOptional()
  @IsString()
  valorPadrao?: string;

  @ApiProperty({
    description: 'Opções de seleção (para campos de seleção)',
    example: [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' },
    ],
    required: false,
  })
  @IsOptional()
  @IsObject()
  opcoesSelecao?: any;

  @ApiProperty({
    description: 'Se permite múltipla seleção',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteMultiplaSelecao?: boolean;

  @ApiProperty({
    description: 'Se permite opção "Outro"',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteOutro?: boolean;

  @ApiProperty({
    description: 'Tipos de arquivo aceitos',
    example: ['pdf', 'jpg', 'png'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tiposArquivoAceitos?: string[];

  @ApiProperty({
    description: 'Tamanho máximo do arquivo em MB',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  tamanhoMaximoArquivoMb?: number;

  @ApiProperty({
    description: 'Se permite múltiplos arquivos',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteMultiplosArquivos?: boolean;

  @ApiProperty({
    description: 'Número máximo de arquivos',
    example: 5,
    minimum: 1,
    maximum: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  maxArquivos?: number;

  @ApiProperty({
    description: 'Largura da coluna (1-12)',
    example: 6,
    minimum: 1,
    maximum: 12,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  larguraColuna?: number;

  @ApiProperty({
    description: 'Alinhamento do texto',
    example: 'left',
    enum: ['left', 'center', 'right'],
    required: false,
  })
  @IsOptional()
  @IsString()
  alinhamento?: string;

  @ApiProperty({
    description: 'Estilos CSS customizados',
    example: { color: '#333', backgroundColor: '#f9f9f9' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  estilosCss?: any;

  @ApiProperty({
    description: 'Classes CSS',
    example: ['form-control', 'required-field'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classesCss?: string[];

  @ApiProperty({
    description: 'Ícone do campo',
    example: 'fas fa-user',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  icone?: string;

  @ApiProperty({
    description: 'Condições de visibilidade',
    example: { showIf: { field: 'tipo', equals: 'pessoa_fisica' } },
    required: false,
  })
  @IsOptional()
  @IsObject()
  condicoesVisibilidade?: any;

  @ApiProperty({
    description: 'Condições de obrigatoriedade',
    example: { requiredIf: { field: 'categoria', equals: 'urgente' } },
    required: false,
  })
  @IsOptional()
  @IsObject()
  condicoesObrigatoriedade?: any;

  @ApiProperty({
    description: 'Condições de validação customizadas',
    example: { validateIf: { field: 'idade', greaterThan: 18 } },
    required: false,
  })
  @IsOptional()
  @IsObject()
  condicoesValidacao?: any;

  @ApiProperty({
    description: 'Fórmula de cálculo (para campos calculados)',
    example: 'campo1 + campo2 * 0.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  formulaCalculo?: string;

  @ApiProperty({
    description: 'IDs dos campos dependentes',
    example: ['campo2', 'campo3'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  camposDependentes?: string[];

  @ApiProperty({
    description: 'IDs dos campos dos quais este depende',
    example: ['campo_principal'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependeDe?: string[];

  @ApiProperty({
    description: 'Campo correspondente na integração',
    example: 'patient_name',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  campoIntegracao?: string;

  @ApiProperty({
    description: 'URL para buscar dados externos',
    example: 'https://api.exemplo.com/buscar/{valor}',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  urlBuscaDados?: string;

  @ApiProperty({
    description: 'Mapeamento de dados externos',
    example: { sourceField: 'name', targetField: 'nomePaciente' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  mapeamentoDados?: any;

  @ApiProperty({
    description: 'Unidade de medida (para campos de exames)',
    example: 'mg/dL',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  unidadeMedida?: string;

  @ApiProperty({
    description: 'Valores de referência (para campos de exames)',
    example: { min: 70, max: 100, unit: 'mg/dL' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  valoresReferencia?: any;

  @ApiProperty({
    description: 'Status do campo',
    enum: StatusCampo,
    example: StatusCampo.ATIVO,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusCampo)
  status?: StatusCampo;

  @ApiProperty({
    description: 'Se o campo está ativo',
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
    description: 'Metadados adicionais',
    example: { category: 'personal_data', required_profile: 'admin' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadados?: any;

  @ApiProperty({
    description: 'Configurações extras',
    example: { autoComplete: true, spellCheck: false },
    required: false,
  })
  @IsOptional()
  @IsObject()
  configuracoesExtras?: any;

  @ApiProperty({
    description: 'Observações sobre o campo',
    example: 'Campo obrigatório para pacientes acima de 65 anos',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
