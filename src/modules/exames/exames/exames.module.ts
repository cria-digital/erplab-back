import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Exame } from './entities/exame.entity';
import { TipoExame } from './entities/tipo-exame.entity';
import { OrdemServico } from './entities/ordem-servico.entity';
import { OrdemServicoExame } from './entities/ordem-servico-exame.entity';
import { ResultadoExame } from './entities/resultado-exame.entity';
import { LaboratorioApoio } from './entities/laboratorio-apoio.entity';
import { SubgrupoExame } from './entities/subgrupo-exame.entity';
import { SetorExame } from './entities/setor-exame.entity';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';

// Modules
import { ConveniosModule } from '../../relacionamento/convenios/convenios.module';

// Services
import { ExamesService } from './exames.service';
import { TiposExameService } from './tipos-exame.service';

// Controllers
import { ExamesController } from './exames.controller';
import { TiposExameController } from './tipos-exame.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exame,
      TipoExame,
      OrdemServico,
      OrdemServicoExame,
      ResultadoExame,
      LaboratorioApoio,
      SubgrupoExame,
      SetorExame,
      Empresa,
    ]),
    ConveniosModule, // Importar módulo completo para ter acesso aos services
  ],
  controllers: [ExamesController, TiposExameController],
  providers: [ExamesService, TiposExameService],
  exports: [ExamesService, TiposExameService],
})
export class ExamesModule {}
