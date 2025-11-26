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
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  tipo_exame_id: string;

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
    description: 'ID da alternativa do campo regiao_coleta',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  regiao_coleta_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo estabilidade',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  estabilidade_id?: string;

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
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  laboratorio_apoio_id?: string;

  @ApiProperty({
    description: 'ID da telemedicina (quando tipo_realizacao = telemedicina)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  telemedicina_id?: string;

  @ApiProperty({
    description: 'ID da unidade de saúde de destino',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  unidade_destino_id?: string;

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
    description: 'Links úteis relacionados ao exame',
    example: 'https://exemplo.com/manual-hemograma.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  links_uteis?: string;

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
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  empresa_id?: string;
}
