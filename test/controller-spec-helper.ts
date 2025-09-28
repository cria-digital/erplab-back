import { Test, TestingModule } from '@nestjs/testing';

// Helper para criar testes básicos de controllers
export function createControllerSpec(
  ControllerClass: any,
  ServiceClass: any,
  controllerName: string,
  serviceName: string,
  mockServiceMethods: Record<string, jest.Mock> = {},
) {
  describe(`${controllerName}`, () => {
    let controller: any;
    let service: any;

    const defaultMockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      ...mockServiceMethods,
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ControllerClass],
        providers: [
          {
            provide: ServiceClass,
            useValue: defaultMockService,
          },
        ],
      }).compile();

      controller = module.get(ControllerClass);
      service = module.get(ServiceClass);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve ser definido', () => {
      expect(controller).toBeDefined();
    });

    it('deve ter o service injetado', () => {
      expect(service).toBeDefined();
    });

    // Testes genéricos para métodos CRUD padrão
    describe('create', () => {
      it('deve criar um novo registro', async () => {
        if (controller.create) {
          const dto = { nome: 'Teste' };
          const result = { id: 'uuid', ...dto };
          service.create.mockResolvedValue(result);

          expect(await controller.create(dto)).toBe(result);
          expect(service.create).toHaveBeenCalledWith(dto);
        }
      });
    });

    describe('findAll', () => {
      it('deve retornar lista de registros', async () => {
        if (controller.findAll) {
          const result = [{ id: 'uuid-1' }, { id: 'uuid-2' }];
          service.findAll.mockResolvedValue(result);

          expect(await controller.findAll()).toBe(result);
          expect(service.findAll).toHaveBeenCalled();
        }
      });
    });

    describe('findOne', () => {
      it('deve retornar um registro por id', async () => {
        if (controller.findOne) {
          const result = { id: 'uuid-123', nome: 'Teste' };
          service.findOne.mockResolvedValue(result);

          expect(await controller.findOne('uuid-123')).toBe(result);
          expect(service.findOne).toHaveBeenCalledWith('uuid-123');
        }
      });
    });

    describe('update', () => {
      it('deve atualizar um registro', async () => {
        if (controller.update) {
          const dto = { nome: 'Atualizado' };
          const result = { id: 'uuid-123', ...dto };
          service.update.mockResolvedValue(result);

          expect(await controller.update('uuid-123', dto)).toBe(result);
          expect(service.update).toHaveBeenCalledWith('uuid-123', dto);
        }
      });
    });

    describe('remove', () => {
      it('deve remover um registro', async () => {
        if (controller.remove) {
          service.remove.mockResolvedValue(undefined);

          expect(await controller.remove('uuid-123')).toBeUndefined();
          expect(service.remove).toHaveBeenCalledWith('uuid-123');
        }
      });
    });
  });
}

// Helper específico para controllers com autenticação
export function createAuthenticatedControllerSpec(
  ControllerClass: any,
  ServiceClass: any,
  controllerName: string,
  serviceName: string,
  mockServiceMethods: Record<string, jest.Mock> = {},
) {
  describe(`${controllerName}`, () => {
    let controller: any;
    let service: any;

    const mockUser = {
      id: 'user-uuid',
      email: 'test@example.com',
      nomeCompleto: 'Test User',
    };

    const defaultMockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      ...mockServiceMethods,
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ControllerClass],
        providers: [
          {
            provide: ServiceClass,
            useValue: defaultMockService,
          },
        ],
      }).compile();

      controller = module.get(ControllerClass);
      service = module.get(ServiceClass);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('deve ser definido', () => {
      expect(controller).toBeDefined();
    });

    describe('create', () => {
      it('deve criar com usuário autenticado', async () => {
        if (controller.create) {
          const dto = { nome: 'Teste' };
          const result = { id: 'uuid', ...dto };
          service.create.mockResolvedValue(result);

          const req = { user: mockUser };
          expect(await controller.create(dto, req)).toBe(result);
          expect(service.create).toHaveBeenCalledWith(dto, mockUser.id);
        }
      });
    });

    describe('update', () => {
      it('deve atualizar com usuário autenticado', async () => {
        if (controller.update) {
          const dto = { nome: 'Atualizado' };
          const result = { id: 'uuid-123', ...dto };
          service.update.mockResolvedValue(result);

          const req = { user: mockUser };
          expect(await controller.update('uuid-123', dto, req)).toBe(result);
          expect(service.update).toHaveBeenCalledWith(
            'uuid-123',
            dto,
            mockUser.id,
          );
        }
      });
    });

    describe('remove', () => {
      it('deve remover com usuário autenticado', async () => {
        if (controller.remove) {
          service.remove.mockResolvedValue(undefined);

          const req = { user: mockUser };
          expect(await controller.remove('uuid-123', req)).toBeUndefined();
          expect(service.remove).toHaveBeenCalledWith('uuid-123', mockUser.id);
        }
      });
    });
  });
}
