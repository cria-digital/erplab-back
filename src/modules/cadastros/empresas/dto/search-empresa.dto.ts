import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../infraestrutura/common/dto/pagination.dto';
import { TipoEmpresaEnum } from '../enums/empresas.enum';

export class SearchEmpresaDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      'Termo de busca (pesquisa em razão social, nome fantasia e CNPJ)',
    example: 'laboratório',
  })
  @IsOptional()
  @IsString()
  termo?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de empresa',
    enum: TipoEmpresaEnum,
    example: TipoEmpresaEnum.LABORATORIO_APOIO,
  })
  @IsOptional()
  @IsEnum(TipoEmpresaEnum)
  tipoEmpresa?: TipoEmpresaEnum;

  @ApiPropertyOptional({
    description: 'Filtrar por status ativo/inativo',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  ativo?: boolean;
}
