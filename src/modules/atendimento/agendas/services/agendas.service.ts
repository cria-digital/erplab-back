import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from '../entities/agenda.entity';
import { ConfiguracaoAgenda } from '../entities/configuracao-agenda.entity';
import { VinculacaoAgenda } from '../entities/vinculacao-agenda.entity';
import { NotificacaoAgenda } from '../entities/notificacao-agenda.entity';
import { CanalIntegracao } from '../entities/canal-integracao.entity';
import { BloqueioHorario } from '../entities/bloqueio-horario.entity';
import { HorarioEspecifico } from '../entities/horario-especifico.entity';
import { PeriodoAtendimento } from '../entities/periodo-atendimento.entity';
import { CreateAgendaDto } from '../dto/create-agenda.dto';
import { UpdateAgendaDto } from '../dto/update-agenda.dto';
import { CreateBloqueioDto } from '../dto/create-bloqueio.dto';

@Injectable()
export class AgendasService {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    @InjectRepository(ConfiguracaoAgenda)
    private configuracaoRepository: Repository<ConfiguracaoAgenda>,
    @InjectRepository(VinculacaoAgenda)
    private vinculacaoRepository: Repository<VinculacaoAgenda>,
    @InjectRepository(NotificacaoAgenda)
    private notificacaoRepository: Repository<NotificacaoAgenda>,
    @InjectRepository(CanalIntegracao)
    private canalIntegracaoRepository: Repository<CanalIntegracao>,
    @InjectRepository(BloqueioHorario)
    private bloqueioRepository: Repository<BloqueioHorario>,
    @InjectRepository(HorarioEspecifico)
    private horarioEspecificoRepository: Repository<HorarioEspecifico>,
    @InjectRepository(PeriodoAtendimento)
    private periodoAtendimentoRepository: Repository<PeriodoAtendimento>,
  ) {}

  async create(createAgendaDto: CreateAgendaDto): Promise<Agenda> {
    const agenda = this.agendaRepository.create(createAgendaDto);
    return this.agendaRepository.save(agenda) as unknown as Promise<Agenda>;
  }

  async findAll(): Promise<Agenda[]> {
    return await this.agendaRepository.find({
      relations: [
        'configuracaoAgenda',
        'vinculacoes',
        'notificacoes',
        'canaisIntegracao',
      ],
    });
  }

  async findOne(id: string): Promise<Agenda> {
    const agenda = await this.agendaRepository.findOne({
      where: { id },
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

    if (!agenda) {
      throw new NotFoundException(`Agenda com ID ${id} não encontrada`);
    }

    return agenda;
  }

  async update(id: string, updateAgendaDto: UpdateAgendaDto): Promise<Agenda> {
    await this.agendaRepository.update(id, updateAgendaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.agendaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agenda com ID ${id} não encontrada`);
    }
  }

  async addBloqueio(
    agendaId: string,
    bloqueioDto: CreateBloqueioDto,
  ): Promise<BloqueioHorario> {
    const agenda = await this.findOne(agendaId);
    const bloqueio = this.bloqueioRepository.create({
      ...bloqueioDto,
      configuracaoAgendaId: agenda.configuracaoAgenda.id,
    });
    return this.bloqueioRepository.save(
      bloqueio,
    ) as unknown as Promise<BloqueioHorario>;
  }

  async removeBloqueio(bloqueioId: string): Promise<void> {
    const result = await this.bloqueioRepository.delete(bloqueioId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Bloqueio com ID ${bloqueioId} não encontrado`,
      );
    }
  }
}
