import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ContaBancaria } from './conta-bancaria.entity';

export enum StatusBanco {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

@Entity('bancos')
export class Banco {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 10 })
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: StatusBanco,
    default: StatusBanco.ATIVO,
  })
  status: StatusBanco;

  @OneToMany(() => ContaBancaria, (contaBancaria) => contaBancaria.banco)
  contas: ContaBancaria[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
