import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { MetricsService } from './comum/services/metrics.service';

describe('HealthController', () => {
  let controller: HealthController;
  const originalEnv = process.env;

  const mockMetricsService = {
    getSystemMetrics: jest.fn().mockReturnValue({
      cpu: { usage: 100, loadAverage: [0.5, 0.3, 0.2] },
      memory: {
        used: 512,
        total: 2048,
        percentage: 25,
        heapUsed: 120,
        heapTotal: 256,
        rss: 150,
        external: 10,
      },
      uptime: 3600,
      requests: {
        total: 100,
        avgDuration: 250,
        slowRequests: 5,
        recentRequests: [],
      },
      background: {
        timers: 2,
        activeHandles: 10,
        eventLoopDelay: 0,
        lastActivity: new Date(),
        inactivitySeconds: 0,
      },
    }),
    getSlowRequests: jest.fn().mockReturnValue([]),
    getSlowestEndpoints: jest.fn().mockReturnValue([]),
    getMostCalledEndpoints: jest.fn().mockReturnValue([]),
  };

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...originalEnv };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('deve retornar status ok com todas as informações', () => {
      const result = controller.check();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty(
        'message',
        'ERP Laboratório Backend está funcionando!',
      );
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('database', 'erplab - conectado');
      expect(result).toHaveProperty('port');
    });

    it('deve retornar timestamp válido no formato ISO', () => {
      const result = controller.check();
      const timestamp = new Date(result.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(result.timestamp);
    });

    it('deve usar porta do environment quando definida', () => {
      process.env.PORT = '3000';
      const result = controller.check();

      expect(result.port).toBe('3000');
    });

    it('deve usar porta padrão 10016 quando não definida no environment', () => {
      delete process.env.PORT;
      const result = controller.check();

      expect(result.port).toBe(10016);
    });

    it('deve retornar sempre o mesmo formato de resposta', () => {
      const result1 = controller.check();
      const result2 = controller.check();

      expect(Object.keys(result1)).toEqual(Object.keys(result2));
      expect(result1.status).toBe(result2.status);
      expect(result1.message).toBe(result2.message);
      expect(result1.database).toBe(result2.database);
    });

    it('deve ter decorator @Public aplicado', () => {
      const metadata = Reflect.getMetadata('isPublic', controller.check);
      expect(metadata).toBe(true);
    });
  });
});
