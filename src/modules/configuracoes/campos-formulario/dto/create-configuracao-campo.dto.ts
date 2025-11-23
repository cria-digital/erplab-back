import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { TipoEntidadeEnum } from '../entities/configuracao-campo-formulario.entity';

export class CreateConfiguracaoCampoDto {
  @ApiProperty({
    enum: TipoEntidadeEnum,
    description: 'Tipo da entidade',
    example: 'convenio',
  })
  @IsEnum(TipoEntidadeEnum)
  @IsNotEmpty()
  entidadeTipo: TipoEntidadeEnum;

  @ApiProperty({
    description: 'ID da entidade',
    example: 'uuid-da-entidade',
  })
  @IsUUID()
  @IsNotEmpty()
  entidadeId: string;

  @ApiProperty({
    description: 'Tipo do formulário',
    example: 'cadastro_paciente',
  })
  @IsString()
  @IsNotEmpty()
  tipoFormulario: string;

  @ApiProperty({
    description: 'Nome do campo',
    example: 'cpf',
  })
  @IsString()
  @IsNotEmpty()
  nomeCampo: string;

  @ApiProperty({
    description: 'Se o campo é obrigatório',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  obrigatorio?: boolean;
}
