import { Module } from '@nestjs/common';
import { HermesPardiniModule } from './hermes-pardini/hermes-pardini.module';

/**
 * Módulo agregador de integrações com laboratórios de apoio
 *
 * Laboratórios disponíveis:
 * - Hermes Pardini (Lab-to-Lab)
 * - DB Diagnósticos (futuro)
 */
@Module({
  imports: [HermesPardiniModule],
  exports: [HermesPardiniModule],
})
export class LaboratoriosModule {}
