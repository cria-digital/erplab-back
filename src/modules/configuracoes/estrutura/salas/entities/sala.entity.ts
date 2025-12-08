import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { AlternativaCampoFormulario } from '../../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';

/**
 * Entidade que representa uma Sala
 *
 * Conforme Figma: Cód interno, Unidade, Setor, Nome da sala, Status
 * Setor é um campo de formulário (dropdown com opções configuráveis)
 */
@Entity('salas')
@Index(['codigoInterno'])
@Index(['nome'])
@Index(['unidadeId'])
@Index(['setorId'])
export class Sala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno único da sala (ex: SALA080)',
  })
  codigoInterno: string;

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
    name: 'setor_id',
    type: 'uuid',
    comment: 'FK para alternativa de campo de formulário (setor)',
  })
  setorId: string;

  @ManyToOne(() => AlternativaCampoFormulario)
  @JoinColumn({ name: 'setor_id' })
  setor: AlternativaCampoFormulario;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome da sala (ex: IMG-04, SALA-01)',
  })
  nome: string;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se a sala está ativa',
  })
  ativo: boolean;

  // Auditoria
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

  @Column({
    name: 'criado_por',
    type: 'uuid',
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criadoPor: string;

  @Column({
    name: 'atualizado_por',
    type: 'uuid',
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizadoPor: string;
}
