import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  Length,
  Matches,
  IsUrl,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiPropertyOptional({
    description:
      'Código interno do usuário (será gerado automaticamente se não fornecido)',
    example: 'USR123456',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  codigoInterno?: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva Santos',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @IsString()
  @Length(2, 255, { message: 'Nome deve ter entre 2 e 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  nomeCompleto: string;

  @ApiPropertyOptional({
    description: 'CPF do usuário (apenas números)',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Telefone fixo',
    example: '1133334444',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(10, 20, { message: 'Telefone deve ter entre 10 e 20 caracteres' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular/WhatsApp',
    example: '11999998888',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(10, 20, { message: 'Celular deve ter entre 10 e 20 caracteres' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  celularWhatsapp?: string;

  @ApiPropertyOptional({
    description: 'Cargo ou função do usuário',
    example: 'Analista de Sistemas',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Cargo deve ter até 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  cargoFuncao?: string;

  @ApiPropertyOptional({
    description: 'CNPJ associado ao usuário (apenas números)',
    example: '12345678000190',
    minLength: 14,
    maxLength: 14,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter exatamente 14 dígitos' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cnpjAssociado?: string;

  @ApiPropertyOptional({
    description: 'Dados de admissão',
    example: 'Admitido em 01/01/2024 - CLT',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Dados de admissão devem ter até 255 caracteres' })
  dadosAdmissao?: string;

  @ApiPropertyOptional({
    description: 'URL da foto do usuário',
    example: 'https://example.com/photos/user123.jpg',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL da foto deve ser válida' })
  @Length(1, 500, { message: 'URL da foto deve ter até 500 caracteres' })
  fotoUrl?: string;

  // Dados de Acesso
  @ApiProperty({
    description: 'E-mail do usuário (usado para login)',
    example: 'joao.silva@example.com',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  @Length(5, 255, { message: 'E-mail deve ter entre 5 e 255 caracteres' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres)',
    example: 'SenhaSegura123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
  })
  senha: string;

  @ApiPropertyOptional({
    description: 'Se deve resetar a senha no próximo login',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  resetarSenha?: boolean = false;

  // Autenticação 2 fatores
  @ApiPropertyOptional({
    description: 'Se deve habilitar validação em 2 etapas',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  validacao2Etapas?: boolean = false;

  @ApiPropertyOptional({
    description: 'Método de validação em 2 etapas',
    enum: ['SMS', 'EMAIL', 'APP'],
    example: 'EMAIL',
  })
  @IsOptional()
  @IsEnum(['SMS', 'EMAIL', 'APP'], {
    message: 'Método de validação deve ser: SMS, EMAIL ou APP',
  })
  metodoValidacao?: string;

  @ApiPropertyOptional({
    description: 'Pergunta de recuperação de senha',
    example: 'Qual o nome do seu primeiro animal de estimação?',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Pergunta deve ter até 255 caracteres' })
  perguntaRecuperacao?: string;

  @ApiPropertyOptional({
    description: 'Resposta da pergunta de recuperação',
    example: 'Rex',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Resposta deve ter até 255 caracteres' })
  respostaRecuperacao?: string;

  @ApiPropertyOptional({
    description: 'Se o usuário está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean = true;

  // Unidades associadas
  @ApiPropertyOptional({
    description: 'IDs das unidades de saúde associadas ao usuário',
    example: ['uuid-unidade-1', 'uuid-unidade-2'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  unidadesIds?: string[];

  // Permissões
  @ApiPropertyOptional({
    description: 'IDs das permissões do usuário',
    example: ['uuid-permissao-1', 'uuid-permissao-2'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  permissoesIds?: string[];
}
