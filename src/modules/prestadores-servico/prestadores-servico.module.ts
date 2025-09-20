import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestadorServico } from './entities/prestador-servico.entity';
import { PrestadorServicoCategoria } from './entities/prestador-servico-categoria.entity';
import { PrestadorServicoService } from './prestador-servico.service';
import { PrestadorServicoCategoriaService } from './prestador-servico-categoria.service';
import { PrestadorServicoController } from './prestador-servico.controller';
import { PrestadorServicoCategoriaController } from './prestador-servico-categoria.controller';
import { Empresa } from '../empresas/entities/empresa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrestadorServico,
      PrestadorServicoCategoria,
      Empresa,
    ]),
  ],
  controllers: [
    PrestadorServicoController,
    PrestadorServicoCategoriaController,
  ],
  providers: [PrestadorServicoService, PrestadorServicoCategoriaService],
  exports: [PrestadorServicoService, PrestadorServicoCategoriaService],
})
export class PrestadoresServicoModule {}
