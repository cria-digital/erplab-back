import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { Kit } from './kit.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';

@Entity('kit_unidades')
@Unique(['kit', 'unidade']) // Garante que uma unidade não seja duplicada no mesmo kit
@Index('IDX_kit_unidade_kit', ['kit'])
@Index('IDX_kit_unidade_unidade', ['unidade'])
export class KitUnidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Kit, (kit) => kit.kitUnidades, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'kit_id' })
  kit: Kit;

  @Column({ name: 'kit_id', type: 'uuid' })
  kitId: string;

  @ManyToOne(() => UnidadeSaude, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({ name: 'unidade_id', type: 'uuid' })
  unidadeId: string;

  @CreateDateColumn({
    name: 'created_at',
    comment: 'Data/hora de criação do registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Data/hora da última atualização',
  })
  updatedAt: Date;
}
