import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { ModuloSistema } from './modulo-sistema.entity';
import { TipoPermissao } from './tipo-permissao.entity';
import { UnidadeSaude } from '../../unidade-saude/entities/unidade-saude.entity';

@Entity('usuarios_permissoes')
@Unique(['usuarioId', 'moduloId', 'permissaoId', 'unidadeSaudeId'])
export class UsuarioPermissao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @Column({ name: 'modulo_id', type: 'uuid' })
  moduloId: string;

  @Column({ name: 'permissao_id', type: 'uuid' })
  permissaoId: string;

  @Column({ name: 'unidade_saude_id', type: 'uuid', nullable: true })
  unidadeSaudeId: string;

  @Column({ type: 'boolean', default: false })
  concedido: boolean;

  @Column({ name: 'horario_inicio', type: 'time', nullable: true })
  horarioInicio: string;

  @Column({ name: 'horario_fim', type: 'time', nullable: true })
  horarioFim: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Usuario, (usuario) => usuario.permissoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => ModuloSistema, (modulo) => modulo.permissoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'modulo_id' })
  modulo: ModuloSistema;

  @ManyToOne(() => TipoPermissao, (tipo) => tipo.permissoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissao_id' })
  tipoPermissao: TipoPermissao;

  @ManyToOne(() => UnidadeSaude, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude: UnidadeSaude;
}