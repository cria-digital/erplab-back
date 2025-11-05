import { PartialType } from '@nestjs/swagger';
import { CreateCampoFormularioDto } from './create-campo-formulario.dto';

export class UpdateCampoFormularioDto extends PartialType(
  CreateCampoFormularioDto,
) {}
