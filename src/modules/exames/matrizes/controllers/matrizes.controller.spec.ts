import { Test, TestingModule } from '@nestjs/testing';
import { MatrizesController } from './matrizes.controller';
import { MatrizesService } from '../services/matrizes.service';
import { MatrizExame } from '../entities/matriz-exame.entity';
import { CreateMatrizDto } from '../dto/create-matriz.dto';
import { UpdateMatrizDto } from '../dto/update-matriz.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('MatrizesController', () => {
  let controller: MatrizesController;
  let _service: MatrizesService;

  const mockMatrizesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findByTipoExame: jest.fn(),
    findAtivas: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    duplicate: jest.fn(),
    getStats: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-uuid',
      email: 'test@example.com',
    },
  };

  const mockMatriz: Partial<MatrizExame> = {
    id: 'matriz-uuid',
    codigoInterno: 'HEM123',
    nome: 'Hemograma 1',
    tipoExameId: 'tipo-exame-uuid',
    exameId: 'exame-uuid',
    ativo: true,
    campos: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatrizesController],
      providers: [
        {
          provide: MatrizesService,
          useValue: mockMatrizesService,
        },
      ],
    }).compile();

    controller = module.get<MatrizesController>(MatrizesController);
    _service = module.get<MatrizesService>(MatrizesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createMatrizDto: CreateMatrizDto = {
      codigoInterno: 'HEM123',
      nome: 'Hemograma 1',
      tipoExameId: 'tipo-exame-uuid',
      exameId: 'exame-uuid',
      campos: [],
    };

    it('deve criar uma matriz com sucesso', async () => {
      mockMatrizesService.create.mockResolvedValue(mockMatriz);

      const result = await controller.create(createMatrizDto, mockRequest);

      expect(result).toEqual(mockMatriz);
      expect(mockMatrizesService.create).toHaveBeenCalledWith(
        createMatrizDto,
        mockRequest.user.id,
      );
    });

    it('deve lançar ConflictException quando código já existe', async () => {
      mockMatrizesService.create.mockRejectedValue(
        new ConflictException('Código já existe'),
      );

      await expect(
        controller.create(createMatrizDto, mockRequest),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de matrizes', async () => {
      const paginatedResult = {
        data: [mockMatriz],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockMatrizesService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll();

      expect(result).toEqual(paginatedResult);
      expect(mockMatrizesService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        undefined,
      );
    });

    it('deve filtrar por parâmetros', async () => {
      const paginatedResult = {
        data: [mockMatriz],
        total: 1,
        page: 2,
        limit: 20,
        totalPages: 1,
      };
      mockMatrizesService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll(2, 20, 'Hemograma', 'tipo-exame-uuid', true);

      expect(mockMatrizesService.findAll).toHaveBeenCalledWith(
        2,
        20,
        'Hemograma',
        'tipo-exame-uuid',
        true,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar uma matriz por ID', async () => {
      mockMatrizesService.findOne.mockResolvedValue(mockMatriz);

      const result = await controller.findOne('matriz-uuid');

      expect(result).toEqual(mockMatriz);
      expect(mockMatrizesService.findOne).toHaveBeenCalledWith('matriz-uuid');
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      mockMatrizesService.findOne.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar matriz por código interno', async () => {
      mockMatrizesService.findByCodigo.mockResolvedValue(mockMatriz);

      const result = await controller.findByCodigo('HEM123');

      expect(result).toEqual(mockMatriz);
      expect(mockMatrizesService.findByCodigo).toHaveBeenCalledWith('HEM123');
    });
  });

  describe('findByTipoExame', () => {
    it('deve retornar matrizes por tipo de exame', async () => {
      mockMatrizesService.findByTipoExame.mockResolvedValue([mockMatriz]);

      const result = await controller.findByTipoExame('tipo-exame-uuid');

      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizesService.findByTipoExame).toHaveBeenCalledWith(
        'tipo-exame-uuid',
      );
    });
  });

  describe('findAtivas', () => {
    it('deve retornar matrizes ativas', async () => {
      mockMatrizesService.findAtivas.mockResolvedValue([mockMatriz]);

      const result = await controller.findAtivas();

      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizesService.findAtivas).toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas', async () => {
      const stats = {
        total: 50,
        ativas: 40,
        inativas: 10,
        porTipoExame: {
          'tipo-1': 20,
          'tipo-2': 15,
        },
      };
      mockMatrizesService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toEqual(stats);
      expect(mockMatrizesService.getStats).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateMatrizDto: UpdateMatrizDto = {
      nome: 'Hemograma 1 Atualizado',
    };

    it('deve atualizar uma matriz com sucesso', async () => {
      const updatedMatriz = { ...mockMatriz, ...updateMatrizDto };
      mockMatrizesService.update.mockResolvedValue(updatedMatriz);

      const result = await controller.update(
        'matriz-uuid',
        updateMatrizDto,
        mockRequest,
      );

      expect(result).toEqual(updatedMatriz);
      expect(mockMatrizesService.update).toHaveBeenCalledWith(
        'matriz-uuid',
        updateMatrizDto,
        mockRequest.user.id,
      );
    });
  });

  describe('remove', () => {
    it('deve remover uma matriz com sucesso', async () => {
      mockMatrizesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('matriz-uuid', mockRequest);

      expect(result).toBeUndefined();
      expect(mockMatrizesService.remove).toHaveBeenCalledWith(
        'matriz-uuid',
        mockRequest.user.id,
      );
    });
  });

  describe('activate', () => {
    it('deve ativar uma matriz com sucesso', async () => {
      const matrizAtivada = { ...mockMatriz, ativo: true };
      mockMatrizesService.activate.mockResolvedValue(matrizAtivada);

      const result = await controller.activate('matriz-uuid', mockRequest);

      expect(result).toEqual(matrizAtivada);
      expect(mockMatrizesService.activate).toHaveBeenCalledWith(
        'matriz-uuid',
        mockRequest.user.id,
      );
    });
  });

  describe('deactivate', () => {
    it('deve desativar uma matriz com sucesso', async () => {
      const matrizDesativada = { ...mockMatriz, ativo: false };
      mockMatrizesService.deactivate.mockResolvedValue(matrizDesativada);

      const result = await controller.deactivate('matriz-uuid', mockRequest);

      expect(result).toEqual(matrizDesativada);
      expect(mockMatrizesService.deactivate).toHaveBeenCalledWith(
        'matriz-uuid',
        mockRequest.user.id,
      );
    });
  });

  describe('duplicate', () => {
    const novoCodigoInterno = 'HEM124';
    const novoNome = 'Hemograma 1 - Cópia';

    it('deve duplicar uma matriz com sucesso', async () => {
      const matrizDuplicada = {
        ...mockMatriz,
        id: 'nova-matriz-uuid',
        codigoInterno: novoCodigoInterno,
        nome: novoNome,
      };
      mockMatrizesService.duplicate.mockResolvedValue(matrizDuplicada);

      const result = await controller.duplicate(
        'matriz-uuid',
        novoCodigoInterno,
        novoNome,
        mockRequest,
      );

      expect(result).toEqual(matrizDuplicada);
      expect(mockMatrizesService.duplicate).toHaveBeenCalledWith(
        'matriz-uuid',
        novoCodigoInterno,
        novoNome,
        mockRequest.user.id,
      );
    });

    it('deve lançar ConflictException quando novo código já existe', async () => {
      mockMatrizesService.duplicate.mockRejectedValue(
        new ConflictException('Código já existe'),
      );

      await expect(
        controller.duplicate(
          'matriz-uuid',
          novoCodigoInterno,
          novoNome,
          mockRequest,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });
});
