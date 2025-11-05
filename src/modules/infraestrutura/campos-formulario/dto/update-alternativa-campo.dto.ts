import { PartialType } from '@nestjs/swagger';
import { CreateAlternativaCampoDto } from './create-alternativa-campo.dto';

export class UpdateAlternativaCampoDto extends PartialType(
  CreateAlternativaCampoDto,
) {}
