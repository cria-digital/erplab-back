import { PartialType } from '@nestjs/swagger';
import { CreateCnaeDto } from './create-cnae.dto';

export class UpdateCnaeDto extends PartialType(CreateCnaeDto) {}
