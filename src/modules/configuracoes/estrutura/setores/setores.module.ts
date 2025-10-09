import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setor } from './entities/setor.entity';
import { SetoresService } from './services/setores.service';
import { SetoresController } from './controllers/setores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Setor])],
  controllers: [SetoresController],
  providers: [SetoresService],
  exports: [SetoresService],
})
export class SetoresModule {}
