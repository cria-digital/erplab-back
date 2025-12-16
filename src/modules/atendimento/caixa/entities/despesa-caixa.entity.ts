import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Caixa } from './caixa.entity';
import { Tenant } from '../../../tenants/entities/tenant.entity';

@Entity('despesas_caixa')
@Index(['caixaId'])
export class DespesaCaixa {
  @ApiProperty({ description: 'ID único da despesa' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID do caixa' })
  @Column({ name: 'caixa_id', type: 'uuid' })
  caixaId: string;

  @ManyToOne(() => Caixa, (caixa) => caixa.despesas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'caixa_id' })
  caixa: Caixa;

  @ApiProperty({
    description: 'Nome da despesa',
    example: 'Material de escritório',
  })
  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @ApiProperty({ description: 'Valor da despesa', example: 50.0 })
  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @ApiProperty({ description: 'Tipo de despesa', example: 'Material' })
  @Column({ name: 'tipo_despesa', type: 'varchar', length: 100 })
  tipoDespesa: string;

  @ApiProperty({
    description: 'Caminho do comprovante anexado',
    nullable: true,
  })
  @Column({ name: 'comprovante', type: 'varchar', length: 500, nullable: true })
  comprovante: string;

  // Multi-tenancy
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
