import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateExameLaboratorioApoioDto } from './create-exame-laboratorio-apoio.dto';

export class BatchCreateExameLaboratorioApoioDto {
  @ApiProperty({
    description: 'Lista de configurações de exames-laboratórios de apoio',
    type: [CreateExameLaboratorioApoioDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateExameLaboratorioApoioDto)
  items: CreateExameLaboratorioApoioDto[];
}
