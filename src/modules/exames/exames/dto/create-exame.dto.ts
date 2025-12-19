import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExameUnidadeDto } from './create-exame-unidade.dto';

export class CreateExameDto {
  @ApiProperty({
    description: 'Código interno único do exame',
    example: 'HEMOG001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo_interno: string;

  @ApiProperty({
    description: 'Nome completo do exame',
    example: 'Hemograma Completo',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description: 'Sinônimos ou nomes alternativos (array de strings)',
    example: ['Hemograma', 'Contagem de células'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sinonimos?: string[];

  @ApiProperty({
    description:
      'Código CBHPM (Classificação Brasileira Hierarquizada de Procedimentos Médicos)',
    example: '40304361',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  codigo_cbhpm?: string;

  @ApiProperty({
    description:
      'Código TUSS (Terminologia Unificada da Saúde Suplementar) - DEPRECATED: usar tuss_id',
    example: '40304361',
    required: false,
    maxLength: 20,
    deprecated: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  codigo_tuss?: string;

  @ApiProperty({
    description:
      'FK para tabela TUSS (usar autocomplete em GET /exames/tuss/search?q=)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  tuss_id?: string;

  @ApiProperty({
    description:
      'FK para tabela AMB-92 (usar autocomplete em GET /exames/amb/search?q=)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  amb_id?: string;

  @ApiProperty({
    description:
      'Código LOINC (Logical Observation Identifiers Names and Codes)',
    example: '58410-2',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  codigo_loinc?: string;

  @ApiProperty({
    description: 'Código SUS',
    example: '0202010503',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  codigo_sus?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo tipo_exames',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  tipo_exame_id?: string;

  @ApiProperty({
    description: 'ID do subgrupo do exame',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  subgrupo_id?: string;

  @ApiProperty({
    description: 'ID do setor responsável',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  setor_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo metodologia',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  metodologia_id?: string;

  @ApiProperty({
    description: 'Se precisa de especialidade médica específica',
    enum: ['nao', 'sim'],
    default: 'nao',
  })
  @IsEnum(['nao', 'sim'])
  @IsOptional()
  especialidade_requerida?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo especialidade',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  especialidade_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo grupo',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  grupo_id?: string;

  @ApiProperty({
    description: 'Prioridade para ordenação',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  prioridade?: number;

  @ApiProperty({
    description: 'Se o exame requer peso do paciente (SIM/NÃO)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  peso?: boolean;

  @ApiProperty({
    description: 'Se o exame requer altura do paciente (SIM/NÃO)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  altura?: boolean;

  @ApiProperty({
    description: 'Se o exame requer volume específico (SIM/NÃO)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  volume?: boolean;

  @ApiProperty({
    description: 'ID da alternativa do campo unidade_medida',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  unidade_medida_id?: string;

  @ApiProperty({
    description: 'ID da amostra biológica necessária (tabela amostras)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  amostra_id?: string;

  @ApiProperty({
    description:
      'ID da alternativa do campo amostra a enviar (soro, plasma, etc)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  amostra_enviar_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo tipo_recipiente',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  tipo_recipiente_id?: string;

  @ApiProperty({
    description: 'IDs das alternativas do campo regiao_coleta (array)',
    example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  regiao_coleta_ids?: string[];

  @ApiProperty({
    description: 'ID da alternativa do campo estabilidade',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  estabilidade_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo volume_minimo',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  volume_minimo_id?: string;

  @ApiProperty({
    description: 'Formatos de laudo aceitos (multiselect)',
    example: ['PDF', 'XML', 'HTML'],
    enum: ['PDF', 'XML', 'HTML', 'TEXTO', 'FORMULARIO', 'DICOM'],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  formatos_laudo?: string[];

  @ApiProperty({
    description: 'Se o exame requer termo de consentimento (SIM/NÃO)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  termo_consentimento?: boolean;

  @ApiProperty({
    description: 'Se necessita preparo especial',
    enum: ['nao', 'sim'],
    default: 'nao',
  })
  @IsEnum(['nao', 'sim'])
  @IsOptional()
  necessita_preparo?: string;

  @ApiProperty({
    description: 'Requisitos para realização do exame',
    example: 'Jejum de 8 horas',
    required: false,
  })
  @IsString()
  @IsOptional()
  requisitos?: string;

  // Campos de integração movidos para unidades[]

  @ApiProperty({
    description: 'Prazo de entrega em dias úteis',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  prazo_entrega_dias?: number;

  @ApiProperty({
    description: 'Formato do prazo',
    example: '2 dias úteis',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  formato_prazo?: string;

  @ApiProperty({
    description: 'Se tem referência de valores normais',
    enum: ['nao', 'sim'],
    default: 'nao',
  })
  @IsEnum(['nao', 'sim'])
  @IsOptional()
  tem_valores_referencia?: string;

  @ApiProperty({
    description: 'Valores de referência por idade/sexo',
    example: {
      adulto_masculino: { min: 13.5, max: 17.5 },
      adulto_feminino: { min: 12.0, max: 15.5 },
    },
    required: false,
  })
  @IsOptional()
  valores_referencia?: any;

  @ApiProperty({
    description: 'Técnica de coleta específica',
    example: 'Punção venosa periférica',
    required: false,
  })
  @IsString()
  @IsOptional()
  tecnica_coleta?: string;

  @ApiProperty({
    description: 'Distribuição/processamento da amostra',
    example: 'Centrifugar a 3000 rpm por 10 minutos',
    required: false,
  })
  @IsString()
  @IsOptional()
  distribuicao?: string;

  @ApiProperty({
    description: 'Critérios de rejeição da amostra',
    example: 'Amostra hemolisada, lipêmica ou com coágulos',
    required: false,
  })
  @IsString()
  @IsOptional()
  rejeicao?: string;

  @ApiProperty({
    description: 'Processamento e entrega de laudos',
    example: 'Resultado liberado em até 2 dias úteis',
    required: false,
  })
  @IsString()
  @IsOptional()
  processamento_entrega?: string;

  @ApiProperty({
    description: 'Informações de processamento do exame',
    example: 'Centrifugar por 10 minutos a 3000 rpm',
    required: false,
  })
  @IsString()
  @IsOptional()
  processamento?: string;

  @ApiProperty({
    description: 'Links úteis relacionados ao exame',
    example: 'https://exemplo.com/manual-hemograma.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  links_uteis?: string;

  @ApiProperty({
    description:
      'ID do requisito ANVISA selecionado (alternativa de campo de formulário)',
    example: 'uuid-da-alternativa',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  requisitos_anvisa_id?: string;

  @ApiProperty({
    description: 'Formulários necessários para o atendimento',
    example: ['termo_consentimento', 'questionario_jejum'],
    required: false,
  })
  @IsOptional()
  formularios_atendimento?: any;

  // Preparo - campos separados conforme Figma
  @ApiProperty({
    description: 'Instruções de preparo - Público geral',
    example: 'Jejum de 8 horas',
    required: false,
  })
  @IsString()
  @IsOptional()
  preparo_geral?: string;

  @ApiProperty({
    description: 'Instruções de preparo - Feminino',
    example: 'Informar data da última menstruação',
    required: false,
  })
  @IsString()
  @IsOptional()
  preparo_feminino?: string;

  @ApiProperty({
    description: 'Instruções de preparo - Infantil',
    example: 'Jejum de 4 horas para crianças',
    required: false,
  })
  @IsString()
  @IsOptional()
  preparo_infantil?: string;

  // Coleta - campos separados conforme Figma
  @ApiProperty({
    description: 'Instruções de coleta - Público geral',
    example: 'Coletar em tubo EDTA',
    required: false,
  })
  @IsString()
  @IsOptional()
  coleta_geral?: string;

  @ApiProperty({
    description: 'Instruções de coleta - Feminino',
    example: 'Coleta preferencialmente fora do período menstrual',
    required: false,
  })
  @IsString()
  @IsOptional()
  coleta_feminino?: string;

  @ApiProperty({
    description: 'Instruções de coleta - Infantil',
    example: 'Coleta com agulha pediátrica',
    required: false,
  })
  @IsString()
  @IsOptional()
  coleta_infantil?: string;

  // Lembretes - campos separados conforme Figma
  @ApiProperty({
    description: 'Lembrete para coletora',
    example: 'Homogeneizar suavemente o tubo',
    required: false,
  })
  @IsString()
  @IsOptional()
  lembrete_coletora?: string;

  @ApiProperty({
    description: 'Lembrete para recepcionista - Agendamentos e Orçamentos',
    example: 'Verificar jejum do paciente',
    required: false,
  })
  @IsString()
  @IsOptional()
  lembrete_recepcionista_agendamento?: string;

  @ApiProperty({
    description: 'Lembrete para recepcionista - Ordem de Serviço',
    example: 'Exame deve ser coletado em tubo EDTA',
    required: false,
  })
  @IsString()
  @IsOptional()
  lembrete_recepcionista_os?: string;

  // Campos JSONB mantidos para compatibilidade (deprecated)
  @ApiProperty({
    description:
      'Instruções de preparo por público (DEPRECATED - usar campos separados)',
    required: false,
    deprecated: true,
  })
  @IsOptional()
  preparo_coleta?: any;

  @ApiProperty({
    description: 'Lembretes (DEPRECATED - usar campos separados)',
    required: false,
    deprecated: true,
  })
  @IsOptional()
  lembretes?: any;

  @ApiProperty({
    description: 'Status do exame no sistema',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
  })
  @IsEnum(['ativo', 'inativo', 'suspenso'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Unidades que realizam o exame com seus destinos',
    type: [CreateExameUnidadeDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExameUnidadeDto)
  @IsOptional()
  unidades?: CreateExameUnidadeDto[];

  // empresa_id é definido automaticamente pelo sistema
}
