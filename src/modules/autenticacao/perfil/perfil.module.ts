import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { PreferenciaUsuario } from './entities/preferencia-usuario.entity';
import { HistoricoSenha } from './entities/historico-senha.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuditoriaModule } from '../../infraestrutura/auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, PreferenciaUsuario, HistoricoSenha]),
    AuditoriaModule,
  ],
  controllers: [PerfilController],
  providers: [PerfilService],
  exports: [PerfilService],
})
export class PerfilModule {}
