import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sala } from './entities/sala.entity';
import { AlternativaCampoFormulario } from '../../../infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { SalasService } from './services/salas.service';
import { SalasController } from './controllers/salas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sala, AlternativaCampoFormulario])],
  controllers: [SalasController],
  providers: [SalasService],
  exports: [SalasService],
})
export class SalasModule {}
