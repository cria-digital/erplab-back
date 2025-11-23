import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTelemedicinaDto {
  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p',
    description: 'ID da integração',
  })
  @IsOptional()
  @IsUUID()
  integracaoId?: string;

  @ApiPropertyOptional({
    example: 'Plataforma de telemedicina completa',
    description: 'Observações gerais',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
