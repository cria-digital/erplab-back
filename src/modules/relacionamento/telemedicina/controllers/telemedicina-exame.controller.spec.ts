import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { TelemedicinaExameController } from './telemedicina-exame.controller';
import { TelemedicinaExameService } from '../services/telemedicina-exame.service';
import { CreateTelemedicinaExameDto } from '../dto/create-telemedicina-exame.dto';
import { UpdateTelemedicinaExameDto } from '../dto/update-telemedicina-exame.dto';

describe('TelemedicinaExameController', () => {
  let controller: TelemedicinaExameController;
  let service: TelemedicinaExameService;

  const mockTelemedicinaExame = {
    id: 'vinculo-uuid-1',
    telemedicina_id: 'telemedicina-uuid-1',
    exame_id: 'exame-uuid-1',
    codigo_telemedicina: 'EX001',
    nome_exame_telemedicina: 'Hemograma Completo',
    categoria_telemedicina: 'Hematologia',
    ativo: true,
    permite_upload_imagem: true,
    requer_especialista: false,
    tempo_laudo_padrao: 24,
    valor_laudo: 50.0,
    observacoes: 'Exame de rotina',
    created_at: new Date(),
    updated_at: new Date(),
    telemedicina: {
      id: 'telemedicina-uuid-1',
      codigo_telemedicina: 'TELE001',
      empresa: {
        id: 'empresa-uuid-1',
        nomeFantasia: 'TeleMed Teste',
      },
    },
    exame: {
      id: 'exame-uuid-1',
      codigo: 'HEM001',
      nome: 'Hemograma',
      categoria: 'Hematologia',
      ativo: true,
    },
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    findByTelemedicina: jest.fn(),
    findByExame: jest.fn(),
    findSemVinculo: jest.fn(),
    search: jest.fn(),
    getEstatisticas: jest.fn(),
    findOne: jest.fn(),
    vincularAutomaticamente: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemedicinaExameController],
      providers: [
        {
          provide: TelemedicinaExameService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TelemedicinaExameController>(
      TelemedicinaExameController,
    );
    service = module.get<TelemedicinaExameService>(TelemedicinaExameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTelemedicinaExameDto: CreateTelemedicinaExameDto = {
      telemedicina_id: 'telemedicina-uuid-1',
      exame_id: 'exame-uuid-1',
      codigo_telemedicina: 'EX001',
      nome_exame_telemedicina: 'Hemograma Completo',
      categoria_telemedicina: 'Hematologia',
      ativo: true,
    };

    it('deve criar um vínculo com sucesso', async () => {
      mockService.create.mockResolvedValue(mockTelemedicinaExame);

      const result = await controller.create(createTelemedicinaExameDto);

      expect(result).toEqual(mockTelemedicinaExame);
      expect(service.create).toHaveBeenCalledWith(createTelemedicinaExameDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conflito do service', async () => {
      const conflictError = new BadRequestException('Vínculo já existente');
      mockService.create.mockRejectedValue(conflictError);

      await expect(
        controller.create(createTelemedicinaExameDto),
      ).rejects.toThrow(BadRequestException);
      expect(service.create).toHaveBeenCalledWith(createTelemedicinaExameDto);
    });

    it('deve criar vínculo com dados completos', async () => {
      const createCompleto = {
        ...createTelemedicinaExameDto,
        permite_upload_imagem: true,
        requer_especialista: true,
        tempo_laudo_padrao: 48,
        valor_laudo: 75.0,
        observacoes: 'Exame especializado',
      };

      mockService.create.mockResolvedValue({
        ...mockTelemedicinaExame,
        ...createCompleto,
      });

      const result = await controller.create(createCompleto);

      expect(result.requer_especialista).toBe(true);
      expect(result.tempo_laudo_padrao).toBe(48);
      expect(service.create).toHaveBeenCalledWith(createCompleto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de vínculos', async () => {
      const vinculos = [mockTelemedicinaExame];
      mockService.findAll.mockResolvedValue(vinculos);

      const result = await controller.findAll();

      expect(result).toEqual(vinculos);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há vínculos', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas vínculos ativos', async () => {
      const vinculosAtivos = [mockTelemedicinaExame];
      mockService.findAtivos.mockResolvedValue(vinculosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual(vinculosAtivos);
      expect(service.findAtivos).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há vínculos ativos', async () => {
      mockService.findAtivos.mockResolvedValue([]);

      const result = await controller.findAtivos();

      expect(result).toEqual([]);
    });
  });

  describe('findByTelemedicina', () => {
    it('deve retornar vínculos de uma telemedicina', async () => {
      const vinculos = [mockTelemedicinaExame];
      mockService.findByTelemedicina.mockResolvedValue(vinculos);

      const result = await controller.findByTelemedicina('telemedicina-uuid-1');

      expect(result).toEqual(vinculos);
      expect(service.findByTelemedicina).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
      );
    });

    it('deve retornar lista vazia quando telemedicina não tem vínculos', async () => {
      mockService.findByTelemedicina.mockResolvedValue([]);

      const result = await controller.findByTelemedicina('telemedicina-uuid-2');

      expect(result).toEqual([]);
      expect(service.findByTelemedicina).toHaveBeenCalledWith(
        'telemedicina-uuid-2',
      );
    });
  });

  describe('findByExame', () => {
    it('deve retornar telemedicinas vinculadas a um exame', async () => {
      const vinculos = [mockTelemedicinaExame];
      mockService.findByExame.mockResolvedValue(vinculos);

      const result = await controller.findByExame('exame-uuid-1');

      expect(result).toEqual(vinculos);
      expect(service.findByExame).toHaveBeenCalledWith('exame-uuid-1');
    });

    it('deve retornar lista vazia quando exame não tem vínculos', async () => {
      mockService.findByExame.mockResolvedValue([]);

      const result = await controller.findByExame('exame-uuid-2');

      expect(result).toEqual([]);
      expect(service.findByExame).toHaveBeenCalledWith('exame-uuid-2');
    });
  });

  describe('findSemVinculo', () => {
    it('deve retornar exames sem vínculo para uma telemedicina', async () => {
      const examesSemVinculo = [
        {
          id: 'exame-uuid-2',
          codigo: 'GLI001',
          nome: 'Glicemia',
          categoria: 'Bioquímica',
        },
        {
          id: 'exame-uuid-3',
          codigo: 'COL001',
          nome: 'Colesterol',
          categoria: 'Bioquímica',
        },
      ];

      mockService.findSemVinculo.mockResolvedValue(examesSemVinculo);

      const result = await controller.findSemVinculo('telemedicina-uuid-1');

      expect(result).toEqual(examesSemVinculo);
      expect(service.findSemVinculo).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
      );
    });

    it('deve retornar lista vazia quando todos os exames já estão vinculados', async () => {
      mockService.findSemVinculo.mockResolvedValue([]);

      const result = await controller.findSemVinculo('telemedicina-uuid-1');

      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('deve buscar vínculos por termo', async () => {
      const termoBusca = 'Hemograma';
      const vinculosEncontrados = [mockTelemedicinaExame];
      mockService.search.mockResolvedValue(vinculosEncontrados);

      const result = await controller.search('telemedicina-uuid-1', termoBusca);

      expect(result).toEqual(vinculosEncontrados);
      expect(service.search).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
        termoBusca,
      );
    });

    it('deve retornar lista vazia para termo não encontrado', async () => {
      mockService.search.mockResolvedValue([]);

      const result = await controller.search(
        'telemedicina-uuid-1',
        'termo inexistente',
      );

      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
        'termo inexistente',
      );
    });

    it('deve buscar por código do exame', async () => {
      const codigo = 'HEM001';
      mockService.search.mockResolvedValue([mockTelemedicinaExame]);

      const result = await controller.search('telemedicina-uuid-1', codigo);

      expect(result).toEqual([mockTelemedicinaExame]);
      expect(service.search).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
        codigo,
      );
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas gerais', async () => {
      const estatisticas = {
        total: 100,
        ativos: 80,
        inativos: 20,
        comUploadImagem: 30,
        requerEspecialista: 20,
      };

      mockService.getEstatisticas.mockResolvedValue(estatisticas);

      const result = await controller.getEstatisticas();

      expect(result).toEqual(estatisticas);
      expect(service.getEstatisticas).toHaveBeenCalledWith(undefined);
    });

    it('deve retornar estatísticas de uma telemedicina específica', async () => {
      const estatisticas = {
        total: 50,
        ativos: 45,
        inativos: 5,
        comUploadImagem: 15,
        requerEspecialista: 10,
      };

      mockService.getEstatisticas.mockResolvedValue(estatisticas);

      const result = await controller.getEstatisticas('telemedicina-uuid-1');

      expect(result).toEqual(estatisticas);
      expect(service.getEstatisticas).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um vínculo por ID', async () => {
      const id = 'vinculo-uuid-1';
      mockService.findOne.mockResolvedValue(mockTelemedicinaExame);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockTelemedicinaExame);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('deve propagar erro quando ID não for encontrado', async () => {
      const id = 'invalid-uuid';
      const notFoundError = new NotFoundException('Vínculo não encontrado');
      mockService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('vincularAutomaticamente', () => {
    it('deve vincular exames automaticamente com sucesso', async () => {
      const resultado = {
        vinculados: 10,
        total: 15,
      };

      mockService.vincularAutomaticamente.mockResolvedValue(resultado);

      const result = await controller.vincularAutomaticamente(
        'telemedicina-uuid-1',
      );

      expect(result).toEqual(resultado);
      expect(service.vincularAutomaticamente).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
      );
    });

    it('deve retornar zero vínculos quando não há exames disponíveis', async () => {
      const resultado = {
        vinculados: 0,
        total: 0,
      };

      mockService.vincularAutomaticamente.mockResolvedValue(resultado);

      const result = await controller.vincularAutomaticamente(
        'telemedicina-uuid-1',
      );

      expect(result).toEqual(resultado);
    });

    it('deve vincular parcialmente quando alguns falham', async () => {
      const resultado = {
        vinculados: 5,
        total: 10,
      };

      mockService.vincularAutomaticamente.mockResolvedValue(resultado);

      const result = await controller.vincularAutomaticamente(
        'telemedicina-uuid-1',
      );

      expect(result.vinculados).toBe(5);
      expect(result.total).toBe(10);
    });
  });

  describe('update', () => {
    const updateTelemedicinaExameDto: UpdateTelemedicinaExameDto = {
      codigo_telemedicina: 'EX002',
      valor_laudo: 60.0,
      tempo_laudo_padrao: 48,
    };

    it('deve atualizar vínculo com sucesso', async () => {
      const vinculoAtualizado = {
        ...mockTelemedicinaExame,
        ...updateTelemedicinaExameDto,
      };

      mockService.update.mockResolvedValue(vinculoAtualizado);

      const result = await controller.update(
        'vinculo-uuid-1',
        updateTelemedicinaExameDto,
      );

      expect(result).toEqual(vinculoAtualizado);
      expect(service.update).toHaveBeenCalledWith(
        'vinculo-uuid-1',
        updateTelemedicinaExameDto,
      );
    });

    it('deve propagar erro quando vínculo não for encontrado', async () => {
      const notFoundError = new NotFoundException('Vínculo não encontrado');
      mockService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateTelemedicinaExameDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar configurações específicas', async () => {
      const updateConfiguracoes = {
        permite_upload_imagem: false,
        requer_especialista: true,
        observacoes: 'Requer análise especializada',
      };

      const vinculoAtualizado = {
        ...mockTelemedicinaExame,
        ...updateConfiguracoes,
      };

      mockService.update.mockResolvedValue(vinculoAtualizado);

      const result = await controller.update(
        'vinculo-uuid-1',
        updateConfiguracoes,
      );

      expect(result.requer_especialista).toBe(true);
      expect(result.permite_upload_imagem).toBe(false);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const vinculoInativo = {
        ...mockTelemedicinaExame,
        ativo: false,
      };

      mockService.toggleStatus.mockResolvedValue(vinculoInativo);

      const result = await controller.toggleStatus('vinculo-uuid-1');

      expect(result).toEqual(vinculoInativo);
      expect(result.ativo).toBe(false);
      expect(service.toggleStatus).toHaveBeenCalledWith('vinculo-uuid-1');
    });

    it('deve alternar status de inativo para ativo', async () => {
      const vinculoAtivo = { ...mockTelemedicinaExame, ativo: true };

      mockService.toggleStatus.mockResolvedValue(vinculoAtivo);

      const result = await controller.toggleStatus('vinculo-uuid-1');

      expect(result).toEqual(vinculoAtivo);
      expect(result.ativo).toBe(true);
    });

    it('deve propagar erro quando vínculo não for encontrado', async () => {
      const notFoundError = new NotFoundException('Vínculo não encontrado');
      mockService.toggleStatus.mockRejectedValue(notFoundError);

      await expect(controller.toggleStatus('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover vínculo com sucesso', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('vinculo-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('vinculo-uuid-1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando vínculo não for encontrado', async () => {
      const notFoundError = new NotFoundException('Vínculo não encontrado');
      mockService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalid-id');
    });

    it('deve retornar void quando remoção for bem-sucedida', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('vinculo-uuid-1');

      expect(result).toBeUndefined();
    });
  });
});
