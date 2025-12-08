import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  IsUUID,
  IsString,
  IsBoolean,
} from 'class-validator';
import {
  TipoEntidadeEnum,
  TipoFormularioEnum,
} from '../entities/configuracao-campo-formulario.entity';

export class CampoConfiguracaoDto {
  @ApiProperty({
    description: 'Nome do campo no formulário',
    example: 'cpf',
  })
  @IsString()
  nomeCampo: string;

  @ApiProperty({
    description: 'Se o campo é obrigatório',
    example: true,
  })
  @IsBoolean()
  obrigatorio: boolean;
}

export class BatchConfigurarCamposDto {
  @ApiProperty({
    description: 'Tipo da entidade',
    enum: TipoEntidadeEnum,
    example: TipoEntidadeEnum.CONVENIO,
  })
  @IsEnum(TipoEntidadeEnum)
  entidadeTipo: TipoEntidadeEnum;

  @ApiProperty({
    description: 'ID da entidade (convenio_id, laboratorio_id, etc)',
    example: 'uuid-da-entidade',
  })
  @IsUUID()
  entidadeId: string;

  @ApiProperty({
    description: 'Tipo do formulário',
    enum: TipoFormularioEnum,
    example: TipoFormularioEnum.CADASTRO_PACIENTE,
  })
  @IsEnum(TipoFormularioEnum)
  tipoFormulario: TipoFormularioEnum;

  @ApiProperty({
    description: 'Lista de campos com suas configurações',
    type: [CampoConfiguracaoDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CampoConfiguracaoDto)
  campos: CampoConfiguracaoDto[];
}
