import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { ExamesController } from './exames.controller';
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';
import { Exame } from './entities/exame.entity';

describe('ExamesController', () => {
  let controller: ExamesController;
  let service: ExamesService;

  const mockExamesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCategoria: jest.fn(),
    findByTipo: jest.fn(),
    findByLaboratorioApoio: jest.fn(),
    searchByName: jest.fn(),
    findByCodigos: jest.fn(),
    bulkUpdateStatus: jest.fn(),
    getExamesComPreparo: jest.fn(),
    getExamesUrgentes: jest.fn(),
  };

  const mockExame = {
    id: 'exame-uuid-1',
    codigo_interno: 'EXM001',
    nome: 'Hemograma Completo',
    sinonimos: 'CBC',
    codigo_tuss: '40311010',
    codigo_amb: '2.02.02.03-8',
    codigo_loinc: '58410-2',
    codigo_sus: '0202020380',
    tipo_exame_id: 'tipo-uuid-1',
    categoria: 'laboratorio',
    subgrupo_id: 'subgrupo-uuid-1',
    setor_id: 'setor-uuid-1',
    laboratorio_apoio_id: null,
    metodologia: 'Automação',
    amostra_biologica: 'Sangue total EDTA',
    volume_min: 3,
    volume_ideal: 5,
    necessita_preparo: 'não',
    requisitos: null,
    unidade_medida: 'variado',
    prazo_entrega_dias: 1,
    formato_prazo: '1 dia útil',
    peso: 1,
    status: 'ativo',
    empresa_id: 'empresa-uuid-1',
    criado_em: new Date(),
    atualizado_em: new Date(),
    especialidade_requerida: 'nao',
    especialidade: null,
    grupo: null,
    altura_min: null,
    altura_max: null,
    tipo_recipiente: 'Tubo roxo EDTA',
    tipo_realizacao: 'interno',
    destino_exame: null,
    envio_automatico: 'nao',
    tem_valores_referencia: 'sim',
    valores_referencia: {},
    tecnica_coleta: null,
    distribuicao: null,
    processamento_entrega: null,
    requisitos_anvisa: null,
    formularios_atendimento: null,
    preparo_coleta: null,
    lembretes: null,
    criado_por: null,
    atualizado_por: null,
    getCodigoFormatado: () => 'EXM001 - Hemograma Completo',
    getDescricaoCompleta: () => 'Hemograma Completo (CBC) - Automação',
    getPrazoFormatado: () => '1 dia útil',
    isExterno: () => false,
    requiresPreparo: () => false,
  } as Exame;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamesController],
      providers: [
        {
          provide: ExamesService,
          useValue: mockExamesService,
        },
      ],
    }).compile();

    controller = module.get<ExamesController>(ExamesController);
    service = module.get<ExamesService>(ExamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createExameDto: CreateExameDto = {
      codigo_interno: 'EXM001',
      nome: 'Hemograma Completo',
      tipo_exame_id: 'tipo-uuid-1',
      categoria: 'laboratorio',
      amostra_biologica: 'Sangue total EDTA',
      metodologia: 'Automação',
      prazo_entrega_dias: 1,
      empresa_id: 'empresa-uuid-1',
    };

    it('deve criar um exame com sucesso', async () => {
      mockExamesService.create.mockResolvedValue(mockExame);

      const result = await controller.create(createExameDto);

      expect(result).toEqual({
        message: 'Exame criado com sucesso',
        data: mockExame,
      });
      expect(service.create).toHaveBeenCalledWith(createExameDto);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já cadastrado');
      mockExamesService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createExameDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de exames', async () => {
      const paginatedResult = {
        data: [mockExame],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      mockExamesService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll('1', '10');

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        undefined,
      );
    });

    it('deve passar filtros para o service', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 2,
        lastPage: 0,
      };

      mockExamesService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll('2', '5', 'Hemograma', 'laboratorio', 'ativo');

      expect(service.findAll).toHaveBeenCalledWith(
        2,
        5,
        'Hemograma',
        'laboratorio',
        'ativo',
      );
    });

    it('deve usar valores padrão quando não fornecidos', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
      };

      mockExamesService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('findByCategoria', () => {
    it('deve retornar exames por categoria', async () => {
      const exames = [mockExame];
      mockExamesService.findByCategoria.mockResolvedValue(exames);

      const result = await controller.findByCategoria('laboratorio');

      expect(result).toEqual({
        message: 'Exames encontrados com sucesso',
        data: exames,
      });
      expect(service.findByCategoria).toHaveBeenCalledWith('laboratorio');
    });
  });

  describe('findByTipo', () => {
    it('deve retornar exames por tipo', async () => {
      const exames = [mockExame];
      mockExamesService.findByTipo.mockResolvedValue(exames);

      const result = await controller.findByTipo('tipo-uuid-1');

      expect(result).toEqual({
        message: 'Exames encontrados com sucesso',
        data: exames,
      });
      expect(service.findByTipo).toHaveBeenCalledWith('tipo-uuid-1');
    });
  });

  describe('findByLaboratorioApoio', () => {
    it('deve retornar exames por laboratório de apoio', async () => {
      const exames = [mockExame];
      mockExamesService.findByLaboratorioApoio.mockResolvedValue(exames);

      const result = await controller.findByLaboratorioApoio('lab-uuid-1');

      expect(result).toEqual({
        message: 'Exames encontrados com sucesso',
        data: exames,
      });
      expect(service.findByLaboratorioApoio).toHaveBeenCalledWith('lab-uuid-1');
    });
  });

  describe('searchByName', () => {
    it('deve buscar exames por nome', async () => {
      const exames = [mockExame];
      mockExamesService.searchByName.mockResolvedValue(exames);

      const result = await controller.searchByName('Hemograma');

      expect(result).toEqual({
        message: 'Exames encontrados com sucesso',
        data: exames,
      });
      expect(service.searchByName).toHaveBeenCalledWith('Hemograma');
    });
  });

  describe('getExamesComPreparo', () => {
    it('deve retornar exames que necessitam preparo', async () => {
      const exames = [mockExame];
      mockExamesService.getExamesComPreparo.mockResolvedValue(exames);

      const result = await controller.getExamesComPreparo();

      expect(result).toEqual({
        message: 'Exames com preparo encontrados',
        data: exames,
      });
      expect(service.getExamesComPreparo).toHaveBeenCalled();
    });
  });

  describe('getExamesUrgentes', () => {
    it('deve retornar exames urgentes', async () => {
      const exames = [mockExame];
      mockExamesService.getExamesUrgentes.mockResolvedValue(exames);

      const result = await controller.getExamesUrgentes();

      expect(result).toEqual({
        message: 'Exames urgentes encontrados',
        data: exames,
      });
      expect(service.getExamesUrgentes).toHaveBeenCalled();
    });
  });

  describe('findByCodigos', () => {
    it('deve buscar exames por códigos padronizados', async () => {
      const exames = [mockExame];
      mockExamesService.findByCodigos.mockResolvedValue(exames);

      const result = await controller.findByCodigos(
        '40311010',
        '2.02.02.03-8',
        '0202020380',
      );

      expect(result).toEqual({
        message: 'Exames encontrados com sucesso',
        data: exames,
      });
      expect(service.findByCodigos).toHaveBeenCalledWith(
        '40311010',
        '2.02.02.03-8',
        '0202020380',
      );
    });

    it('deve funcionar com parâmetros opcionais', async () => {
      const exames = [mockExame];
      mockExamesService.findByCodigos.mockResolvedValue(exames);

      const result = await controller.findByCodigos('40311010');

      expect(result).toEqual({
        message: 'Exames encontrados com sucesso',
        data: exames,
      });
      expect(service.findByCodigos).toHaveBeenCalledWith(
        '40311010',
        undefined,
        undefined,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um exame por código interno', async () => {
      mockExamesService.findByCodigo.mockResolvedValue(mockExame);

      const result = await controller.findByCodigo('EXM001');

      expect(result).toEqual({
        message: 'Exame encontrado com sucesso',
        data: mockExame,
      });
      expect(service.findByCodigo).toHaveBeenCalledWith('EXM001');
    });

    it('deve retornar erro quando exame não for encontrado', async () => {
      const notFoundError = new NotFoundException('Exame não encontrado');
      mockExamesService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um exame por ID', async () => {
      mockExamesService.findOne.mockResolvedValue(mockExame);

      const result = await controller.findOne('exame-uuid-1');

      expect(result).toEqual({
        message: 'Exame encontrado com sucesso',
        data: mockExame,
      });
      expect(service.findOne).toHaveBeenCalledWith('exame-uuid-1');
    });

    it('deve retornar erro quando exame não for encontrado', async () => {
      const notFoundError = new NotFoundException('Exame não encontrado');
      mockExamesService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateExameDto: UpdateExameDto = {
      nome: 'Hemograma Completo Atualizado',
      prazo_entrega_dias: 2,
    };

    it('deve atualizar um exame com sucesso', async () => {
      const exameAtualizado = { ...mockExame, ...updateExameDto };
      mockExamesService.update.mockResolvedValue(exameAtualizado);

      const result = await controller.update('exame-uuid-1', updateExameDto);

      expect(result).toEqual({
        message: 'Exame atualizado com sucesso',
        data: exameAtualizado,
      });
      expect(service.update).toHaveBeenCalledWith(
        'exame-uuid-1',
        updateExameDto,
      );
    });

    it('deve retornar erro quando exame não for encontrado', async () => {
      const notFoundError = new NotFoundException('Exame não encontrado');
      mockExamesService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateExameDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já existe');
      mockExamesService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('exame-uuid-1', { codigo_interno: 'EXM002' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve desativar um exame com sucesso', async () => {
      mockExamesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('exame-uuid-1');

      expect(result).toEqual({
        message: 'Exame desativado com sucesso',
      });
      expect(service.remove).toHaveBeenCalledWith('exame-uuid-1');
    });

    it('deve retornar erro quando exame não for encontrado', async () => {
      const notFoundError = new NotFoundException('Exame não encontrado');
      mockExamesService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('bulkUpdateStatus', () => {
    it('deve atualizar status em lote', async () => {
      const body = {
        ids: ['id1', 'id2', 'id3'],
        status: 'inativo',
      };

      mockExamesService.bulkUpdateStatus.mockResolvedValue(undefined);

      const result = await controller.bulkUpdateStatus(body);

      expect(result).toEqual({
        message: 'Status dos exames atualizados com sucesso',
      });
      expect(service.bulkUpdateStatus).toHaveBeenCalledWith(
        body.ids,
        body.status,
      );
    });

    it('deve retornar erro para status inválido', async () => {
      const body = {
        ids: ['id1', 'id2'],
        status: 'invalido',
      };

      const badRequestError = new Error('Status inválido');
      mockExamesService.bulkUpdateStatus.mockRejectedValue(badRequestError);

      await expect(controller.bulkUpdateStatus(body)).rejects.toThrow(
        badRequestError,
      );
    });
  });
});
