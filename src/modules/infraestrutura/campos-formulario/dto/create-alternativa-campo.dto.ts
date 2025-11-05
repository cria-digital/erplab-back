import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateAlternativaCampoDto {
  @ApiProperty({
    description: 'Texto da alternativa',
    example: 'MG/DL',
  })
  @IsString()
  @MaxLength(255)
  textoAlternativa: string;

  @ApiProperty({
    description: 'Ordem de exibição',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  ordem?: number;
}
