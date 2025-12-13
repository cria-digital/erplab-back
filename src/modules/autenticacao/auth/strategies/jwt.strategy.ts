import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const usuario = await this.usuariosService.findOne(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário inativo');
    }

    if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
      throw new UnauthorizedException('Usuário bloqueado temporariamente');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nomeCompleto,
      permissoes: usuario.permissoes,
      tenantId: usuario.tenantId,
      isSuperAdmin: usuario.isSuperAdmin,
    };
  }
}
