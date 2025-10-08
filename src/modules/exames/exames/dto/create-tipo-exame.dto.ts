import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTipoExameDto {
  @ApiProperty({
    description: 'Código único do tipo de exame',
    example: 'LAB001',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @ApiProperty({
    description: 'Nome do tipo de exame',
    example: 'Exames Laboratoriais',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'Descrição detalhada do tipo',
    example: 'Exames de análises clínicas realizados em laboratório',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'Ícone ou identificador visual',
    example: 'fa-flask',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icone?: string;

  @ApiProperty({
    description: 'Cor hexadecimal para interface',
    example: '#3498db',
    required: false,
    maxLength: 7,
  })
  @IsString()
  @IsOptional()
  @MaxLength(7)
  cor?: string;

  @ApiProperty({
    description: 'Ordem de exibição',
    example: 1,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  ordem?: number;

  @ApiProperty({
    description: 'Status do tipo de exame',
    enum: ['ativo', 'inativo'],
    default: 'ativo',
  })
  @IsEnum(['ativo', 'inativo'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Se requer agendamento prévio',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requer_agendamento?: boolean;

  @ApiProperty({
    description: 'Se requer autorização de convênio',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requer_autorizacao?: boolean;

  @ApiProperty({
    description: 'Se permite coleta domiciliar',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  permite_domiciliar?: boolean;

  @ApiProperty({
    description: 'Configurações adicionais do tipo',
    example: { tempoMedio: 30, requisitoEspecial: 'jejum' },
    required: false,
  })
  @IsOptional()
  configuracoes?: any;
}
