import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CepService } from './services/cep.service';
import { CepController } from './controllers/cep.controller';
import { CnaeService } from './services/cnae.service';
import { CnaeController } from './controllers/cnae.controller';
import { Cnae } from './entities/cnae.entity';
import { CnaeSeedService } from '../../../database/seeds/cnae-seed.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Cnae])],
  controllers: [CepController, CnaeController],
  providers: [CepService, CnaeService, CnaeSeedService],
  exports: [CepService, CnaeService, CnaeSeedService],
})
export class CommonModule {}
