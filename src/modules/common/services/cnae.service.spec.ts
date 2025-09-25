import { Test, TestingModule } from '@nestjs/testing';
import { CnaeService } from './cnae.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import { Cnae } from '../entities/cnae.entity';
import { NotFoundException } from '@nestjs/common';
import { PaginatedResultDto } from '../../../common/dto/pagination.dto';

describe('CnaeService', () => {
  let service: CnaeService;

  const mockCnaeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getMany: jest.fn(),
  };

  const mockCnae = {
    id: 'cnae-id',
    codigo: '8610101',
    descricao: 'Atividades de atendimento hospitalar',
    descricaoSubclasse:
      'Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências',
    secao: 'Q',
    divisao: '86',
    grupo: '861',
    classe: '8610',
    subclasse: '86101',
    ativo: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CnaeService,
        {
          provide: getRepositoryToken(Cnae),
          useValue: mockCnaeRepository,
        },
      ],
    }).compile();

    service = module.get<CnaeService>(CnaeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new CNAE', async () => {
      const createDto = {
        codigo: '8610101',
        descricao: 'Atividades de atendimento hospitalar',
        secao: 'Q',
        divisao: '86',
      };

      mockCnaeRepository.create.mockReturnValue(mockCnae);
      mockCnaeRepository.save.mockResolvedValue(mockCnae);

      const result = await service.create(createDto as any);

      expect(result).toEqual(mockCnae);
      expect(mockCnaeRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockCnaeRepository.save).toHaveBeenCalledWith(mockCnae);
    });
  });

  describe('findAll', () => {
    it('should return paginated CNAEs', async () => {
      const searchDto = { page: 1, limit: 10 };
      const cnaes = [mockCnae];

      mockCnaeRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue(cnaes);

      const result = await service.findAll(searchDto as any);

      expect(result).toBeInstanceOf(PaginatedResultDto);
      expect(result.data).toEqual(cnaes);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasPrevPage).toBe(false);
      expect(result.meta.hasNextPage).toBe(false);
    });

    it('should filter by codigo', async () => {
      const searchDto = { codigo: '8610', page: 1, limit: 10 };
      const cnaes = [mockCnae];

      mockCnaeRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue(cnaes);

      await service.findAll(searchDto as any);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'cnae.codigo LIKE :codigo',
        { codigo: '%8610%' },
      );
    });

    it('should filter by descricao', async () => {
      const searchDto = { descricao: 'hospital', page: 1, limit: 10 };
      const cnaes = [mockCnae];

      mockCnaeRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue(cnaes);

      await service.findAll(searchDto as any);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(cnae.descricao) LIKE LOWER(:descricao)',
        { descricao: '%hospital%' },
      );
    });

    it('should filter by secao', async () => {
      const searchDto = { secao: 'Q', page: 1, limit: 10 };
      const cnaes = [mockCnae];

      mockCnaeRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue(cnaes);

      await service.findAll(searchDto as any);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'cnae.secao = :secao',
        { secao: 'Q' },
      );
    });

    it('should filter by ativo status', async () => {
      const searchDto = { ativo: true, page: 1, limit: 10 };
      const cnaes = [mockCnae];

      mockCnaeRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue(cnaes);

      await service.findAll(searchDto as any);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'cnae.ativo = :ativo',
        { ativo: true },
      );
    });

    it('should use default pagination values', async () => {
      const cnaes = [mockCnae];

      mockCnaeRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue(cnaes);

      const result = await service.findAll();

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should return a CNAE by id', async () => {
      mockCnaeRepository.findOne.mockResolvedValue(mockCnae);

      const result = await service.findOne('cnae-id');

      expect(result).toEqual(mockCnae);
      expect(mockCnaeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'cnae-id' },
      });
    });

    it('should throw NotFoundException when CNAE not found', async () => {
      mockCnaeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException('CNAE com ID invalid-id não encontrado'),
      );
    });
  });

  describe('findByCodigo', () => {
    it('should return a CNAE by codigo', async () => {
      mockCnaeRepository.findOne.mockResolvedValue(mockCnae);

      const result = await service.findByCodigo('8610101');

      expect(result).toEqual(mockCnae);
      expect(mockCnaeRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: '8610101' },
      });
    });

    it('should throw NotFoundException when CNAE not found by codigo', async () => {
      mockCnaeRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('0000000')).rejects.toThrow(
        new NotFoundException('CNAE com código 0000000 não encontrado'),
      );
    });
  });

  describe('update', () => {
    it('should update a CNAE', async () => {
      const updateDto = { descricao: 'Nova descrição' };
      const updatedCnae = { ...mockCnae, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockCnae as any);
      mockCnaeRepository.save.mockResolvedValue(updatedCnae);

      const result = await service.update('cnae-id', updateDto);

      expect(result).toEqual(updatedCnae);
      expect(mockCnaeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent CNAE', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException('CNAE com ID invalid-id não encontrado'),
        );

      await expect(
        service.update('invalid-id', { descricao: 'Nova' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a CNAE', async () => {
      const cnaeToRemove = { ...mockCnae };
      jest.spyOn(service, 'findOne').mockResolvedValue(cnaeToRemove as any);
      mockCnaeRepository.save.mockResolvedValue({
        ...cnaeToRemove,
        ativo: false,
      });

      await service.remove('cnae-id');

      expect(cnaeToRemove.ativo).toBe(false);
      expect(mockCnaeRepository.save).toHaveBeenCalledWith(cnaeToRemove);
    });

    it('should throw NotFoundException when removing non-existent CNAE', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException('CNAE com ID invalid-id não encontrado'),
        );

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('should search CNAEs by termo', async () => {
      const termo = 'hospital';
      const cnaes = [mockCnae];
      mockCnaeRepository.find.mockResolvedValue(cnaes);

      const result = await service.search(termo);

      expect(result).toEqual(cnaes);
      expect(mockCnaeRepository.find).toHaveBeenCalledWith({
        where: [
          { codigo: ILike(`%${termo}%`) },
          { descricao: ILike(`%${termo}%`) },
          { descricaoSubclasse: ILike(`%${termo}%`) },
        ],
        take: 20,
        order: { codigo: 'ASC' },
      });
    });

    it('should return empty array when no matches found', async () => {
      mockCnaeRepository.find.mockResolvedValue([]);

      const result = await service.search('xyz123');

      expect(result).toEqual([]);
    });
  });
});
