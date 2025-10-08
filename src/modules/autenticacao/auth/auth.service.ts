import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { EmailService } from '../../infraestrutura/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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
      // Se for ConflictException, relança
      if (error instanceof ConflictException) {
        throw error;
      }
      // Se der outro erro ao buscar (provavelmente tabela não existe), continua
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

  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const usuario = await this.usuariosService.findByEmail(
      forgotPasswordDto.email,
    );

    // Não revela se o email existe ou não por segurança
    if (!usuario) {
      return;
    }

    // Gera token numérico de 6 dígitos
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date();
    resetExpires.setMinutes(resetExpires.getMinutes() + 30); // Token válido por 30 minutos

    // Salva token no usuário
    usuario.resetPasswordToken = resetToken;
    usuario.resetPasswordExpires = resetExpires;
    await this.usuariosRepository.save(usuario);

    // Envia email com token de recuperação
    try {
      await this.emailService.sendPasswordResetEmail(
        usuario.email,
        usuario.nomeCompleto,
        resetToken,
      );
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      // Remove token se falhar o envio do email
      usuario.resetPasswordToken = null;
      usuario.resetPasswordExpires = null;
      await this.usuariosRepository.save(usuario);
      throw new BadRequestException('Erro ao enviar email de recuperação');
    }
  }

  /**
   * Reseta a senha com o token de recuperação
   */
  async resetPasswordWithToken(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    const usuario = await this.usuariosRepository.findOne({
      where: {
        resetPasswordToken: resetPasswordDto.token,
      },
    });

    if (!usuario) {
      throw new BadRequestException('Token inválido');
    }

    if (usuario.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    // Atualiza a senha
    usuario.senhaHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;
    usuario.resetarSenha = false;
    usuario.tentativasLoginFalhas = 0;
    usuario.bloqueadoAte = null;

    await this.usuariosRepository.save(usuario);

    // Envia email de confirmação
    try {
      await this.emailService.sendPasswordChangedNotification(
        usuario.email,
        usuario.nomeCompleto,
      );
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      // Não falha a operação se o email de confirmação não for enviado
    }
  }

  /**
   * Valida se um token de recuperação é válido
   */
  async validateResetToken(token: string): Promise<boolean> {
    const usuario = await this.usuariosRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!usuario) {
      return false;
    }

    if (usuario.resetPasswordExpires < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Altera a senha do usuário autenticado
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verifica se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      usuario.senhaHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Verifica se a nova senha é diferente da atual
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      usuario.senhaHash,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual',
      );
    }

    // Atualiza a senha
    usuario.senhaHash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    usuario.resetarSenha = false;
    await this.usuariosRepository.save(usuario);

    // Envia email de confirmação
    try {
      await this.emailService.sendPasswordChangedNotification(
        usuario.email,
        usuario.nomeCompleto,
      );
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      // Não falha a operação se o email não for enviado
    }
  }
}
