import { PartialType } from '@nestjs/swagger';
import { CreateCampoMatrizDto } from './create-campo-matriz.dto';

export class UpdateCampoMatrizDto extends PartialType(CreateCampoMatrizDto) {}
