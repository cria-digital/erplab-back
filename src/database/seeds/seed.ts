import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CnaeSeedService } from './cnae-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const cnaeSeedService = app.get(CnaeSeedService);

  try {
    console.log('Iniciando processo de seed...');
    await cnaeSeedService.seed();
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o processo de seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
