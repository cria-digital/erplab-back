import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePlanoDto } from './create-plano.dto';

export class UpdatePlanoDto extends PartialType(
  OmitType(CreatePlanoDto, ['convenio_id'] as const),
) {}
