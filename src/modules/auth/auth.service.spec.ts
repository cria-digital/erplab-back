import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import {
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuarioRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUsuariosService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    incrementarTentativasLogin: jest.fn(),
    resetarTentativasLogin: jest.fn(),
    atualizarUltimoLogin: jest.fn(),
    registrarLogout: jest.fn(),
    create: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key) => {
      if (key === 'JWT_EXPIRES_IN') return '1d';
      if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
      return 'test-secret';
    }),
  };

  const mockEmailService = {
    sendPasswordResetEmail: jest.fn(),
    sendPasswordChangedNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('deve validar usuário com credenciais corretas', async () => {
      const email = 'test@example.com';
      const password = 'Test123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      const mockUser = {
        id: '1',
        email,
        senhaHash: hashedPassword,
        ativo: true,
        bloqueadoAte: null,
        tentativasLoginFalhas: 0,
        nomeCompleto: 'Test User',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(mockUsuariosService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUsuariosService.resetarTentativasLogin).toHaveBeenCalledWith(
        '1',
      );
    });

    it('deve lançar erro para usuário não encontrado', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('notfound@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar erro para usuário inativo', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senhaHash: 'hashedPassword',
        ativo: false,
        nomeCompleto: 'Test User',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar erro para usuário bloqueado', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senhaHash: 'hashedPassword',
        ativo: true,
        bloqueadoAte: new Date(Date.now() + 3600000), // Bloqueado por 1 hora
        nomeCompleto: 'Test User',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve incrementar tentativas de login com senha incorreta', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senhaHash: 'hashedPassword',
        ativo: true,
        bloqueadoAte: null,
        tentativasLoginFalhas: 2,
        nomeCompleto: 'Test User',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(
        mockUsuariosService.incrementarTentativasLogin,
      ).toHaveBeenCalledWith('1');
    });

    it('deve registrar tentativa falha com senha incorreta', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senhaHash: 'hashedPassword',
        ativo: true,
        bloqueadoAte: null,
        tentativasLoginFalhas: 4,
        nomeCompleto: 'Test User',
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(
        mockUsuariosService.incrementarTentativasLogin,
      ).toHaveBeenCalledWith('1');
    });
  });

  describe('login', () => {
    it('deve gerar tokens JWT válidos', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test123!',
      };

      const hashedPassword = await bcrypt.hash('Test123!', 10);
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        senhaHash: hashedPassword,
        ativo: true,
        bloqueadoAte: null,
        permissoes: [],
        fotoUrl: null,
      };

      const mockAccessToken = 'mock.access.token';
      const mockRefreshToken = 'mock.refresh.token';

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);
      mockUsuariosService.resetarTentativasLogin.mockResolvedValue(undefined);
      mockUsuariosService.atualizarUltimoLogin.mockResolvedValue(undefined);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        token_type: 'Bearer',
        expires_in: '1d',
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          nome: mockUser.nomeCompleto,
        }),
      });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockUsuariosService.atualizarUltimoLogin).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('refreshToken', () => {
    it('deve gerar novo access token com refresh token válido', async () => {
      const mockPayload = {
        sub: '1',
        email: 'test@example.com',
        tipo: 'refresh',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        ativo: true,
        bloqueadoAte: null,
      };

      const newAccessToken = 'new.access.token';

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsuariosService.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(newAccessToken);

      const refreshDto = { refresh_token: 'valid.refresh.token' };
      const result = await service.refreshToken(refreshDto);

      expect(result).toEqual({
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: '1d',
      });
    });

    it('deve lançar erro para refresh token inválido', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const refreshDto = { refresh_token: 'invalid.token' };
      await expect(service.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve lançar erro para usuário inativo no refresh', async () => {
      const mockPayload = {
        sub: '1',
        email: 'test@example.com',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        ativo: false, // Usuário inativo
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsuariosService.findOne.mockResolvedValue(mockUser);

      const refreshDto = { refresh_token: 'valid.refresh.token' };
      await expect(service.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('setup', () => {
    it('deve criar primeiro usuário do sistema', async () => {
      mockUsuariosService.findAll.mockResolvedValue({ total: 0, data: [] });

      const mockCreatedUser = {
        id: 'uuid',
        email: 'diegosoek@gmail.com',
        nomeCompleto: 'Diego Soek',
        ativo: true,
      };

      mockUsuariosService.create.mockResolvedValue(mockCreatedUser);

      const result = await service.setupInitialUser('Admin123!');

      expect(result).toEqual({
        message: 'Usuário inicial criado com sucesso',
        email: mockCreatedUser.email,
        nome: mockCreatedUser.nomeCompleto,
      });
      expect(mockUsuariosService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'diegosoek@gmail.com',
          nomeCompleto: 'Diego Soek',
          cargoFuncao: 'Administrador do Sistema',
          ativo: true,
        }),
        null,
      );
    });

    it('deve lançar erro se já existir usuário no sistema', async () => {
      mockUsuariosService.findAll.mockResolvedValue({ total: 1, data: [{}] });

      await expect(service.setupInitialUser('Admin123!')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('deve enviar email de recuperação de senha', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        resetPasswordToken: null,
        resetPasswordExpires: null,
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);
      mockUsuarioRepository.save.mockResolvedValue(mockUser);
      mockEmailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      await service.forgotPassword({ email: 'test@example.com' });

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          resetPasswordToken: expect.any(String),
          resetPasswordExpires: expect.any(Date),
        }),
      );
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Test User',
        expect.any(String),
      );
    });

    it('não deve retornar erro se email não existe', async () => {
      mockUsuariosService.findByEmail.mockResolvedValue(null);

      await expect(
        service.forgotPassword({ email: 'notfound@example.com' }),
      ).resolves.not.toThrow();

      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('deve remover token se falhar envio de email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        resetPasswordToken: null,
        resetPasswordExpires: null,
      };

      mockUsuariosService.findByEmail.mockResolvedValue(mockUser);
      mockUsuarioRepository.save.mockResolvedValue(mockUser);
      mockEmailService.sendPasswordResetEmail.mockRejectedValue(
        new Error('Email error'),
      );

      await expect(
        service.forgotPassword({ email: 'test@example.com' }),
      ).rejects.toThrow(BadRequestException);

      expect(mockUsuarioRepository.save).toHaveBeenLastCalledWith(
        expect.objectContaining({
          resetPasswordToken: null,
          resetPasswordExpires: null,
        }),
      );
    });
  });

  describe('resetPasswordWithToken', () => {
    it('deve resetar senha com token válido', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hora no futuro
        senhaHash: 'old-hash',
        resetarSenha: true,
        tentativasLoginFalhas: 3,
        bloqueadoAte: new Date(),
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      mockUsuarioRepository.save.mockResolvedValue(mockUser);
      mockEmailService.sendPasswordChangedNotification.mockResolvedValue(
        undefined,
      );

      await service.resetPasswordWithToken({
        token: 'valid-token',
        newPassword: 'NewPassword123!',
      });

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          senhaHash: expect.any(String),
          resetPasswordToken: null,
          resetPasswordExpires: null,
          resetarSenha: false,
          tentativasLoginFalhas: 0,
          bloqueadoAte: null,
        }),
      );
      expect(
        mockEmailService.sendPasswordChangedNotification,
      ).toHaveBeenCalledWith('test@example.com', 'Test User');
    });

    it('deve lançar erro para token inválido', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(
        service.resetPasswordWithToken({
          token: 'invalid-token',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro para token expirado', async () => {
      const mockUser = {
        id: '1',
        resetPasswordToken: 'expired-token',
        resetPasswordExpires: new Date(Date.now() - 3600000), // 1 hora no passado
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.resetPasswordWithToken({
          token: 'expired-token',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateResetToken', () => {
    it('deve retornar true para token válido', async () => {
      const mockUser = {
        id: '1',
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hora no futuro
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateResetToken('valid-token');

      expect(result).toBe(true);
    });

    it('deve retornar false para token não encontrado', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      const result = await service.validateResetToken('invalid-token');

      expect(result).toBe(false);
    });

    it('deve retornar false para token expirado', async () => {
      const mockUser = {
        id: '1',
        resetPasswordToken: 'expired-token',
        resetPasswordExpires: new Date(Date.now() - 3600000), // 1 hora no passado
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateResetToken('expired-token');

      expect(result).toBe(false);
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha com sucesso', async () => {
      const userId = '1';
      const currentPassword = 'CurrentPassword123!';
      const newPassword = 'NewPassword123!';
      const hashedCurrentPassword = await bcrypt.hash(currentPassword, 10);

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        senhaHash: hashedCurrentPassword,
        resetarSenha: true,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      mockUsuarioRepository.save.mockResolvedValue(mockUser);
      mockEmailService.sendPasswordChangedNotification.mockResolvedValue(
        undefined,
      );

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true)) // senha atual correta
        .mockImplementationOnce(() => Promise.resolve(false)); // nova senha diferente

      await service.changePassword(userId, {
        currentPassword,
        newPassword,
      });

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          senhaHash: expect.any(String),
          resetarSenha: false,
        }),
      );
      expect(
        mockEmailService.sendPasswordChangedNotification,
      ).toHaveBeenCalledWith('test@example.com', 'Test User');
    });

    it('deve lançar erro para senha atual incorreta', async () => {
      const userId = '1';
      const mockUser = {
        id: userId,
        senhaHash: 'hashed-password',
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.changePassword(userId, {
          currentPassword: 'wrong-password',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar erro se nova senha igual a atual', async () => {
      const userId = '1';
      const samePassword = 'SamePassword123!';
      const hashedPassword = await bcrypt.hash(samePassword, 10);

      const mockUser = {
        id: userId,
        senhaHash: hashedPassword,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true)); // ambas as comparações retornam true

      await expect(
        service.changePassword(userId, {
          currentPassword: samePassword,
          newPassword: samePassword,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar erro para usuário não encontrado', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(
        service.changePassword('invalid-id', {
          currentPassword: 'password',
          newPassword: 'newpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('deve retornar true para token válido', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: '1',
        email: 'test@example.com',
      });

      const result = await service.validateToken('valid-token');

      expect(result).toBe(true);
    });

    it('deve retornar false para token inválido', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await service.validateToken('invalid-token');

      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('deve registrar logout do usuário', async () => {
      mockUsuariosService.registrarLogout.mockResolvedValue(undefined);

      await service.logout('user-id');

      expect(mockUsuariosService.registrarLogout).toHaveBeenCalledWith(
        'user-id',
      );
    });
  });
});
