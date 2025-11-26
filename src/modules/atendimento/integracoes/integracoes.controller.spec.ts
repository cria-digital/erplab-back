import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { IntegracoesController } from './integracoes.controller';
import { IntegracoesService } from './integracoes.service';
import { CreateIntegracaoDto } from './dto/create-integracao.dto';
import { UpdateIntegracaoDto } from './dto/update-integracao.dto';
import { TipoIntegracao, StatusIntegracao } from './entities/integracao.entity';
import { PaginationDto } from '../../infraestrutura/common/dto/pagination.dto';

describe('IntegracoesController', () => {
  let controller: IntegracoesController;
  let service: IntegracoesService;

  const mockIntegracoesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findByTipo: jest.fn(),
    findByStatus: jest.fn(),
    findAtivos: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
    toggleStatus: jest.fn(),
    updateStatus: jest.fn(),
    testarConexao: jest.fn(),
    sincronizar: jest.fn(),
    getEstatisticas: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegracoesController],
      providers: [
        {
          provide: IntegracoesService,
          useValue: mockIntegracoesService,
        },
      ],
    }).compile();

    controller = module.get<IntegracoesController>(IntegracoesController);
    service = module.get<IntegracoesService>(IntegracoesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createIntegracaoDto: CreateIntegracaoDto = {
      templateSlug: 'hermes-pardini',
      codigoIdentificacao: 'LAB001',
      nomeInstancia: 'Laboratório ABC',
      descricao: 'Integração com laboratório de apoio ABC',
      tiposContexto: [TipoIntegracao.LABORATORIO_APOIO],
      configuracoes: {
        usuario: 'hp_user',
        senha: 'SenhaSegura123!',
        ambiente: 'homologacao',
      },
    };

    it('should create a new integration', async () => {
      mockIntegracoesService.create.mockResolvedValue(mockIntegracao);

      const result = await controller.create(createIntegracaoDto);

      expect(service.create).toHaveBeenCalledWith(createIntegracaoDto);
      expect(result).toEqual(mockIntegracao);
    });

    it('should handle creation conflicts', async () => {
      mockIntegracoesService.create.mockRejectedValue(
        new ConflictException('Código de integração já existe'),
      );

      await expect(controller.create(createIntegracaoDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all integrations paginated', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [mockIntegracao],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        },
      };
      mockIntegracoesService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findAtivos', () => {
    it('should return active integrations paginated', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [mockIntegracao],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        },
      };
      mockIntegracoesService.findAtivos.mockResolvedValue(paginatedResult);

      const result = await controller.findAtivos(paginationDto);

      expect(service.findAtivos).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findByTipo', () => {
    it('should return integrations by type paginated', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [mockIntegracao],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        },
      };
      mockIntegracoesService.findByTipo.mockResolvedValue(paginatedResult);

      const result = await controller.findByTipo(
        TipoIntegracao.LABORATORIO_APOIO,
        paginationDto,
      );

      expect(service.findByTipo).toHaveBeenCalledWith(
        TipoIntegracao.LABORATORIO_APOIO,
        paginationDto,
      );
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findByStatus', () => {
    it('should return integrations by status paginated', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [mockIntegracao],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        },
      };
      mockIntegracoesService.findByStatus.mockResolvedValue(paginatedResult);

      const result = await controller.findByStatus(
        StatusIntegracao.ATIVA,
        paginationDto,
      );

      expect(service.findByStatus).toHaveBeenCalledWith(
        StatusIntegracao.ATIVA,
        paginationDto,
      );
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('search', () => {
    it('should search integrations paginated', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [mockIntegracao],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        },
      };
      mockIntegracoesService.search.mockResolvedValue(paginatedResult);

      const result = await controller.search('ABC', paginationDto);

      expect(service.search).toHaveBeenCalledWith('ABC', paginationDto);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('getEstatisticas', () => {
    it('should return integration statistics', async () => {
      const mockStats = {
        total: 10,
        ativas: 8,
        inativas: 2,
        porTipo: [],
        porStatus: [],
      };
      mockIntegracoesService.getEstatisticas.mockResolvedValue(mockStats);

      const result = await controller.getEstatisticas();

      expect(service.getEstatisticas).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('findByCodigo', () => {
    it('should return integration by code', async () => {
      mockIntegracoesService.findByCodigo.mockResolvedValue(mockIntegracao);

      const result = await controller.findByCodigo('LAB001');

      expect(service.findByCodigo).toHaveBeenCalledWith('LAB001');
      expect(result).toEqual(mockIntegracao);
    });

    it('should handle not found integration', async () => {
      mockIntegracoesService.findByCodigo.mockRejectedValue(
        new NotFoundException('Integração não encontrada'),
      );

      await expect(controller.findByCodigo('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return integration by id', async () => {
      mockIntegracoesService.findOne.mockResolvedValue(mockIntegracao);

      const result = await controller.findOne('integracao-uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('integracao-uuid-1');
      expect(result).toEqual(mockIntegracao);
    });

    it('should handle not found integration', async () => {
      mockIntegracoesService.findOne.mockRejectedValue(
        new NotFoundException('Integração não encontrada'),
      );

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateIntegracaoDto: UpdateIntegracaoDto = {
      nomeInstancia: 'Laboratório ABC Atualizado',
      descricao: 'Descrição atualizada',
    };

    it('should update an integration', async () => {
      const updatedIntegracao = { ...mockIntegracao, ...updateIntegracaoDto };
      mockIntegracoesService.update.mockResolvedValue(updatedIntegracao);

      const result = await controller.update(
        'integracao-uuid-1',
        updateIntegracaoDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        'integracao-uuid-1',
        updateIntegracaoDto,
      );
      expect(result).toEqual(updatedIntegracao);
    });

    it('should handle not found integration for update', async () => {
      mockIntegracoesService.update.mockRejectedValue(
        new NotFoundException('Integração não encontrada'),
      );

      await expect(
        controller.update('nonexistent-id', updateIntegracaoDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle integration status', async () => {
      const toggledIntegracao = { ...mockIntegracao, ativo: false };
      mockIntegracoesService.toggleStatus.mockResolvedValue(toggledIntegracao);

      const result = await controller.toggleStatus('integracao-uuid-1');

      expect(service.toggleStatus).toHaveBeenCalledWith('integracao-uuid-1');
      expect(result).toEqual(toggledIntegracao);
    });
  });

  describe('updateStatus', () => {
    it('should update integration status', async () => {
      const updatedIntegracao = {
        ...mockIntegracao,
        status: StatusIntegracao.INATIVA,
      };
      mockIntegracoesService.updateStatus.mockResolvedValue(updatedIntegracao);

      const result = await controller.updateStatus(
        'integracao-uuid-1',
        StatusIntegracao.INATIVA,
      );

      expect(service.updateStatus).toHaveBeenCalledWith(
        'integracao-uuid-1',
        StatusIntegracao.INATIVA,
      );
      expect(result).toEqual(updatedIntegracao);
    });
  });

  describe('testarConexao', () => {
    it('should test integration connection', async () => {
      const mockResult = {
        sucesso: true,
        mensagem: 'Conexão testada com sucesso',
        detalhes: {},
      };
      mockIntegracoesService.testarConexao.mockResolvedValue(mockResult);

      const result = await controller.testarConexao('integracao-uuid-1');

      expect(service.testarConexao).toHaveBeenCalledWith('integracao-uuid-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('sincronizar', () => {
    it('should synchronize integration', async () => {
      const mockResult = {
        sucesso: true,
        dadosSincronizados: 10,
        ultimaSincronizacao: new Date(),
      };
      mockIntegracoesService.sincronizar.mockResolvedValue(mockResult);

      const result = await controller.sincronizar('integracao-uuid-1');

      expect(service.sincronizar).toHaveBeenCalledWith('integracao-uuid-1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should remove an integration', async () => {
      mockIntegracoesService.remove.mockResolvedValue(undefined);

      await controller.remove('integracao-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('integracao-uuid-1');
    });

    it('should handle not found integration for removal', async () => {
      mockIntegracoesService.remove.mockRejectedValue(
        new NotFoundException('Integração não encontrada'),
      );

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
