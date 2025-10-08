import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMetodoDto } from './create-metodo.dto';

export class UpdateMetodoDto extends PartialType(
  OmitType(CreateMetodoDto, ['codigoInterno'] as const),
) {}
