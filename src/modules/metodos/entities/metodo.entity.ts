import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { LaboratorioMetodo } from './laboratorio-metodo.entity';

export enum StatusMetodo {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  EM_VALIDACAO = 'em_validacao',
}

@Entity('metodos')
@Index(['codigoInterno'])
@Index(['nome'])
export class Metodo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome do método',
  })
  nome: string;

  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno do método (ex: MET123)',
  })
  codigoInterno: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada do método',
  })
  descricao: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusMetodo,
    default: StatusMetodo.EM_VALIDACAO,
    comment: 'Status do método',
  })
  status: StatusMetodo;

  @OneToMany(
    () => LaboratorioMetodo,
    (laboratorioMetodo) => laboratorioMetodo.metodo,
    {
      cascade: false,
    },
  )
  laboratorioMetodos: LaboratorioMetodo[];

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
