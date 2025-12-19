import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Converte uma string de camelCase para snake_case
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Transforma recursivamente as chaves de um objeto de camelCase para snake_case
 */
function transformKeys(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item));
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj === 'object') {
    const transformed: any = {};
    for (const key of Object.keys(obj)) {
      const snakeKey = camelToSnake(key);
      transformed[snakeKey] = transformKeys(obj[key]);
    }
    return transformed;
  }

  return obj;
}

/**
 * Interceptor que transforma todas as respostas da API de camelCase para snake_case.
 * Isso padroniza a API para usar snake_case tanto nas requests quanto nas responses.
 */
@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => transformKeys(data)));
  }
}
