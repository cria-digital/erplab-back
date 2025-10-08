import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreatePrestadorServicoDto } from './create-prestador-servico.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateEmpresaDto } from '../../../cadastros/empresas/dto/update-empresa.dto';

export class UpdatePrestadorServicoDto extends PartialType(
  OmitType(CreatePrestadorServicoDto, ['empresa', 'codigoPrestador'] as const),
) {
  @ApiProperty({
    description: 'Dados da empresa para atualizar',
    type: UpdateEmpresaDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => UpdateEmpresaDto)
  @IsOptional()
  empresa?: UpdateEmpresaDto;
}
