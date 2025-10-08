import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PlanoService } from './plano.service';
import { ConvenioService } from './convenio.service';
import {
  Plano,
  TipoPlano,
  CategoriaPlano,
  ModalidadePlano,
  CoberturaGeografica,
} from '../entities/plano.entity';
import { CreatePlanoDto } from '../dto/create-plano.dto';
import { UpdatePlanoDto } from '../dto/update-plano.dto';

describe('PlanoService', () => {
  let service: PlanoService;
  let planoRepository: Repository<Plano>;
  let convenioService: ConvenioService;

  const mockPlanoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockConvenioService = {
    findOne: jest.fn(),
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

  const mockConvenio = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    nome: 'Convênio Teste',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanoService,
        {
          provide: getRepositoryToken(Plano),
          useValue: mockPlanoRepository,
        },
        {
          provide: ConvenioService,
          useValue: mockConvenioService,
        },
      ],
    }).compile();

    service = module.get<PlanoService>(PlanoService);
    planoRepository = module.get<Repository<Plano>>(getRepositoryToken(Plano));
    convenioService = module.get<ConvenioService>(ConvenioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(service).toBeDefined();
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

      mockConvenioService.findOne.mockResolvedValue(mockConvenio);
      mockPlanoRepository.findOne.mockResolvedValue(null);
      mockPlanoRepository.create.mockReturnValue(mockPlano);
      mockPlanoRepository.save.mockResolvedValue(mockPlano);

      const result = await service.create(dto);

      expect(result).toEqual(mockPlano);
      expect(convenioService.findOne).toHaveBeenCalledWith(dto.convenio_id);
      expect(planoRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deveria retornar todos os planos', async () => {
      const mockPlanos = [mockPlano];
      mockPlanoRepository.find.mockResolvedValue(mockPlanos);

      const result = await service.findAll();

      expect(result).toEqual(mockPlanos);
    });
  });

  describe('findOne', () => {
    it('deveria retornar um plano específico', async () => {
      mockPlanoRepository.findOne.mockResolvedValue(mockPlano);

      const result = await service.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockPlano);
    });

    it('deveria lançar NotFoundException quando plano não existir', async () => {
      mockPlanoRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('550e8400-e29b-41d4-a716-446655440999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deveria atualizar um plano', async () => {
      const dto: UpdatePlanoDto = {
        nome_plano: 'Plano Atualizado',
      };

      const planoAtualizado = { ...mockPlano, ...dto };
      mockPlanoRepository.findOne.mockResolvedValue(mockPlano);
      mockPlanoRepository.save.mockResolvedValue(planoAtualizado);

      const result = await service.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(planoAtualizado);
    });
  });

  describe('remove', () => {
    it('deveria remover um plano', async () => {
      mockPlanoRepository.findOne.mockResolvedValue(mockPlano);
      mockPlanoRepository.remove.mockResolvedValue(mockPlano);

      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).resolves.not.toThrow();
    });
  });

  describe('verificarCarencia', () => {
    it('deveria retornar true quando carência foi cumprida', async () => {
      const dataAdesao = new Date('2024-01-01');
      mockPlanoRepository.findOne.mockResolvedValue(mockPlano);

      jest
        .spyOn(Date, 'now')
        .mockImplementation(() => new Date('2024-02-01').getTime());

      const result = await service.verificarCarencia(
        '550e8400-e29b-41d4-a716-446655440000',
        dataAdesao,
      );

      expect(result).toBe(true);
    });
  });

  describe('calcularCoparticipacao', () => {
    it('deveria calcular coparticipação corretamente', async () => {
      const valorProcedimento = 100.0;
      mockPlanoRepository.findOne.mockResolvedValue(mockPlano);

      const result = await service.calcularCoparticipacao(
        '550e8400-e29b-41d4-a716-446655440000',
        valorProcedimento,
      );

      expect(result).toBe(20.0);
    });
  });
});
