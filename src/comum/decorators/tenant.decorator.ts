import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @TenantId() Decorator
 *
 * Extrai o tenant_id do request.
 * Pode ser usado no controller para obter o tenant_id do usuário logado.
 *
 * Exemplo de uso:
 *
 * @Get()
 * async findAll(@TenantId() tenantId: string) {
 *   return this.service.findAllByTenant(tenantId);
 * }
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();

    // Primeiro tenta pegar do request (injetado pelo TenantInterceptor)
    if (request.tenantId) {
      return request.tenantId;
    }

    // Fallback: pega do usuário autenticado
    if (request.user && request.user.tenantId) {
      return request.user.tenantId;
    }

    return undefined;
  },
);

/**
 * Interface para tipar o usuário com tenant
 */
export interface UserWithTenant {
  id: string;
  email: string;
  nome: string;
  permissoes: any[];
  tenantId?: string;
}
