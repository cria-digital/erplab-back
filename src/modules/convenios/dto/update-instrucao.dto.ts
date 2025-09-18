import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateInstrucaoDto } from './create-instrucao.dto';

export class UpdateInstrucaoDto extends PartialType(
  OmitType(CreateInstrucaoDto, ['convenio_id'] as const),
) {}
