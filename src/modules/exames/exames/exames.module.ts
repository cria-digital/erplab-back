import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Exame } from './entities/exame.entity';
import { TipoExame } from './entities/tipo-exame.entity';
import { Convenio } from './entities/convenio.entity';
import { OrdemServico } from './entities/ordem-servico.entity';
import { OrdemServicoExame } from './entities/ordem-servico-exame.entity';
import { ResultadoExame } from './entities/resultado-exame.entity';
import { LaboratorioApoio } from './entities/laboratorio-apoio.entity';
import { SubgrupoExame } from './entities/subgrupo-exame.entity';
import { SetorExame } from './entities/setor-exame.entity';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';

// Services
import { ExamesService } from './exames.service';
import { ConveniosService } from '../../relacionamento/convenios/convenios.service';
import { TiposExameService } from './tipos-exame.service';

// Controllers
import { ExamesController } from './exames.controller';
import { ConveniosController } from '../../relacionamento/convenios/convenios.controller';
import { TiposExameController } from './tipos-exame.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exame,
      TipoExame,
      Convenio,
      OrdemServico,
      OrdemServicoExame,
      ResultadoExame,
      LaboratorioApoio,
      SubgrupoExame,
      SetorExame,
      Empresa,
    ]),
  ],
  controllers: [ExamesController, ConveniosController, TiposExameController],
  providers: [ExamesService, ConveniosService, TiposExameService],
  exports: [ExamesService, ConveniosService, TiposExameService],
})
export class ExamesModule {}
