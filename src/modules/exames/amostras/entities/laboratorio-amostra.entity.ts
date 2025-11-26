import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Amostra } from './amostra.entity';
import { Laboratorio } from '../../../relacionamento/laboratorios/entities/laboratorio.entity';

@Entity('laboratorios_amostras')
@Unique(['laboratorioId', 'amostraId'])
@Index(['laboratorioId'])
@Index(['amostraId'])
export class LaboratorioAmostra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'laboratorio_id',
    type: 'uuid',
    comment: 'ID do laboratório',
  })
  laboratorioId: string;

  @ManyToOne(() => Laboratorio, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'laboratorio_id' })
  laboratorio: Laboratorio;

  @Column({
    name: 'amostra_id',
    type: 'uuid',
    comment: 'ID da amostra',
  })
  amostraId: string;

  @ManyToOne(() => Amostra, (amostra) => amostra.laboratorioAmostras, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'amostra_id' })
  amostra: Amostra;

  @Column({
    name: 'validado',
    type: 'boolean',
    default: false,
    comment: 'Indica se o laboratório está validado para usar esta amostra',
  })
  validado: boolean;

  @Column({
    name: 'data_validacao',
    type: 'timestamp',
    nullable: true,
    comment: 'Data de validação do laboratório para a amostra',
  })
  dataValidacao: Date;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações sobre o vínculo laboratório-amostra',
  })
  observacoes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
