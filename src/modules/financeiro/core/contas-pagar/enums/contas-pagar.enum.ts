export enum CredorTipo {
  EMPRESA = 'empresa',
  PRESTADOR_SERVICO = 'prestador_servico',
  FORNECEDOR = 'fornecedor',
  PROFISSIONAL = 'profissional',
}

export enum TipoDocumento {
  NOTA_FISCAL = 'nota_fiscal',
  FOLHA_PAGAMENTO = 'folha_pagamento',
  BOLETO = 'boleto',
  RECIBO = 'recibo',
  CONTRATO = 'contrato',
  OUTROS = 'outros',
}

export enum StatusContaPagar {
  A_PAGAR = 'a_pagar',
  PAGA = 'paga',
  AGENDADA = 'agendada',
  PARCIALMENTE_PAGA = 'parcialmente_paga',
  CANCELADA = 'cancelada',
  VENCIDA = 'vencida',
}

export enum TipoImposto {
  ISS = 'iss',
  IRRF = 'irrf',
  CSLL = 'csll',
  PIS = 'pis',
  COFINS = 'cofins',
  IBS = 'ibs',
  CBS = 'cbs',
}

export enum StatusParcela {
  PENDENTE = 'pendente',
  PAGA = 'paga',
  AGENDADA = 'agendada',
  VENCIDA = 'vencida',
  CANCELADA = 'cancelada',
}

export enum FormaPagamentoParcela {
  BOLETO = 'boleto',
  PIX = 'pix',
  CARTAO_CREDITO = 'cartao_credito',
  TED = 'ted',
  DOC = 'doc',
  TRANSFERENCIA = 'transferencia',
  CAIXA = 'caixa',
  CHEQUE = 'cheque',
}

export enum Periodicidade {
  MENSAL = 'mensal',
  QUINZENAL = 'quinzenal',
  SEMANAL = 'semanal',
  PERSONALIZADO = 'personalizado',
}

export enum TipoAnexo {
  BOLETO = 'boleto',
  NOTA_FISCAL = 'nota_fiscal',
  CONTRATO = 'contrato',
  COMPROVANTE_PAGAMENTO = 'comprovante_pagamento',
  OUTROS = 'outros',
}

export enum StatusRepasse {
  ATIVO = 'ativo',
  PROCESSADO = 'processado',
  CANCELADO = 'cancelado',
}

export enum EntidadeTipoFiltro {
  MEDICO = 'medico',
  ESPECIALIDADE = 'especialidade',
  SETOR = 'setor',
  EXAME = 'exame',
}
