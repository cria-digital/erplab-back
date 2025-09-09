import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { UnidadeSaude } from '../../unidade-saude/entities/unidade-saude.entity';

@Entity('usuarios_unidades')
@Unique(['usuarioId', 'unidadeSaudeId'])
export class UsuarioUnidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @Column({ name: 'unidade_saude_id', type: 'uuid' })
  unidadeSaudeId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relacionamentos
  @ManyToOne(() => Usuario, (usuario) => usuario.unidades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => UnidadeSaude, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;
}
