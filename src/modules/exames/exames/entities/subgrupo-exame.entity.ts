import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('subgrupos_exame')
@Index(['codigo'])
@Index(['nome'])
export class SubgrupoExame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: 'Código do subgrupo',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Nome do subgrupo (ex: Hematologia, Bioquímica, Radiologia)',
  })
  nome: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descrição do subgrupo',
  })
  descricao: string;

  @Column({
    type: 'enum',
    enum: ['laboratorio', 'imagem', 'procedimento', 'consulta'],
    comment: 'Categoria a qual pertence',
  })
  categoria: string;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Ordem de exibição',
  })
  ordem: number;

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo'],
    default: 'ativo',
    comment: 'Status do subgrupo',
  })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação',
  })
  criado_em: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data de atualização',
  })
  atualizado_em: Date;
}
