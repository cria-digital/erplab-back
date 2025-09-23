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
import { Convenio } from '../../convenios/entities/convenio.entity';

@Entity('kit_convenios')
@Unique(['kit', 'convenio']) // Garante que um convênio não seja duplicado no mesmo kit
@Index('IDX_kit_convenio_kit', ['kit'])
@Index('IDX_kit_convenio_convenio', ['convenio'])
export class KitConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Kit, (kit) => kit.kitConvenios, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'kit_id' })
  kit: Kit;

  @Column({ name: 'kit_id', type: 'uuid' })
  kitId: string;

  @ManyToOne(() => Convenio, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'convenio_id' })
  convenio: Convenio;

  @Column({ name: 'convenio_id', type: 'uuid' })
  convenioId: string;

  @Column({
    name: 'valor_convenio',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor do kit para este convênio específico',
  })
  valorConvenio: number;

  @Column({
    name: 'disponivel',
    type: 'boolean',
    default: true,
    comment: 'Indica se o kit está disponível para este convênio',
  })
  disponivel: boolean;

  @Column({
    name: 'requer_autorizacao',
    type: 'boolean',
    default: false,
    comment: 'Indica se requer autorização do convênio para este kit',
  })
  requerAutorizacao: boolean;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações específicas do kit para este convênio',
  })
  observacoes: string;

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
