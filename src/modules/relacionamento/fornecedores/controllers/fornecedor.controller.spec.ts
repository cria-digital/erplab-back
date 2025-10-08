import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { FornecedorController } from './fornecedor.controller';
import { FornecedorService } from '../services/fornecedor.service';
import { CreateFornecedorDto } from '../dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from '../dto/update-fornecedor.dto';
import {
  Fornecedor,
  StatusFornecedor,
  CategoriaInsumo,
  MetodoTransporte,
  FormaPagamentoFornecedor,
} from '../entities/fornecedor.entity';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('FornecedorController', () => {
  let controller: FornecedorController;
  let service: FornecedorService;

  const mockFornecedorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    findPendentesAprovacao: jest.fn(),
    search: jest.fn(),
    getEstatisticas: jest.fn(),
    getFornecedoresPorRegiao: jest.fn(),
    findByStatus: jest.fn(),
    findByCategoria: jest.fn(),
    findByRegiao: jest.fn(),
    findByCodigo: jest.fn(),
    findByCnpj: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    aprovarFornecedor: jest.fn(),
    reprovarFornecedor: jest.fn(),
    atualizarAvaliacao: jest.fn(),
    remove: jest.fn(),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.FORNECEDORES,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Fornecedor Teste Ltda',
    nomeFantasia: 'Fornecedor Teste',
    emailComercial: 'contato@fornecedorteste.com.br',
    ativo: true,
  };

  const mockFornecedor = {
    id: 'fornecedor-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigo_fornecedor: 'FORN001',
    categorias_fornecidas: [CategoriaInsumo.REAGENTES_INSUMOS],
    metodos_transporte: [MetodoTransporte.CORREIOS],
    formas_pagamento_aceitas: [FormaPagamentoFornecedor.BOLETO],
    prazo_entrega_padrao: 7,
    prazo_entrega_urgente: 2,
    orcamento_minimo: 100.0,
    orcamento_maximo: 10000.0,
    desconto_padrao: 5.0,
    avaliacao_media: 4.5,
    total_avaliacoes: 10,
    status_fornecedor: StatusFornecedor.ATIVO,
    certificacoes: ['ISO 9001'],
    possui_certificacao_iso: true,
    possui_licenca_anvisa: false,
    representante_comercial: 'João Silva',
    telefone_comercial: '(11) 1234-5678',
    email_comercial: 'comercial@fornecedor.com.br',
    gerente_conta: 'Maria Santos',
    aceita_pedido_urgente: true,
    entrega_sabado: false,
    entrega_domingo: false,
    horario_inicio_entrega: '08:00',
    horario_fim_entrega: '17:00',
    estados_atendidos: ['SP', 'RJ'],
    cidades_atendidas: ['São Paulo', 'Rio de Janeiro'],
    atende_todo_brasil: false,
    observacoes: 'Fornecedor confiável',
    condicoes_especiais: 'Desconto para grandes volumes',
    historico_problemas: null,
    data_ultimo_pedido: new Date(),
    data_proxima_avaliacao: new Date(),
    aprovado_por: 'admin-uuid',
    data_aprovacao: new Date(),
    data_vencimento_licencas: null,
    created_at: new Date(),
    updated_at: new Date(),
  } as Fornecedor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FornecedorController],
      providers: [
        {
          provide: FornecedorService,
          useValue: mockFornecedorService,
        },
      ],
    }).compile();

    controller = module.get<FornecedorController>(FornecedorController);
    service = module.get<FornecedorService>(FornecedorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createFornecedorDto: CreateFornecedorDto = {
      empresa: {
        tipoEmpresa: TipoEmpresaEnum.FORNECEDORES,
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'Fornecedor Teste Ltda',
        nomeFantasia: 'Fornecedor Teste',
        emailComercial: 'contato@fornecedorteste.com.br',
      },
      codigo_fornecedor: 'FORN001',
      categorias_fornecidas: [CategoriaInsumo.REAGENTES_INSUMOS],
      metodos_transporte: [MetodoTransporte.CORREIOS],
      formas_pagamento_aceitas: [FormaPagamentoFornecedor.BOLETO],
      prazo_entrega_padrao: 7,
    };

    it('deve criar um fornecedor com sucesso', async () => {
      mockFornecedorService.create.mockResolvedValue(mockFornecedor);

      const result = await controller.create(createFornecedorDto);

      expect(result).toEqual(mockFornecedor);
      expect(service.create).toHaveBeenCalledWith(createFornecedorDto);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException(
        'Já existe um fornecedor com este código',
      );
      mockFornecedorService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createFornecedorDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(createFornecedorDto);
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      const conflictError = new ConflictException(
        'Já existe uma empresa com este CNPJ',
      );
      mockFornecedorService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createFornecedorDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar fornecedor com dados completos', async () => {
      const createCompleto = {
        ...createFornecedorDto,
        prazo_entrega_urgente: 2,
        orcamento_minimo: 100.0,
        desconto_padrao: 5.0,
        representante_comercial: 'João Silva',
        aceita_pedido_urgente: true,
        estados_atendidos: ['SP', 'RJ'],
        certificacoes: ['ISO 9001'],
        possui_certificacao_iso: true,
      };

      const fornecedorCompleto = { ...mockFornecedor, ...createCompleto };
      mockFornecedorService.create.mockResolvedValue(fornecedorCompleto);

      const result = await controller.create(createCompleto);

      expect(result).toEqual(fornecedorCompleto);
      expect(result.prazo_entrega_urgente).toBe(2);
      expect(result.aceita_pedido_urgente).toBe(true);
      expect(result.certificacoes).toContain('ISO 9001');
    });

    it('deve criar fornecedor com diferentes categorias e métodos de pagamento', async () => {
      const createVariado = {
        ...createFornecedorDto,
        categorias_fornecidas: [
          CategoriaInsumo.EQUIPAMENTOS_MEDICOS,
          CategoriaInsumo.MEDICAMENTOS,
        ],
        metodos_transporte: [
          MetodoTransporte.TRANSPORTADORA,
          MetodoTransporte.PROPRIO,
        ],
        formas_pagamento_aceitas: [
          FormaPagamentoFornecedor.PIX,
          FormaPagamentoFornecedor.PRAZO_30_DIAS,
        ],
      };

      const fornecedorVariado = {
        ...mockFornecedor,
        categorias_fornecidas: [
          CategoriaInsumo.EQUIPAMENTOS_MEDICOS,
          CategoriaInsumo.MEDICAMENTOS,
        ],
        metodos_transporte: [
          MetodoTransporte.TRANSPORTADORA,
          MetodoTransporte.PROPRIO,
        ],
        formas_pagamento_aceitas: [
          FormaPagamentoFornecedor.PIX,
          FormaPagamentoFornecedor.PRAZO_30_DIAS,
        ],
      };

      mockFornecedorService.create.mockResolvedValue(fornecedorVariado);

      const result = await controller.create(createVariado);

      expect(result.categorias_fornecidas).toEqual([
        CategoriaInsumo.EQUIPAMENTOS_MEDICOS,
        CategoriaInsumo.MEDICAMENTOS,
      ]);
      expect(result.metodos_transporte).toEqual([
        MetodoTransporte.TRANSPORTADORA,
        MetodoTransporte.PROPRIO,
      ]);
      expect(result.formas_pagamento_aceitas).toEqual([
        FormaPagamentoFornecedor.PIX,
        FormaPagamentoFornecedor.PRAZO_30_DIAS,
      ]);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de fornecedores', async () => {
      const fornecedores = [mockFornecedor];
      mockFornecedorService.findAll.mockResolvedValue(fornecedores);

      const result = await controller.findAll();

      expect(result).toEqual(fornecedores);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há fornecedores', async () => {
      mockFornecedorService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve retornar fornecedores ordenados por nome fantasia', async () => {
      const fornecedor1 = {
        ...mockFornecedor,
        id: 'forn-1',
        empresa: { ...mockEmpresa, nomeFantasia: 'B Fornecedor' },
      };
      const fornecedor2 = {
        ...mockFornecedor,
        id: 'forn-2',
        empresa: { ...mockEmpresa, nomeFantasia: 'A Fornecedor' },
      };

      mockFornecedorService.findAll.mockResolvedValue([
        fornecedor1,
        fornecedor2,
      ]);

      const result = await controller.findAll();

      expect(result).toEqual([fornecedor1, fornecedor2]);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas fornecedores ativos', async () => {
      const fornecedoresAtivos = [mockFornecedor];
      mockFornecedorService.findAtivos.mockResolvedValue(fornecedoresAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual(fornecedoresAtivos);
      expect(service.findAtivos).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há fornecedores ativos', async () => {
      mockFornecedorService.findAtivos.mockResolvedValue([]);

      const result = await controller.findAtivos();

      expect(result).toEqual([]);
    });
  });

  describe('findPendentesAprovacao', () => {
    it('deve retornar fornecedores pendentes de aprovação', async () => {
      const fornecedorPendente = {
        ...mockFornecedor,
        status_fornecedor: StatusFornecedor.PENDENTE_APROVACAO,
      };
      mockFornecedorService.findPendentesAprovacao.mockResolvedValue([
        fornecedorPendente,
      ]);

      const result = await controller.findPendentesAprovacao();

      expect(result).toEqual([fornecedorPendente]);
      expect(service.findPendentesAprovacao).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('deve buscar fornecedores por termo', async () => {
      const resultados = [mockFornecedor];
      mockFornecedorService.search.mockResolvedValue(resultados);

      const result = await controller.search('Teste');

      expect(result).toEqual(resultados);
      expect(service.search).toHaveBeenCalledWith('Teste');
    });

    it('deve buscar fornecedores por código', async () => {
      const resultados = [mockFornecedor];
      mockFornecedorService.search.mockResolvedValue(resultados);

      const result = await controller.search('FORN001');

      expect(result).toEqual(resultados);
      expect(service.search).toHaveBeenCalledWith('FORN001');
    });

    it('deve buscar fornecedores por CNPJ', async () => {
      const resultados = [mockFornecedor];
      mockFornecedorService.search.mockResolvedValue(resultados);

      const result = await controller.search('12.345.678');

      expect(result).toEqual(resultados);
      expect(service.search).toHaveBeenCalledWith('12.345.678');
    });

    it('deve retornar lista vazia quando não encontrar resultados', async () => {
      mockFornecedorService.search.mockResolvedValue([]);

      const result = await controller.search('inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas dos fornecedores', async () => {
      const mockEstatisticas = {
        total: 10,
        ativos: 8,
        inativos: 2,
        porStatus: [
          { status: 'ativo', total: 8 },
          { status: 'bloqueado', total: 2 },
        ],
        porCategoria: [
          { categoria: 'reagentes_insumos', total: 5 },
          { categoria: 'equipamentos_medicos', total: 3 },
        ],
        avaliacaoGeral: 4.2,
      };

      mockFornecedorService.getEstatisticas.mockResolvedValue(mockEstatisticas);

      const result = await controller.getEstatisticas();

      expect(result).toEqual(mockEstatisticas);
      expect(service.getEstatisticas).toHaveBeenCalled();
    });
  });

  describe('getFornecedoresPorRegiao', () => {
    it('deve retornar fornecedores por região', async () => {
      const mockRegiao = {
        nacionais: 3,
        regionais: [
          { estado: 'SP', total: 5 },
          { estado: 'RJ', total: 2 },
        ],
      };

      mockFornecedorService.getFornecedoresPorRegiao.mockResolvedValue(
        mockRegiao,
      );

      const result = await controller.getFornecedoresPorRegiao();

      expect(result).toEqual(mockRegiao);
      expect(service.getFornecedoresPorRegiao).toHaveBeenCalled();
    });
  });

  describe('findByStatus', () => {
    it('deve retornar fornecedores por status', async () => {
      const fornecedoresAtivos = [mockFornecedor];
      mockFornecedorService.findByStatus.mockResolvedValue(fornecedoresAtivos);

      const result = await controller.findByStatus('ativo');

      expect(result).toEqual(fornecedoresAtivos);
      expect(service.findByStatus).toHaveBeenCalledWith('ativo');
    });

    it('deve retornar fornecedores bloqueados', async () => {
      const fornecedorBloqueado = {
        ...mockFornecedor,
        status_fornecedor: StatusFornecedor.BLOQUEADO,
      };
      mockFornecedorService.findByStatus.mockResolvedValue([
        fornecedorBloqueado,
      ]);

      const result = await controller.findByStatus('bloqueado');

      expect(result).toEqual([fornecedorBloqueado]);
      expect(service.findByStatus).toHaveBeenCalledWith('bloqueado');
    });
  });

  describe('findByCategoria', () => {
    it('deve retornar fornecedores por categoria', async () => {
      const fornecedores = [mockFornecedor];
      mockFornecedorService.findByCategoria.mockResolvedValue(fornecedores);

      const result = await controller.findByCategoria(
        CategoriaInsumo.REAGENTES_INSUMOS,
      );

      expect(result).toEqual(fornecedores);
      expect(service.findByCategoria).toHaveBeenCalledWith(
        CategoriaInsumo.REAGENTES_INSUMOS,
      );
    });

    it('deve retornar fornecedores de equipamentos médicos', async () => {
      const fornecedor = {
        ...mockFornecedor,
        categorias_fornecidas: [CategoriaInsumo.EQUIPAMENTOS_MEDICOS],
      };
      mockFornecedorService.findByCategoria.mockResolvedValue([fornecedor]);

      const result = await controller.findByCategoria(
        CategoriaInsumo.EQUIPAMENTOS_MEDICOS,
      );

      expect(result).toEqual([fornecedor]);
      expect(service.findByCategoria).toHaveBeenCalledWith(
        CategoriaInsumo.EQUIPAMENTOS_MEDICOS,
      );
    });
  });

  describe('findByRegiao', () => {
    it('deve retornar fornecedores que atendem região específica', async () => {
      const fornecedores = [mockFornecedor];
      mockFornecedorService.findByRegiao.mockResolvedValue(fornecedores);

      const result = await controller.findByRegiao('SP,RJ');

      expect(result).toEqual(fornecedores);
      expect(service.findByRegiao).toHaveBeenCalledWith(['SP', 'RJ']);
    });

    it('deve processar estados com espaços e converter para maiúsculas', async () => {
      const fornecedores = [mockFornecedor];
      mockFornecedorService.findByRegiao.mockResolvedValue(fornecedores);

      const result = await controller.findByRegiao('sp, rj, mg');

      expect(result).toEqual(fornecedores);
      expect(service.findByRegiao).toHaveBeenCalledWith(['SP', 'RJ', 'MG']);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar fornecedor por código', async () => {
      mockFornecedorService.findByCodigo.mockResolvedValue(mockFornecedor);

      const result = await controller.findByCodigo('FORN001');

      expect(result).toEqual(mockFornecedor);
      expect(service.findByCodigo).toHaveBeenCalledWith('FORN001');
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Fornecedor com código INEXISTENTE não encontrado',
      );
      mockFornecedorService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo('INEXISTENTE')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCodigo).toHaveBeenCalledWith('INEXISTENTE');
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar fornecedor por CNPJ', async () => {
      mockFornecedorService.findByCnpj.mockResolvedValue(mockFornecedor);

      const result = await controller.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockFornecedor);
      expect(service.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Fornecedor com CNPJ 00.000.000/0000-00 não encontrado',
      );
      mockFornecedorService.findByCnpj.mockRejectedValue(notFoundError);

      await expect(controller.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCnpj).toHaveBeenCalledWith('00.000.000/0000-00');
    });

    it('deve buscar CNPJ com formatação diferente', async () => {
      mockFornecedorService.findByCnpj.mockResolvedValue(mockFornecedor);

      const result = await controller.findByCnpj('12345678000190');

      expect(result).toEqual(mockFornecedor);
      expect(service.findByCnpj).toHaveBeenCalledWith('12345678000190');
    });
  });

  describe('findOne', () => {
    it('deve retornar um fornecedor por ID', async () => {
      mockFornecedorService.findOne.mockResolvedValue(mockFornecedor);

      const result = await controller.findOne('fornecedor-uuid-1');

      expect(result).toEqual(mockFornecedor);
      expect(service.findOne).toHaveBeenCalledWith('fornecedor-uuid-1');
    });

    it('deve retornar erro quando fornecedor não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Fornecedor com ID invalid-id não encontrado',
      );
      mockFornecedorService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    const updateFornecedorDto: UpdateFornecedorDto = {
      prazo_entrega_padrao: 10,
      desconto_padrao: 8.0,
    };

    it('deve atualizar um fornecedor com sucesso', async () => {
      const fornecedorAtualizado = {
        ...mockFornecedor,
        ...updateFornecedorDto,
      };
      mockFornecedorService.update.mockResolvedValue(fornecedorAtualizado);

      const result = await controller.update(
        'fornecedor-uuid-1',
        updateFornecedorDto,
      );

      expect(result).toEqual(fornecedorAtualizado);
      expect(service.update).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
        updateFornecedorDto,
      );
    });

    it('deve retornar erro quando fornecedor não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Fornecedor com ID invalid-id não encontrado',
      );
      mockFornecedorService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateFornecedorDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        'invalid-id',
        updateFornecedorDto,
      );
    });

    it('deve retornar erro quando novo código já existir', async () => {
      const updateComNovoCodigo = {
        ...updateFornecedorDto,
        codigo_fornecedor: 'FORN002',
      };
      const conflictError = new ConflictException(
        'Já existe um fornecedor com este código',
      );
      mockFornecedorService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('fornecedor-uuid-1', updateComNovoCodigo),
      ).rejects.toThrow(ConflictException);
    });

    it('deve atualizar dados da empresa', async () => {
      const updateComEmpresa = {
        ...updateFornecedorDto,
        empresa: {
          tipoEmpresa: TipoEmpresaEnum.FORNECEDORES,
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Fornecedor Atualizado Ltda',
          nomeFantasia: 'Fornecedor Atualizado',
          emailComercial: 'novo@email.com',
        },
      };

      const fornecedorAtualizado = {
        ...mockFornecedor,
        ...updateComEmpresa,
        empresa: {
          ...mockEmpresa,
          nomeFantasia: 'Fornecedor Atualizado',
          emailComercial: 'novo@email.com',
        },
      };

      mockFornecedorService.update.mockResolvedValue(fornecedorAtualizado);

      const result = await controller.update(
        'fornecedor-uuid-1',
        updateComEmpresa,
      );

      expect(result).toEqual(fornecedorAtualizado);
      expect(result.empresa.nomeFantasia).toBe('Fornecedor Atualizado');
    });

    it('deve atualizar configurações de entrega', async () => {
      const updateEntrega = {
        prazo_entrega_padrao: 5,
        prazo_entrega_urgente: 1,
        aceita_pedido_urgente: true,
        entrega_sabado: true,
        entrega_domingo: false,
        horario_inicio_entrega: '07:00',
        horario_fim_entrega: '19:00',
      };

      const fornecedorAtualizado = {
        ...mockFornecedor,
        ...updateEntrega,
      };

      mockFornecedorService.update.mockResolvedValue(fornecedorAtualizado);

      const result = await controller.update(
        'fornecedor-uuid-1',
        updateEntrega,
      );

      expect(result.prazo_entrega_urgente).toBe(1);
      expect(result.aceita_pedido_urgente).toBe(true);
      expect(result.entrega_sabado).toBe(true);
      expect(result.horario_inicio_entrega).toBe('07:00');
    });

    it('deve atualizar área de atendimento', async () => {
      const updateRegiao = {
        estados_atendidos: ['SP', 'RJ', 'MG'],
        cidades_atendidas: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'],
        atende_todo_brasil: false,
      };

      const fornecedorAtualizado = {
        ...mockFornecedor,
        ...updateRegiao,
      };

      mockFornecedorService.update.mockResolvedValue(fornecedorAtualizado);

      const result = await controller.update('fornecedor-uuid-1', updateRegiao);

      expect(result.estados_atendidos).toEqual(['SP', 'RJ', 'MG']);
      expect(result.cidades_atendidas).toContain('Belo Horizonte');
      expect(result.atende_todo_brasil).toBe(false);
    });
  });

  describe('toggleStatus', () => {
    it('deve ativar fornecedor inativo', async () => {
      const fornecedorAtivado = {
        ...mockFornecedor,
        empresa: { ...mockEmpresa, ativo: true },
      };
      mockFornecedorService.toggleStatus.mockResolvedValue(fornecedorAtivado);

      const result = await controller.toggleStatus('fornecedor-uuid-1');

      expect(result).toEqual(fornecedorAtivado);
      expect(result.empresa.ativo).toBe(true);
      expect(service.toggleStatus).toHaveBeenCalledWith('fornecedor-uuid-1');
    });

    it('deve desativar fornecedor ativo', async () => {
      const fornecedorDesativado = {
        ...mockFornecedor,
        empresa: { ...mockEmpresa, ativo: false },
      };
      mockFornecedorService.toggleStatus.mockResolvedValue(
        fornecedorDesativado,
      );

      const result = await controller.toggleStatus('fornecedor-uuid-1');

      expect(result).toEqual(fornecedorDesativado);
      expect(result.empresa.ativo).toBe(false);
    });

    it('deve retornar erro quando fornecedor não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Fornecedor com ID invalid-id não encontrado',
      );
      mockFornecedorService.toggleStatus.mockRejectedValue(notFoundError);

      await expect(controller.toggleStatus('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.toggleStatus).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('aprovarFornecedor', () => {
    it('deve aprovar um fornecedor com sucesso', async () => {
      const fornecedorAprovado = {
        ...mockFornecedor,
        status_fornecedor: StatusFornecedor.ATIVO,
        aprovado_por: 'admin-uuid',
        data_aprovacao: new Date(),
      };
      mockFornecedorService.aprovarFornecedor.mockResolvedValue(
        fornecedorAprovado,
      );

      const result = await controller.aprovarFornecedor(
        'fornecedor-uuid-1',
        'admin-uuid',
      );

      expect(result).toEqual(fornecedorAprovado);
      expect(result.status_fornecedor).toBe(StatusFornecedor.ATIVO);
      expect(result.aprovado_por).toBe('admin-uuid');
      expect(service.aprovarFornecedor).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
        'admin-uuid',
      );
    });
  });

  describe('reprovarFornecedor', () => {
    it('deve reprovar um fornecedor com sucesso', async () => {
      const fornecedorReprovado = {
        ...mockFornecedor,
        status_fornecedor: StatusFornecedor.BLOQUEADO,
      };
      mockFornecedorService.reprovarFornecedor.mockResolvedValue(
        fornecedorReprovado,
      );

      const result = await controller.reprovarFornecedor('fornecedor-uuid-1');

      expect(result).toEqual(fornecedorReprovado);
      expect(result.status_fornecedor).toBe(StatusFornecedor.BLOQUEADO);
      expect(service.reprovarFornecedor).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
      );
    });
  });

  describe('atualizarAvaliacao', () => {
    it('deve atualizar avaliação do fornecedor', async () => {
      const fornecedorAvaliado = {
        ...mockFornecedor,
        avaliacao_media: 4.8,
        total_avaliacoes: 11,
      };
      mockFornecedorService.atualizarAvaliacao.mockResolvedValue(
        fornecedorAvaliado,
      );

      const result = await controller.atualizarAvaliacao(
        'fornecedor-uuid-1',
        5,
      );

      expect(result).toEqual(fornecedorAvaliado);
      expect(result.avaliacao_media).toBe(4.8);
      expect(result.total_avaliacoes).toBe(11);
      expect(service.atualizarAvaliacao).toHaveBeenCalledWith(
        'fornecedor-uuid-1',
        5,
      );
    });
  });

  describe('remove', () => {
    it('deve remover um fornecedor com sucesso', async () => {
      mockFornecedorService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('fornecedor-uuid-1');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('fornecedor-uuid-1');
    });

    it('deve retornar erro quando fornecedor não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Fornecedor com ID invalid-id não encontrado',
      );
      mockFornecedorService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalid-id');
    });
  });
});
