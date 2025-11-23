import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TelemedicinaService } from './telemedicina.service';
import { Telemedicina } from '../entities/telemedicina.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { UpdateTelemedicinaDto } from '../dto/update-telemedicina.dto';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('TelemedicinaService', () => {
  let service: TelemedicinaService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
  };

  const mockTelemedicinaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockEmpresaRepository = {
    save: jest.fn(),
  };

  const mockDataSource = {} as DataSource;

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.TELEMEDICINA,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Telemedicina Teste Ltda',
    nomeFantasia: 'TeleMed Teste',
    emailComercial: 'contato@telemed.com.br',
    ativo: true,
  };

  const mockTelemedicina = {
    id: 'telemedicina-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigo_telemedicina: 'TELE001',
    integracao_id: null,
    observacoes: 'Plataforma de telemedicina',
    created_at: new Date(),
    updated_at: new Date(),
  } as Telemedicina;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemedicinaService,
        {
          provide: getRepositoryToken(Telemedicina),
          useValue: mockTelemedicinaRepository,
        },
        {
          provide: getRepositoryToken(Empresa),
          useValue: mockEmpresaRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TelemedicinaService>(TelemedicinaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of telemedicinas', async () => {
      mockTelemedicinaRepository.find.mockResolvedValue([mockTelemedicina]);

      const result = await service.findAll();

      expect(result).toEqual([mockTelemedicina]);
      expect(mockTelemedicinaRepository.find).toHaveBeenCalledWith({
        relations: ['empresa'],
      });
    });

    it('should return sorted array by nomeFantasia', async () => {
      const tele2 = {
        ...mockTelemedicina,
        empresa: { ...mockEmpresa, nomeFantasia: 'Aaaa' },
      };
      mockTelemedicinaRepository.find.mockResolvedValue([
        mockTelemedicina,
        tele2,
      ]);

      const result = await service.findAll();

      expect(result[0].empresa.nomeFantasia).toBe('Aaaa');
    });
  });

  describe('findOne', () => {
    it('should return a telemedicina by id', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);

      const result = await service.findOne('telemedicina-uuid-1');

      expect(result).toEqual(mockTelemedicina);
      expect(mockTelemedicinaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'telemedicina-uuid-1' },
        relations: ['empresa'],
      });
    });

    it('should throw NotFoundException when telemedicina not found', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('should return a telemedicina by codigo', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);

      const result = await service.findByCodigo('TELE001');

      expect(result).toEqual(mockTelemedicina);
      expect(mockTelemedicinaRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_telemedicina: 'TELE001' },
        relations: ['empresa'],
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('should return a telemedicina by CNPJ', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockTelemedicina);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockTelemedicina);
      expect(mockTelemedicinaRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'telemedicina.empresa',
        'empresa',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.cnpj = :cnpj',
        { cnpj: '12.345.678/0001-90' },
      );
    });

    it('should throw NotFoundException when not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('should return array of active telemedicinas', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockTelemedicina]);

      const result = await service.findAtivos();

      expect(result).toEqual([mockTelemedicina]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.ativo = :ativo',
        { ativo: true },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'empresa.nomeFantasia',
        'ASC',
      );
    });
  });

  describe('update', () => {
    it('should update a telemedicina', async () => {
      const updateDto: UpdateTelemedicinaDto = {
        integracaoId: 'integracao-uuid',
        observacoes: 'Observações atualizadas',
      };
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);
      mockTelemedicinaRepository.save.mockResolvedValue(mockTelemedicina);
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(
        mockTelemedicina,
      );
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce({
        ...mockTelemedicina,
        observacoes: 'Observações atualizadas',
      });

      const result = await service.update('telemedicina-uuid-1', updateDto);

      expect(mockTelemedicinaRepository.save).toHaveBeenCalled();
      expect(result.observacoes).toBe('Observações atualizadas');
    });

    it('should throw NotFoundException when telemedicina not found', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { observacoes: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a telemedicina', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);
      mockTelemedicinaRepository.remove.mockResolvedValue(mockTelemedicina);

      await service.remove('telemedicina-uuid-1');

      expect(mockTelemedicinaRepository.remove).toHaveBeenCalledWith(
        mockTelemedicina,
      );
    });

    it('should throw NotFoundException when not found', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle telemedicina status', async () => {
      const teleWithEmpresa = {
        ...mockTelemedicina,
        empresa: { ...mockEmpresa, ativo: true },
      };
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(teleWithEmpresa);
      mockEmpresaRepository.save.mockResolvedValue({
        ...mockEmpresa,
        ativo: false,
      });
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce({
        ...teleWithEmpresa,
        empresa: { ...mockEmpresa, ativo: false },
      });

      const result = await service.toggleStatus('telemedicina-uuid-1');

      expect(mockEmpresaRepository.save).toHaveBeenCalled();
      expect(result.empresa.ativo).toBe(false);
    });
  });

  describe('search', () => {
    it('should return telemedicinas matching query', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockTelemedicina]);

      const result = await service.search('TeleMed');

      expect(result).toEqual([mockTelemedicina]);
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
