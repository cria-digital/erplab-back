import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContaBancaria } from './conta-bancaria.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';

@Entity('contas_bancarias_unidades')
export class ContaBancariaUnidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conta_bancaria_id: string;

  @ManyToOne(() => ContaBancaria, (conta) => conta.unidades_vinculadas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conta_bancaria_id' })
  conta_bancaria: ContaBancaria;

  @Column({ type: 'uuid' })
  unidade_saude_id: string;

  @ManyToOne(() => UnidadeSaude, { eager: true })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidade_saude: UnidadeSaude;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  created_at: Date;
}
