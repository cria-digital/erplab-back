import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateLaboratorioMetodoDto } from './create-laboratorio-metodo.dto';

export class UpdateLaboratorioMetodoDto extends PartialType(
  OmitType(CreateLaboratorioMetodoDto, ['laboratorioId', 'metodoId'] as const),
) {}
