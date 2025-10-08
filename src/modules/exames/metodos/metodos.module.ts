import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodosService } from './metodos.service';
import { MetodosController } from './metodos.controller';
import { LaboratorioMetodoService } from './laboratorio-metodo.service';
import { LaboratorioMetodoController } from './laboratorio-metodo.controller';
import { Metodo } from './entities/metodo.entity';
import { LaboratorioMetodo } from './entities/laboratorio-metodo.entity';
import { Laboratorio } from '../../relacionamento/laboratorios/entities/laboratorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Metodo, LaboratorioMetodo, Laboratorio])],
  controllers: [MetodosController, LaboratorioMetodoController],
  providers: [MetodosService, LaboratorioMetodoService],
  exports: [MetodosService, LaboratorioMetodoService],
})
export class MetodosModule {}
