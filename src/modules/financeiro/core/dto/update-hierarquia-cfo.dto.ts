import { PartialType } from '@nestjs/swagger';
import {
  CreateHierarquiaCfoDto,
  ClasseCfoDto,
} from './create-hierarquia-cfo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class UpdateClasseCfoDto extends PartialType(ClasseCfoDto) {
  @ApiProperty({
    description: 'ID da classe (para atualização)',
    example: 'uuid',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  id?: string;
}

export class UpdateHierarquiaCfoDto extends PartialType(
  CreateHierarquiaCfoDto,
) {}
