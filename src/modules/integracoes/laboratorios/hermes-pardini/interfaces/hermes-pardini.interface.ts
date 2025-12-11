/**
 * Interfaces para integração Hermes Pardini Lab-to-Lab
 */

/**
 * Configuração do Hermes Pardini
 */
export interface HermesPardiniConfig {
  login: string;
  senha: string;
  ambiente: 'homologacao' | 'producao';
  urlWebservice: string;
  valorReferencia: 0 | 1 | 2;
  papelTimbrado: 0 | 1;
  versaoResultado: number;
  timeout: number;
  codigoCliente?: string;
}

/**
 * Resposta genérica do webservice
 */
export interface HermesPardiniResponse<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  codigoErro?: string;
  xmlRequest?: string;
  xmlResponse?: string;
}

/**
 * Paciente para envio de pedido
 */
export interface HermesPardiniPaciente {
  nome: string;
  dataNascimento: string; // DD/MM/YYYY
  sexo: 'M' | 'F';
  cpf?: string;
  rg?: string;
  telefone?: string;
  email?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  };
}

/**
 * Exame para envio de pedido
 */
export interface HermesPardiniExame {
  codigoExame: string;
  materialCodigo?: string;
  observacao?: string;
}

/**
 * Pedido para envio
 */
export interface HermesPardiniPedido {
  codigoPedidoLab: string; // Código interno do laboratório
  dataColeta: string; // DD/MM/YYYY
  horaColeta?: string; // HH:MM
  paciente: HermesPardiniPaciente;
  exames: HermesPardiniExame[];
  medicoSolicitante?: {
    nome: string;
    crm: string;
    uf: string;
  };
  convenio?: {
    codigo: string;
    plano?: string;
    matricula?: string;
  };
  urgente?: boolean;
  observacoes?: string;
}

/**
 * Resposta do envio de pedido
 */
export interface HermesPardiniPedidoResponse {
  codigoPedidoApoio: string;
  anoPedidoApoio: number;
  codigoPedidoLab: string;
  status: string;
  mensagem?: string;
  etiquetas?: HermesPardiniEtiqueta[];
}

/**
 * Etiqueta de amostra
 */
export interface HermesPardiniEtiqueta {
  codigoBarras: string;
  material: string;
  tubo: string;
  corTampa?: string;
  quantidade?: number;
  exames: string[];
}

/**
 * Parâmetros para consulta de resultado
 */
export interface HermesPardiniConsultaResultado {
  anoCodPedApoio: number;
  codPedApoio: string;
  codExmApoio?: string;
  pdf?: boolean;
  versaoResultado?: number;
  papelTimbrado?: boolean;
  valorReferencia?: 0 | 1 | 2;
}

/**
 * Resultado de exame
 */
export interface HermesPardiniResultado {
  codigoPedidoApoio: string;
  anoPedidoApoio: number;
  codigoPedidoLab: string;
  status: string;
  dataLiberacao?: string;
  exames: HermesPardiniResultadoExame[];
  pdfBase64?: string;
}

/**
 * Resultado de um exame específico
 */
export interface HermesPardiniResultadoExame {
  codigoExame: string;
  nomeExame: string;
  status: string;
  dataLiberacao?: string;
  resultados: HermesPardiniResultadoItem[];
  observacoes?: string;
  metodologia?: string;
}

/**
 * Item de resultado (analito)
 */
export interface HermesPardiniResultadoItem {
  analito: string;
  resultado: string;
  unidade?: string;
  valorReferencia?: string;
  valorReferenciaMin?: string;
  valorReferenciaMax?: string;
  flag?: 'N' | 'A' | 'B' | 'C'; // Normal, Alto, Baixo, Crítico
}

/**
 * Parâmetros para cancelamento de amostra
 */
export interface HermesPardiniCancelamentoAmostra {
  anoCodPedApoio: number;
  codPedApoio: string;
  codigoBarras: string;
  motivo: string;
}

/**
 * Resposta do cancelamento
 */
export interface HermesPardiniCancelamentoResponse {
  sucesso: boolean;
  codigoPedidoApoio: string;
  codigoBarras?: string;
  codigoExame?: string;
  mensagem: string;
}

/**
 * Parâmetros para cancelamento de exame
 */
export interface HermesPardiniCancelamentoExame {
  anoCodPedApoio: number;
  codPedApoio: string;
  codigoExame: string;
  motivo: string;
}

/**
 * Pendência técnica
 */
export interface HermesPardiniPendenciaTecnica {
  codigoPedidoApoio: string;
  anoPedidoApoio: number;
  codigoExame: string;
  nomeExame: string;
  tipoPendencia: string;
  descricao: string;
  dataPendencia: string;
  status: string;
}

/**
 * Rastreabilidade de amostra
 */
export interface HermesPardiniRastreabilidade {
  codigoPedidoApoio: string;
  anoPedidoApoio: number;
  codigoBarras: string;
  eventos: HermesPardiniEventoRastreio[];
}

/**
 * Evento de rastreio
 */
export interface HermesPardiniEventoRastreio {
  data: string;
  hora: string;
  evento: string;
  local?: string;
  usuario?: string;
  observacao?: string;
}

/**
 * Grupo de fracionamento
 */
export interface HermesPardiniGrupoFracionamento {
  codigo: string;
  nome: string;
  exames: {
    codigoExame: string;
    nomeExame: string;
  }[];
}

/**
 * Status do pedido
 */
export interface HermesPardiniStatusPedido {
  codigoPedidoApoio: string;
  anoPedidoApoio: number;
  codigoPedidoLab: string;
  status: HermesPardiniStatusEnum;
  dataStatus: string;
  exames: {
    codigoExame: string;
    nomeExame: string;
    status: HermesPardiniStatusEnum;
    dataStatus: string;
  }[];
}

/**
 * Enum de status
 */
export enum HermesPardiniStatusEnum {
  AGUARDANDO_AMOSTRA = 'AGUARDANDO_AMOSTRA',
  AMOSTRA_RECEBIDA = 'AMOSTRA_RECEBIDA',
  EM_ANALISE = 'EM_ANALISE',
  PARCIALMENTE_LIBERADO = 'PARCIALMENTE_LIBERADO',
  LIBERADO = 'LIBERADO',
  CANCELADO = 'CANCELADO',
  PENDENCIA_TECNICA = 'PENDENCIA_TECNICA',
}
