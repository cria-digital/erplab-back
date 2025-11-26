import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AmostrasService } from './amostras.service';
import { Amostra, StatusAmostra } from '../entities/amostra.entity';
import { LaboratorioAmostra } from '../entities/laboratorio-amostra.entity';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('AmostrasService', () => {
  let service: AmostrasService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  const mockLaboratorioAmostraRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmostrasService,
        {
          provide: getRepositoryToken(Amostra),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(LaboratorioAmostra),
          useValue: mockLaboratorioAmostraRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AmostrasService>(AmostrasService);

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma nova amostra', async () => {
      const createAmostraDto = {
        nome: 'Sangue Total',
        codigoInterno: 'AMO001',
        descricao: 'Amostra de sangue total',
        status: StatusAmostra.EM_REVISAO,
      };

      const amostra = { id: 'uuid', ...createAmostraDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(amostra);
      mockRepository.save.mockResolvedValue(amostra);

      const result = await service.create(createAmostraDto);

      expect(result).toEqual(amostra);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createAmostraDto.codigoInterno },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createAmostraDto);
      expect(mockRepository.save).toHaveBeenCalledWith(amostra);
    });

    it('deve lançar ConflictException se código já existe', async () => {
      const createAmostraDto = {
        nome: 'Sangue Total',
        codigoInterno: 'AMO001',
        descricao: 'Amostra de sangue total',
      };

      mockRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(createAmostraDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de amostras', async () => {
      const amostras = [
        { id: '1', nome: 'Amostra 1' },
        { id: '2', nome: 'Amostra 2' },
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([amostras, 2]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: amostras,
        total: 2,
        page: 1,
        totalPages: 1,
      });
    });

    it('deve aplicar filtro de busca', async () => {
      const amostras = [{ id: '1', nome: 'Sangue Total' }];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([amostras, 1]);

      await service.findAll(1, 10, 'Sangue');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(amostra.nome ILIKE :search OR amostra.codigo_interno ILIKE :search OR amostra.descricao ILIKE :search)',
        { search: '%Sangue%' },
      );
    });

    it('deve aplicar filtro de status', async () => {
      const amostras = [{ id: '1', status: StatusAmostra.ATIVO }];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([amostras, 1]);

      await service.findAll(1, 10, undefined, StatusAmostra.ATIVO);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'amostra.status = :status',
        { status: StatusAmostra.ATIVO },
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar uma amostra por ID', async () => {
      const amostra = {
        id: 'uuid',
        nome: 'Sangue Total',
        laboratorioAmostras: [],
      };

      mockRepository.findOne.mockResolvedValue(amostra);

      const result = await service.findOne('uuid');

      expect(result).toEqual(amostra);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: [
          'laboratorioAmostras',
          'laboratorioAmostras.laboratorio',
          'laboratorioAmostras.laboratorio.empresa',
        ],
      });
    });

    it('deve lançar NotFoundException se amostra não existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar amostra por código interno', async () => {
      const amostra = {
        id: 'uuid',
        codigoInterno: 'AMO001',
        nome: 'Sangue Total',
      };

      mockRepository.findOne.mockResolvedValue(amostra);

      const result = await service.findByCodigo('AMO001');

      expect(result).toEqual(amostra);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: 'AMO001' },
        relations: [
          'laboratorioAmostras',
          'laboratorioAmostras.laboratorio',
          'laboratorioAmostras.laboratorio.empresa',
        ],
      });
    });

    it('deve lançar NotFoundException se código não existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('AMO999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar uma amostra', async () => {
      const amostra = {
        id: 'uuid',
        nome: 'Sangue Total',
        descricao: 'Descrição antiga',
      };

      const updateDto = {
        descricao: 'Descrição atualizada',
      };

      mockRepository.findOne.mockResolvedValue(amostra);
      mockRepository.save.mockResolvedValue({ ...amostra, ...updateDto });

      const result = await service.update('uuid', updateDto);

      expect(result.descricao).toBe('Descrição atualizada');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover uma amostra e seus vínculos usando transação', async () => {
      const amostra = {
        id: 'uuid',
        nome: 'Sangue Total',
        laboratorioAmostras: [],
      };

      mockRepository.findOne.mockResolvedValue(amostra);

      // Mock da transação
      mockDataSource.transaction.mockImplementation(async (callback) => {
        const mockManager = {
          delete: jest.fn().mockResolvedValue({ affected: 0 }),
          remove: jest.fn().mockResolvedValue(amostra),
        };
        return await callback(mockManager);
      });

      await service.remove('uuid');

      expect(mockDataSource.transaction).toHaveBeenCalled();
    });

    it('deve remover amostra com vínculos automaticamente', async () => {
      const amostra = {
        id: 'uuid',
        nome: 'Sangue Total',
        laboratorioAmostras: [{ id: 'vinculo1' }],
      };

      mockRepository.findOne.mockResolvedValue(amostra);

      // Mock da transação
      mockDataSource.transaction.mockImplementation(async (callback) => {
        const mockManager = {
          delete: jest.fn().mockResolvedValue({ affected: 1 }),
          remove: jest.fn().mockResolvedValue(amostra),
        };
        return await callback(mockManager);
      });

      await service.remove('uuid');

      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const amostra = {
        id: 'uuid',
        status: StatusAmostra.ATIVO,
      };

      mockRepository.findOne.mockResolvedValue(amostra);
      mockRepository.save.mockResolvedValue({
        ...amostra,
        status: StatusAmostra.INATIVO,
      });

      const result = await service.toggleStatus('uuid');

      expect(result.status).toBe(StatusAmostra.INATIVO);
    });

    it('deve alternar status de inativo para ativo', async () => {
      const amostra = {
        id: 'uuid',
        status: StatusAmostra.INATIVO,
      };

      mockRepository.findOne.mockResolvedValue(amostra);
      mockRepository.save.mockResolvedValue({
        ...amostra,
        status: StatusAmostra.ATIVO,
      });

      const result = await service.toggleStatus('uuid');

      expect(result.status).toBe(StatusAmostra.ATIVO);
    });

    it('deve lançar BadRequestException se status é em_revisao', async () => {
      const amostra = {
        id: 'uuid',
        status: StatusAmostra.EM_REVISAO,
      };

      mockRepository.findOne.mockResolvedValue(amostra);

      await expect(service.toggleStatus('uuid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validar', () => {
    it('deve validar amostra em revisão', async () => {
      const amostra = {
        id: 'uuid',
        status: StatusAmostra.EM_REVISAO,
      };

      mockRepository.findOne.mockResolvedValue(amostra);
      mockRepository.save.mockResolvedValue({
        ...amostra,
        status: StatusAmostra.ATIVO,
      });

      const result = await service.validar('uuid');

      expect(result.status).toBe(StatusAmostra.ATIVO);
    });

    it('deve lançar BadRequestException se amostra não está em revisão', async () => {
      const amostra = {
        id: 'uuid',
        status: StatusAmostra.ATIVO,
      };

      mockRepository.findOne.mockResolvedValue(amostra);

      await expect(service.validar('uuid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStatistics', () => {
    it('deve retornar estatísticas das amostras', async () => {
      mockRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5) // ativos
        .mockResolvedValueOnce(2) // inativos
        .mockResolvedValueOnce(3); // em revisão

      const result = await service.getStatistics();

      expect(result).toEqual({
        total: 10,
        ativos: 5,
        inativos: 2,
        emRevisao: 3,
      });
    });
  });
});
