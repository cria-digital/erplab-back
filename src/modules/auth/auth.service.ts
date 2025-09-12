import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Usuario> {
    const usuario = await this.usuariosService.findByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário inativo');
    }

    if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
      throw new UnauthorizedException('Usuário bloqueado temporariamente');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.senhaHash);

    if (!isPasswordValid) {
      await this.usuariosService.incrementarTentativasLogin(usuario.id);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.usuariosService.resetarTentativasLogin(usuario.id);
    return usuario;
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      nome: usuario.nomeCompleto,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    await this.usuariosService.atualizarUltimoLogin(usuario.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
      user: {
        id: usuario.id,
        nome: usuario.nomeCompleto,
        email: usuario.email,
        permissoes: usuario.permissoes,
        foto_url: usuario.fotoUrl,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refresh_token);

      const usuario = await this.usuariosService.findOne(payload.sub);

      if (
        !usuario ||
        !usuario.ativo ||
        (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date())
      ) {
        throw new UnauthorizedException('Token inválido');
      }

      const newPayload = {
        sub: usuario.id,
        email: usuario.email,
        nome: usuario.nomeCompleto,
      };

      const accessToken = this.jwtService.sign(newPayload);

      return {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  async logout(userId: string): Promise<void> {
    // Aqui você pode implementar blacklist de tokens se necessário
    // Por ora, apenas registra o logout
    await this.usuariosService.registrarLogout(userId);
  }

  async setupInitialUser(senha: string) {
    try {
      // Verifica se já existe algum usuário no sistema
      const usuarios = await this.usuariosService.findAll({ limit: 1 });

      if (usuarios.total > 0) {
        throw new ConflictException('Já existe usuário cadastrado no sistema');
      }
    } catch (error) {
      // Se der erro ao buscar (provavelmente tabela não existe), continua
      console.log('Criando primeiro usuário do sistema...');
    }

    // Cria o usuário inicial com email fixo
    const usuario = await this.usuariosService.create(
      {
        email: 'diegosoek@gmail.com',
        senha: senha,
        nomeCompleto: 'Diego Soek',
        cpf: '12345678901',
        telefone: '1133334444',
        celularWhatsapp: '11999998888',
        cargoFuncao: 'Administrador do Sistema',
        ativo: true,
        resetarSenha: false,
      },
      null,
    ); // Passa null para criadoPorId já que é o primeiro usuário

    return {
      message: 'Usuário inicial criado com sucesso',
      email: usuario.email,
      nome: usuario.nomeCompleto,
    };
  }
}
