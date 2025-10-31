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
import { HorarioAtendimento } from './horario-atendimento.entity';
import { CnaeSecundario } from './cnae-secundario.entity';
import { Cnae } from '../../../infraestrutura/common/entities/cnae.entity';
import { ContaBancariaUnidade } from '../../../financeiro/core/entities/conta-bancaria-unidade.entity';

@Entity('unidades_saude')
export class UnidadeSaude {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Informações Básicas
  @Column({ name: 'nome_unidade', type: 'varchar', length: 255 })
  nomeUnidade: string;

  @Column({
    name: 'codigo_interno',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  codigoInterno: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cnpj: string;

  @Column({ name: 'razao_social', type: 'varchar', length: 255 })
  razaoSocial: string;

  @Column({ name: 'nome_fantasia', type: 'varchar', length: 255 })
  nomeFantasia: string;

  @Column({
    name: 'inscricao_municipal',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  inscricaoMunicipal: string;

  @Column({
    name: 'inscricao_estadual',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  inscricaoEstadual: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  cnes: string;

  @Column({
    name: 'contatos_unidade',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contatosUnidade: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({
    name: 'codigo_servico_principal',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  codigoServicoPrincipal: string;

  @Column({
    name: 'codigo_servico_secundario',
    type: 'jsonb',
    nullable: true,
    default: () => "'[]'",
  })
  codigoServicoSecundario: string[];

  @Column({
    name: 'cnae_principal_id',
    type: 'uuid',
    nullable: true,
  })
  cnaePrincipalId: string;

  @ManyToOne(() => Cnae, { nullable: true, eager: true })
  @JoinColumn({ name: 'cnae_principal_id' })
  cnaePrincipal: Cnae;

  // Imagem/Logo
  @Column({ name: 'imagem_url', type: 'varchar', length: 500, nullable: true })
  imagemUrl: string;

  // Endereço
  @Column({ type: 'varchar', length: 8, nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rua: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  numero: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complemento: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  estado: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string;

  // Responsável
  @Column({
    name: 'nome_responsavel',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  nomeResponsavel: string;

  @Column({
    name: 'contato_responsavel',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contatoResponsavel: string;

  @Column({
    name: 'email_responsavel',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  emailResponsavel: string;

  // Impostos (percentuais)
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
  @Column({ name: 'reter_iss', type: 'boolean', default: false })
  reterIss: boolean;

  @Column({ name: 'reter_ir', type: 'boolean', default: false })
  reterIr: boolean;

  @Column({ name: 'reter_pcc', type: 'boolean', default: false })
  reterPcc: boolean;

  @Column({ name: 'reter_ibs', type: 'boolean', default: false })
  reterIbs: boolean;

  @Column({ name: 'reter_cbs', type: 'boolean', default: false })
  reterCbs: boolean;

  @Column({ name: 'optante_simples_nacional', type: 'boolean', default: false })
  optanteSimplesNacional: boolean;

  // Certificado Digital
  @Column({
    name: 'certificado_digital_vinculado',
    type: 'boolean',
    default: false,
  })
  certificadoDigitalVinculado: boolean;

  @Column({
    name: 'certificado_digital_path',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  certificadoDigitalPath: string;

  @Column({
    name: 'certificado_digital_senha',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  certificadoDigitalSenha: string;

  @Column({
    name: 'certificado_digital_validade',
    type: 'date',
    nullable: true,
  })
  certificadoDigitalValidade: Date;

  // Status
  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => HorarioAtendimento, (horario) => horario.unidadeSaude, {
    cascade: true,
  })
  horariosAtendimento: HorarioAtendimento[];

  @OneToMany(() => ContaBancariaUnidade, (vinculo) => vinculo.unidade_saude, {
    cascade: true,
  })
  contas_bancarias: ContaBancariaUnidade[];

  @OneToMany(() => CnaeSecundario, (cnae) => cnae.unidadeSaude, {
    cascade: true,
  })
  cnaeSecundarios: CnaeSecundario[];
}
