import { PartialType } from '@nestjs/swagger';
import { CreateRespostaFormularioDto } from './create-resposta-formulario.dto';

export class UpdateRespostaFormularioDto extends PartialType(
  CreateRespostaFormularioDto,
) {}
