import { PartialType } from '@nestjs/swagger';
import { CreateTipoExameDto } from './create-tipo-exame.dto';

export class UpdateTipoExameDto extends PartialType(CreateTipoExameDto) {}
