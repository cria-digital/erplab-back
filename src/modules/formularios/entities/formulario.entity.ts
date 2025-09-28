import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UnidadeSaude } from '../../unidade-saude/entities/unidade-saude.entity';
import { CampoFormulario } from './campo-formulario.entity';

export enum TipoFormulario {
  EXAME = 'exame',
  ANAMNESE = 'anamnese',
  PRESCRICAO = 'prescricao',
  LAUDO = 'laudo',
  RECEITA = 'receita',
  ATESTADO = 'atestado',
  DECLARACAO = 'declaracao',
  QUESTIONARIO = 'questionario',
  FICHA_CLINICA = 'ficha_clinica',
  EVOLUCAO = 'evolucao',
  TERMO_CONSENTIMENTO = 'termo_consentimento',
  CUSTOMIZADO = 'customizado',
}

export enum StatusFormulario {
  RASCUNHO = 'rascunho',
  PUBLICADO = 'publicado',
  ARQUIVADO = 'arquivado',
  EM_REVISAO = 'em_revisao',
}

export enum CategoriaFormulario {
  CLINICO = 'clinico',
  ADMINISTRATIVO = 'administrativo',
  FINANCEIRO = 'financeiro',
  OPERACIONAL = 'operacional',
  QUALIDADE = 'qualidade',
  PESQUISA = 'pesquisa',
}

@Entity('formularios')
@Index(['tipo', 'status'])
@Index(['codigoFormulario'], { unique: true })
@Index(['unidadeSaudeId'])
export class Formulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'codigo_formulario',
    unique: true,
  })
  codigoFormulario: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'nome_formulario',
  })
  nomeFormulario: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descricao: string;

  @Column({
    type: 'enum',
    enum: TipoFormulario,
    default: TipoFormulario.CUSTOMIZADO,
  })
  tipo: TipoFormulario;

  @Column({
    type: 'enum',
    enum: CategoriaFormulario,
    name: 'categoria',
    nullable: true,
  })
  categoria: CategoriaFormulario;

  @Column({
    type: 'uuid',
    name: 'unidade_saude_id',
    nullable: true,
  })
  unidadeSaudeId: string;

  @ManyToOne(() => UnidadeSaude, { nullable: true })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;

  // Configurações do formulário
  @Column({
    type: 'int',
    default: 1,
  })
  versao: number;

  @Column({
    type: 'enum',
    enum: StatusFormulario,
    default: StatusFormulario.RASCUNHO,
  })
  status: StatusFormulario;

  @Column({
    type: 'boolean',
    default: true,
  })
  ativo: boolean;

  @Column({
    type: 'boolean',
    name: 'obrigatorio',
    default: false,
  })
  obrigatorio: boolean;

  @Column({
    type: 'boolean',
    name: 'permite_edicao',
    default: true,
  })
  permiteEdicao: boolean;

  @Column({
    type: 'boolean',
    name: 'requer_assinatura',
    default: false,
  })
  requerAssinatura: boolean;

  @Column({
    type: 'boolean',
    name: 'permite_anexos',
    default: false,
  })
  permiteAnexos: boolean;

  @Column({
    type: 'int',
    name: 'max_anexos',
    nullable: true,
  })
  maxAnexos: number;

  @Column({
    type: 'boolean',
    name: 'gera_pdf',
    default: false,
  })
  geraPdf: boolean;

  @Column({
    type: 'boolean',
    name: 'envia_email',
    default: false,
  })
  enviaEmail: boolean;

  // Configurações de visualização
  @Column({
    type: 'boolean',
    name: 'exibir_numeracao',
    default: true,
  })
  exibirNumeracao: boolean;

  @Column({
    type: 'boolean',
    name: 'exibir_progresso',
    default: false,
  })
  exibirProgresso: boolean;

  @Column({
    type: 'boolean',
    name: 'permite_salvar_rascunho',
    default: true,
  })
  permiteSalvarRascunho: boolean;

  @Column({
    type: 'boolean',
    name: 'validacao_tempo_real',
    default: true,
  })
  validacaoTempoReal: boolean;

  // Configurações de acesso
  @Column({
    type: 'jsonb',
    name: 'perfis_acesso',
    nullable: true,
  })
  perfisAcesso: string[];

  @Column({
    type: 'jsonb',
    name: 'departamentos_acesso',
    nullable: true,
  })
  departamentosAcesso: string[];

  // Templates e customizações
  @Column({
    type: 'text',
    name: 'template_cabecalho',
    nullable: true,
  })
  templateCabecalho: string;

  @Column({
    type: 'text',
    name: 'template_rodape',
    nullable: true,
  })
  templateRodape: string;

  @Column({
    type: 'jsonb',
    name: 'estilos_customizados',
    nullable: true,
  })
  estilosCustomizados: any;

  @Column({
    type: 'jsonb',
    name: 'configuracoes_extras',
    nullable: true,
  })
  configuracoesExtras: any;

  // Validações e regras
  @Column({
    type: 'jsonb',
    name: 'regras_validacao',
    nullable: true,
  })
  regrasValidacao: any;

  @Column({
    type: 'jsonb',
    name: 'regras_visibilidade',
    nullable: true,
  })
  regrasVisibilidade: any;

  @Column({
    type: 'jsonb',
    name: 'logica_condicional',
    nullable: true,
  })
  logicaCondicional: any;

  // Integração e automação
  @Column({
    type: 'varchar',
    length: 500,
    name: 'webhook_url',
    nullable: true,
  })
  webhookUrl: string;

  @Column({
    type: 'jsonb',
    name: 'integracao_config',
    nullable: true,
  })
  integracaoConfig: any;

  @Column({
    type: 'jsonb',
    name: 'gatilhos_automacao',
    nullable: true,
  })
  gatilhosAutomacao: any;

  // Controle de uso
  @Column({
    type: 'int',
    name: 'total_preenchimentos',
    default: 0,
  })
  totalPreenchimentos: number;

  @Column({
    type: 'timestamp',
    name: 'ultimo_preenchimento',
    nullable: true,
  })
  ultimoPreenchimento: Date;

  @Column({
    type: 'timestamp',
    name: 'data_publicacao',
    nullable: true,
  })
  dataPublicacao: Date;

  @Column({
    type: 'timestamp',
    name: 'data_arquivamento',
    nullable: true,
  })
  dataArquivamento: Date;

  // Validade do formulário
  @Column({
    type: 'date',
    name: 'valido_de',
    nullable: true,
  })
  validoDe: Date;

  @Column({
    type: 'date',
    name: 'valido_ate',
    nullable: true,
  })
  validoAte: Date;

  // Relacionamentos
  @OneToMany(() => CampoFormulario, (campo) => campo.formulario, {
    cascade: true,
  })
  campos: CampoFormulario[];

  @Column({
    type: 'uuid',
    name: 'formulario_pai_id',
    nullable: true,
  })
  formularioPaiId: string;

  @ManyToOne(() => Formulario, { nullable: true })
  @JoinColumn({ name: 'formulario_pai_id' })
  formularioPai: Formulario;

  @OneToMany(() => Formulario, (formulario) => formulario.formularioPai)
  subFormularios: Formulario[];

  // Observações e metadados
  @Column({
    type: 'text',
    nullable: true,
  })
  observacoes: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadados: any;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  tags: string[];

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
