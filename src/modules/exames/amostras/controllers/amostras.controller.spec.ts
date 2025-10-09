import { Test, TestingModule } from '@nestjs/testing';
import { AmostrasController } from './amostras.controller';
import { AmostrasService } from '../services/amostras.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';
import {
  Amostra,
  TipoAmostra,
  UnidadeVolume,
  TemperaturaArmazenamento,
} from '../entities/amostra.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('AmostrasController', () => {
  let controller: AmostrasController;
  let service: AmostrasService;

  const mockAmostrasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findByTipo: jest.fn(),
    findAtivas: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmostrasController],
      providers: [
        {
          provide: AmostrasService,
          useValue: mockAmostrasService,
        },
      ],
    }).compile();

    controller = module.get<AmostrasController>(AmostrasController);
    service = module.get<AmostrasService>(AmostrasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createAmostraDto: CreateAmostraDto = {
      codigoInterno: 'SANG-EDTA-001',
      nome: 'Sangue Total com EDTA',
      descricao: 'Sangue venoso com anticoagulante EDTA',
      tipoAmostra: TipoAmostra.SANGUE,
      recipientePadrao: 'Tubo EDTA 4mL',
      corTampa: 'Roxa',
      volumeMinimo: 2.0,
      volumeIdeal: 4.0,
      unidadeVolume: UnidadeVolume.ML,
      requerJejum: false,
      temperaturaArmazenamento: TemperaturaArmazenamento.REFRIGERADO,
      prazoValidadeHoras: 24,
      ativo: true,
    };

    const mockAmostra: Partial<Amostra> = {
      id: 'amostra-uuid',
      ...createAmostraDto,
      criadoPor: '00000000-0000-0000-0000-000000000000',
      atualizadoPor: '00000000-0000-0000-0000-000000000000',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    } as Amostra;

    it('deve criar uma amostra com sucesso', async () => {
      // Arrange
      mockAmostrasService.create.mockResolvedValue(mockAmostra);

      // Act
      const result = await controller.create(createAmostraDto);

      // Assert
      expect(result).toEqual(mockAmostra);
      expect(service.create).toHaveBeenCalledWith(
        createAmostraDto,
        '00000000-0000-0000-0000-000000000000',
      );
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar ConflictException quando código já existe', async () => {
      // Arrange
      mockAmostrasService.create.mockRejectedValue(
        new ConflictException('Amostra com código SANG-EDTA-001 já existe'),
      );

      // Act & Assert
      await expect(controller.create(createAmostraDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(
        createAmostraDto,
        '00000000-0000-0000-0000-000000000000',
      );
    });

    it('deve validar DTO de entrada', async () => {
      // Arrange
      const invalidDto = {
        ...createAmostraDto,
        codigoInterno: '', // Campo obrigatório vazio
      };

      mockAmostrasService.create.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(controller.create(invalidDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de amostras', async () => {
      // Arrange
      const paginatedResult = {
        data: [
          { id: '1', nome: 'Amostra 1' },
          { id: '2', nome: 'Amostra 2' },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockAmostrasService.findAll.mockResolvedValue(paginatedResult);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve passar parâmetros de paginação para o service', async () => {
      // Arrange
      const page = 2;
      const limit = 20;
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      });

      // Act
      await controller.findAll(page, limit);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        page,
        limit,
        undefined,
        undefined,
        undefined,
      );
    });

    it('deve passar filtro de busca para o service', async () => {
      // Arrange
      const search = 'Sangue';
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      // Act
      await controller.findAll(1, 10, search);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        search,
        undefined,
        undefined,
      );
    });

    it('deve passar filtro de tipo para o service', async () => {
      // Arrange
      const tipo = TipoAmostra.SANGUE;
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      // Act
      await controller.findAll(1, 10, undefined, tipo);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        tipo,
        undefined,
      );
    });

    it('deve passar filtro de ativo para o service', async () => {
      // Arrange
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      // Act
      await controller.findAll(1, 10, undefined, undefined, true);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        true,
      );
    });

    it('deve retornar resultado vazio quando não há amostras', async () => {
      // Arrange
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findAtivas', () => {
    it('deve retornar apenas amostras ativas', async () => {
      // Arrange
      const amostrasAtivas = [
        { id: '1', nome: 'Amostra Ativa 1', ativo: true },
        { id: '2', nome: 'Amostra Ativa 2', ativo: true },
      ];

      mockAmostrasService.findAtivas.mockResolvedValue(amostrasAtivas);

      // Act
      const result = await controller.findAtivas();

      // Assert
      expect(result).toEqual(amostrasAtivas);
      expect(service.findAtivas).toHaveBeenCalledTimes(1);
      result.forEach((amostra) => {
        expect(amostra.ativo).toBe(true);
      });
    });

    it('deve retornar array vazio quando não há amostras ativas', async () => {
      // Arrange
      mockAmostrasService.findAtivas.mockResolvedValue([]);

      // Act
      const result = await controller.findAtivas();

      // Assert
      expect(result).toEqual([]);
      expect(service.findAtivas).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas', async () => {
      // Arrange
      const stats = {
        total: 50,
        ativas: 40,
        inativas: 10,
        porTipo: {
          sangue: 20,
          urina: 15,
          fezes: 10,
          outros: 5,
        },
      };

      mockAmostrasService.getStats.mockResolvedValue(stats);

      // Act
      const result = await controller.getStats();

      // Assert
      expect(result).toEqual(stats);
      expect(service.getStats).toHaveBeenCalledTimes(1);
    });

    it('deve retornar estatísticas zeradas quando não há amostras', async () => {
      // Arrange
      const emptyStats = {
        total: 0,
        ativas: 0,
        inativas: 0,
        porTipo: {},
      };

      mockAmostrasService.getStats.mockResolvedValue(emptyStats);

      // Act
      const result = await controller.getStats();

      // Assert
      expect(result).toEqual(emptyStats);
      expect(result.total).toBe(0);
    });
  });

  describe('findByTipo', () => {
    it('deve retornar amostras por tipo', async () => {
      // Arrange
      const tipo = TipoAmostra.SANGUE;
      const amostras = [
        { id: '1', tipoAmostra: tipo },
        { id: '2', tipoAmostra: tipo },
      ];

      mockAmostrasService.findByTipo.mockResolvedValue(amostras);

      // Act
      const result = await controller.findByTipo(tipo);

      // Assert
      expect(result).toEqual(amostras);
      expect(service.findByTipo).toHaveBeenCalledWith(tipo);
      expect(service.findByTipo).toHaveBeenCalledTimes(1);
    });

    it('deve aceitar todos os tipos de amostra', async () => {
      // Arrange
      const tipos = Object.values(TipoAmostra);
      mockAmostrasService.findByTipo.mockResolvedValue([]);

      // Act & Assert
      for (const tipo of tipos) {
        await controller.findByTipo(tipo);
        expect(service.findByTipo).toHaveBeenCalledWith(tipo);
      }
    });

    it('deve retornar array vazio quando não há amostras do tipo', async () => {
      // Arrange
      mockAmostrasService.findByTipo.mockResolvedValue([]);

      // Act
      const result = await controller.findByTipo(TipoAmostra.OUTROS);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar amostra pelo código interno', async () => {
      // Arrange
      const amostra = {
        id: 'amostra-uuid',
        codigoInterno: 'SANG-EDTA-001',
        nome: 'Sangue EDTA',
      };

      mockAmostrasService.findByCodigo.mockResolvedValue(amostra);

      // Act
      const result = await controller.findByCodigo('SANG-EDTA-001');

      // Assert
      expect(result).toEqual(amostra);
      expect(service.findByCodigo).toHaveBeenCalledWith('SANG-EDTA-001');
      expect(service.findByCodigo).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando código não existe', async () => {
      // Arrange
      mockAmostrasService.findByCodigo.mockRejectedValue(
        new NotFoundException('Amostra com código NON-EXISTENT não encontrada'),
      );

      // Act & Assert
      await expect(controller.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCodigo).toHaveBeenCalledWith('NON-EXISTENT');
    });

    it('deve aceitar códigos com caracteres especiais', async () => {
      // Arrange
      const codigo = 'AMOSTRA-001_ESPECIAL';
      const amostra = {
        id: 'amostra-uuid',
        codigoInterno: codigo,
        nome: 'Amostra Especial',
      };

      mockAmostrasService.findByCodigo.mockResolvedValue(amostra);

      // Act
      const result = await controller.findByCodigo(codigo);

      // Assert
      expect(result).toEqual(amostra);
      expect(service.findByCodigo).toHaveBeenCalledWith(codigo);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma amostra pelo ID', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      const amostra = {
        id: amostraId,
        nome: 'Amostra Test',
        tipoAmostra: TipoAmostra.SANGUE,
      };

      mockAmostrasService.findOne.mockResolvedValue(amostra);

      // Act
      const result = await controller.findOne(amostraId);

      // Assert
      expect(result).toEqual(amostra);
      expect(service.findOne).toHaveBeenCalledWith(amostraId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando ID não existe', async () => {
      // Arrange
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.findOne.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      // Act & Assert
      await expect(controller.findOne(amostraIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(amostraIdInexistente);
    });

    it('deve validar UUID do amostra', async () => {
      // Arrange
      const amostraIdInvalido = 'invalid-uuid';

      mockAmostrasService.findOne.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(controller.findOne(amostraIdInvalido)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateAmostraDto: UpdateAmostraDto = {
      nome: 'Nome Atualizado',
      descricao: 'Descrição atualizada',
    };

    const updatedAmostra = {
      id: 'amostra-uuid',
      nome: 'Nome Atualizado',
      descricao: 'Descrição atualizada',
      tipoAmostra: TipoAmostra.SANGUE,
    };

    it('deve atualizar uma amostra com sucesso', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      mockAmostrasService.update.mockResolvedValue(updatedAmostra);

      // Act
      const result = await controller.update(amostraId, updateAmostraDto);

      // Assert
      expect(result).toEqual(updatedAmostra);
      expect(service.update).toHaveBeenCalledWith(
        amostraId,
        updateAmostraDto,
        '00000000-0000-0000-0000-000000000000',
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.update.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      // Act & Assert
      await expect(
        controller.update(amostraIdInexistente, updateAmostraDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        amostraIdInexistente,
        updateAmostraDto,
        '00000000-0000-0000-0000-000000000000',
      );
    });

    it('deve permitir atualização parcial', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      const partialUpdateDto: UpdateAmostraDto = {
        nome: 'Apenas nome atualizado',
      };

      const partiallyUpdatedAmostra = {
        id: amostraId,
        nome: 'Apenas nome atualizado',
      };

      mockAmostrasService.update.mockResolvedValue(partiallyUpdatedAmostra);

      // Act
      const result = await controller.update(amostraId, partialUpdateDto);

      // Assert
      expect(result).toEqual(partiallyUpdatedAmostra);
      expect(service.update).toHaveBeenCalledWith(
        amostraId,
        partialUpdateDto,
        '00000000-0000-0000-0000-000000000000',
      );
    });

    it('deve validar DTO de atualização', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      const invalidUpdateDto = {
        nome: '', // Campo vazio
        volumeMinimo: -100, // Valor negativo
      };

      mockAmostrasService.update.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(
        controller.update(amostraId, invalidUpdateDto),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('deve remover uma amostra com sucesso', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      mockAmostrasService.remove.mockResolvedValue(undefined);

      // Act
      await controller.remove(amostraId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(
        amostraId,
        '00000000-0000-0000-0000-000000000000',
      );
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.remove.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      // Act & Assert
      await expect(controller.remove(amostraIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(
        amostraIdInexistente,
        '00000000-0000-0000-0000-000000000000',
      );
    });

    it('deve validar UUID da amostra a ser removida', async () => {
      // Arrange
      const amostraIdInvalido = 'invalid-uuid';

      mockAmostrasService.remove.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(controller.remove(amostraIdInvalido)).rejects.toThrow();
    });

    it('deve retornar undefined após remoção', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      mockAmostrasService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(amostraId);

      // Assert
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(
        amostraId,
        '00000000-0000-0000-0000-000000000000',
      );
    });
  });

  describe('activate', () => {
    it('deve ativar uma amostra', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      const activatedAmostra = {
        id: amostraId,
        ativo: true,
      };

      mockAmostrasService.activate.mockResolvedValue(activatedAmostra);

      // Act
      const result = await controller.activate(amostraId);

      // Assert
      expect(result).toEqual(activatedAmostra);
      expect(service.activate).toHaveBeenCalledWith(
        amostraId,
        '00000000-0000-0000-0000-000000000000',
      );
      expect(service.activate).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.activate.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      // Act & Assert
      await expect(controller.activate(amostraIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.activate).toHaveBeenCalledWith(
        amostraIdInexistente,
        '00000000-0000-0000-0000-000000000000',
      );
    });
  });

  describe('deactivate', () => {
    it('deve desativar uma amostra', async () => {
      // Arrange
      const amostraId = 'amostra-uuid';
      const deactivatedAmostra = {
        id: amostraId,
        ativo: false,
      };

      mockAmostrasService.deactivate.mockResolvedValue(deactivatedAmostra);

      // Act
      const result = await controller.deactivate(amostraId);

      // Assert
      expect(result).toEqual(deactivatedAmostra);
      expect(service.deactivate).toHaveBeenCalledWith(
        amostraId,
        '00000000-0000-0000-0000-000000000000',
      );
      expect(service.deactivate).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.deactivate.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      // Act & Assert
      await expect(controller.deactivate(amostraIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.deactivate).toHaveBeenCalledWith(
        amostraIdInexistente,
        '00000000-0000-0000-0000-000000000000',
      );
    });
  });

  describe('tratamento de erros', () => {
    it('deve propagar erros do service', async () => {
      // Arrange
      mockAmostrasService.findAll.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('deve tratar erro de validação de entrada', async () => {
      // Arrange
      const invalidCreateDto = {
        codigoInterno: '', // Campo obrigatório vazio
      };

      mockAmostrasService.create.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(
        controller.create(invalidCreateDto as CreateAmostraDto),
      ).rejects.toThrow();
    });

    it('deve manter consistência de tipos de erro', async () => {
      // Arrange
      mockAmostrasService.findOne.mockRejectedValue(
        new NotFoundException('Amostra não encontrada'),
      );

      // Act & Assert
      await expect(controller.findOne('amostra-uuid')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('integração com guards e decorators', () => {
    it('deve ter controller configurado corretamente', () => {
      // Arrange & Act & Assert
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });

    it('deve ter métodos do controller expostos corretamente', () => {
      // Assert
      expect(typeof controller.create).toBe('function');
      expect(typeof controller.findAll).toBe('function');
      expect(typeof controller.findOne).toBe('function');
      expect(typeof controller.findAtivas).toBe('function');
      expect(typeof controller.findByTipo).toBe('function');
      expect(typeof controller.findByCodigo).toBe('function');
      expect(typeof controller.getStats).toBe('function');
      expect(typeof controller.update).toBe('function');
      expect(typeof controller.remove).toBe('function');
      expect(typeof controller.activate).toBe('function');
      expect(typeof controller.deactivate).toBe('function');
    });
  });

  describe('validações de parâmetros', () => {
    it('deve aceitar UUIDs válidos nos parâmetros', async () => {
      // Arrange
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const amostra = { id: validUuid, nome: 'Amostra Test' };
      mockAmostrasService.findOne.mockResolvedValue(amostra);

      // Act
      const result = await controller.findOne(validUuid);

      // Assert
      expect(result).toEqual(amostra);
      expect(service.findOne).toHaveBeenCalledWith(validUuid);
    });

    it('deve validar códigos internos com diferentes formatos', async () => {
      // Arrange
      const codigosValidos = [
        'SANG-001',
        'URINA_002',
        'FEZES.003',
        'LIQUOR-ESPECIAL',
      ];

      for (const codigo of codigosValidos) {
        const amostra = { id: 'uuid', codigoInterno: codigo };
        mockAmostrasService.findByCodigo.mockResolvedValue(amostra);

        // Act
        const result = await controller.findByCodigo(codigo);

        // Assert
        expect(result.codigoInterno).toBe(codigo);
      }
    });
  });

  describe('performance e otimização', () => {
    it('deve chamar service apenas uma vez por operação', async () => {
      // Arrange
      const amostras = [{ id: '1', nome: 'Amostra 1' }];
      mockAmostrasService.findAtivas.mockResolvedValue(amostras);

      // Act
      await controller.findAtivas();

      // Assert
      expect(service.findAtivas).toHaveBeenCalledTimes(1);
    });

    it('deve passar parâmetros corretos para o service', async () => {
      // Arrange
      const amostraId = 'test-uuid';
      const updateDto = { nome: 'Novo Nome' };
      mockAmostrasService.update.mockResolvedValue({} as Amostra);

      // Act
      await controller.update(amostraId, updateDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(
        amostraId,
        updateDto,
        '00000000-0000-0000-0000-000000000000',
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });
});
