import { PartialType } from '@nestjs/swagger';
import { CreateTelemedicinaExameDto } from './create-telemedicina-exame.dto';

export class UpdateTelemedicinaExameDto extends PartialType(
  CreateTelemedicinaExameDto,
) {}
