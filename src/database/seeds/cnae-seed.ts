import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CnaeSeedService } from './cnae-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const cnaeSeedService = app.get(CnaeSeedService);

  try {
    console.log('Iniciando importação de CNAEs...');
    await cnaeSeedService.seed();
    console.log('Importação de CNAEs concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a importação de CNAEs:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
