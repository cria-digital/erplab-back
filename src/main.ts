import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './comum/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtro global de exceções (mensagens em português)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurações globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:9016'];

  console.log('🌐 CORS enabled for origins:', corsOrigin);

  app.enableCors({
    origin: corsOrigin,
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

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('ERP Laboratório API')
    .setDescription(
      'Sistema ERP modular para laboratórios de análises clínicas e imagens',
    )
    .setVersion('1.0')
    .addTag('health', 'Health Check')
    .addTag('atendimento', 'Módulo de Atendimento e Agendamento')
    .addTag('exames', 'Módulo de Gestão de Exames')
    .addTag('financeiro', 'Módulo Financeiro')
    .addTag('crm', 'Módulo CRM e WhatsApp')
    .addTag('auditoria', 'Módulo de Auditoria e Qualidade')
    .addTag('estoque', 'Módulo de Estoque e Compras')
    .addTag('tiss', 'Módulo TISS e Convênios')
    .addTag('tarefas', 'Módulo de Tarefas Internas')
    .addTag('bi', 'Módulo de Business Intelligence')
    .addTag('portal-cliente', 'Portal do Cliente')
    .addTag('portal-medico', 'Portal Médico')
    .addTag('integracoes', 'Módulo de Integrações')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Gerar arquivo OpenAPI/Swagger JSON para importação no Postman e documentação
  // Desabilitado em produção (problema de permissão no Docker)
  // const outputPath = './openapi.json';
  // fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  const port = process.env.PORT ?? 10016;
  await app.listen(port, '0.0.0.0'); // IMPORTANTE: 0.0.0.0 para aceitar conexões externas

  console.log(`🚀 Servidor ERP Laboratório rodando em http://0.0.0.0:${port}`);
  console.log(`📖 Documentação da API: http://0.0.0.0:${port}/api/docs`);
  console.log(`💚 Health Check: http://0.0.0.0:${port}/api/v1/health`);
  console.log(`📄 OpenAPI/Postman: ./openapi.json`);
}

bootstrap();
