import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadeSaudeService } from './unidade-saude.service';
import { UnidadeSaudeController } from './unidade-saude.controller';
import { UnidadeSaude } from './entities/unidade-saude.entity';
import { HorarioAtendimento } from './entities/horario-atendimento.entity';
import { CnaeSecundario } from './entities/cnae-secundario.entity';
import { Banco } from '../../financeiro/core/entities/banco.entity';
import { ContaBancaria } from '../../financeiro/core/entities/conta-bancaria.entity';
import { ContaBancariaUnidade } from '../../financeiro/core/entities/conta-bancaria-unidade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UnidadeSaude,
      HorarioAtendimento,
      CnaeSecundario,
      Banco,
      ContaBancaria,
      ContaBancariaUnidade,
    ]),
  ],
  controllers: [UnidadeSaudeController],
  providers: [UnidadeSaudeService],
  exports: [UnidadeSaudeService],
})
export class UnidadeSaudeModule {}
