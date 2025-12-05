import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CnaeSeedService } from './cnae-seed.service';
import { CnaeSubclassesSeedService } from './cnae-subclasses-seed.service';
import { BancoSeedService } from './banco-seed.service';
import { ServicoSaudeSeedService } from './servico-saude-seed.service';
import { CampoFormularioSeedService } from './campo-formulario-seed.service';
import { CampoFormularioConveniosSeedService } from './campo-formulario-convenios-seed.service';
import { EstadoSeedService } from './estado-seed.service';
import { CidadeSeedService } from './cidade-seed.service';

async function bootstrap() {
  const startTime = Date.now();
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('==============================');
    console.log('🌱 [SEED-ALL] Iniciando processo de seed...');
    console.log(`🕒 [SEED-ALL] Timestamp: ${new Date().toISOString()}`);
    console.log('==============================\n');

    // Executar seed de CNAEs (classes)
    const cnaeSeedService = app.get(CnaeSeedService);
    console.log('1. Importando CNAEs (classes)...');
    await cnaeSeedService.seed();

    // Executar seed de Subclasses CNAE (7 dígitos do IBGE)
    const cnaeSubclassesSeedService = app.get(CnaeSubclassesSeedService);
    console.log('2. Importando Subclasses CNAE (7 dígitos)...');
    await cnaeSubclassesSeedService.seed();

    // Executar seed de Bancos
    const bancoSeedService = app.get(BancoSeedService);
    console.log('3. Importando Bancos...');
    await bancoSeedService.seed();

    // Executar seed de Serviços de Saúde
    const servicoSaudeSeedService = app.get(ServicoSaudeSeedService);
    console.log('4. Importando Serviços de Saúde...');
    await servicoSaudeSeedService.seed();

    // Executar seed de Campos de Formulário
    const campoFormularioSeedService = app.get(CampoFormularioSeedService);
    console.log('5. Importando Campos de Formulário...');
    await campoFormularioSeedService.seed();

    // Executar seed de Campos de Formulário - Convênios
    const campoFormularioConveniosSeedService = app.get(
      CampoFormularioConveniosSeedService,
    );
    console.log('6. Importando Campos de Formulário de Convênios...');
    await campoFormularioConveniosSeedService.seed();

    // Executar seed de Estados
    const estadoSeedService = app.get(EstadoSeedService);
    console.log('7. Importando Estados do Brasil...');
    await estadoSeedService.seed();

    // Executar seed de Cidades
    const cidadeSeedService = app.get(CidadeSeedService);
    console.log('8. Importando Cidades do Brasil...');
    await cidadeSeedService.seed();

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
