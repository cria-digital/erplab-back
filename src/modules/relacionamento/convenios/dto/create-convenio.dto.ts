import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para atualizar convênio (PATCH)
 * Usado apenas no PASSO 2 - atualizar dados específicos do convênio
 * A empresa já foi criada no PASSO 1
 */
export class CreateConvenioDto {
  // ==========================================
  // CAMPOS DO FIGMA - Seção: Identificação
  // ==========================================

  @ApiProperty({
    description: 'Nome do convênio',
    example: 'Unimed São Paulo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nome?: string;

  @ApiProperty({
    description: 'Registro ANS',
    example: '359017',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  registro_ans?: string;

  @ApiProperty({
    description: 'Matrícula do beneficiário',
    example: '123456789',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  matricula?: string | null;

  @ApiProperty({
    description: 'ID do tipo de convênio (FK → campos_formulario)',
    example: 'uuid',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  tipo_convenio_id?: string | null;

  @ApiProperty({
    description: 'ID da forma de liquidação (FK → campos_formulario)',
    example: 'uuid',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  forma_liquidacao_id?: string | null;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Valores
  // ==========================================

  @ApiProperty({
    description: 'Valor CH (consulta/hora)',
    example: 100.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  valor_ch?: number;

  @ApiProperty({
    description: 'Valor do filme',
    example: 50.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  valor_filme?: number;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: TISS
  // ==========================================

  @ApiProperty({
    description: 'Utiliza padrão TISS',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  tiss?: boolean;

  @ApiProperty({
    description: 'Versão TISS',
    example: '3.05.00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  versao_tiss?: string;

  @ApiProperty({
    description: 'Código na operadora (TISS)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo_operadora_tiss?: string;

  @ApiProperty({
    description: 'Código operadora (Autorização)',
    example: '654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo_operadora_autorizacao?: string;

  @ApiProperty({
    description: 'Código do prestador no convênio',
    example: '789456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo_prestador?: string;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Faturamento
  // ==========================================

  @ApiProperty({
    description: 'ID da forma de envio do faturamento (FK → campos_formulario)',
    example: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  envio_faturamento_id?: string;

  @ApiProperty({
    description: 'Faturar até o dia X do mês (1-31)',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  fatura_ate_dia?: number;

  @ApiProperty({
    description: 'Dia de vencimento do mês (1-31)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  dia_vencimento?: number;

  @ApiProperty({
    description: 'Data do contrato',
    example: '2023-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  data_contrato?: string;

  @ApiProperty({
    description: 'Data do último ajuste',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  data_ultimo_ajuste?: string;

  @ApiProperty({
    description: 'Instruções para faturamento',
    example: 'Enviar NF junto com a fatura',
    required: false,
  })
  @IsOptional()
  @IsString()
  instrucoes_faturamento?: string;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Tabelas
  // ==========================================

  @ApiProperty({
    description: 'ID da tabela de serviços (FK → campos_formulario)',
    example: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tabela_servico_id?: string;

  @ApiProperty({
    description: 'ID da tabela base (FK → campos_formulario)',
    example: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tabela_base_id?: string;

  @ApiProperty({
    description: 'ID da tabela de materiais (FK → campos_formulario)',
    example: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tabela_material_id?: string;

  @ApiProperty({
    description: 'Código CNES',
    example: '1234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  cnes?: string;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Outras Informações
  // ==========================================

  @ApiProperty({
    description: 'Possui co-participação',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  co_participacao?: boolean;

  @ApiProperty({
    description: 'Exige NF na fatura',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  nota_fiscal_exige_fatura?: boolean;

  @ApiProperty({
    description: 'Nome do contato',
    example: 'João Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contato?: string;

  @ApiProperty({
    description: 'Instruções gerais',
    example: 'Enviar resultados por email',
    required: false,
  })
  @IsOptional()
  @IsString()
  instrucoes?: string;

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Convênio prioritário',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes_gerais?: string;

  // ==========================================
  // INTEGRAÇÃO (Vínculo)
  // ==========================================

  @ApiProperty({
    description: 'ID da integração (FK → integracoes)',
    example: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  integracao_id?: string;

  // ==========================================
  // CONTROLE
  // ==========================================

  @ApiProperty({
    description: 'Convênio ativo?',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
