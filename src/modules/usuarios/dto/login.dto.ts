import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaSegura123!',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  senha: string;

  @ApiPropertyOptional({
    description: 'Código de validação 2FA (se habilitado)',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  codigo2FA?: string;
}
