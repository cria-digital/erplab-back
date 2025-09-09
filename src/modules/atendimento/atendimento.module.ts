import { Module } from '@nestjs/common';
import { AtendimentoController } from './controllers/atendimento.controller';
import { AtendimentoService } from './services/atendimento.service';

@Module({
  controllers: [AtendimentoController],
  providers: [AtendimentoService],
  exports: [AtendimentoService],
})
export class AtendimentoModule {}
