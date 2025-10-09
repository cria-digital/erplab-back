import { PartialType } from '@nestjs/swagger';
import { CreateEtiquetaAmostraDto } from './create-etiqueta-amostra.dto';

export class UpdateEtiquetaAmostraDto extends PartialType(
  CreateEtiquetaAmostraDto,
) {}
