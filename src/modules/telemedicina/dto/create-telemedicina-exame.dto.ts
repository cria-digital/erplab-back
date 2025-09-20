import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  Length,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTelemedicinaExameDto {
  @ApiProperty({ description: 'ID da telemedicina' })
  @IsNotEmpty()
  @IsUUID()
  telemedicina_id: string;

  @ApiProperty({ description: 'ID do exame' })
  @IsNotEmpty()
  @IsUUID()
  exame_id: string;

  @ApiProperty({
    description: 'Código do exame na plataforma de telemedicina',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  codigo_telemedicina?: string;

  @ApiProperty({
    description: 'Nome do exame na plataforma de telemedicina',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  nome_exame_telemedicina?: string;

  @ApiProperty({
    description: 'Categoria na plataforma de telemedicina',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  categoria_telemedicina?: string;

  @ApiProperty({ description: 'Vínculo ativo', default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({ description: 'Permite upload de imagem', default: false })
  @IsOptional()
  @IsBoolean()
  permite_upload_imagem?: boolean;

  @ApiProperty({ description: 'Requer especialista', default: false })
  @IsOptional()
  @IsBoolean()
  requer_especialista?: boolean;

  @ApiProperty({
    description: 'Tempo padrão para laudo em horas',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  tempo_laudo_padrao?: number;

  @ApiProperty({ description: 'Valor do laudo', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_laudo?: number;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
