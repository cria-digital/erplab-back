import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Banco } from './entities/banco.entity';
import { ContaBancaria } from './entities/conta-bancaria.entity';
import { ContaBancariaUnidade } from './entities/conta-bancaria-unidade.entity';
import { GatewayPagamento } from './entities/gateway-pagamento.entity';
import { Adquirente } from './entities/adquirente.entity';
import { AdquirenteUnidade } from './entities/adquirente-unidade.entity';
import { RestricaoAdquirente } from './entities/restricao-adquirente.entity';
import { PlanoContas } from './entities/plano-contas.entity';
import { ContaContabil } from './entities/conta-contabil.entity';

// Services
import { BancoService } from './banco.service';
import { ContaBancariaService } from './conta-bancaria.service';
import { GatewayPagamentoService } from './gateway-pagamento.service';
import { AdquirenteService } from './adquirente.service';
import { PlanoContasService } from './plano-contas.service';
import { ContaContabilService } from './conta-contabil.service';

// Controllers
import { BancoController } from './banco.controller';
import { ContaBancariaController } from './conta-bancaria.controller';
import { GatewayPagamentoController } from './gateway-pagamento.controller';
import { AdquirenteController } from './adquirente.controller';
import { PlanoContasController } from './plano-contas.controller';
import { ContaContabilController } from './conta-contabil.controller';

// Modules
import { UnidadeSaudeModule } from '../../cadastros/unidade-saude/unidade-saude.module';
import { AuditoriaModule } from '../../infraestrutura/auditoria/auditoria.module';
import { IntegracoesModule } from '../../atendimento/integracoes/integracoes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Banco,
      ContaBancaria,
      ContaBancariaUnidade,
      GatewayPagamento,
      Adquirente,
      AdquirenteUnidade,
      RestricaoAdquirente,
      PlanoContas,
      ContaContabil,
    ]),
    UnidadeSaudeModule,
    AuditoriaModule,
    IntegracoesModule,
  ],
  controllers: [
    BancoController,
    ContaBancariaController,
    GatewayPagamentoController,
    AdquirenteController,
    PlanoContasController,
    ContaContabilController,
  ],
  providers: [
    BancoService,
    ContaBancariaService,
    GatewayPagamentoService,
    AdquirenteService,
    PlanoContasService,
    ContaContabilService,
  ],
  exports: [
    BancoService,
    ContaBancariaService,
    GatewayPagamentoService,
    AdquirenteService,
    PlanoContasService,
    ContaContabilService,
  ],
})
export class FinanceiroModule {}
