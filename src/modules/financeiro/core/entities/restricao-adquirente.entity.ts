import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Adquirente } from './adquirente.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';

@Entity('restricoes_adquirente')
export class RestricaoAdquirente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  unidade_saude_id: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_saude_id' })
  unidade_saude: UnidadeSaude;

  @Column({ type: 'text', nullable: true })
  restricao: string;

  @Column({ type: 'uuid' })
  adquirente_id: string;

  @ManyToOne(() => Adquirente, (adquirente) => adquirente.restricoes)
  @JoinColumn({ name: 'adquirente_id' })
  adquirente: Adquirente;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
