import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { PrestadorServicoCategoriaController } from './prestador-servico-categoria.controller';
import { PrestadorServicoCategoriaService } from './prestador-servico-categoria.service';
import { CreatePrestadorServicoCategoriaDto } from './dto/create-prestador-servico-categoria.dto';
import { UpdatePrestadorServicoCategoriaDto } from './dto/update-prestador-servico-categoria.dto';
import {
  PrestadorServicoCategoria,
  TipoServicoCategoria,
} from './entities/prestador-servico-categoria.entity';

describe('PrestadorServicoCategoriaController', () => {
  let controller: PrestadorServicoCategoriaController;
  let service: PrestadorServicoCategoriaService;

  const mockCategoria: PrestadorServicoCategoria = {
    id: 'categoria-uuid-1',
    prestadorServicoId: 'prestador-uuid-1',
    prestadorServico: {
      id: 'prestador-uuid-1',
      codigoPrestador: 'PREST001',
      empresa: {
        id: 'empresa-uuid-1',
        cnpj: '12345678000190',
        razaoSocial: 'Prestador Teste Ltda',
        nomeFantasia: 'Prestador Teste',
        ativo: true,
      },
    } as any,
    tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
    descricaoServico: 'Manutenção preventiva e corretiva',
    valorPadrao: 500.0,
    unidadeMedida: 'hora',
    prazoExecucao: 5,
    periodicidade: 'mensal',
    responsavelTecnico: 'João Silva',
    telefoneResponsavel: '(11) 98765-4321',
    emailResponsavel: 'joao.silva@example.com',
    requerAprovacao: true,
    requerOrcamento: false,
    valorLimiteSemAprovacao: 1000.0,
    ativo: true,
    observacoes: 'Observações sobre o serviço',
    createdAt: new Date(),
    updatedAt: new Date(),
    tenantId: 'tenant-uuid-1',
    tenant: null as any,
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    getEstatisticasPorTipo: jest.fn(),
    findByPrestador: jest.fn(),
    findActiveByPrestador: jest.fn(),
    getEstatisticasPrestador: jest.fn(),
    findByTipo: jest.fn(),
    getPrestadoresPorCategoria: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    importarCategorias: jest.fn(),
    remove: jest.fn(),
    removeByPrestador: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestadorServicoCategoriaController],
      providers: [
        {
          provide: PrestadorServicoCategoriaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PrestadorServicoCategoriaController>(
      PrestadorServicoCategoriaController,
    );
    service = module.get<PrestadorServicoCategoriaService>(
      PrestadorServicoCategoriaService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createCategoriaDto: CreatePrestadorServicoCategoriaDto = {
      prestadorServicoId: 'prestador-uuid-1',
      tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
      descricaoServico: 'Manutenção preventiva e corretiva',
      valorPadrao: 500.0,
      unidadeMedida: 'hora',
      prazoExecucao: 5,
      periodicidade: 'mensal',
      responsavelTecnico: 'João Silva',
      telefoneResponsavel: '(11) 98765-4321',
      emailResponsavel: 'joao.silva@example.com',
      requerAprovacao: true,
      requerOrcamento: false,
      valorLimiteSemAprovacao: 1000.0,
      ativo: true,
      observacoes: 'Observações sobre o serviço',
    };

    it('deve criar uma categoria com sucesso', async () => {
      mockService.create.mockResolvedValue(mockCategoria);

      const result = await controller.create(createCategoriaDto);

      expect(result).toEqual(mockCategoria);
      expect(service.create).toHaveBeenCalledWith(createCategoriaDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando prestador não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Prestador prestador-uuid-1 não encontrado',
      );
      mockService.create.mockRejectedValue(notFoundError);

      await expect(controller.create(createCategoriaDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve propagar erro quando categoria já existir', async () => {
      const conflictError = new ConflictException(
        'Categoria manutencao_equipamentos já existe para este prestador',
      );
      mockService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createCategoriaDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar categoria com dados mínimos obrigatórios', async () => {
      const createMinimo = {
        prestadorServicoId: 'prestador-uuid-1',
        tipoServico: TipoServicoCategoria.PRESTADORES_EXAMES,
      };

      mockService.create.mockResolvedValue(mockCategoria);

      const result = await controller.create(createMinimo);

      expect(result).toEqual(mockCategoria);
      expect(service.create).toHaveBeenCalledWith(createMinimo);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de categorias', async () => {
      const categorias = [mockCategoria];
      mockService.findAll.mockResolvedValue(categorias);

      const result = await controller.findAll();

      expect(result).toEqual(categorias);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há categorias', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findActive', () => {
    it('deve retornar apenas categorias ativas', async () => {
      const categoriasAtivas = [mockCategoria];
      mockService.findActive.mockResolvedValue(categoriasAtivas);

      const result = await controller.findActive();

      expect(result).toEqual(categoriasAtivas);
      expect(service.findActive).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEstatisticasPorTipo', () => {
    it('deve retornar estatísticas por tipo de serviço', async () => {
      const estatisticas = [
        {
          tipo: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
          total: 10,
          ativos: 8,
          inativos: 2,
        },
        {
          tipo: TipoServicoCategoria.PRESTADORES_EXAMES,
          total: 5,
          ativos: 4,
          inativos: 1,
        },
      ];

      mockService.getEstatisticasPorTipo.mockResolvedValue(estatisticas);

      const result = await controller.getEstatisticasPorTipo();

      expect(result).toEqual(estatisticas);
      expect(service.getEstatisticasPorTipo).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByPrestador', () => {
    it('deve retornar categorias de um prestador', async () => {
      const prestadorId = 'prestador-uuid-1';
      const categorias = [mockCategoria];
      mockService.findByPrestador.mockResolvedValue(categorias);

      const result = await controller.findByPrestador(prestadorId);

      expect(result).toEqual(categorias);
      expect(service.findByPrestador).toHaveBeenCalledWith(prestadorId);
    });

    it('deve retornar lista vazia para prestador sem categorias', async () => {
      mockService.findByPrestador.mockResolvedValue([]);

      const result = await controller.findByPrestador('prestador-inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('findActiveByPrestador', () => {
    it('deve retornar categorias ativas de um prestador', async () => {
      const prestadorId = 'prestador-uuid-1';
      const categoriasAtivas = [mockCategoria];
      mockService.findActiveByPrestador.mockResolvedValue(categoriasAtivas);

      const result = await controller.findActiveByPrestador(prestadorId);

      expect(result).toEqual(categoriasAtivas);
      expect(service.findActiveByPrestador).toHaveBeenCalledWith(prestadorId);
    });
  });

  describe('getEstatisticasPrestador', () => {
    it('deve retornar estatísticas de um prestador', async () => {
      const prestadorId = 'prestador-uuid-1';
      const estatisticas = {
        resumo: {
          total: 3,
          ativas: 2,
          inativas: 1,
          comOrcamento: 1,
          comAprovacao: 2,
        },
        porTipo: {
          [TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS]: {
            total: 2,
            ativas: 1,
            valorMedio: 500.0,
          },
        },
      };

      mockService.getEstatisticasPrestador.mockResolvedValue(estatisticas);

      const result = await controller.getEstatisticasPrestador(prestadorId);

      expect(result).toEqual(estatisticas);
      expect(service.getEstatisticasPrestador).toHaveBeenCalledWith(
        prestadorId,
      );
    });
  });

  describe('findByTipo', () => {
    it('deve retornar categorias por tipo de serviço', async () => {
      const tipo = TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS;
      const categorias = [mockCategoria];
      mockService.findByTipo.mockResolvedValue(categorias);

      const result = await controller.findByTipo(tipo);

      expect(result).toEqual(categorias);
      expect(service.findByTipo).toHaveBeenCalledWith(tipo);
    });

    it('deve retornar lista vazia para tipo sem categorias', async () => {
      mockService.findByTipo.mockResolvedValue([]);

      const result = await controller.findByTipo(
        TipoServicoCategoria.OUTROS_SERVICOS_PF,
      );

      expect(result).toEqual([]);
    });
  });

  describe('getPrestadoresPorCategoria', () => {
    it('deve retornar prestadores por categoria', async () => {
      const tipo = TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS;
      const prestadores = [
        {
          id: 'prestador-uuid-1',
          codigo: 'PREST001',
          nome: 'Prestador Teste',
          valorPadrao: 500.0,
          prazoExecucao: 5,
          responsavelTecnico: 'João Silva',
          requerOrcamento: false,
          requerAprovacao: true,
        },
      ];

      mockService.getPrestadoresPorCategoria.mockResolvedValue(prestadores);

      const result = await controller.getPrestadoresPorCategoria(tipo);

      expect(result).toEqual(prestadores);
      expect(service.getPrestadoresPorCategoria).toHaveBeenCalledWith(tipo);
    });
  });

  describe('findOne', () => {
    it('deve retornar categoria por ID', async () => {
      const categoriaId = 'categoria-uuid-1';
      mockService.findOne.mockResolvedValue(mockCategoria);

      const result = await controller.findOne(categoriaId);

      expect(result).toEqual(mockCategoria);
      expect(service.findOne).toHaveBeenCalledWith(categoriaId);
    });

    it('deve propagar erro quando categoria não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Categoria invalid-id não encontrada',
      );
      mockService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateCategoriaDto: UpdatePrestadorServicoCategoriaDto = {
      valorPadrao: 600.0,
      prazoExecucao: 7,
      observacoes: 'Observações atualizadas',
    };

    it('deve atualizar categoria com sucesso', async () => {
      const categoriaAtualizada = {
        ...mockCategoria,
        ...updateCategoriaDto,
      };

      mockService.update.mockResolvedValue(categoriaAtualizada);

      const result = await controller.update(
        'categoria-uuid-1',
        updateCategoriaDto,
      );

      expect(result).toEqual(categoriaAtualizada);
      expect(service.update).toHaveBeenCalledWith(
        'categoria-uuid-1',
        updateCategoriaDto,
      );
    });

    it('deve propagar erro quando categoria não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Categoria invalid-id não encontrada',
      );
      mockService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateCategoriaDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status ativo/inativo', async () => {
      const categoriaInativa = {
        ...mockCategoria,
        ativo: false,
      };

      mockService.toggleStatus.mockResolvedValue(categoriaInativa);

      const result = await controller.toggleStatus('categoria-uuid-1');

      expect(result).toEqual(categoriaInativa);
      expect(service.toggleStatus).toHaveBeenCalledWith('categoria-uuid-1');
    });

    it('deve propagar erro quando categoria não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Categoria invalid-id não encontrada',
      );
      mockService.toggleStatus.mockRejectedValue(notFoundError);

      await expect(controller.toggleStatus('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('importarCategorias', () => {
    const categoriasPadrao = [
      {
        tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
        valorPadrao: 500.0,
      },
      {
        tipoServico: TipoServicoCategoria.PRESTADORES_EXAMES,
        valorPadrao: 200.0,
      },
    ];

    it('deve importar categorias em lote', async () => {
      const prestadorId = 'prestador-uuid-1';
      const categoriasImportadas = [mockCategoria];
      mockService.importarCategorias.mockResolvedValue(categoriasImportadas);

      const result = await controller.importarCategorias(
        prestadorId,
        categoriasPadrao,
      );

      expect(result).toEqual(categoriasImportadas);
      expect(service.importarCategorias).toHaveBeenCalledWith(
        prestadorId,
        categoriasPadrao,
      );
    });

    it('deve propagar erro quando prestador não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Prestador invalid-id não encontrado',
      );
      mockService.importarCategorias.mockRejectedValue(notFoundError);

      await expect(
        controller.importarCategorias('invalid-id', categoriasPadrao),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve processar lista vazia de categorias', async () => {
      const prestadorId = 'prestador-uuid-1';
      mockService.importarCategorias.mockResolvedValue([]);

      const result = await controller.importarCategorias(prestadorId, []);

      expect(result).toEqual([]);
      expect(service.importarCategorias).toHaveBeenCalledWith(prestadorId, []);
    });
  });

  describe('remove', () => {
    it('deve remover categoria com sucesso', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('categoria-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('categoria-uuid-1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando categoria não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Categoria invalid-id não encontrada',
      );
      mockService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeByPrestador', () => {
    it('deve remover todas as categorias de um prestador', async () => {
      const prestadorId = 'prestador-uuid-1';
      mockService.removeByPrestador.mockResolvedValue(undefined);

      await controller.removeByPrestador(prestadorId);

      expect(service.removeByPrestador).toHaveBeenCalledWith(prestadorId);
      expect(service.removeByPrestador).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTTP status codes', () => {
    it('deve retornar status 201 para create', async () => {
      mockService.create.mockResolvedValue(mockCategoria);
      const createDto = {
        prestadorServicoId: 'prestador-uuid-1',
        tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
      };

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCategoria);
    });

    it('deve retornar status 200 para operações de consulta', async () => {
      mockService.findAll.mockResolvedValue([mockCategoria]);
      mockService.findOne.mockResolvedValue(mockCategoria);
      mockService.findByPrestador.mockResolvedValue([mockCategoria]);

      const resultFindAll = await controller.findAll();
      const resultFindOne = await controller.findOne('categoria-uuid-1');
      const resultFindByPrestador =
        await controller.findByPrestador('prestador-uuid-1');

      expect(resultFindAll).toEqual([mockCategoria]);
      expect(resultFindOne).toEqual(mockCategoria);
      expect(resultFindByPrestador).toEqual([mockCategoria]);
    });

    it('deve retornar status 200 para update', async () => {
      mockService.update.mockResolvedValue(mockCategoria);

      const result = await controller.update('categoria-uuid-1', {
        valorPadrao: 600.0,
      });

      expect(result).toEqual(mockCategoria);
    });

    it('should handle void returns for delete operations', async () => {
      mockService.remove.mockResolvedValue(undefined);
      mockService.removeByPrestador.mockResolvedValue(undefined);

      const resultRemove = await controller.remove('categoria-uuid-1');
      const resultRemoveByPrestador =
        await controller.removeByPrestador('prestador-uuid-1');

      expect(resultRemove).toBeUndefined();
      expect(resultRemoveByPrestador).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('deve lidar com valores decimais na atualização', async () => {
      const updateDto = {
        valorPadrao: 999.99,
        valorLimiteSemAprovacao: 1500.5,
      };

      const categoriaAtualizada = { ...mockCategoria, ...updateDto };
      mockService.update.mockResolvedValue(categoriaAtualizada);

      const result = await controller.update('categoria-uuid-1', updateDto);

      expect(result.valorPadrao).toBe(999.99);
      expect(result.valorLimiteSemAprovacao).toBe(1500.5);
    });

    it('deve lidar com strings vazias nos campos opcionais', async () => {
      const createDto = {
        prestadorServicoId: 'prestador-uuid-1',
        tipoServico: TipoServicoCategoria.OUTROS_SERVICOS_PF,
        descricaoServico: '',
        observacoes: '',
      };

      mockService.create.mockResolvedValue(mockCategoria);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCategoria);
    });

    it('deve lidar com todos os tipos de serviço disponíveis', async () => {
      const tipos = Object.values(TipoServicoCategoria);

      for (const tipo of tipos) {
        mockService.findByTipo.mockResolvedValue([
          { ...mockCategoria, tipoServico: tipo },
        ]);

        const result = await controller.findByTipo(tipo);

        expect(result).toHaveLength(1);
        expect(result[0].tipoServico).toBe(tipo);
      }
    });
  });
});
