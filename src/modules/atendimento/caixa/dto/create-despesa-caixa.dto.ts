import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDespesaCaixaDto {
  @ApiProperty({
    description: 'ID do caixa',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'ID do caixa é obrigatório' })
  @IsUUID('4', { message: 'ID do caixa inválido' })
  caixaId: string;

  @ApiProperty({
    description: 'Nome da despesa',
    example: 'Material de escritório',
  })
  @IsNotEmpty({ message: 'Nome da despesa é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Valor da despesa',
    example: 50.0,
  })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  valor: number;

  @ApiProperty({
    description: 'Tipo de despesa',
    example: 'Material',
  })
  @IsNotEmpty({ message: 'Tipo de despesa é obrigatório' })
  @IsString({ message: 'Tipo deve ser uma string' })
  @MaxLength(100, { message: 'Tipo deve ter no máximo 100 caracteres' })
  tipoDespesa: string;

  @ApiPropertyOptional({
    description: 'Caminho do comprovante anexado',
    example: '/uploads/comprovantes/despesa-123.pdf',
  })
  @IsOptional()
  @IsString({ message: 'Comprovante deve ser uma string' })
  @MaxLength(500, { message: 'Caminho do comprovante muito longo' })
  comprovante?: string;
}
