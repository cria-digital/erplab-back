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
import { RespostaFormulario } from './resposta-formulario.entity';
import { CampoFormulario } from './campo-formulario.entity';

@Entity('respostas_campo')
@Index(['resposta_formulario_id', 'campo_formulario_id'], { unique: true })
export class RespostaCampo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'resposta_formulario_id',
  })
  respostaFormularioId: string;

  @ManyToOne(() => RespostaFormulario, (resposta) => resposta.respostasCampos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resposta_formulario_id' })
  respostaFormulario: RespostaFormulario;

  @Column({
    type: 'uuid',
    name: 'campo_formulario_id',
  })
  campoFormularioId: string;

  @ManyToOne(() => CampoFormulario)
  @JoinColumn({ name: 'campo_formulario_id' })
  campoFormulario: CampoFormulario;

  // Valores de resposta
  @Column({
    type: 'text',
    name: 'valor_texto',
    nullable: true,
  })
  valorTexto: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 4,
    name: 'valor_numerico',
    nullable: true,
  })
  valorNumerico: number;

  @Column({
    type: 'date',
    name: 'valor_data',
    nullable: true,
  })
  valorData: Date;

  @Column({
    type: 'time',
    name: 'valor_hora',
    nullable: true,
  })
  valorHora: string;

  @Column({
    type: 'timestamp',
    name: 'valor_data_hora',
    nullable: true,
  })
  valorDataHora: Date;

  @Column({
    type: 'boolean',
    name: 'valor_booleano',
    nullable: true,
  })
  valorBooleano: boolean;

  @Column({
    type: 'jsonb',
    name: 'valor_json',
    nullable: true,
  })
  valorJson: any;

  // Alternativas selecionadas (para campos de seleção)
  @Column({
    type: 'jsonb',
    name: 'alternativas_selecionadas_ids',
    nullable: true,
  })
  alternativasSelecionadasIds: string[];

  @Column({
    type: 'text',
    name: 'texto_adicional_alternativa',
    nullable: true,
  })
  textoAdicionalAlternativa: string;

  // Arquivos (para campos de upload)
  @Column({
    type: 'jsonb',
    name: 'arquivos',
    nullable: true,
  })
  arquivos: any[];

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_arquivo',
    nullable: true,
  })
  urlArquivo: string;

  // Assinatura (para campos de assinatura)
  @Column({
    type: 'text',
    name: 'assinatura_base64',
    nullable: true,
  })
  assinaturaBase64: string;

  // Localização (para campos de localização)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    nullable: true,
  })
  latitude: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    nullable: true,
  })
  longitude: number;

  @Column({
    type: 'text',
    name: 'endereco_completo',
    nullable: true,
  })
  enderecoCompleto: string;

  // Validação
  @Column({
    type: 'boolean',
    default: false,
  })
  validado: boolean;

  @Column({
    type: 'jsonb',
    name: 'erros_validacao',
    nullable: true,
  })
  errosValidacao: string[];

  // Metadados da resposta
  @Column({
    type: 'timestamp',
    name: 'data_resposta',
    nullable: true,
  })
  dataResposta: Date;

  @Column({
    type: 'int',
    name: 'tempo_resposta_segundos',
    nullable: true,
  })
  tempoRespostaSegundos: number;

  @Column({
    type: 'int',
    name: 'tentativas_preenchimento',
    default: 1,
  })
  tentativasPreenchimento: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  editado: boolean;

  @Column({
    type: 'timestamp',
    name: 'data_ultima_edicao',
    nullable: true,
  })
  dataUltimaEdicao: Date;

  @Column({
    type: 'jsonb',
    name: 'historico_edicoes',
    nullable: true,
  })
  historicoEdicoes: any[];

  // Cálculos e fórmulas
  @Column({
    type: 'boolean',
    name: 'valor_calculado',
    default: false,
  })
  valorCalculado: boolean;

  @Column({
    type: 'text',
    name: 'formula_aplicada',
    nullable: true,
  })
  formulaAplicada: string;

  // Pontuação (para questionários)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'pontuacao_obtida',
    nullable: true,
  })
  pontuacaoObtida: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'peso_aplicado',
    nullable: true,
  })
  pesoAplicado: number;

  // Unidade de medida (para campos de exames)
  @Column({
    type: 'varchar',
    length: 50,
    name: 'unidade_medida_usada',
    nullable: true,
  })
  unidadeMedidaUsada: string;

  @Column({
    type: 'boolean',
    name: 'fora_referencia',
    default: false,
  })
  foraReferencia: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'indicador_referencia',
    nullable: true,
  })
  indicadorReferencia: string; // alto, baixo, normal

  // Observações e comentários
  @Column({
    type: 'text',
    nullable: true,
  })
  observacoes: string;

  @Column({
    type: 'text',
    name: 'comentario_revisor',
    nullable: true,
  })
  comentarioRevisor: string;

  // Metadados
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadados: any;

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
