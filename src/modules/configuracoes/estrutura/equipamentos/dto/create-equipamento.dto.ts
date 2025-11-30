import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateEquipamentoDto {
  @ApiProperty({
    description: 'Código interno único do equipamento',
    example: 'EQ001',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  codigoInterno: string;

  @ApiProperty({
    description: 'ID da unidade de saúde',
    example: 'uuid-da-unidade',
  })
  @IsUUID()
  unidadeId: string;

  @ApiProperty({
    description: 'Nome/descrição do equipamento',
    example: 'Raio-X',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiPropertyOptional({
    description: 'Numeração/número de série do equipamento',
    example: '1592653986625698526',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeracao?: string;

  @ApiPropertyOptional({
    description: 'ID da sala onde está localizado',
    example: 'uuid-da-sala',
  })
  @IsOptional()
  @IsUUID()
  salaId?: string;

  @ApiPropertyOptional({
    description: 'Se o registro está ativo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
