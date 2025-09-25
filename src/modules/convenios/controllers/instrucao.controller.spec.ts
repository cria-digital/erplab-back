import { Test, TestingModule } from '@nestjs/testing';
import { InstrucaoController } from './instrucao.controller';
import { InstrucaoService } from '../services/instrucao.service';
import { CreateInstrucaoDto } from '../dto/create-instrucao.dto';
import { UpdateInstrucaoDto } from '../dto/update-instrucao.dto';
import {
  CategoriaInstrucao,
  StatusInstrucao,
  PrioridadeInstrucao,
} from '../entities/instrucao.entity';
import { NotFoundException } from '@nestjs/common';

describe('InstrucaoController', () => {
  let controller: InstrucaoController;
  let service: InstrucaoService;

  const mockInstrucaoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByConvenio: jest.fn(),
    findVigentes: jest.fn(),
    findByCategoria: jest.fn(),
    findProximasVencer: jest.fn(),
    search: jest.fn(),
    findOne: jest.fn(),
    getHistorico: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    remove: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstrucaoController],
      providers: [
        {
          provide: InstrucaoService,
          useValue: mockInstrucaoService,
        },
      ],
    }).compile();

    controller = module.get<InstrucaoController>(InstrucaoController);
    service = module.get<InstrucaoService>(InstrucaoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(controller).toBeDefined();
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

      mockInstrucaoService.create.mockResolvedValue(mockInstrucao);

      const result = await controller.create(dto);

      expect(result).toEqual(mockInstrucao);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
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
      mockInstrucaoService.create.mockRejectedValue(erro);

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
      await expect(controller.create(dto)).rejects.toThrow(
        'Convênio não encontrado',
      );
    });
  });

  describe('findAll', () => {
    it('deveria retornar todas as instruções', async () => {
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.findAll.mockResolvedValue(mockInstrucoes);

      const result = await controller.findAll();

      expect(result).toEqual(mockInstrucoes);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar array vazio quando não houver instruções', async () => {
      mockInstrucaoService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findByConvenio', () => {
    it('deveria retornar instruções de um convênio', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.findByConvenio.mockResolvedValue(mockInstrucoes);

      const result = await controller.findByConvenio(convenioId);

      expect(result).toEqual(mockInstrucoes);
      expect(service.findByConvenio).toHaveBeenCalledWith(convenioId);
    });

    it('deveria retornar array vazio quando convênio não tiver instruções', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440002';
      mockInstrucaoService.findByConvenio.mockResolvedValue([]);

      const result = await controller.findByConvenio(convenioId);

      expect(result).toEqual([]);
      expect(service.findByConvenio).toHaveBeenCalledWith(convenioId);
    });
  });

  describe('findVigentes', () => {
    it('deveria retornar instruções vigentes com data específica', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const data = '2024-06-01';
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.findVigentes.mockResolvedValue(mockInstrucoes);

      const result = await controller.findVigentes(convenioId, data);

      expect(result).toEqual(mockInstrucoes);
      expect(service.findVigentes).toHaveBeenCalledWith(
        convenioId,
        new Date(data),
      );
    });

    it('deveria retornar instruções vigentes sem data (usa data atual)', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.findVigentes.mockResolvedValue(mockInstrucoes);

      const result = await controller.findVigentes(convenioId);

      expect(result).toEqual(mockInstrucoes);
      expect(service.findVigentes).toHaveBeenCalledWith(convenioId, undefined);
    });
  });

  describe('findByCategoria', () => {
    it('deveria retornar instruções por categoria', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const categoria = CategoriaInstrucao.AUTORIZACAO_PREVIA;
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.findByCategoria.mockResolvedValue(mockInstrucoes);

      const result = await controller.findByCategoria(convenioId, categoria);

      expect(result).toEqual(mockInstrucoes);
      expect(service.findByCategoria).toHaveBeenCalledWith(
        convenioId,
        categoria,
      );
    });

    it('deveria retornar array vazio quando não houver instruções na categoria', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const categoria = CategoriaInstrucao.FATURAMENTO;
      mockInstrucaoService.findByCategoria.mockResolvedValue([]);

      const result = await controller.findByCategoria(convenioId, categoria);

      expect(result).toEqual([]);
      expect(service.findByCategoria).toHaveBeenCalledWith(
        convenioId,
        categoria,
      );
    });
  });

  describe('findProximasVencer', () => {
    it('deveria retornar instruções próximas do vencimento com dias específicos', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const dias = 15;
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.findProximasVencer.mockResolvedValue(mockInstrucoes);

      const result = await controller.findProximasVencer(convenioId, dias);

      expect(result).toEqual(mockInstrucoes);
      expect(service.findProximasVencer).toHaveBeenCalledWith(convenioId, dias);
    });

    it('deveria usar 30 dias como padrão', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.findProximasVencer.mockResolvedValue(mockInstrucoes);

      const result = await controller.findProximasVencer(convenioId);

      expect(result).toEqual(mockInstrucoes);
      expect(service.findProximasVencer).toHaveBeenCalledWith(convenioId, 30);
    });
  });

  describe('search', () => {
    it('deveria buscar instruções por termo', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const query = 'autorização';
      const mockInstrucoes = [mockInstrucao];
      mockInstrucaoService.search.mockResolvedValue(mockInstrucoes);

      const result = await controller.search(convenioId, query);

      expect(result).toEqual(mockInstrucoes);
      expect(service.search).toHaveBeenCalledWith(convenioId, query);
    });

    it('deveria retornar array vazio quando não encontrar resultados', async () => {
      const convenioId = '550e8400-e29b-41d4-a716-446655440001';
      const query = 'inexistente';
      mockInstrucaoService.search.mockResolvedValue([]);

      const result = await controller.search(convenioId, query);

      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith(convenioId, query);
    });
  });

  describe('findOne', () => {
    it('deveria retornar uma instrução específica', async () => {
      mockInstrucaoService.findOne.mockResolvedValue(mockInstrucao);

      const result = await controller.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockInstrucao);
      expect(service.findOne).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      const erro = new NotFoundException('Instrução não encontrada');
      mockInstrucaoService.findOne.mockRejectedValue(erro);

      await expect(
        controller.findOne('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        controller.findOne('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow('Instrução não encontrada');
    });
  });

  describe('getHistorico', () => {
    it('deveria retornar histórico da instrução', async () => {
      const mockHistorico = {
        instrucao: mockInstrucao,
        historico: [
          {
            data: mockInstrucao.created_at,
            usuario: 'admin',
            acao: 'Criação',
            detalhes: 'Instrução criada',
          },
        ],
      };

      mockInstrucaoService.getHistorico.mockResolvedValue(mockHistorico);

      const result = await controller.getHistorico(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockHistorico);
      expect(service.getHistorico).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      const erro = new NotFoundException('Instrução não encontrada');
      mockInstrucaoService.getHistorico.mockRejectedValue(erro);

      await expect(
        controller.getHistorico('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deveria atualizar uma instrução', async () => {
      const dto: UpdateInstrucaoDto = {
        titulo: 'Instrução Atualizada',
        descricao: 'Descrição atualizada',
      };

      const instrucaoAtualizada = { ...mockInstrucao, ...dto };
      mockInstrucaoService.update.mockResolvedValue(instrucaoAtualizada);

      const result = await controller.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(instrucaoAtualizada);
      expect(result.titulo).toBe('Instrução Atualizada');
      expect(service.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      const dto: UpdateInstrucaoDto = { titulo: 'Novo Título' };
      const erro = new NotFoundException('Instrução não encontrada');
      mockInstrucaoService.update.mockRejectedValue(erro);

      await expect(
        controller.update('550e8400-e29b-41d4-a716-446655440999', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('deveria alternar status da instrução', async () => {
      const instrucaoInativa = {
        ...mockInstrucao,
        status: StatusInstrucao.INATIVA,
      };
      mockInstrucaoService.toggleStatus.mockResolvedValue(instrucaoInativa);

      const result = await controller.toggleStatus(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(instrucaoInativa);
      expect(result.status).toBe(StatusInstrucao.INATIVA);
      expect(service.toggleStatus).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      const erro = new NotFoundException('Instrução não encontrada');
      mockInstrucaoService.toggleStatus.mockRejectedValue(erro);

      await expect(
        controller.toggleStatus('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deveria remover uma instrução', async () => {
      mockInstrucaoService.remove.mockResolvedValue(undefined);

      await expect(
        controller.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).resolves.not.toThrow();

      expect(service.remove).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro quando instrução não existir', async () => {
      const erro = new NotFoundException('Instrução não encontrada');
      mockInstrucaoService.remove.mockRejectedValue(erro);

      await expect(
        controller.remove('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
