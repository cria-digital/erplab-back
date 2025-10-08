import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContaPagar } from './conta-pagar.entity';
import { TipoImposto } from '../enums/contas-pagar.enum';

@Entity('impostos_retidos')
export class ImpostoRetido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conta_pagar_id', type: 'uuid' })
  contaPagarId: string;

  @ManyToOne(() => ContaPagar, (conta) => conta.impostosRetidos)
  @JoinColumn({ name: 'conta_pagar_id' })
  contaPagar: ContaPagar;

  @Column({ name: 'tipo_imposto', type: 'enum', enum: TipoImposto })
  tipoImposto: TipoImposto;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentual: number;

  @Column({ name: 'valor_calculado', type: 'decimal', precision: 10, scale: 2 })
  valorCalculado: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
