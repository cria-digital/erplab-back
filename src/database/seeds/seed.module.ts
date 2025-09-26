import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cnae } from '../../modules/common/entities/cnae.entity';
import { Banco } from '../../modules/financeiro/entities/banco.entity';
import { CnaeSeedService } from './cnae-seed.service';
import { BancoSeedService } from './banco-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cnae, Banco])],
  providers: [CnaeSeedService, BancoSeedService],
  exports: [CnaeSeedService, BancoSeedService],
})
export class SeedModule {}
