import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../dto/pagination.dto';

export class SearchCnaeDto extends PaginationDto {
  @ApiProperty({ required: false, description: 'Filtrar por código CNAE' })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiProperty({ required: false, description: 'Filtrar por descrição' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ required: false, description: 'Filtrar por seção' })
  @IsOptional()
  @IsString()
  secao?: string;

  @ApiProperty({ required: false, description: 'Filtrar por divisão' })
  @IsOptional()
  @IsString()
  divisao?: string;

  @ApiProperty({ required: false, description: 'Filtrar por status ativo' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  ativo?: boolean;
}
