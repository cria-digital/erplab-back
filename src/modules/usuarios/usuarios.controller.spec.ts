import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
    changePassword: jest.fn(),
    findByEmail: jest.fn(),
    activate: jest.fn(),
    block: jest.fn(),
    unblock: jest.fn(),
    resetPassword: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-uuid-123',
      email: 'admin@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      const dto = {
        nomeCompleto: 'Test User',
        email: 'test@example.com',
        cpf: '123.456.789-00',
        senha: 'Password123!',
        cargo: 'Tester',
      };
      const expected = { id: '123', ...dto };

      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto, mockRequest as any);

      expect(result).toEqual({
        message: 'Usuário criado com sucesso',
        data: expected,
      });
      expect(mockService.create).toHaveBeenCalledWith(dto, 'user-uuid-123');
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const query = { page: 1, limit: 10 };
      const expected = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(result).toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      const id = '123';
      const expected = {
        id,
        nomeCompleto: 'Test User',
        email: 'test@example.com',
      };

      mockService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(id);

      expect(result).toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const id = '123';
      const dto = { nomeCompleto: 'Updated User' };
      const expected = { id, ...dto };

      mockService.update.mockResolvedValue(expected);

      const result = await controller.update(id, dto, mockRequest as any);

      expect(result).toEqual({
        message: 'Usuário atualizado com sucesso',
        data: expected,
      });
      expect(mockService.update).toHaveBeenCalledWith(id, dto, 'user-uuid-123');
    });
  });

  describe('remove', () => {
    it('should remove an entity', async () => {
      const id = '123';

      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id, mockRequest as any);

      expect(result).toEqual({
        message: 'Usuário removido com sucesso',
      });
      expect(mockService.remove).toHaveBeenCalledWith(id, 'user-uuid-123');
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas dos usuários', async () => {
      const expected = {
        total: 100,
        ativos: 80,
        inativos: 20,
        bloqueados: 5,
        com2FA: 15,
      };

      mockService.getStats.mockResolvedValue(expected);

      const result = await controller.getStats();

      expect(result).toEqual(expected);
      expect(mockService.getStats).toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('deve retornar dados do usuário autenticado', async () => {
      const expected = {
        id: 'user-uuid-123',
        email: 'admin@example.com',
        nomeCompleto: 'Admin User',
      };

      mockService.findOne.mockResolvedValue(expected);

      const result = await controller.getMe(mockRequest as any);

      expect(result).toEqual(expected);
      expect(mockService.findOne).toHaveBeenCalledWith('user-uuid-123');
    });
  });

  describe('activate', () => {
    it('deve ativar um usuário', async () => {
      const id = '123';
      const expected = {
        id,
        ativo: true,
        nomeCompleto: 'Test User',
      };

      mockService.activate.mockResolvedValue(expected);

      const result = await controller.activate(id, mockRequest as any);

      expect(result).toEqual({
        message: 'Usuário ativado com sucesso',
        data: expected,
      });
      expect(mockService.activate).toHaveBeenCalledWith(id, 'user-uuid-123');
    });
  });

  describe('block', () => {
    it('deve bloquear um usuário por tempo determinado', async () => {
      const id = '123';
      const minutos = 30;
      const expected = {
        id,
        bloqueadoAte: new Date(),
        nomeCompleto: 'Test User',
      };

      mockService.block.mockResolvedValue(expected);

      const result = await controller.block(id, minutos, mockRequest as any);

      expect(result).toEqual({
        message: 'Usuário bloqueado com sucesso',
        data: expected,
      });
      expect(mockService.block).toHaveBeenCalledWith(
        id,
        minutos,
        'user-uuid-123',
      );
    });
  });

  describe('unblock', () => {
    it('deve desbloquear um usuário', async () => {
      const id = '123';
      const expected = {
        id,
        bloqueadoAte: null,
        nomeCompleto: 'Test User',
      };

      mockService.unblock.mockResolvedValue(expected);

      const result = await controller.unblock(id, mockRequest as any);

      expect(result).toEqual({
        message: 'Usuário desbloqueado com sucesso',
        data: expected,
      });
      expect(mockService.unblock).toHaveBeenCalledWith(id, 'user-uuid-123');
    });
  });

  describe('changePassword', () => {
    it('deve alterar senha do usuário autenticado', async () => {
      const changePasswordDto = {
        senhaAtual: 'SenhaAtual123!',
        novaSenha: 'NovaSenha123!',
        confirmacaoSenha: 'NovaSenha123!',
      };

      mockService.changePassword.mockResolvedValue(undefined);

      const result = await controller.changePassword(
        changePasswordDto,
        mockRequest as any,
      );

      expect(result).toEqual({
        message: 'Senha alterada com sucesso',
      });
      expect(mockService.changePassword).toHaveBeenCalledWith(
        'user-uuid-123',
        changePasswordDto,
      );
    });
  });

  describe('resetPassword', () => {
    it('deve resetar senha de um usuário', async () => {
      const id = '123';
      const novaSenha = 'NovaTemporaria123!';

      mockService.resetPassword.mockResolvedValue(undefined);

      const result = await controller.resetPassword(
        id,
        novaSenha,
        mockRequest as any,
      );

      expect(result).toEqual({
        message:
          'Senha resetada com sucesso. O usuário deverá alterar a senha no próximo login.',
      });
      expect(mockService.resetPassword).toHaveBeenCalledWith(
        id,
        novaSenha,
        'user-uuid-123',
      );
    });
  });
});
