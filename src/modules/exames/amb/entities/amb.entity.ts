import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Tabela AMB-92 - Associação Médica Brasileira
 * Tabela de procedimentos médicos com valores de referência
 */
@Entity('amb_92')
@Index(['codigo'], { unique: true })
@Index(['descricao'])
export class Amb {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Código AMB do procedimento',
  })
  codigo: string;

  @Column({
    type: 'text',
    comment: 'Descrição do procedimento',
  })
  descricao: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Coeficiente de Honorários (CH)',
  })
  ch: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Auxiliar',
  })
  aux: number;

  @Column({
    type: 'integer',
    nullable: true,
    comment: 'Porte anestésico',
  })
  porte: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    default: 'AMB-92',
    comment: 'Versão da tabela (AMB-92)',
  })
  versao: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Se o código está ativo',
  })
  ativo: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação do registro',
  })
  criado_em: Date;

  /**
   * Campo virtual: Descrição com código entre parênteses
   * Exemplo: "HEMOGRAMA COMPLETO (40304361)"
   */
  get descricaoCompleta(): string {
    return `${this.descricao} (${this.codigo})`;
  }
}
