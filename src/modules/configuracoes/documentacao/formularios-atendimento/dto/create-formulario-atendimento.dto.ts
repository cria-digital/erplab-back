import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFormularioAtendimentoDto {
  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'Unidade é obrigatória' })
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId: string;

  @ApiPropertyOptional({
    description: 'Observação sobre o formulário',
    example: 'Formulário de consentimento para exame de sangue',
  })
  @IsOptional()
  @IsString({ message: 'Observação deve ser uma string' })
  observacao?: string;
}
