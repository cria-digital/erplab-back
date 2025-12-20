import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * DTOs para a API Dados DB (Guia de Exames)
 * WSDL: https://wsmc.diagnosticosdobrasil.com.br/dadosdb/wsrvDadosDB.DADOSDB.svc?wsdl
 */

// ============================================
// BASE DTO (campos comuns de autenticação)
// ============================================

export class DadosDbBaseDto {
  @ApiPropertyOptional({
    description:
      'Código do laboratório/usuário (usa config do tenant se não informado)',
    example: 'CONVENIO',
  })
  @IsOptional()
  @IsString()
  usuario?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário (usa config do tenant se não informado)',
    example: 'senha123',
  })
  @IsOptional()
  @IsString()
  senha?: string;
}

// ============================================
// GET TOKEN
// ============================================

export class GetTokenDadosDbDto {
  @ApiProperty({
    description: 'Código do laboratório/usuário para autenticação',
    example: 'CONVENIO',
  })
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsString()
  @IsNotEmpty()
  senha: string;
}

// ============================================
// FILTRA PROCEDIMENTO WEB
// ============================================

export class FiltraProcedimentoWebDto extends DadosDbBaseDto {
  @ApiProperty({
    description: 'Nome do exame para filtrar (mínimo 3 caracteres)',
    example: 'TIREOESTIMULANTE',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Filtro deve ter no mínimo 3 caracteres' })
  @MaxLength(100)
  filtroNome: string;

  @ApiPropertyOptional({
    description: 'Origem padrão para filtro',
    example: '',
  })
  @IsOptional()
  @IsString()
  origemPadrao?: string;
}

// ============================================
// BUSCA EXAMES CONFIG
// ============================================

export class BuscaExamesConfigDto extends DadosDbBaseDto {
  @ApiProperty({
    description: 'Código do exame DB',
    example: 'TSH',
  })
  @IsString()
  @IsNotEmpty()
  procedimento: string;
}

// ============================================
// GET INFORMACOES EXAME
// ============================================

export class GetInformacoesExameDto extends DadosDbBaseDto {
  @ApiProperty({
    description: 'Código do exame DB para buscar informações detalhadas',
    example: 'TSH',
  })
  @IsString()
  @IsNotEmpty()
  procedimento: string;
}

// ============================================
// GET LAUDO PROCEDIMENTO
// ============================================

export class GetLaudoProcedimentoDto extends DadosDbBaseDto {
  @ApiProperty({
    description: 'Código do procedimento para buscar versão do laudo',
    example: 'TSH',
  })
  @IsString()
  @IsNotEmpty()
  codigoProcedimento: string;
}

// ============================================
// GET LAUDO FAIXA ETARIA SEXO
// ============================================

export class GetLaudoFaixaEtariaDto extends DadosDbBaseDto {
  @ApiProperty({
    description: 'Versão do laudo (obtido via GetLaudoProcedimento)',
    example: 'MHEMO1_8',
  })
  @IsString()
  @IsNotEmpty()
  laudo: string;
}

// ============================================
// DOWNLOAD MASCARA LAUDO PDF
// ============================================

export class DownloadMascaraLaudoDto extends DadosDbBaseDto {
  @ApiProperty({
    description: 'Versão do laudo',
    example: 'MHEMO1_8',
  })
  @IsString()
  @IsNotEmpty()
  laudo: string;

  @ApiProperty({
    description:
      'Faixa de referência por sexo (obtido via GetLaudoFaixaEtariaSexo)',
    example: 'Padrão',
  })
  @IsString()
  @IsNotEmpty()
  faixaReferenciaSexo: string;
}

// ============================================
// RESPONSE DTOs (para documentação Swagger)
// ============================================

export class TokenResponseDto {
  @ApiProperty({ example: true })
  sucesso: boolean;

  @ApiProperty({ example: 'abc123-token-xyz' })
  token?: string;

  @ApiProperty({ example: 'U' })
  tipoUsuario?: string;

  @ApiProperty({ example: 0 })
  status?: number;

  @ApiProperty({ example: 'Token gerado com sucesso' })
  message?: string;

  @ApiPropertyOptional({ example: 'Erro de autenticação' })
  erro?: string;
}

export class ProcedimentoWebResponseDto {
  @ApiProperty({ example: 'TSH' })
  codigo: string;

  @ApiProperty({ example: 'TSH - HORMÔNIO TIREOESTIMULANTE' })
  descricao: string;

  @ApiProperty({ example: 'SORO' })
  material?: string;

  @ApiProperty({ example: true })
  possuiInstrucaoPreparo: boolean;

  @ApiProperty({ example: false })
  temRegiaoColeta: boolean;

  @ApiProperty({ example: 'Tubo seco (vermelho) ou Gel separador (amarelo)' })
  meiosCondTransporte?: string;
}

export class InformacoesExameResponseDto {
  @ApiProperty({ example: 'TSH' })
  codigo: string;

  @ApiProperty({ example: 'TSH - HORMÔNIO TIREOESTIMULANTE' })
  nome: string;

  @ApiProperty({ example: 'CBHPM - 40316521' })
  sinonimos?: string;

  @ApiProperty({ example: 'SORO' })
  material?: string;

  @ApiProperty({ example: 'QUIMIOLUMINESCÊNCIA' })
  metodologia?: string;

  @ApiProperty({ example: '1 mL' })
  volumeMinimo?: string;

  @ApiProperty({ example: '1 dia útil' })
  prazo?: string;

  @ApiProperty({ example: 'Segunda a sábado' })
  realizacao?: string;

  @ApiProperty({ example: 'Jejum aconselhável de 4 horas' })
  preparo?: string;

  @ApiProperty({
    example: [{ sexo: 'Adultos', valor: '0,34 a 5,60 µUI/mL' }],
  })
  valoresReferencia?: any[];
}

export class ExameConfigResponseDto {
  @ApiProperty({ example: 'TSH' })
  codigo: string;

  @ApiProperty({ example: 'TSH - HORMÔNIO TIREOESTIMULANTE' })
  nome: string;

  @ApiProperty({ example: 'SORO' })
  material?: string;

  @ApiProperty({ example: 'QUIMIOLUMINESCÊNCIA' })
  metodologia?: string;

  @ApiProperty({ example: 'CBHPM - 40316521' })
  cbhpm?: string;

  @ApiProperty({ example: [] })
  parametros?: any[];
}
