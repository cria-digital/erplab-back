import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UsuarioPermissao } from './usuario-permissao.entity';

@Entity('modulos_sistema')
export class ModuloSistema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'int', nullable: true })
  ordem: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // Relacionamentos
  @OneToMany(() => UsuarioPermissao, (permissao) => permissao.modulo)
  permissoes: UsuarioPermissao[];
}