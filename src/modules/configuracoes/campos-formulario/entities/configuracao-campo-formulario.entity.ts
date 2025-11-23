import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TipoEntidadeEnum {
  CONVENIO = 'convenio',
  LABORATORIO = 'laboratorio',
  TELEMEDICINA = 'telemedicina',
  UNIDADE_SAUDE = 'unidade_saude',
  FORNECEDOR = 'fornecedor',
  PRESTADOR_SERVICO = 'prestador_servico',
}

export enum TipoFormularioEnum {
  CADASTRO_PACIENTE = 'cadastro_paciente',
  ORDEM_SERVICO = 'ordem_servico',
  TISS = 'tiss',
}

export enum CampoCadastroPacienteEnum {
  // Informações básicas (17 campos)
  FOTO = 'foto',
  CODIGO_INTERNO = 'codigo_interno',
  NOME = 'nome',
  NOME_SOCIAL = 'nome_social',
  USAR_NOME_SOCIAL = 'usar_nome_social',
  SEXO = 'sexo',
  DATA_NASCIMENTO = 'data_nascimento',
  NOME_MAE = 'nome_mae',
  PRONTUARIO = 'prontuario',
  RG = 'rg',
  CPF = 'cpf',
  ESTADO_CIVIL = 'estado_civil',
  EMAIL = 'email',
  CONTATOS = 'contatos',
  WHATSAPP = 'whatsapp',
  PROFISSAO = 'profissao',
  OBSERVACAO = 'observacao',

  // Informações do convênio (6 campos)
  CONVENIO = 'convenio',
  PLANO = 'plano',
  VALIDADE_CONVENIO = 'validade_convenio',
  MATRICULA = 'matricula',
  NOME_TITULAR = 'nome_titular',
  CARTAO_SUS = 'cartao_sus',

  // Endereço (7 campos)
  CEP = 'cep',
  RUA = 'rua',
  NUMERO = 'numero',
  BAIRRO = 'bairro',
  COMPLEMENTO = 'complemento',
  ESTADO = 'estado',
  CIDADE = 'cidade',
}

export enum CampoOrdemServicoEnum {
  // Campos da ordem de serviço (baseado no Figma)
  NUMERO_GUIA = 'numero_guia',
  GUIA_PRINCIPAL = 'guia_principal',
  GUIA_OPERADORA = 'guia_operadora',
  DATA_ULTIMA_MENSTRUACAO = 'data_ultima_menstruacao',
  CID = 'cid',
  LOCAL_ENTREGA = 'local_entrega',
  PLANO = 'plano',
  MEDICO_REQUISITANTE = 'medico_requisitante',
  ESPECIALIDADE_SOLICITANTE = 'especialidade_solicitante',
  DATA_SOLICITACAO = 'data_solicitacao',
}

export enum CampoTissEnum {
  // Campos TISS (baseado no Figma)
  DOENCA = 'doenca',
  REGIME_ATENDIMENTO = 'regime_atendimento',
  SAUDE_OCUPACIONAL = 'saude_ocupacional',
  TIPO_SAIDA = 'tipo_saida',
  TIPO_ATENDIMENTO = 'tipo_atendimento',
  COBERTURA_ESPECIAL = 'cobertura_especial',
}

// Union type de todos os campos possíveis
export type NomeCampoFormularioType =
  | CampoCadastroPacienteEnum
  | CampoOrdemServicoEnum
  | CampoTissEnum;

@Entity('configuracoes_campos_formulario')
@Index('IDX_config_campos_entidade', [
  'entidadeTipo',
  'entidadeId',
  'tipoFormulario',
])
export class ConfiguracaoCampoFormulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoEntidadeEnum,
    name: 'entidade_tipo',
    comment: 'Tipo da entidade: convenio, laboratorio, telemedicina, etc',
  })
  entidadeTipo: TipoEntidadeEnum;

  @Column({
    type: 'uuid',
    name: 'entidade_id',
    comment: 'ID da entidade (convenio_id, laboratorio_id, etc)',
  })
  entidadeId: string;

  @Column({
    type: 'enum',
    enum: TipoFormularioEnum,
    name: 'tipo_formulario',
    comment: 'Tipo do formulário: cadastro_paciente, ordem_servico, tiss',
  })
  tipoFormulario: TipoFormularioEnum;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nome_campo',
    comment:
      'Nome do campo no formulário (deve corresponder aos enums CampoCadastroPacienteEnum, CampoOrdemServicoEnum ou CampoTissEnum)',
  })
  nomeCampo: string; // Mantemos como string pois é union de 3 enums diferentes

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se o campo é obrigatório para esta entidade',
  })
  obrigatorio: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
