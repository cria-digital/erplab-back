import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsObject,
  IsArray,
  Length,
} from 'class-validator';
import { StatusResposta } from '../entities/resposta-formulario.entity';

export class CreateRespostaFormularioDto {
  @ApiProperty({
    description: 'ID do formulário',
    example: 'uuid-do-formulario',
  })
  @IsUUID()
  formularioId: string;

  @ApiProperty({
    description: 'ID do paciente (se aplicável)',
    example: 'uuid-do-paciente',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  pacienteId?: string;

  @ApiProperty({
    description: 'ID do usuário que preencheu',
    example: 'uuid-do-usuario',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'uuid-da-unidade',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  unidadeSaudeId?: string;

  @ApiProperty({
    description: 'ID da ordem de serviço (se aplicável)',
    example: 'uuid-da-ordem',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  ordemServicoId?: string;

  @ApiProperty({
    description: 'Código único da resposta',
    example: 'RESP001',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  codigoResposta?: string;

  @ApiProperty({
    description: 'Status da resposta',
    enum: StatusResposta,
    example: StatusResposta.RASCUNHO,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusResposta)
  status?: StatusResposta;

  @ApiProperty({
    description: 'Dados da resposta em JSON',
    example: {
      nome_paciente: 'João Silva',
      idade: 35,
      sintomas: ['febre', 'tosse'],
      exame_solicitado: 'hemograma',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  dadosResposta?: any;

  @ApiProperty({
    description: 'Metadados da sessão',
    example: {
      userAgent: 'Mozilla/5.0...',
      ip: '192.168.1.1',
      startTime: '2025-01-01T10:00:00Z',
      duration: 300,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadadosSessao?: any;

  @ApiProperty({
    description: 'Se é uma resposta completa',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  respostaCompleta?: boolean;

  @ApiProperty({
    description: 'Se requer revisão',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  requerRevisao?: boolean;

  @ApiProperty({
    description: 'Se foi assinada digitalmente',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  assinadaDigitalmente?: boolean;

  @ApiProperty({
    description: 'Hash da assinatura digital',
    example: 'sha256:abc123...',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  hashAssinatura?: string;

  @ApiProperty({
    description: 'Certificado digital usado',
    example: 'CN=João Silva, OU=...',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  certificadoDigital?: string;

  @ApiProperty({
    description: 'Percentual de completude da resposta',
    example: 85.5,
    required: false,
  })
  @IsOptional()
  percentualCompleto?: number;

  @ApiProperty({
    description: 'Score/pontuação calculada',
    example: 75.2,
    required: false,
  })
  @IsOptional()
  score?: number;

  @ApiProperty({
    description: 'Tempo total de preenchimento em segundos',
    example: 480,
    required: false,
  })
  @IsOptional()
  tempoPreenchimento?: number;

  @ApiProperty({
    description: 'Número de revisões feitas',
    example: 2,
    required: false,
  })
  @IsOptional()
  numeroRevisoes?: number;

  @ApiProperty({
    description: 'IDs dos anexos associados',
    example: ['uuid-anexo-1', 'uuid-anexo-2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  anexosIds?: string[];

  @ApiProperty({
    description: 'Observações sobre a resposta',
    example: 'Paciente relatou sintomas há 3 dias',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({
    description: 'Observações da revisão',
    example: 'Verificar campo de alergias',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoesRevisao?: string;

  @ApiProperty({
    description: 'Data de vencimento da resposta',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsString()
  dataVencimento?: string;

  @ApiProperty({
    description: 'Se permite edição após finalização',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  permiteEdicaoAposFinal?: boolean;

  @ApiProperty({
    description: 'Motivo da última alteração',
    example: 'Correção de dados pessoais',
    required: false,
  })
  @IsOptional()
  @IsString()
  motivoAlteracao?: string;

  @ApiProperty({
    description: 'Configurações específicas da resposta',
    example: { notifications: true, autoSave: false },
    required: false,
  })
  @IsOptional()
  @IsObject()
  configuracoes?: any;

  @ApiProperty({
    description: 'Metadados adicionais',
    example: { source: 'mobile_app', version: '1.2.3' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadados?: any;
}
