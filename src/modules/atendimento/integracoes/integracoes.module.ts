import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integracao } from './entities/integracao.entity';
import { IntegracoesService } from './integracoes.service';
import { IntegracoesController } from './integracoes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Integracao])],
  controllers: [IntegracoesController],
  providers: [IntegracoesService],
  exports: [IntegracoesService],
})
export class IntegracoesModule {}
