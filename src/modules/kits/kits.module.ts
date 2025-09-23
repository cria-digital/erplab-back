import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitsService } from './services/kits.service';
import { KitsController } from './controllers/kits.controller';
import { Kit } from './entities/kit.entity';
import { KitExame } from './entities/kit-exame.entity';
import { KitUnidade } from './entities/kit-unidade.entity';
import { KitConvenio } from './entities/kit-convenio.entity';
import { Exame } from '../exames/entities/exame.entity';
import { UnidadeSaude } from '../unidade-saude/entities/unidade-saude.entity';
import { Convenio } from '../convenios/entities/convenio.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Kit,
      KitExame,
      KitUnidade,
      KitConvenio,
      Exame,
      UnidadeSaude,
      Convenio,
      Empresa,
    ]),
  ],
  controllers: [KitsController],
  providers: [KitsService],
  exports: [KitsService],
})
export class KitsModule {}
