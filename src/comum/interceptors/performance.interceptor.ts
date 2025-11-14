import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../services/metrics.service';

/**
 * Interceptor que monitora o tempo de execução de cada request
 * e identifica requests lentos (> 1000ms)
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = context.switchToHttp().getResponse().statusCode;

        // Registra métrica
        this.metricsService.recordRequest({
          method,
          url,
          duration,
          statusCode,
          ip,
          timestamp: new Date(),
        });

        // Log de requests lentos (> 1000ms)
        if (duration > 1000) {
          this.logger.warn(
            `🐌 Request lento: ${method} ${url} - ${duration}ms - IP: ${ip}`,
          );
        }

        // Log de requests muito lentos (> 5000ms)
        if (duration > 5000) {
          this.logger.error(
            `🚨 Request MUITO lento: ${method} ${url} - ${duration}ms - IP: ${ip}`,
          );
        }
      }),
    );
  }
}
