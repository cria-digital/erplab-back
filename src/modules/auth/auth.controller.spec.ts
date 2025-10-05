import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    setupInitialUser: jest.fn(),
    forgotPassword: jest.fn(),
    resetPasswordWithToken: jest.fn(),
    changePassword: jest.fn(),
    logout: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test123!',
      };

      const expectedResponse = {
        access_token: 'mock.access.token',
        refresh_token: 'mock.refresh.token',
        user: {
          id: '123',
          email: loginDto.email,
          nome: 'Test User',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('deve lançar erro com credenciais inválidas', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Credenciais inválidas'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve lançar erro para usuário bloqueado', async () => {
      const loginDto = {
        email: 'blocked@example.com',
        password: 'Test123!',
      };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Usuário bloqueado temporariamente'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Usuário bloqueado temporariamente',
      );
    });
  });

  describe('refreshToken', () => {
    it('deve renovar access token com refresh token válido', async () => {
      const refreshDto = {
        refresh_token: 'valid.refresh.token',
      };

      const expectedResponse = {
        access_token: 'new.access.token',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(refreshDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshDto);
    });

    it('deve lançar erro com refresh token inválido', async () => {
      const refreshDto = {
        refresh_token: 'invalid.refresh.token',
      };

      mockAuthService.refreshToken.mockRejectedValue(
        new UnauthorizedException('Token inválido'),
      );

      await expect(controller.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('setup', () => {
    it('deve criar primeiro usuário do sistema', async () => {
      const setupDto = {
        senha: 'Admin123!',
      };

      const expectedUser = {
        id: 'uuid-123',
        email: 'diegosoek@gmail.com',
        nome_completo: 'Administrador do Sistema',
        cargo: 'Administrador do Sistema',
        ativo: true,
      };

      mockAuthService.setupInitialUser.mockResolvedValue(expectedUser);

      const result = await controller.setup(setupDto);

      expect(result).toEqual(expectedUser);
      expect(mockAuthService.setupInitialUser).toHaveBeenCalledWith(
        setupDto.senha,
      );
    });

    it('deve lançar erro se já existir usuário', async () => {
      const setupDto = {
        senha: 'Admin123!',
      };

      mockAuthService.setupInitialUser.mockRejectedValue(
        new Error('Sistema já possui usuários cadastrados'),
      );

      await expect(controller.setup(setupDto)).rejects.toThrow(
        'Sistema já possui usuários cadastrados',
      );
    });
  });

  describe('getProfile', () => {
    it('deve retornar dados do usuário autenticado', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        nome: 'Test User',
        tipo: 'user',
        permissoes: ['read', 'write'],
      };

      const result = await controller.getProfile(mockUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('deve fazer logout do usuário', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      mockAuthService.logout.mockResolvedValue(undefined);

      await controller.logout(mockUser);

      expect(mockAuthService.logout).toHaveBeenCalledWith('123');
    });
  });

  describe('validateToken', () => {
    it('deve validar token válido', async () => {
      const token = 'valid.jwt.token';

      mockAuthService.validateToken.mockResolvedValue(true);

      const result = await controller.validateToken(token);

      expect(result).toEqual({ valid: true });
      expect(mockAuthService.validateToken).toHaveBeenCalledWith(token);
    });

    it('deve retornar false para token inválido', async () => {
      const token = 'invalid.jwt.token';

      mockAuthService.validateToken.mockResolvedValue(false);

      const result = await controller.validateToken(token);

      expect(result).toEqual({ valid: false });
    });
  });

  describe('forgotPassword', () => {
    it('deve enviar email de recuperação de senha', async () => {
      const forgotDto = {
        email: 'test@example.com',
      };

      mockAuthService.forgotPassword.mockResolvedValue(undefined);

      const result = await controller.forgotPassword(forgotDto);

      expect(result).toEqual({
        message:
          'Se o email estiver cadastrado, você receberá um código de 6 dígitos para recuperação de senha.',
      });
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(forgotDto);
    });

    it('deve retornar sucesso mesmo se email não existir (segurança)', async () => {
      const forgotDto = {
        email: 'nonexistent@example.com',
      };

      mockAuthService.forgotPassword.mockResolvedValue(undefined);

      const result = await controller.forgotPassword(forgotDto);

      expect(result).toEqual({
        message:
          'Se o email estiver cadastrado, você receberá um código de 6 dígitos para recuperação de senha.',
      });
    });
  });

  describe('resetPassword', () => {
    it('deve resetar senha com token válido', async () => {
      const resetDto = {
        token: 'valid-reset-token',
        newPassword: 'NewPassword123!',
      };

      mockAuthService.resetPasswordWithToken.mockResolvedValue(undefined);

      const result = await controller.resetPassword(resetDto);

      expect(result).toEqual({
        message:
          'Senha alterada com sucesso. Você já pode fazer login com a nova senha.',
      });
      expect(mockAuthService.resetPasswordWithToken).toHaveBeenCalledWith(
        resetDto,
      );
    });

    it('deve lançar erro com token inválido', async () => {
      const resetDto = {
        token: 'invalid-token',
        newPassword: 'NewPassword123!',
      };

      mockAuthService.resetPasswordWithToken.mockRejectedValue(
        new UnauthorizedException('Token inválido ou expirado'),
      );

      await expect(controller.resetPassword(resetDto)).rejects.toThrow(
        'Token inválido ou expirado',
      );
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha com senha atual correta', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      const changeDto = {
        currentPassword: 'Current123!',
        newPassword: 'NewPassword123!',
      };

      mockAuthService.changePassword.mockResolvedValue({
        message: 'Senha alterada com sucesso',
      });

      const result = await controller.changePassword(mockUser, changeDto);

      expect(result).toEqual({
        message: 'Senha alterada com sucesso',
      });
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        '123',
        changeDto,
      );
    });

    it('deve lançar erro com senha atual incorreta', async () => {
      const mockUser = {
        id: '123',
      };

      const changeDto = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword123!',
      };

      mockAuthService.changePassword.mockRejectedValue(
        new UnauthorizedException('Senha atual incorreta'),
      );

      await expect(
        controller.changePassword(mockUser, changeDto),
      ).rejects.toThrow('Senha atual incorreta');
    });

    it('deve validar complexidade da nova senha', async () => {
      const mockUser = {
        id: '123',
      };

      const changeDto = {
        currentPassword: 'Current123!',
        newPassword: '123', // Senha fraca
      };

      mockAuthService.changePassword.mockRejectedValue(
        new Error(
          'A senha deve conter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais',
        ),
      );

      await expect(
        controller.changePassword(mockUser, changeDto),
      ).rejects.toThrow('A senha deve conter');
    });
  });
});
