import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Chave para o decorator @SuperAdmin()
 */
export const SUPER_ADMIN_KEY = 'superAdmin';

/**
 * SuperAdminGuard
 *
 * Guard que verifica se o usuário é um Super Admin.
 * Super Admins têm acesso a funcionalidades cross-tenant como:
 * - Gerenciamento de tenants
 * - Visualização de dados de todos os tenants
 * - Configurações globais do sistema
 *
 * Este guard NÃO é aplicado globalmente.
 * Use o decorator @SuperAdmin() em rotas específicas.
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verifica se a rota requer Super Admin
    const requireSuperAdmin = this.reflector.getAllAndOverride<boolean>(
      SUPER_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não requer super admin, permite acesso
    if (!requireSuperAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se não há usuário autenticado, deixa o JwtAuthGuard lidar com isso
    if (!user) {
      return true;
    }

    // Verifica se o usuário é super admin
    if (!user.isSuperAdmin) {
      throw new ForbiddenException(
        'Acesso negado. Esta funcionalidade requer permissão de Super Administrador.',
      );
    }

    return true;
  }
}
