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

@Entity('dados_bancarios')
export class DadoBancario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'unidade_saude_id', type: 'uuid' })
  unidadeSaudeId: string;

  @Column({ type: 'varchar', length: 100 })
  banco: string;

  @Column({ name: 'codigo_banco', type: 'varchar', length: 10, nullable: true })
  codigoBanco: string;

  @Column({ type: 'varchar', length: 20 })
  agencia: string;

  @Column({
    name: 'digito_agencia',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  digitoAgencia: string;

  @Column({ name: 'conta_corrente', type: 'varchar', length: 20 })
  contaCorrente: string;

  @Column({ name: 'digito_conta', type: 'varchar', length: 2, nullable: true })
  digitoConta: string;

  @Column({
    name: 'tipo_conta',
    type: 'varchar',
    length: 20,
    default: 'CORRENTE',
  })
  tipoConta: string; // CORRENTE, POUPANCA

  @Column({ type: 'boolean', default: false })
  principal: boolean;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observacoes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => UnidadeSaude, (unidade) => unidade.dadosBancarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;
}
