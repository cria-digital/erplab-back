import { Module } from '@nestjs/common';
import { SoapClientService } from './soap-client.service';

/**
 * Módulo para cliente SOAP genérico
 *
 * Fornece serviços base para consumo de webservices SOAP
 * Pode ser importado por outros módulos de integração
 */
@Module({
  providers: [SoapClientService],
  exports: [SoapClientService],
})
export class SoapModule {}
