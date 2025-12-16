import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caixa, DespesaCaixa } from './entities';
import { CaixaService } from './services/caixa.service';
import { DespesaCaixaService } from './services/despesa-caixa.service';
import { CaixaController } from './controllers/caixa.controller';
import { DespesaCaixaController } from './controllers/despesa-caixa.controller';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caixa, DespesaCaixa, Tenant])],
  controllers: [CaixaController, DespesaCaixaController],
  providers: [CaixaService, DespesaCaixaService],
  exports: [CaixaService, DespesaCaixaService],
})
export class CaixaModule {}
