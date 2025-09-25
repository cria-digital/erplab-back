import { Test, TestingModule } from '@nestjs/testing';
import { CnaeController } from './cnae.controller';
import { CnaeService } from '../services/cnae.service';
import { CreateCnaeDto } from '../dto/create-cnae.dto';
import { UpdateCnaeDto } from '../dto/update-cnae.dto';
import { SearchCnaeDto } from '../dto/search-cnae.dto';
import { NotFoundException } from '@nestjs/common';

describe('CnaeController', () => {
  let controller: CnaeController;
  let service: CnaeService;

  const mockCnaeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    search: jest.fn(),
    findByCodigo: jest.fn(),
    findBySecao: jest.fn(),
    findByDivisao: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    importBulk: jest.fn(),
  };

  const mockCnae = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    codigo: '86101',
    descricao: 'ATIVIDADES DE ATENDIMENTO HOSPITALAR',
    secao: 'Q',
    secaoDescricao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
    divisao: '86',
    divisaoDescricao: 'ATIVIDADES DE ATENÇÃO À SAÚDE HUMANA',
    grupo: '861',
    grupoDescricao: 'Atividades de atendimento hospitalar',
    classe: '8610-1',
    classeDescricao: 'Atividades de atendimento hospitalar',
    subclasse: '8610-1/01',
    subclasseDescricao:
      'Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências',
    observacoes: null,
    ativo: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CnaeController],
      providers: [
        {
          provide: CnaeService,
          useValue: mockCnaeService,
        },
      ],
    }).compile();

    controller = module.get<CnaeController>(CnaeController);
    service = module.get<CnaeService>(CnaeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deveria criar um novo CNAE', async () => {
      const dto: CreateCnaeDto = {
        codigo: '86101',
        descricao: 'ATIVIDADES DE ATENDIMENTO HOSPITALAR',
        secao: 'Q',
        descricaoSecao: 'SAÚDE HUMANA E SERVIÇOS SOCIAIS',
        divisao: '86',
        descricaoDivisao: 'ATIVIDADES DE ATENÇÃO À SAÚDE HUMANA',
        grupo: '861',
        descricaoGrupo: 'Atividades de atendimento hospitalar',
        classe: '8610',
        descricaoClasse: 'Atividades de atendimento hospitalar',
        subclasse: '8610-1/01',
        descricaoSubclasse: 'Atividades de atendimento hospitalar',
      };

      mockCnaeService.create.mockResolvedValue(mockCnae);

      const result = await controller.create(dto);

      expect(result).toEqual(mockCnae);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deveria retornar lista paginada de CNAEs', async () => {
      const searchDto: SearchCnaeDto = {
        page: 1,
        limit: 10,
      };

      const paginatedResult = {
        data: [mockCnae],
        meta: {
          page: 1,
          limit: 10,
          total: 1358,
          totalPages: 136,
          hasPrevPage: false,
          hasNextPage: true,
        },
      };

      mockCnaeService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(searchDto);

      expect(result).toEqual(paginatedResult);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1358);
      expect(service.findAll).toHaveBeenCalledWith(searchDto);
    });

    it('deveria filtrar CNAEs por parâmetros', async () => {
      const searchDto: SearchCnaeDto = {
        page: 1,
        limit: 10,
        codigo: '86',
        descricao: 'HOSPITAL',
        secao: 'Q',
        divisao: '86',
        ativo: true,
      };

      const paginatedResult = {
        data: [mockCnae],
        meta: {
          page: 1,
          limit: 10,
          total: 5,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        },
      };

      mockCnaeService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(searchDto);

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(searchDto);
    });
  });

  describe('search', () => {
    it('deveria buscar CNAEs por termo', async () => {
      const termo = 'laboratório';
      const mockCnaes = [
        { ...mockCnae, descricao: 'LABORATÓRIO DE ANÁLISES CLÍNICAS' },
      ];

      mockCnaeService.search.mockResolvedValue(mockCnaes);

      const result = await controller.search(termo);

      expect(result).toEqual(mockCnaes);
      expect(service.search).toHaveBeenCalledWith(termo);
    });

    it('deveria retornar array vazio quando não houver resultados', async () => {
      mockCnaeService.search.mockResolvedValue([]);

      const result = await controller.search('xyz');

      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith('xyz');
    });
  });

  describe('findByCodigo', () => {
    it('deveria buscar CNAE por código', async () => {
      mockCnaeService.findByCodigo.mockResolvedValue(mockCnae);

      const result = await controller.findByCodigo('86101');

      expect(result).toEqual(mockCnae);
      expect(service.findByCodigo).toHaveBeenCalledWith('86101');
    });

    it('deveria buscar CNAE por código formatado', async () => {
      mockCnaeService.findByCodigo.mockResolvedValue(mockCnae);

      const result = await controller.findByCodigo('8610-1/01');

      expect(result).toEqual(mockCnae);
      expect(service.findByCodigo).toHaveBeenCalledWith('8610-1/01');
    });

    it('deveria tratar erro quando CNAE não existir', async () => {
      const erro = new NotFoundException('CNAE não encontrado');
      mockCnaeService.findByCodigo.mockRejectedValue(erro);

      await expect(controller.findByCodigo('99999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findByCodigo('99999')).rejects.toThrow(
        'CNAE não encontrado',
      );
    });
  });

  describe('findBySecao', () => {
    it('deveria buscar CNAEs por seção', async () => {
      const mockCnaes = [mockCnae];
      mockCnaeService.findBySecao.mockResolvedValue(mockCnaes);

      const result = await controller.findBySecao('Q');

      expect(result).toEqual(mockCnaes);
      expect(service.findBySecao).toHaveBeenCalledWith('Q');
    });

    it('deveria retornar array vazio quando seção não existir', async () => {
      mockCnaeService.findBySecao.mockResolvedValue([]);

      const result = await controller.findBySecao('Z');

      expect(result).toEqual([]);
      expect(service.findBySecao).toHaveBeenCalledWith('Z');
    });
  });

  describe('findByDivisao', () => {
    it('deveria buscar CNAEs por divisão', async () => {
      const mockCnaes = [mockCnae];
      mockCnaeService.findByDivisao.mockResolvedValue(mockCnaes);

      const result = await controller.findByDivisao('86');

      expect(result).toEqual(mockCnaes);
      expect(service.findByDivisao).toHaveBeenCalledWith('86');
    });

    it('deveria retornar array vazio quando divisão não existir', async () => {
      mockCnaeService.findByDivisao.mockResolvedValue([]);

      const result = await controller.findByDivisao('00');

      expect(result).toEqual([]);
      expect(service.findByDivisao).toHaveBeenCalledWith('00');
    });
  });

  describe('findOne', () => {
    it('deveria buscar CNAE por ID', async () => {
      mockCnaeService.findOne.mockResolvedValue(mockCnae);

      const result = await controller.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockCnae);
      expect(service.findOne).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro quando CNAE não existir', async () => {
      const erro = new NotFoundException('CNAE não encontrado');
      mockCnaeService.findOne.mockRejectedValue(erro);

      await expect(
        controller.findOne('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deveria atualizar um CNAE', async () => {
      const dto: UpdateCnaeDto = {
        descricao: 'NOVA DESCRIÇÃO',
        observacoes: 'Atualizado em 2025',
      };

      const updatedCnae = { ...mockCnae, ...dto };
      mockCnaeService.update.mockResolvedValue(updatedCnae);

      const result = await controller.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(updatedCnae);
      expect(result.descricao).toBe('NOVA DESCRIÇÃO');
      expect(service.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });
  });

  describe('remove', () => {
    it('deveria desativar um CNAE', async () => {
      mockCnaeService.remove.mockResolvedValue(undefined);

      await expect(
        controller.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).resolves.not.toThrow();

      expect(service.remove).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });
  });

  describe('importBulk', () => {
    it('deveria importar CNAEs em lote', async () => {
      const cnaes: CreateCnaeDto[] = [
        {
          codigo: '86101',
          descricao: 'CNAE 1',
          secao: 'Q',
          descricaoSecao: 'SAÚDE',
          divisao: '86',
          descricaoDivisao: 'ATENÇÃO À SAÚDE',
          grupo: '861',
          descricaoGrupo: 'Atendimento hospitalar',
          classe: '8610',
          descricaoClasse: 'Atendimento hospitalar',
          subclasse: '8610-1/01',
          descricaoSubclasse: 'Atendimento hospitalar',
        },
        {
          codigo: '86102',
          descricao: 'CNAE 2',
          secao: 'Q',
          descricaoSecao: 'SAÚDE',
          divisao: '86',
          descricaoDivisao: 'ATENÇÃO À SAÚDE',
          grupo: '861',
          descricaoGrupo: 'Atendimento hospitalar',
          classe: '8610',
          descricaoClasse: 'Atendimento hospitalar',
          subclasse: '8610-1/02',
          descricaoSubclasse: 'Pronto-socorro',
        },
      ];

      mockCnaeService.importBulk.mockResolvedValue(undefined);

      const result = await controller.importBulk(cnaes);

      expect(result).toEqual({ message: '2 CNAEs importados com sucesso' });
      expect(service.importBulk).toHaveBeenCalledWith(cnaes);
    });

    it('deveria tratar erro na importação em lote', async () => {
      const cnaes: CreateCnaeDto[] = [
        {
          codigo: '86101',
          descricao: 'CNAE 1',
          secao: 'Q',
          descricaoSecao: 'SAÚDE',
          divisao: '86',
          descricaoDivisao: 'ATENÇÃO À SAÚDE',
          grupo: '861',
          descricaoGrupo: 'Atendimento hospitalar',
          classe: '8610',
          descricaoClasse: 'Atendimento hospitalar',
          subclasse: '8610-1/01',
          descricaoSubclasse: 'Atendimento hospitalar',
        },
      ];

      const erro = new Error('Erro na importação');
      mockCnaeService.importBulk.mockRejectedValue(erro);

      await expect(controller.importBulk(cnaes)).rejects.toThrow(
        'Erro na importação',
      );
    });
  });
});
