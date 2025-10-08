import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

@Entity('planos_convenio')
export class PlanoConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ name: 'nome_plano' })
  nomePlano: string;

  @Column({ nullable: true, name: 'tabela_precos' })
  tabelaPrecos: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'valor_ch',
  })
  valorCh: number;

  @Column({ nullable: true, name: 'valor_filme' })
  valorFilme: string;

  @Column({ nullable: true, name: 'instrucoes', type: 'text' })
  instrucoes: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
