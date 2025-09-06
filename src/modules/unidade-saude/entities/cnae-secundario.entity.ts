import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UnidadeSaude } from './unidade-saude.entity';

@Entity('cnae_secundarios')
export class CnaeSecundario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'unidade_saude_id', type: 'uuid' })
  unidadeSaudeId: string;

  @Column({ name: 'codigo_cnae', type: 'varchar', length: 10 })
  codigoCnae: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descricao: string;

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