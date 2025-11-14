import { Injectable, Logger } from '@nestjs/common';
import * as os from 'os';

export interface RequestMetric {
  method: string;
  url: string;
  duration: number;
  statusCode: number;
  ip: string;
  timestamp: Date;
}

export interface BackgroundActivity {
  timers: number;
  activeHandles: number;
  eventLoopDelay: number;
  lastActivity: Date | null;
  inactivitySeconds: number;
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
  };
  uptime: number;
  requests: {
    total: number;
    avgDuration: number;
    slowRequests: number;
    recentRequests: RequestMetric[];
  };
  background: BackgroundActivity;
}

/**
 * Service para coletar e agregar métricas de performance do sistema
 */
@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private requestMetrics: RequestMetric[] = [];
  private readonly maxMetricsStored = 1000; // Últimos 1000 requests
  private readonly slowRequestThreshold = 1000; // ms
  private startTime = Date.now();
  private lastRequestTime: Date | null = null;

  /**
   * Registra uma métrica de request
   */
  recordRequest(metric: RequestMetric): void {
    this.requestMetrics.push(metric);
    this.lastRequestTime = new Date();

    // Mantém apenas os últimos N requests para não consumir memória
    if (this.requestMetrics.length > this.maxMetricsStored) {
      this.requestMetrics.shift();
    }
  }

  /**
   * Retorna métricas do sistema
   */
  getSystemMetrics(): SystemMetrics {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const loadAvg = os.loadavg();

    // Calcula estatísticas de requests
    const totalRequests = this.requestMetrics.length;
    const avgDuration =
      totalRequests > 0
        ? this.requestMetrics.reduce((sum, m) => sum + m.duration, 0) /
          totalRequests
        : 0;
    const slowRequests = this.requestMetrics.filter(
      (m) => m.duration > this.slowRequestThreshold,
    ).length;

    // Pega os 50 requests mais recentes
    const recentRequests = this.requestMetrics.slice(-50).reverse();

    // Calcula uso de memória
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Calcula atividade em background
    const background = this.getBackgroundActivity();

    return {
      cpu: {
        usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Converte para ms
        loadAverage: loadAvg,
      },
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round((usedMemory / totalMemory) * 100),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
      },
      uptime: Math.round((Date.now() - this.startTime) / 1000), // segundos
      requests: {
        total: totalRequests,
        avgDuration: Math.round(avgDuration),
        slowRequests,
        recentRequests,
      },
      background,
    };
  }

  /**
   * Detecta atividade em background (timers, handles ativos, etc)
   */
  private getBackgroundActivity(): BackgroundActivity {
    // @ts-expect-error - Node.js internal API
    const activeHandles = process._getActiveHandles?.()?.length || 0;
    // @ts-expect-error - Node.js internal API
    const activeRequests = process._getActiveRequests?.()?.length || 0;

    const now = Date.now();
    const inactivitySeconds = this.lastRequestTime
      ? Math.round((now - this.lastRequestTime.getTime()) / 1000)
      : Math.round((now - this.startTime) / 1000);

    return {
      timers: activeRequests,
      activeHandles,
      eventLoopDelay: 0, // Pode ser calculado com perf_hooks se necessário
      lastActivity: this.lastRequestTime,
      inactivitySeconds,
    };
  }

  /**
   * Retorna apenas requests lentos (> threshold)
   */
  getSlowRequests(limit = 50): RequestMetric[] {
    return this.requestMetrics
      .filter((m) => m.duration > this.slowRequestThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Retorna top N endpoints mais lentos (agrupados por URL)
   */
  getSlowestEndpoints(limit = 10): Array<{
    url: string;
    count: number;
    avgDuration: number;
    maxDuration: number;
  }> {
    const endpointStats = new Map<
      string,
      { count: number; totalDuration: number; maxDuration: number }
    >();

    // Agrupa por URL
    this.requestMetrics.forEach((metric) => {
      const stats = endpointStats.get(metric.url) || {
        count: 0,
        totalDuration: 0,
        maxDuration: 0,
      };

      stats.count++;
      stats.totalDuration += metric.duration;
      stats.maxDuration = Math.max(stats.maxDuration, metric.duration);

      endpointStats.set(metric.url, stats);
    });

    // Converte para array e ordena por duração média
    return Array.from(endpointStats.entries())
      .map(([url, stats]) => ({
        url,
        count: stats.count,
        avgDuration: Math.round(stats.totalDuration / stats.count),
        maxDuration: stats.maxDuration,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, limit);
  }

  /**
   * Retorna endpoints mais chamados
   */
  getMostCalledEndpoints(limit = 10): Array<{ url: string; count: number }> {
    const endpointCounts = new Map<string, number>();

    this.requestMetrics.forEach((metric) => {
      endpointCounts.set(metric.url, (endpointCounts.get(metric.url) || 0) + 1);
    });

    return Array.from(endpointCounts.entries())
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Reseta métricas (útil para testes)
   */
  reset(): void {
    this.logger.log('Resetando métricas...');
    this.requestMetrics = [];
    this.startTime = Date.now();
  }
}
