import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from './entities/agenda.entity';
import { ConfiguracaoAgenda } from './entities/configuracao-agenda.entity';
import { PeriodoAtendimento } from './entities/periodo-atendimento.entity';
import { VinculacaoAgenda } from './entities/vinculacao-agenda.entity';
import { NotificacaoAgenda } from './entities/notificacao-agenda.entity';
import { CanalIntegracao } from './entities/canal-integracao.entity';
import { BloqueioHorario } from './entities/bloqueio-horario.entity';
import { HorarioEspecifico } from './entities/horario-especifico.entity';
import { AgendasService } from './services/agendas.service';
import { AgendasController } from './controllers/agendas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agenda,
      ConfiguracaoAgenda,
      PeriodoAtendimento,
      VinculacaoAgenda,
      NotificacaoAgenda,
      CanalIntegracao,
      BloqueioHorario,
      HorarioEspecifico,
    ]),
  ],
  providers: [AgendasService],
  controllers: [AgendasController],
  exports: [AgendasService],
})
export class AgendasModule {}
