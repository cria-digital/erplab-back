import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Fornecedor, FornecedorInsumo } from './entities';
import { Empresa } from '../empresas/entities/empresa.entity';

// Services
import { FornecedorService } from './services/fornecedor.service';
import { FornecedorInsumoService } from './services/fornecedor-insumo.service';

// Controllers
import { FornecedorController } from './controllers/fornecedor.controller';
import { FornecedorInsumoController } from './controllers/fornecedor-insumo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fornecedor, FornecedorInsumo, Empresa])],
  providers: [FornecedorService, FornecedorInsumoService],
  controllers: [FornecedorController, FornecedorInsumoController],
  exports: [FornecedorService, FornecedorInsumoService],
})
export class FornecedoresModule {}
