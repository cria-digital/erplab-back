import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtiquetaAmostra } from './entities/etiqueta-amostra.entity';
import { EtiquetasAmostraService } from './services/etiquetas-amostra.service';
import { EtiquetasAmostraController } from './controllers/etiquetas-amostra.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EtiquetaAmostra])],
  controllers: [EtiquetasAmostraController],
  providers: [EtiquetasAmostraService],
  exports: [EtiquetasAmostraService],
})
export class EtiquetasAmostraModule {}
