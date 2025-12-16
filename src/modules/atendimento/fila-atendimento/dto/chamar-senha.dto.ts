import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ChamarSenhaDto {
  @ApiProperty({
    description: 'ID da senha a ser chamada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID da senha é obrigatório' })
  @IsUUID('4', { message: 'ID da senha deve ser um UUID válido' })
  senhaId: string;

  @ApiPropertyOptional({
    description: 'Mesa de atendimento',
    example: 'Mesa 01',
  })
  @IsOptional()
  @IsString({ message: 'Mesa deve ser uma string' })
  mesa?: string;
}
