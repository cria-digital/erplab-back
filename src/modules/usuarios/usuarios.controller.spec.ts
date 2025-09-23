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
});
