import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AlternativaCampoFormulario } from './alternativa-campo-formulario.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';

/**
 * Enum com todos os campos de formulário disponíveis no sistema
 */
export enum NomeCampoFormulario {
  // Campos de Exames
  TIPO_EXAMES = 'tipo_exames',
  ESPECIALIDADE = 'especialidade',
  GRUPO = 'grupo',
  SUBGRUPO = 'subgrupo',
  SETOR = 'setor',
  METODOLOGIA = 'metodologia',
  UNIDADE_MEDIDA = 'unidade_medida',
  AMOSTRA = 'amostra',
  TIPO_RECIPIENTE = 'tipo_recipiente',
  REGIAO_COLETA = 'regiao_coleta',
  VOLUME_MINIMO = 'volume_minimo',
  ESTABILIDADE = 'estabilidade',
  FORMATO_LAUDO = 'formato_laudo',

  // Campos de Requisitos
  REQUISITOS_ANVISA = 'requisitos_anvisa',

  // Campos de Convênios
  TIPO_CONVENIO = 'tipo_convenio',
  FORMA_LIQUIDACAO = 'forma_liquidacao',
  ENVIO_FATURAMENTO = 'envio_faturamento',
  TABELA_SERVICO = 'tabela_servico',
  TABELA_BASE = 'tabela_base',
  TABELA_MATERIAL = 'tabela_material',
  DIA_VENCIMENTO = 'dia_vencimento',

  // Campos de Adquirentes
  OPCAO_PARCELAMENTO = 'opcao_parcelamento',
  RESTRICAO_ADQUIRENTE = 'restricao_adquirente',
  TIPO_CARTAO = 'tipo_cartao',
}

/**
 * Entidade que representa um Campo de Formulário Global
 *
 * Campos globais que podem ser reutilizados em diferentes formulários do sistema.
 * Exemplos: Tipo de exames, Especialidade, Unidade de medida, etc.
 *
 * Cada campo possui múltiplas alternativas (opções de seleção).
 */
@Entity('campos_formulario')
@Index(['nomeCampo'], { unique: true })
export class CampoFormulario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NomeCampoFormulario,
    name: 'nome_campo',
    unique: true,
    comment: 'Nome do campo (ex: unidade_medida, tipo_exames)',
  })
  nomeCampo: NomeCampoFormulario;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descrição do campo e seu uso',
  })
  descricao: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Se o campo está ativo (soft delete)',
  })
  ativo: boolean;

  // Relacionamento com alternativas
  @OneToMany(
    () => AlternativaCampoFormulario,
    (alternativa) => alternativa.campoFormulario,
    {
      cascade: true,
    },
  )
  alternativas: AlternativaCampoFormulario[];

  // Auditoria
  @CreateDateColumn({
    name: 'created_at',
    comment: 'Data de criação do registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Data da última atualização',
  })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'created_by',
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  createdBy: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'updated_by',
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  updatedBy: string;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
