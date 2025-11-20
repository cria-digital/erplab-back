import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integracao } from './entities/integracao.entity';
import { IntegracoesService } from './integracoes.service';
import { IntegracoesController } from './integracoes.controller';
import { HermesPardiniService } from './services/hermes-pardini.service';
import { HermesPardiniController } from './controllers/hermes-pardini.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Integracao])],
  controllers: [IntegracoesController, HermesPardiniController],
  providers: [IntegracoesService, HermesPardiniService],
  exports: [IntegracoesService, HermesPardiniService],
})
export class IntegracoesModule {}
