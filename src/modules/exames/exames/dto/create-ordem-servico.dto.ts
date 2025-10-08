import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExameOrdemServicoDto {
  @ApiProperty({
    description: 'ID do exame',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  exame_id: string;

  @ApiProperty({
    description: 'Quantidade do exame',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantidade?: number;

  @ApiProperty({
    description: 'Valor unitário do exame',
    example: 25.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  valor_unitario?: number;

  @ApiProperty({
    description: 'Valor de desconto aplicado',
    example: 5.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  valor_desconto?: number;

  @ApiProperty({
    description: 'Observações específicas do exame',
    example: 'Paciente relata alergia ao látex',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'Se é exame urgente',
    example: false,
    default: false,
  })
  @IsOptional()
  is_urgente?: boolean;
}

export class CreateOrdemServicoDto {
  @ApiProperty({
    description: 'ID do paciente',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  paciente_id: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'f6749f41-187e-4a05-8fe7-285ef87e99f1',
  })
  @IsUUID()
  @IsNotEmpty()
  unidade_saude_id: string;

  @ApiProperty({
    description: 'Data e hora do atendimento',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  data_atendimento: Date;

  @ApiProperty({
    description: 'Data prevista para coleta',
    example: '2024-01-16',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  data_coleta_prevista?: Date;

  @ApiProperty({
    description: 'Canal de origem do atendimento',
    enum: [
      'presencial',
      'whatsapp',
      'telefone',
      'email',
      'portal',
      'domiciliar',
    ],
    example: 'presencial',
  })
  @IsEnum([
    'presencial',
    'whatsapp',
    'telefone',
    'email',
    'portal',
    'domiciliar',
  ])
  @IsNotEmpty()
  canal_origem: string;

  @ApiProperty({
    description: 'Prioridade do atendimento',
    enum: ['normal', 'urgente', 'emergencia'],
    default: 'normal',
  })
  @IsEnum(['normal', 'urgente', 'emergencia'])
  @IsOptional()
  prioridade?: string;

  @ApiProperty({
    description: 'Tipo de atendimento',
    enum: ['particular', 'convenio', 'sus'],
    example: 'particular',
  })
  @IsEnum(['particular', 'convenio', 'sus'])
  @IsNotEmpty()
  tipo_atendimento: string;

  @ApiProperty({
    description: 'ID do convênio (se aplicável)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  convenio_id?: number;

  @ApiProperty({
    description: 'Número da guia do convênio',
    example: '123456789',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  numero_guia?: string;

  @ApiProperty({
    description: 'Senha de autorização do convênio',
    example: 'AUTH123',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  senha_autorizacao?: string;

  @ApiProperty({
    description: 'Validade da guia',
    example: '2024-02-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  validade_guia?: Date;

  @ApiProperty({
    description: 'Nome do médico solicitante',
    example: 'Dr. João Silva',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  medico_solicitante?: string;

  @ApiProperty({
    description: 'CRM do médico solicitante',
    example: 'CRM-SP 123456',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  crm_solicitante?: string;

  @ApiProperty({
    description: 'Clínica/Hospital de origem',
    example: 'Hospital São Paulo',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  clinica_origem?: string;

  @ApiProperty({
    description: 'Lista de exames da ordem de serviço',
    type: [ExameOrdemServicoDto],
    example: [
      {
        exame_id: 1,
        quantidade: 1,
        valor_unitario: 25.0,
        valor_desconto: 0,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExameOrdemServicoDto)
  exames: ExameOrdemServicoDto[];

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Paciente em jejum de 12 horas',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    description: 'Notas internas (não visível ao paciente)',
    example: 'Verificar convênio antes da coleta',
    required: false,
  })
  @IsString()
  @IsOptional()
  notas_internas?: string;

  @ApiProperty({
    description: 'Orientações ao paciente',
    example: 'Trazer documento com foto e carteira do convênio',
    required: false,
  })
  @IsString()
  @IsOptional()
  orientacoes_paciente?: string;

  @ApiProperty({
    description: 'URLs de documentos anexados',
    example: ['https://storage.com/pedido-medico.pdf'],
    required: false,
  })
  @IsOptional()
  documentos_anexados?: any;

  @ApiProperty({
    description: 'Forma de entrega dos resultados',
    enum: ['presencial', 'email', 'whatsapp', 'portal', 'correios'],
    required: false,
  })
  @IsEnum(['presencial', 'email', 'whatsapp', 'portal', 'correios'])
  @IsOptional()
  forma_entrega?: string;

  @ApiProperty({
    description: 'Email/WhatsApp/Endereço para entrega',
    example: 'paciente@email.com',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  dados_entrega?: string;

  @ApiProperty({
    description: 'ID da empresa',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  empresa_id: string;
}
