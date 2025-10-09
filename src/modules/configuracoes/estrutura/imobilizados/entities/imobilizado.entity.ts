import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Sala } from '../../salas/entities/sala.entity';
import { Setor } from '../../setores/entities/setor.entity';
import { Fornecedor } from '../../../../relacionamento/fornecedores/entities/fornecedor.entity';

export enum CategoriaImobilizado {
  MOBILIARIO = 'mobiliario',
  EQUIPAMENTO = 'equipamento',
  VEICULO = 'veiculo',
  IMOVEL = 'imovel',
  SOFTWARE = 'software',
  OUTROS = 'outros',
}

export enum SituacaoImobilizado {
  ATIVO = 'ativo',
  BAIXA = 'baixa',
  VENDA = 'venda',
  DOACAO = 'doacao',
  DESCARTE = 'descarte',
}

/**
 * Entidade que representa um Bem Imobilizado
 *
 * Define os bens patrimoniais da empresa:
 * - Móveis e utensílios
 * - Equipamentos e máquinas
 * - Veículos
 * - Imóveis
 * - Software
 * - Controle de depreciação
 */
@Entity('imobilizados')
@Index(['patrimonio'])
@Index(['descricao'])
@Index(['categoria'])
@Index(['situacao'])
@Index(['fornecedorId'])
@Index(['salaId'])
@Index(['setorId'])
@Index(['unidadeId'])
@Index(['empresaId'])
export class Imobilizado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Identificação
  @Column({
    name: 'patrimonio',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Número do patrimônio (ex: IMOB-001)',
  })
  patrimonio: string;

  @Column({
    name: 'descricao',
    type: 'varchar',
    length: 255,
    comment: 'Descrição do bem imobilizado',
  })
  descricao: string;

  @Column({
    name: 'categoria',
    type: 'enum',
    enum: CategoriaImobilizado,
    comment: 'Categoria do imobilizado',
  })
  categoria: CategoriaImobilizado;

  // Aquisição
  @Column({
    name: 'data_aquisicao',
    type: 'date',
    comment: 'Data de aquisição do bem',
  })
  dataAquisicao: Date;

  @Column({
    name: 'valor_aquisicao',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Valor pago na aquisição',
  })
  valorAquisicao: number;

  @Column({
    name: 'numero_nota_fiscal',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Número da nota fiscal de compra',
  })
  numeroNotaFiscal: string;

  @Column({
    name: 'fornecedor_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do fornecedor',
  })
  fornecedorId: string;

  @ManyToOne(() => Fornecedor, { nullable: true })
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  // Localização
  @Column({
    name: 'sala_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID da sala onde está localizado',
  })
  salaId: string;

  @ManyToOne(() => Sala, { nullable: true })
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @Column({
    name: 'setor_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do setor responsável',
  })
  setorId: string;

  @ManyToOne(() => Setor, { nullable: true })
  @JoinColumn({ name: 'setor_id' })
  setor: Setor;

  // Depreciação
  @Column({
    name: 'vida_util_anos',
    type: 'integer',
    comment: 'Vida útil do bem em anos (para cálculo de depreciação)',
  })
  vidaUtilAnos: number;

  @Column({
    name: 'taxa_depreciacao_anual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    comment: 'Taxa de depreciação anual (%)',
  })
  taxaDepreciacaoAnual: number;

  @Column({
    name: 'depreciacao_acumulada',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor acumulado de depreciação',
  })
  depreciacaoAcumulada: number;

  @Column({
    name: 'valor_residual',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor residual estimado ao final da vida útil',
  })
  valorResidual: number;

  // Situação
  @Column({
    name: 'situacao',
    type: 'enum',
    enum: SituacaoImobilizado,
    default: SituacaoImobilizado.ATIVO,
    comment: 'Situação atual do imobilizado',
  })
  situacao: SituacaoImobilizado;

  @Column({
    name: 'data_baixa',
    type: 'date',
    nullable: true,
    comment: 'Data da baixa/venda/doação/descarte',
  })
  dataBaixa: Date;

  @Column({
    name: 'motivo_baixa',
    type: 'text',
    nullable: true,
    comment: 'Motivo da baixa do imobilizado',
  })
  motivoBaixa: string;

  @Column({
    name: 'valor_baixa',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor da venda (se aplicável)',
  })
  valorBaixa: number;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações gerais sobre o imobilizado',
  })
  observacoes: string;

  // Controle
  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se o registro está ativo',
  })
  ativo: boolean;

  @Column({
    name: 'unidade_id',
    type: 'uuid',
    comment: 'ID da unidade de saúde',
  })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({
    name: 'empresa_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID da empresa (multi-tenant)',
  })
  empresaId: string;

  // Auditoria
  @Column({
    name: 'criado_por',
    type: 'uuid',
    comment: 'ID do usuário que criou o registro',
  })
  criadoPor: string;

  @Column({
    name: 'atualizado_por',
    type: 'uuid',
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizadoPor: string;

  @CreateDateColumn({
    name: 'criado_em',
    comment: 'Data de criação do registro',
  })
  criadoEm: Date;

  @UpdateDateColumn({
    name: 'atualizado_em',
    comment: 'Data da última atualização',
  })
  atualizadoEm: Date;
}
