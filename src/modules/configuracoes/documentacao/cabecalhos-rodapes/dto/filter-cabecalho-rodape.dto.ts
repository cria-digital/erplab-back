import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoCabecalhoRodape } from '../entities/cabecalho-rodape.entity';
import { PaginationDto } from '../../../../infraestrutura/common/dto/pagination.dto';

export class FilterCabecalhoRodapeDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo: CABECALHO ou RODAPE',
    enum: TipoCabecalhoRodape,
  })
  @IsOptional()
  @IsEnum(TipoCabecalhoRodape, {
    message: 'Tipo deve ser CABECALHO ou RODAPE',
  })
  tipo?: TipoCabecalhoRodape;

  @ApiPropertyOptional({
    description: 'Termo de busca (nome do arquivo ou nome da unidade)',
    example: 'matriz',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  termo?: string;
}
