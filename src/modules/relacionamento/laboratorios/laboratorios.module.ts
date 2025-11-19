import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratorio } from './entities/laboratorio.entity';
import { Empresa } from '../../cadastros/empresas/entities/empresa.entity';
import { LaboratorioController } from './controllers/laboratorio.controller';
import { LaboratorioService } from './services/laboratorio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratorio, Empresa])],
  controllers: [LaboratorioController],
  providers: [LaboratorioService],
  exports: [LaboratorioService],
})
export class LaboratoriosModule {}
