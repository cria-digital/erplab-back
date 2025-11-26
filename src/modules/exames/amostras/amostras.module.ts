import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amostra } from './entities/amostra.entity';
import { LaboratorioAmostra } from './entities/laboratorio-amostra.entity';
import { AmostrasController } from './controllers/amostras.controller';
import { AmostrasService } from './services/amostras.service';

@Module({
  imports: [TypeOrmModule.forFeature([Amostra, LaboratorioAmostra])],
  controllers: [AmostrasController],
  providers: [AmostrasService],
  exports: [AmostrasService],
})
export class AmostrasModule {}
