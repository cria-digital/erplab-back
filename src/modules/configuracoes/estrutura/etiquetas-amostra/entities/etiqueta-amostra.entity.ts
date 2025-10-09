import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';

export enum OrientacaoEtiqueta {
  RETRATO = 'retrato',
  PAISAGEM = 'paisagem',
}

export enum TipoImpressora {
  TERMICA = 'termica',
  LASER = 'laser',
  JATO_TINTA = 'jato_tinta',
  MATRICIAL = 'matricial',
  ZEBRA = 'zebra',
}

/**
 * Entidade que representa um Template de Etiqueta de Amostra
 *
 * Define os templates de etiquetas para identificação de amostras:
 * - Layout (tamanho, margens, orientação)
 * - Campos a serem exibidos
 * - Código de barras e QR Code
 * - Templates específicos por impressora (ZPL, EPL, HTML)
 * - Suporte a diferentes tipos de impressora
 */
@Entity('etiquetas_amostra')
@Index(['nome'])
@Index(['tipoImpressora'])
@Index(['unidadeId'])
@Index(['empresaId'])
export class EtiquetaAmostra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Identificação
  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome do template de etiqueta',
  })
  nome: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição do template',
  })
  descricao: string;

  // Layout - Dimensões
  @Column({
    name: 'largura_mm',
    type: 'decimal',
    precision: 5,
    scale: 2,
    comment: 'Largura da etiqueta em milímetros',
  })
  larguraMm: number;

  @Column({
    name: 'altura_mm',
    type: 'decimal',
    precision: 5,
    scale: 2,
    comment: 'Altura da etiqueta em milímetros',
  })
  alturaMm: number;

  @Column({
    name: 'orientacao',
    type: 'enum',
    enum: OrientacaoEtiqueta,
    default: OrientacaoEtiqueta.RETRATO,
    comment: 'Orientação da etiqueta',
  })
  orientacao: OrientacaoEtiqueta;

  // Layout - Margens
  @Column({
    name: 'margem_topo_mm',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: 'Margem superior em milímetros',
  })
  margemTopoMm: number;

  @Column({
    name: 'margem_direita_mm',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: 'Margem direita em milímetros',
  })
  margemDireitaMm: number;

  @Column({
    name: 'margem_inferior_mm',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: 'Margem inferior em milímetros',
  })
  margemInferiorMm: number;

  @Column({
    name: 'margem_esquerda_mm',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    comment: 'Margem esquerda em milímetros',
  })
  margemEsquerdaMm: number;

  // Conteúdo
  @Column({
    name: 'campos',
    type: 'jsonb',
    comment:
      'Array de campos a serem exibidos (ex: [{"campo": "nome_paciente", "posicao": "topo", "tamanho": 12}])',
  })
  campos: object;

  @Column({
    name: 'exibir_codigo_barras',
    type: 'boolean',
    default: true,
    comment: 'Se deve exibir código de barras',
  })
  exibirCodigoBarras: boolean;

  @Column({
    name: 'tipo_codigo_barras',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Tipo do código de barras (CODE128, QR_CODE, etc)',
  })
  tipoCodigoBarras: string;

  @Column({
    name: 'exibir_logo',
    type: 'boolean',
    default: false,
    comment: 'Se deve exibir logo da empresa',
  })
  exibirLogo: boolean;

  @Column({
    name: 'url_logo',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'URL da logo (se aplicável)',
  })
  urlLogo: string;

  // Templates por tipo de impressora
  @Column({
    name: 'template_zpl',
    type: 'text',
    nullable: true,
    comment: 'Template ZPL (Zebra Programming Language) para impressoras Zebra',
  })
  templateZpl: string;

  @Column({
    name: 'template_epl',
    type: 'text',
    nullable: true,
    comment:
      'Template EPL (Eltron Programming Language) para impressoras Eltron',
  })
  templateEpl: string;

  @Column({
    name: 'template_html',
    type: 'text',
    nullable: true,
    comment: 'Template HTML para impressão via navegador',
  })
  templateHtml: string;

  @Column({
    name: 'template_css',
    type: 'text',
    nullable: true,
    comment: 'CSS customizado para o template HTML',
  })
  templateCss: string;

  // Configurações da impressora
  @Column({
    name: 'tipo_impressora',
    type: 'enum',
    enum: TipoImpressora,
    default: TipoImpressora.TERMICA,
    comment: 'Tipo de impressora recomendada',
  })
  tipoImpressora: TipoImpressora;

  @Column({
    name: 'velocidade_impressao',
    type: 'integer',
    nullable: true,
    comment: 'Velocidade de impressão (para impressoras térmicas)',
  })
  velocidadeImpressao: number;

  @Column({
    name: 'temperatura_impressao',
    type: 'integer',
    nullable: true,
    comment: 'Temperatura de impressão (para impressoras térmicas)',
  })
  temperaturaImpressao: number;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações sobre o template',
  })
  observacoes: string;

  // Controle
  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se o template está ativo',
  })
  ativo: boolean;

  @Column({
    name: 'padrao',
    type: 'boolean',
    default: false,
    comment: 'Se é o template padrão',
  })
  padrao: boolean;

  @Column({
    name: 'unidade_id',
    type: 'uuid',
    comment: 'ID da unidade de saúde',
  })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

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
