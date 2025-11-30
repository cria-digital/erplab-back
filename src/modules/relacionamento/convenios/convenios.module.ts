import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  Convenio,
  Plano,
  TabelaPreco,
  TabelaPrecoItem,
  Instrucao,
  ProcedimentoAutorizado,
  Restricao,
} from './entities';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';

// Services
import { ConvenioService } from './services/convenio.service';
import { PlanoService } from './services/plano.service';
import { InstrucaoService } from './services/instrucao.service';
import { TabelaPrecoService } from './services/tabela-preco.service';

// Controllers
import { ConvenioController } from './controllers/convenio.controller';
import { PlanoController } from './controllers/plano.controller';
import { InstrucaoController } from './controllers/instrucao.controller';
import { TabelaPrecoController } from './controllers/tabela-preco.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Convenio,
      Plano,
      TabelaPreco,
      TabelaPrecoItem,
      Instrucao,
      ProcedimentoAutorizado,
      Restricao,
      Empresa,
    ]),
  ],
  providers: [
    ConvenioService,
    PlanoService,
    InstrucaoService,
    TabelaPrecoService,
  ],
  controllers: [
    ConvenioController,
    PlanoController,
    InstrucaoController,
    TabelaPrecoController,
  ],
  exports: [
    ConvenioService,
    PlanoService,
    InstrucaoService,
    TabelaPrecoService,
  ],
})
export class ConveniosModule {}
