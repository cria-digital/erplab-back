import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateCnaeDto {
  @ApiProperty({
    example: '8610101',
    description: 'Código CNAE (7 dígitos, sem formatação)',
  })
  @IsString()
  @Length(7, 7)
  codigo: string;

  @ApiProperty({
    example:
      'Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências',
    description: 'Descrição do CNAE',
  })
  @IsString()
  descricao: string;

  @ApiProperty({ example: 'Q', description: 'Seção do CNAE', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  secao?: string;

  @ApiProperty({
    example: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
    description: 'Descrição da seção',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricaoSecao?: string;

  @ApiProperty({
    example: '86',
    description: 'Divisão do CNAE',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  divisao?: string;

  @ApiProperty({
    example: 'Atividades de atenção à saúde humana',
    description: 'Descrição da divisão',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricaoDivisao?: string;

  @ApiProperty({
    example: '861',
    description: 'Grupo do CNAE',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  grupo?: string;

  @ApiProperty({
    example: 'Atividades de atendimento hospitalar',
    description: 'Descrição do grupo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricaoGrupo?: string;

  @ApiProperty({
    example: '8610',
    description: 'Classe do CNAE',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  classe?: string;

  @ApiProperty({
    example: 'Atividades de atendimento hospitalar',
    description: 'Descrição da classe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descricaoClasse?: string;

  @ApiProperty({
    example: '861010',
    description: 'Subclasse do CNAE (6 dígitos, sem formatação)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  subclasse?: string;

  @ApiProperty({
    example: 'Atividades de atendimento hospitalar',
    description: 'Descrição da subclasse',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricaoSubclasse?: string;

  @ApiProperty({ example: true, description: 'Status do CNAE', default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    example: 'CNAE relacionado a atividades hospitalares',
    description: 'Observações',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
