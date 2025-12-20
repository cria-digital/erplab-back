import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbDiagnosticosService } from './db-diagnosticos.service';
import { DbDiagnosticosController } from './db-diagnosticos.controller';
import { DbDiagnosticosDadosService } from './db-diagnosticos-dados.service';
import { DbDiagnosticosDadosController } from './db-diagnosticos-dados.controller';
import { SoapModule } from '../../soap/soap.module';
import { IntegracoesModule } from '../../../atendimento/integracoes/integracoes.module';

/**
 * Módulo DB Diagnósticos
 *
 * Integração SOAP com o laboratório de apoio DB Diagnósticos.
 * Suporta multi-tenancy - busca credenciais do banco por tenant.
 *
 * Este módulo inclui duas APIs:
 *
 * 1. API Protocolo (dbsync) - DbDiagnosticosService
 *    - Envio de pedidos e recebimento de etiquetas
 *    - Consulta de status e resultados
 *    - Gerenciamento de pendências e recoletas
 *    - WSDL: wsmb.diagnosticosdobrasil.com.br/dbsync/wsrvProtocoloDBSync.dbsync.svc
 *
 * 2. API Dados DB (Guia de Exames) - DbDiagnosticosDadosService
 *    - Consulta de exames por nome
 *    - Informações detalhadas (preparo, prazo, material)
 *    - Configurações de exames e valores de referência
 *    - Download de máscaras de laudo
 *    - WSDL: wsmc.diagnosticosdobrasil.com.br/dadosdb/wsrvDadosDB.DADOSDB.svc
 *
 * Configuração no .env (fallback):
 * - DB_DIAGNOSTICOS_CODIGO_APOIADO - Código do laboratório apoiado (Protocolo)
 * - DB_DIAGNOSTICOS_SENHA - Senha de integração (Protocolo)
 * - DB_DIAGNOSTICOS_WSDL_URL - URL do WSDL Protocolo
 * - DB_DIAGNOSTICOS_TIMEOUT - Timeout das chamadas
 * - DB_DIAGNOSTICOS_DADOS_USUARIO - Usuário para API Dados DB
 * - DB_DIAGNOSTICOS_DADOS_SENHA - Senha para API Dados DB
 * - DB_DIAGNOSTICOS_DADOS_WSDL_URL - URL do WSDL Dados DB
 */
@Module({
  imports: [ConfigModule, SoapModule, IntegracoesModule],
  controllers: [DbDiagnosticosController, DbDiagnosticosDadosController],
  providers: [DbDiagnosticosService, DbDiagnosticosDadosService],
  exports: [DbDiagnosticosService, DbDiagnosticosDadosService],
})
export class DbDiagnosticosModule {}
