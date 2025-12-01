import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('especialidades')
export class Especialidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ nullable: true })
  codigoCBOS: string; // Código CBO-S (Classificação Brasileira de Ocupações - Saúde)

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
