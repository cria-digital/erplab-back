import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KitExame } from './kit-exame.entity';
import { KitUnidade } from './kit-unidade.entity';
import { KitConvenio } from './kit-convenio.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';

export enum TipoKitEnum {
  CHECK_UP = 'CHECK_UP',
  OCUPACIONAL = 'OCUPACIONAL',
  PRE_NATAL = 'PRE_NATAL',
  COM_DESCRICAO = 'COM_DESCRICAO',
  PERSONALIZADO = 'PERSONALIZADO',
}

export enum StatusKitEnum {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  EM_REVISAO = 'EM_REVISAO',
}

@Entity('kits')
export class Kit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código interno único do kit (ex.: KIT001)',
  })
  codigoInterno: string;

  @Column({
    name: 'nome_kit',
    type: 'varchar',
    length: 255,
    comment:
      'Nome do kit (ex.: Kit Check-up Básico, Kit Exames Ocupacionais Padrão)',
  })
  nomeKit: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: true,
    comment: 'Descrição detalhada do kit',
  })
  descricao: string;

  @Column({
    name: 'tipo_kit',
    type: 'enum',
    enum: TipoKitEnum,
    comment:
      'Tipo de kit (Check-up, Ocupacional, Pré-Natal, com descrição para categorização)',
  })
  tipoKit: TipoKitEnum;

  @Column({
    name: 'status_kit',
    type: 'enum',
    enum: StatusKitEnum,
    default: StatusKitEnum.ATIVO,
    comment: 'Status do kit (Ativo, Inativo, Em Revisão)',
  })
  statusKit: StatusKitEnum;

  @Column({
    name: 'prazo_padrao_entrega',
    type: 'int',
    nullable: true,
    comment:
      'Prazo padrão de entrega do kit em dias (ex.: 3 para 72h, 48h, com base nos prazos dos exames)',
  })
  prazoPadraoEntrega: number;

  @ManyToOne(() => Empresa, {
    nullable: false,
    eager: false,
  })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({
    name: 'empresa_id',
    type: 'uuid',
    comment: 'ID da empresa associada ao kit',
  })
  empresaId: string;

  @Column({
    name: 'valor_total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor total do kit',
  })
  valorTotal: number;

  @Column({
    name: 'preco_kit',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Preço do kit para venda',
  })
  precoKit: number;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações específicas para cada exame no kit',
  })
  observacoes: string;

  @OneToMany(() => KitExame, (kitExame) => kitExame.kit, {
    cascade: true,
    eager: false,
  })
  kitExames: KitExame[];

  @OneToMany(() => KitUnidade, (kitUnidade) => kitUnidade.kit, {
    cascade: true,
    eager: false,
  })
  kitUnidades: KitUnidade[];

  @OneToMany(() => KitConvenio, (kitConvenio) => kitConvenio.kit, {
    cascade: true,
    eager: false,
  })
  kitConvenios: KitConvenio[];

  @Column({
    name: 'data_criacao',
    type: 'timestamp',
    nullable: true,
    comment: 'Data de criação do cadastro',
  })
  dataCriacao: Date;

  @CreateDateColumn({
    name: 'created_at',
    comment: 'Data/hora de criação do registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Data/hora da última atualização',
  })
  updatedAt: Date;
}
