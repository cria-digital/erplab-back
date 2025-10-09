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
import { Setor } from '../../setores/entities/setor.entity';

export enum TipoSala {
  COLETA = 'coleta',
  ANALISE = 'analise',
  EXAME = 'exame',
  ADMINISTRATIVA = 'administrativa',
  ESPERA = 'espera',
  OUTROS = 'outros',
}

/**
 * Entidade que representa uma Sala/Ambiente Físico
 *
 * Define os ambientes físicos do laboratório:
 * - Salas de coleta, análise, exames
 * - Salas administrativas e de espera
 * - Características e capacidades
 */
@Entity('salas')
@Index(['codigoSala'])
@Index(['nome'])
@Index(['tipoSala'])
@Index(['setorId'])
@Index(['unidadeId'])
@Index(['empresaId'])
export class Sala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Identificação
  @Column({
    name: 'codigo_sala',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código único da sala (ex: COL-01, LAB-HEMA)',
  })
  codigoSala: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome da sala (ex: Sala de Coleta 1)',
  })
  nome: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada da sala',
  })
  descricao: string;

  @Column({
    name: 'tipo_sala',
    type: 'enum',
    enum: TipoSala,
    comment: 'Tipo/finalidade da sala',
  })
  tipoSala: TipoSala;

  // Localização
  @Column({
    name: 'andar',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Andar/pavimento (ex: Térreo, 1º Andar, Subsolo)',
  })
  andar: string;

  @Column({
    name: 'bloco',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Bloco/ala (se aplicável)',
  })
  bloco: string;

  @Column({
    name: 'area',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Área em metros quadrados',
  })
  area: number;

  @Column({
    name: 'capacidade_pessoas',
    type: 'integer',
    nullable: true,
    comment: 'Capacidade máxima de pessoas',
  })
  capacidadePessoas: number;

  // Configurações
  @Column({
    name: 'setor_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do setor responsável pela sala',
  })
  setorId: string;

  @ManyToOne(() => Setor, { nullable: true })
  @JoinColumn({ name: 'setor_id' })
  setor: Setor;

  @Column({
    name: 'possui_climatizacao',
    type: 'boolean',
    default: false,
    comment: 'Se possui ar-condicionado/climatização',
  })
  possuiClimatizacao: boolean;

  @Column({
    name: 'possui_lavatorio',
    type: 'boolean',
    default: false,
    comment: 'Se possui lavatório/pia',
  })
  possuiLavatorio: boolean;

  @Column({
    name: 'acessibilidade',
    type: 'boolean',
    default: false,
    comment: 'Se possui acessibilidade para cadeirantes',
  })
  acessibilidade: boolean;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações gerais sobre a sala',
  })
  observacoes: string;

  // Controle
  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se a sala está ativa',
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
