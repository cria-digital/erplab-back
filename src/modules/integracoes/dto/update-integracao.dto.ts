import { PartialType } from '@nestjs/swagger';
import { CreateIntegracaoDto } from './create-integracao.dto';

export class UpdateIntegracaoDto extends PartialType(CreateIntegracaoDto) {}
