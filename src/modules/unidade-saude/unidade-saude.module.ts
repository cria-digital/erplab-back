import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadeSaudeService } from './unidade-saude.service';
import { UnidadeSaudeController } from './unidade-saude.controller';
import { UnidadeSaude } from './entities/unidade-saude.entity';
import { HorarioAtendimento } from './entities/horario-atendimento.entity';
import { DadoBancario } from './entities/dado-bancario.entity';
import { CnaeSecundario } from './entities/cnae-secundario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UnidadeSaude,
      HorarioAtendimento,
      DadoBancario,
      CnaeSecundario,
    ]),
  ],
  controllers: [UnidadeSaudeController],
  providers: [UnidadeSaudeService],
  exports: [UnidadeSaudeService],
})
export class UnidadeSaudeModule {}