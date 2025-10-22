import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Formulario } from './formulario.entity';
import { AlternativaCampo } from './alternativa-campo.entity';

// Enum para campos padrão do sistema (identificadores estáticos)
export enum CamposPadraoSistema {
  // Unidades de Medida e Quantidades
  UNIDADE_MEDIDA = 'UNIDADE_MEDIDA',
  TIPO_UNIDADE = 'TIPO_UNIDADE',

  // Dados do Paciente
  TIPO_SANGUE = 'TIPO_SANGUE',
  GENERO = 'GENERO',
  COR_RACA = 'COR_RACA',
  ESTADO_CIVIL = 'ESTADO_CIVIL',
  ESCOLARIDADE = 'ESCOLARIDADE',
  PROFISSAO = 'PROFISSAO',

  // Dados de Exame/Amostra
  TIPO_AMOSTRA = 'TIPO_AMOSTRA',
  METODO_COLETA = 'METODO_COLETA',
  TIPO_RECIPIENTE = 'TIPO_RECIPIENTE',
  CONDICAO_JEJUM = 'CONDICAO_JEJUM',
  PREPARO_PACIENTE = 'PREPARO_PACIENTE',

  // Dados Clínicos
  SINTOMAS = 'SINTOMAS',
  MEDICAMENTOS_USO = 'MEDICAMENTOS_USO',
  ALERGIAS = 'ALERGIAS',
  HISTORICO_FAMILIAR = 'HISTORICO_FAMILIAR',
  COMORBIDADES = 'COMORBIDADES',

  // Resultados e Interpretações
  RESULTADO_QUALITATIVO = 'RESULTADO_QUALITATIVO',
  INTERPRETACAO = 'INTERPRETACAO',
  OBSERVACOES_TECNICAS = 'OBSERVACOES_TECNICAS',
  CONCLUSAO_LAUDO = 'CONCLUSAO_LAUDO',

  // Controles e Status
  STATUS_EXAME = 'STATUS_EXAME',
  PRIORIDADE = 'PRIORIDADE',
  URGENCIA = 'URGENCIA',

  // Outros
  SIM_NAO = 'SIM_NAO',
  PRESENCA_AUSENCIA = 'PRESENCA_AUSENCIA',
  POSITIVO_NEGATIVO = 'POSITIVO_NEGATIVO',
}

// Tipo do campo (sistema ou customizado)
export enum TipoCampoPadrao {
  SISTEMA = 'sistema', // Campo padrão do sistema (código fixo)
  CUSTOMIZADO = 'customizado', // Campo criado pelo usuário
}

export enum TipoCampo {
  // Campos de texto
  TEXTO = 'texto',
  TEXTO_LONGO = 'texto_longo',
  TEXTO_RICO = 'texto_rico',
  EMAIL = 'email',
  URL = 'url',
  TELEFONE = 'telefone',
  CPF = 'cpf',
  CNPJ = 'cnpj',
  CEP = 'cep',

  // Campos numéricos
  NUMERO = 'numero',
  DECIMAL = 'decimal',
  MOEDA = 'moeda',
  PORCENTAGEM = 'porcentagem',

  // Campos de data/hora
  DATA = 'data',
  HORA = 'hora',
  DATA_HORA = 'data_hora',
  PERIODO_DATA = 'periodo_data',

  // Campos de seleção
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  MULTIPLA_ESCOLHA = 'multipla_escolha',

  // Campos especiais
  ARQUIVO = 'arquivo',
  IMAGEM = 'imagem',
  ASSINATURA = 'assinatura',
  LOCALIZACAO = 'localizacao',
  CODIGO_BARRAS = 'codigo_barras',
  QR_CODE = 'qr_code',

  // Campos de layout
  SECAO = 'secao',
  SEPARADOR = 'separador',
  TITULO = 'titulo',
  PARAGRAFO = 'paragrafo',
  HTML = 'html',

  // Campos complexos
  TABELA = 'tabela',
  LISTA = 'lista',
  MATRIZ = 'matriz',
  FORMULA = 'formula',
  CONDICIONAL = 'condicional',
}

export enum StatusCampo {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  OCULTO = 'oculto',
}

@Entity('campos_formulario')
@Index(['formularioId', 'ordem'])
@Index(['tipoCampo'])
@Index(['codigoCampo'], { unique: true })
export class CampoFormulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'formulario_id',
  })
  formularioId: string;

  @ManyToOne(() => Formulario, (formulario) => formulario.campos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'formulario_id' })
  formulario: Formulario;

  // Tipo do campo (sistema ou customizado)
  @Column({
    type: 'enum',
    enum: TipoCampoPadrao,
    name: 'tipo_campo_padrao',
    default: TipoCampoPadrao.CUSTOMIZADO,
  })
  tipoCampoPadrao: TipoCampoPadrao;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'codigo_campo',
    unique: true,
  })
  codigoCampo: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'nome_campo',
  })
  nomeCampo: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descricao: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  placeholder: string;

  @Column({
    type: 'text',
    name: 'texto_ajuda',
    nullable: true,
  })
  textoAjuda: string;

  @Column({
    type: 'enum',
    enum: TipoCampo,
    name: 'tipo_campo',
  })
  tipoCampo: TipoCampo;

  @Column({
    type: 'int',
    default: 0,
  })
  ordem: number;

  // Validações
  @Column({
    type: 'boolean',
    default: false,
  })
  obrigatorio: boolean;

  @Column({
    type: 'boolean',
    name: 'somente_leitura',
    default: false,
  })
  somenteLeitura: boolean;

  @Column({
    type: 'int',
    name: 'tamanho_minimo',
    nullable: true,
  })
  tamanhoMinimo: number;

  @Column({
    type: 'int',
    name: 'tamanho_maximo',
    nullable: true,
  })
  tamanhoMaximo: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'valor_minimo',
    nullable: true,
  })
  valorMinimo: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    name: 'valor_maximo',
    nullable: true,
  })
  valorMaximo: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  mascara: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  regex: string;

  @Column({
    type: 'text',
    name: 'mensagem_erro',
    nullable: true,
  })
  mensagemErro: string;

  // Valores padrão
  @Column({
    type: 'text',
    name: 'valor_padrao',
    nullable: true,
  })
  valorPadrao: string;

  @Column({
    type: 'jsonb',
    name: 'opcoes_selecao',
    nullable: true,
  })
  opcoesSelecao: any;

  @Column({
    type: 'boolean',
    name: 'permite_multipla_selecao',
    default: false,
  })
  permiteMultiplaSelecao: boolean;

  @Column({
    type: 'boolean',
    name: 'permite_outro',
    default: false,
  })
  permiteOutro: boolean;

  // Configurações de arquivo
  @Column({
    type: 'jsonb',
    name: 'tipos_arquivo_aceitos',
    nullable: true,
  })
  tiposArquivoAceitos: string[];

  @Column({
    type: 'int',
    name: 'tamanho_maximo_arquivo_mb',
    nullable: true,
  })
  tamanhoMaximoArquivoMb: number;

  @Column({
    type: 'boolean',
    name: 'permite_multiplos_arquivos',
    default: false,
  })
  permiteMultiplosArquivos: boolean;

  @Column({
    type: 'int',
    name: 'max_arquivos',
    nullable: true,
  })
  maxArquivos: number;

  // Layout e aparência
  @Column({
    type: 'int',
    name: 'largura_coluna',
    default: 12,
  })
  larguraColuna: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'alinhamento',
    default: 'left',
  })
  alinhamento: string;

  @Column({
    type: 'jsonb',
    name: 'estilos_css',
    nullable: true,
  })
  estilosCss: any;

  @Column({
    type: 'jsonb',
    name: 'classes_css',
    nullable: true,
  })
  classesCss: string[];

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  icone: string;

  // Lógica condicional
  @Column({
    type: 'jsonb',
    name: 'condicoes_visibilidade',
    nullable: true,
  })
  condicoesVisibilidade: any;

  @Column({
    type: 'jsonb',
    name: 'condicoes_obrigatoriedade',
    nullable: true,
  })
  condicoesObrigatoriedade: any;

  @Column({
    type: 'jsonb',
    name: 'condicoes_validacao',
    nullable: true,
  })
  condicoesValidacao: any;

  @Column({
    type: 'text',
    name: 'formula_calculo',
    nullable: true,
  })
  formulaCalculo: string;

  // Dependências
  @Column({
    type: 'jsonb',
    name: 'campos_dependentes',
    nullable: true,
  })
  camposDependentes: string[];

  @Column({
    type: 'jsonb',
    name: 'depende_de',
    nullable: true,
  })
  dependeDe: string[];

  // Integração
  @Column({
    type: 'varchar',
    length: 255,
    name: 'campo_integracao',
    nullable: true,
  })
  campoIntegracao: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_busca_dados',
    nullable: true,
  })
  urlBuscaDados: string;

  @Column({
    type: 'jsonb',
    name: 'mapeamento_dados',
    nullable: true,
  })
  mapeamentoDados: any;

  // Unidades de medida (para campos de exames)
  @Column({
    type: 'varchar',
    length: 50,
    name: 'unidade_medida',
    nullable: true,
  })
  unidadeMedida: string;

  @Column({
    type: 'jsonb',
    name: 'valores_referencia',
    nullable: true,
  })
  valoresReferencia: any;

  // Status e controle
  @Column({
    type: 'enum',
    enum: StatusCampo,
    default: StatusCampo.ATIVO,
  })
  status: StatusCampo;

  @Column({
    type: 'boolean',
    default: true,
  })
  ativo: boolean;

  @Column({
    type: 'boolean',
    name: 'visivel_impressao',
    default: true,
  })
  visivelImpressao: boolean;

  @Column({
    type: 'boolean',
    name: 'visivel_portal',
    default: true,
  })
  visivelPortal: boolean;

  // Relacionamento com alternativas
  @OneToMany(
    () => AlternativaCampo,
    (alternativa) => alternativa.campoFormulario,
    {
      cascade: true,
    },
  )
  alternativas: AlternativaCampo[];

  // Metadados e configurações extras
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadados: any;

  @Column({
    type: 'jsonb',
    name: 'configuracoes_extras',
    nullable: true,
  })
  configuracoesExtras: any;

  @Column({
    type: 'text',
    nullable: true,
  })
  observacoes: string;

  // Auditoria
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'created_by',
    nullable: true,
  })
  createdBy: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'updated_by',
    nullable: true,
  })
  updatedBy: string;
}
