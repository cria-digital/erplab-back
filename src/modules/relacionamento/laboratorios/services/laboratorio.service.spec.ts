import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { LaboratorioService } from './laboratorio.service';
import { Laboratorio } from '../entities/laboratorio.entity';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('LaboratorioService', () => {
  let service: LaboratorioService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockLaboratorioRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Laboratório Teste Ltda',
    nomeFantasia: 'Lab Teste',
    emailComercial: 'contato@labteste.com.br',
    ativo: true,
  };

  const mockLaboratorio = {
    id: 'laboratorio-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigo_laboratorio: 'LAB001',
    integracao_id: null,
    observacoes: 'Laboratório especializado em análises clínicas',
    created_at: new Date(),
    updated_at: new Date(),
  } as Laboratorio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LaboratorioService,
        {
          provide: getRepositoryToken(Laboratorio),
          useValue: mockLaboratorioRepository,
        },
      ],
    }).compile();

    service = module.get<LaboratorioService>(LaboratorioService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of laboratorios', async () => {
      mockLaboratorioRepository.find.mockResolvedValue([mockLaboratorio]);

      const result = await service.findAll();

      expect(result).toEqual([mockLaboratorio]);
      expect(mockLaboratorioRepository.find).toHaveBeenCalledWith({
        relations: ['empresa'],
        order: { codigo_laboratorio: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a laboratorio by id', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);

      const result = await service.findOne('laboratorio-uuid-1');

      expect(result).toEqual(mockLaboratorio);
      expect(mockLaboratorioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'laboratorio-uuid-1' },
      });
    });

    it('should throw NotFoundException when laboratorio not found', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('should return a laboratorio by codigo', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);

      const result = await service.findByCodigo('LAB001');

      expect(result).toEqual(mockLaboratorio);
      expect(mockLaboratorioRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_laboratorio: 'LAB001' },
        relations: ['empresa'],
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('should return a laboratorio by CNPJ', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockLaboratorio);
      expect(mockLaboratorioRepository.findOne).toHaveBeenCalledWith({
        where: { empresa: { cnpj: '12.345.678/0001-90' } },
        relations: ['empresa'],
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('should return array of active laboratorios', async () => {
      mockLaboratorioRepository.find.mockResolvedValue([mockLaboratorio]);

      const result = await service.findAtivos();

      expect(result).toEqual([mockLaboratorio]);
      expect(mockLaboratorioRepository.find).toHaveBeenCalledWith({
        where: { empresa: { ativo: true } },
        relations: ['empresa'],
        order: { codigo_laboratorio: 'ASC' },
      });
    });
  });

  describe('update', () => {
    it('should update a laboratorio', async () => {
      const updateDto: UpdateLaboratorioDto = {
        integracaoId: 'integracao-uuid',
        observacoes: 'Observações atualizadas',
      };
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);
      mockLaboratorioRepository.save.mockResolvedValue({
        ...mockLaboratorio,
        ...updateDto,
      });

      const result = await service.update('laboratorio-uuid-1', updateDto);

      expect(mockLaboratorioRepository.save).toHaveBeenCalled();
      expect(result.observacoes).toBe('Observações atualizadas');
    });

    it('should throw NotFoundException when laboratorio not found', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { observacoes: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a laboratorio', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);
      mockLaboratorioRepository.remove.mockResolvedValue(mockLaboratorio);

      await service.remove('laboratorio-uuid-1');

      expect(mockLaboratorioRepository.remove).toHaveBeenCalledWith(
        mockLaboratorio,
      );
    });

    it('should throw NotFoundException when not found', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle laboratorio status', async () => {
      const labWithEmpresa = {
        ...mockLaboratorio,
        empresa: { ...mockEmpresa, ativo: true },
      };
      mockLaboratorioRepository.findOne.mockResolvedValue(labWithEmpresa);
      mockLaboratorioRepository.save.mockResolvedValue({
        ...labWithEmpresa,
        empresa: { ...mockEmpresa, ativo: false },
      });

      const result = await service.toggleStatus('laboratorio-uuid-1');

      expect(mockLaboratorioRepository.save).toHaveBeenCalled();
      expect(result.empresa.ativo).toBe(false);
    });
  });

  describe('search', () => {
    it('should return laboratorios matching query', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockLaboratorio]);

      const result = await service.search('Lab Teste');

      expect(result).toEqual([mockLaboratorio]);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.orWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'empresa.nomeFantasia',
        'ASC',
      );
    });

    it('should return empty array when no matches', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('NonExistent');

      expect(result).toEqual([]);
    });
  });
});
