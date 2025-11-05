import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';
import { NomeCampoFormulario } from '../entities/campo-formulario.entity';

export class CreateCampoFormularioDto {
  @ApiProperty({
    description: 'Nome do campo (enum predefinido)',
    enum: NomeCampoFormulario,
    example: NomeCampoFormulario.UNIDADE_MEDIDA,
  })
  @IsEnum(NomeCampoFormulario, {
    message: 'Nome do campo inválido',
  })
  nomeCampo: NomeCampoFormulario;

  @ApiProperty({
    description: 'Descrição do campo e seu uso',
    example: 'Usado nos formulários de exames',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descricao?: string;
}
