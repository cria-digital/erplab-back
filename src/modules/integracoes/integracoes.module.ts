import { Module } from '@nestjs/common';
import { SoapModule } from './soap/soap.module';
import { TissModule } from './tiss/tiss.module';

/**
 * Módulo principal de integrações
 *
 * Agrupa todos os módulos de integração com sistemas externos:
 * - Cliente SOAP genérico
 * - Integrações TISS (Orizon, Unimed, etc)
 * - (Futuras: APIs REST, HL7, FHIR, etc)
 */
@Module({
  imports: [SoapModule, TissModule],
  exports: [SoapModule, TissModule],
})
export class IntegracoesModule {}
