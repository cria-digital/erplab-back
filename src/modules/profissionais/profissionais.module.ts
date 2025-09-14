import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profissional } from './entities/profissional.entity';
import { DocumentoProfissional } from './entities/documento-profissional.entity';
import { ProfissionaisService } from './services/profissionais.service';
import { ProfissionaisController } from './controllers/profissionais.controller';
import { Endereco } from '../../comum/entities/endereco.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profissional, DocumentoProfissional, Endereco]),
  ],
  providers: [ProfissionaisService],
  controllers: [ProfissionaisController],
  exports: [ProfissionaisService],
})
export class ProfissionaisModule {}
