import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

/**
 * DTO para atualizar dados pessoais do perfil do usuário logado
 */
export class UpdatePerfilDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Rafael Bittencourt',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  nomeCompleto?: string;

  @ApiProperty({
    description: 'CPF do usuário (apenas números)',
    example: '12345678901',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  cpf?: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'rafael@unilab.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Telefone fixo',
    example: '51999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  telefone?: string;

  @ApiProperty({
    description: 'Celular/WhatsApp',
    example: '51999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  celularWhatsapp?: string;

  @ApiProperty({
    description: 'Cargo ou função do usuário',
    example: 'Gerente de Projetos',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  cargoFuncao?: string;

  @ApiProperty({
    description: 'URL da foto do perfil',
    example: 'https://example.com/foto.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  fotoUrl?: string;
}
