import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import {
  TipoConvenioEnum,
  FormaLiquidacaoEnum,
  TipoEnvioEnum,
  FormaFaturamentoEnum,
  TabelaServicoEnum,
  TabelaMateriaisEnum,
} from '../enums/convenio.enum';

@Entity('dados_convenio')
export class DadosConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id', unique: true })
  empresaId: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  // Informações Específicas do Convênio
  @Column({ name: 'nome_convenio' })
  nomeConvenio: string;

  @Column({ nullable: true, name: 'registro_ans' })
  registroAns: string;

  @Column({ nullable: true })
  matricula: string;

  @Column({
    type: 'enum',
    enum: TipoConvenioEnum,
    name: 'tipo_convenio',
  })
  tipoConvenio: TipoConvenioEnum;

  @Column({
    type: 'enum',
    enum: FormaLiquidacaoEnum,
    nullable: true,
    name: 'forma_liquidacao',
  })
  formaLiquidacao: FormaLiquidacaoEnum;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'valor_ch',
  })
  valorCh: number;

  @Column({ nullable: true, name: 'valor_filme' })
  valorFilme: string;

  @Column({ nullable: true, name: 'matricula_digitos' })
  matriculaDigitos: number;

  @Column({ nullable: true })
  cnes: string;

  @Column({ default: false })
  tiss: boolean;

  @Column({ nullable: true, name: 'versao_tiss' })
  versaoTiss: string;

  @Column({ nullable: true, name: 'tiss_codigo_operadora' })
  tissCodigoOperadora: string;

  @Column({ nullable: true, name: 'codigo_operadora_autorizacao' })
  codigoOperadoraAutorizacao: string;

  @Column({ nullable: true, name: 'codigo_prestador' })
  codigoPrestador: string;

  // Faturamento
  @Column({
    type: 'enum',
    enum: TipoEnvioEnum,
    nullable: true,
    name: 'tipo_envio',
  })
  tipoEnvio: TipoEnvioEnum;

  @Column({
    type: 'enum',
    enum: FormaFaturamentoEnum,
    nullable: true,
    name: 'fatura_ate',
  })
  faturaAte: FormaFaturamentoEnum;

  @Column({ nullable: true, name: 'dia_vencimento' })
  diaVencimento: string;

  @Column({ nullable: true })
  contrato: string;

  @Column({ nullable: true, name: 'ultimo_ajuste' })
  ultimoAjuste: string;

  @Column({ nullable: true, name: 'ultimo_ajuste_contrato', type: 'date' })
  ultimoAjusteContrato: Date;

  @Column({ nullable: true, name: 'instrucoes_faturamento', type: 'text' })
  instrucoesFaturamento: string;

  @Column({ nullable: true, name: 'instrucoes_gerais', type: 'text' })
  instrucoesGerais: string;

  @Column({ nullable: true, name: 'observacoes_gerais', type: 'text' })
  observacoesGerais: string;

  // Outras informações
  @Column({
    type: 'enum',
    enum: TabelaServicoEnum,
    nullable: true,
    name: 'tabela_servico',
  })
  tabelaServico: TabelaServicoEnum;

  @Column({
    type: 'enum',
    enum: TabelaMateriaisEnum,
    nullable: true,
    name: 'tabela_base',
  })
  tabelaBase: TabelaMateriaisEnum;

  @Column({
    type: 'enum',
    enum: TabelaMateriaisEnum,
    nullable: true,
    name: 'tabela_material',
  })
  tabelaMaterial: TabelaMateriaisEnum;

  @Column({ default: false, name: 'co_participacao' })
  coParticipacao: boolean;

  @Column({ default: false, name: 'nota_fiscal_exige_fatura' })
  notaFiscalExigeFatura: boolean;

  @Column({ nullable: true, name: 'contato' })
  contato: string;

  @Column({ nullable: true, name: 'data_contrato', type: 'date' })
  dataContrato: Date;

  @Column({ nullable: true, name: 'codigo_convenio' })
  codigoConvenio: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
