import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import {
  TipoEntidadeEnum,
  TipoFormularioEnum,
  CampoCadastroPacienteEnum,
  CampoOrdemServicoEnum,
  CampoTissEnum,
} from '../entities/configuracao-campo-formulario.entity';

export class CreateConfiguracaoCampoDto {
  @ApiProperty({
    enum: TipoEntidadeEnum,
    description: 'Tipo da entidade',
    example: TipoEntidadeEnum.CONVENIO,
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
    enum: TipoFormularioEnum,
    description:
      'Tipo do formulário (cadastro_paciente, ordem_servico ou tiss)',
    example: TipoFormularioEnum.CADASTRO_PACIENTE,
  })
  @IsEnum(TipoFormularioEnum)
  @IsNotEmpty()
  tipoFormulario: TipoFormularioEnum;

  @ApiProperty({
    description:
      'Nome do campo no formulário. Deve corresponder aos enums: CampoCadastroPacienteEnum (30 campos), CampoOrdemServicoEnum (10 campos) ou CampoTissEnum (6 campos)',
    example: CampoCadastroPacienteEnum.CPF,
    enum: [
      ...Object.values(CampoCadastroPacienteEnum),
      ...Object.values(CampoOrdemServicoEnum),
      ...Object.values(CampoTissEnum),
    ],
  })
  @IsString()
  @IsNotEmpty()
  nomeCampo: string;

  @ApiProperty({
    description: 'Se o campo é obrigatório para esta entidade',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  obrigatorio?: boolean;
}
