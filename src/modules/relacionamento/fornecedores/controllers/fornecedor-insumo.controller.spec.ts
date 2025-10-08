import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { FornecedorInsumoController } from './fornecedor-insumo.controller';
import { FornecedorInsumoService } from '../services/fornecedor-insumo.service';
import { CreateFornecedorInsumoDto } from '../dto/create-fornecedor-insumo.dto';
import { UpdateFornecedorInsumoDto } from '../dto/update-fornecedor-insumo.dto';
import {
  FornecedorInsumo,
  UnidadeMedida,
  StatusInsumo,
} from '../entities/fornecedor-insumo.entity';
import {
  CategoriaInsumo,
  MetodoTransporte,
} from '../entities/fornecedor.entity';

describe('FornecedorInsumoController', () => {
  let controller: FornecedorInsumoController;
  let service: FornecedorInsumoService;

  const mockFornecedorInsumoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    findPromocoes: jest.fn(),
    findComEstoqueBaixo: jest.fn(),
    findVencendoValidade: jest.fn(),
    findByFornecedor: jest.fn(),
    findByCategoria: jest.fn(),
    findByStatus: jest.fn(),
    findByCodigoBarras: jest.fn(),
    searchGlobal: jest.fn(),
    search: jest.fn(),
    getEstatisticas: jest.fn(),
    findByCodigoInterno: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    atualizarEstoque: jest.fn(),
    atualizarPreco: jest.fn(),
    adicionarPromocao: jest.fn(),
    removerPromocao: jest.fn(),
    avaliarProduto: jest.fn(),
    registrarPedido: jest.fn(),
    remove: jest.fn(),
  };

  const mockFornecedor = {
    id: 'fornecedor-uuid-1',
    codigo_fornecedor: 'FORN001',
    empresa: {
      id: 'empresa-uuid-1',
      nomeFantasia: 'Fornecedor Teste',
      razaoSocial: 'Fornecedor Teste Ltda',
      cnpj: '12.345.678/0001-90',
    },
  };

  const mockFornecedorInsumo = {
    id: 'insumo-uuid-1',
    fornecedor_id: 'fornecedor-uuid-1',
    fornecedor: mockFornecedor,
    codigo_interno: 'INS001',
    codigo_fabricante: 'FAB001',
    codigo_barras: '7891234567890',
    nome_insumo: 'Reagente Teste',
    descricao: 'Reagente para análises laboratoriais',
    marca: 'Marca Teste',
    fabricante: 'Fabricante Teste',
    categoria: CategoriaInsumo.REAGENTES_INSUMOS,
    subcategoria: 'Reagentes Clínicos',
    grupo_produto: 'Bioquímica',
    modelo: 'RT001',
    especificacao_tecnica: 'Reagente de alta pureza',
    cor: 'Transparente',
    tamanho: '500ml',
    voltagem: null,
    unidade_medida: UnidadeMedida.FRASCO,
    quantidade_embalagem: 1,
    quantidade_minima_pedido: 5,
    quantidade_maxima_pedido: 100,
    estoque_disponivel: 50,
    preco_unitario: 25.5,
    preco_promocional: null,
    data_inicio_promocao: null,
    data_fim_promocao: null,
    desconto_quantidade: 10.0,
    quantidade_desconto: 20,
    prazo_entrega_dias: 3,
    metodo_transporte_preferencial: MetodoTransporte.CORREIOS,
    custo_frete: 15.0,
    frete_gratis_acima_valor: true,
    valor_frete_gratis: 500.0,
    formas_pagamento: ['boleto', 'pix'],
    prazo_pagamento_dias: 30,
    status: StatusInsumo.DISPONIVEL,
    ativo: true,
    data_validade: new Date('2025-12-31'),
    prazo_validade_meses: 12,
    registro_anvisa: 'REG12345',
    registro_inmetro: null,
    certificacoes_produto: ['ISO 9001'],
    requer_receita_medica: false,
    produto_controlado: false,
    observacoes: 'Produto de alta qualidade',
    link_catalogo: 'https://catalogo.fornecedor.com/ins001',
    imagem_url: 'https://imagens.fornecedor.com/ins001.jpg',
    ficha_tecnica: 'Ficha técnica completa',
    data_ultimo_pedido: new Date(),
    total_pedidos: 15,
    avaliacao_produto: 4.5,
    created_at: new Date(),
    updated_at: new Date(),
  } as FornecedorInsumo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FornecedorInsumoController],
      providers: [
        {
          provide: FornecedorInsumoService,
          useValue: mockFornecedorInsumoService,
        },
      ],
    }).compile();

    controller = module.get<FornecedorInsumoController>(
      FornecedorInsumoController,
    );
    service = module.get<FornecedorInsumoService>(FornecedorInsumoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createFornecedorInsumoDto: CreateFornecedorInsumoDto = {
      fornecedor_id: 'fornecedor-uuid-1',
      codigo_interno: 'INS001',
      nome_insumo: 'Reagente Teste',
      categoria: CategoriaInsumo.REAGENTES_INSUMOS,
      unidade_medida: UnidadeMedida.FRASCO,
      preco_unitario: 25.5,
    };

    it('deve criar um insumo com sucesso', async () => {
      mockFornecedorInsumoService.create.mockResolvedValue(
        mockFornecedorInsumo,
      );

      const result = await controller.create(createFornecedorInsumoDto);

      expect(result).toEqual(mockFornecedorInsumo);
      expect(service.create).toHaveBeenCalledWith(createFornecedorInsumoDto);
    });

    it('deve retornar erro quando código interno já existir', async () => {
      const conflictError = new ConflictException(
        'Já existe um insumo com este código interno para este fornecedor',
      );
      mockFornecedorInsumoService.create.mockRejectedValue(conflictError);

      await expect(
        controller.create(createFornecedorInsumoDto),
      ).rejects.toThrow(ConflictException);
      expect(service.create).toHaveBeenCalledWith(createFornecedorInsumoDto);
    });

    it('deve criar insumo com dados completos', async () => {
      const createCompleto = {
        ...createFornecedorInsumoDto,
        codigo_fabricante: 'FAB001',
        codigo_barras: '7891234567890',
        descricao: 'Descrição completa',
        marca: 'Marca Teste',
        fabricante: 'Fabricante Teste',
        subcategoria: 'Reagentes Clínicos',
        modelo: 'RT001',
        quantidade_minima_pedido: 5,
        estoque_disponivel: 100,
        registro_anvisa: 'REG12345',
      };

      const insumoCompleto = { ...mockFornecedorInsumo, ...createCompleto };
      mockFornecedorInsumoService.create.mockResolvedValue(insumoCompleto);

      const result = await controller.create(createCompleto);

      expect(result).toEqual(insumoCompleto);
      expect(result.codigo_fabricante).toBe('FAB001');
      expect(result.registro_anvisa).toBe('REG12345');
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de insumos', async () => {
      const insumos = [mockFornecedorInsumo];
      mockFornecedorInsumoService.findAll.mockResolvedValue(insumos);

      const result = await controller.findAll();

      expect(result).toEqual(insumos);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há insumos', async () => {
      mockFornecedorInsumoService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas insumos ativos e disponíveis', async () => {
      const insumosAtivos = [mockFornecedorInsumo];
      mockFornecedorInsumoService.findAtivos.mockResolvedValue(insumosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual(insumosAtivos);
      expect(service.findAtivos).toHaveBeenCalled();
    });
  });

  describe('findPromocoes', () => {
    it('deve retornar insumos em promoção', async () => {
      const insumoPromocao = {
        ...mockFornecedorInsumo,
        preco_promocional: 20.0,
        data_inicio_promocao: new Date('2025-01-01'),
        data_fim_promocao: new Date('2025-01-31'),
      };
      mockFornecedorInsumoService.findPromocoes.mockResolvedValue([
        insumoPromocao,
      ]);

      const result = await controller.findPromocoes();

      expect(result).toEqual([insumoPromocao]);
      expect(service.findPromocoes).toHaveBeenCalled();
    });
  });

  describe('findComEstoqueBaixo', () => {
    it('deve retornar insumos com estoque baixo usando valor padrão', async () => {
      const insumosEstoqueBaixo = [
        { ...mockFornecedorInsumo, estoque_disponivel: 5 },
      ];
      mockFornecedorInsumoService.findComEstoqueBaixo.mockResolvedValue(
        insumosEstoqueBaixo,
      );

      const result = await controller.findComEstoqueBaixo();

      expect(result).toEqual(insumosEstoqueBaixo);
      expect(service.findComEstoqueBaixo).toHaveBeenCalledWith(undefined);
    });

    it('deve retornar insumos com estoque baixo usando valor especificado', async () => {
      const insumosEstoqueBaixo = [
        { ...mockFornecedorInsumo, estoque_disponivel: 3 },
      ];
      mockFornecedorInsumoService.findComEstoqueBaixo.mockResolvedValue(
        insumosEstoqueBaixo,
      );

      const result = await controller.findComEstoqueBaixo(5);

      expect(result).toEqual(insumosEstoqueBaixo);
      expect(service.findComEstoqueBaixo).toHaveBeenCalledWith(5);
    });
  });

  describe('findVencendoValidade', () => {
    it('deve retornar insumos vencendo validade usando valor padrão', async () => {
      const insumosVencendo = [
        { ...mockFornecedorInsumo, data_validade: new Date('2025-02-15') },
      ];
      mockFornecedorInsumoService.findVencendoValidade.mockResolvedValue(
        insumosVencendo,
      );

      const result = await controller.findVencendoValidade();

      expect(result).toEqual(insumosVencendo);
      expect(service.findVencendoValidade).toHaveBeenCalledWith(undefined);
    });

    it('deve retornar insumos vencendo validade usando valor especificado', async () => {
      const insumosVencendo = [
        { ...mockFornecedorInsumo, data_validade: new Date('2025-01-30') },
      ];
      mockFornecedorInsumoService.findVencendoValidade.mockResolvedValue(
        insumosVencendo,
      );

      const result = await controller.findVencendoValidade(15);

      expect(result).toEqual(insumosVencendo);
      expect(service.findVencendoValidade).toHaveBeenCalledWith(15);
    });
  });

  describe('findByFornecedor', () => {
    it('deve retornar insumos de um fornecedor específico', async () => {
      const insumos = [mockFornecedorInsumo];
      mockFornecedorInsumoService.findByFornecedor.mockResolvedValue(insumos);

      const result = await controller.findByFornecedor('fornecedor-uuid-1');

      expect(result).toEqual(insumos);
      expect(service.findByFornecedor).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
      );
    });
  });

  describe('findByCategoria', () => {
    it('deve retornar insumos por categoria', async () => {
      const insumos = [mockFornecedorInsumo];
      mockFornecedorInsumoService.findByCategoria.mockResolvedValue(insumos);

      const result = await controller.findByCategoria(
        CategoriaInsumo.REAGENTES_INSUMOS,
      );

      expect(result).toEqual(insumos);
      expect(service.findByCategoria).toHaveBeenCalledWith(
        CategoriaInsumo.REAGENTES_INSUMOS,
      );
    });
  });

  describe('findByStatus', () => {
    it('deve retornar insumos por status', async () => {
      const insumos = [mockFornecedorInsumo];
      mockFornecedorInsumoService.findByStatus.mockResolvedValue(insumos);

      const result = await controller.findByStatus(StatusInsumo.DISPONIVEL);

      expect(result).toEqual(insumos);
      expect(service.findByStatus).toHaveBeenCalledWith(
        StatusInsumo.DISPONIVEL,
      );
    });
  });

  describe('findByCodigoBarras', () => {
    it('deve retornar insumos por código de barras', async () => {
      const insumos = [mockFornecedorInsumo];
      mockFornecedorInsumoService.findByCodigoBarras.mockResolvedValue(insumos);

      const result = await controller.findByCodigoBarras('7891234567890');

      expect(result).toEqual(insumos);
      expect(service.findByCodigoBarras).toHaveBeenCalledWith('7891234567890');
    });
  });

  describe('searchGlobal', () => {
    it('deve buscar insumos globalmente por termo', async () => {
      const resultados = [mockFornecedorInsumo];
      mockFornecedorInsumoService.searchGlobal.mockResolvedValue(resultados);

      const result = await controller.searchGlobal('Reagente');

      expect(result).toEqual(resultados);
      expect(service.searchGlobal).toHaveBeenCalledWith('Reagente');
    });

    it('deve retornar lista vazia quando não encontrar resultados', async () => {
      mockFornecedorInsumoService.searchGlobal.mockResolvedValue([]);

      const result = await controller.searchGlobal('inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('deve buscar insumos de um fornecedor específico', async () => {
      const resultados = [mockFornecedorInsumo];
      mockFornecedorInsumoService.search.mockResolvedValue(resultados);

      const result = await controller.search('fornecedor-uuid-1', 'Reagente');

      expect(result).toEqual(resultados);
      expect(service.search).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
        'Reagente',
      );
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas gerais quando não especificar fornecedor', async () => {
      const mockEstatisticas = {
        total: 100,
        ativos: 80,
        inativos: 20,
        porCategoria: [
          { categoria: 'reagentes_insumos', total: 50 },
          { categoria: 'equipamentos_medicos', total: 30 },
        ],
        porStatus: [
          { status: 'disponivel', total: 70 },
          { status: 'indisponivel', total: 10 },
        ],
        emPromocao: 15,
      };

      mockFornecedorInsumoService.getEstatisticas.mockResolvedValue(
        mockEstatisticas,
      );

      const result = await controller.getEstatisticas();

      expect(result).toEqual(mockEstatisticas);
      expect(service.getEstatisticas).toHaveBeenCalledWith(undefined);
    });

    it('deve retornar estatísticas de fornecedor específico', async () => {
      const mockEstatisticas = {
        total: 20,
        ativos: 18,
        inativos: 2,
        porCategoria: [{ categoria: 'reagentes_insumos', total: 15 }],
        porStatus: [{ status: 'disponivel', total: 18 }],
        emPromocao: 3,
      };

      mockFornecedorInsumoService.getEstatisticas.mockResolvedValue(
        mockEstatisticas,
      );

      const result = await controller.getEstatisticas('fornecedor-uuid-1');

      expect(result).toEqual(mockEstatisticas);
      expect(service.getEstatisticas).toHaveBeenCalledWith('fornecedor-uuid-1');
    });
  });

  describe('findByCodigoInterno', () => {
    it('deve retornar insumo por código interno do fornecedor', async () => {
      mockFornecedorInsumoService.findByCodigoInterno.mockResolvedValue(
        mockFornecedorInsumo,
      );

      const result = await controller.findByCodigoInterno(
        'fornecedor-uuid-1',
        'INS001',
      );

      expect(result).toEqual(mockFornecedorInsumo);
      expect(service.findByCodigoInterno).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
        'INS001',
      );
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Insumo com código INEXISTENTE não encontrado para este fornecedor',
      );
      mockFornecedorInsumoService.findByCodigoInterno.mockRejectedValue(
        notFoundError,
      );

      await expect(
        controller.findByCodigoInterno('fornecedor-uuid-1', 'INEXISTENTE'),
      ).rejects.toThrow(NotFoundException);
      expect(service.findByCodigoInterno).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
        'INEXISTENTE',
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um insumo por ID', async () => {
      mockFornecedorInsumoService.findOne.mockResolvedValue(
        mockFornecedorInsumo,
      );

      const result = await controller.findOne('insumo-uuid-1');

      expect(result).toEqual(mockFornecedorInsumo);
      expect(service.findOne).toHaveBeenCalledWith('insumo-uuid-1');
    });

    it('deve retornar erro quando insumo não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Insumo com ID invalid-id não encontrado',
      );
      mockFornecedorInsumoService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    const updateDto: UpdateFornecedorInsumoDto = {
      nome_insumo: 'Nome Atualizado',
      preco_unitario: 30.0,
    };

    it('deve atualizar um insumo com sucesso', async () => {
      const insumoAtualizado = {
        ...mockFornecedorInsumo,
        ...updateDto,
      };
      mockFornecedorInsumoService.update.mockResolvedValue(insumoAtualizado);

      const result = await controller.update('insumo-uuid-1', updateDto);

      expect(result).toEqual(insumoAtualizado);
      expect(service.update).toHaveBeenCalledWith('insumo-uuid-1', updateDto);
    });

    it('deve retornar erro quando insumo não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Insumo com ID invalid-id não encontrado',
      );
      mockFornecedorInsumoService.update.mockRejectedValue(notFoundError);

      await expect(controller.update('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith('invalid-id', updateDto);
    });

    it('deve retornar erro quando código já existir para outro insumo', async () => {
      const updateComCodigo = { ...updateDto, codigo_interno: 'OUTRO001' };
      const conflictError = new ConflictException(
        'Já existe um insumo com este código interno para este fornecedor',
      );
      mockFornecedorInsumoService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('insumo-uuid-1', updateComCodigo),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const insumoInativo = { ...mockFornecedorInsumo, ativo: false };
      mockFornecedorInsumoService.toggleStatus.mockResolvedValue(insumoInativo);

      const result = await controller.toggleStatus('insumo-uuid-1');

      expect(result).toEqual(insumoInativo);
      expect(result.ativo).toBe(false);
      expect(service.toggleStatus).toHaveBeenCalledWith('insumo-uuid-1');
    });

    it('deve alternar status de inativo para ativo', async () => {
      const insumoAtivo = { ...mockFornecedorInsumo, ativo: true };
      mockFornecedorInsumoService.toggleStatus.mockResolvedValue(insumoAtivo);

      const result = await controller.toggleStatus('insumo-uuid-1');

      expect(result).toEqual(insumoAtivo);
      expect(result.ativo).toBe(true);
    });
  });

  describe('atualizarEstoque', () => {
    it('deve atualizar estoque com sucesso', async () => {
      const insumoEstoqueAtualizado = {
        ...mockFornecedorInsumo,
        estoque_disponivel: 100,
      };
      mockFornecedorInsumoService.atualizarEstoque.mockResolvedValue(
        insumoEstoqueAtualizado,
      );

      const result = await controller.atualizarEstoque('insumo-uuid-1', 100);

      expect(result).toEqual(insumoEstoqueAtualizado);
      expect(result.estoque_disponivel).toBe(100);
      expect(service.atualizarEstoque).toHaveBeenCalledWith(
        'insumo-uuid-1',
        100,
      );
    });

    it('deve marcar como indisponível quando estoque for zero', async () => {
      const insumoSemEstoque = {
        ...mockFornecedorInsumo,
        estoque_disponivel: 0,
        status: StatusInsumo.INDISPONIVEL,
      };
      mockFornecedorInsumoService.atualizarEstoque.mockResolvedValue(
        insumoSemEstoque,
      );

      const result = await controller.atualizarEstoque('insumo-uuid-1', 0);

      expect(result.estoque_disponivel).toBe(0);
      expect(result.status).toBe(StatusInsumo.INDISPONIVEL);
    });
  });

  describe('atualizarPreco', () => {
    it('deve atualizar preço com sucesso', async () => {
      const insumoPrecoAtualizado = {
        ...mockFornecedorInsumo,
        preco_unitario: 35.0,
      };
      mockFornecedorInsumoService.atualizarPreco.mockResolvedValue(
        insumoPrecoAtualizado,
      );

      const result = await controller.atualizarPreco('insumo-uuid-1', 35.0);

      expect(result).toEqual(insumoPrecoAtualizado);
      expect(result.preco_unitario).toBe(35.0);
      expect(service.atualizarPreco).toHaveBeenCalledWith(
        'insumo-uuid-1',
        35.0,
      );
    });
  });

  describe('adicionarPromocao', () => {
    it('deve adicionar promoção com sucesso', async () => {
      const promocaoData = {
        preco_promocional: 20.0,
        data_inicio: new Date('2025-01-01'),
        data_fim: new Date('2025-01-31'),
      };

      const insumoComPromocao = {
        ...mockFornecedorInsumo,
        preco_promocional: 20.0,
        data_inicio_promocao: new Date('2025-01-01'),
        data_fim_promocao: new Date('2025-01-31'),
      };

      mockFornecedorInsumoService.adicionarPromocao.mockResolvedValue(
        insumoComPromocao,
      );

      const result = await controller.adicionarPromocao(
        'insumo-uuid-1',
        promocaoData,
      );

      expect(result).toEqual(insumoComPromocao);
      expect(result.preco_promocional).toBe(20.0);
      expect(service.adicionarPromocao).toHaveBeenCalledWith(
        'insumo-uuid-1',
        20.0,
        promocaoData.data_inicio,
        promocaoData.data_fim,
      );
    });
  });

  describe('removerPromocao', () => {
    it('deve remover promoção com sucesso', async () => {
      const insumoSemPromocao = {
        ...mockFornecedorInsumo,
        preco_promocional: null,
        data_inicio_promocao: null,
        data_fim_promocao: null,
      };

      mockFornecedorInsumoService.removerPromocao.mockResolvedValue(
        insumoSemPromocao,
      );

      const result = await controller.removerPromocao('insumo-uuid-1');

      expect(result).toEqual(insumoSemPromocao);
      expect(result.preco_promocional).toBeNull();
      expect(service.removerPromocao).toHaveBeenCalledWith('insumo-uuid-1');
    });
  });

  describe('avaliarProduto', () => {
    it('deve avaliar produto com sucesso', async () => {
      const insumoAvaliado = {
        ...mockFornecedorInsumo,
        avaliacao_produto: 5.0,
      };
      mockFornecedorInsumoService.avaliarProduto.mockResolvedValue(
        insumoAvaliado,
      );

      const result = await controller.avaliarProduto('insumo-uuid-1', 5.0);

      expect(result).toEqual(insumoAvaliado);
      expect(result.avaliacao_produto).toBe(5.0);
      expect(service.avaliarProduto).toHaveBeenCalledWith('insumo-uuid-1', 5.0);
    });
  });

  describe('registrarPedido', () => {
    it('deve registrar pedido com sucesso', async () => {
      mockFornecedorInsumoService.registrarPedido.mockResolvedValue(undefined);

      const result = await controller.registrarPedido('insumo-uuid-1');

      expect(result).toBeUndefined();
      expect(service.registrarPedido).toHaveBeenCalledWith('insumo-uuid-1');
    });
  });

  describe('remove', () => {
    it('deve remover um insumo com sucesso', async () => {
      mockFornecedorInsumoService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('insumo-uuid-1');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('insumo-uuid-1');
    });

    it('deve retornar erro quando insumo não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Insumo com ID invalid-id não encontrado',
      );
      mockFornecedorInsumoService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalid-id');
    });
  });
});
