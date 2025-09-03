import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAuditoria } from './entities/log-auditoria.entity';
import { HistoricoAlteracao } from './entities/historico-alteracao.entity';
import { AuditoriaService } from './services/auditoria.service';
import { AuditoriaController } from './controllers/auditoria.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LogAuditoria,
      HistoricoAlteracao,
    ]),
  ],
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}