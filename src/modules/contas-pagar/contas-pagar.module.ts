import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ContaPagar } from './entities/conta-pagar.entity';
import { CentroCusto } from './entities/centro-custo.entity';
import { ComposicaoFinanceira } from './entities/composicao-financeira.entity';
import { ImpostoRetido } from './entities/imposto-retido.entity';
import { Parcela } from './entities/parcela.entity';
import { PagamentoParcela } from './entities/pagamento-parcela.entity';
import { ParcelamentoConfig } from './entities/parcelamento-config.entity';
import { Anexo } from './entities/anexo.entity';
import { Repasse } from './entities/repasse.entity';
import { RepasseFiltro } from './entities/repasse-filtro.entity';

// Services
import { ContaPagarService } from './services/conta-pagar.service';
import { CentroCustoService } from './services/centro-custo.service';
import { RepasseService } from './services/repasse.service';

// Controllers
import { ContaPagarController } from './controllers/conta-pagar.controller';
import { CentroCustoController } from './controllers/centro-custo.controller';
import { RepasseController } from './controllers/repasse.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContaPagar,
      CentroCusto,
      ComposicaoFinanceira,
      ImpostoRetido,
      Parcela,
      PagamentoParcela,
      ParcelamentoConfig,
      Anexo,
      Repasse,
      RepasseFiltro,
    ]),
  ],
  controllers: [ContaPagarController, CentroCustoController, RepasseController],
  providers: [ContaPagarService, CentroCustoService, RepasseService],
  exports: [ContaPagarService, CentroCustoService, RepasseService],
})
export class ContasPagarModule {}
