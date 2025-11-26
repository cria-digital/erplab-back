import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateLaboratorioAmostraDto } from './create-laboratorio-amostra.dto';

export class UpdateLaboratorioAmostraDto extends PartialType(
  OmitType(CreateLaboratorioAmostraDto, [
    'laboratorioId',
    'amostraId',
  ] as const),
) {}
