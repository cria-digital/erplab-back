import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CnaeSeedService } from './cnae-seed.service';
import { BancoSeedService } from './banco-seed.service';
import { ServicoSaudeSeedService } from './servico-saude-seed.service';
import { CampoFormularioSeedService } from './campo-formulario-seed.service';

async function bootstrap() {
  const startTime = Date.now();
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('==============================');
    console.log('🌱 [SEED-ALL] Iniciando processo de seed...');
    console.log(`🕒 [SEED-ALL] Timestamp: ${new Date().toISOString()}`);
    console.log('==============================\n');

    // Executar seed de CNAEs
    const cnaeSeedService = app.get(CnaeSeedService);
    console.log('1. Importando CNAEs...');
    await cnaeSeedService.seed();

    // Executar seed de Bancos
    const bancoSeedService = app.get(BancoSeedService);
    console.log('2. Importando Bancos...');
    await bancoSeedService.seed();

    // Executar seed de Serviços de Saúde
    const servicoSaudeSeedService = app.get(ServicoSaudeSeedService);
    console.log('3. Importando Serviços de Saúde...');
    await servicoSaudeSeedService.seed();

    // Executar seed de Campos de Formulário
    const campoFormularioSeedService = app.get(CampoFormularioSeedService);
    console.log('4. Importando Campos de Formulário...');
    await campoFormularioSeedService.seed();

    const duration = Date.now() - startTime;
    console.log('\n==============================');
    console.log('✅ [SEED-ALL] Seed concluído com sucesso!');
    console.log(
      `⏱️  [SEED-ALL] Tempo total: ${duration}ms (${(duration / 1000).toFixed(2)}s)`,
    );
    console.log(`🏁 [SEED-ALL] Finalizado em: ${new Date().toISOString()}`);
    console.log('==============================');
  } catch (error) {
    console.error('Erro durante o processo de seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
