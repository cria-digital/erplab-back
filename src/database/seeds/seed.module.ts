import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cnae } from '../../modules/infraestrutura/common/entities/cnae.entity';
import { Banco } from '../../modules/financeiro/core/entities/banco.entity';
import { CampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/campo-formulario.entity';
import { AlternativaCampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { Estado } from '../../modules/infraestrutura/common/entities/estado.entity';
import { Cidade } from '../../modules/infraestrutura/common/entities/cidade.entity';
import { CnaeSeedService } from './cnae-seed.service';
import { BancoSeedService } from './banco-seed.service';
import { CampoFormularioSeedService } from './campo-formulario-seed.service';
import { EstadoSeedService } from './estado-seed.service';
import { CidadeSeedService } from './cidade-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cnae,
      Banco,
      CampoFormulario,
      AlternativaCampoFormulario,
      Estado,
      Cidade,
    ]),
  ],
  providers: [
    CnaeSeedService,
    BancoSeedService,
    CampoFormularioSeedService,
    EstadoSeedService,
    CidadeSeedService,
  ],
  exports: [
    CnaeSeedService,
    BancoSeedService,
    CampoFormularioSeedService,
    EstadoSeedService,
    CidadeSeedService,
  ],
})
export class SeedModule {}
