import { PartialType } from '@nestjs/swagger';
import { CreateImobilizadoDto } from './create-imobilizado.dto';

export class UpdateImobilizadoDto extends PartialType(CreateImobilizadoDto) {}
