import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Length,
  IsInt,
  Min,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePacienteDto {
  @ApiPropertyOptional({
    description:
      'Código interno do paciente (será gerado automaticamente se não fornecido)',
    example: 'PAC123456',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  codigo_interno?: string;

  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'João da Silva Santos',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  @Length(2, 255, { message: 'Nome deve ter entre 2 e 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  nome: string;

  @ApiPropertyOptional({
    description: 'Nome social do paciente',
    example: 'João Santos',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(2, 255, { message: 'Nome social deve ter entre 2 e 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  nome_social?: string;

  @ApiPropertyOptional({
    description: 'Se deve usar o nome social',
    enum: ['nao_se_aplica', 'sim', 'nao'],
    default: 'nao_se_aplica',
  })
  @IsOptional()
  @IsEnum(['nao_se_aplica', 'sim', 'nao'], {
    message: 'usar_nome_social deve ser: nao_se_aplica, sim ou nao',
  })
  usar_nome_social?: string = 'nao_se_aplica';

  @ApiProperty({
    description: 'Sexo do paciente',
    enum: ['M', 'F', 'O'],
    example: 'M',
  })
  @IsNotEmpty({ message: 'Sexo é obrigatório' })
  @IsEnum(['M', 'F', 'O'], {
    message: 'Sexo deve ser: M (Masculino), F (Feminino) ou O (Outro)',
  })
  sexo: string;

  @ApiProperty({
    description: 'Data de nascimento no formato YYYY-MM-DD',
    example: '1990-01-15',
  })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @IsDateString(
    {},
    { message: 'Data de nascimento deve estar no formato YYYY-MM-DD' },
  )
  data_nascimento: string;

  @ApiProperty({
    description: 'Nome completo da mãe',
    example: 'Maria da Silva Santos',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome da mãe é obrigatório' })
  @IsString()
  @Length(2, 255, { message: 'Nome da mãe deve ter entre 2 e 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  nome_mae: string;

  @ApiPropertyOptional({
    description: 'Número do prontuário',
    example: 'PRONT123456',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Prontuário deve ter até 50 caracteres' })
  prontuario?: string;

  @ApiProperty({
    description: 'RG do paciente',
    example: '12.345.678-9',
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'RG é obrigatório' })
  @IsString()
  @Length(1, 20, { message: 'RG deve ter até 20 caracteres' })
  rg: string;

  @ApiProperty({
    description: 'CPF do paciente (apenas números)',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
  })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cpf: string;

  @ApiProperty({
    description: 'Estado civil',
    example: 'Solteiro',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Estado civil é obrigatório' })
  @IsString()
  @Length(1, 50, { message: 'Estado civil deve ter até 50 caracteres' })
  estado_civil: string;

  @ApiProperty({
    description: 'E-mail do paciente',
    example: 'joao@email.com',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  @Length(5, 255, { message: 'E-mail deve ter entre 5 e 255 caracteres' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Telefone de contato principal',
    example: '11999999999',
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Contatos é obrigatório' })
  @IsString()
  @Length(10, 20, { message: 'Contatos deve ter entre 10 e 20 caracteres' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  contatos: string;

  @ApiPropertyOptional({
    description: 'WhatsApp (se diferente do contato principal)',
    example: '11888888888',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(10, 20, { message: 'WhatsApp deve ter entre 10 e 20 caracteres' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  whatsapp?: string;

  @ApiProperty({
    description: 'Profissão',
    example: 'Engenheiro Civil',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Profissão é obrigatória' })
  @IsString()
  @Length(1, 100, { message: 'Profissão deve ter até 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  profissao: string;

  @ApiPropertyOptional({
    description: 'Observações sobre o paciente',
    example: 'Paciente com alergia a dipirona',
  })
  @IsOptional()
  @IsString()
  observacao?: string;

  // Informações de convênio (opcionais)
  @ApiPropertyOptional({
    description: 'ID do convênio',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'convenio_id deve ser um número inteiro' })
  @Min(1, { message: 'convenio_id deve ser maior que 0' })
  convenio_id?: number;

  @ApiPropertyOptional({
    description: 'Nome do plano',
    example: 'Plus',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Plano deve ter até 100 caracteres' })
  plano?: string;

  @ApiPropertyOptional({
    description: 'Validade do convênio no formato YYYY-MM-DD',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Validade deve estar no formato YYYY-MM-DD' })
  validade?: string;

  @ApiPropertyOptional({
    description: 'Matrícula do convênio',
    example: '123456789012',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Matrícula deve ter até 50 caracteres' })
  matricula?: string;

  @ApiPropertyOptional({
    description: 'Nome do titular do convênio',
    example: 'João da Silva Santos',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(2, 255, {
    message: 'Nome do titular deve ter entre 2 e 255 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  nome_titular?: string;

  @ApiPropertyOptional({
    description: 'Número do cartão SUS',
    example: '123456789012345',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(15, 50, { message: 'Cartão SUS deve ter entre 15 e 50 caracteres' })
  cartao_sus?: string;

  // Endereço
  @ApiProperty({
    description: 'CEP (apenas números)',
    example: '01310100',
    minLength: 8,
    maxLength: 8,
  })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter exatamente 8 dígitos' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cep: string;

  @ApiPropertyOptional({
    description: 'Rua/Logradouro',
    example: 'Rua das Flores',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Rua deve ter até 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  rua?: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString()
  @Length(1, 20, { message: 'Número deve ter até 20 caracteres' })
  numero: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString()
  @Length(1, 100, { message: 'Bairro deve ter até 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  bairro: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereço',
    example: 'Apto 101',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Complemento deve ter até 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  complemento?: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  @Length(1, 100, { message: 'Cidade deve ter até 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  cidade: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
  })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString()
  @Length(2, 2, { message: 'Estado deve ter exatamente 2 caracteres' })
  @Transform(({ value }) => value?.toUpperCase())
  estado: string;

  @ApiProperty({
    description: 'ID da empresa/filial',
    example: 1,
  })
  @IsNotEmpty({ message: 'empresa_id é obrigatório' })
  @IsInt({ message: 'empresa_id deve ser um número inteiro' })
  @Min(1, { message: 'empresa_id deve ser maior que 0' })
  empresa_id: number;
}
