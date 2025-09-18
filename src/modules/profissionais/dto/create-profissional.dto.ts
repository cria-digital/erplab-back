import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsDate,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  Matches,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PronomeEnum,
  SexoEnum,
  TipoContratacaoEnum,
  TipoProfissionalEnum,
  EstadoConselhoEnum,
} from '../enums/profissionais.enum';
import { EstadoEnum } from '../../../comum/entities/endereco.entity';

class CreateEnderecoDto {
  @ApiProperty({ example: '01310-100' })
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido' })
  cep: string;

  @ApiProperty({ example: 'Avenida Paulista' })
  @IsString()
  rua: string;

  @ApiProperty({ example: '1578' })
  @IsString()
  numero: string;

  @ApiProperty({ example: 'Bela Vista' })
  @IsString()
  bairro: string;

  @ApiPropertyOptional({ example: 'Conjunto 2' })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  cidade: string;

  @ApiProperty({ enum: EstadoEnum, example: 'SP' })
  @IsEnum(EstadoEnum)
  estado: EstadoEnum;
}

export class CreateProfissionalDto {
  @ApiProperty({ enum: PronomeEnum, example: PronomeEnum.DR })
  @IsEnum(PronomeEnum)
  pronomesPessoal: PronomeEnum;

  @ApiProperty({ example: 'João da Silva Santos' })
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido' })
  cpf: string;

  @ApiProperty({ example: '1985-03-15' })
  @Type(() => Date)
  @IsDate()
  dataNascimento: Date;

  @ApiProperty({ enum: SexoEnum })
  @IsEnum(SexoEnum)
  sexo: SexoEnum;

  @ApiProperty({ example: '(11) 98765-4321' })
  @IsString()
  @Matches(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, { message: 'Celular inválido' })
  celular: string;

  @ApiProperty({ example: 'joao.silva@exemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: TipoContratacaoEnum })
  @IsEnum(TipoContratacaoEnum)
  tipoContratacao: TipoContratacaoEnum;

  @ApiProperty({ example: 'MÉDICO' })
  @IsString()
  profissao: string;

  @ApiProperty({ example: '19011' })
  @IsString()
  @IsNotEmpty()
  codigoInterno: string;

  @ApiProperty({ enum: TipoProfissionalEnum })
  @IsEnum(TipoProfissionalEnum)
  tipoProfissional: TipoProfissionalEnum;

  @ApiProperty({ example: 'CRM', description: 'Nome do conselho profissional' })
  @IsString()
  nomeConselho: string;

  @ApiProperty({ example: '37308' })
  @IsString()
  numeroConselho: string;

  @ApiProperty({ enum: EstadoConselhoEnum })
  @IsEnum(EstadoConselhoEnum)
  estadoConselho: EstadoConselhoEnum;

  @ApiProperty({ example: '225320', description: 'Código CBO da profissão' })
  @IsString()
  codigoCBO: string;

  @ApiPropertyOptional({
    example: '1257',
    description: 'Registro de Qualificação de Especialista',
  })
  @IsOptional()
  @IsString()
  rqe?: string;

  @ApiPropertyOptional({ example: 'CARDIOLOGIA' })
  @IsOptional()
  @IsString()
  especialidadePrincipal?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  possuiAssinaturaDigital: boolean;

  @ApiPropertyOptional({ type: CreateEnderecoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  endereco?: CreateEnderecoDto;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'IDs das agendas vinculadas',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  agendasIds?: string[];
}
