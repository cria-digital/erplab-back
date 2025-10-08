import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EntidadeTipoFiltro, StatusRepasse } from '../enums/contas-pagar.enum';

export class CreateRepasseFiltroDto {
  @ApiProperty({
    enum: EntidadeTipoFiltro,
    description: 'Tipo da entidade do filtro',
    example: EntidadeTipoFiltro.MEDICO,
  })
  @IsEnum(EntidadeTipoFiltro)
  entidadeTipo: EntidadeTipoFiltro;

  @ApiProperty({ description: 'ID da entidade' })
  @IsUUID()
  entidadeId: string;
}

export class CreateRepasseDto {
  @ApiProperty({ description: 'Data de início', example: '2025-09-01' })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ description: 'Data de fim', example: '2025-09-30' })
  @IsDateString()
  dataFim: string;

  @ApiProperty({ description: 'ID da unidade' })
  @IsUUID()
  unidadeId: string;

  @ApiProperty({ description: 'Descrição do repasse', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    enum: StatusRepasse,
    description: 'Status do repasse',
    default: StatusRepasse.ATIVO,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusRepasse)
  status?: StatusRepasse;

  @ApiProperty({
    type: [CreateRepasseFiltroDto],
    description: 'Filtros do repasse',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRepasseFiltroDto)
  filtros: CreateRepasseFiltroDto[];
}
