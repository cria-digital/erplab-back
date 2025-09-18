import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  Convenio,
  Plano,
  TabelaPreco,
  Instrucao,
  ProcedimentoAutorizado,
  Restricao,
} from './entities';

// Services
import { ConvenioService } from './services/convenio.service';
import { PlanoService } from './services/plano.service';
import { InstrucaoService } from './services/instrucao.service';

// Controllers
import { ConvenioController } from './controllers/convenio.controller';
import { PlanoController } from './controllers/plano.controller';
import { InstrucaoController } from './controllers/instrucao.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Convenio,
      Plano,
      TabelaPreco,
      Instrucao,
      ProcedimentoAutorizado,
      Restricao,
    ]),
  ],
  providers: [ConvenioService, PlanoService, InstrucaoService],
  controllers: [ConvenioController, PlanoController, InstrucaoController],
  exports: [ConvenioService, PlanoService, InstrucaoService],
})
export class ConveniosModule {}
