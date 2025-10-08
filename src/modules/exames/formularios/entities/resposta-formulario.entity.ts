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
import { Paciente } from '../../../cadastros/pacientes/entities/paciente.entity';
import { Usuario } from '../../../autenticacao/usuarios/entities/usuario.entity';
import { RespostaCampo } from './resposta-campo.entity';

export enum StatusResposta {
  RASCUNHO = 'rascunho',
  EM_PREENCHIMENTO = 'em_preenchimento',
  CONCLUIDO = 'concluido',
  REVISAO = 'revisao',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
  CANCELADO = 'cancelado',
}

@Entity('respostas_formulario')
@Index(['formularioId', 'pacienteId'])
@Index(['status', 'createdAt'])
@Index(['codigoResposta'], { unique: true })
export class RespostaFormulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'codigo_resposta',
    unique: true,
  })
  codigoResposta: string;

  @Column({
    type: 'uuid',
    name: 'formulario_id',
  })
  formularioId: string;

  @ManyToOne(() => Formulario)
  @JoinColumn({ name: 'formulario_id' })
  formulario: Formulario;

  @Column({
    type: 'uuid',
    name: 'paciente_id',
    nullable: true,
  })
  pacienteId: string;

  @ManyToOne(() => Paciente, { nullable: true })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({
    type: 'uuid',
    name: 'usuario_preenchimento_id',
    nullable: true,
  })
  usuarioPreenchimentoId: string;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_preenchimento_id' })
  usuarioPreenchimento: Usuario;

  // Informações temporais
  @Column({
    type: 'timestamp',
    name: 'data_inicio_preenchimento',
    nullable: true,
  })
  dataInicioPreenchimento: Date;

  @Column({
    type: 'timestamp',
    name: 'data_fim_preenchimento',
    nullable: true,
  })
  dataFimPreenchimento: Date;

  @Column({
    type: 'int',
    name: 'tempo_preenchimento_segundos',
    nullable: true,
  })
  tempoPreenchimentoSegundos: number;

  @Column({
    type: 'timestamp',
    name: 'data_ultima_edicao',
    nullable: true,
  })
  dataUltimaEdicao: Date;

  // Status e controle
  @Column({
    type: 'enum',
    enum: StatusResposta,
    default: StatusResposta.RASCUNHO,
  })
  status: StatusResposta;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'percentual_completo',
    default: 0,
  })
  percentualCompleto: number;

  @Column({
    type: 'int',
    name: 'campos_respondidos',
    default: 0,
  })
  camposRespondidos: number;

  @Column({
    type: 'int',
    name: 'total_campos',
    default: 0,
  })
  totalCampos: number;

  @Column({
    type: 'int',
    name: 'versao_formulario',
    default: 1,
  })
  versaoFormulario: number;

  // Validação e revisão
  @Column({
    type: 'boolean',
    default: false,
  })
  validado: boolean;

  @Column({
    type: 'timestamp',
    name: 'data_validacao',
    nullable: true,
  })
  dataValidacao: Date;

  @Column({
    type: 'uuid',
    name: 'usuario_validacao_id',
    nullable: true,
  })
  usuarioValidacaoId: string;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_validacao_id' })
  usuarioValidacao: Usuario;

  @Column({
    type: 'text',
    name: 'observacoes_validacao',
    nullable: true,
  })
  observacoesValidacao: string;

  // Assinatura digital
  @Column({
    type: 'boolean',
    default: false,
  })
  assinado: boolean;

  @Column({
    type: 'timestamp',
    name: 'data_assinatura',
    nullable: true,
  })
  dataAssinatura: Date;

  @Column({
    type: 'text',
    name: 'assinatura_digital',
    nullable: true,
  })
  assinaturaDigital: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'ip_assinatura',
    nullable: true,
  })
  ipAssinatura: string;

  // Pontuação (para questionários)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'pontuacao_total',
    nullable: true,
  })
  pontuacaoTotal: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'pontuacao_maxima',
    nullable: true,
  })
  pontuacaoMaxima: number;

  @Column({
    type: 'jsonb',
    name: 'pontuacao_por_secao',
    nullable: true,
  })
  pontuacaoPorSecao: any;

  // Origem e contexto
  @Column({
    type: 'varchar',
    length: 50,
    name: 'origem_resposta',
    nullable: true,
  })
  origemResposta: string; // portal, app, sistema, api

  @Column({
    type: 'varchar',
    length: 100,
    name: 'dispositivo',
    nullable: true,
  })
  dispositivo: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'navegador',
    nullable: true,
  })
  navegador: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'ip_origem',
    nullable: true,
  })
  ipOrigem: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  localizacao: any;

  // Referências externas
  @Column({
    type: 'uuid',
    name: 'ordem_servico_id',
    nullable: true,
  })
  ordemServicoId: string;

  @Column({
    type: 'uuid',
    name: 'atendimento_id',
    nullable: true,
  })
  atendimentoId: string;

  @Column({
    type: 'uuid',
    name: 'consulta_id',
    nullable: true,
  })
  consultaId: string;

  // Arquivos anexos
  @Column({
    type: 'jsonb',
    name: 'arquivos_anexos',
    nullable: true,
  })
  arquivosAnexos: any[];

  // PDF gerado
  @Column({
    type: 'varchar',
    length: 500,
    name: 'pdf_url',
    nullable: true,
  })
  pdfUrl: string;

  @Column({
    type: 'timestamp',
    name: 'pdf_gerado_em',
    nullable: true,
  })
  pdfGeradoEm: Date;

  // Envio por email
  @Column({
    type: 'boolean',
    name: 'email_enviado',
    default: false,
  })
  emailEnviado: boolean;

  @Column({
    type: 'timestamp',
    name: 'email_enviado_em',
    nullable: true,
  })
  emailEnviadoEm: Date;

  @Column({
    type: 'jsonb',
    name: 'destinatarios_email',
    nullable: true,
  })
  destinatariosEmail: string[];

  // Relacionamento com respostas dos campos
  @OneToMany(() => RespostaCampo, (resposta) => resposta.respostaFormulario, {
    cascade: true,
  })
  respostasCampos: RespostaCampo[];

  // Metadados e observações
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
