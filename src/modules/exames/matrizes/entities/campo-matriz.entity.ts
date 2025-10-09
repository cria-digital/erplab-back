import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MatrizExame } from './matriz-exame.entity';

export enum TipoCampoMatriz {
  TEXTO = 'texto',
  NUMERO = 'numero',
  DECIMAL = 'decimal',
  BOOLEAN = 'boolean',
  DATA = 'data',
  HORA = 'hora',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  TABELA = 'tabela', // Para matrizes dentro da matriz (ex: tabela de frequências na audiometria)
  IMAGEM = 'imagem', // Para gráficos/imagens (ex: curva audiométrica)
  CALCULADO = 'calculado', // Campo calculado automaticamente
  GRUPO = 'grupo', // Agrupador de campos
}

export enum UnidadeMedida {
  DB = 'dB', // Decibéis (audiometria)
  HZ = 'Hz', // Hertz (frequências)
  MMHG = 'mmHg', // Milímetros de mercúrio (pressão)
  ML = 'mL', // Mililitros
  G_DL = 'g/dL', // Gramas por decilitro
  MG_DL = 'mg/dL', // Miligramas por decilitro
  MM = 'mm', // Milímetros
  CM = 'cm', // Centímetros
  KG = 'kg', // Quilogramas
  PORCENTAGEM = '%',
  BPM = 'bpm', // Batimentos por minuto
  SCORE = 'score', // Pontuação (densitometria)
  PERSONALIZADA = 'personalizada',
}

/**
 * Entidade que representa um Campo/Parâmetro de uma Matriz
 *
 * Define cada campo que compõe uma matriz de exame:
 * - Nome e tipo do campo
 * - Valores de referência (quando aplicável)
 * - Validações
 * - Posicionamento no layout
 * - Fórmulas de cálculo
 */
@Entity('campos_matriz')
@Index(['matrizId'])
@Index(['codigoCampo'])
@Index(['ordemExibicao'])
export class CampoMatriz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com a Matriz
  @Column({
    name: 'matriz_id',
    type: 'uuid',
    comment: 'ID da matriz à qual este campo pertence',
  })
  matrizId: string;

  @ManyToOne(() => MatrizExame, (matriz) => matriz.campos)
  @JoinColumn({ name: 'matriz_id' })
  matriz: MatrizExame;

  // Identificação e tipo
  @Column({
    name: 'codigo_campo',
    type: 'varchar',
    length: 100,
    comment: 'Código único do campo dentro da matriz (ex: audio_od_500hz)',
  })
  codigoCampo: string;

  @Column({
    name: 'label',
    type: 'varchar',
    length: 255,
    comment: 'Rótulo/label do campo (ex: Orelha Direita 500Hz)',
  })
  label: string;

  @Column({
    name: 'tipo_campo',
    type: 'enum',
    enum: TipoCampoMatriz,
    comment: 'Tipo do campo',
  })
  tipoCampo: TipoCampoMatriz;

  @Column({
    name: 'placeholder',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Texto de placeholder',
  })
  placeholder: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição/ajuda do campo',
  })
  descricao: string;

  // Valores e opções
  @Column({
    name: 'opcoes',
    type: 'jsonb',
    nullable: true,
    comment:
      'Opções para campos select/radio/checkbox (array de {value, label})',
  })
  opcoes: Array<{ value: string | number; label: string }>;

  @Column({
    name: 'valor_padrao',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Valor padrão do campo',
  })
  valorPadrao: string;

  // Unidade de medida e valores de referência
  @Column({
    name: 'unidade_medida',
    type: 'enum',
    enum: UnidadeMedida,
    nullable: true,
    comment: 'Unidade de medida do campo',
  })
  unidadeMedida: UnidadeMedida;

  @Column({
    name: 'unidade_medida_customizada',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment:
      'Unidade de medida customizada (quando unidadeMedida = PERSONALIZADA)',
  })
  unidadeMedidaCustomizada: string;

  @Column({
    name: 'valor_referencia_min',
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    comment: 'Valor mínimo de referência',
  })
  valorReferenciaMin: number;

  @Column({
    name: 'valor_referencia_max',
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    comment: 'Valor máximo de referência',
  })
  valorReferenciaMax: number;

  @Column({
    name: 'texto_referencia',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Texto descritivo dos valores de referência',
  })
  textoReferencia: string;

  // Validações
  @Column({
    name: 'obrigatorio',
    type: 'boolean',
    default: false,
    comment: 'Se o campo é obrigatório',
  })
  obrigatorio: boolean;

  @Column({
    name: 'valor_min',
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    comment: 'Valor mínimo permitido (validação)',
  })
  valorMin: number;

  @Column({
    name: 'valor_max',
    type: 'decimal',
    precision: 15,
    scale: 5,
    nullable: true,
    comment: 'Valor máximo permitido (validação)',
  })
  valorMax: number;

  @Column({
    name: 'mascara',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Máscara de formatação (ex: ##/##/####)',
  })
  mascara: string;

  @Column({
    name: 'regex_validacao',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Expressão regular para validação customizada',
  })
  regexValidacao: string;

  @Column({
    name: 'mensagem_validacao',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Mensagem de erro de validação customizada',
  })
  mensagemValidacao: string;

  // Cálculos e fórmulas
  @Column({
    name: 'formula_calculo',
    type: 'text',
    nullable: true,
    comment: 'Fórmula para cálculo automático (ex: {campo1} + {campo2} * 2)',
  })
  formulaCalculo: string;

  @Column({
    name: 'campos_dependentes',
    type: 'jsonb',
    nullable: true,
    comment: 'Array de IDs de campos dos quais este depende para cálculo',
  })
  camposDependentes: string[];

  // Layout e visualização
  @Column({
    name: 'ordem_exibicao',
    type: 'integer',
    default: 0,
    comment: 'Ordem de exibição do campo',
  })
  ordemExibicao: number;

  @Column({
    name: 'linha',
    type: 'integer',
    nullable: true,
    comment: 'Linha no grid de layout (para posicionamento)',
  })
  linha: number;

  @Column({
    name: 'coluna',
    type: 'integer',
    nullable: true,
    comment: 'Coluna no grid de layout (para posicionamento)',
  })
  coluna: number;

  @Column({
    name: 'largura',
    type: 'integer',
    nullable: true,
    comment: 'Largura do campo em colunas do grid',
  })
  largura: number;

  @Column({
    name: 'visivel',
    type: 'boolean',
    default: true,
    comment: 'Se o campo é visível',
  })
  visivel: boolean;

  @Column({
    name: 'somente_leitura',
    type: 'boolean',
    default: false,
    comment: 'Se o campo é somente leitura (calculado ou bloqueado)',
  })
  somenteLeitura: boolean;

  @Column({
    name: 'destacar_alterado',
    type: 'boolean',
    default: true,
    comment: 'Se deve destacar quando valor está fora da referência',
  })
  destacarAlterado: boolean;

  // Agrupamento
  @Column({
    name: 'grupo',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Nome do grupo ao qual o campo pertence (para organização)',
  })
  grupo: string;

  @Column({
    name: 'secao',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Nome da seção ao qual o campo pertence (nível acima do grupo)',
  })
  secao: string;

  // Configurações adicionais
  @Column({
    name: 'configuracoes',
    type: 'jsonb',
    nullable: true,
    comment: 'Configurações adicionais específicas do campo',
  })
  configuracoes: Record<string, any>;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se o campo está ativo',
  })
  ativo: boolean;

  // Auditoria
  @CreateDateColumn({
    name: 'criado_em',
    comment: 'Data de criação do registro',
  })
  criadoEm: Date;

  @UpdateDateColumn({
    name: 'atualizado_em',
    comment: 'Data da última atualização',
  })
  atualizadoEm: Date;
}
