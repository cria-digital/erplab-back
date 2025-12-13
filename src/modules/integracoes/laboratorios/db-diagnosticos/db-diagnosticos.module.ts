import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbDiagnosticosService } from './db-diagnosticos.service';
import { DbDiagnosticosController } from './db-diagnosticos.controller';
import { SoapModule } from '../../soap/soap.module';
import { IntegracoesModule } from '../../../atendimento/integracoes/integracoes.module';

/**
 * Módulo DB Diagnósticos
 *
 * Integração SOAP com o laboratório de apoio DB Diagnósticos.
 * Suporta multi-tenancy - busca credenciais do banco por tenant.
 *
 * Se não houver tenant ou configuração no banco, usa fallback do .env:
 * - DB_DIAGNOSTICOS_CODIGO_APOIADO
 * - DB_DIAGNOSTICOS_SENHA
 * - DB_DIAGNOSTICOS_WSDL_URL
 * - DB_DIAGNOSTICOS_TIMEOUT
 */
@Module({
  imports: [ConfigModule, SoapModule, IntegracoesModule],
  controllers: [DbDiagnosticosController],
  providers: [DbDiagnosticosService],
  exports: [DbDiagnosticosService],
})
export class DbDiagnosticosModule {}
