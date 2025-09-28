// import { DataSource } from 'typeorm'; // Commented out to fix lint warning

// Mock do módulo dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('TypeORM Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('deve criar DataSource com configurações padrão', () => {
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_DATABASE;
    delete process.env.NODE_ENV;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AppDataSource = require('./typeorm.config').default;

    expect(AppDataSource).toBeDefined();
    expect(typeof AppDataSource).toBe('object');
    expect(AppDataSource.options).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nestuser',
      password: 'nestpass',
      database: 'erplab_db',
      synchronize: false,
      logging: false,
      ssl: false,
    });
  });

  it('deve usar variáveis de ambiente quando definidas', () => {
    process.env.DB_HOST = 'custom-host';
    process.env.DB_PORT = '5433';
    process.env.DB_USERNAME = 'custom-user';
    process.env.DB_PASSWORD = 'custom-pass';
    process.env.DB_DATABASE = 'custom-db';
    process.env.NODE_ENV = 'development';

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AppDataSource = require('./typeorm.config').default;

      expect(AppDataSource.options).toMatchObject({
        host: 'custom-host',
        port: 5433,
        username: 'custom-user',
        password: 'custom-pass',
        database: 'custom-db',
        logging: true,
      });
    });
  });

  it('deve habilitar SSL em produção', () => {
    process.env.NODE_ENV = 'production';

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AppDataSource = require('./typeorm.config').default;

      expect(AppDataSource.options.ssl).toEqual({
        rejectUnauthorized: false,
      });
    });
  });

  it('deve desabilitar SSL em desenvolvimento', () => {
    process.env.NODE_ENV = 'development';

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AppDataSource = require('./typeorm.config').default;

      expect(AppDataSource.options.ssl).toBe(false);
      expect(AppDataSource.options.logging).toBe(true);
    });
  });

  it('deve incluir paths corretos para entities', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AppDataSource = require('./typeorm.config').default;
    const entities = AppDataSource.options.entities;

    expect(Array.isArray(entities)).toBe(true);
    expect(entities[0]).toContain('/**/*.entity');
    expect(entities[0]).toMatch(/\{\.ts,\.js\}$/);
  });

  it('deve incluir paths corretos para migrations', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AppDataSource = require('./typeorm.config').default;
    const migrations = AppDataSource.options.migrations;

    expect(Array.isArray(migrations)).toBe(true);
    expect(migrations[0]).toContain('/database/migrations/');
    expect(migrations[0]).toMatch(/\{\.ts,\.js\}$/);
  });

  it('deve chamar dotenv.config()', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dotenv = require('dotenv');
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./typeorm.config');
    });

    expect(dotenv.config).toHaveBeenCalled();
  });

  it('deve tratar DB_PORT inválido como 5432', () => {
    process.env.DB_PORT = 'invalid';

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AppDataSource = require('./typeorm.config').default;

      expect(AppDataSource.options.port).toBe(5432);
    });
  });

  it('deve exportar AppDataSource como default', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require('./typeorm.config');

    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe('object');
  });
});
