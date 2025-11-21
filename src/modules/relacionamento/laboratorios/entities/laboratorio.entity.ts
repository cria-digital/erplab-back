import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

export enum TipoIntegracao {
  API = 'api',
  WEBSERVICE = 'webservice',
  MANUAL = 'manual',
  FTP = 'ftp',
  EMAIL = 'email',
}

export enum MetodoEnvioResultado {
  API = 'api',
  EMAIL = 'email',
  PORTAL = 'portal',
  IMPRESSAO = 'impressao',
  SMS = 'sms',
}

@Entity('laboratorios')
export class Laboratorio {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  empresa_id: string;

  @OneToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo_laboratorio: string;

  // Responsável Técnico
  @Column({ type: 'varchar', length: 255, nullable: true })
  responsavel_tecnico: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  conselho_responsavel: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  numero_conselho: string;

  // Integração
  @Column({
    type: 'enum',
    enum: TipoIntegracao,
    default: TipoIntegracao.MANUAL,
  })
  tipo_integracao: TipoIntegracao;

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

  // Métodos de Envio de Resultados
  @Column({ type: 'simple-array', nullable: true })
  metodos_envio_resultado: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  portal_resultados_url: string;

  // Prazos e Condições
  @Column({ type: 'int', default: 3 })
  prazo_entrega_normal: number; // em dias

  @Column({ type: 'int', default: 1 })
  prazo_entrega_urgente: number; // em dias

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxa_urgencia: number; // percentual ou valor fixo

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentual_repasse: number; // percentual de repasse para o laboratório

  // Configurações
  @Column({ type: 'boolean', default: false })
  aceita_urgencia: boolean;

  @Column({ type: 'boolean', default: true })
  envia_resultado_automatico: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // TODO: Adicionar relacionamento com Exames quando disponível
  // @ManyToMany(() => Exame)
  // @JoinTable({
  //   name: 'laboratorio_exames',
  //   joinColumn: { name: 'laboratorio_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'exame_id', referencedColumnName: 'id' },
  // })
  // exames: Exame[];
}
