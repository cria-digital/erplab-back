import { PartialType } from '@nestjs/swagger';
import { CreateExameDto } from './create-exame.dto';

export class UpdateExameDto extends PartialType(CreateExameDto) {}
