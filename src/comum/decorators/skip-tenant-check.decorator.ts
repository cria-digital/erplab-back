import { SetMetadata } from '@nestjs/common';

/**
 * @SkipTenantCheck() Decorator
 *
 * Marca uma rota ou controller para não verificar tenant_id.
 * Útil para rotas públicas, de autenticação ou que são compartilhadas.
 *
 * Exemplo de uso:
 *
 * @SkipTenantCheck()
 * @Get('cnaes')
 * async findAllCnaes() {
 *   return this.service.findAll();
 * }
 */
export const SKIP_TENANT_CHECK_KEY = 'skipTenantCheck';
export const SkipTenantCheck = () => SetMetadata(SKIP_TENANT_CHECK_KEY, true);
