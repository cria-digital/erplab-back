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
import { TipoExame } from '../../exames/entities/tipo-exame.entity';
import { Exame } from '../../exames/entities/exame.entity';
import { CampoMatriz } from './campo-matriz.entity';

export enum TipoMatriz {
  AUDIOMETRIA = 'audiometria',
  DENSITOMETRIA = 'densitometria',
  ELETROCARDIOGRAMA = 'eletrocardiograma',
  HEMOGRAMA = 'hemograma',
  ESPIROMETRIA = 'espirometria',
  ACUIDADE_VISUAL = 'acuidade_visual',
  PERSONALIZADA = 'personalizada',
}

export enum StatusMatriz {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  EM_DESENVOLVIMENTO = 'em_desenvolvimento',
}

/**
 * Entidade que representa uma Matriz de Exame
 *
 * Matrizes são templates/formulários padronizados para tipos específicos de exames.
 * Cada matriz define:
 * - Campos/parâmetros que devem ser preenchidos
 * - Valores de referência
 * - Fórmulas de cálculo (quando aplicável)
 * - Layout de visualização/impressão
 *
 * Exemplos: Audiometria, Densitometria, Eletrocardiograma, Hemograma
 */
@Entity('matrizes_exames')
@Index(['codigoInterno'])
@Index(['nome'])
@Index(['tipoMatriz'])
@Index(['tipoExameId'])
export class MatrizExame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno único da matriz (ex: MTZ-AUDIO-001)',
  })
  codigoInterno: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome da matriz (ex: Audiometria Tonal Padrão)',
  })
  nome: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada da matriz e sua finalidade',
  })
  descricao: string;

  @Column({
    name: 'tipo_matriz',
    type: 'enum',
    enum: TipoMatriz,
    comment: 'Tipo/categoria da matriz',
  })
  tipoMatriz: TipoMatriz;

  // Relacionamento com TipoExame
  @Column({
    name: 'tipo_exame_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do tipo de exame ao qual esta matriz pertence',
  })
  tipoExameId: string;

  @ManyToOne(() => TipoExame, { nullable: true })
  @JoinColumn({ name: 'tipo_exame_id' })
  tipoExame: TipoExame;

  // Relacionamento com Exame (pode ser vinculada a exames específicos)
  @Column({
    name: 'exame_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do exame específico (opcional, para matrizes exclusivas)',
  })
  exameId: string;

  @ManyToOne(() => Exame, { nullable: true })
  @JoinColumn({ name: 'exame_id' })
  exame: Exame;

  @Column({
    name: 'versao',
    type: 'varchar',
    length: 20,
    default: '1.0',
    comment: 'Versão da matriz (para controle de mudanças)',
  })
  versao: string;

  @Column({
    name: 'padrao_sistema',
    type: 'boolean',
    default: false,
    comment: 'Se é uma matriz padrão do sistema (não pode ser deletada)',
  })
  padraoSistema: boolean;

  // Configurações de visualização e cálculo
  @Column({
    name: 'tem_calculo_automatico',
    type: 'boolean',
    default: false,
    comment: 'Se possui cálculos automáticos entre campos',
  })
  temCalculoAutomatico: boolean;

  @Column({
    name: 'formulas_calculo',
    type: 'jsonb',
    nullable: true,
    comment: 'Fórmulas de cálculo em JSON (campo_destino: formula)',
  })
  formulasCalculo: Record<string, string>;

  @Column({
    name: 'layout_visualizacao',
    type: 'jsonb',
    nullable: true,
    comment: 'Configurações de layout para visualização (grid, posicionamento)',
  })
  layoutVisualizacao: Record<string, any>;

  @Column({
    name: 'template_impressao',
    type: 'text',
    nullable: true,
    comment: 'Template HTML/Handlebars para impressão do laudo',
  })
  templateImpressao: string;

  // Validações e regras
  @Column({
    name: 'requer_assinatura_digital',
    type: 'boolean',
    default: true,
    comment: 'Se requer assinatura digital do responsável técnico',
  })
  requerAssinaturaDigital: boolean;

  @Column({
    name: 'permite_edicao_apos_liberacao',
    type: 'boolean',
    default: false,
    comment: 'Se permite edição após liberação do resultado',
  })
  permiteEdicaoAposLiberacao: boolean;

  @Column({
    name: 'regras_validacao',
    type: 'jsonb',
    nullable: true,
    comment: 'Regras de validação customizadas em JSON',
  })
  regrasValidacao: Record<string, any>;

  // Instruções e observações
  @Column({
    name: 'instrucoes_preenchimento',
    type: 'text',
    nullable: true,
    comment: 'Instruções para preenchimento da matriz',
  })
  instrucoesPreenchimento: string;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações gerais sobre a matriz',
  })
  observacoes: string;

  @Column({
    name: 'referencias_bibliograficas',
    type: 'text',
    nullable: true,
    comment: 'Referências bibliográficas e normas técnicas',
  })
  referenciasBibliograficas: string;

  // Status e controle
  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusMatriz,
    default: StatusMatriz.ATIVO,
    comment: 'Status da matriz',
  })
  status: StatusMatriz;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se a matriz está ativa (soft delete)',
  })
  ativo: boolean;

  // Relacionamento com campos da matriz
  @OneToMany(() => CampoMatriz, (campo) => campo.matriz)
  campos: CampoMatriz[];

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

  @Column({
    name: 'criado_por',
    type: 'uuid',
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criadoPor: string;

  @Column({
    name: 'atualizado_por',
    type: 'uuid',
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizadoPor: string;
}
