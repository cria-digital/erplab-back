import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoapModule } from '../../soap/soap.module';
import { OrizonTissService } from './orizon-tiss.service';
import { OrizonTissController } from './orizon-tiss.controller';

/**
 * Módulo de integração TISS com Orizon
 *
 * Fornece serviços para consumo dos webservices SOAP da Orizon:
 * - Lote de guias
 * - Status de protocolo
 * - Geração de PDF
 * - Cancelamento de guias
 * - Demonstrativos
 * - Recursos de glosa
 * - Envio de documentos
 */
@Module({
  imports: [ConfigModule, SoapModule],
  controllers: [OrizonTissController],
  providers: [OrizonTissService],
  exports: [OrizonTissService],
})
export class OrizonTissModule {}
