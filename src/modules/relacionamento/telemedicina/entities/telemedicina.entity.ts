import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

export enum TipoIntegracaoTelemedicina {
  API_REST = 'api_rest',
  WEBHOOK = 'webhook',
  HL7 = 'hl7',
  FHIR = 'fhir',
  MANUAL = 'manual',
  DICOM = 'dicom',
}

export enum TipoPlataforma {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  HIBRIDA = 'hibrida',
}

export enum StatusIntegracao {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  TESTE = 'teste',
  MANUTENCAO = 'manutencao',
}

@Entity('telemedicina')
export class Telemedicina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_telemedicina: string;

  // Configurações de Integração
  @Column({
    type: 'enum',
    enum: TipoIntegracaoTelemedicina,
    default: TipoIntegracaoTelemedicina.MANUAL,
  })
  tipo_integracao: TipoIntegracaoTelemedicina;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_integracao: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token_integracao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  usuario_integracao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  senha_integracao: string;

  @Column({ type: 'text', nullable: true })
  configuracao_adicional: string; // JSON com configs extras

  @Column({
    type: 'enum',
    enum: StatusIntegracao,
    default: StatusIntegracao.INATIVO,
  })
  status_integracao: StatusIntegracao;

  // Informações da Plataforma
  @Column({ type: 'enum', enum: TipoPlataforma, default: TipoPlataforma.WEB })
  tipo_plataforma: TipoPlataforma;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_plataforma: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  versao_sistema: string;

  // Especialidades e Serviços
  @Column({ type: 'simple-array', nullable: true })
  especialidades_atendidas: string[];

  @Column({ type: 'simple-array', nullable: true })
  tipos_consulta: string[]; // consulta, segunda_opiniao, laudos, etc.

  @Column({ type: 'boolean', default: false })
  teleconsulta: boolean;

  @Column({ type: 'boolean', default: false })
  telediagnostico: boolean;

  @Column({ type: 'boolean', default: false })
  telecirurgia: boolean;

  @Column({ type: 'boolean', default: false })
  telemonitoramento: boolean;

  // Configurações de Atendimento
  @Column({ type: 'int', nullable: true })
  tempo_consulta_padrao: number; // em minutos

  @Column({ type: 'boolean', default: false })
  permite_agendamento_online: boolean;

  @Column({ type: 'boolean', default: false })
  permite_cancelamento_online: boolean;

  @Column({ type: 'int', nullable: true })
  antecedencia_minima_agendamento: number; // em horas

  @Column({ type: 'int', nullable: true })
  antecedencia_minima_cancelamento: number; // em horas

  // Configurações Técnicas
  @Column({ type: 'varchar', length: 100, nullable: true })
  certificado_digital: string;

  @Column({ type: 'boolean', default: false })
  suporte_gravacao: boolean;

  @Column({ type: 'boolean', default: false })
  suporte_streaming: boolean;

  @Column({ type: 'boolean', default: true })
  criptografia_end_to_end: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  protocolo_seguranca: string;

  // Valores e Cobrança
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_consulta_particular: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_repasse: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxa_plataforma: number;

  // Observações e Notas
  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'text', nullable: true })
  requisitos_tecnicos: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // TODO: Relacionamentos futuros
  // @OneToMany(() => TelemedicinaExame, (te) => te.telemedicina)
  // exames_vinculados: TelemedicinaExame[];

  // @OneToMany(() => ConsultaTelemedicina, (ct) => ct.telemedicina)
  // consultas: ConsultaTelemedicina[];
}
