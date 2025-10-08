import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['senha', 'email'] as const),
) {
  @ApiPropertyOptional({
    description: 'Nova senha do usuário (mínimo 8 caracteres)',
    example: 'NovaSenhaSegura123!',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
  })
  senha?: string;
}
