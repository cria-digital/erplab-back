import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { OrdemServicoExame } from './ordem-servico-exame.entity';
import { ResultadoExame } from './resultado-exame.entity';
import { SubgrupoExame } from './subgrupo-exame.entity';
import { SetorExame } from './setor-exame.entity';
import { LaboratorioApoio } from './laboratorio-apoio.entity';
import { ExameLaboratorioApoio } from './exame-laboratorio-apoio.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { Telemedicina } from '../../../relacionamento/telemedicina/entities/telemedicina.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Amostra } from '../../amostras/entities/amostra.entity';

@Entity('exames')
@Index(['codigo_interno'])
@Index(['codigo_tuss'])
@Index(['codigo_loinc'])
@Index(['nome'])
export class Exame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
    type: 'jsonb',
    nullable: true,
    comment: 'Sinônimos ou nomes alternativos (array de strings)',
  })
  sinonimos: string[];

  // Códigos padronizados
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment:
      'Código CBHPM (Classificação Brasileira Hierarquizada de Procedimentos Médicos)',
  })
  codigo_cbhpm: string;

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
    nullable: true,
    comment: 'FK para alternativa do campo tipo_exames',
  })
  tipo_exame_id: string;

  @Column({
    type: 'enum',
    enum: ['laboratorio', 'imagem', 'procedimento', 'consulta'],
    comment: 'Categoria geral do exame',
  })
  categoria: string;

  @Column({
    nullable: true,
    comment: 'ID do subgrupo',
  })
  subgrupo_id: string;

  @Column({
    nullable: true,
    comment: 'ID do setor responsável',
  })
  setor_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo metodologia',
  })
  metodologia_id: string;

  // Especificidades e controles
  @Column({
    type: 'enum',
    enum: ['nao', 'sim'],
    default: 'nao',
    comment: 'Se precisa de especialidade médica específica',
  })
  especialidade_requerida: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo especialidade',
  })
  especialidade_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo grupo',
  })
  grupo_id: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Peso/prioridade para ordenação',
  })
  peso: number;

  // Campos boolean conforme Figma (SIM/NÃO)
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

  // Campos numéricos mantidos para compatibilidade (podem ser removidos futuramente)
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
    nullable: true,
    comment: 'FK para alternativa do campo unidade_medida',
  })
  unidade_medida_id: string;

  // Material e preparo
  @Column({
    nullable: true,
    comment: 'FK para tabela amostras (amostra biológica necessária)',
  })
  amostra_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo amostra_enviar (soro, plasma, etc)',
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
    comment: 'Array de IDs de alternativas do campo regiao_coleta',
  })
  regiao_coleta_ids: string[];

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo estabilidade',
  })
  estabilidade_id: string;

  @Column({
    nullable: true,
    comment: 'FK para alternativa do campo volume_minimo',
  })
  volume_minimo_id: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment:
      'Formatos de laudo aceitos (PDF, XML, HTML, TEXTO, FORMULARIO, DICOM)',
  })
  formatos_laudo: string[];

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se o exame requer termo de consentimento',
  })
  termo_consentimento: boolean;

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
    nullable: true,
    comment: 'ID do laboratório de apoio',
  })
  laboratorio_apoio_id: string;

  @Column({
    nullable: true,
    comment: 'FK para telemedicina (quando tipo_realizacao = telemedicina)',
  })
  telemedicina_id: string;

  @Column({
    nullable: true,
    comment: 'FK para unidade de saúde de destino',
  })
  unidade_destino_id: string;

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
    comment: 'Critérios de rejeição da amostra',
  })
  rejeicao: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Processamento e entrega de laudos',
  })
  processamento_entrega: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Links úteis relacionados ao exame',
  })
  links_uteis: string;

  // Requisitos técnicos - vínculo com campo de formulário
  @Column({
    type: 'uuid',
    name: 'requisitos_anvisa_id',
    nullable: true,
    comment: 'ID do requisito ANVISA selecionado',
  })
  requisitosAnvisaId: string;

  @ManyToOne(() => AlternativaCampoFormulario, { nullable: true })
  @JoinColumn({ name: 'requisitos_anvisa_id' })
  requisitosAnvisa: AlternativaCampoFormulario;

  // Formulários de atendimento
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Formulários necessários para o atendimento',
  })
  formularios_atendimento: any;

  // Preparo - campos separados conforme Figma
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

  // Coleta - campos separados conforme Figma
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

  // Lembretes - campos separados conforme Figma
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

  // Campo JSONB mantido para compatibilidade (pode ser removido futuramente)
  @Column({
    type: 'jsonb',
    nullable: true,
    comment:
      'Instruções de preparo por público (geral, feminino, infantil) - DEPRECATED',
  })
  preparo_coleta: any;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment:
      'Lembretes para coletores, recepcionistas e ordem de serviço - DEPRECATED',
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
    nullable: true,
    comment: 'ID da empresa (null = disponível para todas)',
  })
  empresa_id: string;

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
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criado_por: string;

  @Column({
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizado_por: string;

  // Relacionamentos
  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'tipo_exame_id' })
  tipoExameAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => SubgrupoExame, { eager: false })
  @JoinColumn({ name: 'subgrupo_id' })
  subgrupo?: SubgrupoExame;

  @ManyToOne(() => SetorExame, { eager: false })
  @JoinColumn({ name: 'setor_id' })
  setor?: SetorExame;

  @ManyToOne(() => LaboratorioApoio, { eager: false })
  @JoinColumn({ name: 'laboratorio_apoio_id' })
  laboratorioApoio?: LaboratorioApoio;

  // Relacionamentos com campos de formulário
  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'especialidade_id' })
  especialidadeAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'grupo_id' })
  grupoAlternativa?: AlternativaCampoFormulario;

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

  // regiao_coleta_ids é jsonb (array) - não tem relacionamento direto

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'estabilidade_id' })
  estabilidadeAlternativa?: AlternativaCampoFormulario;

  @ManyToOne(() => AlternativaCampoFormulario, { eager: false })
  @JoinColumn({ name: 'volume_minimo_id' })
  volumeMinimoAlternativa?: AlternativaCampoFormulario;

  // formatos_laudo é JSONB (array de strings) - não tem relacionamento

  // Relacionamentos de integração
  @ManyToOne(() => Telemedicina, { eager: false })
  @JoinColumn({ name: 'telemedicina_id' })
  telemedicina?: Telemedicina;

  @ManyToOne(() => UnidadeSaude, { eager: false })
  @JoinColumn({ name: 'unidade_destino_id' })
  unidadeDestino?: UnidadeSaude;

  @OneToMany(() => OrdemServicoExame, (osExame) => osExame.exame)
  ordensServico?: OrdemServicoExame[];

  @OneToMany(() => ResultadoExame, (resultado) => resultado.exame)
  resultados?: ResultadoExame[];

  // Relacionamento N:M - Unidades que realizam o exame
  @ManyToMany(() => UnidadeSaude)
  @JoinTable({
    name: 'exames_unidades',
    joinColumn: { name: 'exame_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'unidade_id', referencedColumnName: 'id' },
  })
  unidadesQueRealizam?: UnidadeSaude[];

  // Relacionamento 1:N - Configurações específicas por laboratório de apoio
  @OneToMany(() => ExameLaboratorioApoio, (exameLab) => exameLab.exame)
  laboratoriosApoioConfig?: ExameLaboratorioApoio[];

  // Métodos auxiliares
  getCodigoFormatado(): string {
    return `${this.codigo_interno} - ${this.nome}`;
  }

  getDescricaoCompleta(): string {
    const partes = [this.nome];
    if (this.sinonimos?.length) {
      partes.push(`(${this.sinonimos.join(', ')})`);
    }
    if (this.metodologiaAlternativa?.textoAlternativa) {
      partes.push(`- ${this.metodologiaAlternativa.textoAlternativa}`);
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
