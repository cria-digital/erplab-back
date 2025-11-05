import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampoFormulario } from './entities/campo-formulario.entity';
import { AlternativaCampoFormulario } from './entities/alternativa-campo-formulario.entity';
import { CampoFormularioService } from './services/campo-formulario.service';
import { AlternativaCampoService } from './services/alternativa-campo.service';
import { CampoFormularioController } from './controllers/campo-formulario.controller';
import { AlternativaCampoController } from './controllers/alternativa-campo.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampoFormulario, AlternativaCampoFormulario]),
  ],
  controllers: [CampoFormularioController, AlternativaCampoController],
  providers: [CampoFormularioService, AlternativaCampoService],
  exports: [CampoFormularioService, AlternativaCampoService],
})
export class CamposFormularioModule {}
