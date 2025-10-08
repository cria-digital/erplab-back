import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { InstrucaoService } from './instrucao.service';
import { ConvenioService } from './convenio.service';
import {
  Instrucao,
  CategoriaInstrucao,
  StatusInstrucao,
  PrioridadeInstrucao,
} from '../entities/instrucao.entity';
import { CreateInstrucaoDto } from '../dto/create-instrucao.dto';
import { UpdateInstrucaoDto } from '../dto/update-instrucao.dto';

describe('InstrucaoService', () => {
  let service: InstrucaoService;
  let instrucaoRepository: Repository<Instrucao>;
  let convenioService: ConvenioService;
  let queryBuilder: SelectQueryBuilder<Instrucao>;

  const mockInstrucaoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockConvenioService = {
    findOne: jest.fn(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockInstrucao = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    convenio_id: '550e8400-e29b-41d4-a716-446655440001',
    codigo: 'INST001',
    titulo: 'Instrução de Autorização',
    descricao: 'Instrução para autorização de exames',
    categoria: CategoriaInstrucao.AUTORIZACAO_PREVIA,
    prioridade: PrioridadeInstrucao.ALTA,
    status: StatusInstrucao.ATIVA,
    vigencia_inicio: new Date('2024-01-01'),
    vigencia_fim: new Date('2024-12-31'),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'admin',
    updated_by: 'admin',
  };

  const mockConvenio = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    nome: 'Convênio Teste',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrucaoService,
        {
          provide: getRepositoryToken(Instrucao),
          useValue: mockInstrucaoRepository,
        },
        {
          provide: ConvenioService,
          useValue: mockConvenioService,
        },
      ],
    }).compile();

    service = module.get<InstrucaoService>(InstrucaoService);
    instrucaoRepository = module.get<Repository<Instrucao>>(
      getRepositoryToken(Instrucao),
    );
    convenioService = module.get<ConvenioService>(ConvenioService);
    queryBuilder = mockQueryBuilder as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deveria criar uma nova instrução', async () => {
      const dto: CreateInstrucaoDto = {
        convenio_id: '550e8400-e29b-41d4-a716-446655440001',
        codigo: 'INST001',
        titulo: 'Instrução de Autorização',
        categoria: CategoriaInstrucao.AUTORIZACAO_PREVIA,
        descricao: 'Descrição da instrução',
        vigencia_inicio: new Date('2024-01-01'),
        prioridade: PrioridadeInstrucao.ALTA,
        vigencia_fim: new Date('2024-12-31'),
      };

      mockConvenioService.findOne.mockResolvedValue(mockConvenio);
      mockInstrucaoRepository.create.mockReturnValue(mockInstrucao);
      mockInstrucaoRepository.save.mockResolvedValue(mockInstrucao);

      const result = await service.create(dto);

      expect(result).toEqual(mockInstrucao);
      expect(convenioService.findOne).toHaveBeenCalledWith(dto.convenio_id);
      expect(instrucaoRepository.create).toHaveBeenCalledWith(dto);
      expect(instrucaoRepository.save).toHaveBeenCalledWith(mockInstrucao);
    });

    it('deveria tratar erro quando convênio não existir', async () => {
      const dto: CreateInstrucaoDto = {
        convenio_id: '550e8400-e29b-41d4-a716-446655440999',
        codigo: 'INST001',
        titulo: 'Instrução de Autorização',
        categoria: CategoriaInstrucao.AUTORIZACAO_PREVIA,
        descricao: 'Descrição da instrução',
        vigencia_inicio: new Date('2024-01-01'),
        prioridade: PrioridadeInstrucao.ALTA,
      };

      const erro = new NotFoundException('Convênio não encontrado');
      mockConvenioService.findOne.mockRejectedValue(erro);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(convenioService.findOne).toHaveBeenCalledWith(dto.convenio_id);
    });
  });

  describe('findAll', () => {
    it('deveria retornar todas as instruções', async () => {
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoRepository.find.mockResolvedValue(mockInstrucoes);

      const result = await service.findAll();

      expect(result).toEqual(mockInstrucoes);
      expect(instrucaoRepository.find).toHaveBeenCalledWith({
        relations: ['convenio'],
        order: { prioridade: 'ASC', created_at: 'DESC' },
      });
    });

    it('deveria retornar array vazio quando não houver instruções', async () => {
      mockInstrucaoRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByConvenio', () => {
    it('deveria retornar instruções de um convênio', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoRepository.find.mockResolvedValue(mockInstrucoes);

      const result = await service.findByConvenio(convenioId);

      expect(result).toEqual(mockInstrucoes);
      expect(instrucaoRepository.find).toHaveBeenCalledWith({
        where: { convenio_id: convenioId },
        order: { prioridade: 'ASC', categoria: 'ASC', created_at: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('deveria retornar uma instrução específica', async () => {
      mockInstrucaoRepository.findOne.mockResolvedValue(mockInstrucao);

      const result = await service.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockInstrucao);
      expect(instrucaoRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        relations: ['convenio'],
      });
    });

    it('deveria lançar NotFoundException quando instrução não existir', async () => {
      mockInstrucaoRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(
        'Instrução com ID 550e8400-e29b-41d4-a716-446655440999 não encontrada',
      );
    });
  });

  describe('findByCategoria', () => {
    it('deveria retornar instruções por categoria', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const categoria = CategoriaInstrucao.AUTORIZACAO_PREVIA;
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoRepository.find.mockResolvedValue(mockInstrucoes);

      const result = await service.findByCategoria(convenioId, categoria);

      expect(result).toEqual(mockInstrucoes);
      expect(instrucaoRepository.find).toHaveBeenCalledWith({
        where: {
          convenio_id: convenioId,
          categoria,
          status: StatusInstrucao.ATIVA,
        },
        order: { prioridade: 'ASC', created_at: 'DESC' },
      });
    });
  });

  describe('findVigentes', () => {
    it('deveria retornar instruções vigentes com data específica', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const data = new Date('2024-06-01');
      const mockInstrucoes = [mockInstrucao];

      mockInstrucaoRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockInstrucoes);

      const result = await service.findVigentes(convenioId, data);

      expect(result).toEqual(mockInstrucoes);
      expect(instrucaoRepository.createQueryBuilder).toHaveBeenCalledWith(
        'instrucao',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'instrucao.convenio_id = :convenioId',
        {
          convenioId,
        },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'instrucao.status = :status',
        {
          status: StatusInstrucao.ATIVA,
        },
      );
    });

    it('deveria usar data atual quando não fornecida', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const mockInstrucoes = [mockInstrucao];

      mockInstrucaoRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockInstrucoes);

      const result = await service.findVigentes(convenioId);

      expect(result).toEqual(mockInstrucoes);
      expect(instrucaoRepository.createQueryBuilder).toHaveBeenCalledWith(
        'instrucao',
      );
    });
  });

  describe('findProximasVencer', () => {
    it('deveria retornar instruções próximas do vencimento', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const dias = 30;
      const mockInstrucoes = [mockInstrucao];

      mockInstrucaoRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockInstrucoes);

      const result = await service.findProximasVencer(convenioId, dias);

      expect(result).toEqual(mockInstrucoes);
      expect(instrucaoRepository.createQueryBuilder).toHaveBeenCalledWith(
        'instrucao',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'instrucao.convenio_id = :convenioId',
        {
          convenioId,
        },
      );
    });

    it('deveria usar 30 dias como padrão', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const mockInstrucoes = [mockInstrucao];

      mockInstrucaoRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockInstrucoes);

      const result = await service.findProximasVencer(convenioId);

      expect(result).toEqual(mockInstrucoes);
    });
  });

  describe('update', () => {
    it('deveria atualizar uma instrução', async () => {
      const dto: UpdateInstrucaoDto = {
        titulo: 'Instrução Atualizada',
        descricao: 'Descrição atualizada',
      };

      const instrucaoAtualizada = { ...mockInstrucao, ...dto };
      mockInstrucaoRepository.findOne.mockResolvedValue(mockInstrucao);
      mockInstrucaoRepository.save.mockResolvedValue(instrucaoAtualizada);

      const result = await service.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(instrucaoAtualizada);
      expect(instrucaoRepository.save).toHaveBeenCalled();
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      const dto: UpdateInstrucaoDto = { titulo: 'Novo Título' };
      mockInstrucaoRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('550e8400-e29b-41d4-a716-446655440999', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deveria remover uma instrução', async () => {
      mockInstrucaoRepository.findOne.mockResolvedValue(mockInstrucao);
      mockInstrucaoRepository.remove.mockResolvedValue(mockInstrucao);

      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).resolves.not.toThrow();

      expect(instrucaoRepository.remove).toHaveBeenCalledWith(mockInstrucao);
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      mockInstrucaoRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('deveria alternar status de ATIVA para INATIVA', async () => {
      const instrucaoAtiva = {
        ...mockInstrucao,
        status: StatusInstrucao.ATIVA,
      };
      const instrucaoInativa = {
        ...mockInstrucao,
        status: StatusInstrucao.INATIVA,
      };

      mockInstrucaoRepository.findOne.mockResolvedValue(instrucaoAtiva);
      mockInstrucaoRepository.save.mockResolvedValue(instrucaoInativa);

      const result = await service.toggleStatus(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result.status).toBe(StatusInstrucao.INATIVA);
      expect(instrucaoRepository.save).toHaveBeenCalled();
    });

    it('deveria alternar status de INATIVA para ATIVA', async () => {
      const instrucaoInativa = {
        ...mockInstrucao,
        status: StatusInstrucao.INATIVA,
      };
      const instrucaoAtiva = {
        ...mockInstrucao,
        status: StatusInstrucao.ATIVA,
      };

      mockInstrucaoRepository.findOne.mockResolvedValue(instrucaoInativa);
      mockInstrucaoRepository.save.mockResolvedValue(instrucaoAtiva);

      const result = await service.toggleStatus(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result.status).toBe(StatusInstrucao.ATIVA);
    });

    it('deveria alternar status de SUSPENSA para ATIVA', async () => {
      const instrucaoSuspensa = {
        ...mockInstrucao,
        status: StatusInstrucao.SUSPENSA,
      };
      const instrucaoAtiva = {
        ...mockInstrucao,
        status: StatusInstrucao.ATIVA,
      };

      mockInstrucaoRepository.findOne.mockResolvedValue(instrucaoSuspensa);
      mockInstrucaoRepository.save.mockResolvedValue(instrucaoAtiva);

      const result = await service.toggleStatus(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result.status).toBe(StatusInstrucao.ATIVA);
    });
  });

  describe('search', () => {
    it('deveria buscar instruções por termo', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const query = 'autorização';
      const mockInstrucoes = [mockInstrucao];

      mockInstrucaoRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      mockQueryBuilder.getMany.mockResolvedValue(mockInstrucoes);

      const result = await service.search(convenioId, query);

      expect(result).toEqual(mockInstrucoes);
      expect(instrucaoRepository.createQueryBuilder).toHaveBeenCalledWith(
        'instrucao',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'instrucao.convenio_id = :convenioId',
        {
          convenioId,
        },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(instrucao.titulo ILIKE :query OR instrucao.descricao ILIKE :query OR instrucao.codigo LIKE :query)',
        { query: '%autorização%' },
      );
    });
  });

  describe('getHistorico', () => {
    it('deveria retornar histórico da instrução', async () => {
      mockInstrucaoRepository.findOne.mockResolvedValue(mockInstrucao);

      const result = await service.getHistorico(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toHaveProperty('instrucao');
      expect(result).toHaveProperty('historico');
      expect(result.instrucao).toEqual(mockInstrucao);
      expect(result.historico).toHaveLength(2);
      expect(result.historico[0].acao).toBe('Criação');
      expect(result.historico[1].acao).toBe('Última atualização');
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      mockInstrucaoRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getHistorico('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
