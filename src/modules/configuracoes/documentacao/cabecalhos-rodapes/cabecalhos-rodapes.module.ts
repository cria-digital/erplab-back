import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabecalhoRodape } from './entities/cabecalho-rodape.entity';
import { CabecalhosRodapesService } from './services/cabecalhos-rodapes.service';
import { CabecalhosRodapesController } from './controllers/cabecalhos-rodapes.controller';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CabecalhoRodape, UnidadeSaude])],
  controllers: [CabecalhosRodapesController],
  providers: [CabecalhosRodapesService],
  exports: [CabecalhosRodapesService],
})
export class CabecalhosRodapesModule {}
