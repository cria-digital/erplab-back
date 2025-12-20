/**
 * Interfaces para a API Dados DB (Guia de Exames)
 * WSDL: https://wsmc.diagnosticosdobrasil.com.br/dadosdb/wsrvDadosDB.DADOSDB.svc?wsdl
 *
 * Esta API é diferente da API de Protocolo (dbsync).
 * Usa autenticação via Usuario + Senha + Token
 */

// ============================================
// CONFIGURAÇÃO
// ============================================

export interface DadosDbConfig {
  usuario: string; // Código do laboratório (mesmo usado no Laudos Online)
  senha: string; // Senha do usuário
  wsdlUrl: string;
  timeout?: number;
}

// ============================================
// RESPOSTA GENÉRICA
// ============================================

export interface DadosDbResponse<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  status?: number;
  message?: string;
}

// ============================================
// TOKEN
// ============================================

export interface DadosDbTokenResponse {
  Status: number;
  Message?: string;
  TipoUsuario?: string;
  Token: string;
}

// ============================================
// PROCEDIMENTO WEB (FiltraProcedimentoWebRequest)
// ============================================

export interface DadosDbProcedimentoWeb {
  Codigo: string;
  Descricao: string;
  Restricao?: string;
  RegiaoColetaObrigatoria: boolean;
  RegiaoColetaTextoLivre: boolean;
  ExibeProcedimentoNet: boolean;
  RegiaoColetaProcedimento?: string[];
  TemRegiaoColeta: boolean;
  PossuiInstrucaoPreparo: boolean;
  DataHoraColetaMaterial?: string;
  Nome?: string;
  Material?: string;
  Selecionado: boolean;
  Meios_CondTransporte?: string;
  ProcedimentosMultiplos?: DadosDbProcedimentoWeb[];
  ProcedimentosVinculado?: DadosDbProcedimentoWeb[];
  AlertasWeb?: DadosDbAlertWeb[];
}

export interface DadosDbAlertWeb {
  Metodo?: string;
  Parametro?: string;
  Sexo?: string;
  IdadeInf?: string;
  IdadeSup?: string;
  ValorDeReferencia?: string;
}

export interface DadosDbFiltraProcedimentoResponse {
  Status: number;
  Message?: string;
  procedimentosWeb?: DadosDbProcedimentoWeb[];
}

// ============================================
// BUSCA EXAMES CONFIG
// ============================================

export interface DadosDbExameConfig {
  CD_EXAME: string;
  DS_EXAME: string;
  SINONIMO?: string;
  CBHPM?: string;
  METODOLOGIA?: string;
  MATERIAL?: string;
  VOLUME_OBRIGATORIO?: string;
  ALTURA_OBRIGATORIO?: string;
  PESO_OBRIGATORIO?: string;
  DATA_ALTERACAO_LAUDO?: string;
  Parametros?: DadosDbParametroConfig[];
}

export interface DadosDbParametroConfig {
  SEQUENCIA?: number;
  CD_PARAMETRO?: string;
  DS_PARAMETRO?: string;
  UNIDADE?: string;
  DECIMAL?: number;
  TIPO?: string;
  ValorReferencia?: DadosDbValorReferencia;
}

export interface DadosDbValorReferencia {
  SEXO?: string;
  IDADE_INFERIOR?: string;
  IDADE_SUPERIOR?: string;
  VALORREFERENCIA?: string;
}

export interface DadosDbBuscaExamesConfigResponse {
  Status: number;
  Message?: string;
  XmlExamesConfig?: string; // XML como string (CDATA)
  Exames?: DadosDbExameConfig[];
}

// ============================================
// GET INFORMACOES EXAME
// ============================================

export interface DadosDbInformacoesExame {
  CodigoProcedimento: string;
  NomeProcedimento: string;
  Sinonimos?: string;
  CodigoMaterial?: string;
  NomeMaterial?: string;
  Interpretacao?: string;
  PrecoProcedimento?: number;
  RegioesColeta?: string[];
  ValoresReferencia?: DadosDbValorReferenciaExame[];
  ProducaoExame?: DadosDbProducaoExame;
  Instrucoes?: DadosDbInstrucoes;
}

export interface DadosDbValorReferenciaExame {
  Metodo?: string;
  Parametro?: string;
  Sexo?: string;
  IdadeInferior?: string;
  IdadeSuperior?: string;
  ValorReferencia?: string;
}

export interface DadosDbProducaoExame {
  VolumeMinimo?: string;
  Prazo?: string;
  Realizacao?: string;
  MeiosColeta?: string;
}

export interface DadosDbInstrucoes {
  RegiaoColeta?: DadosDbInstrucao[];
}

export interface DadosDbInstrucao {
  TipoInstrucao?: string;
  Descricao?: string;
}

export interface DadosDbGetInformacoesExameResponse {
  Status: number;
  Message?: string;
  XmlInformacoesExame?: string; // XML como string (CDATA)
  InformacoesExame?: DadosDbInformacoesExame;
}

// ============================================
// GET LAUDO PROCEDIMENTO
// ============================================

export interface DadosDbGetLaudoProcedimentoResponse {
  Status: number;
  Message?: string;
  LaudosAtivos?: string[]; // Ex: ["TSH1_8"]
}

// ============================================
// GET LAUDO FAIXA ETARIA SEXO
// ============================================

export interface DadosDbGetLaudoFaixaEtariaResponse {
  Status: number;
  Message?: string;
  FaixaEtariaSexo?: string[]; // Ex: ["Padrão", "FEMININO", "MASCULINO - 0a - 1d", ...]
}

// ============================================
// DOWNLOAD MASCARA LAUDO PDF
// ============================================

export interface DadosDbDownloadMascaraLaudoResponse {
  Status: number;
  Message?: string;
  MascaraLaudo?: string; // Base64 do PDF
}

// ============================================
// TIPOS AUXILIARES PARA PARSING XML
// ============================================

export interface DadosDbExameConfigParsed {
  codigo: string;
  nome: string;
  sinonimo?: string;
  cbhpm?: string;
  metodologia?: string;
  material?: string;
  volumeObrigatorio: boolean;
  alturaObrigatorio: boolean;
  pesoObrigatorio: boolean;
  dataAlteracaoLaudo?: string;
  parametros: DadosDbParametroParsed[];
}

export interface DadosDbParametroParsed {
  sequencia: number;
  codigo: string;
  descricao: string;
  unidade?: string;
  casasDecimais?: number;
  tipo?: string;
  valoresReferencia: DadosDbValorReferenciaParsed[];
}

export interface DadosDbValorReferenciaParsed {
  sexo?: string;
  idadeInferior?: string;
  idadeSuperior?: string;
  valorReferencia?: string;
}

export interface DadosDbInformacoesExameParsed {
  codigo: string;
  nome: string;
  sinonimos?: string;
  codigoMaterial?: string;
  nomeMaterial?: string;
  interpretacao?: string;
  preco?: number;
  regioesColeta: string[];
  valoresReferencia: DadosDbValorReferenciaParsed[];
  producao: {
    volumeMinimo?: string;
    prazo?: string;
    realizacao?: string;
    meiosColeta?: string;
  };
  instrucoes: {
    preparo?: string[];
    coleta?: string[];
  };
}
