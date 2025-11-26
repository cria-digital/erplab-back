import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MetodosService } from './metodos.service';
import { Metodo, StatusMetodo } from './entities/metodo.entity';
import { LaboratorioMetodo } from './entities/laboratorio-metodo.entity';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

describe('MetodosService', () => {
  let service: MetodosService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
  };

  const mockLaboratorioMetodoRepository = {
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
        MetodosService,
        {
          provide: getRepositoryToken(Metodo),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(LaboratorioMetodo),
          useValue: mockLaboratorioMetodoRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<MetodosService>(MetodosService);

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo método', async () => {
      const createMetodoDto = {
        nome: 'ELISA',
        codigoInterno: 'MET001',
        descricao: 'Método ELISA',
        status: StatusMetodo.EM_VALIDACAO,
      };

      const metodo = { id: 'uuid', ...createMetodoDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(metodo);
      mockRepository.save.mockResolvedValue(metodo);

      const result = await service.create(createMetodoDto);

      expect(result).toEqual(metodo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createMetodoDto.codigoInterno },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createMetodoDto);
      expect(mockRepository.save).toHaveBeenCalledWith(metodo);
    });

    it('deve lançar ConflictException se código já existe', async () => {
      const createMetodoDto = {
        nome: 'ELISA',
        codigoInterno: 'MET001',
        descricao: 'Método ELISA',
      };

      mockRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(createMetodoDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de métodos', async () => {
      const metodos = [
        { id: '1', nome: 'Método 1' },
        { id: '2', nome: 'Método 2' },
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([metodos, 2]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: metodos,
        total: 2,
        page: 1,
        totalPages: 1,
      });
    });

    it('deve aplicar filtro de busca', async () => {
      const metodos = [{ id: '1', nome: 'ELISA' }];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([metodos, 1]);

      await service.findAll(1, 10, 'ELISA');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(metodo.nome ILIKE :search OR metodo.codigo_interno ILIKE :search OR metodo.descricao ILIKE :search)',
        { search: '%ELISA%' },
      );
    });

    it('deve aplicar filtro de status', async () => {
      const metodos = [{ id: '1', status: StatusMetodo.ATIVO }];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([metodos, 1]);

      await service.findAll(1, 10, undefined, StatusMetodo.ATIVO);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'metodo.status = :status',
        { status: StatusMetodo.ATIVO },
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um método por ID', async () => {
      const metodo = {
        id: 'uuid',
        nome: 'ELISA',
        laboratorioMetodos: [],
      };

      mockRepository.findOne.mockResolvedValue(metodo);

      const result = await service.findOne('uuid');

      expect(result).toEqual(metodo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: [
          'laboratorioMetodos',
          'laboratorioMetodos.laboratorio',
          'laboratorioMetodos.laboratorio.empresa',
        ],
      });
    });

    it('deve lançar NotFoundException se método não existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar método por código interno', async () => {
      const metodo = {
        id: 'uuid',
        codigoInterno: 'MET001',
        nome: 'ELISA',
      };

      mockRepository.findOne.mockResolvedValue(metodo);

      const result = await service.findByCodigo('MET001');

      expect(result).toEqual(metodo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: 'MET001' },
        relations: [
          'laboratorioMetodos',
          'laboratorioMetodos.laboratorio',
          'laboratorioMetodos.laboratorio.empresa',
        ],
      });
    });

    it('deve lançar NotFoundException se código não existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('MET999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um método', async () => {
      const metodo = {
        id: 'uuid',
        nome: 'ELISA',
        descricao: 'Método antigo',
      };

      const updateDto = {
        descricao: 'Método atualizado',
      };

      mockRepository.findOne.mockResolvedValue(metodo);
      mockRepository.save.mockResolvedValue({ ...metodo, ...updateDto });

      const result = await service.update('uuid', updateDto);

      expect(result.descricao).toBe('Método atualizado');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um método e seus vínculos usando transação', async () => {
      const metodo = {
        id: 'uuid',
        nome: 'ELISA',
        laboratorioMetodos: [],
      };

      mockRepository.findOne.mockResolvedValue(metodo);

      // Mock da transação
      mockDataSource.transaction.mockImplementation(async (callback) => {
        const mockManager = {
          delete: jest.fn().mockResolvedValue({ affected: 0 }),
          remove: jest.fn().mockResolvedValue(metodo),
        };
        return await callback(mockManager);
      });

      await service.remove('uuid');

      expect(mockDataSource.transaction).toHaveBeenCalled();
    });

    it('deve remover método com vínculos automaticamente', async () => {
      const metodo = {
        id: 'uuid',
        nome: 'ELISA',
        laboratorioMetodos: [{ id: 'vinculo1' }],
      };

      mockRepository.findOne.mockResolvedValue(metodo);

      // Mock da transação
      mockDataSource.transaction.mockImplementation(async (callback) => {
        const mockManager = {
          delete: jest.fn().mockResolvedValue({ affected: 1 }),
          remove: jest.fn().mockResolvedValue(metodo),
        };
        return await callback(mockManager);
      });

      await service.remove('uuid');

      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const metodo = {
        id: 'uuid',
        status: StatusMetodo.ATIVO,
      };

      mockRepository.findOne.mockResolvedValue(metodo);
      mockRepository.save.mockResolvedValue({
        ...metodo,
        status: StatusMetodo.INATIVO,
      });

      const result = await service.toggleStatus('uuid');

      expect(result.status).toBe(StatusMetodo.INATIVO);
    });

    it('deve alternar status de inativo para ativo', async () => {
      const metodo = {
        id: 'uuid',
        status: StatusMetodo.INATIVO,
      };

      mockRepository.findOne.mockResolvedValue(metodo);
      mockRepository.save.mockResolvedValue({
        ...metodo,
        status: StatusMetodo.ATIVO,
      });

      const result = await service.toggleStatus('uuid');

      expect(result.status).toBe(StatusMetodo.ATIVO);
    });

    it('deve lançar BadRequestException se status é em_validacao', async () => {
      const metodo = {
        id: 'uuid',
        status: StatusMetodo.EM_VALIDACAO,
      };

      mockRepository.findOne.mockResolvedValue(metodo);

      await expect(service.toggleStatus('uuid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validar', () => {
    it('deve validar método em validação', async () => {
      const metodo = {
        id: 'uuid',
        status: StatusMetodo.EM_VALIDACAO,
      };

      mockRepository.findOne.mockResolvedValue(metodo);
      mockRepository.save.mockResolvedValue({
        ...metodo,
        status: StatusMetodo.ATIVO,
      });

      const result = await service.validar('uuid');

      expect(result.status).toBe(StatusMetodo.ATIVO);
    });

    it('deve lançar BadRequestException se método não está em validação', async () => {
      const metodo = {
        id: 'uuid',
        status: StatusMetodo.ATIVO,
      };

      mockRepository.findOne.mockResolvedValue(metodo);

      await expect(service.validar('uuid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStatistics', () => {
    it('deve retornar estatísticas dos métodos', async () => {
      mockRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5) // ativos
        .mockResolvedValueOnce(2) // inativos
        .mockResolvedValueOnce(3); // em validação

      const result = await service.getStatistics();

      expect(result).toEqual({
        total: 10,
        ativos: 5,
        inativos: 2,
        emValidacao: 3,
      });
    });
  });
});
