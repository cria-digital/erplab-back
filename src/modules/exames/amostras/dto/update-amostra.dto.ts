import { PartialType } from '@nestjs/swagger';
import { CreateAmostraDto } from './create-amostra.dto';

export class UpdateAmostraDto extends PartialType(CreateAmostraDto) {}
