import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AmostrasService } from './amostras.service';
import {
  Amostra,
  TipoAmostra,
  UnidadeVolume,
  TemperaturaArmazenamento,
} from '../entities/amostra.entity';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';

describe('AmostrasService', () => {
  let service: AmostrasService;
  let repository: Repository<Amostra>;

  const mockRepository = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmostrasService,
        {
          provide: getRepositoryToken(Amostra),
          useValue: { ...mockRepository },
        },
      ],
    }).compile();

    service = module.get<AmostrasService>(AmostrasService);
    repository = module.get<Repository<Amostra>>(getRepositoryToken(Amostra));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const usuarioId = 'user-uuid';
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
      temperaturaMin: 2,
      temperaturaMax: 8,
      prazoValidadeHoras: 24,
      ativo: true,
    };

    const mockAmostra = {
      id: 'amostra-uuid',
      ...createAmostraDto,
      criadoPor: usuarioId,
      atualizadoPor: usuarioId,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    it('deve criar uma amostra com sucesso', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.create = jest.fn().mockReturnValue(mockAmostra);
      repository.save = jest.fn().mockResolvedValue(mockAmostra);

      // Act
      const result = await service.create(createAmostraDto, usuarioId);

      // Assert
      expect(result).toEqual(mockAmostra);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createAmostraDto.codigoInterno },
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...createAmostraDto,
        criadoPor: usuarioId,
        atualizadoPor: usuarioId,
      });
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando código interno já existe', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(mockAmostra);

      // Act & Assert
      await expect(service.create(createAmostraDto, usuarioId)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createAmostraDto.codigoInterno },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando volume mínimo > volume ideal', async () => {
      // Arrange
      const invalidDto: CreateAmostraDto = {
        ...createAmostraDto,
        volumeMinimo: 5.0,
        volumeIdeal: 3.0,
      };
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(invalidDto, usuarioId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando temperatura mínima >= temperatura máxima', async () => {
      // Arrange
      const invalidDto: CreateAmostraDto = {
        ...createAmostraDto,
        temperaturaMin: 10,
        temperaturaMax: 5,
      };
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(invalidDto, usuarioId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando requer jejum mas tempo jejum não informado', async () => {
      // Arrange
      const invalidDto: CreateAmostraDto = {
        ...createAmostraDto,
        requerJejum: true,
        tempoJejum: 0,
      };
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(invalidDto, usuarioId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando requer centrifugação mas tempo não informado', async () => {
      // Arrange
      const invalidDto: CreateAmostraDto = {
        ...createAmostraDto,
        requerCentrifugacao: true,
        tempoCentrifugacao: 0,
      };
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(invalidDto, usuarioId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando requer centrifugação mas rotação não informada', async () => {
      // Arrange
      const invalidDto: CreateAmostraDto = {
        ...createAmostraDto,
        requerCentrifugacao: true,
        tempoCentrifugacao: 10,
        rotacaoCentrifugacao: 0,
      };
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(invalidDto, usuarioId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando prazo validade <= 0', async () => {
      // Arrange
      const invalidDto: CreateAmostraDto = {
        ...createAmostraDto,
        prazoValidadeHoras: 0,
      };
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(invalidDto, usuarioId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de amostras', async () => {
      // Arrange
      const amostras = [
        { id: '1', nome: 'Amostra 1' },
        { id: '2', nome: 'Amostra 2' },
      ];
      repository.findAndCount = jest
        .fn()
        .mockResolvedValue([amostras, amostras.length]);

      // Act
      const result = await service.findAll(1, 10);

      // Assert
      expect(result).toEqual({
        data: amostras,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por termo de busca', async () => {
      // Arrange
      const amostras = [{ id: '1', nome: 'Sangue' }];
      repository.findAndCount = jest
        .fn()
        .mockResolvedValue([amostras, amostras.length]);

      // Act
      await service.findAll(1, 10, 'Sangue');

      // Assert
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { nome: expect.anything() },
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por tipo de amostra', async () => {
      // Arrange
      const amostras = [{ id: '1', tipoAmostra: TipoAmostra.SANGUE }];
      repository.findAndCount = jest
        .fn()
        .mockResolvedValue([amostras, amostras.length]);

      // Act
      await service.findAll(1, 10, undefined, TipoAmostra.SANGUE);

      // Assert
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { tipoAmostra: TipoAmostra.SANGUE },
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por status ativo', async () => {
      // Arrange
      const amostras = [{ id: '1', ativo: true }];
      repository.findAndCount = jest
        .fn()
        .mockResolvedValue([amostras, amostras.length]);

      // Act
      await service.findAll(1, 10, undefined, undefined, true);

      // Assert
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { ativo: true },
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve calcular totalPages corretamente', async () => {
      // Arrange
      const amostras = Array(25).fill({ id: '1', nome: 'Amostra' });
      repository.findAndCount = jest.fn().mockResolvedValue([amostras, 25]);

      // Act
      const result = await service.findAll(1, 10);

      // Assert
      expect(result.totalPages).toBe(3); // 25 / 10 = 3 páginas
    });

    it('deve retornar array vazio quando não há amostras', async () => {
      // Arrange
      repository.findAndCount = jest.fn().mockResolvedValue([[], 0]);

      // Act
      const result = await service.findAll(1, 10);

      // Assert
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma amostra pelo ID', async () => {
      // Arrange
      const amostra = {
        id: 'amostra-uuid',
        nome: 'Sangue EDTA',
      };
      repository.findOne = jest.fn().mockResolvedValue(amostra);

      // Act
      const result = await service.findOne('amostra-uuid');

      // Assert
      expect(result).toEqual(amostra);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'amostra-uuid' },
      });
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
      });
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
      repository.findOne = jest.fn().mockResolvedValue(amostra);

      // Act
      const result = await service.findByCodigo('SANG-EDTA-001');

      // Assert
      expect(result).toEqual(amostra);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: 'SANG-EDTA-001' },
      });
    });

    it('deve lançar NotFoundException quando código não existe', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: 'NON-EXISTENT' },
      });
    });
  });

  describe('findByTipo', () => {
    it('deve retornar amostras por tipo', async () => {
      // Arrange
      const amostras = [
        { id: '1', tipoAmostra: TipoAmostra.SANGUE, ativo: true },
        { id: '2', tipoAmostra: TipoAmostra.SANGUE, ativo: true },
      ];
      repository.find = jest.fn().mockResolvedValue(amostras);

      // Act
      const result = await service.findByTipo(TipoAmostra.SANGUE);

      // Assert
      expect(result).toEqual(amostras);
      expect(repository.find).toHaveBeenCalledWith({
        where: { tipoAmostra: TipoAmostra.SANGUE, ativo: true },
        order: { nome: 'ASC' },
      });
    });

    it('deve retornar apenas amostras ativas', async () => {
      // Arrange
      const amostras = [{ id: '1', ativo: true }];
      repository.find = jest.fn().mockResolvedValue(amostras);

      // Act
      await service.findByTipo(TipoAmostra.URINA);

      // Assert
      expect(repository.find).toHaveBeenCalledWith({
        where: { tipoAmostra: TipoAmostra.URINA, ativo: true },
        order: { nome: 'ASC' },
      });
    });

    it('deve retornar array vazio quando não há amostras do tipo', async () => {
      // Arrange
      repository.find = jest.fn().mockResolvedValue([]);

      // Act
      const result = await service.findByTipo(TipoAmostra.OUTROS);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findAtivas', () => {
    it('deve retornar apenas amostras ativas', async () => {
      // Arrange
      const amostras = [
        { id: '1', ativo: true },
        { id: '2', ativo: true },
      ];
      repository.find = jest.fn().mockResolvedValue(amostras);

      // Act
      const result = await service.findAtivas();

      // Assert
      expect(result).toEqual(amostras);
      expect(repository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        order: { nome: 'ASC' },
      });
    });

    it('deve retornar array vazio quando não há amostras ativas', async () => {
      // Arrange
      repository.find = jest.fn().mockResolvedValue([]);

      // Act
      const result = await service.findAtivas();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    const usuarioId = 'user-uuid';
    const updateAmostraDto: UpdateAmostraDto = {
      nome: 'Nome Atualizado',
      descricao: 'Descrição atualizada',
    };

    const existingAmostra = {
      id: 'amostra-uuid',
      codigoInterno: 'SANG-EDTA-001',
      nome: 'Nome Original',
      descricao: 'Descrição original',
      tipoAmostra: TipoAmostra.SANGUE,
    };

    it('deve atualizar uma amostra com sucesso', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(existingAmostra);
      const updatedAmostra = {
        ...existingAmostra,
        ...updateAmostraDto,
        atualizadoPor: usuarioId,
      };
      repository.save = jest.fn().mockResolvedValue(updatedAmostra);

      // Act
      const result = await service.update(
        'amostra-uuid',
        updateAmostraDto,
        usuarioId,
      );

      // Assert
      expect(result).toEqual(updatedAmostra);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'amostra-uuid' },
      });
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('non-existent', updateAmostraDto, usuarioId),
      ).rejects.toThrow(NotFoundException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException ao tentar usar código já existente', async () => {
      // Arrange
      const updateWithNewCode: UpdateAmostraDto = {
        codigoInterno: 'CODIGO-EXISTENTE',
      };
      repository.findOne = jest
        .fn()
        .mockResolvedValueOnce(existingAmostra)
        .mockResolvedValueOnce({
          id: 'outro-id',
          codigoInterno: 'CODIGO-EXISTENTE',
        });

      // Act & Assert
      await expect(
        service.update('amostra-uuid', updateWithNewCode, usuarioId),
      ).rejects.toThrow(ConflictException);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('deve permitir atualização quando código não muda', async () => {
      // Arrange
      const updateSameCode: UpdateAmostraDto = {
        codigoInterno: 'SANG-EDTA-001',
        nome: 'Novo Nome',
      };
      repository.findOne = jest.fn().mockResolvedValue(existingAmostra);
      repository.save = jest.fn().mockResolvedValue({
        ...existingAmostra,
        ...updateSameCode,
      });

      // Act
      const result = await service.update(
        'amostra-uuid',
        updateSameCode,
        usuarioId,
      );

      // Assert
      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve validar dados ao atualizar', async () => {
      // Arrange
      const invalidUpdate: UpdateAmostraDto = {
        volumeMinimo: 10,
        volumeIdeal: 5,
      };
      repository.findOne = jest.fn().mockResolvedValue(existingAmostra);

      // Act & Assert
      await expect(
        service.update('amostra-uuid', invalidUpdate, usuarioId),
      ).rejects.toThrow(BadRequestException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const usuarioId = 'user-uuid';

    it('deve desativar amostra (soft delete)', async () => {
      // Arrange
      const amostra = {
        id: 'amostra-uuid',
        ativo: true,
      };
      repository.findOne = jest.fn().mockResolvedValue(amostra);
      repository.save = jest.fn().mockResolvedValue({
        ...amostra,
        ativo: false,
        atualizadoPor: usuarioId,
      });

      // Act
      await service.remove('amostra-uuid', usuarioId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'amostra-uuid' },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...amostra,
        ativo: false,
        atualizadoPor: usuarioId,
      });
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove('non-existent', usuarioId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    const usuarioId = 'user-uuid';

    it('deve ativar amostra', async () => {
      // Arrange
      const amostra = {
        id: 'amostra-uuid',
        ativo: false,
      };
      const activatedAmostra = {
        ...amostra,
        ativo: true,
        atualizadoPor: usuarioId,
      };
      repository.findOne = jest.fn().mockResolvedValue(amostra);
      repository.save = jest.fn().mockResolvedValue(activatedAmostra);

      // Act
      const result = await service.activate('amostra-uuid', usuarioId);

      // Assert
      expect(result).toEqual(activatedAmostra);
      expect(repository.save).toHaveBeenCalledWith({
        ...amostra,
        ativo: true,
        atualizadoPor: usuarioId,
      });
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.activate('non-existent', usuarioId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deactivate', () => {
    const usuarioId = 'user-uuid';

    it('deve desativar amostra', async () => {
      // Arrange
      const amostra = {
        id: 'amostra-uuid',
        ativo: true,
      };
      const deactivatedAmostra = {
        ...amostra,
        ativo: false,
        atualizadoPor: usuarioId,
      };
      repository.findOne = jest.fn().mockResolvedValue(amostra);
      repository.save = jest.fn().mockResolvedValue(deactivatedAmostra);

      // Act
      const result = await service.deactivate('amostra-uuid', usuarioId);

      // Assert
      expect(result).toEqual(deactivatedAmostra);
      expect(repository.save).toHaveBeenCalledWith({
        ...amostra,
        ativo: false,
        atualizadoPor: usuarioId,
      });
    });

    it('deve lançar NotFoundException quando amostra não existe', async () => {
      // Arrange
      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.deactivate('non-existent', usuarioId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas', async () => {
      // Arrange
      repository.count = jest
        .fn()
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(40) // ativas
        .mockResolvedValueOnce(10); // inativas

      const porTipoMock = [
        { tipo: 'sangue', quantidade: '20' },
        { tipo: 'urina', quantidade: '15' },
        { tipo: 'fezes', quantidade: '10' },
      ];

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(porTipoMock),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      // Act
      const result = await service.getStats();

      // Assert
      expect(result).toEqual({
        total: 50,
        ativas: 40,
        inativas: 10,
        porTipo: {
          sangue: 20,
          urina: 15,
          fezes: 10,
        },
      });
      expect(repository.count).toHaveBeenCalledTimes(3);
    });

    it('deve retornar estatísticas zeradas quando não há amostras', async () => {
      // Arrange
      repository.count = jest
        .fn()
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      // Act
      const result = await service.getStats();

      // Assert
      expect(result).toEqual({
        total: 0,
        ativas: 0,
        inativas: 0,
        porTipo: {},
      });
    });
  });

  describe('tratamento de erros', () => {
    it('deve tratar erro de conexão com banco de dados', async () => {
      // Arrange
      repository.find = jest
        .fn()
        .mockRejectedValue(new Error('Connection timeout'));

      // Act & Assert
      await expect(service.findAtivas()).rejects.toThrow('Connection timeout');
    });

    it('deve tratar erro de validação na criação', async () => {
      // Arrange
      const invalidDto = {
        codigoInterno: 'TEST',
        nome: 'Test',
        tipoAmostra: TipoAmostra.SANGUE,
        volumeMinimo: 10,
        volumeIdeal: 5,
      } as CreateAmostraDto;

      repository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(invalidDto, 'user-uuid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validações de negócio', () => {
    it('deve aceitar amostra sem volume informado', async () => {
      // Arrange
      const dto: CreateAmostraDto = {
        codigoInterno: 'TEST-001',
        nome: 'Teste',
        tipoAmostra: TipoAmostra.OUTROS,
      };

      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.create = jest.fn().mockReturnValue(dto);
      repository.save = jest.fn().mockResolvedValue({ id: 'uuid', ...dto });

      // Act
      const result = await service.create(dto, 'user-uuid');

      // Assert
      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve aceitar amostra sem temperatura informada', async () => {
      // Arrange
      const dto: CreateAmostraDto = {
        codigoInterno: 'TEST-002',
        nome: 'Teste 2',
        tipoAmostra: TipoAmostra.OUTROS,
      };

      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.create = jest.fn().mockReturnValue(dto);
      repository.save = jest.fn().mockResolvedValue({ id: 'uuid', ...dto });

      // Act
      const result = await service.create(dto, 'user-uuid');

      // Assert
      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve validar corretamente centrifugação completa', async () => {
      // Arrange
      const dto: CreateAmostraDto = {
        codigoInterno: 'TEST-003',
        nome: 'Teste 3',
        tipoAmostra: TipoAmostra.SANGUE,
        requerCentrifugacao: true,
        tempoCentrifugacao: 10,
        rotacaoCentrifugacao: 3000,
      };

      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.create = jest.fn().mockReturnValue(dto);
      repository.save = jest.fn().mockResolvedValue({ id: 'uuid', ...dto });

      // Act
      const result = await service.create(dto, 'user-uuid');

      // Assert
      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
