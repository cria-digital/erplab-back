import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'SenhaAtual123!',
  })
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  @IsString()
  senhaAtual: string;

  @ApiProperty({
    description: 'Nova senha do usuário (mínimo 8 caracteres)',
    example: 'NovaSenhaSegura123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Nova senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
  })
  novaSenha: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'NovaSenhaSegura123!',
  })
  @IsNotEmpty({ message: 'Confirmação da senha é obrigatória' })
  @IsString()
  confirmacaoSenha: string;
}
