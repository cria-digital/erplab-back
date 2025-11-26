import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ContaBancaria } from './conta-bancaria.entity';
import { RestricaoAdquirente } from './restricao-adquirente.entity';
import { AdquirenteUnidade } from './adquirente-unidade.entity';
import { Integracao } from '../../../atendimento/integracoes/entities/integracao.entity';

export enum TipoAdquirente {
  CIELO = 'cielo',
  REDE = 'rede',
  GETNET = 'getnet',
  STONE = 'stone',
  PAGSEGURO = 'pagseguro',
  MERCADOPAGO = 'mercadopago',
  SAFRAPAY = 'safrapay',
  VERO = 'vero',
  OUTRO = 'outro',
}

export enum StatusAdquirente {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  BLOQUEADO = 'bloqueado',
  EM_ANALISE = 'em_analise',
}

export enum TipoCartao {
  MASTERCARD = 'mastercard',
  VISA = 'visa',
  ELO = 'elo',
  AMERICAN_EXPRESS = 'american_express',
  HIPERCARD = 'hipercard',
  DINERS = 'diners',
  OUTRO = 'outro',
}

export enum OpcaoParcelamento {
  '12X' = '12x',
  '6X' = '6x',
  '3X' = '3x',
  AVISTA = 'avista',
}

@Entity('adquirentes')
export class Adquirente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conta_bancaria_id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_interno: string;

  @Column({ type: 'varchar', length: 255 })
  nome_adquirente: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({
    type: 'enum',
    enum: TipoAdquirente,
  })
  tipo_adquirente: TipoAdquirente;

  @Column({ type: 'simple-array', nullable: true })
  tipos_cartao_suportados: TipoCartao[];

  @Column({
    type: 'enum',
    enum: OpcaoParcelamento,
    default: OpcaoParcelamento['12X'],
  })
  opcao_parcelamento: OpcaoParcelamento;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_transacao: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_repasse: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_estabelecimento: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  terminal_id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_antecipacao: number;

  @Column({ type: 'int', default: 30 })
  prazo_recebimento: number;

  @Column({ type: 'boolean', default: true })
  permite_parcelamento: boolean;

  @Column({ type: 'int', default: 12 })
  parcela_maxima: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxa_parcelamento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 50 })
  valor_minimo_parcela: number;

  @Column({
    type: 'enum',
    enum: StatusAdquirente,
    default: StatusAdquirente.ATIVO,
  })
  status: StatusAdquirente;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contato_comercial: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone_suporte: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email_suporte: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => ContaBancaria)
  @JoinColumn({ name: 'conta_bancaria_id' })
  conta_bancaria: ContaBancaria;

  @OneToMany(() => RestricaoAdquirente, (restricao) => restricao.adquirente)
  restricoes: RestricaoAdquirente[];

  // Relacionamento com Integração
  @Column({ type: 'uuid', nullable: true })
  integracao_id: string;

  @ManyToOne(() => Integracao, { nullable: true })
  @JoinColumn({ name: 'integracao_id' })
  integracao: Integracao;

  // Relacionamento ManyToMany com Unidades via tabela intermediária
  @OneToMany(
    () => AdquirenteUnidade,
    (adquirenteUnidade) => adquirenteUnidade.adquirente,
    { cascade: true },
  )
  unidades_associadas: AdquirenteUnidade[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
