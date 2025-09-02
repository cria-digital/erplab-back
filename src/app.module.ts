import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { HealthController } from './health.controller';
import { AtendimentoModule } from './modulos/atendimento/atendimento.module';

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
    
    // Próximos módulos a serem implementados:
    // ExamesModule,
    // FinanceiroModule,
    // CrmModule,
    // AuditoriaModule,
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