import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
} from 'typeorm';
import { getCurrentTenantId } from '../context/tenant.context';

/**
 * TenantSubscriber
 *
 * Este subscriber do TypeORM automaticamente preenche o tenant_id
 * em todas as entidades que possuem esse campo durante INSERT.
 *
 * Utiliza o AsyncLocalStorage para obter o tenant_id
 * do contexto da requisição atual.
 */
@EventSubscriber()
export class TenantSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  /**
   * Antes de inserir uma entidade, verifica se ela tem tenantId
   * e preenche automaticamente com o valor do contexto
   */
  beforeInsert(event: InsertEvent<any>): void {
    this.setTenantId(event.entity);
  }

  private setTenantId(entity: any): void {
    if (!entity) return;

    // Verifica se a entidade tem a propriedade tenantId e se está vazia
    if ('tenantId' in entity && !entity.tenantId) {
      const tenantId = getCurrentTenantId();
      if (tenantId) {
        entity.tenantId = tenantId;
      }
    }
  }
}
