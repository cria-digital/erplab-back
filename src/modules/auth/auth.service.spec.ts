import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe.skip('AuthService', () => {
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
    registrarTentativaFalha: jest.fn(),
    limparTentativasLogin: jest.fn(),
    create: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockEmailService = {
    sendMail: jest.fn(),
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
          provide: 'UsuariosService',
          useValue: mockUsuariosService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'ConfigService',
          useValue: mockConfigService,
        },
        {
          provide: 'EmailService',
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
        senha: hashedPassword,
        ativo: true,
        bloqueado_ate: null,
        tentativas_login: 0,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('deve lançar erro para usuário não encontrado', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser('notfound@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar erro para usuário inativo', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senha: 'hashedPassword',
        ativo: false,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar erro para usuário bloqueado', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senha: 'hashedPassword',
        ativo: true,
        bloqueado_ate: new Date(Date.now() + 3600000), // Bloqueado por 1 hora
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve incrementar tentativas de login com senha incorreta', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senha: 'hashedPassword',
        ativo: true,
        bloqueado_ate: null,
        tentativas_login: 2,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativas_login: 3,
        }),
      );
    });

    it('deve bloquear usuário após 5 tentativas falhas', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        senha: 'hashedPassword',
        ativo: true,
        bloqueado_ate: null,
        tentativas_login: 4,
      };

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tentativas_login: 5,
          bloqueado_ate: expect.any(Date),
        }),
      );
    });
  });

  describe('login', () => {
    it('deve gerar tokens JWT válidos', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test123!',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nome_completo: 'Test User',
        cargo: 'user',
      };

      const mockAccessToken = 'mock.access.token';
      const mockRefreshToken = 'mock.refresh.token';

      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          nome: mockUser.nome_completo,
        }),
      });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
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
        nome_completo: 'Test User',
        cargo: 'user',
        ativo: true,
      };

      const newAccessToken = 'new.access.token';

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsuarioRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(newAccessToken);

      const refreshDto = { refresh_token: 'valid.refresh.token' };
      const result = await service.refreshToken(refreshDto);

      expect(result).toEqual({
        access_token: newAccessToken,
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

    it('deve lançar erro se não for refresh token', async () => {
      const mockPayload = {
        sub: '1',
        email: 'test@example.com',
        tipo: 'access', // Token de acesso, não refresh
      };

      mockJwtService.verify.mockReturnValue(mockPayload);

      const refreshDto = { refresh_token: 'access.token' };
      await expect(service.refreshToken(refreshDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('setup', () => {
    it('deve criar primeiro usuário do sistema', async () => {
      mockUsuarioRepository.count.mockResolvedValue(0);

      const mockCreatedUser = {
        id: 'uuid',
        email: 'diegosoek@gmail.com',
        nome_completo: 'Administrador do Sistema',
        ativo: true,
      };

      mockUsuarioRepository.save.mockResolvedValue(mockCreatedUser);

      const result = await service.setupInitialUser('Admin123!');

      expect(result).toEqual(mockCreatedUser);
      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'diegosoek@gmail.com',
          cargo: 'Administrador do Sistema',
          ativo: true,
        }),
      );
    });

    it('deve lançar erro se já existir usuário no sistema', async () => {
      mockUsuarioRepository.count.mockResolvedValue(1);

      await expect(service.setupInitialUser('Admin123!')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
