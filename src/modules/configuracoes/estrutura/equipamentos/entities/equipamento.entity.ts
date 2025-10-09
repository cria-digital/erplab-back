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
import { Sala } from '../../salas/entities/sala.entity';
import { Setor } from '../../setores/entities/setor.entity';
import { Fornecedor } from '../../../../relacionamento/fornecedores/entities/fornecedor.entity';

export enum SituacaoEquipamento {
  ATIVO = 'ativo',
  MANUTENCAO = 'manutencao',
  INATIVO = 'inativo',
  DESCARTADO = 'descartado',
}

/**
 * Entidade que representa um Equipamento
 *
 * Define os equipamentos utilizados no laboratório:
 * - Equipamentos laboratoriais (analisadores, centrífugas, etc)
 * - Equipamentos de imagem (ultrassom, raio-x)
 * - Equipamentos de informática (computadores, impressoras)
 * - Controle de manutenção e calibração
 */
@Entity('equipamentos')
@Index(['patrimonio'])
@Index(['nome'])
@Index(['salaId'])
@Index(['setorId'])
@Index(['fornecedorId'])
@Index(['situacao'])
@Index(['unidadeId'])
@Index(['empresaId'])
export class Equipamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Identificação
  @Column({
    name: 'patrimonio',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Número do patrimônio/tombamento (ex: PATR-001)',
  })
  patrimonio: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    length: 255,
    comment: 'Nome/descrição do equipamento',
  })
  nome: string;

  @Column({
    name: 'marca',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Marca do equipamento (ex: Roche, Siemens)',
  })
  marca: string;

  @Column({
    name: 'modelo',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Modelo do equipamento',
  })
  modelo: string;

  @Column({
    name: 'numero_serie',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Número de série do equipamento',
  })
  numeroSerie: string;

  // Localização
  @Column({
    name: 'sala_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID da sala onde está localizado',
  })
  salaId: string;

  @ManyToOne(() => Sala, { nullable: true })
  @JoinColumn({ name: 'sala_id' })
  sala: Sala;

  @Column({
    name: 'setor_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do setor responsável',
  })
  setorId: string;

  @ManyToOne(() => Setor, { nullable: true })
  @JoinColumn({ name: 'setor_id' })
  setor: Setor;

  // Aquisição
  @Column({
    name: 'fornecedor_id',
    type: 'uuid',
    nullable: true,
    comment: 'ID do fornecedor',
  })
  fornecedorId: string;

  @ManyToOne(() => Fornecedor, { nullable: true })
  @JoinColumn({ name: 'fornecedor_id' })
  fornecedor: Fornecedor;

  @Column({
    name: 'data_aquisicao',
    type: 'date',
    nullable: true,
    comment: 'Data de aquisição do equipamento',
  })
  dataAquisicao: Date;

  @Column({
    name: 'valor_aquisicao',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Valor pago na aquisição',
  })
  valorAquisicao: number;

  // Manutenção
  @Column({
    name: 'data_ultima_manutencao',
    type: 'date',
    nullable: true,
    comment: 'Data da última manutenção realizada',
  })
  dataUltimaManutencao: Date;

  @Column({
    name: 'data_proxima_manutencao',
    type: 'date',
    nullable: true,
    comment: 'Data prevista para próxima manutenção',
  })
  dataProximaManutencao: Date;

  @Column({
    name: 'periodicidade_manutencao_dias',
    type: 'integer',
    nullable: true,
    comment: 'Periodicidade da manutenção em dias',
  })
  periodicidadeManutencaoDias: number;

  // Status
  @Column({
    name: 'situacao',
    type: 'enum',
    enum: SituacaoEquipamento,
    default: SituacaoEquipamento.ATIVO,
    comment: 'Situação atual do equipamento',
  })
  situacao: SituacaoEquipamento;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações gerais sobre o equipamento',
  })
  observacoes: string;

  // Controle
  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    comment: 'Se o registro está ativo',
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
