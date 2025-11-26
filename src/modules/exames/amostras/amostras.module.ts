import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amostra } from './entities/amostra.entity';
import { LaboratorioAmostra } from './entities/laboratorio-amostra.entity';
import { Laboratorio } from '../../relacionamento/laboratorios/entities/laboratorio.entity';
import { AmostrasController } from './controllers/amostras.controller';
import { LaboratorioAmostraController } from './controllers/laboratorio-amostra.controller';
import { AmostrasService } from './services/amostras.service';
import { LaboratorioAmostraService } from './services/laboratorio-amostra.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Amostra, LaboratorioAmostra, Laboratorio]),
  ],
  controllers: [AmostrasController, LaboratorioAmostraController],
  providers: [AmostrasService, LaboratorioAmostraService],
  exports: [AmostrasService, LaboratorioAmostraService],
})
export class AmostrasModule {}
