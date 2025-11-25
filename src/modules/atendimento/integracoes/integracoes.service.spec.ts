import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { IntegracoesService } from './integracoes.service';
import {
  Integracao,
  TipoIntegracao,
  StatusIntegracao,
} from './entities/integracao.entity';
import { IntegracaoConfiguracao } from './entities/integracao-configuracao.entity';

describe('IntegracoesService', () => {
  let service: IntegracoesService;

  const mockIntegracao = {
    id: 'integracao-uuid-1',
    templateSlug: 'hermes-pardini',
    codigoIdentificacao: 'HP-001',
    nomeInstancia: 'Hermes Pardini Centro',
    descricao: 'Integração com laboratório Hermes Pardini',
    tiposContexto: [TipoIntegracao.LABORATORIO_APOIO],
    status: StatusIntegracao.ATIVA,
    ativo: true,
    configuracoes: [
      { chave: 'usuario', valor: 'hp_user' },
      { chave: 'senha', valor: '[ENCRYPTED]' },
      { chave: 'ambiente', valor: 'homologacao' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getMany: jest.fn(),
      getOne: jest.fn(),
      getCount: jest.fn(),
    })),
    count: jest.fn(),
  };

  const mockConfigRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn().mockResolvedValue(mockIntegracao),
        findOne: jest.fn(),
      },
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegracoesService,
        {
          provide: getRepositoryToken(Integracao),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(IntegracaoConfiguracao),
          useValue: mockConfigRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<IntegracoesService>(IntegracoesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of integrations', async () => {
      mockRepository.find.mockResolvedValue([mockIntegracao]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['configuracoes'],
        order: { nomeInstancia: 'ASC' },
      });
      expect(result).toEqual([mockIntegracao]);
    });
  });

  describe('findOne', () => {
    it('should return a single integration', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);

      const result = await service.findOne('integracao-uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'integracao-uuid-1' },
        relations: ['configuracoes'],
      });
      expect(result).toEqual(mockIntegracao);
    });

    it('should throw NotFoundException when integration not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('should return integration by codigo', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);

      const result = await service.findByCodigo('HP-001');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoIdentificacao: 'HP-001' },
        relations: ['configuracoes'],
      });
      expect(result).toEqual(mockIntegracao);
    });

    it('should throw NotFoundException when codigo not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('should return only active integrations', async () => {
      mockRepository.find.mockResolvedValue([mockIntegracao]);

      const result = await service.findAtivos();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['configuracoes'],
        order: { nomeInstancia: 'ASC' },
      });
      expect(result).toEqual([mockIntegracao]);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle integration status', async () => {
      const inativaIntegracao = { ...mockIntegracao, ativo: false };
      mockRepository.findOne.mockResolvedValue(mockIntegracao);
      mockRepository.save.mockResolvedValue(inativaIntegracao);

      await service.toggleStatus('integracao-uuid-1');

      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an integration', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);
      mockRepository.remove.mockResolvedValue(mockIntegracao);

      await service.remove('integracao-uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'integracao-uuid-1' },
        relations: ['configuracoes'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockIntegracao);
    });

    it('should throw NotFoundException when integration not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
