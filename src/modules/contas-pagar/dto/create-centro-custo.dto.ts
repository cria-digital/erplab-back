import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  Length,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCentroCustoDto {
  @ApiProperty({ description: 'Código do centro de custo', example: 'CC001' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  codigo: string;

  @ApiProperty({
    description: 'Nome do centro de custo',
    example: 'Administrativo',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome: string;

  @ApiProperty({ description: 'Descrição', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'ID da unidade', required: false })
  @IsOptional()
  @IsUUID()
  unidadeId?: string;

  @ApiProperty({ description: 'Status ativo', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
