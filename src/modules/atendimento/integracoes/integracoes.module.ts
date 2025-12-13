import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integracao } from './entities/integracao.entity';
import { IntegracaoConfiguracao } from './entities/integracao-configuracao.entity';
import { IntegracoesService } from './integracoes.service';
import { IntegracoesController } from './integracoes.controller';
import { IntegracaoConfigService } from './services/integracao-config.service';

/**
 * Módulo de Integrações
 *
 * Sistema refatorado para schemas dinâmicos.
 * - Schemas definem campos e validações (código TypeScript)
 * - Integrações são instâncias de schemas
 * - Configurações armazenadas em tabela key-value
 *
 * Services exportados:
 * - IntegracoesService: CRUD de integrações
 * - IntegracaoConfigService: Busca configs por tenant (usado pelos services de integração)
 */
@Module({
  imports: [TypeOrmModule.forFeature([Integracao, IntegracaoConfiguracao])],
  controllers: [IntegracoesController],
  providers: [IntegracoesService, IntegracaoConfigService],
  exports: [IntegracoesService, IntegracaoConfigService],
})
export class IntegracoesModule {}
