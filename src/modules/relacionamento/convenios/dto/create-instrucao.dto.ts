import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
  Length,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CategoriaInstrucao,
  TipoProcedimentoInstrucao,
  StatusInstrucao,
  PrioridadeInstrucao,
} from '../entities/instrucao.entity';

export class CreateInstrucaoDto {
  @ApiProperty({ description: 'ID do convênio' })
  @IsNotEmpty()
  @IsUUID()
  convenio_id: string;

  @ApiProperty({ description: 'Código da instrução', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo: string;

  @ApiProperty({
    enum: CategoriaInstrucao,
    description: 'Categoria da instrução',
  })
  @IsNotEmpty()
  @IsEnum(CategoriaInstrucao)
  categoria: CategoriaInstrucao;

  @ApiProperty({
    enum: TipoProcedimentoInstrucao,
    description: 'Tipo de procedimento',
    default: TipoProcedimentoInstrucao.TODOS,
  })
  @IsOptional()
  @IsEnum(TipoProcedimentoInstrucao)
  tipo_procedimento?: TipoProcedimentoInstrucao;

  @ApiProperty({ description: 'Título da instrução', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  titulo: string;

  @ApiProperty({ description: 'Descrição detalhada da instrução' })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'Prazo de resposta em dias', required: false })
  @IsOptional()
  @IsNumber()
  prazo_resposta_dias?: number;

  @ApiProperty({ description: 'Prazo de resposta em horas', required: false })
  @IsOptional()
  @IsNumber()
  prazo_resposta_horas?: number;

  @ApiProperty({ description: 'Data de início da vigência' })
  @IsNotEmpty()
  @IsDateString()
  vigencia_inicio: Date;

  @ApiProperty({ description: 'Data de fim da vigência', required: false })
  @IsOptional()
  @IsDateString()
  vigencia_fim?: Date;

  @ApiProperty({
    enum: StatusInstrucao,
    description: 'Status da instrução',
    default: StatusInstrucao.ATIVA,
  })
  @IsOptional()
  @IsEnum(StatusInstrucao)
  status?: StatusInstrucao;

  @ApiProperty({
    enum: PrioridadeInstrucao,
    description: 'Prioridade da instrução',
    default: PrioridadeInstrucao.MEDIA,
  })
  @IsOptional()
  @IsEnum(PrioridadeInstrucao)
  prioridade?: PrioridadeInstrucao;

  @ApiProperty({ description: 'Setor responsável', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  setor_responsavel?: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  contato_telefone?: string;

  @ApiProperty({ description: 'Email de contato', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  contato_email?: string;

  @ApiProperty({
    description: 'Lista de documentos necessários',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentos_necessarios?: string[];

  @ApiProperty({ description: 'Anexos', type: [Object], required: false })
  @IsOptional()
  @IsArray()
  anexos?: any[];

  @ApiProperty({ description: 'Links úteis', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  links_uteis?: string[];

  @ApiProperty({
    description: 'Tags para busca',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Observações internas', required: false })
  @IsOptional()
  @IsString()
  observacoes_internas?: string;

  @ApiProperty({ description: 'Criado por', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  created_by?: string;
}
