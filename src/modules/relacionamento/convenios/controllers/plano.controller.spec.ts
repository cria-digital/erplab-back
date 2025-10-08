import { Test, TestingModule } from '@nestjs/testing';
import { PlanoController } from './plano.controller';
import { PlanoService } from '../services/plano.service';
import { CreatePlanoDto } from '../dto/create-plano.dto';
import { UpdatePlanoDto } from '../dto/update-plano.dto';
import {
  TipoPlano,
  CategoriaPlano,
  ModalidadePlano,
  CoberturaGeografica,
} from '../entities/plano.entity';
import { NotFoundException } from '@nestjs/common';

describe('PlanoController', () => {
  let controller: PlanoController;
  let service: PlanoService;

  const mockPlanoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    findByConvenio: jest.fn(),
    findByCodigo: jest.fn(),
    findOne: jest.fn(),
    verificarCarencia: jest.fn(),
    calcularCoparticipacao: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPlano = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    convenio_id: '550e8400-e29b-41d4-a716-446655440001',
    codigo_plano: 'PLN001',
    nome_plano: 'Plano Básico',
    tipo_plano: TipoPlano.COMPLETO,
    categoria: CategoriaPlano.BASICO,
    modalidade: ModalidadePlano.PRE_PAGAMENTO,
    cobertura_geografica: CoberturaGeografica.MUNICIPAL,
    carencia_dias: 30,
    limite_mensal: 1000.0,
    limite_anual: 12000.0,
    percentual_coparticipacao: 20.0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanoController],
      providers: [
        {
          provide: PlanoService,
          useValue: mockPlanoService,
        },
      ],
    }).compile();

    controller = module.get<PlanoController>(PlanoController);
    service = module.get<PlanoService>(PlanoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deveria criar um novo plano', async () => {
      const dto: CreatePlanoDto = {
        convenio_id: '550e8400-e29b-41d4-a716-446655440001',
        codigo_plano: 'PLN001',
        nome_plano: 'Plano Básico',
        tipo_plano: TipoPlano.COMPLETO,
        categoria: CategoriaPlano.BASICO,
        modalidade: ModalidadePlano.PRE_PAGAMENTO,
        vigencia_inicio: new Date('2024-01-01'),
        cobertura_geografica: CoberturaGeografica.MUNICIPAL,
        carencia_dias: 30,
      };

      mockPlanoService.create.mockResolvedValue(mockPlano);

      const result = await controller.create(dto);

      expect(result).toEqual(mockPlano);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('deveria tratar erro quando convênio não existir', async () => {
      const dto: CreatePlanoDto = {
        convenio_id: '550e8400-e29b-41d4-a716-446655440999',
        codigo_plano: 'PLN001',
        nome_plano: 'Plano Básico',
        tipo_plano: TipoPlano.COMPLETO,
        categoria: CategoriaPlano.BASICO,
        modalidade: ModalidadePlano.PRE_PAGAMENTO,
        vigencia_inicio: new Date('2024-01-01'),
        cobertura_geografica: CoberturaGeografica.MUNICIPAL,
      };

      const erro = new NotFoundException('Convênio não encontrado');
      mockPlanoService.create.mockRejectedValue(erro);

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deveria retornar todos os planos', async () => {
      const mockPlanos = [mockPlano];
      mockPlanoService.findAll.mockResolvedValue(mockPlanos);

      const result = await controller.findAll();

      expect(result).toEqual(mockPlanos);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAtivos', () => {
    it('deveria retornar planos ativos', async () => {
      const mockPlanosAtivos = [mockPlano];
      mockPlanoService.findAtivos.mockResolvedValue(mockPlanosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual(mockPlanosAtivos);
      expect(service.findAtivos).toHaveBeenCalledWith(undefined);
    });
  });

  describe('findOne', () => {
    it('deveria retornar um plano específico', async () => {
      mockPlanoService.findOne.mockResolvedValue(mockPlano);

      const result = await controller.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockPlano);
      expect(service.findOne).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria tratar erro quando plano não existir', async () => {
      const erro = new NotFoundException('Plano não encontrado');
      mockPlanoService.findOne.mockRejectedValue(erro);

      await expect(
        controller.findOne('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('verificarCarencia', () => {
    it('deveria verificar carência com sucesso', async () => {
      const planoId = '550e8400-e29b-41d4-a716-446655440000';
      const dataAdesao = '2024-01-01';
      mockPlanoService.verificarCarencia.mockResolvedValue(true);

      const result = await controller.verificarCarencia(planoId, dataAdesao);

      expect(result).toEqual({ carenciaCumprida: true });
      expect(service.verificarCarencia).toHaveBeenCalledWith(
        planoId,
        new Date(dataAdesao),
      );
    });
  });

  describe('calcularCoparticipacao', () => {
    it('deveria calcular coparticipação com sucesso', async () => {
      const planoId = '550e8400-e29b-41d4-a716-446655440000';
      const valor = 100.0;
      mockPlanoService.calcularCoparticipacao.mockResolvedValue(20.0);

      const result = await controller.calcularCoparticipacao(planoId, valor);

      expect(result).toEqual({ valorCoparticipacao: 20.0 });
      expect(service.calcularCoparticipacao).toHaveBeenCalledWith(
        planoId,
        valor,
      );
    });
  });

  describe('update', () => {
    it('deveria atualizar um plano', async () => {
      const dto: UpdatePlanoDto = {
        nome_plano: 'Plano Atualizado',
      };

      const planoAtualizado = { ...mockPlano, ...dto };
      mockPlanoService.update.mockResolvedValue(planoAtualizado);

      const result = await controller.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(planoAtualizado);
      expect(result.nome_plano).toBe('Plano Atualizado');
      expect(service.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });
  });

  describe('remove', () => {
    it('deveria remover um plano', async () => {
      mockPlanoService.remove.mockResolvedValue(undefined);

      await expect(
        controller.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).resolves.not.toThrow();

      expect(service.remove).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });
  });
});
