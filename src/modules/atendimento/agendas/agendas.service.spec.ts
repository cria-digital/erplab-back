import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AgendasService } from './services/agendas.service';
import { Agenda } from './entities/agenda.entity';
import { ConfiguracaoAgenda } from './entities/configuracao-agenda.entity';
import { VinculacaoAgenda } from './entities/vinculacao-agenda.entity';
import { NotificacaoAgenda } from './entities/notificacao-agenda.entity';
import { CanalIntegracao } from './entities/canal-integracao.entity';
import { BloqueioHorario } from './entities/bloqueio-horario.entity';
import { HorarioEspecifico } from './entities/horario-especifico.entity';
import { PeriodoAtendimento } from './entities/periodo-atendimento.entity';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { CreateBloqueioDto } from './dto/create-bloqueio.dto';
import { DiaSemanaEnum, PeriodoEnum } from './enums/agendas.enum';

describe('AgendasService', () => {
  let service: AgendasService;
  let agendaRepository: Repository<Agenda>;
  let bloqueioRepository: Repository<BloqueioHorario>;

  const mockAgenda = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nome: 'Agenda Clínica Geral',
    descricao: 'Agenda para atendimentos de clínica geral',
    unidade_id: '550e8400-e29b-41d4-a716-446655440001',
    ativo: true,
    configuracaoAgenda: {
      id: '550e8400-e29b-41d4-a716-446655440003',
    },
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
      providers: [
        AgendasService,
        {
          provide: getRepositoryToken(Agenda),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ConfiguracaoAgenda),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(VinculacaoAgenda),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(NotificacaoAgenda),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CanalIntegracao),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BloqueioHorario),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(HorarioEspecifico),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PeriodoAtendimento),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgendasService>(AgendasService);
    agendaRepository = module.get<Repository<Agenda>>(
      getRepositoryToken(Agenda),
    );
    bloqueioRepository = module.get<Repository<BloqueioHorario>>(
      getRepositoryToken(BloqueioHorario),
    );
  });

  it('deveria estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deveria criar uma nova agenda', async () => {
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

      jest.spyOn(agendaRepository, 'create').mockReturnValue(mockAgenda as any);
      jest.spyOn(agendaRepository, 'save').mockResolvedValue(mockAgenda as any);

      const result = await service.create(dto);

      expect(result).toEqual(mockAgenda);
      expect(agendaRepository.create).toHaveBeenCalledWith(dto);
      expect(agendaRepository.save).toHaveBeenCalledWith(mockAgenda);
    });

    it('deveria tratar erro ao criar agenda', async () => {
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

      jest.spyOn(agendaRepository, 'create').mockReturnValue(mockAgenda as any);
      jest
        .spyOn(agendaRepository, 'save')
        .mockRejectedValue(new Error('Erro ao salvar'));

      await expect(service.create(dto)).rejects.toThrow('Erro ao salvar');
    });
  });

  describe('findAll', () => {
    it('deveria retornar todas as agendas com relacionamentos', async () => {
      const mockAgendas = [mockAgenda];
      jest
        .spyOn(agendaRepository, 'find')
        .mockResolvedValue(mockAgendas as any);

      const result = await service.findAll();

      expect(result).toEqual(mockAgendas);
      expect(agendaRepository.find).toHaveBeenCalledWith({
        relations: [
          'configuracaoAgenda',
          'vinculacoes',
          'notificacoes',
          'canaisIntegracao',
        ],
      });
    });

    it('deveria retornar array vazio quando não houver agendas', async () => {
      jest.spyOn(agendaRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deveria retornar uma agenda específica', async () => {
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockResolvedValue(mockAgenda as any);

      const result = await service.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(result).toEqual(mockAgenda);
      expect(agendaRepository.findOne).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        relations: [
          'configuracaoAgenda',
          'configuracaoAgenda.periodosAtendimento',
          'configuracaoAgenda.horariosEspecificos',
          'configuracaoAgenda.bloqueiosHorario',
          'vinculacoes',
          'notificacoes',
          'canaisIntegracao',
        ],
      });
    });

    it('deveria lançar NotFoundException quando agenda não existir', async () => {
      jest.spyOn(agendaRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow(
        'Agenda com ID 550e8400-e29b-41d4-a716-446655440000 não encontrada',
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

      jest
        .spyOn(agendaRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(agendaRepository, 'findOne')
        .mockResolvedValue(updatedAgenda as any);

      const result = await service.update(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(updatedAgenda);
      expect(agendaRepository.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );
    });

    it('deveria lançar erro quando update falhar', async () => {
      const dto: UpdateAgendaDto = {
        nomeAgenda: 'Agenda Atualizada',
      };

      jest
        .spyOn(agendaRepository, 'update')
        .mockRejectedValue(new Error('Erro ao atualizar'));

      await expect(
        service.update('550e8400-e29b-41d4-a716-446655440000', dto),
      ).rejects.toThrow('Erro ao atualizar');
    });
  });

  describe('remove', () => {
    it('deveria remover uma agenda', async () => {
      jest
        .spyOn(agendaRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).resolves.not.toThrow();

      expect(agendaRepository.delete).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });

    it('deveria lançar NotFoundException quando agenda não existir', async () => {
      jest
        .spyOn(agendaRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.remove('550e8400-e29b-41d4-a716-446655440000'),
      ).rejects.toThrow(
        'Agenda com ID 550e8400-e29b-41d4-a716-446655440000 não encontrada',
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

      jest
        .spyOn(agendaRepository, 'findOne')
        .mockResolvedValue(mockAgenda as any);
      jest
        .spyOn(bloqueioRepository, 'create')
        .mockReturnValue(mockBloqueio as any);
      jest
        .spyOn(bloqueioRepository, 'save')
        .mockResolvedValue(mockBloqueio as any);

      const result = await service.addBloqueio(
        '550e8400-e29b-41d4-a716-446655440000',
        dto,
      );

      expect(result).toEqual(mockBloqueio);
      expect(bloqueioRepository.create).toHaveBeenCalledWith({
        ...dto,
        configuracaoAgendaId: mockAgenda.configuracaoAgenda.id,
      });
      expect(bloqueioRepository.save).toHaveBeenCalledWith(mockBloqueio);
    });

    it('deveria lançar NotFoundException quando agenda não existir', async () => {
      const dto: CreateBloqueioDto = {
        dataInicio: new Date('2024-01-01'),
        horaInicio: '08:00',
        dataFim: new Date('2024-01-02'),
        horaFim: '18:00',
        motivoBloqueio: 'Feriado',
      };

      jest.spyOn(agendaRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.addBloqueio('550e8400-e29b-41d4-a716-446655440000', dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeBloqueio', () => {
    it('deveria remover um bloqueio', async () => {
      jest
        .spyOn(bloqueioRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(
        service.removeBloqueio('550e8400-e29b-41d4-a716-446655440002'),
      ).resolves.not.toThrow();

      expect(bloqueioRepository.delete).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440002',
      );
    });

    it('deveria lançar NotFoundException quando bloqueio não existir', async () => {
      jest
        .spyOn(bloqueioRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        service.removeBloqueio('550e8400-e29b-41d4-a716-446655440002'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.removeBloqueio('550e8400-e29b-41d4-a716-446655440002'),
      ).rejects.toThrow(
        'Bloqueio com ID 550e8400-e29b-41d4-a716-446655440002 não encontrado',
      );
    });
  });
});
