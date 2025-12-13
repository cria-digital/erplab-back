import { SetMetadata } from '@nestjs/common';
import { SUPER_ADMIN_KEY } from '../guards/super-admin.guard';

/**
 * Decorator @SuperAdmin()
 *
 * Marca uma rota ou controller como restrito a Super Admins.
 * Quando usado, apenas usuários com isSuperAdmin=true podem acessar.
 *
 * @example
 * // Proteger uma rota específica
 * @SuperAdmin()
 * @Get('tenants')
 * findAllTenants() { }
 *
 * @example
 * // Proteger todo o controller
 * @SuperAdmin()
 * @Controller('admin')
 * export class AdminController { }
 */
export const SuperAdmin = () => SetMetadata(SUPER_ADMIN_KEY, true);
