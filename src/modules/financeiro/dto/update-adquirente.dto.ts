import { PartialType } from '@nestjs/swagger';
import { CreateAdquirenteDto } from './create-adquirente.dto';

export class UpdateAdquirenteDto extends PartialType(CreateAdquirenteDto) {}
