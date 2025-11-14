import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './modules/autenticacao/auth/decorators/public.decorator';
import { MetricsService } from './comum/services/metrics.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly metricsService: MetricsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Verificação de saúde do sistema',
    description:
      'Endpoint para verificar se a API e banco de dados estão funcionando corretamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Sistema funcionando corretamente',
    example: {
      status: 'ok',
      message: 'ERP Laboratório Backend está funcionando!',
      timestamp: '2025-09-02T20:01:27.483Z',
      database: 'erplab - conectado',
      port: 10016,
    },
  })
  check() {
    return {
      status: 'ok',
      message: 'ERP Laboratório Backend está funcionando!',
      timestamp: new Date().toISOString(),
      database: 'erplab - conectado',
      port: process.env.PORT || 10016,
    };
  }

  @Public()
  @Get('metrics')
  @ApiOperation({
    summary: 'Métricas detalhadas do sistema',
    description:
      'Retorna métricas de CPU, memória, requests e performance do sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas do sistema',
    schema: {
      type: 'object',
      properties: {
        cpu: {
          type: 'object',
          properties: {
            usage: { type: 'number', description: 'Uso de CPU em ms' },
            loadAverage: {
              type: 'array',
              items: { type: 'number' },
              description: 'Load average (1, 5, 15 minutos)',
            },
          },
        },
        memory: {
          type: 'object',
          properties: {
            used: { type: 'number', description: 'Memória usada em MB' },
            total: { type: 'number', description: 'Memória total em MB' },
            percentage: {
              type: 'number',
              description: 'Percentual de uso de memória',
            },
            heapUsed: { type: 'number', description: 'Heap usada em MB' },
            heapTotal: { type: 'number', description: 'Heap total em MB' },
          },
        },
        uptime: { type: 'number', description: 'Tempo online em segundos' },
        requests: {
          type: 'object',
          properties: {
            total: { type: 'number', description: 'Total de requests' },
            avgDuration: {
              type: 'number',
              description: 'Duração média em ms',
            },
            slowRequests: {
              type: 'number',
              description: 'Requests lentos (>1000ms)',
            },
          },
        },
      },
    },
  })
  getMetrics() {
    return this.metricsService.getSystemMetrics();
  }

  @Public()
  @Get('metrics/slow-requests')
  @ApiOperation({
    summary: 'Requests lentos',
    description:
      'Retorna os 50 requests mais lentos (> 1000ms) para identificar gargalos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de requests lentos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          method: { type: 'string', example: 'GET' },
          url: {
            type: 'string',
            example: '/api/v1/cadastros/empresas/cnpj/12345678901234',
          },
          duration: { type: 'number', example: 2543 },
          statusCode: { type: 'number', example: 200 },
          ip: { type: 'string', example: '192.168.1.10' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  getSlowRequests() {
    return this.metricsService.getSlowRequests(50);
  }

  @Public()
  @Get('metrics/slowest-endpoints')
  @ApiOperation({
    summary: 'Endpoints mais lentos',
    description:
      'Retorna os 10 endpoints com maior tempo médio de resposta (agrupados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Endpoints mais lentos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', example: '/api/v1/cadastros/empresas' },
          count: { type: 'number', example: 45 },
          avgDuration: { type: 'number', example: 823 },
          maxDuration: { type: 'number', example: 2341 },
        },
      },
    },
  })
  getSlowestEndpoints() {
    return this.metricsService.getSlowestEndpoints(10);
  }

  @Public()
  @Get('metrics/most-called')
  @ApiOperation({
    summary: 'Endpoints mais chamados',
    description: 'Retorna os 10 endpoints com mais requisições',
  })
  @ApiResponse({
    status: 200,
    description: 'Endpoints mais chamados',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', example: '/api/v1/health' },
          count: { type: 'number', example: 1542 },
        },
      },
    },
  })
  getMostCalledEndpoints() {
    return this.metricsService.getMostCalledEndpoints(10);
  }

  @Public()
  @Get('metrics/background-activity')
  @ApiOperation({
    summary: 'Atividade em background',
    description:
      'Mostra processos em background ativos (timers, handles) e tempo de inatividade. Útil para detectar CPU alto sem requests.',
  })
  @ApiResponse({
    status: 200,
    description: 'Atividade em background',
    schema: {
      type: 'object',
      properties: {
        timers: {
          type: 'number',
          description: 'Número de timers ativos',
        },
        activeHandles: {
          type: 'number',
          description: 'Número de handles ativos (conexões, files, etc)',
        },
        eventLoopDelay: {
          type: 'number',
          description: 'Delay do event loop em ms',
        },
        lastActivity: {
          type: 'string',
          format: 'date-time',
          description: 'Timestamp do último request',
        },
        inactivitySeconds: {
          type: 'number',
          description: 'Segundos sem receber requests',
        },
      },
    },
  })
  getBackgroundActivity() {
    const metrics = this.metricsService.getSystemMetrics();
    return metrics.background;
  }
}
