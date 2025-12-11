import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsEnum,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ============================================
// ENUMS
// ============================================

export enum SexoPacienteDb {
  MASCULINO = 'M',
  FEMININO = 'F',
}

export enum PrioridadeDb {
  ROTINA = 'R',
  URGENTE = 'U',
}

export enum TipoCancelamentoDb {
  TEMPORARIO = 'CTP',
  DEFINITIVO = 'CDP',
}

// ============================================
// PACIENTE DTO
// ============================================

export class PacienteDbDto {
  @ApiPropertyOptional({ description: 'RG do paciente no sistema do apoiado' })
  @IsOptional()
  @IsString()
  rgPacienteApoiado?: string;

  @ApiProperty({ description: 'Nome completo do paciente' })
  @IsNotEmpty()
  @IsString()
  nomePaciente: string;

  @ApiProperty({
    description: 'Sexo do paciente',
    enum: SexoPacienteDb,
    example: 'M',
  })
  @IsEnum(SexoPacienteDb)
  sexoPaciente: SexoPacienteDb;

  @ApiProperty({
    description: 'Data de nascimento (YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataNascimento: string;

  @ApiPropertyOptional({ description: 'CPF do paciente' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({ description: 'Cartão Nacional de Saúde (CNS)' })
  @IsOptional()
  @IsString()
  cartaoNacionalSaude?: string;
}

// ============================================
// SOLICITANTE DTO
// ============================================

export class SolicitanteDbDto {
  @ApiProperty({
    description: 'Nome do médico solicitante',
    example: 'Dr. João Silva',
  })
  @IsNotEmpty()
  @IsString()
  nomeSolicitante: string;

  @ApiPropertyOptional({
    description: 'Código do conselho (CRM, CRO, etc)',
    example: 'CRM',
  })
  @IsOptional()
  @IsString()
  codigoConselho?: string;

  @ApiPropertyOptional({
    description: 'UF do conselho',
    example: 'PR',
  })
  @IsOptional()
  @IsString()
  ufConselho?: string;

  @ApiPropertyOptional({
    description: 'Número do registro no conselho',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  numeroConselho?: string;
}

// ============================================
// PROCEDIMENTO DTO
// ============================================

export class ProcedimentoDbDto {
  @ApiProperty({
    description: 'Código do exame no DB Diagnósticos',
    example: 'MIC24',
  })
  @IsNotEmpty()
  @IsString()
  codigoExameDb: string;

  @ApiPropertyOptional({ description: 'Descrição da região de coleta' })
  @IsOptional()
  @IsString()
  descricaoRegiaoColeta?: string;

  @ApiPropertyOptional({ description: 'Volume urinário em mL' })
  @IsOptional()
  @IsNumber()
  volumeUrinario?: number;

  @ApiPropertyOptional({
    description: 'Identificação do exame no sistema apoiado',
  })
  @IsOptional()
  @IsString()
  identificacaoExameApoiado?: string;

  @ApiPropertyOptional({ description: 'Código do material no sistema apoiado' })
  @IsOptional()
  @IsString()
  materialApoiado?: string;

  @ApiPropertyOptional({
    description: 'Descrição do material no sistema apoiado',
  })
  @IsOptional()
  @IsString()
  descricaoMaterialApoiado?: string;

  @ApiPropertyOptional({ description: 'Descrição do exame no sistema apoiado' })
  @IsOptional()
  @IsString()
  descricaoExameApoiado?: string;

  @ApiPropertyOptional({
    description:
      'Código MPP para cancelamento (CTP=temporário, CDP=definitivo)',
    enum: TipoCancelamentoDb,
  })
  @IsOptional()
  @IsEnum(TipoCancelamentoDb)
  codigoMpp?: TipoCancelamentoDb;
}

// ============================================
// QUESTIONÁRIO DTO
// ============================================

export class QuestionarioDbDto {
  @ApiProperty({
    description: 'Código da pergunta do questionário',
    example: 'ValorHematócrico',
  })
  @IsNotEmpty()
  @IsString()
  codigoPergunta: string;

  @ApiProperty({
    description: 'Resposta do questionário',
    example: '39.1',
  })
  @IsNotEmpty()
  @IsString()
  resposta: string;
}

// ============================================
// PEDIDO DTO (ENVIAR PEDIDO)
// ============================================

export class EnviarPedidoDbDto {
  @ApiProperty({
    description: 'Número do atendimento no sistema apoiado',
    example: 'TESTE4444TESTE',
  })
  @IsNotEmpty()
  @IsString()
  numeroAtendimentoApoiado: string;

  @ApiProperty({
    description: 'Dados do paciente',
    type: PacienteDbDto,
  })
  @ValidateNested()
  @Type(() => PacienteDbDto)
  paciente: PacienteDbDto;

  @ApiPropertyOptional({
    description: 'Número de reserva no DB Diagnósticos',
  })
  @IsOptional()
  @IsString()
  numeroAtendimentoDbReserva?: string;

  @ApiPropertyOptional({
    description: 'Prioridade do atendimento',
    enum: PrioridadeDb,
    default: PrioridadeDb.ROTINA,
  })
  @IsOptional()
  @IsEnum(PrioridadeDb)
  prioridade?: PrioridadeDb;

  @ApiPropertyOptional({ description: 'Dados clínicos do paciente' })
  @IsOptional()
  @IsString()
  dadosClinicos?: string;

  @ApiPropertyOptional({ description: 'Medicamentos em uso' })
  @IsOptional()
  @IsString()
  medicamentos?: string;

  @ApiPropertyOptional({
    description: 'Data da última menstruação (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataDum?: string;

  @ApiPropertyOptional({
    description: 'Altura em metros',
    example: 1.8,
  })
  @IsOptional()
  @IsNumber()
  altura?: number;

  @ApiPropertyOptional({
    description: 'Peso em kg',
    example: 85,
  })
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiPropertyOptional({ description: 'Uso apoiado' })
  @IsOptional()
  @IsString()
  usoApoiado?: string;

  @ApiPropertyOptional({ description: 'Posto de coleta' })
  @IsOptional()
  @IsString()
  postoColeta?: string;

  @ApiPropertyOptional({
    description: 'Lista de questionários',
    type: [QuestionarioDbDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionarioDbDto)
  questionarios?: QuestionarioDbDto[];

  @ApiPropertyOptional({
    description: 'Lista de solicitantes',
    type: [SolicitanteDbDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SolicitanteDbDto)
  solicitantes?: SolicitanteDbDto[];

  @ApiProperty({
    description: 'Lista de procedimentos/exames',
    type: [ProcedimentoDbDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcedimentoDbDto)
  procedimentos: ProcedimentoDbDto[];
}

// ============================================
// CONSULTA STATUS DTO
// ============================================

export class ConsultarStatusDbDto {
  @ApiPropertyOptional({
    description: 'Número do atendimento no sistema apoiado',
  })
  @IsOptional()
  @IsString()
  numeroAtendimentoApoiado?: string;

  @ApiPropertyOptional({
    description: 'Número do atendimento no DB Diagnósticos',
  })
  @IsOptional()
  @IsString()
  numeroAtendimentoDb?: string;
}

// ============================================
// CONSULTA LAUDO DTO
// ============================================

export class ConsultarLaudoDbDto {
  @ApiPropertyOptional({
    description: 'Número do atendimento no sistema apoiado',
  })
  @IsOptional()
  @IsString()
  numeroAtendimentoApoiado?: string;

  @ApiPropertyOptional({
    description: 'Número do atendimento no DB Diagnósticos',
  })
  @IsOptional()
  @IsString()
  numeroAtendimentoDb?: string;
}

// ============================================
// CONSULTA LAUDO POR PERÍODO DTO
// ============================================

export class ConsultarLaudoPeriodoDbDto {
  @ApiProperty({
    description: 'Data inicial (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataInicio: string;

  @ApiProperty({
    description: 'Data final (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataFim: string;
}

// ============================================
// CONSULTA LAUDO PDF DTO
// ============================================

export class ConsultarLaudoPdfDbDto {
  @ApiProperty({
    description: 'Número do atendimento no DB Diagnósticos',
    example: '1020208062',
  })
  @IsNotEmpty()
  @IsString()
  numeroAtendimentoDb: string;
}

// ============================================
// REIMPRIMIR ETIQUETAS DTO
// ============================================

export class ReimprimirEtiquetasDbDto {
  @ApiPropertyOptional({
    description: 'Número do atendimento no sistema apoiado',
  })
  @IsOptional()
  @IsString()
  numeroAtendimentoApoiado?: string;

  @ApiPropertyOptional({
    description: 'Número do atendimento no DB Diagnósticos',
  })
  @IsOptional()
  @IsString()
  numeroAtendimentoDb?: string;
}

// ============================================
// CONSULTA PENDÊNCIAS DTO
// ============================================

export class ConsultarPendenciasDbDto {
  @ApiPropertyOptional({
    description: 'Data inicial (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Data final (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataFim?: string;
}

// ============================================
// GERAR ETIQUETA RECOLETA DTO
// ============================================

export class GerarEtiquetaRecoletaDbDto {
  @ApiProperty({
    description: 'Número do atendimento no DB Diagnósticos',
    example: '1020208062',
  })
  @IsNotEmpty()
  @IsString()
  numeroAtendimentoDb: string;

  @ApiProperty({
    description: 'Código do exame no DB Diagnósticos',
    example: 'MIC24',
  })
  @IsNotEmpty()
  @IsString()
  codigoExameDb: string;
}

// ============================================
// CONSULTA LOTE RESULTADOS DTO
// ============================================

export class ConsultarLoteResultadosDbDto {
  @ApiProperty({
    description: 'Número do lote',
    example: '080616093651_12588',
  })
  @IsNotEmpty()
  @IsString()
  numeroLote: string;
}

// ============================================
// RELATÓRIO REQUISIÇÕES DTO
// ============================================

export class RelatorioRequisicoesDbDto {
  @ApiProperty({
    description: 'Data inicial (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataInicio: string;

  @ApiProperty({
    description: 'Data final (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  dataFim: string;
}

// ============================================
// CANCELAR EXAME DTO
// ============================================

export class CancelarExameDbDto {
  @ApiProperty({
    description: 'Número do atendimento no sistema apoiado',
    example: 'TESTE4444TESTE',
  })
  @IsNotEmpty()
  @IsString()
  numeroAtendimentoApoiado: string;

  @ApiProperty({
    description: 'Código do exame a cancelar',
    example: 'MIC24',
  })
  @IsNotEmpty()
  @IsString()
  codigoExameDb: string;

  @ApiProperty({
    description: 'Tipo de cancelamento',
    enum: TipoCancelamentoDb,
    example: TipoCancelamentoDb.TEMPORARIO,
  })
  @IsEnum(TipoCancelamentoDb)
  tipoCancelamento: TipoCancelamentoDb;

  @ApiPropertyOptional({ description: 'Dados do paciente para reenvio' })
  @IsOptional()
  @ValidateNested()
  @Type(() => PacienteDbDto)
  paciente?: PacienteDbDto;

  @ApiPropertyOptional({
    description: 'Lista de solicitantes',
    type: [SolicitanteDbDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SolicitanteDbDto)
  solicitantes?: SolicitanteDbDto[];
}

// ============================================
// RESPONSE DTOs
// ============================================

export class EtiquetaResponseDto {
  @ApiProperty({ description: 'Número da amostra' })
  numeroAmostra: string;

  @ApiProperty({ description: 'Exames vinculados à amostra' })
  exames: string;

  @ApiProperty({ description: 'Contador da amostra' })
  contadorAmostra: string;

  @ApiProperty({ description: 'RG do paciente no DB' })
  rgPacienteDb: string;

  @ApiProperty({ description: 'Nome do paciente' })
  nomePaciente: string;

  @ApiProperty({ description: 'Meio de coleta' })
  meioColeta: string;

  @ApiProperty({ description: 'Grupo de interface' })
  grupoInterface: string;

  @ApiProperty({ description: 'Material' })
  material: string;

  @ApiPropertyOptional({ description: 'Região de coleta' })
  regiaoColeta?: string;

  @ApiProperty({ description: 'Volume' })
  volume: number;

  @ApiProperty({ description: 'Prioridade' })
  prioridade: string;

  @ApiProperty({ description: 'Tipo do código de barras' })
  tipoCodigoBarras: string;

  @ApiPropertyOptional({ description: 'Código do instrumento' })
  codigoInstrumento?: string;

  @ApiProperty({ description: 'Origem' })
  origem: string;

  @ApiProperty({ description: 'Flag de amostra mãe' })
  flagAmostraMae: boolean;

  @ApiPropertyOptional({ description: 'Texto da amostra mãe' })
  textoAmostraMae?: string;

  @ApiProperty({ description: 'Data do sistema' })
  dataSistema: string;

  @ApiProperty({ description: 'Conteúdo da etiqueta (EPL)' })
  etiquetaAmostra: string;
}

export class ConfirmacaoPedidoResponseDto {
  @ApiProperty({ description: 'Número do atendimento no sistema apoiado' })
  numeroAtendimentoApoiado: string;

  @ApiProperty({ description: 'Status do processamento' })
  status: string;

  @ApiProperty({ description: 'Número do atendimento no DB Diagnósticos' })
  numeroAtendimentoDb: string;

  @ApiProperty({
    description: 'Lista de amostras/etiquetas',
    type: [EtiquetaResponseDto],
  })
  amostras: EtiquetaResponseDto[];
}

export class EnviarPedidoResponseDto {
  @ApiProperty({ description: 'Indica se a operação foi bem sucedida' })
  sucesso: boolean;

  @ApiPropertyOptional({ description: 'Mensagem de erro, se houver' })
  erro?: string;

  @ApiPropertyOptional({ description: 'Número do lote gerado' })
  numeroLote?: string;

  @ApiPropertyOptional({ description: 'Data/hora da gravação' })
  dataHoraGravacao?: string;

  @ApiPropertyOptional({
    description: 'Confirmação do pedido com etiquetas',
    type: ConfirmacaoPedidoResponseDto,
  })
  confirmacao?: ConfirmacaoPedidoResponseDto;
}

export class StatusExameResponseDto {
  @ApiProperty({ description: 'Código do exame no DB' })
  codigoExameDb: string;

  @ApiProperty({ description: 'Descrição do exame' })
  descricaoExame: string;

  @ApiProperty({ description: 'Status do exame' })
  status: string;

  @ApiProperty({ description: 'Data/hora do status' })
  dataHoraStatus: string;

  @ApiProperty({ description: 'Material' })
  material: string;
}

export class ConsultarStatusResponseDto {
  @ApiProperty({ description: 'Indica se a operação foi bem sucedida' })
  sucesso: boolean;

  @ApiPropertyOptional({ description: 'Mensagem de erro, se houver' })
  erro?: string;

  @ApiPropertyOptional({ description: 'Número do atendimento no DB' })
  numeroAtendimentoDb?: string;

  @ApiPropertyOptional({ description: 'Número do atendimento no apoiado' })
  numeroAtendimentoApoiado?: string;

  @ApiPropertyOptional({ description: 'Nome do paciente' })
  nomePaciente?: string;

  @ApiPropertyOptional({ description: 'Status geral do atendimento' })
  status?: string;

  @ApiPropertyOptional({ description: 'Data/hora do status' })
  dataHoraStatus?: string;

  @ApiPropertyOptional({
    description: 'Lista de exames com status',
    type: [StatusExameResponseDto],
  })
  exames?: StatusExameResponseDto[];
}

export class ResultadoExameResponseDto {
  @ApiProperty({ description: 'Código do exame no DB' })
  codigoExameDb: string;

  @ApiProperty({ description: 'Descrição do exame' })
  descricaoExame: string;

  @ApiProperty({ description: 'Material' })
  material: string;

  @ApiProperty({ description: 'Data/hora da liberação' })
  dataHoraLiberacao: string;

  @ApiProperty({ description: 'Resultado do exame' })
  resultado: string;

  @ApiPropertyOptional({ description: 'Unidade de medida' })
  unidadeMedida?: string;

  @ApiPropertyOptional({ description: 'Valor de referência' })
  valorReferencia?: string;

  @ApiPropertyOptional({ description: 'Observação' })
  observacao?: string;
}

export class ConsultarLaudoResponseDto {
  @ApiProperty({ description: 'Indica se a operação foi bem sucedida' })
  sucesso: boolean;

  @ApiPropertyOptional({ description: 'Mensagem de erro, se houver' })
  erro?: string;

  @ApiPropertyOptional({ description: 'Número do atendimento no DB' })
  numeroAtendimentoDb?: string;

  @ApiPropertyOptional({ description: 'Número do atendimento no apoiado' })
  numeroAtendimentoApoiado?: string;

  @ApiPropertyOptional({ description: 'Nome do paciente' })
  nomePaciente?: string;

  @ApiPropertyOptional({ description: 'Data de nascimento' })
  dataNascimento?: string;

  @ApiPropertyOptional({ description: 'Sexo do paciente' })
  sexoPaciente?: string;

  @ApiPropertyOptional({ description: 'Data da coleta' })
  dataColeta?: string;

  @ApiPropertyOptional({ description: 'Data da liberação' })
  dataLiberacao?: string;

  @ApiPropertyOptional({
    description: 'Lista de resultados dos exames',
    type: [ResultadoExameResponseDto],
  })
  exames?: ResultadoExameResponseDto[];
}

export class ConsultarLaudoPdfResponseDto {
  @ApiProperty({ description: 'Indica se a operação foi bem sucedida' })
  sucesso: boolean;

  @ApiPropertyOptional({ description: 'Mensagem de erro, se houver' })
  erro?: string;

  @ApiPropertyOptional({ description: 'Número do atendimento no DB' })
  numeroAtendimentoDb?: string;

  @ApiPropertyOptional({ description: 'Link para download do laudo' })
  linkLaudo?: string;

  @ApiPropertyOptional({ description: 'Laudo em Base64' })
  laudoBase64?: string;
}

export class ProcedimentoPendenteResponseDto {
  @ApiProperty({ description: 'Número do atendimento no DB' })
  numeroAtendimentoDb: string;

  @ApiProperty({ description: 'Número do atendimento no apoiado' })
  numeroAtendimentoApoiado: string;

  @ApiProperty({ description: 'Nome do paciente' })
  nomePaciente: string;

  @ApiProperty({ description: 'Código do exame no DB' })
  codigoExameDb: string;

  @ApiProperty({ description: 'Descrição do exame' })
  descricaoExame: string;

  @ApiProperty({ description: 'Material' })
  material: string;

  @ApiProperty({ description: 'Motivo da pendência' })
  motivoPendencia: string;

  @ApiProperty({ description: 'Data da pendência' })
  dataPendencia: string;
}

export class ConsultarPendenciasResponseDto {
  @ApiProperty({ description: 'Indica se a operação foi bem sucedida' })
  sucesso: boolean;

  @ApiPropertyOptional({ description: 'Mensagem de erro, se houver' })
  erro?: string;

  @ApiPropertyOptional({
    description: 'Lista de procedimentos pendentes',
    type: [ProcedimentoPendenteResponseDto],
  })
  pendencias?: ProcedimentoPendenteResponseDto[];
}

export class RequisicaoEnviadaResponseDto {
  @ApiProperty({ description: 'Número do atendimento no DB' })
  numeroAtendimentoDb: string;

  @ApiProperty({ description: 'Número do atendimento no apoiado' })
  numeroAtendimentoApoiado: string;

  @ApiProperty({ description: 'Nome do paciente' })
  nomePaciente: string;

  @ApiProperty({ description: 'Data do envio' })
  dataEnvio: string;

  @ApiProperty({ description: 'Status' })
  status: string;

  @ApiProperty({ description: 'Quantidade de exames' })
  quantidadeExames: number;
}

export class RelatorioRequisicoesResponseDto {
  @ApiProperty({ description: 'Indica se a operação foi bem sucedida' })
  sucesso: boolean;

  @ApiPropertyOptional({ description: 'Mensagem de erro, se houver' })
  erro?: string;

  @ApiPropertyOptional({
    description: 'Lista de requisições enviadas',
    type: [RequisicaoEnviadaResponseDto],
  })
  requisicoes?: RequisicaoEnviadaResponseDto[];
}
