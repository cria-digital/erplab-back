import { AsyncLocalStorage } from 'async_hooks';

/**
 * TenantContext
 *
 * Utiliza AsyncLocalStorage para armazenar o tenant_id
 * de forma segura no contexto da requisição atual.
 *
 * Isso permite que qualquer parte do código acesse o tenant_id
 * sem precisar passar explicitamente pelos parâmetros.
 */

interface TenantStore {
  tenantId: string | null;
  userId: string | null;
}

export const tenantContext = new AsyncLocalStorage<TenantStore>();

/**
 * Obtém o tenant_id do contexto atual
 */
export function getCurrentTenantId(): string | null {
  const store = tenantContext.getStore();
  return store?.tenantId ?? null;
}

/**
 * Obtém o user_id do contexto atual
 */
export function getCurrentUserId(): string | null {
  const store = tenantContext.getStore();
  return store?.userId ?? null;
}

/**
 * Executa uma função dentro de um contexto de tenant
 */
export function runWithTenant<T>(
  tenantId: string | null,
  userId: string | null,
  fn: () => T,
): T {
  return tenantContext.run({ tenantId, userId }, fn);
}
