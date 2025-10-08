export enum DiaSemanaEnum {
  SEG = 'SEG',
  TER = 'TER',
  QUA = 'QUA',
  QUI = 'QUI',
  SEX = 'SEX',
  SAB = 'SAB',
  DOM = 'DOM',
  FERIADOS = 'FERIADOS',
}

export enum PeriodoEnum {
  MANHA = 'MANHA',
  TARDE = 'TARDE',
  NOITE = 'NOITE',
  INTEGRAL = 'INTEGRAL',
}

export enum StatusAgendaEnum {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export enum TipoVinculacaoEnum {
  ESPECIALIDADE = 'ESPECIALIDADE',
  SETOR = 'SETOR',
  PROFISSIONAL = 'PROFISSIONAL',
  EQUIPAMENTO = 'EQUIPAMENTO',
}

export enum PrazoLembreteEnum {
  HORAS = 'HORAS',
  DIAS = 'DIAS',
}

export enum TipoIntegracaoEnum {
  API = 'API',
  WEBHOOK = 'WEBHOOK',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}
