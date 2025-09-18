import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoEmpresaEnum } from '../enums/empresas.enum';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TipoEmpresaEnum })
  tipoEmpresa: TipoEmpresaEnum;

  // Informações Básicas
  @Column({ nullable: true })
  codigoInterno: string;

  @Column({ unique: true })
  cnpj: string;

  @Column()
  razaoSocial: string;

  @Column()
  nomeFantasia: string;

  @Column({ nullable: true })
  inscricaoEstadual: string;

  @Column({ nullable: true })
  inscricaoMunicipal: string;

  @Column({ nullable: true })
  telefoneFixo: string;

  @Column({ nullable: true })
  celular: string;

  @Column()
  emailComercial: string;

  @Column({ nullable: true })
  siteEmpresa: string;

  // Endereço (seguindo padrão UnidadeSaude - campos diretos)
  @Column({ nullable: true })
  cep: string;

  @Column({ nullable: true })
  rua: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ nullable: true })
  bairro: string;

  @Column({ nullable: true })
  complemento: string;

  @Column({ nullable: true })
  estado: string;

  @Column({ nullable: true })
  cidade: string;

  // Responsável
  @Column({ nullable: true })
  nomeResponsavel: string;

  @Column({ nullable: true })
  cargoResponsavel: string;

  @Column({ nullable: true })
  contatoResponsavel: string;

  @Column({ nullable: true })
  emailResponsavel: string;

  // Impostos (seguindo padrão UnidadeSaude - campos diretos)
  @Column({
    name: 'irrf_percentual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  irrfPercentual: number;

  @Column({
    name: 'pis_percentual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  pisPercentual: number;

  @Column({
    name: 'cofins_percentual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  cofinsPercentual: number;

  @Column({
    name: 'csll_percentual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  csllPercentual: number;

  @Column({
    name: 'iss_percentual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  issPercentual: number;

  @Column({
    name: 'ibs_percentual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  ibsPercentual: number;

  @Column({
    name: 'cbs_percentual',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  cbsPercentual: number;

  // Retenções fiscais
  @Column({ default: false })
  reterIss: boolean;

  @Column({ default: false })
  reterIr: boolean;

  @Column({ default: false })
  reterPcc: boolean;

  @Column({ default: false })
  reterIbs: boolean;

  @Column({ default: false })
  reterCbs: boolean;

  @Column({ default: false })
  optanteSimplesNacional: boolean;

  // Financeiro e Pagamento
  @Column({ nullable: true })
  banco: string;

  @Column({ nullable: true })
  agencia: string;

  @Column({ nullable: true })
  contaCorrente: string;

  @Column({ nullable: true })
  formaPagamento: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
