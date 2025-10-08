import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formulario } from './entities/formulario.entity';
import { CampoFormulario } from './entities/campo-formulario.entity';
import { AlternativaCampo } from './entities/alternativa-campo.entity';
import { RespostaFormulario } from './entities/resposta-formulario.entity';
import { RespostaCampo } from './entities/resposta-campo.entity';
import { FormulariosService } from './formularios.service';
import { CampoFormularioService } from './campo-formulario.service';
import { AlternativaCampoService } from './alternativa-campo.service';
import { RespostaFormularioService } from './resposta-formulario.service';
import { FormulariosController } from './formularios.controller';
import { CampoFormularioController } from './campo-formulario.controller';
import { AlternativaCampoController } from './alternativa-campo.controller';
import { RespostaFormularioController } from './resposta-formulario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Formulario,
      CampoFormulario,
      AlternativaCampo,
      RespostaFormulario,
      RespostaCampo,
    ]),
  ],
  controllers: [
    FormulariosController,
    CampoFormularioController,
    AlternativaCampoController,
    RespostaFormularioController,
  ],
  providers: [
    FormulariosService,
    CampoFormularioService,
    AlternativaCampoService,
    RespostaFormularioService,
  ],
  exports: [
    FormulariosService,
    CampoFormularioService,
    AlternativaCampoService,
    RespostaFormularioService,
  ],
})
export class FormulariosModule {}
