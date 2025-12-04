import { PartialType } from '@nestjs/swagger';
import { CreateLaboratorioApoioDto } from './create-laboratorio-apoio.dto';

export class UpdateLaboratorioApoioDto extends PartialType(
  CreateLaboratorioApoioDto,
) {}
