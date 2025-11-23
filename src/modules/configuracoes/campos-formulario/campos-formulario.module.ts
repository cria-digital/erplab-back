import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity
import { ConfiguracaoCampoFormulario } from './entities/configuracao-campo-formulario.entity';

// Service
import { ConfiguracaoCampoService } from './services/configuracao-campo.service';

// Controller
import { ConfiguracaoCampoController } from './controllers/configuracao-campo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracaoCampoFormulario])],
  providers: [ConfiguracaoCampoService],
  controllers: [ConfiguracaoCampoController],
  exports: [ConfiguracaoCampoService],
})
export class CamposFormularioModule {}
