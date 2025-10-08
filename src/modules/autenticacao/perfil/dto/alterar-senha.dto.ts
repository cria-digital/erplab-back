import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

/**
 * DTO para alteração de senha do usuário logado
 * Validações baseadas nos requisitos do PDF (chunk_025, p500)
 */
export class AlterarSenhaDto {
  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'SenhaAtual123!',
  })
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  @IsString()
  senhaAtual: string;

  @ApiProperty({
    description:
      'Nova senha (mín. 8 caracteres, 1 maiúscula, 1 número, 1 especial)',
    example: 'NovaSenha456@',
  })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/[A-Z]/, {
    message: 'Senha deve conter pelo menos 1 letra maiúscula',
  })
  @Matches(/[0-9]/, {
    message: 'Senha deve conter pelo menos 1 número',
  })
  @Matches(/[*\-.,@#$%&=+!]/, {
    message: 'Senha deve conter pelo menos 1 caractere especial (*-.,@#$%&=+!)',
  })
  novaSenha: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'NovaSenha456@',
  })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @IsString()
  confirmarNovaSenha: string;
}
