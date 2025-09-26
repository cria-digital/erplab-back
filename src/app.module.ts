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
import { ExamesModule } from './modules/exames/exames.module';
import { EmailModule } from './modules/email/email.module';
import { AgendasModule } from './modules/agendas/agendas.module';
import { ProfissionaisModule } from './modules/profissionais/profissionais.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { CommonModule } from './modules/common/common.module';
import { ConveniosModule } from './modules/convenios/convenios.module';
import { LaboratoriosModule } from './modules/laboratorios/laboratorios.module';
import { TelemedicinaModule } from './modules/telemedicina/telemedicina.module';
import { FornecedoresModule } from './modules/fornecedores/fornecedores.module';
import { PrestadoresServicoModule } from './modules/prestadores-servico/prestadores-servico.module';
import { KitsModule } from './modules/kits/kits.module';
import { FinanceiroModule } from './modules/financeiro/financeiro.module';
import { SeedModule } from './database/seeds/seed.module';

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
    EmailModule,

    // Módulos Comuns
    CommonModule,

    // Módulos do Sistema ERP
    AtendimentoModule,
    AuditoriaModule,
    PacientesModule,
    UnidadeSaudeModule,
    ExamesModule,
    AgendasModule,
    ProfissionaisModule,
    EmpresasModule,
    ConveniosModule,
    LaboratoriosModule,
    TelemedicinaModule,
    FornecedoresModule,
    PrestadoresServicoModule,
    KitsModule,
    FinanceiroModule,
    SeedModule,

    // Próximos módulos a serem implementados:
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
