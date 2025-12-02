import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadeSaudeService } from './unidade-saude.service';
import { UnidadeSaudeController } from './unidade-saude.controller';
import { UnidadeSaude } from './entities/unidade-saude.entity';
import { HorarioAtendimento } from './entities/horario-atendimento.entity';
import { CnaeSecundario } from './entities/cnae-secundario.entity';
import { ContaBancaria } from '../../financeiro/core/entities/conta-bancaria.entity';
import { ContaBancariaUnidade } from '../../financeiro/core/entities/conta-bancaria-unidade.entity';
import { Cnae } from '../../infraestrutura/common/entities/cnae.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UnidadeSaude,
      HorarioAtendimento,
      CnaeSecundario,
      ContaBancaria,
      ContaBancariaUnidade,
      Cnae,
    ]),
  ],
  controllers: [UnidadeSaudeController],
  providers: [UnidadeSaudeService],
  exports: [UnidadeSaudeService],
})
export class UnidadeSaudeModule {}
