import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLaboratorioAmostraDto {
  @ApiProperty({
    description: 'ID do laboratório',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty({ message: 'ID do laboratório é obrigatório' })
  @IsUUID('4', { message: 'ID do laboratório deve ser um UUID válido' })
  laboratorioId: string;

  @ApiProperty({
    description: 'ID da amostra',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty({ message: 'ID da amostra é obrigatório' })
  @IsUUID('4', { message: 'ID da amostra deve ser um UUID válido' })
  amostraId: string;

  @ApiPropertyOptional({
    description: 'Indica se o laboratório está validado para usar esta amostra',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Validado deve ser um booleano' })
  validado?: boolean;

  @ApiPropertyOptional({
    description: 'Data de validação do laboratório para a amostra',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de validação deve ser uma data válida' })
  dataValidacao?: Date;

  @ApiPropertyOptional({
    description: 'Observações sobre o vínculo laboratório-amostra',
    example: 'Laboratório certificado para este tipo de amostra desde 2023',
  })
  @IsOptional()
  @IsString({ message: 'Observações deve ser uma string' })
  observacoes?: string;
}
