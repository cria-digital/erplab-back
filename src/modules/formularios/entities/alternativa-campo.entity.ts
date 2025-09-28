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
import { CampoFormulario } from './campo-formulario.entity';

export enum StatusAlternativa {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
}

@Entity('alternativas_campo')
@Index(['campoFormularioId', 'ordem'])
@Index(['codigoAlternativa'], { unique: true })
export class AlternativaCampo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'campo_formulario_id',
  })
  campoFormularioId: string;

  @ManyToOne(() => CampoFormulario, (campo) => campo.alternativas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campo_formulario_id' })
  campoFormulario: CampoFormulario;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'codigo_alternativa',
    unique: true,
  })
  codigoAlternativa: string;

  @Column({
    type: 'text',
    name: 'texto_alternativa',
  })
  textoAlternativa: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descricao: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  valor: string;

  @Column({
    type: 'int',
    default: 0,
  })
  ordem: number;

  // Configurações visuais
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  icone: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  cor: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'imagem_url',
    nullable: true,
  })
  imagemUrl: string;

  @Column({
    type: 'jsonb',
    name: 'estilos_css',
    nullable: true,
  })
  estilosCss: any;

  // Controle e lógica
  @Column({
    type: 'boolean',
    name: 'selecionado_padrao',
    default: false,
  })
  selecionadoPadrao: boolean;

  @Column({
    type: 'boolean',
    name: 'permite_texto_adicional',
    default: false,
  })
  permiteTextoAdicional: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'placeholder_texto_adicional',
    nullable: true,
  })
  placeholderTextoAdicional: string;

  @Column({
    type: 'boolean',
    name: 'exclusiva',
    default: false,
  })
  exclusiva: boolean;

  // Pontuação e peso (para questionários e avaliações)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  pontuacao: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 1.0,
  })
  peso: number;

  // Ações e consequências
  @Column({
    type: 'jsonb',
    name: 'acoes_ao_selecionar',
    nullable: true,
  })
  acoesAoSelecionar: any;

  @Column({
    type: 'jsonb',
    name: 'campos_mostrar',
    nullable: true,
  })
  camposMostrar: string[];

  @Column({
    type: 'jsonb',
    name: 'campos_ocultar',
    nullable: true,
  })
  camposOcultar: string[];

  @Column({
    type: 'jsonb',
    name: 'campos_obrigatorios',
    nullable: true,
  })
  camposObrigatorios: string[];

  @Column({
    type: 'text',
    name: 'proxima_pergunta_id',
    nullable: true,
  })
  proximaPerguntaId: string;

  // Validações específicas
  @Column({
    type: 'jsonb',
    name: 'validacoes_customizadas',
    nullable: true,
  })
  validacoesCustomizadas: any;

  @Column({
    type: 'text',
    name: 'mensagem_validacao',
    nullable: true,
  })
  mensagemValidacao: string;

  // Integração e mapeamento
  @Column({
    type: 'varchar',
    length: 255,
    name: 'codigo_externo',
    nullable: true,
  })
  codigoExterno: string;

  @Column({
    type: 'jsonb',
    name: 'mapeamento_integracao',
    nullable: true,
  })
  mapeamentoIntegracao: any;

  // Categorização
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  categoria: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  tags: string[];

  // Status e controle
  @Column({
    type: 'enum',
    enum: StatusAlternativa,
    default: StatusAlternativa.ATIVA,
  })
  status: StatusAlternativa;

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

  // Metadados
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadados: any;

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
