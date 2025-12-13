import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
export enum SecaoCampoEnum {
  CADASTRO_PACIENTES = 'CADASTRO_PACIENTES',
  ORDEM_SERVICO = 'ORDEM_SERVICO',
  TISS = 'TISS',
  TRATAMENTO_AMBULATORIAL = 'TRATAMENTO_AMBULATORIAL',
  INTERNAMENTO = 'INTERNAMENTO',
}

export enum TipoCampoEnum {
  OPCIONAL = 'OPCIONAL',
  OBRIGATORIO = 'OBRIGATORIO',
}

@Entity('configuracoes_campos_convenio')
export class ConfiguracaoCamposConvenio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'empresa_id' })
  empresaId: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({
    type: 'enum',
    enum: SecaoCampoEnum,
    name: 'secao',
  })
  secao: SecaoCampoEnum;

  @Column({ name: 'nome_campo' })
  nomeCampo: string;

  @Column({ name: 'label_campo' })
  labelCampo: string;

  @Column({
    type: 'enum',
    enum: TipoCampoEnum,
    default: TipoCampoEnum.OPCIONAL,
    name: 'tipo_obrigatoriedade',
  })
  tipoObrigatoriedade: TipoCampoEnum;

  @Column({ default: true, name: 'visivel' })
  visivel: boolean;

  @Column({ nullable: true, name: 'ordem_exibicao' })
  ordemExibicao: number;

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
