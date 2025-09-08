import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UsuarioPermissao } from './usuario-permissao.entity';

@Entity('tipos_permissao')
export class TipoPermissao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relacionamentos
  @OneToMany(() => UsuarioPermissao, (permissao) => permissao.tipoPermissao)
  permissoes: UsuarioPermissao[];
}