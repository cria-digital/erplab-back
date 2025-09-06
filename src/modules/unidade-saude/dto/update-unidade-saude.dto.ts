import { PartialType } from '@nestjs/swagger';
import { CreateUnidadeSaudeDto } from './create-unidade-saude.dto';

export class UpdateUnidadeSaudeDto extends PartialType(CreateUnidadeSaudeDto) {}