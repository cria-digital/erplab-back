import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Exame } from './exame.entity';
import { LaboratorioApoio } from './laboratorio-apoio.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { Amostra } from '../../amostras/entities/amostra.entity';

/**
 * Entidade para configurações específicas de cada laboratório de apoio por exame.
 * Permite que um exame tenha múltiplos laboratórios de apoio, cada um com suas
 * próprias configurações de metodologia, preparo, coleta, etc.
 */
@Entity('exames_laboratorios_apoio')
@Index(['exameId', 'laboratorioApoioId'])
@Unique(['exameId', 'laboratorioApoioId'])
export class ExameLaboratorioApoio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamentos principais
  @Column({
    name: 'exame_id',
    comment: 'ID do exame',
  })
  exameId: string;

  @Column({
    name: 'laboratorio_apoio_id',
    comment: 'ID do laboratório de apoio',
  })
  laboratorioApoioId: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código do exame no laboratório de apoio',
  })
  codigo_exame_apoio: string;

  // Requisitos para realização do exame
  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo metodologia',
  })
  metodologia_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo unidade_medida',
  })
  unidade_medida_id: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se o exame requer peso do paciente',
  })
  requer_peso: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se o exame requer altura do paciente',
  })
  requer_altura: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se o exame requer volume específico',
  })
  requer_volume: boolean;

  @Column({
    nullable: true,
    comment: 'FK para tabela amostras (amostra biológica necessária)',
  })
  amostra_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo amostra_enviar',
  })
  amostra_enviar_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo tipo_recipiente',
  })
  tipo_recipiente_id: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'IDs das regiões de coleta (múltiplas)',
  })
  regioes_coleta_ids: string[];

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo volume_minimo',
  })
  volume_minimo_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo estabilidade',
  })
  estabilidade_id: string;

  // Formulários de atendimento
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Formulários necessários para o atendimento neste laboratório',
  })
  formularios_atendimento: any;

  // Preparo - campos separados
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções de preparo - Público geral',
  })
  preparo_geral: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções de preparo - Feminino',
  })
  preparo_feminino: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções de preparo - Infantil',
  })
  preparo_infantil: string;

  // Coleta - campos separados
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções de coleta - Público geral',
  })
  coleta_geral: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções de coleta - Feminino',
  })
  coleta_feminino: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções de coleta - Infantil',
  })
  coleta_infantil: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Técnica de coleta específica',
  })
  tecnica_coleta: string;

  // Lembretes
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Lembrete para coletora',
  })
  lembrete_coletora: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Lembrete para recepcionista - Agendamentos e Orçamentos',
  })
  lembrete_recepcionista_agendamento: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Lembrete para recepcionista - Ordem de Serviço',
  })
  lembrete_recepcionista_os: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções de distribuição',
  })
  distribuicao: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Informações de processamento para laboratório de apoio',
  })
  processamento: string;

  // Processamento e Entrega de Laudos
  @Column({
    type: 'int',
    nullable: true,
    comment: 'Prazo de entrega dos resultados (em dias)',
  })
  prazo_entrega_dias: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment:
      'Formatos de laudo aceitos (PDF, XML, HTML, TEXTO, FORMULARIO, DICOM)',
  })
  formatos_laudo: string[];

  // Controle
  @Column({
    type: 'boolean',
    default: true,
    comment: 'Se o vínculo está ativo',
  })
  ativo: boolean;

  // Auditoria
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação do registro',
  })
  criado_em: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data da última atualização',
  })
  atualizado_em: Date;

  // Relacionamentos
  @ManyToOne(() => Exame, (exame) => exame.laboratoriosApoioConfig, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exame_id' })
  exame?: Exame;

  @ManyToOne(() => LaboratorioApoio, { eager: false })
  @JoinColumn({ name: 'laboratorio_apoio_id' })
  laboratorioApoio?: LaboratorioApoio;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'metodologia_id' })
  metodologiaAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'unidade_medida_id' })
  unidadeMedidaAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => Amostra, { eager: false })
  @JoinColumn({ name: 'amostra_id' })
  amostra?: Amostra;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'amostra_enviar_id' })
  amostraEnviarAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'tipo_recipiente_id' })
  tipoRecipienteAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'volume_minimo_id' })
  volumeMinimoAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'estabilidade_id' })
  estabilidadeAlternativa?: AlternativaCampoFormulario;

  // formatos_laudo é JSONB (array de strings) - não tem relacionamento
}
