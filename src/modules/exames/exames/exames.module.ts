import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Exame } from './entities/exame.entity';
import { OrdemServico } from './entities/ordem-servico.entity';
import { OrdemServicoExame } from './entities/ordem-servico-exame.entity';
import { ResultadoExame } from './entities/resultado-exame.entity';
import { LaboratorioApoio } from './entities/laboratorio-apoio.entity';
import { ExameLaboratorioApoio } from './entities/exame-laboratorio-apoio.entity';
import { SubgrupoExame } from './entities/subgrupo-exame.entity';
import { SetorExame } from './entities/setor-exame.entity';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';

// Modules
import { ConveniosModule } from '../../relacionamento/convenios/convenios.module';

// Services
import { ExamesService } from './exames.service';
import { ExameLaboratorioApoioService } from './exame-laboratorio-apoio.service';

// Controllers
import { ExamesController } from './exames.controller';
import { ExameLaboratorioApoioController } from './exame-laboratorio-apoio.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exame,
      OrdemServico,
      OrdemServicoExame,
      ResultadoExame,
      LaboratorioApoio,
      ExameLaboratorioApoio,
      SubgrupoExame,
      SetorExame,
      Empresa,
    ]),
    ConveniosModule, // Importar módulo completo para ter acesso aos services
  ],
  controllers: [ExamesController, ExameLaboratorioApoioController],
  providers: [ExamesService, ExameLaboratorioApoioService],
  exports: [ExamesService, ExameLaboratorioApoioService],
})
export class ExamesModule {}
