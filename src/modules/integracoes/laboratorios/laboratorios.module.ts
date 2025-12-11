import { Module } from '@nestjs/common';
import { HermesPardiniModule } from './hermes-pardini/hermes-pardini.module';
import { DbDiagnosticosModule } from './db-diagnosticos/db-diagnosticos.module';

/**
 * Módulo agregador de integrações com laboratórios de apoio
 *
 * Laboratórios disponíveis:
 * - Hermes Pardini (Lab-to-Lab)
 * - DB Diagnósticos (DBSync v2.0)
 */
@Module({
  imports: [HermesPardiniModule, DbDiagnosticosModule],
  exports: [HermesPardiniModule, DbDiagnosticosModule],
})
export class LaboratoriosModule {}
