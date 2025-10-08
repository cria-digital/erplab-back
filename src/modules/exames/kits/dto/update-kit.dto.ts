import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateKitDto } from './create-kit.dto';

export class UpdateKitDto extends PartialType(
  OmitType(CreateKitDto, ['codigoInterno', 'empresaId'] as const),
) {}
