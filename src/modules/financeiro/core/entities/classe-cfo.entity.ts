import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { HierarquiaCfo } from './hierarquia-cfo.entity';

export enum TipoClasseCfo {
  TITULO = 'TITULO',
  NIVEL = 'NIVEL',
}

@Entity('classes_cfo')
@Index(['hierarquiaId', 'ordem'])
export class ClasseCfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'hierarquia_id' })
  hierarquiaId: string;

  @ManyToOne(() => HierarquiaCfo, (hierarquia) => hierarquia.classes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hierarquia_id' })
  hierarquia: HierarquiaCfo;

  @Column({
    type: 'enum',
    enum: TipoClasseCfo,
  })
  tipo: TipoClasseCfo;

  // Nível de classificação: 1, 2, 3 ou 4 (null para TITULO)
  @Column({ type: 'int', nullable: true, name: 'nivel_classificacao' })
  nivelClassificacao: number;

  // Código hierárquico para ordenação (ex: "1", "1.1", "1.1.1", "1.1.1.1")
  @Column({ type: 'varchar', length: 20, name: 'codigo_hierarquico' })
  codigoHierarquico: string;

  // Código contábil (opcional)
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'codigo_contabil',
  })
  codigoContabil: string;

  // Nome da classe ou título
  @Column({ type: 'varchar', length: 255, name: 'nome_classe' })
  nomeClasse: string;

  // Ordem de exibição dentro da hierarquia
  @Column({ type: 'int', default: 0 })
  ordem: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
