import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Exame } from './entities/exame.entity';
import { ExameUnidade } from './entities/exame-unidade.entity';
import { OrdemServico } from './entities/ordem-servico.entity';
import { OrdemServicoExame } from './entities/ordem-servico-exame.entity';
import { ResultadoExame } from './entities/resultado-exame.entity';
import { LaboratorioApoio } from './entities/laboratorio-apoio.entity';
import { ExameLaboratorioApoio } from './entities/exame-laboratorio-apoio.entity';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';
import { UnidadeSaude } from '../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Tuss } from '../tuss/entities/tuss.entity';

// Modules
import { ConveniosModule } from '../../relacionamento/convenios/convenios.module';

// Services
import { ExamesService } from './exames.service';
import { ExameUnidadeService } from './exame-unidade.service';
import { ExameLaboratorioApoioService } from './exame-laboratorio-apoio.service';
import { LaboratorioApoioService } from './laboratorio-apoio.service';

// Controllers
import { ExamesController } from './exames.controller';
import { ExameLaboratorioApoioController } from './exame-laboratorio-apoio.controller';
import { LaboratorioApoioController } from './laboratorio-apoio.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exame,
      ExameUnidade,
      OrdemServico,
      OrdemServicoExame,
      ResultadoExame,
      LaboratorioApoio,
      ExameLaboratorioApoio,
      Empresa,
      UnidadeSaude,
      Tuss,
    ]),
    ConveniosModule, // Importar módulo completo para ter acesso aos services
  ],
  controllers: [
    ExamesController,
    ExameLaboratorioApoioController,
    LaboratorioApoioController,
  ],
  providers: [
    ExamesService,
    ExameUnidadeService,
    ExameLaboratorioApoioService,
    LaboratorioApoioService,
  ],
  exports: [
    ExamesService,
    ExameUnidadeService,
    ExameLaboratorioApoioService,
    LaboratorioApoioService,
  ],
})
export class ExamesModule {}
