import { PartialType } from '@nestjs/swagger';
import { CreateConfiguracaoCampoDto } from './create-configuracao-campo.dto';

export class UpdateConfiguracaoCampoDto extends PartialType(
  CreateConfiguracaoCampoDto,
) {}
