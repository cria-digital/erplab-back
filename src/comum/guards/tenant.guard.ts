import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Chave para o decorator @RequireTenant()
 */
export const REQUIRE_TENANT_KEY = 'requireTenant';

/**
 * TenantGuard
 *
 * Guard que verifica se o usuário possui um tenant_id associado.
 * Usado para proteger rotas que exigem tenant (multi-tenancy).
 *
 * Por padrão, todas as rotas são protegidas.
 * Use @SkipTenantCheck() para ignorar a verificação em rotas específicas.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verifica se a rota está marcada para pular verificação de tenant
    const skipTenantCheck = this.reflector.getAllAndOverride<boolean>(
      'skipTenantCheck',
      [context.getHandler(), context.getClass()],
    );

    if (skipTenantCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se não há usuário autenticado, deixa o JwtAuthGuard lidar com isso
    if (!user) {
      return true;
    }

    // Verifica se o usuário tem tenant_id
    if (!user.tenantId) {
      throw new ForbiddenException(
        'Usuário não possui tenant associado. Contate o administrador.',
      );
    }

    return true;
  }
}
