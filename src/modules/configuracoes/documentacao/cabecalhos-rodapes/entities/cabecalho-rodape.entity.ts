import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UnidadeSaude } from '../../../../cadastros/unidade-saude/entities/unidade-saude.entity';

import { Tenant } from '../../../../tenants/entities/tenant.entity';
export enum TipoCabecalhoRodape {
  CABECALHO = 'CABECALHO',
  RODAPE = 'RODAPE',
}

@Entity('cabecalhos_rodapes')
@Unique(['unidadeId', 'tipo'])
export class CabecalhoRodape {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'unidade_id' })
  unidadeId: string;

  @ManyToOne(() => UnidadeSaude, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unidade_id' })
  unidade: UnidadeSaude;

  @Column({
    type: 'enum',
    enum: TipoCabecalhoRodape,
  })
  tipo: TipoCabecalhoRodape;

  @Column({ name: 'nome_arquivo', length: 255 })
  nomeArquivo: string;

  @Column({ name: 'caminho_arquivo', length: 500 })
  caminhoArquivo: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ type: 'integer' })
  tamanho: number;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
