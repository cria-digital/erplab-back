import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurações globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS para desenvolvimento
  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? true : false,
    credentials: true,
  });

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('ERP Laboratório API')
    .setDescription('Sistema ERP modular para laboratórios de análises clínicas e imagens')
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
  const outputPath = './openapi.json';
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  const port = process.env.PORT || 10016;
  await app.listen(port);

  console.log(`🚀 Servidor ERP Laboratório rodando na porta ${port}`);
  console.log(`📖 Documentação da API: http://localhost:${port}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${port}/api/v1/health`);
  console.log(`📄 OpenAPI/Postman: ./openapi.json`);
}

bootstrap();