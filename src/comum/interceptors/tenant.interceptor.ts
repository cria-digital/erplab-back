import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantContext } from '../context/tenant.context';

/**
 * TenantInterceptor
 *
 * Este interceptor extrai o tenant_id do usuário autenticado
 * e o armazena no AsyncLocalStorage para uso em toda a requisição.
 *
 * O tenant_id é obtido do JWT através da JwtStrategy.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const tenantId = user?.tenantId ?? null;
    const userId = user?.id ?? null;

    // Injeta no request para acesso direto via @Request()
    if (tenantId) {
      request.tenantId = tenantId;
    }

    // Executa o handler dentro do contexto do tenant
    return new Observable((subscriber) => {
      tenantContext.run({ tenantId, userId }, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
