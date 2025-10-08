import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePrestadorServicoCategoriaDto } from './create-prestador-servico-categoria.dto';

export class UpdatePrestadorServicoCategoriaDto extends PartialType(
  OmitType(CreatePrestadorServicoCategoriaDto, [
    'prestadorServicoId',
    'tipoServico',
  ] as const),
) {}
