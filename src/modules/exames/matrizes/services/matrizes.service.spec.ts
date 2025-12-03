import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MatrizesService } from './matrizes.service';
import { MatrizExame } from '../entities/matriz-exame.entity';
import { CampoMatriz, TipoCampoMatriz } from '../entities/campo-matriz.entity';
import { CreateMatrizDto } from '../dto/create-matriz.dto';
import { UpdateMatrizDto } from '../dto/update-matriz.dto';

describe('MatrizesService', () => {
  let service: MatrizesService;
  let _matrizRepository: Repository<MatrizExame>;
  let _campoMatrizRepository: Repository<CampoMatriz>;
  let _dataSource: DataSource;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  const mockMatrizRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
  };

  const mockCampoMatrizRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockMatriz: Partial<MatrizExame> = {
    id: 'matriz-uuid',
    codigoInterno: 'HEM123',
    nome: 'Hemograma 1',
    tipoExameId: 'tipo-exame-uuid',
    exameId: 'exame-uuid',
    templateArquivo: null,
    templateDados: null,
    ativo: true,
    campos: [],
    criadoPor: 'user-uuid',
    atualizadoPor: 'user-uuid',
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };

  const mockCampo: Partial<CampoMatriz> = {
    id: 'campo-uuid',
    matrizId: 'matriz-uuid',
    codigoCampo: 'hemoglobina',
    label: 'Hemoglobina',
    tipoCampo: TipoCampoMatriz.DECIMAL,
    obrigatorio: true,
    ordemExibicao: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatrizesService,
        {
          provide: getRepositoryToken(MatrizExame),
          useValue: mockMatrizRepository,
        },
        {
          provide: getRepositoryToken(CampoMatriz),
          useValue: mockCampoMatrizRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<MatrizesService>(MatrizesService);
    _matrizRepository = module.get<Repository<MatrizExame>>(
      getRepositoryToken(MatrizExame),
    );
    _campoMatrizRepository = module.get<Repository<CampoMatriz>>(
      getRepositoryToken(CampoMatriz),
    );
    _dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const usuarioId = 'user-uuid';
    const createMatrizDto: CreateMatrizDto = {
      codigoInterno: 'HEM123',
      nome: 'Hemograma 1',
      tipoExameId: 'tipo-exame-uuid',
      exameId: 'exame-uuid',
      campos: [
        {
          codigoCampo: 'hemoglobina',
          label: 'Hemoglobina',
          tipoCampo: TipoCampoMatriz.DECIMAL,
          obrigatorio: true,
          ordemExibicao: 1,
        },
      ],
    };

    it('deve criar uma matriz com campos com sucesso', async () => {
      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue(mockMatriz);
      mockQueryRunner.manager.save.mockResolvedValue(mockMatriz);
      mockCampoMatrizRepository.create.mockReturnValue(mockCampo);

      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockMatriz,
        campos: [mockCampo],
      } as MatrizExame);

      const result = await service.create(createMatrizDto, usuarioId);

      expect(mockMatrizRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createMatrizDto.codigoInterno },
      });
      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual({ ...mockMatriz, campos: [mockCampo] });
    });

    it('deve lançar ConflictException quando código já existe', async () => {
      mockMatrizRepository.findOne.mockResolvedValue(mockMatriz);

      await expect(service.create(createMatrizDto, usuarioId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve fazer rollback em caso de erro', async () => {
      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue(mockMatriz);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createMatrizDto, usuarioId)).rejects.toThrow(
        'Database error',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de matrizes', async () => {
      const matrizes = [mockMatriz];
      mockMatrizRepository.findAndCount.mockResolvedValue([matrizes, 1]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: matrizes,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('deve filtrar por tipoExameId', async () => {
      mockMatrizRepository.findAndCount.mockResolvedValue([[mockMatriz], 1]);

      await service.findAll(1, 10, undefined, 'tipo-exame-uuid');

      expect(mockMatrizRepository.findAndCount).toHaveBeenCalledWith({
        where: { tipoExameId: 'tipo-exame-uuid' },
        relations: ['campos', 'tipoExameAlternativa', 'exame'],
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por ativo', async () => {
      mockMatrizRepository.findAndCount.mockResolvedValue([[mockMatriz], 1]);

      await service.findAll(1, 10, undefined, undefined, true);

      expect(mockMatrizRepository.findAndCount).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['campos', 'tipoExameAlternativa', 'exame'],
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma matriz por ID', async () => {
      mockMatrizRepository.findOne.mockResolvedValue(mockMatriz);

      const result = await service.findOne('matriz-uuid');

      expect(result).toEqual(mockMatriz);
      expect(mockMatrizRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'matriz-uuid' },
        relations: ['campos', 'tipoExameAlternativa', 'exame'],
      });
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      mockMatrizRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar matriz por código interno', async () => {
      mockMatrizRepository.findOne.mockResolvedValue(mockMatriz);

      const result = await service.findByCodigo('HEM123');

      expect(result).toEqual(mockMatriz);
    });

    it('deve lançar NotFoundException quando código não existe', async () => {
      mockMatrizRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByTipoExame', () => {
    it('deve retornar matrizes por tipo de exame', async () => {
      mockMatrizRepository.find.mockResolvedValue([mockMatriz]);

      const result = await service.findByTipoExame('tipo-exame-uuid');

      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizRepository.find).toHaveBeenCalledWith({
        where: { tipoExameId: 'tipo-exame-uuid', ativo: true },
        relations: ['campos', 'tipoExameAlternativa', 'exame'],
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findAtivas', () => {
    it('deve retornar apenas matrizes ativas', async () => {
      mockMatrizRepository.find.mockResolvedValue([mockMatriz]);

      const result = await service.findAtivas();

      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['campos', 'tipoExameAlternativa', 'exame'],
        order: { nome: 'ASC' },
      });
    });
  });

  describe('update', () => {
    const usuarioId = 'user-uuid';
    const updateMatrizDto: UpdateMatrizDto = {
      nome: 'Hemograma 1 Atualizado',
    };

    it('deve atualizar uma matriz com sucesso', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockMatriz as MatrizExame)
        .mockResolvedValueOnce({
          ...mockMatriz,
          ...updateMatrizDto,
        } as MatrizExame);
      mockQueryRunner.manager.save.mockResolvedValue({
        ...mockMatriz,
        ...updateMatrizDto,
      });

      const result = await service.update(
        'matriz-uuid',
        updateMatrizDto,
        usuarioId,
      );

      expect(result.nome).toBe('Hemograma 1 Atualizado');
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve lançar ConflictException ao tentar usar código já existente', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockMatrizRepository.findOne.mockResolvedValue({
        id: 'outro-id',
        codigoInterno: 'CODIGO-EXISTENTE',
      });

      const updateDto: UpdateMatrizDto = {
        codigoInterno: 'CODIGO-EXISTENTE',
      };

      await expect(
        service.update('matriz-uuid', updateDto, usuarioId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    const usuarioId = 'user-uuid';

    it('deve desativar matriz (soft delete)', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockMatrizRepository.save.mockResolvedValue({
        ...mockMatriz,
        ativo: false,
      });

      await service.remove('matriz-uuid', usuarioId);

      expect(mockMatrizRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ativo: false,
          atualizadoPor: usuarioId,
        }),
      );
    });
  });

  describe('activate', () => {
    const usuarioId = 'user-uuid';

    it('deve ativar matriz', async () => {
      const matrizInativa = { ...mockMatriz, ativo: false };
      const matrizAtivada = { ...mockMatriz, ativo: true };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(matrizInativa as MatrizExame)
        .mockResolvedValueOnce(matrizAtivada as MatrizExame);
      mockMatrizRepository.save.mockResolvedValue(matrizAtivada);

      const result = await service.activate('matriz-uuid', usuarioId);

      expect(result.ativo).toBe(true);
    });
  });

  describe('deactivate', () => {
    const usuarioId = 'user-uuid';

    it('deve desativar matriz', async () => {
      const matrizDesativada = { ...mockMatriz, ativo: false };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockMatriz as MatrizExame)
        .mockResolvedValueOnce(matrizDesativada as MatrizExame);
      mockMatrizRepository.save.mockResolvedValue(matrizDesativada);

      const result = await service.deactivate('matriz-uuid', usuarioId);

      expect(result.ativo).toBe(false);
    });
  });

  describe('duplicate', () => {
    const usuarioId = 'user-uuid';
    const novoCodigoInterno = 'HEM124';
    const novoNome = 'Hemograma 1 - Cópia';

    it('deve duplicar matriz com campos', async () => {
      const matrizComCampos = { ...mockMatriz, campos: [mockCampo] };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(matrizComCampos as MatrizExame)
        .mockResolvedValueOnce({
          ...mockMatriz,
          id: 'nova-matriz-uuid',
          codigoInterno: novoCodigoInterno,
          nome: novoNome,
        } as MatrizExame);

      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue({
        ...mockMatriz,
        id: 'nova-matriz-uuid',
        codigoInterno: novoCodigoInterno,
        nome: novoNome,
      });
      mockQueryRunner.manager.save.mockResolvedValue({
        ...mockMatriz,
        id: 'nova-matriz-uuid',
      });
      mockCampoMatrizRepository.find.mockResolvedValue([mockCampo]);
      mockCampoMatrizRepository.create.mockReturnValue({
        ...mockCampo,
        id: 'novo-campo-uuid',
      });

      const result = await service.duplicate(
        'matriz-uuid',
        novoCodigoInterno,
        novoNome,
        usuarioId,
      );

      expect(result.codigoInterno).toBe(novoCodigoInterno);
      expect(result.nome).toBe(novoNome);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando novo código já existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockMatrizRepository.findOne.mockResolvedValue({
        id: 'outra-matriz',
        codigoInterno: novoCodigoInterno,
      });

      await expect(
        service.duplicate(
          'matriz-uuid',
          novoCodigoInterno,
          novoNome,
          usuarioId,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas', async () => {
      mockMatrizRepository.count
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(40)
        .mockResolvedValueOnce(10);

      const porTipoExameMock = [
        { tipoExameId: 'tipo-1', quantidade: '20' },
        { tipoExameId: 'tipo-2', quantidade: '15' },
      ];

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(porTipoExameMock),
      };
      mockMatrizRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 50,
        ativas: 40,
        inativas: 10,
        porTipoExame: {
          'tipo-1': 20,
          'tipo-2': 15,
        },
      });
    });
  });
});
