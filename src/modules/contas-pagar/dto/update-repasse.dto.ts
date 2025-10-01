import { PartialType } from '@nestjs/swagger';
import { CreateRepasseDto } from './create-repasse.dto';

export class UpdateRepasseDto extends PartialType(CreateRepasseDto) {}
