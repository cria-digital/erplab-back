import { Module } from '@nestjs/common';
import { OrizonTissModule } from './orizon/orizon-tiss.module';

/**
 * Módulo principal para integrações TISS
 *
 * Agrupa todos os sub-módulos de integrações TISS:
 * - Orizon
 * - (Futuras: Unimed, Bradesco Saúde, etc)
 */
@Module({
  imports: [OrizonTissModule],
  exports: [OrizonTissModule],
})
export class TissModule {}
