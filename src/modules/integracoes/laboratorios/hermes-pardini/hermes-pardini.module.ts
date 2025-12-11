import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HermesPardiniService } from './hermes-pardini.service';
import { HermesPardiniController } from './hermes-pardini.controller';
import { SoapModule } from '../../soap/soap.module';

@Module({
  imports: [ConfigModule, SoapModule],
  controllers: [HermesPardiniController],
  providers: [HermesPardiniService],
  exports: [HermesPardiniService],
})
export class HermesPardiniModule {}
