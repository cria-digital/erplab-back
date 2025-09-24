import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { PrestadorServicoController } from './prestador-servico.controller';
import { PrestadorServicoService } from './prestador-servico.service';
import { CreatePrestadorServicoDto } from './dto/create-prestador-servico.dto';
import { UpdatePrestadorServicoDto } from './dto/update-prestador-servico.dto';
import {
  StatusContrato,
  TipoContrato,
  FormaPagamento,
  FrequenciaPagamento,
} from './entities/prestador-servico.entity';
import { TipoEmpresaEnum } from '../empresas/enums/empresas.enum';

describe('PrestadorServicoController', () => {
  let controller: PrestadorServicoController;
  let service: PrestadorServicoService;

  const mockPrestador = {
    id: 'prestador-uuid-1',
    empresaId: 'empresa-uuid-1',
    empresa: {
      id: 'empresa-uuid-1',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Prestador Teste Ltda',
      nomeFantasia: 'Prestador Teste',
      ativo: true,
    },
    codigoPrestador: 'PREST001',
    categorias: [],
    tipoContrato: TipoContrato.POR_DEMANDA,
    numeroContrato: 'CONT-2024-001',
    statusContrato: StatusContrato.ATIVO,
    valorContrato: 5000.0,
    formaPagamento: FormaPagamento.POR_SERVICO,
    frequenciaPagamento: FrequenciaPagamento.MENSAL,
    atendeUrgencia: true,
    suporte24x7: false,
    avaliacaoMedia: 4.5,
    totalAvaliacoes: 10,
    totalServicosPrestados: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findActive: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findByCnpj: jest.fn(),
    search: jest.fn(),
    findByStatus: jest.fn(),
    findByTipoContrato: jest.fn(),
    findComUrgencia: jest.fn(),
    findCom24x7: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    toggleStatus: jest.fn(),
    avaliar: jest.fn(),
    incrementarServicos: jest.fn(),
    remove: jest.fn(),
    getEstatisticas: jest.fn(),
    getContratosVencendo: jest.fn(),
    getRenovacoesAutomaticas: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestadorServicoController],
      providers: [
        {
          provide: PrestadorServicoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PrestadorServicoController>(
      PrestadorServicoController,
    );
    service = module.get<PrestadorServicoService>(PrestadorServicoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPrestadorDto: CreatePrestadorServicoDto = {
      codigoPrestador: 'PREST001',
      tipoContrato: TipoContrato.POR_DEMANDA,
      statusContrato: StatusContrato.ATIVO,
      formaPagamento: FormaPagamento.POR_SERVICO,
      atendeUrgencia: true,
      empresa: {
        tipoEmpresa: TipoEmpresaEnum.PRESTADORES_SERVICOS,
        cnpj: '12345678000190',
        razaoSocial: 'Prestador Teste Ltda',
        nomeFantasia: 'Prestador Teste',
        emailComercial: 'contato@prestador.com.br',
        ativo: true,
      } as any,
    };

    it('deve criar um prestador com sucesso', async () => {
      mockService.create.mockResolvedValue(mockPrestador);

      const result = await controller.create(createPrestadorDto);

      expect(result).toEqual(mockPrestador);
      expect(service.create).toHaveBeenCalledWith(createPrestadorDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conflito do service', async () => {
      const conflictError = new BadRequestException('Código já existente');
      mockService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createPrestadorDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve criar prestador com dados completos', async () => {
      const createCompleto = {
        ...createPrestadorDto,
        numeroContrato: 'CONT-2024-001',
        dataInicioContrato: '2024-01-01',
        dataFimContrato: '2024-12-31',
        valor_contrato: 5000.0,
        suporte24x7: true,
      };

      mockService.create.mockResolvedValue(mockPrestador);

      const result = await controller.create(createCompleto);

      expect(result).toEqual(mockPrestador);
      expect(service.create).toHaveBeenCalledWith(createCompleto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de prestadores', async () => {
      const prestadores = [mockPrestador];
      mockService.findAll.mockResolvedValue(prestadores);

      const result = await controller.findAll();

      expect(result).toEqual(prestadores);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há prestadores', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findActive', () => {
    it('deve retornar apenas prestadores ativos', async () => {
      const prestadoresAtivos = [mockPrestador];
      mockService.findActive.mockResolvedValue(prestadoresAtivos);

      const result = await controller.findActive();

      expect(result).toEqual(prestadoresAtivos);
      expect(service.findActive).toHaveBeenCalledTimes(1);
    });
  });

  describe('search', () => {
    it('deve buscar prestadores por termo', async () => {
      const prestadores = [mockPrestador];
      mockService.search.mockResolvedValue(prestadores);

      const result = await controller.search('teste');

      expect(result).toEqual(prestadores);
      expect(service.search).toHaveBeenCalledWith('teste');
    });

    it('deve retornar lista vazia para termo não encontrado', async () => {
      mockService.search.mockResolvedValue([]);

      const result = await controller.search('inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('findByStatus', () => {
    it('deve retornar prestadores por status', async () => {
      const prestadores = [mockPrestador];
      mockService.findByStatus.mockResolvedValue(prestadores);

      const result = await controller.findByStatus(StatusContrato.ATIVO);

      expect(result).toEqual(prestadores);
      expect(service.findByStatus).toHaveBeenCalledWith(StatusContrato.ATIVO);
    });
  });

  describe('findByTipoContrato', () => {
    it('deve retornar prestadores por tipo de contrato', async () => {
      const prestadores = [mockPrestador];
      mockService.findByTipoContrato.mockResolvedValue(prestadores);

      const result = await controller.findByTipoContrato('por_demanda');

      expect(result).toEqual(prestadores);
      expect(service.findByTipoContrato).toHaveBeenCalledWith('por_demanda');
    });
  });

  describe('findComUrgencia', () => {
    it('deve retornar prestadores que atendem urgência', async () => {
      const prestadores = [{ ...mockPrestador, atendeUrgencia: true }];
      mockService.findComUrgencia.mockResolvedValue(prestadores);

      const result = await controller.findComUrgencia();

      expect(result).toEqual(prestadores);
      expect(service.findComUrgencia).toHaveBeenCalledTimes(1);
    });
  });

  describe('findCom24x7', () => {
    it('deve retornar prestadores com suporte 24x7', async () => {
      const prestadores = [{ ...mockPrestador, suporte24x7: true }];
      mockService.findCom24x7.mockResolvedValue(prestadores);

      const result = await controller.findCom24x7();

      expect(result).toEqual(prestadores);
      expect(service.findCom24x7).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas dos prestadores', async () => {
      const estatisticas = {
        resumo: {
          total: 100,
          ativos: 80,
          inativos: 10,
          suspensos: 5,
          emAnalise: 5,
          com24x7: 20,
          comUrgencia: 30,
        },
        melhoresAvaliados: [],
        maisServicos: [],
      };

      mockService.getEstatisticas.mockResolvedValue(estatisticas);

      const result = await controller.getEstatisticas();

      expect(result).toEqual(estatisticas);
      expect(service.getEstatisticas).toHaveBeenCalledTimes(1);
    });
  });

  describe('getContratosVencendo', () => {
    it('deve retornar contratos vencendo', async () => {
      const prestadores = [mockPrestador];
      mockService.getContratosVencendo.mockResolvedValue(prestadores);

      const result = await controller.getContratosVencendo(30);

      expect(result).toEqual(prestadores);
      expect(service.getContratosVencendo).toHaveBeenCalledWith(30);
    });

    it('deve usar valor padrão quando não fornecido', async () => {
      mockService.getContratosVencendo.mockResolvedValue([]);

      const result = await controller.getContratosVencendo(undefined);

      expect(result).toEqual([]);
      expect(service.getContratosVencendo).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getRenovacoesAutomaticas', () => {
    it('deve retornar prestadores com renovação automática', async () => {
      const prestadores = [{ ...mockPrestador, renovacaoAutomatica: true }];
      mockService.getRenovacoesAutomaticas.mockResolvedValue(prestadores);

      const result = await controller.getRenovacoesAutomaticas();

      expect(result).toEqual(prestadores);
      expect(service.getRenovacoesAutomaticas).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar prestador por código', async () => {
      mockService.findByCodigo.mockResolvedValue(mockPrestador);

      const result = await controller.findByCodigo('PREST001');

      expect(result).toEqual(mockPrestador);
      expect(service.findByCodigo).toHaveBeenCalledWith('PREST001');
    });

    it('deve propagar erro quando código não for encontrado', async () => {
      const notFoundError = new NotFoundException('Prestador não encontrado');
      mockService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar prestador por CNPJ', async () => {
      mockService.findByCnpj.mockResolvedValue(mockPrestador);

      const result = await controller.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockPrestador);
      expect(service.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });

    it('deve propagar erro quando CNPJ não for encontrado', async () => {
      const notFoundError = new NotFoundException('Prestador não encontrado');
      mockService.findByCnpj.mockRejectedValue(notFoundError);

      await expect(controller.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar prestador por ID', async () => {
      mockService.findOne.mockResolvedValue(mockPrestador);

      const result = await controller.findOne('prestador-uuid-1');

      expect(result).toEqual(mockPrestador);
      expect(service.findOne).toHaveBeenCalledWith('prestador-uuid-1');
    });

    it('deve propagar erro quando ID não for encontrado', async () => {
      const notFoundError = new NotFoundException('Prestador não encontrado');
      mockService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updatePrestadorDto: UpdatePrestadorServicoDto = {
      valor_contrato: 6000.0,
      atendeUrgencia: false,
    } as any;

    it('deve atualizar prestador com sucesso', async () => {
      const prestadorAtualizado = {
        ...mockPrestador,
        ...updatePrestadorDto,
      };

      mockService.update.mockResolvedValue(prestadorAtualizado);

      const result = await controller.update(
        'prestador-uuid-1',
        updatePrestadorDto,
      );

      expect(result).toEqual(prestadorAtualizado);
      expect(service.update).toHaveBeenCalledWith(
        'prestador-uuid-1',
        updatePrestadorDto,
      );
    });

    it('deve propagar erro quando prestador não for encontrado', async () => {
      const notFoundError = new NotFoundException('Prestador não encontrado');
      mockService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updatePrestadorDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status do contrato', async () => {
      const prestadorSuspenso = {
        ...mockPrestador,
        statusContrato: StatusContrato.SUSPENSO,
      };

      mockService.updateStatus.mockResolvedValue(prestadorSuspenso);

      const result = await controller.updateStatus(
        'prestador-uuid-1',
        StatusContrato.SUSPENSO,
      );

      expect(result).toEqual(prestadorSuspenso);
      expect(service.updateStatus).toHaveBeenCalledWith(
        'prestador-uuid-1',
        StatusContrato.SUSPENSO,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status ativo/inativo', async () => {
      const prestadorInativo = {
        ...mockPrestador,
        empresa: { ...mockPrestador.empresa, ativo: false },
      };

      mockService.toggleStatus.mockResolvedValue(prestadorInativo);

      const result = await controller.toggleStatus('prestador-uuid-1');

      expect(result).toEqual(prestadorInativo);
      expect(service.toggleStatus).toHaveBeenCalledWith('prestador-uuid-1');
    });
  });

  describe('avaliar', () => {
    it('deve adicionar avaliação com sucesso', async () => {
      const prestadorAvaliado = {
        ...mockPrestador,
        avaliacaoMedia: 4.6,
        totalAvaliacoes: 11,
      };

      mockService.avaliar.mockResolvedValue(prestadorAvaliado);

      const result = await controller.avaliar('prestador-uuid-1', {
        avaliacao: 5,
      });

      expect(result).toEqual(prestadorAvaliado);
      expect(service.avaliar).toHaveBeenCalledWith('prestador-uuid-1', 5);
    });

    it('deve validar valor da avaliação', async () => {
      const errorMessage = 'Avaliação deve estar entre 1 e 5';
      mockService.avaliar.mockRejectedValue(
        new BadRequestException(errorMessage),
      );

      await expect(
        controller.avaliar('prestador-uuid-1', { avaliacao: 6 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('incrementarServicos', () => {
    it('deve incrementar contador de serviços', async () => {
      const prestadorAtualizado = {
        ...mockPrestador,
        totalServicosPrestados: 51,
      };

      mockService.incrementarServicos.mockResolvedValue(prestadorAtualizado);

      const result = await controller.incrementarServicos('prestador-uuid-1');

      expect(result).toEqual(prestadorAtualizado);
      expect(service.incrementarServicos).toHaveBeenCalledWith(
        'prestador-uuid-1',
      );
    });
  });

  describe('remove', () => {
    it('deve remover prestador com sucesso', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('prestador-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('prestador-uuid-1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando prestador não for encontrado', async () => {
      const notFoundError = new NotFoundException('Prestador não encontrado');
      mockService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
