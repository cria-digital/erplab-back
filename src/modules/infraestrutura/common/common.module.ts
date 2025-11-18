import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CepService } from './services/cep.service';
import { CepController } from './controllers/cep.controller';
import { CnaeService } from './services/cnae.service';
import { CnaeController } from './controllers/cnae.controller';
import { ServicoSaudeController } from './servico-saude.controller';
import { ServicoSaudeService } from './servico-saude.service';
import { EstadoService } from './services/estado.service';
import { EstadoController } from './controllers/estado.controller';
import { CidadeService } from './services/cidade.service';
import { CidadeController } from './controllers/cidade.controller';
import { Cnae } from './entities/cnae.entity';
import { ServicoSaude } from './entities/servico-saude.entity';
import { Estado } from './entities/estado.entity';
import { Cidade } from './entities/cidade.entity';
import { CnaeSeedService } from '../../../database/seeds/cnae-seed.service';
import { ServicoSaudeSeedService } from '../../../database/seeds/servico-saude-seed.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Cnae, ServicoSaude, Estado, Cidade]),
  ],
  controllers: [
    CepController,
    CnaeController,
    ServicoSaudeController,
    EstadoController,
    CidadeController,
  ],
  providers: [
    CepService,
    CnaeService,
    ServicoSaudeService,
    EstadoService,
    CidadeService,
    CnaeSeedService,
    ServicoSaudeSeedService,
  ],
  exports: [
    CepService,
    CnaeService,
    ServicoSaudeService,
    EstadoService,
    CidadeService,
    CnaeSeedService,
    ServicoSaudeSeedService,
  ],
})
export class CommonModule {}
