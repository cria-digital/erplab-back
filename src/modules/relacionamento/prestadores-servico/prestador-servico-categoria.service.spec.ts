import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { PrestadorServicoCategoriaService } from './prestador-servico-categoria.service';
import {
  PrestadorServicoCategoria,
  TipoServicoCategoria,
} from './entities/prestador-servico-categoria.entity';
import { PrestadorServico } from './entities/prestador-servico.entity';
import { CreatePrestadorServicoCategoriaDto } from './dto/create-prestador-servico-categoria.dto';
import { UpdatePrestadorServicoCategoriaDto } from './dto/update-prestador-servico-categoria.dto';

describe('PrestadorServicoCategoriaService', () => {
  let service: PrestadorServicoCategoriaService;

  const mockCategoriaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockPrestadorRepository = {
    findOne: jest.fn(),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Prestador Teste Ltda',
    nomeFantasia: 'Prestador Teste',
    ativo: true,
  };

  const mockPrestador = {
    id: 'prestador-uuid-1',
    empresaId: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigoPrestador: 'PREST001',
    categorias: [],
    ativo: true,
  };

  const mockCategoria = {
    id: 'categoria-uuid-1',
    prestadorServicoId: 'prestador-uuid-1',
    prestadorServico: mockPrestador,
    tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
    descricaoServico: 'Manutenção preventiva e corretiva de equipamentos',
    valorPadrao: 500.0,
    unidadeMedida: 'hora',
    prazoExecucao: 5,
    periodicidade: 'mensal',
    responsavelTecnico: 'João Silva',
    telefoneResponsavel: '(11) 98765-4321',
    emailResponsavel: 'joao@exemplo.com',
    requerAprovacao: true,
    requerOrcamento: false,
    valorLimiteSemAprovacao: 1000.0,
    ativo: true,
    observacoes: 'Observações da categoria',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestadorServicoCategoriaService,
        {
          provide: getRepositoryToken(PrestadorServicoCategoria),
          useValue: mockCategoriaRepository,
        },
        {
          provide: getRepositoryToken(PrestadorServico),
          useValue: mockPrestadorRepository,
        },
      ],
    }).compile();

    service = module.get<PrestadorServicoCategoriaService>(
      PrestadorServicoCategoriaService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreatePrestadorServicoCategoriaDto = {
      prestadorServicoId: 'prestador-uuid-1',
      tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
      descricaoServico: 'Manutenção preventiva e corretiva',
      valorPadrao: 500.0,
      unidadeMedida: 'hora',
      prazoExecucao: 5,
      responsavelTecnico: 'João Silva',
      telefoneResponsavel: '(11) 98765-4321',
      emailResponsavel: 'joao@exemplo.com',
      requerAprovacao: true,
      requerOrcamento: false,
      ativo: true,
    };

    it('deve criar uma categoria com sucesso', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockCategoriaRepository.findOne.mockResolvedValue(null); // categoria não existe
      mockCategoriaRepository.create.mockReturnValue(mockCategoria);
      mockCategoriaRepository.save.mockResolvedValue(mockCategoria);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCategoria);
      expect(mockPrestadorRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.prestadorServicoId },
      });
      expect(mockCategoriaRepository.findOne).toHaveBeenCalledWith({
        where: {
          prestadorServicoId: createDto.prestadorServicoId,
          tipoServico: createDto.tipoServico,
        },
      });
      expect(mockCategoriaRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockCategoriaRepository.save).toHaveBeenCalledWith(mockCategoria);
    });

    it('deve retornar erro quando prestador não existir', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        new NotFoundException(
          `Prestador ${createDto.prestadorServicoId} não encontrado`,
        ),
      );
      expect(mockCategoriaRepository.findOne).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando categoria já existir', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);

      await expect(service.create(createDto)).rejects.toThrow(
        new ConflictException(
          `Categoria ${createDto.tipoServico} já existe para este prestador`,
        ),
      );
      expect(mockCategoriaRepository.create).not.toHaveBeenCalled();
    });

    it('deve criar categoria com campos mínimos', async () => {
      const createMinimo = {
        prestadorServicoId: 'prestador-uuid-1',
        tipoServico: TipoServicoCategoria.SUPORTE_SOFTWARE,
      };

      const categoriaMinima = {
        ...mockCategoria,
        ...createMinimo,
        descricaoServico: null,
        valorPadrao: null,
      };

      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockCategoriaRepository.findOne.mockResolvedValue(null);
      mockCategoriaRepository.create.mockReturnValue(categoriaMinima);
      mockCategoriaRepository.save.mockResolvedValue(categoriaMinima);

      const result = await service.create(createMinimo);

      expect(result).toEqual(categoriaMinima);
      expect(mockCategoriaRepository.create).toHaveBeenCalledWith(createMinimo);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de categorias ordenada', async () => {
      const categorias = [mockCategoria];
      mockCategoriaRepository.find.mockResolvedValue(categorias);

      const result = await service.findAll();

      expect(result).toEqual(categorias);
      expect(mockCategoriaRepository.find).toHaveBeenCalledWith({
        relations: ['prestadorServico', 'prestadorServico.empresa'],
        order: {
          tipoServico: 'ASC',
        },
      });
    });

    it('deve retornar lista vazia quando não há categorias', async () => {
      mockCategoriaRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByPrestador', () => {
    it('deve retornar categorias do prestador', async () => {
      const categorias = [mockCategoria];
      mockCategoriaRepository.find.mockResolvedValue(categorias);

      const result = await service.findByPrestador('prestador-uuid-1');

      expect(result).toEqual(categorias);
      expect(mockCategoriaRepository.find).toHaveBeenCalledWith({
        where: { prestadorServicoId: 'prestador-uuid-1' },
        relations: ['prestadorServico', 'prestadorServico.empresa'],
        order: {
          tipoServico: 'ASC',
        },
      });
    });

    it('deve retornar lista vazia para prestador sem categorias', async () => {
      mockCategoriaRepository.find.mockResolvedValue([]);

      const result = await service.findByPrestador('prestador-uuid-2');

      expect(result).toEqual([]);
    });
  });

  describe('findByTipo', () => {
    it('deve retornar categorias do tipo especificado', async () => {
      const categorias = [mockCategoria];
      mockCategoriaRepository.find.mockResolvedValue(categorias);

      const result = await service.findByTipo(
        TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
      );

      expect(result).toEqual(categorias);
      expect(mockCategoriaRepository.find).toHaveBeenCalledWith({
        where: {
          tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
          ativo: true,
        },
        relations: ['prestadorServico', 'prestadorServico.empresa'],
      });
    });

    it('deve retornar apenas categorias ativas', async () => {
      await service.findByTipo(TipoServicoCategoria.SUPORTE_SOFTWARE);

      expect(mockCategoriaRepository.find).toHaveBeenCalledWith({
        where: {
          tipoServico: TipoServicoCategoria.SUPORTE_SOFTWARE,
          ativo: true,
        },
        relations: ['prestadorServico', 'prestadorServico.empresa'],
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma categoria por ID', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);

      const result = await service.findOne('categoria-uuid-1');

      expect(result).toEqual(mockCategoria);
      expect(mockCategoriaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'categoria-uuid-1' },
        relations: ['prestadorServico', 'prestadorServico.empresa'],
      });
    });

    it('deve retornar erro quando categoria não for encontrada', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException('Categoria invalid-id não encontrada'),
      );
    });
  });

  describe('findActive', () => {
    it('deve retornar apenas categorias ativas', async () => {
      const categoriasAtivas = [mockCategoria];
      mockCategoriaRepository.find.mockResolvedValue(categoriasAtivas);

      const result = await service.findActive();

      expect(result).toEqual(categoriasAtivas);
      expect(mockCategoriaRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['prestadorServico', 'prestadorServico.empresa'],
      });
    });
  });

  describe('findActiveByPrestador', () => {
    it('deve retornar categorias ativas do prestador', async () => {
      const categoriasAtivas = [mockCategoria];
      mockCategoriaRepository.find.mockResolvedValue(categoriasAtivas);

      const result = await service.findActiveByPrestador('prestador-uuid-1');

      expect(result).toEqual(categoriasAtivas);
      expect(mockCategoriaRepository.find).toHaveBeenCalledWith({
        where: {
          prestadorServicoId: 'prestador-uuid-1',
          ativo: true,
        },
        relations: ['prestadorServico'],
        order: {
          tipoServico: 'ASC',
        },
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdatePrestadorServicoCategoriaDto = {
      descricaoServico: 'Nova descrição',
      valorPadrao: 600.0,
      prazoExecucao: 7,
      ativo: false,
    };

    it('deve atualizar categoria com sucesso', async () => {
      const categoriaAtualizada = {
        ...mockCategoria,
        ...updateDto,
      };

      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);
      mockCategoriaRepository.save.mockResolvedValue(categoriaAtualizada);

      const result = await service.update('categoria-uuid-1', updateDto);

      expect(result).toEqual(categoriaAtualizada);
      expect(mockCategoriaRepository.save).toHaveBeenCalled();
    });

    it('deve retornar erro quando categoria não existir', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoriaRepository.save).not.toHaveBeenCalled();
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      const updateParcial = { valorPadrao: 750.0 };
      const categoriaAtualizada = {
        ...mockCategoria,
        valorPadrao: 750.0,
      };

      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);
      mockCategoriaRepository.save.mockResolvedValue(categoriaAtualizada);

      const result = await service.update('categoria-uuid-1', updateParcial);

      expect(result.valorPadrao).toBe(750.0);
      expect(result.descricaoServico).toBe(mockCategoria.descricaoServico);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const categoriaInativa = {
        ...mockCategoria,
        ativo: false,
      };

      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);
      mockCategoriaRepository.save.mockResolvedValue(categoriaInativa);

      const result = await service.toggleStatus('categoria-uuid-1');

      expect(result.ativo).toBe(false);
      expect(mockCategoriaRepository.save).toHaveBeenCalled();
    });

    it('deve alternar status de inativo para ativo', async () => {
      const categoriaInativa = {
        ...mockCategoria,
        ativo: false,
      };
      const categoriaAtiva = {
        ...mockCategoria,
        ativo: true,
      };

      mockCategoriaRepository.findOne.mockResolvedValue(categoriaInativa);
      mockCategoriaRepository.save.mockResolvedValue(categoriaAtiva);

      const result = await service.toggleStatus('categoria-uuid-1');

      expect(result.ativo).toBe(true);
    });

    it('deve retornar erro quando categoria não existir', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      await expect(service.toggleStatus('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover categoria com sucesso', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(mockCategoria);
      mockCategoriaRepository.remove.mockResolvedValue(mockCategoria);

      await service.remove('categoria-uuid-1');

      expect(mockCategoriaRepository.remove).toHaveBeenCalledWith(
        mockCategoria,
      );
    });

    it('deve retornar erro quando categoria não existir', async () => {
      mockCategoriaRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoriaRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('removeByPrestador', () => {
    it('deve remover todas as categorias do prestador', async () => {
      mockCategoriaRepository.delete.mockResolvedValue({ affected: 3 });

      await service.removeByPrestador('prestador-uuid-1');

      expect(mockCategoriaRepository.delete).toHaveBeenCalledWith({
        prestadorServicoId: 'prestador-uuid-1',
      });
    });

    it('deve funcionar mesmo quando prestador não tem categorias', async () => {
      mockCategoriaRepository.delete.mockResolvedValue({ affected: 0 });

      await service.removeByPrestador('prestador-uuid-2');

      expect(mockCategoriaRepository.delete).toHaveBeenCalledWith({
        prestadorServicoId: 'prestador-uuid-2',
      });
    });
  });

  describe('getEstatisticasPorTipo', () => {
    it('deve retornar estatísticas por tipo de serviço', async () => {
      // Simular contadores para diferentes tipos
      mockCategoriaRepository.count
        .mockResolvedValueOnce(10) // total MANUTENCAO_EQUIPAMENTOS
        .mockResolvedValueOnce(8) // ativos MANUTENCAO_EQUIPAMENTOS
        .mockResolvedValueOnce(5) // total SUPORTE_SOFTWARE
        .mockResolvedValueOnce(3) // ativos SUPORTE_SOFTWARE
        .mockResolvedValueOnce(0) // total AGUA
        .mockResolvedValueOnce(0); // ativos AGUA

      // Mock para simular apenas alguns tipos (para tornar o teste mais rápido)
      const originalValues = Object.values;
      Object.values = jest
        .fn()
        .mockReturnValue([
          TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
          TipoServicoCategoria.SUPORTE_SOFTWARE,
          TipoServicoCategoria.AGUA,
        ]);

      const result = await service.getEstatisticasPorTipo();

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        tipo: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
        total: 10,
        ativos: 8,
        inativos: 2,
      });
      expect(result[1]).toEqual({
        tipo: TipoServicoCategoria.SUPORTE_SOFTWARE,
        total: 5,
        ativos: 3,
        inativos: 2,
      });
      expect(result[2]).toEqual({
        tipo: TipoServicoCategoria.AGUA,
        total: 0,
        ativos: 0,
        inativos: 0,
      });

      // Restaurar Object.values original
      Object.values = originalValues;
    });
  });

  describe('getEstatisticasPrestador', () => {
    it('deve retornar estatísticas completas do prestador', async () => {
      const categorias = [
        {
          ...mockCategoria,
          tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
          ativo: true,
          requerOrcamento: true,
          requerAprovacao: true,
          valorPadrao: 500.0,
        },
        {
          ...mockCategoria,
          id: 'categoria-uuid-2',
          tipoServico: TipoServicoCategoria.SUPORTE_SOFTWARE,
          ativo: false,
          requerOrcamento: false,
          requerAprovacao: true,
          valorPadrao: 300.0,
        },
        {
          ...mockCategoria,
          id: 'categoria-uuid-3',
          tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
          ativo: true,
          requerOrcamento: false,
          requerAprovacao: false,
          valorPadrao: 700.0,
        },
      ];

      mockCategoriaRepository.find.mockResolvedValue(categorias);

      const result = await service.getEstatisticasPrestador('prestador-uuid-1');

      expect(result.resumo).toEqual({
        total: 3,
        ativas: 2,
        inativas: 1,
        comOrcamento: 1,
        comAprovacao: 2,
      });

      expect(result.porTipo).toHaveProperty(
        TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
      );
      expect(
        result.porTipo[TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS],
      ).toEqual({
        total: 2,
        ativas: 2,
        valorMedio: 600.0, // (500 + 700) / 2
      });

      expect(result.porTipo[TipoServicoCategoria.SUPORTE_SOFTWARE]).toEqual({
        total: 1,
        ativas: 0,
        valorMedio: 300.0,
      });
    });

    it('deve calcular valor médio zero quando não há valores', async () => {
      const categorias = [
        {
          ...mockCategoria,
          valorPadrao: null,
        },
      ];

      mockCategoriaRepository.find.mockResolvedValue(categorias);

      const result = await service.getEstatisticasPrestador('prestador-uuid-1');

      expect(
        result.porTipo[TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS].valorMedio,
      ).toBe(0);
    });

    it('deve retornar estatísticas vazias para prestador sem categorias', async () => {
      mockCategoriaRepository.find.mockResolvedValue([]);

      const result = await service.getEstatisticasPrestador('prestador-uuid-1');

      expect(result.resumo).toEqual({
        total: 0,
        ativas: 0,
        inativas: 0,
        comOrcamento: 0,
        comAprovacao: 0,
      });
      expect(result.porTipo).toEqual({});
    });
  });

  describe('getPrestadoresPorCategoria', () => {
    it('deve retornar prestadores da categoria especificada', async () => {
      const categorias = [
        {
          ...mockCategoria,
          prestadorServico: {
            ...mockPrestador,
            codigoPrestador: 'PREST001',
            empresa: {
              ...mockEmpresa,
              nomeFantasia: 'Empresa A',
            },
          },
        },
        {
          ...mockCategoria,
          id: 'categoria-uuid-2',
          prestadorServico: {
            ...mockPrestador,
            id: 'prestador-uuid-2',
            codigoPrestador: 'PREST002',
            empresa: {
              ...mockEmpresa,
              id: 'empresa-uuid-2',
              nomeFantasia: 'Empresa B',
            },
          },
          valorPadrao: 800.0,
          prazoExecucao: 3,
        },
      ];

      mockCategoriaRepository.find.mockResolvedValue(categorias);

      const result = await service.getPrestadoresPorCategoria(
        TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'prestador-uuid-1',
        codigo: 'PREST001',
        nome: 'Empresa A',
        valorPadrao: mockCategoria.valorPadrao,
        prazoExecucao: mockCategoria.prazoExecucao,
        responsavelTecnico: mockCategoria.responsavelTecnico,
        requerOrcamento: mockCategoria.requerOrcamento,
        requerAprovacao: mockCategoria.requerAprovacao,
      });
      expect(result[1]).toEqual({
        id: 'prestador-uuid-2',
        codigo: 'PREST002',
        nome: 'Empresa B',
        valorPadrao: 800.0,
        prazoExecucao: 3,
        responsavelTecnico: 'João Silva',
        requerOrcamento: false,
        requerAprovacao: true,
      });

      expect(mockCategoriaRepository.find).toHaveBeenCalledWith({
        where: {
          tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
          ativo: true,
        },
        relations: ['prestadorServico', 'prestadorServico.empresa'],
      });
    });

    it('deve retornar lista vazia quando não há prestadores na categoria', async () => {
      mockCategoriaRepository.find.mockResolvedValue([]);

      const result = await service.getPrestadoresPorCategoria(
        TipoServicoCategoria.AGUA,
      );

      expect(result).toEqual([]);
    });
  });

  describe('importarCategorias', () => {
    const categoriasParaImportar = [
      {
        tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
        descricaoServico: 'Manutenção importada',
        valorPadrao: 400.0,
      },
      {
        tipoServico: TipoServicoCategoria.SUPORTE_SOFTWARE,
        descricaoServico: 'Suporte importado',
        valorPadrao: 200.0,
      },
    ];

    it('deve importar categorias para prestador existente', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockCategoriaRepository.findOne
        .mockResolvedValueOnce(null) // primeira categoria não existe
        .mockResolvedValueOnce(null); // segunda categoria não existe

      const categoriasCriadas = [
        {
          ...mockCategoria,
          tipoServico: TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
          descricaoServico: 'Manutenção importada',
          valorPadrao: 400.0,
        },
        {
          ...mockCategoria,
          id: 'categoria-uuid-2',
          tipoServico: TipoServicoCategoria.SUPORTE_SOFTWARE,
          descricaoServico: 'Suporte importado',
          valorPadrao: 200.0,
        },
      ];

      mockCategoriaRepository.create
        .mockReturnValueOnce(categoriasCriadas[0])
        .mockReturnValueOnce(categoriasCriadas[1]);
      mockCategoriaRepository.save
        .mockResolvedValueOnce(categoriasCriadas[0])
        .mockResolvedValueOnce(categoriasCriadas[1]);

      const result = await service.importarCategorias(
        'prestador-uuid-1',
        categoriasParaImportar,
      );

      expect(result).toHaveLength(2);
      expect(result[0].tipoServico).toBe(
        TipoServicoCategoria.MANUTENCAO_EQUIPAMENTOS,
      );
      expect(result[1].tipoServico).toBe(TipoServicoCategoria.SUPORTE_SOFTWARE);
    });

    it('deve atualizar categorias existentes durante importação', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockCategoriaRepository.findOne
        .mockResolvedValueOnce(mockCategoria) // primeira categoria existe
        .mockResolvedValueOnce(null); // segunda categoria não existe

      const categoriaAtualizada = {
        ...mockCategoria,
        descricaoServico: 'Manutenção importada',
        valorPadrao: 400.0,
      };

      const novaBetegoria = {
        ...mockCategoria,
        id: 'categoria-uuid-2',
        tipoServico: TipoServicoCategoria.SUPORTE_SOFTWARE,
        descricaoServico: 'Suporte importado',
        valorPadrao: 200.0,
      };

      mockCategoriaRepository.save
        .mockResolvedValueOnce(categoriaAtualizada)
        .mockResolvedValueOnce(novaBetegoria);
      mockCategoriaRepository.create.mockReturnValueOnce(novaBetegoria);

      const result = await service.importarCategorias(
        'prestador-uuid-1',
        categoriasParaImportar,
      );

      expect(result).toHaveLength(2);
      expect(mockCategoriaRepository.save).toHaveBeenCalledTimes(2);
    });

    it('deve retornar erro quando prestador não existir', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(null);

      await expect(
        service.importarCategorias(
          'prestador-inexistente',
          categoriasParaImportar,
        ),
      ).rejects.toThrow(
        new NotFoundException('Prestador prestador-inexistente não encontrado'),
      );

      expect(mockCategoriaRepository.findOne).not.toHaveBeenCalled();
    });

    it('deve funcionar com lista vazia de categorias', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);

      const result = await service.importarCategorias('prestador-uuid-1', []);

      expect(result).toEqual([]);
      expect(mockCategoriaRepository.findOne).not.toHaveBeenCalled();
    });
  });
});
