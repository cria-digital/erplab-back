import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UnidadeSaude } from './unidade-saude.entity';
import { Cnae } from '../../common/entities/cnae.entity';

@Entity('cnae_secundarios')
export class CnaeSecundario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'unidade_saude_id', type: 'uuid' })
  unidadeSaudeId: string;

  @Column({ name: 'cnae_id', type: 'uuid' })
  cnaeId: string;

  @ManyToOne(() => Cnae, { eager: true })
  @JoinColumn({ name: 'cnae_id' })
  cnae: Cnae;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => UnidadeSaude, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;
}
