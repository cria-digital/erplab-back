import { Test, TestingModule } from '@nestjs/testing';
import { AmostrasController } from './amostras.controller';
import { AmostrasService } from '../services/amostras.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';
import { Amostra, StatusAmostra } from '../entities/amostra.entity';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('AmostrasController', () => {
  let controller: AmostrasController;
  let service: AmostrasService;

  const mockAmostrasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleStatus: jest.fn(),
    validar: jest.fn(),
    getStatistics: jest.fn(),
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
      codigoInterno: 'AMO001',
      nome: 'Sangue Total com EDTA',
      descricao: 'Sangue venoso com anticoagulante EDTA',
      status: StatusAmostra.EM_REVISAO,
    };

    const mockAmostra = {
      id: 'amostra-uuid',
      ...createAmostraDto,
      laboratorioAmostras: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Amostra;

    it('deve criar uma amostra com sucesso', async () => {
      mockAmostrasService.create.mockResolvedValue(mockAmostra);

      const result = await controller.create(createAmostraDto);

      expect(result).toEqual(mockAmostra);
      expect(service.create).toHaveBeenCalledWith(createAmostraDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar ConflictException quando código já existe', async () => {
      mockAmostrasService.create.mockRejectedValue(
        new ConflictException('Amostra com código AMO001 já existe'),
      );

      await expect(controller.create(createAmostraDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(createAmostraDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de amostras', async () => {
      const paginatedResult = {
        data: [
          { id: '1', nome: 'Amostra 1' },
          { id: '2', nome: 'Amostra 2' },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      };

      mockAmostrasService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll();

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve passar parâmetros de paginação para o service', async () => {
      const page = '2';
      const limit = '20';
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 2,
        totalPages: 0,
      });

      await controller.findAll(page, limit);

      expect(service.findAll).toHaveBeenCalledWith(2, 20, undefined, undefined);
    });

    it('deve passar filtro de busca para o service', async () => {
      const search = 'Sangue';
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });

      await controller.findAll('1', '10', search);

      expect(service.findAll).toHaveBeenCalledWith(1, 10, search, undefined);
    });

    it('deve passar filtro de status para o service', async () => {
      const status = StatusAmostra.ATIVO;
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });

      await controller.findAll('1', '10', undefined, status);

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, status);
    });

    it('deve retornar resultado vazio quando não há amostras', async () => {
      mockAmostrasService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });

      const result = await controller.findAll();

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findByStatus', () => {
    it('deve retornar amostras por status', async () => {
      const status = StatusAmostra.ATIVO;
      const amostras = [
        { id: '1', status: StatusAmostra.ATIVO },
        { id: '2', status: StatusAmostra.ATIVO },
      ];

      mockAmostrasService.findByStatus.mockResolvedValue(amostras);

      const result = await controller.findByStatus(status);

      expect(result).toEqual(amostras);
      expect(service.findByStatus).toHaveBeenCalledWith(status);
      expect(service.findByStatus).toHaveBeenCalledTimes(1);
    });

    it('deve retornar array vazio quando não há amostras do status', async () => {
      mockAmostrasService.findByStatus.mockResolvedValue([]);

      const result = await controller.findByStatus(StatusAmostra.INATIVO);

      expect(result).toEqual([]);
    });
  });

  describe('getStatistics', () => {
    it('deve retornar estatísticas corretas', async () => {
      const stats = {
        total: 50,
        ativos: 40,
        inativos: 5,
        emRevisao: 5,
      };

      mockAmostrasService.getStatistics.mockResolvedValue(stats);

      const result = await controller.getStatistics();

      expect(result).toEqual(stats);
      expect(service.getStatistics).toHaveBeenCalledTimes(1);
    });

    it('deve retornar estatísticas zeradas quando não há amostras', async () => {
      const emptyStats = {
        total: 0,
        ativos: 0,
        inativos: 0,
        emRevisao: 0,
      };

      mockAmostrasService.getStatistics.mockResolvedValue(emptyStats);

      const result = await controller.getStatistics();

      expect(result).toEqual(emptyStats);
      expect(result.total).toBe(0);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar amostra pelo código interno', async () => {
      const amostra = {
        id: 'amostra-uuid',
        codigoInterno: 'AMO001',
        nome: 'Sangue EDTA',
      };

      mockAmostrasService.findByCodigo.mockResolvedValue(amostra);

      const result = await controller.findByCodigo('AMO001');

      expect(result).toEqual(amostra);
      expect(service.findByCodigo).toHaveBeenCalledWith('AMO001');
      expect(service.findByCodigo).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando código não existe', async () => {
      mockAmostrasService.findByCodigo.mockRejectedValue(
        new NotFoundException('Amostra com código NON-EXISTENT não encontrada'),
      );

      await expect(controller.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCodigo).toHaveBeenCalledWith('NON-EXISTENT');
    });
  });

  describe('findOne', () => {
    it('deve retornar uma amostra pelo ID', async () => {
      const amostraId = 'amostra-uuid';
      const amostra = {
        id: amostraId,
        nome: 'Amostra Test',
        status: StatusAmostra.ATIVO,
      };

      mockAmostrasService.findOne.mockResolvedValue(amostra);

      const result = await controller.findOne(amostraId);

      expect(result).toEqual(amostra);
      expect(service.findOne).toHaveBeenCalledWith(amostraId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando ID não existe', async () => {
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.findOne.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      await expect(controller.findOne(amostraIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(amostraIdInexistente);
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
      status: StatusAmostra.ATIVO,
    };

    it('deve atualizar uma amostra com sucesso', async () => {
      const amostraId = 'amostra-uuid';
      mockAmostrasService.update.mockResolvedValue(updatedAmostra);

      const result = await controller.update(amostraId, updateAmostraDto);

      expect(result).toEqual(updatedAmostra);
      expect(service.update).toHaveBeenCalledWith(amostraId, updateAmostraDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.update.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      await expect(
        controller.update(amostraIdInexistente, updateAmostraDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        amostraIdInexistente,
        updateAmostraDto,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status da amostra', async () => {
      const amostraId = 'amostra-uuid';
      const toggledAmostra = {
        id: amostraId,
        status: StatusAmostra.INATIVO,
      };

      mockAmostrasService.toggleStatus.mockResolvedValue(toggledAmostra);

      const result = await controller.toggleStatus(amostraId);

      expect(result).toEqual(toggledAmostra);
      expect(service.toggleStatus).toHaveBeenCalledWith(amostraId);
      expect(service.toggleStatus).toHaveBeenCalledTimes(1);
    });

    it('deve lançar BadRequestException se amostra em revisão', async () => {
      const amostraId = 'amostra-uuid';
      mockAmostrasService.toggleStatus.mockRejectedValue(
        new BadRequestException(
          'Amostra em revisão não pode ter seu status alterado diretamente',
        ),
      );

      await expect(controller.toggleStatus(amostraId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.toggleStatus.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      await expect(
        controller.toggleStatus(amostraIdInexistente),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('validar', () => {
    it('deve validar uma amostra em revisão', async () => {
      const amostraId = 'amostra-uuid';
      const validatedAmostra = {
        id: amostraId,
        status: StatusAmostra.ATIVO,
      };

      mockAmostrasService.validar.mockResolvedValue(validatedAmostra);

      const result = await controller.validar(amostraId);

      expect(result).toEqual(validatedAmostra);
      expect(service.validar).toHaveBeenCalledWith(amostraId);
      expect(service.validar).toHaveBeenCalledTimes(1);
    });

    it('deve lançar BadRequestException se amostra não está em revisão', async () => {
      const amostraId = 'amostra-uuid';
      mockAmostrasService.validar.mockRejectedValue(
        new BadRequestException(
          'Apenas amostras em revisão podem ser validadas',
        ),
      );

      await expect(controller.validar(amostraId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.validar.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      await expect(controller.validar(amostraIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover uma amostra com sucesso', async () => {
      const amostraId = 'amostra-uuid';
      mockAmostrasService.remove.mockResolvedValue(undefined);

      await controller.remove(amostraId);

      expect(service.remove).toHaveBeenCalledWith(amostraId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      const amostraIdInexistente = 'amostra-inexistente-uuid';
      mockAmostrasService.remove.mockRejectedValue(
        new NotFoundException(
          `Amostra com ID ${amostraIdInexistente} não encontrada`,
        ),
      );

      await expect(controller.remove(amostraIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(amostraIdInexistente);
    });

    it('deve retornar undefined após remoção', async () => {
      const amostraId = 'amostra-uuid';
      mockAmostrasService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(amostraId);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(amostraId);
    });
  });

  describe('integração com guards e decorators', () => {
    it('deve ter controller configurado corretamente', () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });

    it('deve ter métodos do controller expostos corretamente', () => {
      expect(typeof controller.create).toBe('function');
      expect(typeof controller.findAll).toBe('function');
      expect(typeof controller.findOne).toBe('function');
      expect(typeof controller.findByStatus).toBe('function');
      expect(typeof controller.findByCodigo).toBe('function');
      expect(typeof controller.getStatistics).toBe('function');
      expect(typeof controller.update).toBe('function');
      expect(typeof controller.remove).toBe('function');
      expect(typeof controller.toggleStatus).toBe('function');
      expect(typeof controller.validar).toBe('function');
    });
  });
});
