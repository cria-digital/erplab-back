import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Convenio } from './convenio.entity';

export enum CategoriaInstrucao {
  AUTORIZACAO_PREVIA = 'autorizacao_previa',
  FATURAMENTO = 'faturamento',
  ATENDIMENTO = 'atendimento',
  DOCUMENTACAO = 'documentacao',
  AUDITORIA = 'auditoria',
  URGENCIA_EMERGENCIA = 'urgencia_emergencia',
  INTERNACAO = 'internacao',
  SADT = 'sadt',
}

export enum TipoProcedimentoInstrucao {
  TODOS = 'todos',
  CONSULTAS = 'consultas',
  EXAMES = 'exames',
  CIRURGIAS = 'cirurgias',
  INTERNACOES = 'internacoes',
  PROCEDIMENTOS_ESPECIAIS = 'procedimentos_especiais',
}

export enum StatusInstrucao {
  ATIVA = 'ativa',
  INATIVA = 'inativa',
  SUSPENSA = 'suspensa',
}

export enum PrioridadeInstrucao {
  ALTA = 'alta',
  MEDIA = 'media',
  BAIXA = 'baixa',
}

@Entity('instrucoes')
export class Instrucao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  convenio_id: string;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'enum', enum: CategoriaInstrucao })
  categoria: CategoriaInstrucao;

  @Column({
    type: 'enum',
    enum: TipoProcedimentoInstrucao,
    default: TipoProcedimentoInstrucao.TODOS,
  })
  tipo_procedimento: TipoProcedimentoInstrucao;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'int', nullable: true })
  prazo_resposta_dias: number;

  @Column({ type: 'int', nullable: true })
  prazo_resposta_horas: number;

  @Column({ type: 'date' })
  vigencia_inicio: Date;

  @Column({ type: 'date', nullable: true })
  vigencia_fim: Date;

  @Column({
    type: 'enum',
    enum: StatusInstrucao,
    default: StatusInstrucao.ATIVA,
  })
  status: StatusInstrucao;

  @Column({
    type: 'enum',
    enum: PrioridadeInstrucao,
    default: PrioridadeInstrucao.MEDIA,
  })
  prioridade: PrioridadeInstrucao;

  @Column({ type: 'varchar', length: 100, nullable: true })
  setor_responsavel: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contato_telefone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contato_email: string;

  @Column({ type: 'json', nullable: true })
  documentos_necessarios: string[];

  @Column({ type: 'json', nullable: true })
  anexos: any[];

  @Column({ type: 'json', nullable: true })
  links_uteis: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  observacoes_internas: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by: string;

  @ManyToOne(() => Convenio, (convenio) => convenio.instrucoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'convenio_id' })
  convenio: Convenio;
}
