import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

export enum TipoUnidade {
  MATRIZ = 'matriz',
  FILIAL = 'filial',
}

@Entity('unidades')
export class Unidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 18 }) // CNPJ: XX.XXX.XXX/XXXX-XX
  cnpj: string;

  @Column({ length: 200 })
  razao_social: string;

  @Column({ length: 200, nullable: true })
  nome_fantasia: string;

  @Column({
    type: 'enum',
    enum: TipoUnidade,
  })
  tipo: TipoUnidade;

  @Column({ length: 100 })
  cidade: string;

  @Column({ length: 2 })
  estado: string;

  @Column({ length: 10 })
  cep: string;

  @Column({ length: 200 })
  endereco: string;

  @Column({ length: 50, nullable: true })
  numero: string;

  @Column({ length: 100, nullable: true })
  complemento: string;

  @Column({ length: 100 })
  bairro: string;

  @Column({ length: 15, nullable: true })
  telefone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ default: true })
  ativa: boolean;

  // Relacionamento hierárquico (matriz -> filiais)
  @ManyToOne(() => Unidade, (unidade) => unidade.filiais, { nullable: true })
  @JoinColumn({ name: 'matriz_id' })
  matriz: Unidade;

  @Column({ nullable: true })
  matriz_id: string;

  @OneToMany(() => Unidade, (unidade) => unidade.matriz)
  filiais: Unidade[];

  // Usuários da unidade
  @OneToMany(() => Usuario, (usuario) => usuario.unidade)
  usuarios: Usuario[];

  // Auditoria
  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @Column({ nullable: true })
  criado_por: string;

  @Column({ nullable: true })
  atualizado_por: string;
}
