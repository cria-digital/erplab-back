import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('cnaes')
@Index('idx_cnae_codigo', ['codigo'])
@Index('idx_cnae_secao', ['secao'])
@Index('idx_cnae_divisao', ['divisao'])
export class Cnae {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  secao: string;

  @Column({
    name: 'descricao_secao',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descricaoSecao: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  divisao: string;

  @Column({
    name: 'descricao_divisao',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descricaoDivisao: string;

  @Column({ type: 'varchar', length: 3, nullable: true })
  grupo: string;

  @Column({
    name: 'descricao_grupo',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descricaoGrupo: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  classe: string;

  @Column({
    name: 'descricao_classe',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descricaoClasse: string;

  @Column({ name: 'subclasse', type: 'varchar', length: 7, nullable: true })
  subclasse: string;

  @Column({ name: 'descricao_subclasse', type: 'text', nullable: true })
  descricaoSubclasse: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ name: 'observacoes', type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
