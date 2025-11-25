import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class VincularIntegracaoDto {
  @ApiProperty({
    description: 'ID do convênio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  convenioId: string;

  @ApiProperty({
    description: 'ID da integração (null para desvincular)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  integracaoId: string | null;
}

export class VincularIntegracaoLoteDto {
  @ApiProperty({
    description: 'Lista de vínculos convênio-integração',
    type: [VincularIntegracaoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VincularIntegracaoDto)
  vinculos: VincularIntegracaoDto[];
}
