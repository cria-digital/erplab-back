import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { Empresa } from './entities/empresa.entity';
import { ContaBancaria } from '../../financeiro/core/entities/conta-bancaria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, ContaBancaria])],
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService],
})
export class EmpresasModule {}
