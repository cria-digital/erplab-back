/**
 * Interfaces para integração com DB Diagnósticos (DBSync v2.0)
 * Documentação: WebServiceDBapoio_V2_15022024.pdf
 * Namespace: http://diagnosticosdobrasil.com.br
 */

// ============================================
// CONFIGURAÇÃO
// ============================================

export interface DbDiagnosticosConfig {
  codigoApoiado: string;
  codigoSenhaIntegracao: string;
  wsdlUrl: string;
  timeout?: number;
}

// ============================================
// TIPOS BASE
// ============================================

export interface DbDiagnosticosResponse<T> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  mensagem?: string;
}

// ============================================
// PACIENTE (ct_Paciente_v2)
// ============================================

export interface DbDiagnosticosPaciente {
  RGPacienteApoiado?: string;
  NomePaciente: string;
  SexoPaciente: 'M' | 'F';
  DataHoraPaciente: string; // YYYY-MM-DD
  NumeroCPF?: string;
  NumeroCartaoNacionalSaude?: string;
}

// ============================================
// SOLICITANTE (ct_Solicitante_v2)
// ============================================

export interface DbDiagnosticosSolicitante {
  NomeSolicitante: string;
  CodigoConselho?: string; // CRM, CRO, etc
  CodigoUFConselhoSolicitante?: string;
  CodigoConselhoSolicitante?: string;
}

// ============================================
// PROCEDIMENTO (ct_Procedimento_v2)
// ============================================

export interface DbDiagnosticosProcedimento {
  CodigoExameDB: string;
  DescricaoRegiaoColeta?: string;
  VolumeUrinario?: number;
  IdentificacaoExameApoiado?: string;
  MaterialApoiado?: string;
  DescricaoMaterialApoiado?: string;
  DescricaoExameApoiado?: string;
  CodigoMPP?: string; // CTP=cancelamento temporário, CDP=cancelamento definitivo
}

// ============================================
// QUESTIONÁRIO (ct_Questionario_v2)
// ============================================

export interface DbDiagnosticosQuestionario {
  CodigoPerguntaQuestionario: string;
  RespostaQuestionario: string;
}

// ============================================
// PEDIDO (ct_Pedido_v2)
// ============================================

export interface DbDiagnosticosPedido {
  NumeroAtendimentoApoiado: string;
  ListaPacienteApoiado: DbDiagnosticosPaciente;
  NumeroAtendimentoDBReserva?: string;
  CodigoPrioridade?: string; // R=Rotina, U=Urgente
  DescricaoDadosClinicos?: string;
  DescricaoMedicamentos?: string;
  DataHoraDUM?: string; // Data última menstruação YYYY-MM-DD
  Altura?: number;
  Peso?: number;
  UsoApoiado?: string;
  PostoColeta?: string;
  ListaQuestionarios?: DbDiagnosticosQuestionario[];
  ListaSolicitante?: DbDiagnosticosSolicitante[];
  ListaProcedimento: DbDiagnosticosProcedimento[];
}

// ============================================
// ATENDIMENTO (ct_Atendimento)
// ============================================

export interface DbDiagnosticosAtendimento {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  Pedido: DbDiagnosticosPedido;
}

// ============================================
// AMOSTRA/ETIQUETA (ct_AmostraEtiqueta_v2)
// ============================================

export interface DbDiagnosticosAmostraEtiqueta {
  NumeroAmostra: string;
  Exames: string;
  ContadorAmostra: string;
  RGPacienteDB: string;
  NomePaciente: string;
  MeioColeta: string;
  GrupoInterface: string;
  Material: string;
  RegiaoColeta?: string;
  Volume: number;
  Prioridade: string;
  TipoCodigoBarras: string;
  CodigoInstrumento?: string;
  Origem: string;
  FlagAmostraMae: boolean;
  TextoAmostraMae?: string;
  DataSistema: string;
  EtiquetaAmostra: string; // EPL format
}

// ============================================
// CONFIRMAÇÃO PEDIDO (ct_ConfirmacaoPedidoEtiqueta_v2)
// ============================================

export interface DbDiagnosticosConfirmacaoPedido {
  NumeroAtendimentoApoiado: string;
  Status: string;
  NumeroAtendimentoDB: string;
  Amostras: DbDiagnosticosAmostraEtiqueta[];
}

// ============================================
// STATUS LOTE PROCEDIMENTO (ct_StatusLoteProcedimento_v2)
// ============================================

export interface DbDiagnosticosStatusProcedimento {
  CodigoExameDB: string;
  IdentificacaoExameApoiado?: string;
  Material: string;
  DescricaoExame: string;
}

// ============================================
// STATUS LOTE PEDIDO (ct_StatusLotePedido_v2)
// ============================================

export interface DbDiagnosticosStatusPedido {
  NomePaciente: string;
  NumeroAtendimentoDB: string;
  NumeroAtendimentoApoiado: string;
  PostoColeta?: string;
  Procedimentos: DbDiagnosticosStatusProcedimento[];
}

// ============================================
// STATUS LOTE (ct_StatusLote_v2)
// ============================================

export interface DbDiagnosticosStatusLote {
  NumeroLote: string;
  ArquivoSolicitacaoPedidos?: string;
  Pedidos: DbDiagnosticosStatusPedido[];
  DataHoraGravacao: string;
}

// ============================================
// RESPOSTA RECEBE ATENDIMENTO
// ============================================

export interface DbDiagnosticosRecebeAtendimentoResult {
  StatusLote: DbDiagnosticosStatusLote;
  Confirmacao: DbDiagnosticosConfirmacaoPedido;
}

// ============================================
// CONSULTA STATUS (ct_ConsultaStatus_v2)
// ============================================

export interface DbDiagnosticosConsultaStatus {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  NumeroAtendimentoApoiado?: string;
  NumeroAtendimentoDB?: string;
}

// ============================================
// RESPOSTA CONSULTA STATUS
// ============================================

export interface DbDiagnosticosStatusAtendimento {
  NumeroAtendimentoDB: string;
  NumeroAtendimentoApoiado: string;
  NomePaciente: string;
  Status: string;
  DataHoraStatus: string;
  Exames: DbDiagnosticosStatusExame[];
}

export interface DbDiagnosticosStatusExame {
  CodigoExameDB: string;
  DescricaoExame: string;
  Status: string;
  DataHoraStatus: string;
  Material: string;
}

// ============================================
// LAUDO/RESULTADO
// ============================================

export interface DbDiagnosticosConsultaLaudo {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  NumeroAtendimentoApoiado?: string;
  NumeroAtendimentoDB?: string;
  DataInicio?: string;
  DataFim?: string;
}

export interface DbDiagnosticosResultadoExame {
  CodigoExameDB: string;
  DescricaoExame: string;
  Material: string;
  DataHoraLiberacao: string;
  Resultado: string;
  UnidadeMedida?: string;
  ValorReferencia?: string;
  Observacao?: string;
}

export interface DbDiagnosticosLaudo {
  NumeroAtendimentoDB: string;
  NumeroAtendimentoApoiado: string;
  NomePaciente: string;
  DataNascimento: string;
  SexoPaciente: string;
  DataColeta: string;
  DataLiberacao: string;
  Exames: DbDiagnosticosResultadoExame[];
}

// ============================================
// LAUDO BASE64 (PDF)
// ============================================

export interface DbDiagnosticosConsultaLaudoPdf {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  NumeroAtendimentoDB: string;
}

export interface DbDiagnosticosLaudoPdf {
  NumeroAtendimentoDB: string;
  LinkLaudo: string;
  LaudoBase64?: string;
}

// ============================================
// REIMPRIMIR ETIQUETAS (EnviaAmostras)
// ============================================

export interface DbDiagnosticosReimprimirEtiquetas {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  NumeroAtendimentoApoiado?: string;
  NumeroAtendimentoDB?: string;
}

// ============================================
// PROCEDIMENTOS PENDENTES
// ============================================

export interface DbDiagnosticosProcedimentoPendente {
  NumeroAtendimentoDB: string;
  NumeroAtendimentoApoiado: string;
  NomePaciente: string;
  CodigoExameDB: string;
  DescricaoExame: string;
  Material: string;
  MotivoPendencia: string;
  DataPendencia: string;
}

export interface DbDiagnosticosConsultaPendencias {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  DataInicio?: string;
  DataFim?: string;
}

// ============================================
// RECOLETA (EnviaAmostrasProcedimentosPendentes)
// ============================================

export interface DbDiagnosticosRecoleta {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  NumeroAtendimentoDB: string;
  CodigoExameDB: string;
}

// ============================================
// LOTE DE RESULTADOS (EnviaLoteResultados)
// ============================================

export interface DbDiagnosticosConsultaLoteResultados {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  NumeroLote: string;
}

// ============================================
// RELATÓRIO REQUISIÇÕES ENVIADAS
// ============================================

export interface DbDiagnosticosRelatorioRequisicoes {
  CodigoApoiado: string;
  CodigoSenhaIntegracao: string;
  DataInicio: string;
  DataFim: string;
}

export interface DbDiagnosticosRequisicaoEnviada {
  NumeroAtendimentoDB: string;
  NumeroAtendimentoApoiado: string;
  NomePaciente: string;
  DataEnvio: string;
  Status: string;
  QuantidadeExames: number;
}
