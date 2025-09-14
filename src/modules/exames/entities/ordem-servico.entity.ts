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
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { UnidadeSaude } from '../../unidade-saude/entities/unidade-saude.entity';
import { OrdemServicoExame } from './ordem-servico-exame.entity';
import { Convenio } from './convenio.entity';

@Entity('ordens_servico')
@Index(['codigo'])
@Index(['protocolo'])
@Index(['data_atendimento'])
@Index(['paciente_id'])
@Index(['status'])
export class OrdemServico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Código único da ordem de serviço',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Protocolo de atendimento',
  })
  protocolo: string;

  // Paciente
  @Column({
    type: 'int',
    comment: 'ID do paciente',
  })
  paciente_id: number;

  // Unidade de atendimento
  @Column({
    type: 'uuid',
    comment: 'ID da unidade de saúde',
  })
  unidade_saude_id: string;

  // Datas e horários
  @Column({
    type: 'timestamp',
    comment: 'Data e hora do atendimento',
  })
  data_atendimento: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Data prevista para coleta',
  })
  data_coleta_prevista: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora real da coleta',
  })
  data_coleta_realizada: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Data prevista de entrega',
  })
  data_entrega_prevista: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Data e hora da entrega',
  })
  data_entrega_realizada: Date;

  // Origem e tipo
  @Column({
    type: 'enum',
    enum: [
      'presencial',
      'whatsapp',
      'telefone',
      'email',
      'portal',
      'domiciliar',
    ],
    comment: 'Canal de origem do atendimento',
  })
  canal_origem: string;

  @Column({
    type: 'enum',
    enum: ['normal', 'urgente', 'emergencia'],
    default: 'normal',
    comment: 'Prioridade do atendimento',
  })
  prioridade: string;

  @Column({
    type: 'enum',
    enum: ['particular', 'convenio', 'sus'],
    comment: 'Tipo de atendimento',
  })
  tipo_atendimento: string;

  // Convênio (se aplicável)
  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do convênio',
  })
  convenio_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número da guia do convênio',
  })
  numero_guia: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Senha de autorização do convênio',
  })
  senha_autorizacao: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Validade da guia',
  })
  validade_guia: Date;

  // Médico solicitante
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Nome do médico solicitante',
  })
  medico_solicitante: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'CRM do médico solicitante',
  })
  crm_solicitante: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Clínica/Hospital de origem',
  })
  clinica_origem: string;

  // Valores
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor total dos exames',
  })
  valor_total: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor do desconto',
  })
  valor_desconto: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor final após desconto',
  })
  valor_final: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Valor pago',
  })
  valor_pago: number;

  // Status
  @Column({
    type: 'enum',
    enum: [
      'rascunho',
      'agendado',
      'confirmado',
      'em_atendimento',
      'aguardando_coleta',
      'coletado',
      'em_analise',
      'parcialmente_liberado',
      'liberado',
      'entregue',
      'cancelado',
    ],
    default: 'rascunho',
    comment: 'Status atual da ordem de serviço',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['pendente', 'parcial', 'pago', 'cancelado'],
    default: 'pendente',
    comment: 'Status do pagamento',
  })
  status_pagamento: string;

  // Observações e notas
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observações gerais',
  })
  observacoes: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Notas internas (não visível ao paciente)',
  })
  notas_internas: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Orientações ao paciente',
  })
  orientacoes_paciente: string;

  // Anexos e documentos
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'URLs de documentos anexados (pedido médico, etc)',
  })
  documentos_anexados: any;

  // Entrega
  @Column({
    type: 'enum',
    enum: ['presencial', 'email', 'whatsapp', 'portal', 'correios'],
    nullable: true,
    comment: 'Forma de entrega dos resultados',
  })
  forma_entrega: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Email/WhatsApp/Endereço para entrega',
  })
  dados_entrega: string;

  // Rastreabilidade
  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do atendente que criou a OS',
  })
  atendente_id: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'ID do profissional que realizou a coleta',
  })
  coletor_id: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Histórico de mudanças de status',
  })
  historico_status: any;

  // Multi-empresa
  @Column({
    type: 'int',
    comment: 'ID da empresa',
  })
  empresa_id: number;

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
  @ManyToOne(() => Paciente, { eager: false })
  @JoinColumn({ name: 'paciente_id' })
  paciente?: Paciente;

  @ManyToOne(() => UnidadeSaude, { eager: false })
  @JoinColumn({ name: 'unidade_saude_id' })
  unidadeSaude?: UnidadeSaude;

  @ManyToOne(() => Convenio, { eager: false })
  @JoinColumn({ name: 'convenio_id' })
  convenio?: Convenio;

  @OneToMany(() => OrdemServicoExame, (osExame) => osExame.ordemServico, {
    cascade: true,
  })
  exames?: OrdemServicoExame[];

  // Métodos auxiliares
  getCodigoFormatado(): string {
    return `OS-${this.codigo}`;
  }

  getProtocoloFormatado(): string {
    return `PROT-${this.protocolo}`;
  }

  isPago(): boolean {
    return this.status_pagamento === 'pago';
  }

  isConvenio(): boolean {
    return this.tipo_atendimento === 'convenio';
  }

  isUrgente(): boolean {
    return this.prioridade === 'urgente' || this.prioridade === 'emergencia';
  }

  canCollect(): boolean {
    return ['confirmado', 'aguardando_coleta'].includes(this.status);
  }

  canDeliver(): boolean {
    return ['liberado', 'parcialmente_liberado'].includes(this.status);
  }

  getValorPendente(): number {
    return this.valor_final - this.valor_pago;
  }

  addStatusHistory(
    novoStatus: string,
    usuario: number,
    observacao?: string,
  ): void {
    if (!this.historico_status) {
      this.historico_status = [];
    }
    this.historico_status.push({
      status_anterior: this.status,
      status_novo: novoStatus,
      data: new Date(),
      usuario_id: usuario,
      observacao,
    });
    this.status = novoStatus as any;
  }
}
