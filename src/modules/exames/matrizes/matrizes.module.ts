import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatrizExame } from './entities/matriz-exame.entity';
import { CampoMatriz } from './entities/campo-matriz.entity';
import { MatrizesService } from './services/matrizes.service';
import { MatrizesController } from './controllers/matrizes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MatrizExame, CampoMatriz])],
  controllers: [MatrizesController],
  providers: [MatrizesService],
  exports: [MatrizesService],
})
export class MatrizesModule {}
