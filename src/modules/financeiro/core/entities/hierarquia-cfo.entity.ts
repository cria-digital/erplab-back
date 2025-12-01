import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ClasseCfo } from './classe-cfo.entity';

@Entity('hierarquias_cfo')
export class HierarquiaCfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 255 })
  descricao: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'uuid', nullable: true })
  empresa_id: string;

  @OneToMany(() => ClasseCfo, (classe) => classe.hierarquia, { cascade: true })
  classes: ClasseCfo[];

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;
}
