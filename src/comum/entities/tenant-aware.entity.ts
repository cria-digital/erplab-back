import { Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Tenant } from '../../modules/tenants/entities/tenant.entity';

/**
 * Mixin para adicionar suporte a multi-tenancy em entidades.
 *
 * Uso:
 * ```typescript
 * @Entity('minha_tabela')
 * export class MinhaEntidade extends TenantAwareEntity {
 *   // ... campos da entidade
 * }
 * ```
 *
 * Ou para entidades que já herdam de outra classe, adicione manualmente:
 * ```typescript
 * @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
 * @Index()
 * tenantId: string;
 *
 * @ManyToOne(() => Tenant, { eager: false })
 * @JoinColumn({ name: 'tenant_id' })
 * tenant: Tenant;
 * ```
 */
export abstract class TenantAwareEntity {
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}

/**
 * Interface para entidades que suportam multi-tenancy.
 * Útil para tipagem quando não é possível usar herança.
 */
export interface ITenantAware {
  tenantId: string;
  tenant?: Tenant;
}
