import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cnae } from '../../modules/infraestrutura/common/entities/cnae.entity';
import { Banco } from '../../modules/financeiro/core/entities/banco.entity';
import { ServicoSaude } from '../../modules/infraestrutura/common/entities/servico-saude.entity';
import { CampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/campo-formulario.entity';
import { AlternativaCampoFormulario } from '../../modules/infraestrutura/campos-formulario/entities/alternativa-campo-formulario.entity';
import { Estado } from '../../modules/infraestrutura/common/entities/estado.entity';
import { Cidade } from '../../modules/infraestrutura/common/entities/cidade.entity';
import { Tenant } from '../../modules/tenants/entities/tenant.entity';
import { Usuario } from '../../modules/autenticacao/usuarios/entities/usuario.entity';
import { CnaeSeedService } from './cnae-seed.service';
import { CnaeSubclassesSeedService } from './cnae-subclasses-seed.service';
import { BancoSeedService } from './banco-seed.service';
import { ServicoSaudeSeedService } from './servico-saude-seed.service';
import { CampoFormularioSeedService } from './campo-formulario-seed.service';
import { CampoFormularioConveniosSeedService } from './campo-formulario-convenios-seed.service';
import { EstadoSeedService } from './estado-seed.service';
import { CidadeSeedService } from './cidade-seed.service';
import { TenantSeedService } from './tenant-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cnae,
      Banco,
      ServicoSaude,
      CampoFormulario,
      AlternativaCampoFormulario,
      Estado,
      Cidade,
      Tenant,
      Usuario,
    ]),
  ],
  providers: [
    CnaeSeedService,
    CnaeSubclassesSeedService,
    BancoSeedService,
    ServicoSaudeSeedService,
    CampoFormularioSeedService,
    CampoFormularioConveniosSeedService,
    EstadoSeedService,
    CidadeSeedService,
    TenantSeedService,
  ],
  exports: [
    CnaeSeedService,
    CnaeSubclassesSeedService,
    BancoSeedService,
    ServicoSaudeSeedService,
    CampoFormularioSeedService,
    CampoFormularioConveniosSeedService,
    EstadoSeedService,
    CidadeSeedService,
    TenantSeedService,
  ],
})
export class SeedModule {}
