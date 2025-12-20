import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Tabela TUSS - Terminologia Unificada da Saúde Suplementar
 * Códigos oficiais da ANS para procedimentos e eventos em saúde
 */
@Entity('tuss')
@Index(['codigo'], { unique: true })
@Index(['termo'])
export class Tuss {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Código TUSS (8 dígitos)',
  })
  codigo: string;

  @Column({
    type: 'text',
    comment: 'Termo/Descrição do procedimento',
  })
  termo: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Versão da tabela TUSS (ex: 202511)',
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
   * Campo virtual: Termo com código entre parênteses
   * Exemplo: "HEMOGRAMA COMPLETO (40304361)"
   */
  get descricaoCompleta(): string {
    return `${this.termo} (${this.codigo})`;
  }
}
