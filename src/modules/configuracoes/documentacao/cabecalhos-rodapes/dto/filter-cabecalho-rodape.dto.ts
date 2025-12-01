import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TipoCabecalhoRodape } from '../entities/cabecalho-rodape.entity';

export class FilterCabecalhoRodapeDto {
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
}
