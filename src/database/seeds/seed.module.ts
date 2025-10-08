import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cnae } from '../../modules/infraestrutura/common/entities/cnae.entity';
import { Banco } from '../../modules/financeiro/core/entities/banco.entity';
import { CnaeSeedService } from './cnae-seed.service';
import { BancoSeedService } from './banco-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cnae, Banco])],
  providers: [CnaeSeedService, BancoSeedService],
  exports: [CnaeSeedService, BancoSeedService],
})
export class SeedModule {}
