import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { IntegracoesService } from './integracoes.service';
import {
  Integracao,
  TipoIntegracao,
  StatusIntegracao,
} from './entities/integracao.entity';
import { CreateIntegracaoDto } from './dto/create-integracao.dto';
import { UpdateIntegracaoDto } from './dto/update-integracao.dto';

describe('IntegracoesService', () => {
  let service: IntegracoesService;

  const mockIntegracao = {
    id: 'integracao-uuid-1',
    tipoIntegracao: TipoIntegracao.LABORATORIO_APOIO,
    nomeIntegracao: 'Laboratório ABC',
    descricaoApi: 'Integração com laboratório de apoio ABC',
    codigoIdentificacao: 'LAB001',
    unidadeSaudeId: 'unidade-uuid-1',
    urlApiExames: 'https://api.laboratorio-abc.com/exames',
    tokenAutenticacao: 'token-abc-123',
    status: StatusIntegracao.ATIVA,
    ativo: true,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegracoesService,
        {
          provide: getRepositoryToken(Integracao),
          useValue: mockRepository,
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

  describe('create', () => {
    const createIntegracaoDto: CreateIntegracaoDto = {
      tipoIntegracao: TipoIntegracao.LABORATORIO_APOIO,
      nomeIntegracao: 'Laboratório ABC',
      descricaoApi: 'Integração com laboratório de apoio ABC',
      codigoIdentificacao: 'LAB001',
      unidadeSaudeId: 'unidade-uuid-1',
      urlApiExames: 'https://api.laboratorio-abc.com/exames',
      tokenAutenticacao: 'token-abc-123',
    };

    it('should create a new integration successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockIntegracao);
      mockRepository.save.mockResolvedValue(mockIntegracao);

      const result = await service.create(createIntegracaoDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoIdentificacao: createIntegracaoDto.codigoIdentificacao },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createIntegracaoDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockIntegracao);
      expect(result).toEqual(mockIntegracao);
    });

    it('should throw ConflictException if integration code already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);

      await expect(service.create(createIntegracaoDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoIdentificacao: createIntegracaoDto.codigoIdentificacao },
      });
    });
  });

  describe('findAll', () => {
    it('should return all integrations', async () => {
      const integracoes = [mockIntegracao];
      mockRepository.find.mockResolvedValue(integracoes);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['unidadeSaude'],
        order: { nomeIntegracao: 'ASC' },
      });
      expect(result).toEqual(integracoes);
    });
  });

  describe('findOne', () => {
    it('should return an integration by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);

      const result = await service.findOne('integracao-uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'integracao-uuid-1' },
        relations: ['unidadeSaude'],
      });
      expect(result).toEqual(mockIntegracao);
    });

    it('should throw NotFoundException if integration not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByTipo', () => {
    it('should return integrations by type', async () => {
      const integracoes = [mockIntegracao];
      mockRepository.find.mockResolvedValue(integracoes);

      const result = await service.findByTipo(TipoIntegracao.LABORATORIO_APOIO);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipoIntegracao: TipoIntegracao.LABORATORIO_APOIO },
        relations: ['unidadeSaude'],
        order: { nomeIntegracao: 'ASC' },
      });
      expect(result).toEqual(integracoes);
    });
  });

  describe('findByCodigo', () => {
    it('should return integration by code', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);

      const result = await service.findByCodigo('LAB001');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoIdentificacao: 'LAB001' },
        relations: ['unidadeSaude'],
      });
      expect(result).toEqual(mockIntegracao);
    });

    it('should throw NotFoundException if integration code not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateIntegracaoDto: UpdateIntegracaoDto = {
      nomeIntegracao: 'Laboratório ABC Atualizado',
      descricaoApi: 'Descrição atualizada',
    };

    it('should update an integration successfully', async () => {
      const updatedIntegracao = { ...mockIntegracao, ...updateIntegracaoDto };
      mockRepository.findOne.mockResolvedValue(mockIntegracao);
      mockRepository.save.mockResolvedValue(updatedIntegracao);

      const result = await service.update(
        'integracao-uuid-1',
        updateIntegracaoDto,
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'integracao-uuid-1' },
        relations: ['unidadeSaude'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedIntegracao);
      expect(result).toEqual(updatedIntegracao);
    });

    it('should throw NotFoundException if integration not found for update', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', updateIntegracaoDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new code already exists', async () => {
      const updateWithCode = { codigoIdentificacao: 'EXISTING_CODE' };
      const existingIntegracao = { ...mockIntegracao, id: 'different-id' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockIntegracao) // findOne for update
        .mockResolvedValueOnce(existingIntegracao); // findOne for code check

      await expect(
        service.update('integracao-uuid-1', updateWithCode),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove an integration successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);
      mockRepository.remove.mockResolvedValue(mockIntegracao);

      await service.remove('integracao-uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'integracao-uuid-1' },
        relations: ['unidadeSaude'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockIntegracao);
    });

    it('should throw NotFoundException if integration not found for removal', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('testarConexao', () => {
    it('should test connection successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockIntegracao);

      const result = await service.testarConexao('integracao-uuid-1');

      expect(result).toEqual({
        sucesso: true,
        mensagem: 'Teste de conexão simulado - Implementar lógica específica',
        detalhes: {
          url: mockIntegracao.urlApiExames,
          tipo: mockIntegracao.tipoIntegracao,
          timestampTeste: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if integration not found for connection test', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.testarConexao('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('should search integrations by term', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockIntegracao]),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        leftJoin: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getCount: jest.fn(),
      };

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.search('ABC');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'integracao',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'integracao.unidadeSaude',
        'unidadeSaude',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'integracao.nome_integracao ILIKE :termo',
        { termo: '%ABC%' },
      );
      expect(result).toEqual([mockIntegracao]);
    });
  });

  describe('getEstatisticas', () => {
    it('should return integration statistics', async () => {
      const mockPorTipo = [
        { tipo: TipoIntegracao.LABORATORIO_APOIO, total: '5' },
        { tipo: TipoIntegracao.TELEMEDICINA, total: '3' },
      ];
      const mockPorStatus = [
        { status: StatusIntegracao.ATIVA, total: '8' },
        { status: StatusIntegracao.INATIVA, total: '2' },
      ];

      mockRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8) // ativos
        .mockResolvedValueOnce(2); // inativos

      // Configure mock to return different values on each call
      let callCount = 0;
      mockRepository.createQueryBuilder.mockImplementation(() => {
        const qb = {
          select: jest.fn().mockReturnThis(),
          addSelect: jest.fn().mockReturnThis(),
          groupBy: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orWhere: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          leftJoin: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getMany: jest.fn(),
          getOne: jest.fn(),
          getCount: jest.fn(),
          getRawMany: jest.fn(() => {
            if (callCount === 0) {
              callCount++;
              return Promise.resolve(mockPorTipo);
            } else {
              return Promise.resolve(mockPorStatus);
            }
          }),
        };
        return qb;
      });

      const result = await service.getEstatisticas();

      expect(result).toEqual({
        total: 10,
        ativos: 8,
        inativos: 2,
        porTipo: mockPorTipo,
        porStatus: mockPorStatus,
      });
      expect(mockRepository.count).toHaveBeenCalledTimes(3);
    });
  });
});
