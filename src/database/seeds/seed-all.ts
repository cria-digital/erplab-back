import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CnaeSeedService } from './cnae-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('==============================');
    console.log('Iniciando processo de seed...');
    console.log('==============================\n');

    // Executar seed de CNAEs
    const cnaeSeedService = app.get(CnaeSeedService);
    console.log('1. Importando CNAEs...');
    await cnaeSeedService.seed();

    // Futuros seeders podem ser adicionados aqui
    // console.log('2. Importando outros dados...');
    // const outroSeedService = app.get(OutroSeedService);
    // await outroSeedService.seed();

    console.log('\n==============================');
    console.log('Seed concluído com sucesso!');
    console.log('==============================');
  } catch (error) {
    console.error('Erro durante o processo de seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
