import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Plano } from './plano.entity';
import { Instrucao } from './instrucao.entity';
import { TabelaPreco } from './tabela-preco.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { Integracao } from '../../../atendimento/integracoes/entities/integracao.entity';

@Entity('convenios')
export class Convenio {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Identificação
  // ==========================================

  @Column({ type: 'varchar', length: 255, comment: 'Nome do convênio' })
  nome: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  registro_ans: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Matrícula do beneficiário',
  })
  matricula: string;

  @Column({ type: 'uuid', nullable: true, comment: 'FK → Tipo de convênio' })
  tipo_convenio_id: string;

  @ManyToOne(() => AlternativaCampoFormulario, { nullable: true })
  @JoinColumn({ name: 'tipo_convenio_id' })
  tipoConvenio: AlternativaCampoFormulario;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK → Forma de liquidação',
  })
  forma_liquidacao_id: string;

  @ManyToOne(() => AlternativaCampoFormulario, { nullable: true })
  @JoinColumn({ name: 'forma_liquidacao_id' })
  formaLiquidacao: AlternativaCampoFormulario;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Valores
  // ==========================================

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor CH (consulta/hora)',
  })
  valor_ch: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor do filme',
  })
  valor_filme: number;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: TISS
  // ==========================================

  @Column({ type: 'boolean', default: false, comment: 'Utiliza padrão TISS' })
  tiss: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Versão TISS',
  })
  versao_tiss: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código na operadora (TISS)',
  })
  codigo_operadora_tiss: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código operadora (Autorização)',
  })
  codigo_operadora_autorizacao: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código do prestador no convênio',
  })
  codigo_prestador: string;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Faturamento
  // ==========================================

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK → Forma de envio do faturamento',
  })
  envio_faturamento_id: string;

  @ManyToOne(() => AlternativaCampoFormulario, { nullable: true })
  @JoinColumn({ name: 'envio_faturamento_id' })
  envioFaturamento: AlternativaCampoFormulario;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Faturar até o dia X do mês (1-31)',
  })
  fatura_ate_dia: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Dia de vencimento do mês (1-31)',
  })
  dia_vencimento: number;

  @Column({ type: 'date', nullable: true, comment: 'Data do contrato' })
  data_contrato: Date;

  @Column({ type: 'date', nullable: true, comment: 'Data do último ajuste' })
  data_ultimo_ajuste: Date;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Instruções para faturamento',
  })
  instrucoes_faturamento: string;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Tabelas de Preços
  // Um convênio pode usar até 2 tabelas:
  // - Tabela de serviço (principal)
  // - Tabela base (fallback - busca aqui se não encontrar na principal)
  // ==========================================

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK → tabelas_preco (Tabela de serviços principal)',
  })
  tabela_servico_id: string;

  @ManyToOne(() => TabelaPreco, { nullable: true })
  @JoinColumn({ name: 'tabela_servico_id' })
  tabelaServico: TabelaPreco;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK → tabelas_preco (Tabela base/fallback)',
  })
  tabela_base_id: string;

  @ManyToOne(() => TabelaPreco, { nullable: true })
  @JoinColumn({ name: 'tabela_base_id' })
  tabelaBase: TabelaPreco;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK → tabelas_preco (Tabela de materiais - evolução futura)',
  })
  tabela_material_id: string;

  @ManyToOne(() => TabelaPreco, { nullable: true })
  @JoinColumn({ name: 'tabela_material_id' })
  tabelaMaterial: TabelaPreco;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Código CNES',
  })
  cnes: string;

  // ==========================================
  // CAMPOS DO FIGMA - Seção: Outras Informações
  // ==========================================

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Possui co-participação',
  })
  co_participacao: boolean;

  @Column({ type: 'boolean', default: false, comment: 'Exige NF na fatura' })
  nota_fiscal_exige_fatura: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Nome do contato',
  })
  contato: string;

  @Column({ type: 'text', nullable: true, comment: 'Instruções gerais' })
  instrucoes: string;

  @Column({ type: 'text', nullable: true, comment: 'Observações gerais' })
  observacoes_gerais: string;

  // ==========================================
  // INTEGRAÇÃO (Vínculo)
  // ==========================================

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'FK → integracoes (vínculo com integração)',
  })
  integracao_id: string;

  @ManyToOne(() => Integracao, { nullable: true })
  @JoinColumn({ name: 'integracao_id' })
  integracao: Integracao;

  // ==========================================
  // RELACIONAMENTOS
  // ==========================================

  @OneToMany(() => Plano, (plano) => plano.convenio)
  planos: Plano[];

  @OneToMany(() => Instrucao, (instrucao) => instrucao.convenio)
  instrucoes_historico: Instrucao[];

  // ==========================================
  // CONTROLE
  // ==========================================

  @Column({ type: 'boolean', default: true, comment: 'Convenio ativo?' })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizado_em: Date;
}
