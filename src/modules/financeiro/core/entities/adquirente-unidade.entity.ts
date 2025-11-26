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

@Entity('adquirentes_unidades')
export class AdquirenteUnidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  adquirente_id: string;

  @Column({ type: 'uuid' })
  unidade_saude_id: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @ManyToOne(() => Adquirente, (adquirente) => adquirente.unidades_associadas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adquirente_id' })
  adquirente: Adquirente;

  @ManyToOne(() => UnidadeSaude, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidade_saude: UnidadeSaude;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
