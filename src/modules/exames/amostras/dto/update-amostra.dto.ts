import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAmostraDto } from './create-amostra.dto';

export class UpdateAmostraDto extends PartialType(
  OmitType(CreateAmostraDto, ['codigoInterno'] as const),
) {}
