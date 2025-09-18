import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  Length,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  TipoConvenio,
  Modalidade,
  FormaPagamento,
} from '../entities/convenio.entity';

export class CreateConvenioDto {
  @ApiProperty({ description: 'Código do convênio', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo: string;

  @ApiProperty({ description: 'Razão social do convênio', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  razao_social: string;

  @ApiProperty({ description: 'Nome fantasia do convênio', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome_fantasia: string;

  @ApiProperty({
    description: 'CNPJ do convênio',
    minLength: 14,
    maxLength: 14,
  })
  @IsNotEmpty()
  @IsString()
  @Length(14, 14)
  cnpj: string;

  @ApiProperty({ description: 'Inscrição estadual', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  inscricao_estadual?: string;

  @ApiProperty({ description: 'Inscrição municipal', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  inscricao_municipal?: string;

  @ApiProperty({ description: 'Registro ANS', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  registro_ans?: string;

  @ApiProperty({ enum: TipoConvenio, description: 'Tipo do convênio' })
  @IsNotEmpty()
  @IsEnum(TipoConvenio)
  tipo_convenio: TipoConvenio;

  @ApiProperty({ enum: Modalidade, description: 'Modalidade do convênio' })
  @IsNotEmpty()
  @IsEnum(Modalidade)
  modalidade: Modalidade;

  @ApiProperty({ description: 'Endereço' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  endereco: string;

  @ApiProperty({ description: 'Número' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  numero: string;

  @ApiProperty({ description: 'Complemento', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  complemento?: string;

  @ApiProperty({ description: 'Bairro' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  bairro: string;

  @ApiProperty({ description: 'Cidade' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  cidade: string;

  @ApiProperty({ description: 'UF', minLength: 2, maxLength: 2 })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  uf: string;

  @ApiProperty({ description: 'CEP', minLength: 8, maxLength: 8 })
  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  cep: string;

  @ApiProperty({ description: 'Telefone principal' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  telefone_principal: string;

  @ApiProperty({ description: 'Telefone secundário', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefone_secundario?: string;

  @ApiProperty({ description: 'Email principal' })
  @IsNotEmpty()
  @IsEmail()
  email_principal: string;

  @ApiProperty({ description: 'Email de faturamento', required: false })
  @IsOptional()
  @IsEmail()
  email_faturamento?: string;

  @ApiProperty({ description: 'Website', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  website?: string;

  @ApiProperty({ description: 'Prazo de pagamento em dias', default: 30 })
  @IsOptional()
  @IsNumber()
  prazo_pagamento?: number;

  @ApiProperty({ description: 'Dia de vencimento', required: false })
  @IsOptional()
  @IsNumber()
  dia_vencimento?: number;

  @ApiProperty({ enum: FormaPagamento, description: 'Forma de pagamento' })
  @IsNotEmpty()
  @IsEnum(FormaPagamento)
  forma_pagamento: FormaPagamento;

  @ApiProperty({ description: 'Banco', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  banco?: string;

  @ApiProperty({ description: 'Agência', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  agencia?: string;

  @ApiProperty({ description: 'Conta', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  conta?: string;

  @ApiProperty({ description: 'Chave PIX', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  pix_key?: string;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ description: 'Status ativo', default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({ description: 'Data do contrato', required: false })
  @IsOptional()
  @IsDateString()
  data_contrato?: Date;

  @ApiProperty({ description: 'Data de início da vigência', required: false })
  @IsOptional()
  @IsDateString()
  data_vigencia_inicio?: Date;

  @ApiProperty({ description: 'Data de fim da vigência', required: false })
  @IsOptional()
  @IsDateString()
  data_vigencia_fim?: Date;
}
