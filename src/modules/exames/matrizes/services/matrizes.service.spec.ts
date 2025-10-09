import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MatrizesService } from './matrizes.service';
import {
  MatrizExame,
  TipoMatriz,
  StatusMatriz,
} from '../entities/matriz-exame.entity';
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
    codigoInterno: 'MTZ-AUDIO-001',
    nome: 'Audiometria Tonal',
    descricao: 'Matriz padrão para audiometria tonal',
    tipoMatriz: TipoMatriz.AUDIOMETRIA,
    versao: '1.0',
    padraoSistema: false,
    temCalculoAutomatico: false,
    status: StatusMatriz.ATIVO,
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
    codigoCampo: 'freq_500',
    label: '500 Hz',
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
      codigoInterno: 'MTZ-AUDIO-001',
      nome: 'Audiometria Tonal',
      descricao: 'Matriz padrão para audiometria tonal',
      tipoMatriz: TipoMatriz.AUDIOMETRIA,
      versao: '1.0',
      campos: [
        {
          codigoCampo: 'freq_500',
          label: '500 Hz',
          tipoCampo: TipoCampoMatriz.DECIMAL,
          obrigatorio: true,
          ordemExibicao: 1,
        },
      ],
    };

    it('deve criar uma matriz com campos com sucesso', async () => {
      // Arrange
      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue(mockMatriz);
      mockQueryRunner.manager.save.mockResolvedValue(mockMatriz);
      mockCampoMatrizRepository.create.mockReturnValue(mockCampo);

      // Mock do findOne no final para retornar a matriz completa
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockMatriz,
        campos: [mockCampo],
      } as MatrizExame);

      // Act
      const result = await service.create(createMatrizDto, usuarioId);

      // Assert
      expect(mockMatrizRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createMatrizDto.codigoInterno },
      });
      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result).toEqual({ ...mockMatriz, campos: [mockCampo] });
    });

    it('deve criar matriz sem campos', async () => {
      // Arrange
      const dtoSemCampos = { ...createMatrizDto, campos: [] };
      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue(mockMatriz);
      mockQueryRunner.manager.save.mockResolvedValue(mockMatriz);

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ ...mockMatriz, campos: [] } as MatrizExame);

      // Act
      const result = await service.create(dtoSemCampos, usuarioId);

      // Assert
      expect(result.campos).toEqual([]);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando código já existe', async () => {
      // Arrange
      mockMatrizRepository.findOne.mockResolvedValue(mockMatriz);

      // Act & Assert
      await expect(service.create(createMatrizDto, usuarioId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createMatrizDto, usuarioId)).rejects.toThrow(
        `Matriz com código ${createMatrizDto.codigoInterno} já existe`,
      );
      expect(mockDataSource.createQueryRunner).not.toHaveBeenCalled();
    });

    it('deve fazer rollback em caso de erro', async () => {
      // Arrange
      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue(mockMatriz);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.create(createMatrizDto, usuarioId)).rejects.toThrow(
        'Database error',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de matrizes', async () => {
      // Arrange
      const matrizes = [mockMatriz];
      mockMatrizRepository.findAndCount.mockResolvedValue([matrizes, 1]);

      // Act
      const result = await service.findAll(1, 10);

      // Assert
      expect(result).toEqual({
        data: matrizes,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockMatrizRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ['campos'],
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por termo de busca', async () => {
      // Arrange
      mockMatrizRepository.findAndCount.mockResolvedValue([[mockMatriz], 1]);

      // Act
      await service.findAll(1, 10, 'Audiometria');

      // Assert
      expect(mockMatrizRepository.findAndCount).toHaveBeenCalledWith({
        where: { nome: expect.anything() },
        relations: ['campos'],
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por tipo de matriz', async () => {
      // Arrange
      mockMatrizRepository.findAndCount.mockResolvedValue([[mockMatriz], 1]);

      // Act
      await service.findAll(1, 10, undefined, TipoMatriz.AUDIOMETRIA);

      // Assert
      expect(mockMatrizRepository.findAndCount).toHaveBeenCalledWith({
        where: { tipoMatriz: TipoMatriz.AUDIOMETRIA },
        relations: ['campos'],
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por status', async () => {
      // Arrange
      mockMatrizRepository.findAndCount.mockResolvedValue([[mockMatriz], 1]);

      // Act
      await service.findAll(1, 10, undefined, undefined, StatusMatriz.ATIVO);

      // Assert
      expect(mockMatrizRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: StatusMatriz.ATIVO },
        relations: ['campos'],
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve filtrar por ativo', async () => {
      // Arrange
      mockMatrizRepository.findAndCount.mockResolvedValue([[mockMatriz], 1]);

      // Act
      await service.findAll(1, 10, undefined, undefined, undefined, true);

      // Assert
      expect(mockMatrizRepository.findAndCount).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['campos'],
        order: { nome: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve calcular totalPages corretamente', async () => {
      // Arrange
      const matrizes = Array(25).fill(mockMatriz);
      mockMatrizRepository.findAndCount.mockResolvedValue([matrizes, 25]);

      // Act
      const result = await service.findAll(1, 10);

      // Assert
      expect(result.totalPages).toBe(3);
    });

    it('deve retornar array vazio quando não há matrizes', async () => {
      // Arrange
      mockMatrizRepository.findAndCount.mockResolvedValue([[], 0]);

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
    it('deve retornar uma matriz por ID', async () => {
      // Arrange
      mockMatrizRepository.findOne.mockResolvedValue(mockMatriz);

      // Act
      const result = await service.findOne('matriz-uuid');

      // Assert
      expect(result).toEqual(mockMatriz);
      expect(mockMatrizRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'matriz-uuid' },
        relations: ['campos', 'tipoExame', 'exame'],
      });
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      mockMatrizRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent')).rejects.toThrow(
        'Matriz com ID non-existent não encontrada',
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar matriz por código interno', async () => {
      // Arrange
      mockMatrizRepository.findOne.mockResolvedValue(mockMatriz);

      // Act
      const result = await service.findByCodigo('MTZ-AUDIO-001');

      // Assert
      expect(result).toEqual(mockMatriz);
      expect(mockMatrizRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: 'MTZ-AUDIO-001' },
        relations: ['campos'],
      });
    });

    it('deve lançar NotFoundException quando código não existe', async () => {
      // Arrange
      mockMatrizRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        'Matriz com código NON-EXISTENT não encontrada',
      );
    });
  });

  describe('findByTipo', () => {
    it('deve retornar matrizes por tipo', async () => {
      // Arrange
      mockMatrizRepository.find.mockResolvedValue([mockMatriz]);

      // Act
      const result = await service.findByTipo(TipoMatriz.AUDIOMETRIA);

      // Assert
      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizRepository.find).toHaveBeenCalledWith({
        where: { tipoMatriz: TipoMatriz.AUDIOMETRIA, ativo: true },
        relations: ['campos'],
        order: { nome: 'ASC' },
      });
    });

    it('deve retornar array vazio quando não há matrizes do tipo', async () => {
      // Arrange
      mockMatrizRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findByTipo(TipoMatriz.HEMOGRAMA);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findPadrao', () => {
    it('deve retornar matrizes padrão do sistema', async () => {
      // Arrange
      const matrizPadrao = { ...mockMatriz, padraoSistema: true };
      mockMatrizRepository.find.mockResolvedValue([matrizPadrao]);

      // Act
      const result = await service.findPadrao();

      // Assert
      expect(result).toEqual([matrizPadrao]);
      expect(mockMatrizRepository.find).toHaveBeenCalledWith({
        where: { padraoSistema: true, ativo: true },
        relations: ['campos'],
        order: { tipoMatriz: 'ASC', nome: 'ASC' },
      });
    });
  });

  describe('findAtivas', () => {
    it('deve retornar apenas matrizes ativas', async () => {
      // Arrange
      mockMatrizRepository.find.mockResolvedValue([mockMatriz]);

      // Act
      const result = await service.findAtivas();

      // Assert
      expect(result).toEqual([mockMatriz]);
      expect(mockMatrizRepository.find).toHaveBeenCalledWith({
        where: { ativo: true, status: StatusMatriz.ATIVO },
        relations: ['campos'],
        order: { nome: 'ASC' },
      });
    });
  });

  describe('update', () => {
    const usuarioId = 'user-uuid';
    const updateMatrizDto: UpdateMatrizDto = {
      nome: 'Audiometria Tonal Atualizada',
      descricao: 'Descrição atualizada',
    };

    it('deve atualizar uma matriz com sucesso', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockQueryRunner.manager.save.mockResolvedValue({
        ...mockMatriz,
        ...updateMatrizDto,
      });

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockMatriz as MatrizExame)
        .mockResolvedValueOnce({
          ...mockMatriz,
          ...updateMatrizDto,
        } as MatrizExame);

      // Act
      const result = await service.update(
        'matriz-uuid',
        updateMatrizDto,
        usuarioId,
      );

      // Assert
      expect(result.nome).toBe('Audiometria Tonal Atualizada');
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Matriz não encontrada'));

      // Act & Assert
      await expect(
        service.update('non-existent', updateMatrizDto, usuarioId),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar BadRequestException ao tentar desmarcar padrão do sistema', async () => {
      // Arrange
      const matrizPadrao = { ...mockMatriz, padraoSistema: true };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(matrizPadrao as MatrizExame);

      const updateDto: UpdateMatrizDto = { padraoSistema: false };

      // Act & Assert
      await expect(
        service.update('matriz-uuid', updateDto, usuarioId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update('matriz-uuid', updateDto, usuarioId),
      ).rejects.toThrow('Não é possível desmarcar matriz padrão do sistema');
    });

    it('deve lançar ConflictException ao tentar usar código já existente', async () => {
      // Arrange
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

      // Act & Assert
      await expect(
        service.update('matriz-uuid', updateDto, usuarioId),
      ).rejects.toThrow(ConflictException);
    });

    it('deve permitir atualização quando código não muda', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockMatriz as MatrizExame)
        .mockResolvedValueOnce({
          ...mockMatriz,
          nome: 'Novo Nome',
        } as MatrizExame);
      mockQueryRunner.manager.save.mockResolvedValue({
        ...mockMatriz,
        nome: 'Novo Nome',
      });

      const updateDto: UpdateMatrizDto = {
        codigoInterno: 'MTZ-AUDIO-001',
        nome: 'Novo Nome',
      };

      // Act
      const result = await service.update('matriz-uuid', updateDto, usuarioId);

      // Assert
      expect(result).toBeDefined();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve fazer rollback em caso de erro', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(
        service.update('matriz-uuid', updateMatrizDto, usuarioId),
      ).rejects.toThrow('Database error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const usuarioId = 'user-uuid';

    it('deve desativar matriz (soft delete)', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockMatrizRepository.save.mockResolvedValue({
        ...mockMatriz,
        ativo: false,
      });

      // Act
      await service.remove('matriz-uuid', usuarioId);

      // Assert
      expect(mockMatrizRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ativo: false,
          atualizadoPor: usuarioId,
        }),
      );
    });

    it('deve lançar BadRequestException ao tentar remover matriz padrão', async () => {
      // Arrange
      const matrizPadrao = { ...mockMatriz, padraoSistema: true };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(matrizPadrao as MatrizExame);

      // Act & Assert
      await expect(service.remove('matriz-uuid', usuarioId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.remove('matriz-uuid', usuarioId)).rejects.toThrow(
        'Não é possível remover matriz padrão do sistema',
      );
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Matriz não encontrada'));

      // Act & Assert
      await expect(service.remove('non-existent', usuarioId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('activate', () => {
    const usuarioId = 'user-uuid';

    it('deve ativar matriz', async () => {
      // Arrange
      const matrizInativa = {
        ...mockMatriz,
        ativo: false,
        status: StatusMatriz.INATIVO,
      };
      const matrizAtivada = {
        ...mockMatriz,
        ativo: true,
        status: StatusMatriz.ATIVO,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(matrizInativa as MatrizExame)
        .mockResolvedValueOnce(matrizAtivada as MatrizExame);
      mockMatrizRepository.save.mockResolvedValue(matrizAtivada);

      // Act
      const result = await service.activate('matriz-uuid', usuarioId);

      // Assert
      expect(result.ativo).toBe(true);
      expect(result.status).toBe(StatusMatriz.ATIVO);
      expect(mockMatrizRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ativo: true,
          status: StatusMatriz.ATIVO,
          atualizadoPor: usuarioId,
        }),
      );
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Matriz não encontrada'));

      // Act & Assert
      await expect(service.activate('non-existent', usuarioId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deactivate', () => {
    const usuarioId = 'user-uuid';

    it('deve desativar matriz', async () => {
      // Arrange
      const matrizDesativada = {
        ...mockMatriz,
        ativo: false,
        status: StatusMatriz.INATIVO,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockMatriz as MatrizExame)
        .mockResolvedValueOnce(matrizDesativada as MatrizExame);
      mockMatrizRepository.save.mockResolvedValue(matrizDesativada);

      // Act
      const result = await service.deactivate('matriz-uuid', usuarioId);

      // Assert
      expect(result.ativo).toBe(false);
      expect(result.status).toBe(StatusMatriz.INATIVO);
    });

    it('deve lançar BadRequestException ao tentar desativar matriz padrão', async () => {
      // Arrange
      const matrizPadrao = { ...mockMatriz, padraoSistema: true };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(matrizPadrao as MatrizExame);

      // Act & Assert
      await expect(
        service.deactivate('matriz-uuid', usuarioId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.deactivate('matriz-uuid', usuarioId),
      ).rejects.toThrow('Não é possível desativar matriz padrão do sistema');
    });

    it('deve lançar NotFoundException quando matriz não existe', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Matriz não encontrada'));

      // Act & Assert
      await expect(
        service.deactivate('non-existent', usuarioId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('duplicate', () => {
    const usuarioId = 'user-uuid';
    const novoCodigoInterno = 'MTZ-AUDIO-002';
    const novoNome = 'Audiometria Tonal - Cópia';

    it('deve duplicar matriz com campos', async () => {
      // Arrange
      const matrizComCampos = { ...mockMatriz, campos: [mockCampo] };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(matrizComCampos as MatrizExame)
        .mockResolvedValueOnce({
          ...mockMatriz,
          id: 'nova-matriz-uuid',
          codigoInterno: novoCodigoInterno,
          nome: novoNome,
          padraoSistema: false,
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

      // Act
      const result = await service.duplicate(
        'matriz-uuid',
        novoCodigoInterno,
        novoNome,
        usuarioId,
      );

      // Assert
      expect(result.codigoInterno).toBe(novoCodigoInterno);
      expect(result.nome).toBe(novoNome);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando novo código já existe', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockMatrizRepository.findOne.mockResolvedValue({
        id: 'outra-matriz',
        codigoInterno: novoCodigoInterno,
      });

      // Act & Assert
      await expect(
        service.duplicate(
          'matriz-uuid',
          novoCodigoInterno,
          novoNome,
          usuarioId,
        ),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.duplicate(
          'matriz-uuid',
          novoCodigoInterno,
          novoNome,
          usuarioId,
        ),
      ).rejects.toThrow(`Matriz com código ${novoCodigoInterno} já existe`);
    });

    it('deve fazer rollback em caso de erro', async () => {
      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockMatriz as MatrizExame);
      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue(mockMatriz);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(
        service.duplicate(
          'matriz-uuid',
          novoCodigoInterno,
          novoNome,
          usuarioId,
        ),
      ).rejects.toThrow('Database error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve criar cópia como não-padrão mesmo que original seja padrão', async () => {
      // Arrange
      const matrizPadrao = { ...mockMatriz, padraoSistema: true };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(matrizPadrao as MatrizExame)
        .mockResolvedValueOnce({
          ...mockMatriz,
          id: 'nova-matriz-uuid',
          padraoSistema: false,
        } as MatrizExame);

      mockMatrizRepository.findOne.mockResolvedValue(null);
      mockMatrizRepository.create.mockReturnValue({
        ...mockMatriz,
        padraoSistema: false,
      });
      mockQueryRunner.manager.save.mockResolvedValue({
        ...mockMatriz,
        id: 'nova-matriz-uuid',
        padraoSistema: false,
      });
      mockCampoMatrizRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.duplicate(
        'matriz-uuid',
        novoCodigoInterno,
        novoNome,
        usuarioId,
      );

      // Assert
      expect(result.padraoSistema).toBe(false);
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas', async () => {
      // Arrange
      mockMatrizRepository.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(40) // ativas
        .mockResolvedValueOnce(10); // inativas

      const porTipoMock = [
        { tipo: 'audiometria', quantidade: '20' },
        { tipo: 'hemograma', quantidade: '15' },
        { tipo: 'densitometria', quantidade: '10' },
      ];

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(porTipoMock),
      };
      mockMatrizRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      // Act
      const result = await service.getStats();

      // Assert
      expect(result).toEqual({
        total: 50,
        ativas: 40,
        inativas: 10,
        porTipo: {
          audiometria: 20,
          hemograma: 15,
          densitometria: 10,
        },
      });
      expect(mockMatrizRepository.count).toHaveBeenCalledTimes(3);
    });

    it('deve retornar estatísticas zeradas quando não há matrizes', async () => {
      // Arrange
      mockMatrizRepository.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      mockMatrizRepository.createQueryBuilder.mockReturnValue(queryBuilder);

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
      mockMatrizRepository.find.mockRejectedValue(
        new Error('Connection timeout'),
      );

      // Act & Assert
      await expect(service.findAtivas()).rejects.toThrow('Connection timeout');
    });
  });
});
