import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amb } from './entities/amb.entity';
import { AmbService } from './amb.service';
import { AmbController } from './amb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Amb])],
  controllers: [AmbController],
  providers: [AmbService],
  exports: [AmbService, TypeOrmModule],
})
export class AmbModule {}
