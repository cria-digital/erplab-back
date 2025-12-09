import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { OrdemServico } from './ordem-servico.entity';
import { Exame } from './exame.entity';
import { ResultadoExame } from './resultado-exame.entity';
import { LaboratorioApoio } from './laboratorio-apoio.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('ordens_servico_exames')
@Index(['ordem_servico_id', 'exame_id'], { unique: true })
@Index(['status'])
@Index(['codigo_amostra'])
export class OrdemServicoExame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'ID da ordem de serviço',
  })
  ordem_servico_id: string;

  @Column({
    comment: 'ID do exame',
  })
  exame_id: string;

  @Column({
    type: 'int',
    default: 1,
    comment: 'Quantidade do exame',
  })
  quantidade: number;

  // Identificação da amostra
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código único da amostra/tubo',
  })
  codigo_amostra: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código de barras da amostra',
  })
  codigo_barras: string;

  // Status específico do exame
  @Column({
    type: 'enum',
    enum: [
      'pendente',
      'aguardando_coleta',
      'coletado',
      'enviado_apoio',
      'em_analise',
      'liberado',
      'repetir',
      'cancelado',
    ],
    default: 'pendente',
    comment: 'Status do exame',
  })
  status: string;

  // Valores
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor unitário do exame',
  })
  valor_unitario: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor total (quantidade x unitário)',
  })
  valor_total: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor de desconto aplicado',
  })
  valor_desconto: number;

  // Coleta
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora da coleta',
  })
  data_coleta: Date;

  @Column({
    nullable: true,
    comment: 'ID do profissional que coletou',
  })
  coletor_id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Local da coleta (sala, domicílio, etc)',
  })
  local_coleta: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações da coleta',
  })
  observacoes_coleta: string;

  // Material coletado
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Tipo de material coletado',
  })
  material_coletado: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Volume coletado (ml)',
  })
  volume_coletado: number;

  // Envio para apoio
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora do envio para laboratório de apoio',
  })
  data_envio_apoio: Date;

  @Column({
    nullable: true,
    comment: 'ID do laboratório de apoio destinatário',
  })
  laboratorio_apoio_id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código do exame no laboratório de apoio',
  })
  codigo_apoio: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número do lote de envio',
  })
  lote_envio: string;

  // Análise
  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora do início da análise',
  })
  data_inicio_analise: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora da liberação do resultado',
  })
  data_liberacao: Date;

  @Column({
    nullable: true,
    comment: 'ID do analista/biomédico',
  })
  analista_id: string;

  @Column({
    nullable: true,
    comment: 'ID do responsável técnico que liberou',
  })
  liberado_por: string;

  // Repetição
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se é uma repetição de exame',
  })
  is_repeticao: boolean;

  @Column({
    nullable: true,
    comment: 'ID do exame original (se for repetição)',
  })
  exame_original_id: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Motivo da repetição',
  })
  motivo_repeticao: string;

  // Observações
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações gerais do exame',
  })
  observacoes: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Notas técnicas (visível apenas internamente)',
  })
  notas_tecnicas: string;

  // Rastreabilidade de equipamentos e reagentes
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Equipamentos utilizados',
  })
  equipamentos_utilizados: any;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Reagentes e lotes utilizados',
  })
  reagentes_utilizados: any;

  // Controle de qualidade
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se passou pelo controle de qualidade',
  })
  controle_qualidade_ok: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data da verificação do controle de qualidade',
  })
  data_controle_qualidade: Date;

  @Column({
    nullable: true,
    comment: 'ID do responsável pelo controle de qualidade',
  })
  responsavel_controle_id: string;

  // Urgência
  @Column({
    type: 'boolean',
    default: false,
    comment: 'Se é exame urgente',
  })
  is_urgente: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Prazo máximo para liberação (se urgente)',
  })
  prazo_maximo: Date;

  // Campos de auditoria
  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Data de criação do registro',
  })
  criado_em: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Data da última atualização',
  })
  atualizado_em: Date;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do usuário que criou o registro',
  })
  criado_por: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do usuário que atualizou o registro',
  })
  atualizado_por: number;

  // Relacionamentos
  @ManyToOne(() => OrdemServico, (os) => os.exames, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordem_servico_id' })
  ordemServico?: OrdemServico;

  @ManyToOne(() => Exame, { eager: false })
  @JoinColumn({ name: 'exame_id' })
  exame?: Exame;

  @ManyToOne(() => LaboratorioApoio, { eager: false })
  @JoinColumn({ name: 'laboratorio_apoio_id' })
  laboratorioApoio?: LaboratorioApoio;

  @OneToMany(() => ResultadoExame, (resultado) => resultado.ordemServicoExame)
  resultados?: ResultadoExame[];

  // Métodos auxiliares
  getCodigoAmostraFormatado(): string {
    return (
      this.codigo_amostra || `OS${this.ordem_servico_id}-EX${this.exame_id}`
    );
  }

  isColetado(): boolean {
    return ['coletado', 'enviado_apoio', 'em_analise', 'liberado'].includes(
      this.status,
    );
  }

  isLiberado(): boolean {
    return this.status === 'liberado';
  }

  needsRepeat(): boolean {
    return this.status === 'repetir';
  }

  isExternal(): boolean {
    return !!this.laboratorio_apoio_id;
  }

  getValorFinal(): number {
    return this.valor_total - this.valor_desconto;
  }

  canCollect(): boolean {
    return ['pendente', 'aguardando_coleta'].includes(this.status);
  }

  canRelease(): boolean {
    return this.status === 'em_analise';
  }

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
