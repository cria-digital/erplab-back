import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { BancoService } from './banco.service';
import { Banco, StatusBanco } from './entities/banco.entity';
import { AuditoriaService } from '../../infraestrutura/auditoria/auditoria.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';

describe('BancoService', () => {
  let service: BancoService;

  const mockBanco: Partial<Banco> = {
    id: 'banco-uuid-1',
    codigo: '001',
    codigo_interno: 'BB',
    nome: 'Banco do Brasil S.A.',
    status: StatusBanco.ATIVO,
    descricao: 'Banco do Brasil S.A. - Código FEBRABAN: 001',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAuditoriaService = {
    registrarLog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BancoService,
        {
          provide: getRepositoryToken(Banco),
          useValue: mockRepository,
        },
        {
          provide: AuditoriaService,
          useValue: mockAuditoriaService,
        },
      ],
    }).compile();

    service = module.get<BancoService>(BancoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new banco', async () => {
      const createDto: CreateBancoDto = {
        codigo: '999',
        codigo_interno: 'NOVO',
        nome: 'Banco Novo S.A.',
        status: StatusBanco.ATIVO,
        descricao: 'Novo banco digital',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBanco);
      mockRepository.save.mockResolvedValue(mockBanco);

      const result = await service.create(createDto, 'user-id');

      expect(result).toEqual(mockBanco);
      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockAuditoriaService.registrarLog).toHaveBeenCalled();
    });

    it('should throw ConflictException if codigo already exists', async () => {
      const createDto: CreateBancoDto = {
        codigo: '001',
        codigo_interno: 'BB',
        nome: 'Banco do Brasil S.A.',
        status: StatusBanco.ATIVO,
      };

      mockRepository.findOne.mockResolvedValue(mockBanco);

      await expect(service.create(createDto, 'user-id')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated bancos', async () => {
      const bancos = [mockBanco];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([bancos, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll();

      expect(result.data).toEqual(bancos);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a banco by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBanco);

      const result = await service.findOne('banco-uuid-1');

      expect(result).toEqual(mockBanco);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'banco-uuid-1' },
        relations: ['contas'],
      });
    });

    it('should throw NotFoundException if banco not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a banco', async () => {
      const updateDto: UpdateBancoDto = {
        descricao: 'Banco do Brasil - Atualizado',
      };

      const updatedBanco = { ...mockBanco, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockBanco);
      mockRepository.save.mockResolvedValue(updatedBanco);

      const result = await service.update('banco-uuid-1', updateDto, 'user-id');

      expect(result).toEqual(updatedBanco);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockAuditoriaService.registrarLog).toHaveBeenCalled();
    });

    it('should throw NotFoundException if banco not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', {}, 'user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a banco', async () => {
      mockRepository.findOne.mockResolvedValue(mockBanco);
      mockRepository.remove.mockResolvedValue(mockBanco);

      await service.remove('banco-uuid-1', 'user-id');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockBanco);
      expect(mockAuditoriaService.registrarLog).toHaveBeenCalled();
    });

    it('should throw NotFoundException if banco not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id', 'user-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if banco has associated accounts', async () => {
      const bancoWithAccounts = {
        ...mockBanco,
        contas: [{ id: 'conta-1' }],
      };

      mockRepository.findOne.mockResolvedValue(bancoWithAccounts);

      await expect(service.remove('banco-uuid-1', 'user-id')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle banco status from ativo to inativo', async () => {
      const bancoInativo = { ...mockBanco, status: StatusBanco.INATIVO };

      mockRepository.findOne.mockResolvedValue(mockBanco);
      mockRepository.save.mockResolvedValue(bancoInativo);

      const result = await service.toggleStatus('banco-uuid-1', 'user-id');

      expect(result.status).toBe(StatusBanco.INATIVO);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockAuditoriaService.registrarLog).toHaveBeenCalled();
    });

    it('should toggle banco status from inativo to ativo', async () => {
      const bancoInativo = { ...mockBanco, status: StatusBanco.INATIVO };
      const bancoAtivo = { ...mockBanco, status: StatusBanco.ATIVO };

      mockRepository.findOne.mockResolvedValue(bancoInativo);
      mockRepository.save.mockResolvedValue(bancoAtivo);

      const result = await service.toggleStatus('banco-uuid-1', 'user-id');

      expect(result.status).toBe(StatusBanco.ATIVO);
    });
  });

  describe('findByCodigo', () => {
    it('should find banco by codigo FEBRABAN', async () => {
      mockRepository.findOne.mockResolvedValue(mockBanco);

      const result = await service.findByCodigo('001');

      expect(result).toEqual(mockBanco);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: '001' },
      });
    });

    it('should throw NotFoundException if banco not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('should return only active bancos', async () => {
      const bancosAtivos = [mockBanco];
      mockRepository.find.mockResolvedValue(bancosAtivos);

      const result = await service.findAtivos();

      expect(result).toEqual(bancosAtivos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: StatusBanco.ATIVO },
        order: { nome: 'ASC' },
      });
    });
  });
});
