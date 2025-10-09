import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TipoAmostra {
  SANGUE = 'sangue',
  SORO = 'soro',
  PLASMA = 'plasma',
  URINA = 'urina',
  FEZES = 'fezes',
  SWAB = 'swab',
  LIQUOR = 'liquor',
  ESCARRO = 'escarro',
  TECIDO = 'tecido',
  SALIVA = 'saliva',
  SECRECAO = 'secrecao',
  OUTROS = 'outros',
}

export enum UnidadeVolume {
  ML = 'mL',
  L = 'L',
  G = 'g',
  MG = 'mg',
  UNIDADE = 'unidade',
}

export enum TemperaturaArmazenamento {
  AMBIENTE = 'ambiente', // 15-30°C
  REFRIGERADO = 'refrigerado', // 2-8°C
  CONGELADO = 'congelado', // -20°C
  ULTRACONGELADO = 'ultracongelado', // -80°C
  NITROGENIO = 'nitrogenio', // -196°C
  ESPECIAL = 'especial', // Temperatura customizada
}

export enum TemperaturaTransporte {
  AMBIENTE = 'ambiente',
  REFRIGERADO = 'refrigerado',
  CONGELADO = 'congelado',
  GELO_SECO = 'gelo_seco',
  NITROGENIO = 'nitrogenio',
}

/**
 * Entidade que representa um Tipo de Amostra Biológica
 *
 * Define as características de cada tipo de material biológico que pode ser coletado:
 * - Informações de identificação
 * - Instruções de coleta
 * - Preparo do paciente
 * - Condições de armazenamento
 * - Condições de transporte
 * - Configurações de etiquetagem
 */
@Entity('amostras')
@Index(['codigoInterno'])
@Index(['nome'])
@Index(['tipoAmostra'])
@Index(['empresaId'])
export class Amostra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Identificação
  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código único da amostra (ex: SANG-EDTA-001)',
  })
  codigoInterno: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome da amostra (ex: Sangue Total com EDTA)',
  })
  nome: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada da amostra',
  })
  descricao: string;

  @Column({
    name: 'tipo_amostra',
    type: 'enum',
    enum: TipoAmostra,
    comment: 'Tipo/categoria da amostra',
  })
  tipoAmostra: TipoAmostra;

  // Coleta
  @Column({
    name: 'recipiente_padrao',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Tipo de recipiente padrão (ex: Tubo EDTA, Frasco estéril)',
  })
  recipientePadrao: string;

  @Column({
    name: 'cor_tampa',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Cor da tampa do tubo (roxa, vermelha, amarela, etc)',
  })
  corTampa: string;

  @Column({
    name: 'volume_minimo',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Volume mínimo necessário',
  })
  volumeMinimo: number;

  @Column({
    name: 'volume_ideal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Volume ideal recomendado',
  })
  volumeIdeal: number;

  @Column({
    name: 'unidade_volume',
    type: 'enum',
    enum: UnidadeVolume,
    nullable: true,
    comment: 'Unidade de medida do volume',
  })
  unidadeVolume: UnidadeVolume;

  @Column({
    name: 'instrucoes_coleta',
    type: 'text',
    nullable: true,
    comment: 'Instruções detalhadas de coleta',
  })
  instrucoesColeta: string;

  @Column({
    name: 'materiais_necessarios',
    type: 'jsonb',
    nullable: true,
    comment: 'Array de materiais necessários para coleta',
  })
  materiaisNecessarios: string[];

  // Preparo do Paciente
  @Column({
    name: 'requer_jejum',
    type: 'boolean',
    default: false,
    comment: 'Se a coleta requer jejum do paciente',
  })
  requerJejum: boolean;

  @Column({
    name: 'tempo_jejum',
    type: 'integer',
    nullable: true,
    comment: 'Tempo de jejum necessário em horas',
  })
  tempoJejum: number;

  @Column({
    name: 'instrucoes_preparo_paciente',
    type: 'text',
    nullable: true,
    comment: 'Instruções de preparo do paciente (dieta, medicamentos, etc)',
  })
  instrucoesPreparoPaciente: string;

  @Column({
    name: 'restricoes',
    type: 'text',
    nullable: true,
    comment: 'Restrições (não fumar, não beber álcool, etc)',
  })
  restricoes: string;

  // Armazenamento
  @Column({
    name: 'temperatura_armazenamento',
    type: 'enum',
    enum: TemperaturaArmazenamento,
    nullable: true,
    comment: 'Faixa de temperatura de armazenamento',
  })
  temperaturaArmazenamento: TemperaturaArmazenamento;

  @Column({
    name: 'temperatura_min',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: 'Temperatura mínima de armazenamento em °C',
  })
  temperaturaMin: number;

  @Column({
    name: 'temperatura_max',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: 'Temperatura máxima de armazenamento em °C',
  })
  temperaturaMax: number;

  @Column({
    name: 'prazo_validade_horas',
    type: 'integer',
    nullable: true,
    comment: 'Prazo de validade da amostra em horas',
  })
  prazoValidadeHoras: number;

  @Column({
    name: 'condicoes_armazenamento',
    type: 'text',
    nullable: true,
    comment: 'Condições especiais de armazenamento',
  })
  condicoesArmazenamento: string;

  @Column({
    name: 'sensibilidade_luz',
    type: 'boolean',
    default: false,
    comment: 'Se a amostra é sensível à luz (proteger)',
  })
  sensibilidadeLuz: boolean;

  @Column({
    name: 'requer_centrifugacao',
    type: 'boolean',
    default: false,
    comment: 'Se a amostra requer centrifugação',
  })
  requerCentrifugacao: boolean;

  @Column({
    name: 'tempo_centrifugacao',
    type: 'integer',
    nullable: true,
    comment: 'Tempo de centrifugação em minutos',
  })
  tempoCentrifugacao: number;

  @Column({
    name: 'rotacao_centrifugacao',
    type: 'integer',
    nullable: true,
    comment: 'Rotação da centrífuga em RPM',
  })
  rotacaoCentrifugacao: number;

  // Transporte
  @Column({
    name: 'instrucoes_transporte',
    type: 'text',
    nullable: true,
    comment: 'Instruções de transporte',
  })
  instrucoesTransporte: string;

  @Column({
    name: 'temperatura_transporte',
    type: 'enum',
    enum: TemperaturaTransporte,
    nullable: true,
    comment: 'Condição de temperatura para transporte',
  })
  temperaturaTransporte: TemperaturaTransporte;

  @Column({
    name: 'embalagem_especial',
    type: 'boolean',
    default: false,
    comment: 'Se requer embalagem especial',
  })
  embalagemEspecial: boolean;

  @Column({
    name: 'observacoes_transporte',
    type: 'text',
    nullable: true,
    comment: 'Observações sobre transporte',
  })
  observacoesTransporte: string;

  // Etiquetagem
  @Column({
    name: 'cor_etiqueta',
    type: 'varchar',
    length: 7,
    nullable: true,
    comment: 'Cor da etiqueta em formato hexadecimal (ex: #FF0000)',
  })
  corEtiqueta: string;

  @Column({
    name: 'codigo_barras',
    type: 'boolean',
    default: true,
    comment: 'Se deve gerar código de barras na etiqueta',
  })
  codigoBarras: boolean;

  @Column({
    name: 'template_etiqueta',
    type: 'text',
    nullable: true,
    comment: 'Template customizado para impressão de etiqueta',
  })
  templateEtiqueta: string;

  // Controle
  @Column({
    name: 'exige_autorizacao',
    type: 'boolean',
    default: false,
    comment: 'Se a coleta exige autorização especial',
  })
  exigeAutorizacao: boolean;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações gerais',
  })
  observacoes: string;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se a amostra está ativa',
  })
  ativo: boolean;

  @Column({
    name: 'empresa_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID da empresa (multi-tenant)',
  })
  empresaId: string;

  // Auditoria
  @Column({
    name: 'criado_por',
    type: 'uuid',
    comment: 'ID do usuário que criou o registro',
  })
  criadoPor: string;

  @Column({
    name: 'atualizado_por',
    type: 'uuid',
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizadoPor: string;

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
