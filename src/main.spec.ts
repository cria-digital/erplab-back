import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common'; // Commented out to fix lint warning
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

// Mock dos módulos
jest.mock('@nestjs/core');
jest.mock('@nestjs/swagger');
jest.mock('fs');
jest.mock('./app.module', () => ({
  AppModule: jest.fn(),
}));

describe('main.ts', () => {
  let mockApp: any;
  let consoleLogSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    // Mock do app
    mockApp = {
      useGlobalPipes: jest.fn(),
      enableCors: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    // Mock NestFactory
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);

    // Mock DocumentBuilder
    const mockDocumentBuilder = {
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setVersion: jest.fn().mockReturnThis(),
      addTag: jest.fn().mockReturnThis(),
      addBearerAuth: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({}),
    };
    (DocumentBuilder as jest.Mock).mockImplementation(
      () => mockDocumentBuilder,
    );

    // Mock SwaggerModule
    (SwaggerModule.createDocument as jest.Mock).mockReturnValue({});
    (SwaggerModule.setup as jest.Mock).mockImplementation();

    // Mock fs.writeFileSync
    (fs.writeFileSync as jest.Mock).mockImplementation();

    // Reset process.env
    delete process.env.NODE_ENV;
    delete process.env.PORT;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('bootstrap', () => {
    it('deve criar a aplicação com configurações corretas', async () => {
      // Importar e executar o main.ts
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      // Aguardar execução assíncrona
      await new Promise(process.nextTick);

      expect(NestFactory.create).toHaveBeenCalledWith(expect.anything());
    });

    it('deve configurar ValidationPipe global', async () => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(mockApp.useGlobalPipes).toHaveBeenCalled();

      // ValidationPipe foi configurado
      expect(mockApp.useGlobalPipes.mock.calls.length).toBeGreaterThan(0);
    });

    it('deve configurar CORS corretamente em desenvolvimento', async () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(mockApp.enableCors).toHaveBeenCalledWith({
        origin: ['http://localhost:9016'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'Accept',
          'X-Requested-With',
          'sentry-trace',
          'baggage',
        ],
        exposedHeaders: ['Set-Cookie'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      });
    });

    it('deve configurar CORS corretamente em produção', async () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(mockApp.enableCors).toHaveBeenCalledWith({
        origin: ['http://localhost:9016'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'Accept',
          'X-Requested-With',
          'sentry-trace',
          'baggage',
        ],
        exposedHeaders: ['Set-Cookie'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      });
    });

    it('deve definir prefixo global da API', async () => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    });

    it('deve configurar Swagger corretamente', async () => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(DocumentBuilder).toHaveBeenCalled();
      expect(SwaggerModule.createDocument).toHaveBeenCalled();
      expect(SwaggerModule.setup).toHaveBeenCalledWith(
        'api/docs',
        mockApp,
        {},
        expect.objectContaining({
          swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
          },
        }),
      );
    });

    it('deve NÃO gerar arquivo OpenAPI JSON (desabilitado)', async () => {
      const mockDocument = { test: 'document' };
      (SwaggerModule.createDocument as jest.Mock).mockReturnValue(mockDocument);

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      // Arquivo openapi.json foi desabilitado por problemas de permissão no Docker
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('deve usar porta do environment ou padrão', async () => {
      process.env.PORT = '3000';

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(mockApp.listen).toHaveBeenCalledWith('3000', '0.0.0.0');
    });

    it('deve usar porta padrão quando não definida', async () => {
      delete process.env.PORT;

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(mockApp.listen).toHaveBeenCalledWith(10016, '0.0.0.0');
    });

    it('deve exibir logs de inicialização', async () => {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '🚀 Servidor ERP Laboratório rodando em http://0.0.0.0:',
        ),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('📖 Documentação da API:'),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('💚 Health Check:'),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('📄 OpenAPI/Postman:'),
      );
    });

    it('deve configurar todas as tags do Swagger', async () => {
      const mockBuilder = {
        setTitle: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        setVersion: jest.fn().mockReturnThis(),
        addTag: jest.fn().mockReturnThis(),
        addBearerAuth: jest.fn().mockReturnThis(),
        build: jest.fn().mockReturnValue({}),
      };

      (DocumentBuilder as jest.Mock).mockImplementation(() => mockBuilder);

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./main');
      });

      await new Promise(process.nextTick);

      // Verificar tags esperadas
      const expectedTags = [
        ['health', 'Health Check'],
        ['atendimento', 'Módulo de Atendimento e Agendamento'],
        ['exames', 'Módulo de Gestão de Exames'],
        ['financeiro', 'Módulo Financeiro'],
        ['crm', 'Módulo CRM e WhatsApp'],
        ['auditoria', 'Módulo de Auditoria e Qualidade'],
        ['estoque', 'Módulo de Estoque e Compras'],
        ['tiss', 'Módulo TISS e Convênios'],
        ['tarefas', 'Módulo de Tarefas Internas'],
        ['bi', 'Módulo de Business Intelligence'],
        ['portal-cliente', 'Portal do Cliente'],
        ['portal-medico', 'Portal Médico'],
        ['integracoes', 'Módulo de Integrações'],
      ];

      expectedTags.forEach(([tag, description]) => {
        expect(mockBuilder.addTag).toHaveBeenCalledWith(tag, description);
      });

      expect(mockBuilder.addBearerAuth).toHaveBeenCalled();
    });
  });
});
