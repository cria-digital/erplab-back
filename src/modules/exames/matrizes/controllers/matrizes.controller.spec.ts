import { Test, TestingModule } from '@nestjs/testing';
import { MatrizesController } from './matrizes.controller';
import { MatrizesService } from '../services/matrizes.service';
import {
  TipoMatriz,
  StatusMatriz,
  MatrizExame,
} from '../entities/matriz-exame.entity';
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
    findByTipo: jest.fn(),
    findPadrao: jest.fn(),
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
    codigoInterno: 'MTZ-AUDIO-001',
    nome: 'Audiometria Tonal',
    descricao: 'Matriz padrão para audiometria tonal',
    tipoMatriz: TipoMatriz.AUDIOMETRIA,
    versao: '1.0',
    padraoSistema: false,
    status: StatusMatriz.ATIVO,
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
      codigoInterno: 'MTZ-AUDIO-001',
      nome: 'Audiometria Tonal',
      descricao: 'Matriz padrão para audiometria tonal',
      tipoMatriz: TipoMatriz.AUDIOMETRIA,
      versao: '1.0',
      campos: [],
    };

    it('deve criar uma matriz com sucesso', async () => {
      // Arrange
      mockMatrizesService.create.mockResolvedValue(mockMatriz);

      // Act
      const result = await controller.create(createMatrizDto, mockRequest);

      // Assert
      expect(result).toEqual(mockMatriz);
      expect(mockMatrizesService.create).toHaveBeenCalledWith(
        createMatrizDto,
        mockRequest.user.id,
      );
    });

    it('deve lançar ConflictException quando código já existe', async () => {
      // Arrange
      mockMatrizesService.create.mockRejectedValue(
        new ConflictException('Código já existe'),
      );

      // Act & Assert
      await expect(
        controller.create(createMatrizDto, mockRequest),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de matrizes', async () => {
      // Arrange
      const paginatedResult = {
        data: [mockMatriz],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockMatrizesService.findAll.mockResolvedValue(paginatedResult);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(paginatedResult);
      expect(mockMatrizesService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });

    it('deve filtrar por parâmetros', async () => {
      // Arrange
      const paginatedResult = {
        data: [mockMatriz],
        total: 1,
        page: 2,
        limit: 20,
        totalPages: 1,
      };
      mockMatrizesService.findAll.mockResolvedValue(paginatedResult);

      // Act
      await controller.findAll(
        2,
        20,
        'Audiometria',
        TipoMatriz.AUDIOMETRIA,
        StatusMatriz.ATIVO,
        true,
      );

      // Assert
      expect(mockMatrizesService.findAll).toHaveBeenCalledWith(
        2,
        20,
        'Audiometria',
        TipoMatriz.AUDIOMETRIA,
        StatusMatriz.ATIVO,
        true,
      );
    });

    it('deve usar valores padrão quando parâmetros não são fornecidos', async () => {
      // Arrange
      mockMatrizesService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      // Act
      await controller.findAll();

      // Assert
      expect(mockMatrizesService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar uma matriz por ID', async () => {
      // Arrange
      mockMatrizesService.findOne.mockResolvedValue(mockMatriz);

      // Act
      const result = await controller.findOne('matriz-uuid');

      // Assert
      expect(result).toEqual(mockMatriz);
      expect(mockMatrizesService.findOne).toHaveBeenCalledWith('matriz-uuid');
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      mockMatrizesService.findOne.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      // Act & Assert
      await expect(controller.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar matriz por código interno', async () => {
      // Arrange
      mockMatrizesService.findByCodigo.mockResolvedValue(mockMatriz);

      // Act
      const result = await controller.findByCodigo('MTZ-AUDIO-001');

      // Assert
      expect(result).toEqual(mockMatriz);
      expect(mockMatrizesService.findByCodigo).toHaveBeenCalledWith(
        'MTZ-AUDIO-001',
      );
    });

    it('deve lançar NotFoundException quando código não existe', async () => {
      // Arrange
      mockMatrizesService.findByCodigo.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      // Act & Assert
      await expect(controller.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByTipo', () => {
    it('deve retornar matrizes por tipo', async () => {
      // Arrange
      mockMatrizesService.findByTipo.mockResolvedValue([mockMatriz]);

      // Act
      const result = await controller.findByTipo(TipoMatriz.AUDIOMETRIA);

      // Assert
      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizesService.findByTipo).toHaveBeenCalledWith(
        TipoMatriz.AUDIOMETRIA,
      );
    });

    it('deve retornar array vazio quando não há matrizes do tipo', async () => {
      // Arrange
      mockMatrizesService.findByTipo.mockResolvedValue([]);

      // Act
      const result = await controller.findByTipo(TipoMatriz.HEMOGRAMA);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findPadrao', () => {
    it('deve retornar matrizes padrão do sistema', async () => {
      // Arrange
      const matrizPadrao = { ...mockMatriz, padraoSistema: true };
      mockMatrizesService.findPadrao.mockResolvedValue([matrizPadrao]);

      // Act
      const result = await controller.findPadrao();

      // Assert
      expect(result).toEqual([matrizPadrao]);
      expect(mockMatrizesService.findPadrao).toHaveBeenCalled();
    });
  });

  describe('findAtivas', () => {
    it('deve retornar matrizes ativas', async () => {
      // Arrange
      mockMatrizesService.findAtivas.mockResolvedValue([mockMatriz]);

      // Act
      const result = await controller.findAtivas();

      // Assert
      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizesService.findAtivas).toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas', async () => {
      // Arrange
      const stats = {
        total: 50,
        ativas: 40,
        inativas: 10,
        porTipo: {
          audiometria: 20,
          hemograma: 15,
        },
      };
      mockMatrizesService.getStats.mockResolvedValue(stats);

      // Act
      const result = await controller.getStats();

      // Assert
      expect(result).toEqual(stats);
      expect(mockMatrizesService.getStats).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateMatrizDto: UpdateMatrizDto = {
      nome: 'Audiometria Tonal Atualizada',
      descricao: 'Descrição atualizada',
    };

    it('deve atualizar uma matriz com sucesso', async () => {
      // Arrange
      const updatedMatriz = { ...mockMatriz, ...updateMatrizDto };
      mockMatrizesService.update.mockResolvedValue(updatedMatriz);

      // Act
      const result = await controller.update(
        'matriz-uuid',
        updateMatrizDto,
        mockRequest,
      );

      // Assert
      expect(result).toEqual(updatedMatriz);
      expect(mockMatrizesService.update).toHaveBeenCalledWith(
        'matriz-uuid',
        updateMatrizDto,
        mockRequest.user.id,
      );
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      mockMatrizesService.update.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      // Act & Assert
      await expect(
        controller.update('non-existent', updateMatrizDto, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma matriz com sucesso', async () => {
      // Arrange
      mockMatrizesService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove('matriz-uuid', mockRequest);

      // Assert
      expect(result).toBeUndefined();
      expect(mockMatrizesService.remove).toHaveBeenCalledWith(
        'matriz-uuid',
        mockRequest.user.id,
      );
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      mockMatrizesService.remove.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      // Act & Assert
      await expect(
        controller.remove('non-existent', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('activate', () => {
    it('deve ativar uma matriz com sucesso', async () => {
      // Arrange
      const matrizAtivada = {
        ...mockMatriz,
        ativo: true,
        status: StatusMatriz.ATIVO,
      };
      mockMatrizesService.activate.mockResolvedValue(matrizAtivada);

      // Act
      const result = await controller.activate('matriz-uuid', mockRequest);

      // Assert
      expect(result).toEqual(matrizAtivada);
      expect(mockMatrizesService.activate).toHaveBeenCalledWith(
        'matriz-uuid',
        mockRequest.user.id,
      );
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      mockMatrizesService.activate.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      // Act & Assert
      await expect(
        controller.activate('non-existent', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('deve desativar uma matriz com sucesso', async () => {
      // Arrange
      const matrizDesativada = {
        ...mockMatriz,
        ativo: false,
        status: StatusMatriz.INATIVO,
      };
      mockMatrizesService.deactivate.mockResolvedValue(matrizDesativada);

      // Act
      const result = await controller.deactivate('matriz-uuid', mockRequest);

      // Assert
      expect(result).toEqual(matrizDesativada);
      expect(mockMatrizesService.deactivate).toHaveBeenCalledWith(
        'matriz-uuid',
        mockRequest.user.id,
      );
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      mockMatrizesService.deactivate.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      // Act & Assert
      await expect(
        controller.deactivate('non-existent', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('duplicate', () => {
    const novoCodigoInterno = 'MTZ-AUDIO-002';
    const novoNome = 'Audiometria Tonal - Cópia';

    it('deve duplicar uma matriz com sucesso', async () => {
      // Arrange
      const matrizDuplicada = {
        ...mockMatriz,
        id: 'nova-matriz-uuid',
        codigoInterno: novoCodigoInterno,
        nome: novoNome,
        padraoSistema: false,
      };
      mockMatrizesService.duplicate.mockResolvedValue(matrizDuplicada);

      // Act
      const result = await controller.duplicate(
        'matriz-uuid',
        novoCodigoInterno,
        novoNome,
        mockRequest,
      );

      // Assert
      expect(result).toEqual(matrizDuplicada);
      expect(mockMatrizesService.duplicate).toHaveBeenCalledWith(
        'matriz-uuid',
        novoCodigoInterno,
        novoNome,
        mockRequest.user.id,
      );
    });

    it('deve lançar ConflictException quando novo código já existe', async () => {
      // Arrange
      mockMatrizesService.duplicate.mockRejectedValue(
        new ConflictException('Código já existe'),
      );

      // Act & Assert
      await expect(
        controller.duplicate(
          'matriz-uuid',
          novoCodigoInterno,
          novoNome,
          mockRequest,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('deve lançar NotFoundException quando matriz original não existe', async () => {
      // Arrange
      mockMatrizesService.duplicate.mockRejectedValue(
        new NotFoundException('Matriz não encontrada'),
      );

      // Act & Assert
      await expect(
        controller.duplicate(
          'non-existent',
          novoCodigoInterno,
          novoNome,
          mockRequest,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
