import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Telemedicina, TelemedicinaExame } from './entities';
import { Empresa } from '../empresas/entities/empresa.entity';
import { Exame } from '../exames/entities/exame.entity';

// Services
import { TelemedicinaService } from './services/telemedicina.service';
import { TelemedicinaExameService } from './services/telemedicina-exame.service';

// Controllers
import { TelemedicinaController } from './controllers/telemedicina.controller';
import { TelemedicinaExameController } from './controllers/telemedicina-exame.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Telemedicina, TelemedicinaExame, Empresa, Exame]),
  ],
  providers: [TelemedicinaService, TelemedicinaExameService],
  controllers: [TelemedicinaController, TelemedicinaExameController],
  exports: [TelemedicinaService, TelemedicinaExameService],
})
export class TelemedicinaModule {}
