import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * TenantInterceptor
 *
 * Este interceptor extrai o tenant_id do usuário autenticado
 * e o injeta no objeto request para uso nos services.
 *
 * O tenant_id é obtido do JWT através da JwtStrategy.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.tenantId) {
      // Injeta tenant_id no request para acesso fácil
      request.tenantId = user.tenantId;
    }

    return next.handle();
  }
}
