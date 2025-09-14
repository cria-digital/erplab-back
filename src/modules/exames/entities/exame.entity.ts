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
import { TipoExame } from './tipo-exame.entity';
import { OrdemServicoExame } from './ordem-servico-exame.entity';
import { ResultadoExame } from './resultado-exame.entity';
import { SubgrupoExame } from './subgrupo-exame.entity';
import { SetorExame } from './setor-exame.entity';
import { LaboratorioApoio } from './laboratorio-apoio.entity';

@Entity('exames')
@Index(['codigo_interno'])
@Index(['codigo_tuss'])
@Index(['codigo_loinc'])
@Index(['nome'])
export class Exame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno do exame',
  })
  codigo_interno: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Nome completo do exame',
  })
  nome: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Sinônimos ou nomes alternativos',
  })
  sinonimos: string;

  // Códigos padronizados
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Código TUSS (Terminologia Unificada da Saúde Suplementar)',
  })
  codigo_tuss: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Código AMB (Associação Médica Brasileira)',
  })
  codigo_amb: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Código LOINC (Logical Observation Identifiers Names and Codes)',
  })
  codigo_loinc: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Código SUS',
  })
  codigo_sus: string;

  // Tipo e categoria
  @Column({
    type: 'int',
    comment: 'ID do tipo de exame',
  })
  tipo_exame_id: number;

  @Column({
    type: 'enum',
    enum: ['laboratorio', 'imagem', 'procedimento', 'consulta'],
    comment: 'Categoria geral do exame',
  })
  categoria: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do subgrupo',
  })
  subgrupo_id: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do setor responsável',
  })
  setor_id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Metodologia utilizada no exame',
  })
  metodologia: string;

  // Especificidades e controles
  @Column({
    type: 'enum',
    enum: ['nao', 'sim'],
    default: 'nao',
    comment: 'Se precisa de especialidade médica específica',
  })
  especialidade_requerida: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Especialidade médica requerida',
  })
  especialidade: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Grupo de exames relacionados',
  })
  grupo: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Peso/prioridade para ordenação',
  })
  peso: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Altura mínima em cm (para alguns exames de imagem)',
  })
  altura_min: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Altura máxima em cm',
  })
  altura_max: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Volume mínimo necessário (em ml para exames laboratoriais)',
  })
  volume_min: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Volume ideal (em ml)',
  })
  volume_ideal: number;

  // Unidades de medida
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Unidade de medida do resultado',
  })
  unidade_medida: string;

  // Material e preparo
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Tipo de amostra biológica necessária',
  })
  amostra_biologica: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Tipo de recipiente para coleta',
  })
  tipo_recipiente: string;

  @Column({
    type: 'enum',
    enum: ['nao', 'sim'],
    default: 'nao',
    comment: 'Se necessita preparo especial',
  })
  necessita_preparo: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Requisitos para realização do exame',
  })
  requisitos: string;

  // Integração e envio
  @Column({
    type: 'enum',
    enum: ['interno', 'apoio', 'telemedicina'],
    default: 'interno',
    comment: 'Onde o exame é realizado',
  })
  tipo_realizacao: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do laboratório de apoio',
  })
  laboratorio_apoio_id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Destino do exame no sistema externo',
  })
  destino_exame: string;

  @Column({
    type: 'enum',
    enum: ['nao', 'sim'],
    default: 'nao',
    comment: 'Se envia automaticamente para laboratório de apoio',
  })
  envio_automatico: string;

  // Prazos
  @Column({
    type: 'int',
    nullable: true,
    comment: 'Prazo de entrega em dias úteis',
  })
  prazo_entrega_dias: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Formato do prazo (ex: 5 dias úteis, 24 horas)',
  })
  formato_prazo: string;

  @Column({
    type: 'enum',
    enum: ['nao', 'sim'],
    default: 'nao',
    comment: 'Se tem referência de valores normais',
  })
  tem_valores_referencia: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Valores de referência por idade/sexo',
  })
  valores_referencia: any;

  // Processamento e Entrega
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Técnica de coleta específica',
  })
  tecnica_coleta: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Distribuição/processamento da amostra',
  })
  distribuicao: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Processamento e entrega de laudos',
  })
  processamento_entrega: string;

  // Requisitos técnicos
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Requisitos da ANVISA/Normas técnicas',
  })
  requisitos_anvisa: any;

  // Formulários de atendimento
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Formulários necessários para o atendimento',
  })
  formularios_atendimento: any;

  // Preparo e Coleta
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Instruções de preparo por público (geral, feminino, infantil)',
  })
  preparo_coleta: any;

  // Lembretes
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Lembretes para coletores, recepcionistas e ordem de serviço',
  })
  lembretes: any;

  // Status
  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo',
    comment: 'Status do exame no sistema',
  })
  status: string;

  // Multi-empresa
  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID da empresa (null = disponível para todas)',
  })
  empresa_id: number;

  // Campos de auditoria
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

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criado_por: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizado_por: number;

  // Relacionamentos
  @ManyToOne(() => TipoExame, { eager: false })
  @JoinColumn({ name: 'tipo_exame_id' })
  tipoExame?: TipoExame;

  @ManyToOne(() => SubgrupoExame, { eager: false })
  @JoinColumn({ name: 'subgrupo_id' })
  subgrupo?: SubgrupoExame;

  @ManyToOne(() => SetorExame, { eager: false })
  @JoinColumn({ name: 'setor_id' })
  setor?: SetorExame;

  @ManyToOne(() => LaboratorioApoio, { eager: false })
  @JoinColumn({ name: 'laboratorio_apoio_id' })
  laboratorioApoio?: LaboratorioApoio;

  @OneToMany(() => OrdemServicoExame, (osExame) => osExame.exame)
  ordensServico?: OrdemServicoExame[];

  @OneToMany(() => ResultadoExame, (resultado) => resultado.exame)
  resultados?: ResultadoExame[];

  // Métodos auxiliares
  getCodigoFormatado(): string {
    return `${this.codigo_interno} - ${this.nome}`;
  }

  getDescricaoCompleta(): string {
    const partes = [this.nome];
    if (this.sinonimos) {
      partes.push(`(${this.sinonimos})`);
    }
    if (this.metodologia) {
      partes.push(`- ${this.metodologia}`);
    }
    return partes.join(' ');
  }

  getPrazoFormatado(): string {
    if (!this.prazo_entrega_dias) {
      return 'Não informado';
    }
    return this.formato_prazo || `${this.prazo_entrega_dias} dia(s) útil(eis)`;
  }

  isExterno(): boolean {
    return this.tipo_realizacao !== 'interno';
  }

  requiresPreparo(): boolean {
    return this.necessita_preparo === 'sim';
  }
}
