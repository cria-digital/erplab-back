import { PartialType } from '@nestjs/swagger';
import { CreateConvenioExamesDto } from './create-convenio-exames.dto';

export class UpdateConvenioExamesDto extends PartialType(
  CreateConvenioExamesDto,
) {}
