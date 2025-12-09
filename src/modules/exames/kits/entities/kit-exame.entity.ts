import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { Kit } from './kit.entity';
import { Exame } from '../../exames/entities/exame.entity';

import { Tenant } from '../../../tenants/entities/tenant.entity';
@Entity('kit_exames')
@Unique(['kit', 'exame']) // Garante que um exame não seja duplicado no mesmo kit
@Index('IDX_kit_exame_kit', ['kit'])
@Index('IDX_kit_exame_exame', ['exame'])
@Index('IDX_kit_exame_ordem', ['ordemInsercao'])
export class KitExame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Kit, (kit) => kit.kitExames, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'kit_id' })
  kit: Kit;

  @Column({ name: 'kit_id', type: 'uuid' })
  kitId: string;

  @ManyToOne(() => Exame, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'exame_id' })
  exame: Exame;

  @Column({ name: 'exame_id', type: 'uuid' })
  exameId: string;

  @Column({
    name: 'quantidade',
    type: 'int',
    default: 1,
    comment: 'Quantidade de cada exame no kit (geralmente 1, mas pode variar)',
  })
  quantidade: number;

  @Column({
    name: 'ordem_insercao',
    type: 'int',
    nullable: true,
    comment:
      'Ordem de apresentação dos exames no kit para inserção no front-end',
  })
  ordemInsercao: number;

  @Column({
    name: 'observacoes',
    type: 'text',
    nullable: true,
    comment: 'Observações específicas para este exame no kit',
  })
  observacoes: string;

  @CreateDateColumn({
    name: 'created_at',
    comment: 'Data/hora de criação do registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Data/hora da última atualização',
  })
  updatedAt: Date;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
