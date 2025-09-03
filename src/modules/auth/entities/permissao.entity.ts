import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Perfil } from './perfil.entity';

export enum ModuloSistema {
  ATENDIMENTO = 'atendimento',
  EXAMES = 'exames',
  FINANCEIRO = 'financeiro',
  CRM = 'crm',
  AUDITORIA = 'auditoria',
  ESTOQUE = 'estoque',
  TISS = 'tiss',
  TAREFAS = 'tarefas',
  BI = 'bi',
  PORTAL_CLIENTE = 'portal_cliente',
  PORTAL_MEDICO = 'portal_medico',
  INTEGRACOES = 'integracoes',
  AUTH = 'auth',
  ADMIN = 'admin',
}

export enum TipoAcao {
  CRIAR = 'criar',
  LER = 'ler',
  ATUALIZAR = 'atualizar',
  DELETAR = 'deletar',
  APROVAR = 'aprovar',
  ASSINAR_DIGITALMENTE = 'assinar_digitalmente',
  EXPORTAR = 'exportar',
  IMPORTAR = 'importar',
}

@Entity('permissoes')
export class Permissao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 200, nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: ModuloSistema,
  })
  modulo: ModuloSistema;

  @Column({
    type: 'enum',
    enum: TipoAcao,
  })
  acao: TipoAcao;

  @Column({ length: 100 })
  recurso: string; // Ex: 'ordens_servico', 'laudos', 'usuarios'

  @Column({ default: true })
  ativa: boolean;

  // Relacionamentos
  @ManyToMany(() => Perfil, (perfil) => perfil.permissoes)
  perfis: Perfil[];

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