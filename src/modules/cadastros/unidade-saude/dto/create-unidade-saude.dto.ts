import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  Length,
  IsEnum,
  Matches,
  IsDateString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { DiaSemana } from '../entities/horario-atendimento.entity';

export class CreateHorarioAtendimentoDto {
  @ApiProperty({ enum: DiaSemana, description: 'Dia da semana' })
  @IsEnum(DiaSemana)
  diaSemana: DiaSemana;

  @ApiProperty({ example: '08:00', description: 'Horário de início (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário deve estar no formato HH:mm',
  })
  horarioInicio: string;

  @ApiProperty({ example: '18:00', description: 'Horário de fim (HH:mm)' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário deve estar no formato HH:mm',
  })
  horarioFim: string;

  @ApiPropertyOptional({
    example: '12:00',
    description: 'Início do intervalo (HH:mm)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário deve estar no formato HH:mm',
  })
  intervaloInicio?: string;

  @ApiPropertyOptional({
    example: '13:00',
    description: 'Fim do intervalo (HH:mm)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário deve estar no formato HH:mm',
  })
  intervaloFim?: string;

  @ApiProperty({ default: false, description: 'Indica se não há intervalo' })
  @IsBoolean()
  @IsOptional()
  semIntervalo?: boolean = false;
}

export class CreateContaBancariaUnidadeDto {
  @ApiProperty({
    example: 'uuid-do-banco',
    description: 'ID do banco',
  })
  @IsString()
  @IsNotEmpty()
  banco_id: string;

  @ApiProperty({ example: '1234', description: 'Número da agência' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  agencia: string;

  @ApiPropertyOptional({ example: '5', description: 'Dígito da agência' })
  @IsOptional()
  @IsString()
  @Length(1, 2)
  digito_agencia?: string;

  @ApiProperty({ example: '12345678', description: 'Número da conta' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  numero_conta: string;

  @ApiProperty({ example: '9', description: 'Dígito verificador da conta' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2)
  digito_conta: string;

  @ApiPropertyOptional({
    example: 'corrente',
    description: 'Tipo de conta',
    enum: ['corrente', 'poupanca', 'pagamento', 'salario', 'investimento'],
  })
  @IsOptional()
  @IsString()
  tipo_conta?: string = 'corrente';

  @ApiPropertyOptional({
    example: 'cnpj',
    description: 'Tipo de chave PIX',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  pix_tipo?: string;

  @ApiPropertyOptional({
    example: '12.345.678/0001-90',
    description: 'Chave PIX',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  pix_chave?: string;

  @ApiPropertyOptional({
    example: 1000.0,
    description: 'Saldo inicial da conta',
  })
  @IsOptional()
  @IsNumber()
  saldo_inicial?: number = 0;

  @ApiPropertyOptional({ description: 'Observações sobre a conta bancária' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  observacoes?: string;
}

export class CreateCnaeSecundarioDto {
  @ApiProperty({
    example: 'uuid-do-cnae',
    description: 'ID do CNAE secundário',
  })
  @IsString()
  @IsNotEmpty()
  cnaeId: string;
}

export class CreateUnidadeSaudeDto {
  // Informações Básicas
  @ApiProperty({
    example: 'Laboratório Central',
    description: 'Nome da unidade de saúde',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nomeUnidade: string;

  @ApiPropertyOptional({
    example: 'LAB001',
    description: 'Código interno da unidade',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  codigoInterno?: string;

  @ApiProperty({ example: '12345678000190', description: 'CNPJ da unidade' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj: string;

  @ApiProperty({ example: 'Laboratório ABC Ltda', description: 'Razão social' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  razaoSocial: string;

  @ApiProperty({ example: 'Lab ABC', description: 'Nome fantasia' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nomeFantasia: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Inscrição municipal',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  inscricaoMunicipal?: string;

  @ApiPropertyOptional({
    example: '789456123',
    description: 'Inscrição estadual',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  inscricaoEstadual?: string;

  @ApiPropertyOptional({ example: '1234567', description: 'Código CNES' })
  @IsOptional()
  @IsString()
  @Length(1, 15)
  cnes?: string;

  @ApiPropertyOptional({
    example: '(11) 98765-4321',
    description: 'Contatos da unidade',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  contatosUnidade?: string;

  @ApiPropertyOptional({
    example: 'contato@lab.com.br',
    description: 'E-mail da unidade',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '001',
    description: 'Código do serviço principal',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  codigoServicoPrincipal?: string;

  @ApiPropertyOptional({
    example: ['002', '003', '004'],
    description: 'Códigos dos serviços secundários',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Length(1, 50, { each: true })
  codigoServicoSecundario?: string[];

  @ApiPropertyOptional({
    example: 'uuid-do-cnae',
    description: 'ID do CNAE principal',
  })
  @IsOptional()
  @IsString()
  cnaePrincipalId?: string;

  // Endereço
  @ApiPropertyOptional({ example: '01234567', description: 'CEP' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos' })
  cep?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores', description: 'Logradouro' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  rua?: string;

  @ApiPropertyOptional({ example: '123', description: 'Número' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  numero?: string;

  @ApiPropertyOptional({ example: 'Centro', description: 'Bairro' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  bairro?: string;

  @ApiPropertyOptional({ example: 'Sala 10', description: 'Complemento' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  complemento?: string;

  @ApiPropertyOptional({ example: 'SP', description: 'Estado (UF)' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;

  @ApiPropertyOptional({ example: 'São Paulo', description: 'Cidade' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  cidade?: string;

  // Responsável
  @ApiPropertyOptional({
    example: 'Dr. João Silva',
    description: 'Nome do responsável',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  nomeResponsavel?: string;

  @ApiPropertyOptional({
    example: '(11) 98765-4321',
    description: 'Contato do responsável',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  contatoResponsavel?: string;

  @ApiPropertyOptional({
    example: 'responsavel@lab.com.br',
    description: 'E-mail do responsável',
  })
  @IsOptional()
  @IsEmail()
  emailResponsavel?: string;

  // Impostos
  @ApiPropertyOptional({
    example: 1.5,
    description: 'Percentual IRRF',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  irrfPercentual?: number;

  @ApiPropertyOptional({
    example: 0.65,
    description: 'Percentual PIS',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  pisPercentual?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Percentual COFINS',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  cofinsPercentual?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Percentual CSLL',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  csllPercentual?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Percentual ISS',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  issPercentual?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Percentual IBS',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ibsPercentual?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Percentual CBS',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  cbsPercentual?: number;

  // Retenções
  @ApiPropertyOptional({ default: false, description: 'Reter ISS' })
  @IsOptional()
  @IsBoolean()
  reterIss?: boolean = false;

  @ApiPropertyOptional({ default: false, description: 'Reter IR' })
  @IsOptional()
  @IsBoolean()
  reterIr?: boolean = false;

  @ApiPropertyOptional({ default: false, description: 'Reter PCC' })
  @IsOptional()
  @IsBoolean()
  reterPcc?: boolean = false;

  @ApiPropertyOptional({ default: false, description: 'Reter IBS' })
  @IsOptional()
  @IsBoolean()
  reterIbs?: boolean = false;

  @ApiPropertyOptional({ default: false, description: 'Reter CBS' })
  @IsOptional()
  @IsBoolean()
  reterCbs?: boolean = false;

  @ApiPropertyOptional({
    default: false,
    description: 'Optante pelo Simples Nacional',
  })
  @IsOptional()
  @IsBoolean()
  optanteSimplesNacional?: boolean = false;

  // Certificado Digital
  @ApiPropertyOptional({
    default: false,
    description: 'Certificado digital vinculado',
  })
  @IsOptional()
  @IsBoolean()
  certificadoDigitalVinculado?: boolean = false;

  @ApiPropertyOptional({
    description: 'Caminho do arquivo do certificado digital',
  })
  @IsOptional()
  @IsString()
  certificadoDigitalPath?: string;

  @ApiPropertyOptional({ description: 'Senha do certificado digital' })
  @IsOptional()
  @IsString()
  certificadoDigitalSenha?: string;

  @ApiPropertyOptional({
    description: 'Data de validade do certificado digital',
  })
  @IsOptional()
  @IsDateString()
  certificadoDigitalValidade?: Date;

  // Relacionamentos
  @ApiPropertyOptional({
    type: [CreateHorarioAtendimentoDto],
    description: 'Horários de atendimento',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHorarioAtendimentoDto)
  horariosAtendimento?: CreateHorarioAtendimentoDto[];

  @ApiPropertyOptional({
    type: [CreateContaBancariaUnidadeDto],
    description: 'Contas bancárias da unidade',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContaBancariaUnidadeDto)
  contas_bancarias?: CreateContaBancariaUnidadeDto[];

  @ApiPropertyOptional({
    type: [CreateCnaeSecundarioDto],
    description: 'CNAEs secundários',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCnaeSecundarioDto)
  cnaeSecundarios?: CreateCnaeSecundarioDto[];

  @ApiPropertyOptional({ default: true, description: 'Status ativo/inativo' })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean = true;
}
