import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ContaPagar } from './conta-pagar.entity';
import { Periodicidade } from '../enums/contas-pagar.enum';

@Entity('parcelamentos_config')
export class ParcelamentoConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conta_pagar_id', type: 'uuid', unique: true })
  contaPagarId: string;

  @OneToOne(() => ContaPagar, (conta) => conta.parcelamentoConfig)
  @JoinColumn({ name: 'conta_pagar_id' })
  contaPagar: ContaPagar;

  @Column({ name: 'numero_parcelas', type: 'int' })
  numeroParcelas: number;

  @Column({ type: 'enum', enum: Periodicidade, default: Periodicidade.MENSAL })
  periodicidade: Periodicidade;

  @Column({ name: 'data_primeira_parcela', type: 'date' })
  dataPrimeiraParcela: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
