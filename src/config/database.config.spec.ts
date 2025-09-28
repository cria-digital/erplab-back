import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config';

describe('databaseConfig', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  it('deve retornar configuração padrão quando variáveis não estão definidas', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key: string, defaultValue?: any) => {
        return defaultValue;
      });

    const config = databaseConfig(configService);

    expect(config).toEqual({
      type: 'postgres' as const,
      host: 'localhost',
      port: 5432,
      username: 'nestuser',
      password: 'nestpass',
      database: 'erplab',
      entities: expect.arrayContaining([
        expect.stringContaining('/**/*.entity'),
      ]),
      migrations: expect.arrayContaining([
        expect.stringContaining('/database/migrations/*'),
      ]),
      synchronize: false,
      migrationsRun: false,
      logging: false,
      ssl: false,
    });
  });

  it('deve usar valores das variáveis de ambiente quando definidas', () => {
    const mockGet = jest.fn();
    mockGet.mockImplementation((key: string, defaultValue?: any) => {
      const values: Record<string, any> = {
        DB_HOST: 'custom-host',
        DB_PORT: 5433,
        DB_USERNAME: 'custom-user',
        DB_PASSWORD: 'custom-pass',
        DB_DATABASE: 'custom-db',
        NODE_ENV: 'development',
      };
      return values[key] !== undefined ? values[key] : defaultValue;
    });

    jest.spyOn(configService, 'get').mockImplementation(mockGet);

    const config = databaseConfig(configService);

    expect((config as any).host).toBe('custom-host');
    expect((config as any).port).toBe(5433);
    expect((config as any).username).toBe('custom-user');
    expect((config as any).password).toBe('custom-pass');
    expect(config.database).toBe('custom-db');
  });

  it('deve habilitar logging em ambiente de desenvolvimento', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'NODE_ENV') return 'development';
        return defaultValue;
      });

    const config = databaseConfig(configService);

    expect(config.logging).toBe(true);
  });

  it('deve desabilitar logging em ambiente de produção', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'NODE_ENV') return 'production';
        return defaultValue;
      });

    const config = databaseConfig(configService);

    expect(config.logging).toBe(false);
  });

  it('deve configurar SSL em ambiente de produção', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'NODE_ENV') return 'production';
        return defaultValue;
      });

    const config = databaseConfig(configService);

    expect((config as any).ssl).toEqual({ rejectUnauthorized: false });
  });

  it('deve desabilitar SSL em ambiente de desenvolvimento', () => {
    jest
      .spyOn(configService, 'get')
      .mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'NODE_ENV') return 'development';
        return defaultValue;
      });

    const config = databaseConfig(configService);

    expect((config as any).ssl).toBe(false);
  });

  it('deve sempre manter synchronize como false', () => {
    const config = databaseConfig(configService);
    expect(config.synchronize).toBe(false);
  });

  it('deve sempre manter migrationsRun como false', () => {
    const config = databaseConfig(configService);
    expect(config.migrationsRun).toBe(false);
  });

  it('deve incluir paths corretos para entities', () => {
    const config = databaseConfig(configService);
    const entityPath = config.entities[0] as string;

    expect(entityPath).toContain('*.entity');
    expect(entityPath).toMatch(/\{\.ts,\.js\}$/);
  });

  it('deve incluir paths corretos para migrations', () => {
    const config = databaseConfig(configService);
    const migrationPath = config.migrations[0] as string;

    expect(migrationPath).toContain('database/migrations');
    expect(migrationPath).toMatch(/\{\.ts,\.js\}$/);
  });
});
