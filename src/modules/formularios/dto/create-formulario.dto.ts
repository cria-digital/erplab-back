import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsInt,
  IsObject,
  IsArray,
  Min,
  Max,
  Length,
} from 'class-validator';
import {
  TipoFormulario,
  CategoriaFormulario,
  StatusFormulario,
} from '../entities/formulario.entity';

export class CreateFormularioDto {
  @ApiProperty({
    description: 'Código único do formulário',
    example: 'FORM001',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  codigoFormulario: string;

  @ApiProperty({
    description: 'Nome do formulário',
    example: 'Formulário de Anamnese Cardiológica',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  nomeFormulario: string;

  @ApiProperty({
    description: 'Descrição do formulário',
    example: 'Formulário para coleta de dados de anamnese cardiológica',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo do formulário',
    enum: TipoFormulario,
    example: TipoFormulario.ANAMNESE,
  })
  @IsEnum(TipoFormulario)
  tipo: TipoFormulario;

  @ApiProperty({
    description: 'Categoria do formulário',
    enum: CategoriaFormulario,
    example: CategoriaFormulario.CLINICO,
    required: false,
  })
  @IsOptional()
  @IsEnum(CategoriaFormulario)
  categoria?: CategoriaFormulario;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'uuid-da-unidade',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  unidadeSaudeId?: string;

  @ApiProperty({
    description: 'Versão do formulário',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  versao?: number;

  @ApiProperty({
    description: 'Status do formulário',
    enum: StatusFormulario,
    example: StatusFormulario.RASCUNHO,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusFormulario)
  status?: StatusFormulario;

  @ApiProperty({
    description: 'Se o formulário está ativo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Se o formulário é obrigatório',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  obrigatorio?: boolean;

  @ApiProperty({
    description: 'Se permite edição após preenchimento',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteEdicao?: boolean;

  @ApiProperty({
    description: 'Se requer assinatura digital',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  requerAssinatura?: boolean;

  @ApiProperty({
    description: 'Se permite anexar arquivos',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteAnexos?: boolean;

  @ApiProperty({
    description: 'Número máximo de anexos',
    example: 5,
    minimum: 1,
    maximum: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  maxAnexos?: number;

  @ApiProperty({
    description: 'Se gera PDF automaticamente',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  geraPdf?: boolean;

  @ApiProperty({
    description: 'Se envia por email automaticamente',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enviaEmail?: boolean;

  @ApiProperty({
    description: 'Se exibe numeração dos campos',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  exibirNumeracao?: boolean;

  @ApiProperty({
    description: 'Se exibe barra de progresso',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  exibirProgresso?: boolean;

  @ApiProperty({
    description: 'Se permite salvar como rascunho',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteSalvarRascunho?: boolean;

  @ApiProperty({
    description: 'Se valida em tempo real',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  validacaoTempoReal?: boolean;

  @ApiProperty({
    description: 'Perfis de acesso permitidos',
    example: ['medico', 'enfermeiro', 'admin'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  perfisAcesso?: string[];

  @ApiProperty({
    description: 'Departamentos com acesso',
    example: ['cardiologia', 'clinica-geral'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departamentosAcesso?: string[];

  @ApiProperty({
    description: 'Template do cabeçalho',
    example: '<h1>Formulário de Anamnese</h1>',
    required: false,
  })
  @IsOptional()
  @IsString()
  templateCabecalho?: string;

  @ApiProperty({
    description: 'Template do rodapé',
    example: '<p>Documento gerado automaticamente</p>',
    required: false,
  })
  @IsOptional()
  @IsString()
  templateRodape?: string;

  @ApiProperty({
    description: 'Estilos CSS customizados',
    example: { backgroundColor: '#f5f5f5', fontSize: '14px' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  estilosCustomizados?: any;

  @ApiProperty({
    description: 'Configurações extras do formulário',
    example: { autoSave: true, theme: 'light' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  configuracoesExtras?: any;

  @ApiProperty({
    description: 'Regras de validação customizadas',
    example: { requiredFields: ['nome', 'cpf'] },
    required: false,
  })
  @IsOptional()
  @IsObject()
  regrasValidacao?: any;

  @ApiProperty({
    description: 'Regras de visibilidade dos campos',
    example: { showOnCondition: { field: 'tipo', value: 'urgente' } },
    required: false,
  })
  @IsOptional()
  @IsObject()
  regrasVisibilidade?: any;

  @ApiProperty({
    description: 'Lógica condicional entre campos',
    example: { if: 'campo1 == "sim"', then: 'show campo2' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  logicaCondicional?: any;

  @ApiProperty({
    description: 'URL do webhook para notificações',
    example: 'https://meusite.com.br/webhook/formulario',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  webhookUrl?: string;

  @ApiProperty({
    description: 'Configurações de integração',
    example: { syncWithERP: true, updatePatient: true },
    required: false,
  })
  @IsOptional()
  @IsObject()
  integracaoConfig?: any;

  @ApiProperty({
    description: 'Gatilhos de automação',
    example: { onComplete: 'sendEmail', onSave: 'updateRecord' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  gatilhosAutomacao?: any;

  @ApiProperty({
    description: 'Data de início da validade',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  validoDe?: string;

  @ApiProperty({
    description: 'Data de fim da validade',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  validoAte?: string;

  @ApiProperty({
    description: 'ID do formulário pai (para sub-formulários)',
    example: 'uuid-do-formulario-pai',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  formularioPaiId?: string;

  @ApiProperty({
    description: 'Observações sobre o formulário',
    example: 'Formulário revisado pela equipe médica',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({
    description: 'Metadados adicionais',
    example: { author: 'Dr. João', department: 'Cardiologia' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadados?: any;

  @ApiProperty({
    description: 'Tags para categorização',
    example: ['cardiologia', 'anamnese', 'urgente'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
