import { Test, TestingModule } from '@nestjs/testing';
import { AgendasController } from './controllers/agendas.controller';
import { AgendasService } from './services/agendas.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { CreateBloqueioDto } from './dto/create-bloqueio.dto';
import { DiaSemanaEnum, PeriodoEnum } from './enums/agendas.enum';

describe('AgendasController', () => {
  let controller: AgendasController;
  let service: AgendasService;

  const mockAgendasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addBloqueio: jest.fn(),
    removeBloqueio: jest.fn(),
  };

  const mockAgenda = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nome: 'Agenda Clínica Geral',
    descricao: 'Agenda para atendimentos de clínica geral',
    unidade_id: '550e8400-e29b-41d4-a716-446655440001',
    ativo: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockBloqueio = {
    id: '550e8400-e29b-41d4-a716-446655440002',
    configuracaoAgendaId: '550e8400-e29b-41d4-a716-446655440003',
    dataInicio: new Date('2024-01-01'),
    dataFim: new Date('2024-01-02'),
    motivo: 'Feriado',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendasController],
      providers: [
        {
          provide: AgendasService,
          useValue: mockAgendasService,
        },
      ],
    }).compile();

    controller = module.get<AgendasController>(AgendasController);
    service = module.get<AgendasService>(AgendasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deveria criar uma agenda', async () => {
      const dto: CreateAgendaDto = {
        codigoInterno: 'AGE001',
        nomeAgenda: 'Agenda Clínica Geral',
        descricao: 'Agenda para atendimentos de clínica geral',
        unidadeAssociadaId: '550e8400-e29b-41d4-a716-446655440001',
        configuracaoAgenda: {
          diasSemana: [
            DiaSemanaEnum.SEG,
            DiaSemanaEnum.TER,
            DiaSemanaEnum.QUA,
            DiaSemanaEnum.QUI,
            DiaSemanaEnum.SEX,
          ],
          periodosAtendimento: [
            {
              periodo: PeriodoEnum.MANHA,
              horarioInicio: '08:00',
              horarioFim: '12:00',
            },
          ],
          intervaloAgendamento: 30,
        },
      };

      mockAgendasService.create.mockResolvedValue(mockAgenda);

      const result = await controller.create(dto);

      expect(result).toEqual(mockAgenda);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deveria retornar um array de agendas', async () => {
      const mockAgendas = [mockAgenda];
      mockAgendasService.findAll.mockResolvedValue(mockAgendas);

      const result = await controller.findAll();

      expect(result).toEqual(mockAgendas);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deveria retornar uma agenda específica', async () => {
      mockAgendasService.findOne.mockResolvedValue(mockAgenda);

      const result = await controller.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockAgenda);
      expect(service.findOne).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });
  });

  describe('update', () => {
    it('deveria atualizar uma agenda', async () => {
      const dto: UpdateAgendaDto = {
        nomeAgenda: 'Agenda Atualizada',
        descricao: 'Descrição atualizada',
      };

      const updatedAgenda = { ...mockAgenda, ...dto };
      mockAgendasService.update.mockResolvedValue(updatedAgenda);

      const result = await controller.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(updatedAgenda);
      expect(service.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });
  });

  describe('remove', () => {
    it('deveria remover uma agenda', async () => {
      mockAgendasService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });
  });

  describe('addBloqueio', () => {
    it('deveria adicionar um bloqueio à agenda', async () => {
      const dto: CreateBloqueioDto = {
        dataInicio: new Date('2024-01-01'),
        horaInicio: '08:00',
        dataFim: new Date('2024-01-02'),
        horaFim: '18:00',
        motivoBloqueio: 'Feriado',
      };

      mockAgendasService.addBloqueio.mockResolvedValue(mockBloqueio);

      const result = await controller.addBloqueio(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(mockBloqueio);
      expect(service.addBloqueio).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });
  });

  describe('removeBloqueio', () => {
    it('deveria remover um bloqueio', async () => {
      mockAgendasService.removeBloqueio.mockResolvedValue(undefined);

      const result = await controller.removeBloqueio(
        '550e8400-e29b-41d4-a716-446655440002',
      );

      expect(result).toBeUndefined();
      expect(service.removeBloqueio).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440002',
      );
    });
  });
});
