import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CepService } from './services/cep.service';
import { CepController } from './controllers/cep.controller';
import { CnaeService } from './services/cnae.service';
import { CnaeController } from './controllers/cnae.controller';
import { ServicoSaudeController } from './servico-saude.controller';
import { ServicoSaudeService } from './servico-saude.service';
import { Cnae } from './entities/cnae.entity';
import { ServicoSaude } from './entities/servico-saude.entity';
import { CnaeSeedService } from '../../../database/seeds/cnae-seed.service';
import { ServicoSaudeSeedService } from '../../../database/seeds/servico-saude-seed.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Cnae, ServicoSaude])],
  controllers: [CepController, CnaeController, ServicoSaudeController],
  providers: [
    CepService,
    CnaeService,
    ServicoSaudeService,
    CnaeSeedService,
    ServicoSaudeSeedService,
  ],
  exports: [
    CepService,
    CnaeService,
    ServicoSaudeService,
    CnaeSeedService,
    ServicoSaudeSeedService,
  ],
})
export class CommonModule {}
