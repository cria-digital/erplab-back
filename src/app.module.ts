import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { databaseConfig } from './config/database.config';
import { HealthController } from './health.controller';
import { AtendimentoModule } from './modules/atendimento/atendimento.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UnidadeSaudeModule } from './modules/unidade-saude/unidade-saude.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

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

    // Módulos de Autenticação e Autorização
    AuthModule,
    UsuariosModule,

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
