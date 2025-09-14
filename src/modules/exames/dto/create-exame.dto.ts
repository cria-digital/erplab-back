import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
} from 'class-validator';

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
    description: 'Sinônimos ou nomes alternativos',
    example: 'Hemograma, Contagem de células',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  sinonimos?: string;

  @ApiProperty({
    description: 'Código TUSS (Terminologia Unificada da Saúde Suplementar)',
    example: '40304361',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  codigo_tuss?: string;

  @ApiProperty({
    description: 'Código AMB (Associação Médica Brasileira)',
    example: '28.01.001-2',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  codigo_amb?: string;

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
    description: 'ID do tipo de exame',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  tipo_exame_id: number;

  @ApiProperty({
    description: 'Categoria geral do exame',
    enum: ['laboratorio', 'imagem', 'procedimento', 'consulta'],
    example: 'laboratorio',
  })
  @IsEnum(['laboratorio', 'imagem', 'procedimento', 'consulta'])
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({
    description: 'ID do subgrupo do exame',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  subgrupo_id?: number;

  @ApiProperty({
    description: 'ID do setor responsável',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  setor_id?: number;

  @ApiProperty({
    description: 'Metodologia utilizada no exame',
    example: 'Citometria de fluxo',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  metodologia?: string;

  @ApiProperty({
    description: 'Se precisa de especialidade médica específica',
    enum: ['nao', 'sim'],
    default: 'nao',
  })
  @IsEnum(['nao', 'sim'])
  @IsOptional()
  especialidade_requerida?: string;

  @ApiProperty({
    description: 'Especialidade médica requerida',
    example: 'Hematologia',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  especialidade?: string;

  @ApiProperty({
    description: 'Grupo de exames relacionados',
    example: 'Hemograma',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  grupo?: string;

  @ApiProperty({
    description: 'Peso/prioridade para ordenação',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  peso?: number;

  @ApiProperty({
    description: 'Volume mínimo necessário (em ml)',
    example: 2.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  volume_min?: number;

  @ApiProperty({
    description: 'Volume ideal (em ml)',
    example: 5.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  volume_ideal?: number;

  @ApiProperty({
    description: 'Unidade de medida do resultado',
    example: 'mg/dL',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  unidade_medida?: string;

  @ApiProperty({
    description: 'Tipo de amostra biológica necessária',
    example: 'Sangue total EDTA',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  amostra_biologica?: string;

  @ApiProperty({
    description: 'Tipo de recipiente para coleta',
    example: 'Tubo roxo EDTA',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  tipo_recipiente?: string;

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

  @ApiProperty({
    description: 'Onde o exame é realizado',
    enum: ['interno', 'apoio', 'telemedicina'],
    default: 'interno',
  })
  @IsEnum(['interno', 'apoio', 'telemedicina'])
  @IsOptional()
  tipo_realizacao?: string;

  @ApiProperty({
    description: 'ID do laboratório de apoio',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  laboratorio_apoio_id?: number;

  @ApiProperty({
    description: 'Destino do exame no sistema externo',
    example: 'DB_HEMOGRAMA',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  destino_exame?: string;

  @ApiProperty({
    description: 'Se envia automaticamente para laboratório de apoio',
    enum: ['nao', 'sim'],
    default: 'nao',
  })
  @IsEnum(['nao', 'sim'])
  @IsOptional()
  envio_automatico?: string;

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
    description: 'Processamento e entrega de laudos',
    example: 'Resultado liberado em até 2 dias úteis',
    required: false,
  })
  @IsString()
  @IsOptional()
  processamento_entrega?: string;

  @ApiProperty({
    description: 'Requisitos da ANVISA/Normas técnicas',
    example: {
      norma: 'RDC 302/2005',
      requisito: 'Controle de qualidade interno',
    },
    required: false,
  })
  @IsOptional()
  requisitos_anvisa?: any;

  @ApiProperty({
    description: 'Formulários necessários para o atendimento',
    example: ['termo_consentimento', 'questionario_jejum'],
    required: false,
  })
  @IsOptional()
  formularios_atendimento?: any;

  @ApiProperty({
    description: 'Instruções de preparo por público',
    example: {
      geral: 'Jejum de 8 horas',
      feminino: 'Informar data da última menstruação',
      infantil: 'Jejum de 4 horas para crianças',
    },
    required: false,
  })
  @IsOptional()
  preparo_coleta?: any;

  @ApiProperty({
    description: 'Lembretes para coletores, recepcionistas e ordem de serviço',
    example: {
      coletores: 'Homogeneizar suavemente o tubo',
      recepcionistas: 'Verificar jejum do paciente',
      ordem_servico: 'Exame deve ser coletado em tubo EDTA',
    },
    required: false,
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
    description: 'ID da empresa (null = disponível para todas)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  empresa_id?: number;
}
