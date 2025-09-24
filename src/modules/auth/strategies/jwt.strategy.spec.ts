import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn((key) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      return null;
    }),
  };

  const mockUsuariosService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('deve retornar dados do usuário quando válido', async () => {
      const payload = {
        sub: '1',
        email: 'test@example.com',
        nome: 'Test User',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        ativo: true,
        bloqueadoAte: null,
        permissoes: ['read', 'write'],
      };

      mockUsuariosService.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        nome: mockUser.nomeCompleto,
        permissoes: mockUser.permissoes,
      });
      expect(mockUsuariosService.findOne).toHaveBeenCalledWith('1');
    });

    it('deve lançar erro quando usuário não encontrado', async () => {
      const payload = {
        sub: 'invalid-id',
        email: 'test@example.com',
      };

      mockUsuariosService.findOne.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Usuário não encontrado'),
      );
    });

    it('deve lançar erro quando usuário inativo', async () => {
      const payload = {
        sub: '1',
        email: 'test@example.com',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        ativo: false,
        bloqueadoAte: null,
      };

      mockUsuariosService.findOne.mockResolvedValue(mockUser);

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Usuário inativo'),
      );
    });

    it('deve lançar erro quando usuário bloqueado', async () => {
      const payload = {
        sub: '1',
        email: 'test@example.com',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        ativo: true,
        bloqueadoAte: new Date(Date.now() + 3600000), // 1 hora no futuro
      };

      mockUsuariosService.findOne.mockResolvedValue(mockUser);

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Usuário bloqueado temporariamente'),
      );
    });

    it('deve permitir usuário com bloqueio expirado', async () => {
      const payload = {
        sub: '1',
        email: 'test@example.com',
      };

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        nomeCompleto: 'Test User',
        ativo: true,
        bloqueadoAte: new Date(Date.now() - 3600000), // 1 hora no passado
        permissoes: [],
      };

      mockUsuariosService.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        nome: mockUser.nomeCompleto,
        permissoes: mockUser.permissoes,
      });
    });
  });

  describe('constructor', () => {
    it('deve ser configurado com JWT secret do ConfigService', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
