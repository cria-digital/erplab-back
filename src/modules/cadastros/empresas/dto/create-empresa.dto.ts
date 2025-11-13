import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  Matches,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoEmpresaEnum } from '../enums/empresas.enum';
import { CreateContaBancariaEmpresaDto } from './create-conta-bancaria-empresa.dto';

export class CreateEmpresaDto {
  @ApiProperty({
    enum: TipoEmpresaEnum,
    description: 'Tipo de empresa',
  })
  @IsEnum(TipoEmpresaEnum)
  tipoEmpresa: TipoEmpresaEnum;

  // Informações básicas
  @ApiPropertyOptional({ description: 'Código interno da empresa' })
  @IsOptional()
  @IsString()
  codigoInterno?: string;

  @ApiProperty({
    example: '00.000.000/0001-00',
    description: 'CNPJ da empresa',
  })
  @IsString()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { message: 'CNPJ inválido' })
  cnpj: string;

  @ApiProperty({ description: 'Razão social da empresa' })
  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @ApiPropertyOptional({ description: 'Nome fantasia da empresa' })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'Inscrição estadual' })
  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @ApiPropertyOptional({ description: 'Inscrição municipal' })
  @IsOptional()
  @IsString()
  inscricaoMunicipal?: string;

  @ApiPropertyOptional({ description: 'Telefone fixo' })
  @IsOptional()
  @IsString()
  telefoneFixo?: string;

  @ApiPropertyOptional({ description: 'Celular' })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiProperty({ description: 'E-mail comercial' })
  @IsEmail()
  emailComercial: string;

  @ApiPropertyOptional({ description: 'Site da empresa' })
  @IsOptional()
  @IsString()
  siteEmpresa?: string;

  // Endereço
  @ApiPropertyOptional({ description: 'CEP' })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiPropertyOptional({ description: 'Rua' })
  @IsOptional()
  @IsString()
  rua?: string;

  @ApiPropertyOptional({ description: 'Número' })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiPropertyOptional({ description: 'Bairro' })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiPropertyOptional({ description: 'Complemento' })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiPropertyOptional({ description: 'Estado (UF)' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ description: 'Cidade' })
  @IsOptional()
  @IsString()
  cidade?: string;

  // Responsável
  @ApiPropertyOptional({ description: 'Nome do responsável' })
  @IsOptional()
  @IsString()
  nomeResponsavel?: string;

  @ApiPropertyOptional({ description: 'Cargo do responsável' })
  @IsOptional()
  @IsString()
  cargoResponsavel?: string;

  @ApiPropertyOptional({ description: 'Contato do responsável' })
  @IsOptional()
  @IsString()
  contatoResponsavel?: string;

  @ApiPropertyOptional({ description: 'E-mail do responsável' })
  @IsOptional()
  @IsEmail()
  emailResponsavel?: string;

  // Impostos
  @ApiPropertyOptional({ description: 'Percentual IRRF' })
  @IsOptional()
  @IsNumber()
  irrfPercentual?: number;

  @ApiPropertyOptional({ description: 'Percentual PIS' })
  @IsOptional()
  @IsNumber()
  pisPercentual?: number;

  @ApiPropertyOptional({ description: 'Percentual COFINS' })
  @IsOptional()
  @IsNumber()
  cofinsPercentual?: number;

  @ApiPropertyOptional({ description: 'Percentual CSLL' })
  @IsOptional()
  @IsNumber()
  csllPercentual?: number;

  @ApiPropertyOptional({ description: 'Percentual ISS' })
  @IsOptional()
  @IsNumber()
  issPercentual?: number;

  @ApiPropertyOptional({ description: 'Percentual IBS' })
  @IsOptional()
  @IsNumber()
  ibsPercentual?: number;

  @ApiPropertyOptional({ description: 'Percentual CBS' })
  @IsOptional()
  @IsNumber()
  cbsPercentual?: number;

  // Retenções
  @ApiPropertyOptional({ description: 'Reter ISS', default: false })
  @IsOptional()
  @IsBoolean()
  reterIss?: boolean;

  @ApiPropertyOptional({ description: 'Reter IR', default: false })
  @IsOptional()
  @IsBoolean()
  reterIr?: boolean;

  @ApiPropertyOptional({ description: 'Reter PCC', default: false })
  @IsOptional()
  @IsBoolean()
  reterPcc?: boolean;

  @ApiPropertyOptional({ description: 'Reter IBS', default: false })
  @IsOptional()
  @IsBoolean()
  reterIbs?: boolean;

  @ApiPropertyOptional({ description: 'Reter CBS', default: false })
  @IsOptional()
  @IsBoolean()
  reterCbs?: boolean;

  @ApiPropertyOptional({
    description: 'Optante pelo Simples Nacional',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  optanteSimplesNacional?: boolean;

  // Dados bancários
  @ApiPropertyOptional({ description: 'Banco' })
  @IsOptional()
  @IsString()
  banco?: string;

  @ApiPropertyOptional({ description: 'Agência' })
  @IsOptional()
  @IsString()
  agencia?: string;

  @ApiPropertyOptional({ description: 'Conta corrente' })
  @IsOptional()
  @IsString()
  contaCorrente?: string;

  @ApiPropertyOptional({ description: 'Forma de pagamento' })
  @IsOptional()
  @IsString()
  formaPagamento?: string;

  @ApiPropertyOptional({
    description: 'Contas bancárias da empresa',
    type: [CreateContaBancariaEmpresaDto],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContaBancariaEmpresaDto)
  contasBancarias?: CreateContaBancariaEmpresaDto[];

  @ApiPropertyOptional({
    default: true,
    description: 'Status ativo/inativo',
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
