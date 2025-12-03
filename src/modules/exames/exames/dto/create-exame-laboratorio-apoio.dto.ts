import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateExameLaboratorioApoioDto {
  @ApiProperty({
    description: 'ID do exame',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  exame_id: string;

  @ApiProperty({
    description: 'ID do laboratório de apoio',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  laboratorio_apoio_id: string;

  @ApiProperty({
    description: 'Código do exame no laboratório de apoio',
    example: 'HEM001',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  codigo_exame_apoio?: string;

  // Requisitos para realização do exame
  @ApiProperty({
    description: 'ID da alternativa do campo metodologia',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  metodologia_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo unidade_medida',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  unidade_medida_id?: string;

  @ApiProperty({
    description: 'Se o exame requer peso do paciente (SIM/NÃO)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  requer_peso?: boolean;

  @ApiProperty({
    description: 'Se o exame requer altura do paciente (SIM/NÃO)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  requer_altura?: boolean;

  @ApiProperty({
    description: 'Se o exame requer volume específico (SIM/NÃO)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  requer_volume?: boolean;

  @ApiProperty({
    description: 'ID da amostra biológica necessária',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  amostra_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo amostra_enviar',
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
    description: 'IDs das regiões de coleta (múltiplas)',
    example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  regioes_coleta_ids?: string[];

  @ApiProperty({
    description: 'ID da alternativa do campo volume_minimo',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  volume_minimo_id?: string;

  @ApiProperty({
    description: 'ID da alternativa do campo estabilidade',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsString()
  @IsOptional()
  estabilidade_id?: string;

  // Formulários de atendimento
  @ApiProperty({
    description: 'Formulários necessários para o atendimento neste laboratório',
    required: false,
  })
  @IsOptional()
  formularios_atendimento?: any;

  // Preparo - campos separados
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

  // Coleta - campos separados
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

  @ApiProperty({
    description: 'Técnica de coleta específica',
    example: 'Punção venosa periférica',
    required: false,
  })
  @IsString()
  @IsOptional()
  tecnica_coleta?: string;

  // Lembretes
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

  @ApiProperty({
    description: 'Instruções de distribuição',
    example: 'Centrifugar a 3000 rpm por 10 minutos',
    required: false,
  })
  @IsString()
  @IsOptional()
  distribuicao?: string;

  // Processamento e Entrega de Laudos
  @ApiProperty({
    description: 'Prazo de entrega dos resultados (em dias)',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  prazo_entrega_dias?: number;

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
    description: 'Se o vínculo está ativo',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
