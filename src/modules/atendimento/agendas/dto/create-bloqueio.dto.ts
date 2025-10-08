import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBloqueioDto {
  @ApiProperty({
    example: '2024-03-15',
    description: 'Data de início do bloqueio',
  })
  @Type(() => Date)
  @IsDate()
  dataInicio: Date;

  @ApiProperty({ example: '14:00', description: 'Hora de início do bloqueio' })
  @IsString()
  horaInicio: string;

  @ApiPropertyOptional({
    example: '2024-03-15',
    description: 'Data de fim do bloqueio',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataFim?: Date;

  @ApiPropertyOptional({
    example: '18:00',
    description: 'Hora de fim do bloqueio',
  })
  @IsOptional()
  @IsString()
  horaFim?: string;

  @ApiPropertyOptional({ example: 'Feriado municipal' })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiPropertyOptional({ example: 'Manutenção do equipamento' })
  @IsOptional()
  @IsString()
  motivoBloqueio?: string;
}
