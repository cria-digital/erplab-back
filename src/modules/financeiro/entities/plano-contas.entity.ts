import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ContaContabil } from './conta-contabil.entity';

@Entity('planos_contas')
export class PlanoContas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  descricao_hierarquia: string;

  @Column({ type: 'varchar', length: 255 })
  nome_hierarquia: string;

  @Column({ type: 'date' })
  data_cadastro: Date;

  @Column({ type: 'date', nullable: true })
  ultima_edicao: Date;

  @Column({ type: 'uuid', nullable: true })
  usuario_cadastro_id: string;

  @Column({ type: 'uuid', nullable: true })
  usuario_edicao_id: string;

  @OneToMany(() => ContaContabil, (conta) => conta.plano_contas)
  contas_contabeis: ContaContabil[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
