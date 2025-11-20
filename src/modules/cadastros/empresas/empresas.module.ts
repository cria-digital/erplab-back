import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { Empresa } from './entities/empresa.entity';
import { ContaBancaria } from '../../financeiro/core/entities/conta-bancaria.entity';
import { Laboratorio } from '../../relacionamento/laboratorios/entities/laboratorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, ContaBancaria, Laboratorio])],
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService],
})
export class EmpresasModule {}
