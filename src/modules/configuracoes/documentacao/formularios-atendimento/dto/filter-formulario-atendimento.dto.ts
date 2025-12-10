import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../../infraestrutura/common/dto/pagination.dto';

export class FilterFormularioAtendimentoDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por unidade de saúde',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId?: string;

  @ApiPropertyOptional({
    description:
      'Termo de busca (nome do documento, observação ou nome da unidade)',
    example: 'consentimento',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  termo?: string;
}
