import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { TipoSenha } from '../entities/senha-atendimento.entity';

export class CriarSenhaDto {
  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Unidade é obrigatória' })
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId: string;

  @ApiProperty({
    description: 'Tipo da senha',
    enum: TipoSenha,
    example: TipoSenha.GERAL,
  })
  @IsNotEmpty({ message: 'Tipo da senha é obrigatório' })
  @IsEnum(TipoSenha, { message: 'Tipo deve ser prioridade ou geral' })
  tipo: TipoSenha;

  @ApiPropertyOptional({
    description: 'CPF do paciente para identificação (opcional)',
    example: '12345678901',
  })
  @IsOptional()
  cpf?: string;
}
