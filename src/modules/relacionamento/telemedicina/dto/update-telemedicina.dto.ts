import { PartialType } from '@nestjs/swagger';
import { CreateTelemedicinaDto } from './create-telemedicina.dto';

export class UpdateTelemedicinaDto extends PartialType(CreateTelemedicinaDto) {}
