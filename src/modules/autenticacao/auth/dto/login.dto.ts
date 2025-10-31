import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MensagensValidacao } from '../../../../comum/mensagens/validacao.mensagens';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@example.com',
    required: true,
  })
  @IsEmail({}, { message: MensagensValidacao.EMAIL_INVALIDO })
  @IsNotEmpty({ message: MensagensValidacao.EMAIL_OBRIGATORIO })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaSegura123!',
    required: true,
    minLength: 6,
  })
  @IsString({ message: 'A senha deve ser um texto válido' })
  @IsNotEmpty({ message: MensagensValidacao.SENHA_OBRIGATORIA })
  @MinLength(6, { message: MensagensValidacao.SENHA_MINIMA(6) })
  password: string;
}
