import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbDiagnosticosService } from './db-diagnosticos.service';
import { DbDiagnosticosController } from './db-diagnosticos.controller';
import { SoapModule } from '../../soap/soap.module';

@Module({
  imports: [ConfigModule, SoapModule],
  controllers: [DbDiagnosticosController],
  providers: [DbDiagnosticosService],
  exports: [DbDiagnosticosService],
})
export class DbDiagnosticosModule {}
