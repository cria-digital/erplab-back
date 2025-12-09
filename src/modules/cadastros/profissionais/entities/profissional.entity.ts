import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  PronomeEnum,
  SexoEnum,
  TipoContratacaoEnum,
  TipoProfissionalEnum,
  EstadoConselhoEnum,
} from '../enums/profissionais.enum';
import { DocumentoProfissional } from './documento-profissional.entity';
import { Endereco } from '../../../infraestrutura/common/entities/endereco.entity';
import { Agenda } from '../../../atendimento/agendas/entities/agenda.entity';
import { Especialidade } from './especialidade.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('profissionais')
export class Profissional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PronomeEnum,
  })
  pronomesPessoal: PronomeEnum;

  @Column()
  nomeCompleto: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({
    type: 'enum',
    enum: SexoEnum,
  })
  sexo: SexoEnum;

  @Column()
  celular: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: TipoContratacaoEnum,
  })
  tipoContratacao: TipoContratacaoEnum;

  @Column()
  profissao: string;

  @Column({ unique: true })
  codigoInterno: string;

  @Column({
    type: 'enum',
    enum: TipoProfissionalEnum,
  })
  tipoProfissional: TipoProfissionalEnum;

  @Column()
  nomeConselho: string;

  @Column()
  numeroConselho: string;

  @Column({
    type: 'enum',
    enum: EstadoConselhoEnum,
  })
  estadoConselho: EstadoConselhoEnum;

  @Column()
  codigoCBO: string;

  @Column({ nullable: true })
  rqe: string;

  // Especialidade Principal (FK para Especialidade)
  @Column({ nullable: true })
  especialidadePrincipalId: string;

  @ManyToOne(() => Especialidade, { nullable: true })
  @JoinColumn({ name: 'especialidadePrincipalId' })
  especialidadePrincipal: Especialidade;

  // ========== ASSINATURA DIGITAL ==========
  // Campos visíveis apenas se tipoProfissional = REALIZANTE ou AMBOS

  @Column({ default: false })
  possuiAssinaturaDigital: boolean;

  @Column({ nullable: true })
  serialNumberCertificado: string;

  @Column({ nullable: true })
  usuarioAssinatura: string;

  @Column({ nullable: true })
  senhaAssinatura: string; // Armazenar criptografada

  // ========== INFORMAÇÕES DO REALIZANTE ==========
  // Campos visíveis apenas se tipoProfissional = REALIZANTE ou AMBOS

  // Especialidades que o profissional realiza (ManyToMany)
  @ManyToMany(() => Especialidade)
  @JoinTable({
    name: 'profissionais_especialidades_realiza',
    joinColumn: {
      name: 'profissional_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'especialidade_id',
      referencedColumnName: 'id',
    },
  })
  especialidadesRealiza: Especialidade[];

  // Exames que o profissional NÃO realiza (lista de IDs de exames)
  @Column({ type: 'uuid', array: true, nullable: true })
  examesNaoRealiza: string[];

  // Exames além da especialidade que o profissional realiza (lista de IDs de exames)
  @Column({ type: 'uuid', array: true, nullable: true })
  examesAlemEspecialidade: string[];

  @OneToMany(
    () => DocumentoProfissional,
    (documento) => documento.profissional,
    {
      cascade: true,
    },
  )
  documentos: DocumentoProfissional[];

  @Column({ nullable: true })
  enderecoId: string;

  @ManyToOne(() => Endereco, { nullable: true })
  @JoinColumn({ name: 'enderecoId' })
  endereco: Endereco;

  @OneToMany(() => Agenda, (agenda) => agenda.profissional)
  agendas: Agenda[];

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
