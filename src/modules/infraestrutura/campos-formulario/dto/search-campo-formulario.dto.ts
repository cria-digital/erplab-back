import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { NomeCampoFormulario } from '../entities/campo-formulario.entity';

export class SearchCampoFormularioDto {
  @ApiPropertyOptional({
    description: 'Termo de busca (pesquisa na descrição do campo)',
    example: 'medida',
  })
  @IsOptional()
  @IsString()
  termo?: string;

  @ApiPropertyOptional({
    description: 'Nome específico do campo',
    enum: NomeCampoFormulario,
    example: NomeCampoFormulario.UNIDADE_MEDIDA,
  })
  @IsOptional()
  @IsEnum(NomeCampoFormulario)
  nomeCampo?: NomeCampoFormulario;

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
