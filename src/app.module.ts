import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { databaseConfig } from './config/database.config';
import { HealthController } from './health.controller';
import { MetricsService } from './comum/services/metrics.service';
import { PerformanceInterceptor } from './comum/interceptors/performance.interceptor';

// Autenticação
import { AuthModule } from './modules/autenticacao/auth/auth.module';
import { UsuariosModule } from './modules/autenticacao/usuarios/usuarios.module';
import { PerfilModule } from './modules/autenticacao/perfil/perfil.module';
import { JwtAuthGuard } from './modules/autenticacao/auth/guards/jwt-auth.guard';

// Cadastros
import { PacientesModule } from './modules/cadastros/pacientes/pacientes.module';
import { ProfissionaisModule } from './modules/cadastros/profissionais/profissionais.module';
import { UnidadeSaudeModule } from './modules/cadastros/unidade-saude/unidade-saude.module';
import { EmpresasModule } from './modules/cadastros/empresas/empresas.module';

// Exames
import { ExamesModule } from './modules/exames/exames/exames.module';
import { KitsModule } from './modules/exames/kits/kits.module';
import { MetodosModule } from './modules/exames/metodos/metodos.module';
import { MatrizesModule } from './modules/exames/matrizes/matrizes.module';
import { AmostrasModule } from './modules/exames/amostras/amostras.module';

// Relacionamento
import { ConveniosModule } from './modules/relacionamento/convenios/convenios.module';
import { LaboratoriosModule } from './modules/relacionamento/laboratorios/laboratorios.module';
import { TelemedicinaModule } from './modules/relacionamento/telemedicina/telemedicina.module';
import { FornecedoresModule } from './modules/relacionamento/fornecedores/fornecedores.module';
import { PrestadoresServicoModule } from './modules/relacionamento/prestadores-servico/prestadores-servico.module';

// Atendimento
import { AtendimentoModule } from './modules/atendimento/atendimento/atendimento.module';
import { AgendasModule } from './modules/atendimento/agendas/agendas.module';
import { IntegracoesModule as IntegracoesAtendimentoModule } from './modules/atendimento/integracoes/integracoes.module';

// Integrações TISS
import { IntegracoesModule } from './modules/integracoes/integracoes.module';

// Financeiro
import { FinanceiroModule } from './modules/financeiro/core/financeiro.module';
import { ContasPagarModule } from './modules/financeiro/core/contas-pagar/contas-pagar.module';

// Configurações - Estrutura Física
import { SalasModule } from './modules/configuracoes/estrutura/salas/salas.module';
import { SetoresModule } from './modules/configuracoes/estrutura/setores/setores.module';
import { EquipamentosModule } from './modules/configuracoes/estrutura/equipamentos/equipamentos.module';
import { ImobilizadosModule } from './modules/configuracoes/estrutura/imobilizados/imobilizados.module';
import { EtiquetasAmostraModule } from './modules/configuracoes/estrutura/etiquetas-amostra/etiquetas-amostra.module';

// Infraestrutura
import { AuditoriaModule } from './modules/infraestrutura/auditoria/auditoria.module';
import { CommonModule } from './modules/infraestrutura/common/common.module';
import { EmailModule } from './modules/infraestrutura/email/email.module';
import { CamposFormularioModule } from './modules/infraestrutura/campos-formulario/campos-formulario.module';

// Seeds
import { SeedModule } from './database/seeds/seed.module';

@Module({
  imports: [
    // Configuração Global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // 1. Autenticação e Segurança
    AuthModule,
    UsuariosModule,
    PerfilModule,

    // 2. Cadastros Base
    PacientesModule,
    ProfissionaisModule,
    UnidadeSaudeModule,
    EmpresasModule,

    // 3. Gestão de Exames
    ExamesModule,
    KitsModule,
    MetodosModule,
    MatrizesModule,
    AmostrasModule,

    // 4. Relacionamento com Empresas
    ConveniosModule,
    LaboratoriosModule,
    TelemedicinaModule,
    FornecedoresModule,
    PrestadoresServicoModule,

    // 5. Atendimento e Agendamento
    AtendimentoModule,
    AgendasModule,
    IntegracoesAtendimentoModule,

    // 5.1 Integrações TISS (SOAP)
    IntegracoesModule,

    // 6. Financeiro
    FinanceiroModule,
    ContasPagarModule,

    // 7. Configurações - Estrutura Física
    SalasModule,
    SetoresModule,
    EquipamentosModule,
    ImobilizadosModule,
    EtiquetasAmostraModule,

    // 8. Infraestrutura
    AuditoriaModule,
    CommonModule,
    EmailModule,
    CamposFormularioModule,

    // Seeds
    SeedModule,

    // Próximos módulos a serem implementados:
    // ContasReceberModule,
    // EstoqueModule,
    // ComprasModule,
    // TissModule,
    // PopsModule,
    // ChecklistsModule,
    // AuditoriasInternasModule,
    // RastreabilidadeModule,
    // NotificacoesModule,
    // WhatsappModule,
    // EstruturaModule,
    // DocumentacaoModule,
    // TabelasPrecosModule,
    // BiModule,
    // PortalClienteModule,
    // PortalMedicoModule,
  ],
  controllers: [HealthController],
  providers: [
    // Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
    // Services
    MetricsService,
  ],
})
export class AppModule {}
