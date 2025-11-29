import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { TabelaPreco } from './tabela-preco.entity';
import { Exame } from '../../../exames/exames/entities/exame.entity';

/**
 * Item da Tabela de Preços
 *
 * Cada item representa o preço de um exame específico dentro de uma tabela.
 * O mesmo exame não pode aparecer duas vezes na mesma tabela (constraint UNIQUE).
 *
 * Campos conforme Figma (chunk_021, páginas 1 e 4):
 * - Cód Exame / Nome do exame: vínculo com cadastro de exames
 * - Cód Convênio: código próprio do convênio (quando não usa TUSS/AMB)
 * - Moeda: moeda do valor (padrão BRL)
 * - Qntd Filme: quantidade de filme
 * - Filme separado: se o filme é cobrado separadamente
 * - Porte: porte anestésico
 * - Valor: valor do exame
 * - Custo operacional: custo operacional
 */
@Entity('tabelas_preco_itens')
@Unique(['tabela_preco_id', 'exame_id'])
export class TabelaPrecoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ==========================================
  // VÍNCULOS OBRIGATÓRIOS
  // ==========================================

  @Column({
    type: 'uuid',
    comment: 'FK → tabelas_preco',
  })
  tabela_preco_id: string;

  @ManyToOne(() => TabelaPreco, (tabela) => tabela.itens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tabela_preco_id' })
  tabelaPreco: TabelaPreco;

  @Column({
    type: 'uuid',
    comment: 'FK → exames (vínculo obrigatório com cadastro de exames)',
  })
  exame_id: string;

  @ManyToOne(() => Exame, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'exame_id' })
  exame: Exame;

  // ==========================================
  // CAMPOS DO FIGMA - Valores da Tabela
  // ==========================================

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código próprio do convênio (quando não usa TUSS/AMB)',
  })
  codigo_convenio: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'BRL',
    comment: 'Moeda do valor (ex: BRL, USD)',
  })
  moeda: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    default: 0,
    comment: 'Quantidade de filme',
  })
  quantidade_filme: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Filme cobrado separadamente?',
  })
  filme_separado: boolean;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Porte anestésico',
  })
  porte: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Valor do exame',
  })
  valor: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Custo operacional',
  })
  custo_operacional: number;

  // ==========================================
  // CONTROLE
  // ==========================================

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Item ativo?',
  })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
