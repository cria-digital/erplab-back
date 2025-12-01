import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormularioAtendimento } from './entities/formulario-atendimento.entity';
import { FormulariosAtendimentoService } from './services/formularios-atendimento.service';
import { FormulariosAtendimentoController } from './controllers/formularios-atendimento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormularioAtendimento])],
  controllers: [FormulariosAtendimentoController],
  providers: [FormulariosAtendimentoService],
  exports: [FormulariosAtendimentoService],
})
export class FormulariosAtendimentoModule {}
