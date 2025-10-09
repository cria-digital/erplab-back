import { PartialType } from '@nestjs/swagger';
import { CreateMatrizDto } from './create-matriz.dto';

export class UpdateMatrizDto extends PartialType(CreateMatrizDto) {}
