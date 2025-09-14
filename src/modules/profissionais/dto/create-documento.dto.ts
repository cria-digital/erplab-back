import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import {
  TipoDocumentoProfissionalEnum,
  StatusDocumentoEnum,
} from '../enums/profissionais.enum';

export class CreateDocumentoDto {
  @ApiProperty({ enum: TipoDocumentoProfissionalEnum })
  @IsEnum(TipoDocumentoProfissionalEnum)
  tipo: TipoDocumentoProfissionalEnum;

  @ApiPropertyOptional({ example: 'url-do-arquivo.pdf' })
  @IsOptional()
  @IsString()
  arquivo?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validade?: Date;

  @ApiPropertyOptional({
    enum: StatusDocumentoEnum,
    default: StatusDocumentoEnum.PENDENTE,
  })
  @IsOptional()
  @IsEnum(StatusDocumentoEnum)
  status?: StatusDocumentoEnum;

  @ApiPropertyOptional({ example: 'Documento em análise' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
