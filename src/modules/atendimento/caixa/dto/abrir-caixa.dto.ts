import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class AbrirCaixaDto {
  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'Unidade é obrigatória' })
  @IsUUID('4', { message: 'ID da unidade inválido' })
  unidadeId: string;

  @ApiProperty({
    description: 'Valor de abertura em espécie (troco inicial)',
    example: 500.0,
  })
  @IsNotEmpty({ message: 'Valor de abertura é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  aberturaEspecie: number;
}
