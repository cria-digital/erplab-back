import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imobilizado } from './entities/imobilizado.entity';
import { ImobilizadosService } from './services/imobilizados.service';
import { ImobilizadosController } from './controllers/imobilizados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Imobilizado])],
  controllers: [ImobilizadosController],
  providers: [ImobilizadosService],
  exports: [ImobilizadosService],
})
export class ImobilizadosModule {}
