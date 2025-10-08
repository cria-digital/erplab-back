import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profissional } from './entities/profissional.entity';
import { DocumentoProfissional } from './entities/documento-profissional.entity';
import { ProfissionaisService } from './services/profissionais.service';
import { ProfissionaisController } from './controllers/profissionais.controller';
import { Endereco } from '../../infraestrutura/common/entities/endereco.entity';
import { Agenda } from '../../atendimento/agendas/entities/agenda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profissional,
      DocumentoProfissional,
      Endereco,
      Agenda,
    ]),
  ],
  providers: [ProfissionaisService],
  controllers: [ProfissionaisController],
  exports: [ProfissionaisService],
})
export class ProfissionaisModule {}
