import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { HealthController } from './health.controller';
import { AtendimentoModule } from './modules/atendimento/atendimento.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UnidadeSaudeModule } from './modules/unidade-saude/unidade-saude.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    
    // Módulos do Sistema ERP
    AtendimentoModule,
    AuditoriaModule,
    PacientesModule,
    UnidadeSaudeModule,
    
    // Próximos módulos a serem implementados:
    // ExamesModule,
    // FinanceiroModule,
    // CrmModule,
    // EstoqueModule,
    // TissModule,
    // TarefasModule,
    // BiModule,
    // PortalClienteModule,
    // PortalMedicoModule,
    // IntegracoesModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}