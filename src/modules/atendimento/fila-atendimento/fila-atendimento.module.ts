import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenhaAtendimento } from './entities/senha-atendimento.entity';
import { FilaAtendimentoService } from './services/fila-atendimento.service';
import { FilaAtendimentoController } from './controllers/fila-atendimento.controller';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Paciente } from '../../cadastros/pacientes/entities/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SenhaAtendimento, Tenant, Paciente])],
  controllers: [FilaAtendimentoController],
  providers: [FilaAtendimentoService],
  exports: [FilaAtendimentoService],
})
export class FilaAtendimentoModule {}
