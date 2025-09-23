import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ModuloService } from './modulo.service';
import { Entidade } from './entities/entidade.entity';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

describe('ModuloService', () => {
  let service: ModuloService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuloService,
        {
          provide: getRepositoryToken(Entidade),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ModuloService>(ModuloService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma entidade com sucesso', async () => {
      // Arrange
      const createDto: CreateModuloDto = {
        nome: 'Test Entity',
        descricao: 'Test Description',
      };

      const savedEntity = {
        id: 'uuid-123',
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.save.mockResolvedValue(savedEntity);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(savedEntity);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro ao criar com dados inválidos', async () => {
      // Arrange
      const createDto: CreateModuloDto = {
        nome: '', // Nome vazio
        descricao: 'Test',
      };

      mockRepository.save.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow();
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });

    it('deve lançar erro ao tentar criar duplicado', async () => {
      // Arrange
      const createDto: CreateModuloDto = {
        nome: 'Existing Entity',
        descricao: 'Test',
      };

      mockRepository.save.mockRejectedValue({
        code: '23505', // PostgreSQL unique violation
        detail: 'Key (nome)=(Existing Entity) already exists.',
      });

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de entidades', async () => {
      // Arrange
      const entities = [
        { id: '1', nome: 'Entity 1' },
        { id: '2', nome: 'Entity 2' },
      ];

      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getManyAndCount.mockResolvedValue([entities, 2]);

      // Act
      const result = await service.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result).toEqual({
        data: entities,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('deve aplicar filtros corretamente', async () => {
      // Arrange
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      // Act
      await service.findAll({
        page: 1,
        limit: 10,
        search: 'test',
        status: 'active',
      });

      // Assert
      expect(queryBuilder.where).toHaveBeenCalled();
      expect(queryBuilder.andWhere).toHaveBeenCalled();
    });

    it('deve retornar array vazio quando não houver dados', async () => {
      // Arrange
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      // Act
      const result = await service.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma entidade pelo ID', async () => {
      // Arrange
      const entity = {
        id: 'uuid-123',
        nome: 'Test Entity',
        descricao: 'Test Description',
      };

      mockRepository.findOne.mockResolvedValue(entity);

      // Act
      const result = await service.findOne('uuid-123');

      // Assert
      expect(result).toEqual(entity);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      });
    });

    it('deve lançar NotFoundException quando entidade não existir', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve incluir relações quando solicitado', async () => {
      // Arrange
      const entity = {
        id: 'uuid-123',
        nome: 'Test',
        relacao: { id: '456', nome: 'Related' },
      };

      mockRepository.findOne.mockResolvedValue(entity);

      // Act
      const result = await service.findOne('uuid-123', {
        relations: ['relacao'],
      });

      // Assert
      expect(result).toEqual(entity);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
        relations: ['relacao'],
      });
    });
  });

  describe('update', () => {
    it('deve atualizar uma entidade com sucesso', async () => {
      // Arrange
      const updateDto: UpdateModuloDto = {
        nome: 'Updated Name',
      };

      const existingEntity = {
        id: 'uuid-123',
        nome: 'Old Name',
        descricao: 'Description',
      };

      const updatedEntity = {
        ...existingEntity,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(existingEntity);
      mockRepository.save.mockResolvedValue(updatedEntity);

      // Act
      const result = await service.update('uuid-123', updateDto);

      // Assert
      expect(result).toEqual(updatedEntity);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...existingEntity,
        ...updateDto,
      });
    });

    it('deve lançar NotFoundException ao atualizar entidade inexistente', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('non-existent', { nome: 'New' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve ignorar campos undefined no update', async () => {
      // Arrange
      const updateDto: UpdateModuloDto = {
        nome: 'Updated',
        descricao: undefined, // Should be ignored
      };

      const existingEntity = {
        id: 'uuid-123',
        nome: 'Old',
        descricao: 'Keep This',
      };

      mockRepository.findOne.mockResolvedValue(existingEntity);
      mockRepository.save.mockResolvedValue({
        ...existingEntity,
        nome: updateDto.nome,
      });

      // Act
      const result = await service.update('uuid-123', updateDto);

      // Assert
      expect(result.descricao).toBe('Keep This');
    });
  });

  describe('remove', () => {
    it('deve remover uma entidade com sucesso (soft delete)', async () => {
      // Arrange
      const entity = {
        id: 'uuid-123',
        nome: 'To Delete',
        ativo: true,
      };

      mockRepository.findOne.mockResolvedValue(entity);
      mockRepository.save.mockResolvedValue({ ...entity, ativo: false });

      // Act
      await service.remove('uuid-123');

      // Assert
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...entity,
        ativo: false,
      });
    });

    it('deve lançar NotFoundException ao remover entidade inexistente', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve fazer hard delete quando configurado', async () => {
      // Arrange
      const entity = { id: 'uuid-123', nome: 'To Delete' };

      mockRepository.findOne.mockResolvedValue(entity);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      // Act
      await service.remove('uuid-123', { hardDelete: true });

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith('uuid-123');
    });
  });

  describe('validações de negócio', () => {
    it('deve validar regras de negócio antes de criar', async () => {
      // Implemente validações específicas do módulo
    });

    it('deve aplicar transformações nos dados antes de salvar', async () => {
      // Teste transformações como uppercase, trim, etc
    });

    it('deve registrar auditoria ao modificar dados', async () => {
      // Teste integração com módulo de auditoria
    });
  });

  describe('tratamento de erros', () => {
    it('deve tratar erro de conexão com banco', async () => {
      // Arrange
      mockRepository.find.mockRejectedValue(new Error('Connection timeout'));

      // Act & Assert
      await expect(service.findAll({})).rejects.toThrow();
    });

    it('deve tratar erro de constraint violation', async () => {
      // Teste violações de FK, unique, etc
    });
  });
});
