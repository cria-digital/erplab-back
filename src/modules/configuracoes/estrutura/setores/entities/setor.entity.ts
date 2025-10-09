import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Profissional } from '../../../../cadastros/profissionais/entities/profissional.entity';

export enum TipoSetor {
  LABORATORIAL = 'laboratorial',
  CLINICO = 'clinico',
  ADMINISTRATIVO = 'administrativo',
  APOIO = 'apoio',
}

/**
 * Entidade que representa um Setor/Departamento
 *
 * Define os setores organizacionais do laboratório:
 * - Setores laboratoriais (hematologia, bioquímica, etc)
 * - Setores clínicos (coleta, atendimento)
 * - Setores administrativos (financeiro, RH)
 * - Setores de apoio (TI, manutenção)
 * - Suporta hierarquia (setor pai/filho)
 */
@Entity('setores')
@Index(['codigoSetor'])
@Index(['nome'])
@Index(['tipoSetor'])
@Index(['setorPaiId'])
@Index(['responsavelId'])
@Index(['unidadeId'])
@Index(['empresaId'])
export class Setor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Identificação
  @Column({
    name: 'codigo_setor',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código único do setor (ex: LAB-HEMA, ADM-FIN)',
  })
  codigoSetor: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome do setor (ex: Laboratório de Hematologia)',
  })
  nome: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada do setor',
  })
  descricao: string;

  @Column({
    name: 'tipo_setor',
    type: 'enum',
    enum: TipoSetor,
    comment: 'Tipo/categoria do setor',
  })
  tipoSetor: TipoSetor;

  // Hierarquia
  @Column({
    name: 'setor_pai_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do setor pai (para hierarquia)',
  })
  setorPaiId: string;

  @ManyToOne(() => Setor, (setor) => setor.setoresFilhos, {
    nullable: true,
  })
  @JoinColumn({ name: 'setor_pai_id' })
  setorPai: Setor;

  @OneToMany(() => Setor, (setor) => setor.setorPai)
  setoresFilhos: Setor[];

  // Responsável
  @Column({
    name: 'responsavel_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do profissional responsável pelo setor',
  })
  responsavelId: string;

  @ManyToOne(() => Profissional, { nullable: true })
  @JoinColumn({ name: 'responsavel_id' })
  responsavel: Profissional;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações gerais sobre o setor',
  })
  observacoes: string;

  // Controle
  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se o setor está ativo',
  })
  ativo: boolean;

  @Column({
    name: 'unidade_id',
    type: 'uuid',
    comment: 'ID da unidade de saúde',
  })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude)
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({
    name: 'empresa_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID da empresa (multi-tenant)',
  })
  empresaId: string;

  // Auditoria
  @Column({
    name: 'criado_por',
    type: 'uuid',
    comment: 'ID do usuário que criou o registro',
  })
  criadoPor: string;

  @Column({
    name: 'atualizado_por',
    type: 'uuid',
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizadoPor: string;

  @CreateDateColumn({
    name: 'criado_em',
    comment: 'Data de criação do registro',
  })
  criadoEm: Date;

  @UpdateDateColumn({
    name: 'atualizado_em',
    comment: 'Data da última atualização',
  })
  atualizadoEm: Date;
}
