import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FornecedorInsumoService } from './fornecedor-insumo.service';
import {
  FornecedorInsumo,
  UnidadeMedida,
  StatusInsumo,
} from '../entities/fornecedor-insumo.entity';
import {
  CategoriaInsumo,
  MetodoTransporte,
} from '../entities/fornecedor.entity';
import { CreateFornecedorInsumoDto } from '../dto/create-fornecedor-insumo.dto';
import { UpdateFornecedorInsumoDto } from '../dto/update-fornecedor-insumo.dto';

describe('FornecedorInsumoService', () => {
  let service: FornecedorInsumoService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getRawOne: jest.fn(),
    })),
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
      providers: [
        FornecedorInsumoService,
        {
          provide: getRepositoryToken(FornecedorInsumo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FornecedorInsumoService>(FornecedorInsumoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      mockRepository.findOne.mockResolvedValue(null); // Código não existe
      mockRepository.create.mockReturnValue(mockFornecedorInsumo);
      mockRepository.save.mockResolvedValue(mockFornecedorInsumo);

      const result = await service.create(createFornecedorInsumoDto);

      expect(result).toEqual(mockFornecedorInsumo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          fornecedor_id: createFornecedorInsumoDto.fornecedor_id,
          codigo_interno: createFornecedorInsumoDto.codigo_interno,
        },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(
        createFornecedorInsumoDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(mockFornecedorInsumo);
    });

    it('deve lançar ConflictException quando código interno já existir para o fornecedor', async () => {
      mockRepository.findOne.mockResolvedValue(mockFornecedorInsumo); // Código já existe

      await expect(service.create(createFornecedorInsumoDto)).rejects.toThrow(
        new ConflictException(
          'Já existe um insumo com este código interno para este fornecedor',
        ),
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
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
      };

      const insumoCompleto = { ...mockFornecedorInsumo, ...createCompleto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(insumoCompleto);
      mockRepository.save.mockResolvedValue(insumoCompleto);

      const result = await service.create(createCompleto);

      expect(result).toEqual(insumoCompleto);
      expect(result.codigo_fabricante).toBe('FAB001');
      expect(result.estoque_disponivel).toBe(100);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de insumos ordenados por data de criação', async () => {
      const insumos = [mockFornecedorInsumo];
      mockRepository.find.mockResolvedValue(insumos);

      const result = await service.findAll();

      expect(result).toEqual(insumos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['fornecedor', 'fornecedor.empresa'],
        order: { created_at: 'DESC' },
      });
    });

    it('deve retornar lista vazia quando não há insumos', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByFornecedor', () => {
    it('deve retornar insumos de um fornecedor específico', async () => {
      const insumos = [mockFornecedorInsumo];
      mockRepository.find.mockResolvedValue(insumos);

      const result = await service.findByFornecedor('fornecedor-uuid-1');

      expect(result).toEqual(insumos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { fornecedor_id: 'fornecedor-uuid-1' },
        order: { nome_insumo: 'ASC' },
      });
    });
  });

  describe('findByCategoria', () => {
    it('deve retornar insumos por categoria', async () => {
      const insumos = [mockFornecedorInsumo];
      mockRepository.find.mockResolvedValue(insumos);

      const result = await service.findByCategoria(
        CategoriaInsumo.REAGENTES_INSUMOS,
      );

      expect(result).toEqual(insumos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { categoria: CategoriaInsumo.REAGENTES_INSUMOS },
        relations: ['fornecedor', 'fornecedor.empresa'],
        order: { nome_insumo: 'ASC' },
      });
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas insumos ativos e disponíveis', async () => {
      const insumosAtivos = [mockFornecedorInsumo];
      mockRepository.find.mockResolvedValue(insumosAtivos);

      const result = await service.findAtivos();

      expect(result).toEqual(insumosAtivos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { ativo: true, status: StatusInsumo.DISPONIVEL },
        relations: ['fornecedor', 'fornecedor.empresa'],
        order: { nome_insumo: 'ASC' },
      });
    });
  });

  describe('findByStatus', () => {
    it('deve retornar insumos por status', async () => {
      const insumos = [mockFornecedorInsumo];
      mockRepository.find.mockResolvedValue(insumos);

      const result = await service.findByStatus(StatusInsumo.DISPONIVEL);

      expect(result).toEqual(insumos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: StatusInsumo.DISPONIVEL },
        relations: ['fornecedor', 'fornecedor.empresa'],
        order: { nome_insumo: 'ASC' },
      });
    });
  });

  describe('findByCodigoInterno', () => {
    it('deve retornar insumo por código interno do fornecedor', async () => {
      mockRepository.findOne.mockResolvedValue(mockFornecedorInsumo);

      const result = await service.findByCodigoInterno(
        'fornecedor-uuid-1',
        'INS001',
      );

      expect(result).toEqual(mockFornecedorInsumo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          fornecedor_id: 'fornecedor-uuid-1',
          codigo_interno: 'INS001',
        },
        relations: ['fornecedor', 'fornecedor.empresa'],
      });
    });

    it('deve lançar NotFoundException quando código não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findByCodigoInterno('fornecedor-uuid-1', 'INEXISTENTE'),
      ).rejects.toThrow(
        new NotFoundException(
          'Insumo com código INEXISTENTE não encontrado para este fornecedor',
        ),
      );
    });
  });

  describe('findByCodigoBarras', () => {
    it('deve retornar insumos por código de barras', async () => {
      const insumos = [mockFornecedorInsumo];
      mockRepository.find.mockResolvedValue(insumos);

      const result = await service.findByCodigoBarras('7891234567890');

      expect(result).toEqual(insumos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { codigo_barras: '7891234567890' },
        relations: ['fornecedor', 'fornecedor.empresa'],
      });
    });
  });

  describe('findPromocoes', () => {
    it('deve retornar insumos em promoção vigente', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockFornecedorInsumo]),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findPromocoes();

      expect(result).toEqual([mockFornecedorInsumo]);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'insumo.fornecedor',
        'fornecedor',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'fornecedor.empresa',
        'empresa',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'insumo.preco_promocional IS NOT NULL',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3); // data_inicio, data_fim, ativo
    });
  });

  describe('findComEstoqueBaixo', () => {
    it('deve retornar insumos com estoque baixo', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockFornecedorInsumo]),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findComEstoqueBaixo(10);

      expect(result).toEqual([mockFornecedorInsumo]);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'insumo.estoque_disponivel IS NOT NULL',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'insumo.estoque_disponivel <= :quantidade',
        {
          quantidade: 10,
        },
      );
    });

    it('deve usar quantidade mínima padrão quando não informada', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue([mockFornecedorInsumo]);

      await service.findComEstoqueBaixo();

      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'insumo.estoque_disponivel <= :quantidade',
        {
          quantidade: 10, // padrão
        },
      );
    });
  });

  describe('findVencendoValidade', () => {
    it('deve retornar insumos vencendo validade', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue([mockFornecedorInsumo]);

      const result = await service.findVencendoValidade(30);

      expect(result).toEqual([mockFornecedorInsumo]);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'insumo.data_validade IS NOT NULL',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'insumo.data_validade <= :dataLimite',
        {
          dataLimite: expect.any(Date),
        },
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um insumo por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockFornecedorInsumo);

      const result = await service.findOne('insumo-uuid-1');

      expect(result).toEqual(mockFornecedorInsumo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'insumo-uuid-1' },
        relations: ['fornecedor', 'fornecedor.empresa'],
      });
    });

    it('deve lançar NotFoundException quando insumo não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException('Insumo com ID invalid-id não encontrado'),
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateFornecedorInsumoDto = {
      nome_insumo: 'Nome Atualizado',
      preco_unitario: 30.0,
    };

    it('deve atualizar um insumo com sucesso', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.findOne.mockResolvedValue(null); // Código não existe
      const insumoAtualizado = { ...mockFornecedorInsumo, ...updateDto };
      mockRepository.save.mockResolvedValue(insumoAtualizado);

      const result = await service.update('insumo-uuid-1', updateDto);

      expect(result).toEqual(insumoAtualizado);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando tentar alterar código para um já existente', async () => {
      const updateComCodigo = { ...updateDto, codigo_interno: 'OUTRO001' };
      const insumoExistente = { ...mockFornecedorInsumo, id: 'outro-id' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.findOne.mockResolvedValue(insumoExistente); // Código já existe

      await expect(
        service.update('insumo-uuid-1', updateComCodigo),
      ).rejects.toThrow(
        new ConflictException(
          'Já existe um insumo com este código interno para este fornecedor',
        ),
      );
    });

    it('deve permitir manter mesmo código interno', async () => {
      const updateComMesmoCodigo = { ...updateDto, codigo_interno: 'INS001' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.findOne.mockResolvedValue(mockFornecedorInsumo); // Mesmo insumo
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        ...updateComMesmoCodigo,
      });

      const result = await service.update(
        'insumo-uuid-1',
        updateComMesmoCodigo,
      );

      expect(result.codigo_interno).toBe('INS001');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um insumo com sucesso', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.remove.mockResolvedValue(mockFornecedorInsumo);

      await service.remove('insumo-uuid-1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockFornecedorInsumo);
    });

    it('deve lançar NotFoundException quando insumo não existir', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Insumo não encontrado'));

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        ativo: false,
      });

      const result = await service.toggleStatus('insumo-uuid-1');

      expect(result.ativo).toBe(false);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve alternar status de inativo para ativo', async () => {
      const insumoInativo = { ...mockFornecedorInsumo, ativo: false };
      jest.spyOn(service, 'findOne').mockResolvedValue(insumoInativo);
      mockRepository.save.mockResolvedValue({ ...insumoInativo, ativo: true });

      const result = await service.toggleStatus('insumo-uuid-1');

      expect(result.ativo).toBe(true);
    });
  });

  describe('atualizarEstoque', () => {
    it('deve atualizar estoque com sucesso', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        estoque_disponivel: 100,
      });

      const result = await service.atualizarEstoque('insumo-uuid-1', 100);

      expect(result.estoque_disponivel).toBe(100);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve marcar como indisponível quando estoque for zero', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        estoque_disponivel: 0,
        status: StatusInsumo.INDISPONIVEL,
      });

      const result = await service.atualizarEstoque('insumo-uuid-1', 0);

      expect(result.estoque_disponivel).toBe(0);
      expect(result.status).toBe(StatusInsumo.INDISPONIVEL);
    });

    it('deve marcar como disponível quando tinha estoque zero e agora tem', async () => {
      const insumoSemEstoque = {
        ...mockFornecedorInsumo,
        estoque_disponivel: 0,
        status: StatusInsumo.INDISPONIVEL,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(insumoSemEstoque);
      mockRepository.save.mockResolvedValue({
        ...insumoSemEstoque,
        estoque_disponivel: 50,
        status: StatusInsumo.DISPONIVEL,
      });

      const result = await service.atualizarEstoque('insumo-uuid-1', 50);

      expect(result.estoque_disponivel).toBe(50);
      expect(result.status).toBe(StatusInsumo.DISPONIVEL);
    });
  });

  describe('atualizarPreco', () => {
    it('deve atualizar preço com sucesso', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockFornecedorInsumo)
        .mockResolvedValueOnce({
          ...mockFornecedorInsumo,
          preco_unitario: 35.0,
        });
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        preco_unitario: 35.0,
      });

      const result = await service.atualizarPreco('insumo-uuid-1', 35.0);

      expect(result.preco_unitario).toBe(35.0);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('adicionarPromocao', () => {
    it('deve adicionar promoção com sucesso', async () => {
      const dataInicio = new Date('2025-01-01');
      const dataFim = new Date('2025-01-31');
      const precoPromocional = 20.0;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        preco_promocional: precoPromocional,
        data_inicio_promocao: dataInicio,
        data_fim_promocao: dataFim,
      });

      const result = await service.adicionarPromocao(
        'insumo-uuid-1',
        precoPromocional,
        dataInicio,
        dataFim,
      );

      expect(result.preco_promocional).toBe(precoPromocional);
      expect(result.data_inicio_promocao).toEqual(dataInicio);
      expect(result.data_fim_promocao).toEqual(dataFim);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('removerPromocao', () => {
    it('deve remover promoção com sucesso', async () => {
      const insumoComPromocao = {
        ...mockFornecedorInsumo,
        preco_promocional: 20.0,
        data_inicio_promocao: new Date('2025-01-01'),
        data_fim_promocao: new Date('2025-01-31'),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(insumoComPromocao);
      mockRepository.save.mockResolvedValue({
        ...insumoComPromocao,
        preco_promocional: null,
        data_inicio_promocao: null,
        data_fim_promocao: null,
      });

      const result = await service.removerPromocao('insumo-uuid-1');

      expect(result.preco_promocional).toBeNull();
      expect(result.data_inicio_promocao).toBeNull();
      expect(result.data_fim_promocao).toBeNull();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('deve buscar insumos de um fornecedor por termo', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue([mockFornecedorInsumo]);

      const result = await service.search('fornecedor-uuid-1', 'Reagente');

      expect(result).toEqual([mockFornecedorInsumo]);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'insumo.fornecedor_id = :fornecedorId',
        {
          fornecedorId: 'fornecedor-uuid-1',
        },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(insumo.nome_insumo ILIKE :query OR insumo.codigo_interno LIKE :query OR insumo.codigo_barras LIKE :query OR insumo.marca ILIKE :query)',
        { query: '%Reagente%' },
      );
    });
  });

  describe('searchGlobal', () => {
    it('deve buscar insumos globalmente por termo', async () => {
      const queryBuilder = mockRepository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue([mockFornecedorInsumo]);
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.searchGlobal('Reagente');

      expect(result).toEqual([mockFornecedorInsumo]);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'insumo.fornecedor',
        'fornecedor',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'fornecedor.empresa',
        'empresa',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        '(insumo.nome_insumo ILIKE :query OR insumo.codigo_interno LIKE :query OR insumo.codigo_barras LIKE :query OR insumo.marca ILIKE :query OR empresa.nomeFantasia ILIKE :query)',
        { query: '%Reagente%' },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('insumo.ativo = true');
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas de insumos', async () => {
      const mockEstatisticas = {
        total: 100,
        ativos: 80,
        inativos: 20,
        porCategoria: [
          { categoria: 'reagentes_insumos', total: '50' },
          { categoria: 'equipamentos_medicos', total: '30' },
        ],
        porStatus: [
          { status: 'disponivel', total: '70' },
          { status: 'indisponivel', total: '10' },
        ],
        emPromocao: 15,
      };

      mockRepository.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(15);

      const queryBuilder1 = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockEstatisticas.porCategoria),
        getRawOne: jest.fn(),
      };

      const queryBuilder2 = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockEstatisticas.porStatus),
        getRawOne: jest.fn(),
      };

      mockRepository.createQueryBuilder
        .mockReturnValueOnce(queryBuilder1)
        .mockReturnValueOnce(queryBuilder2);

      const result = await service.getEstatisticas();

      expect(result).toEqual(mockEstatisticas);
      expect(mockRepository.count).toHaveBeenCalledTimes(3);
    });

    it('deve retornar estatísticas para fornecedor específico', async () => {
      const fornecedorId = 'fornecedor-uuid-1';
      mockRepository.count.mockResolvedValue(10);

      await service.getEstatisticas(fornecedorId);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { fornecedor_id: fornecedorId },
      });
    });
  });

  describe('registrarPedido', () => {
    it('deve registrar pedido com sucesso', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        data_ultimo_pedido: expect.any(Date),
        total_pedidos: 16,
      });

      await service.registrarPedido('insumo-uuid-1');

      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('avaliarProduto', () => {
    it('deve avaliar produto com sucesso', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedorInsumo);
      mockRepository.save.mockResolvedValue({
        ...mockFornecedorInsumo,
        avaliacao_produto: 5.0,
      });

      const result = await service.avaliarProduto('insumo-uuid-1', 5.0);

      expect(result.avaliacao_produto).toBe(5.0);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
