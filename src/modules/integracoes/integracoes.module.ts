import { Module } from '@nestjs/common';
import { SoapModule } from './soap/soap.module';
import { TissModule } from './tiss/tiss.module';
import { LaboratoriosModule } from './laboratorios/laboratorios.module';

/**
 * Módulo principal de integrações
 *
 * Agrupa todos os módulos de integração com sistemas externos:
 * - Cliente SOAP genérico
 * - Integrações TISS (Orizon, Unimed, etc)
 * - Laboratórios de Apoio (Hermes Pardini, DB Diagnósticos, etc)
 * - (Futuras: APIs REST, HL7, FHIR, etc)
 */
@Module({
  imports: [SoapModule, TissModule, LaboratoriosModule],
  exports: [SoapModule, TissModule, LaboratoriosModule],
})
export class IntegracoesModule {}
