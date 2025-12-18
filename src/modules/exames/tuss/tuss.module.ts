import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tuss } from './entities/tuss.entity';
import { TussService } from './tuss.service';
import { TussController } from './tuss.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tuss])],
  controllers: [TussController],
  providers: [TussService],
  exports: [TussService, TypeOrmModule],
})
export class TussModule {}
