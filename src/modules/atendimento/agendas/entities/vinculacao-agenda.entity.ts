import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TipoVinculacaoEnum } from '../enums/agendas.enum';
import { Agenda } from './agenda.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('vinculacoes_agenda')
export class VinculacaoAgenda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agenda_id' })
  agendaId: string;

  @ManyToOne(() => Agenda, (agenda) => agenda.vinculacoes)
  @JoinColumn({ name: 'agenda_id' })
  agenda: Agenda;

  @Column({
    type: 'enum',
    enum: TipoVinculacaoEnum,
  })
  tipo: TipoVinculacaoEnum;

  @Column({ name: 'entidade_vinculada_id' })
  entidadeVinculadaId: string;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
