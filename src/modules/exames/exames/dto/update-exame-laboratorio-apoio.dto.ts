import { PartialType } from '@nestjs/swagger';
import { CreateExameLaboratorioApoioDto } from './create-exame-laboratorio-apoio.dto';

export class UpdateExameLaboratorioApoioDto extends PartialType(
  CreateExameLaboratorioApoioDto,
) {}
