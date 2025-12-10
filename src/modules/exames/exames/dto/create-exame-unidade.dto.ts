import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateExameUnidadeDto {
  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  unidade_id: string;

  @ApiProperty({
    description: 'Destino do exame para esta unidade',
    enum: ['interno', 'apoio', 'telemedicina'],
    default: 'interno',
  })
  @IsEnum(['interno', 'apoio', 'telemedicina'])
  @IsNotEmpty()
  destino: string;

  @ApiProperty({
    description: 'ID do laboratório de apoio (quando destino = apoio)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  laboratorio_apoio_id?: string;

  @ApiProperty({
    description: 'ID da telemedicina (quando destino = telemedicina)',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  telemedicina_id?: string;

  @ApiProperty({
    description: 'Se o vínculo está ativo',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
