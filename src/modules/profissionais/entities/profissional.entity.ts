import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import {
  PronomeEnum,
  SexoEnum,
  TipoContratacaoEnum,
  TipoProfissionalEnum,
  EstadoConselhoEnum,
} from '../enums/profissionais.enum';
import { DocumentoProfissional } from './documento-profissional.entity';
import { Endereco } from '../../../comum/entities/endereco.entity';
import { Agenda } from '../../agendas/entities/agenda.entity';

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

  @Column({ nullable: true })
  especialidadePrincipal: string;

  @Column({ default: false })
  possuiAssinaturaDigital: boolean;

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

  @ManyToMany(() => Agenda, (agenda) => agenda.profissionais)
  @JoinTable({
    name: 'profissionais_agendas',
    joinColumn: {
      name: 'profissional_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'agenda_id',
      referencedColumnName: 'id',
    },
  })
  agendas: Agenda[];

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
