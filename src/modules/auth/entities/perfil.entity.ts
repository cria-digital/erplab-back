import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Permissao } from './permissao.entity';

export enum TipoPerfil {
  ADMIN_SISTEMA = 'admin_sistema',
  GESTOR_MATRIZ = 'gestor_matriz',
  OPERADOR_LOCAL = 'operador_local',
  RESPONSAVEL_TECNICO = 'responsavel_tecnico',
  CLIENTE_PACIENTE = 'cliente_paciente',
  MEDICO_PARCEIRO = 'medico_parceiro',
}

@Entity('perfis')
export class Perfil {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  nome: string;

  @Column({ length: 200, nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: TipoPerfil,
  })
  tipo: TipoPerfil;

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: false })
  acesso_multi_unidade: boolean; // Para gestores que podem acessar múltiplas unidades

  @Column({ default: false })
  pode_assinar_digitalmente: boolean; // Para responsáveis técnicos

  // Relacionamentos
  @OneToMany(() => Usuario, (usuario) => usuario.perfil)
  usuarios: Usuario[];

  @ManyToMany(() => Permissao, (permissao) => permissao.perfis)
  @JoinTable({
    name: 'perfis_permissoes',
    joinColumn: { name: 'perfil_id' },
    inverseJoinColumn: { name: 'permissao_id' },
  })
  permissoes: Permissao[];

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