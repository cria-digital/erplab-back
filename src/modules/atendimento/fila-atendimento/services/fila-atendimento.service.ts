import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import {
  SenhaAtendimento,
  TipoSenha,
  StatusSenha,
} from '../entities/senha-atendimento.entity';
import { CriarSenhaDto, ChamarSenhaDto, FiltroFilaDto } from '../dto';
import { Paciente } from '../../../cadastros/pacientes/entities/paciente.entity';

@Injectable()
export class FilaAtendimentoService {
  constructor(
    @InjectRepository(SenhaAtendimento)
    private readonly senhaRepository: Repository<SenhaAtendimento>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  /**
   * Gera uma nova senha de atendimento
   */
  async gerarSenha(
    dto: CriarSenhaDto,
    tenantId?: string,
  ): Promise<SenhaAtendimento> {
    // Se CPF informado, buscar paciente
    let pacienteId: string | undefined;
    if (dto.cpf) {
      const paciente = await this.pacienteRepository.findOne({
        where: { cpf: dto.cpf.replace(/\D/g, '') },
      });
      if (paciente) {
        pacienteId = paciente.id;
      }
    }

    // Gerar número do ticket
    const ticket = await this.gerarProximoTicket(dto.unidadeId, dto.tipo);

    const senha = this.senhaRepository.create({
      unidadeId: dto.unidadeId,
      tipo: dto.tipo,
      ticket,
      horaChegada: new Date(),
      pacienteId,
      tenantId,
      status: StatusSenha.AGUARDANDO,
    });

    return await this.senhaRepository.save(senha);
  }

  /**
   * Gera o próximo número de ticket para o tipo
   */
  private async gerarProximoTicket(
    unidadeId: string,
    tipo: TipoSenha,
  ): Promise<string> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const prefixo = tipo === TipoSenha.PRIORIDADE ? 'PRIO' : 'GER';

    // Contar quantas senhas do tipo já foram geradas hoje
    const count = await this.senhaRepository.count({
      where: {
        unidadeId,
        tipo,
        horaChegada: Between(hoje, amanha),
      },
    });

    // Gerar ticket com 4 dígitos (ex: PRIO0001, GER0015)
    const numero = (count + 1).toString().padStart(4, '0');
    return `${prefixo}${numero}`;
  }

  /**
   * Chamar próxima senha
   */
  async chamarSenha(
    dto: ChamarSenhaDto,
    usuarioId: string,
  ): Promise<SenhaAtendimento> {
    const senha = await this.senhaRepository.findOne({
      where: { id: dto.senhaId },
      relations: ['paciente', 'unidade'],
    });

    if (!senha) {
      throw new NotFoundException('Senha não encontrada');
    }

    if (senha.status !== StatusSenha.AGUARDANDO) {
      throw new BadRequestException(
        'Esta senha não está aguardando atendimento',
      );
    }

    senha.status = StatusSenha.CHAMADO;
    senha.horaChamada = new Date();
    senha.usuarioAtendenteId = usuarioId;
    senha.mesa = dto.mesa || null;

    return await this.senhaRepository.save(senha);
  }

  /**
   * Iniciar atendimento de uma senha chamada
   */
  async iniciarAtendimento(
    senhaId: string,
    usuarioId: string,
  ): Promise<SenhaAtendimento> {
    const senha = await this.senhaRepository.findOne({
      where: { id: senhaId },
    });

    if (!senha) {
      throw new NotFoundException('Senha não encontrada');
    }

    if (senha.status !== StatusSenha.CHAMADO) {
      throw new BadRequestException('Esta senha não foi chamada ainda');
    }

    if (senha.usuarioAtendenteId !== usuarioId) {
      throw new BadRequestException(
        'Somente o atendente que chamou pode iniciar o atendimento',
      );
    }

    senha.status = StatusSenha.EM_ATENDIMENTO;
    senha.horaInicioAtendimento = new Date();

    return await this.senhaRepository.save(senha);
  }

  /**
   * Finalizar atendimento
   */
  async finalizarAtendimento(
    senhaId: string,
    usuarioId: string,
  ): Promise<SenhaAtendimento> {
    const senha = await this.senhaRepository.findOne({
      where: { id: senhaId },
    });

    if (!senha) {
      throw new NotFoundException('Senha não encontrada');
    }

    if (senha.status !== StatusSenha.EM_ATENDIMENTO) {
      throw new BadRequestException('Esta senha não está em atendimento');
    }

    if (senha.usuarioAtendenteId !== usuarioId) {
      throw new BadRequestException(
        'Somente o atendente que iniciou pode finalizar',
      );
    }

    senha.status = StatusSenha.FINALIZADO;
    senha.horaFimAtendimento = new Date();

    return await this.senhaRepository.save(senha);
  }

  /**
   * Marcar senha como desistência
   */
  async marcarDesistencia(senhaId: string): Promise<SenhaAtendimento> {
    const senha = await this.senhaRepository.findOne({
      where: { id: senhaId },
    });

    if (!senha) {
      throw new NotFoundException('Senha não encontrada');
    }

    if (
      senha.status === StatusSenha.FINALIZADO ||
      senha.status === StatusSenha.DESISTIU
    ) {
      throw new BadRequestException('Esta senha já foi finalizada ou desistiu');
    }

    senha.status = StatusSenha.DESISTIU;
    senha.horaFimAtendimento = new Date();

    return await this.senhaRepository.save(senha);
  }

  /**
   * Listar fila de atendimento (senhas aguardando)
   */
  async listarFila(filtro: FiltroFilaDto): Promise<{
    prioridades: SenhaAtendimento[];
    geral: SenhaAtendimento[];
    totalAguardando: number;
  }> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const where: any = {
      status: filtro.status || StatusSenha.AGUARDANDO,
      horaChegada: MoreThanOrEqual(hoje),
    };

    if (filtro.unidadeId) {
      where.unidadeId = filtro.unidadeId;
    }

    if (filtro.data) {
      const dataFiltro = new Date(filtro.data);
      dataFiltro.setHours(0, 0, 0, 0);
      const proximoDia = new Date(dataFiltro);
      proximoDia.setDate(proximoDia.getDate() + 1);
      where.horaChegada = Between(dataFiltro, proximoDia);
    }

    // Buscar senhas de prioridade
    const prioridades = await this.senhaRepository.find({
      where: { ...where, tipo: TipoSenha.PRIORIDADE },
      relations: ['paciente'],
      order: { horaChegada: 'ASC' },
    });

    // Buscar senhas gerais
    const geral = await this.senhaRepository.find({
      where: { ...where, tipo: TipoSenha.GERAL },
      relations: ['paciente'],
      order: { horaChegada: 'ASC' },
    });

    return {
      prioridades,
      geral,
      totalAguardando: prioridades.length + geral.length,
    };
  }

  /**
   * Buscar próxima senha a ser chamada (prioridade primeiro, depois geral)
   */
  async buscarProximaSenha(
    unidadeId: string,
  ): Promise<SenhaAtendimento | null> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Primeiro tentar prioridade
    let proxima = await this.senhaRepository.findOne({
      where: {
        unidadeId,
        tipo: TipoSenha.PRIORIDADE,
        status: StatusSenha.AGUARDANDO,
        horaChegada: MoreThanOrEqual(hoje),
      },
      relations: ['paciente'],
      order: { horaChegada: 'ASC' },
    });

    // Se não houver prioridade, buscar geral
    if (!proxima) {
      proxima = await this.senhaRepository.findOne({
        where: {
          unidadeId,
          tipo: TipoSenha.GERAL,
          status: StatusSenha.AGUARDANDO,
          horaChegada: MoreThanOrEqual(hoje),
        },
        relations: ['paciente'],
        order: { horaChegada: 'ASC' },
      });
    }

    return proxima;
  }

  /**
   * Buscar senha por ID
   */
  async buscarPorId(id: string): Promise<SenhaAtendimento> {
    const senha = await this.senhaRepository.findOne({
      where: { id },
      relations: ['paciente', 'unidade', 'usuarioAtendente'],
    });

    if (!senha) {
      throw new NotFoundException('Senha não encontrada');
    }

    return senha;
  }

  /**
   * Listar meus atendimentos do dia (finalizados pelo usuário)
   */
  async listarMeusAtendimentos(
    usuarioId: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: SenhaAtendimento[]; total: number }> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [data, total] = await this.senhaRepository.findAndCount({
      where: {
        usuarioAtendenteId: usuarioId,
        status: StatusSenha.FINALIZADO,
        horaChegada: MoreThanOrEqual(hoje),
      },
      relations: ['paciente', 'unidade'],
      order: { horaFimAtendimento: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  /**
   * Estatísticas da fila
   */
  async obterEstatisticas(unidadeId: string): Promise<{
    aguardando: { prioridade: number; geral: number };
    chamados: number;
    emAtendimento: number;
    finalizados: number;
    desistencias: number;
    tempoMedioEspera: number;
    tempoMedioAtendimento: number;
  }> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [
      aguardandoPrioridade,
      aguardandoGeral,
      chamados,
      emAtendimento,
      finalizados,
      desistencias,
    ] = await Promise.all([
      this.senhaRepository.count({
        where: {
          unidadeId,
          tipo: TipoSenha.PRIORIDADE,
          status: StatusSenha.AGUARDANDO,
          horaChegada: MoreThanOrEqual(hoje),
        },
      }),
      this.senhaRepository.count({
        where: {
          unidadeId,
          tipo: TipoSenha.GERAL,
          status: StatusSenha.AGUARDANDO,
          horaChegada: MoreThanOrEqual(hoje),
        },
      }),
      this.senhaRepository.count({
        where: {
          unidadeId,
          status: StatusSenha.CHAMADO,
          horaChegada: MoreThanOrEqual(hoje),
        },
      }),
      this.senhaRepository.count({
        where: {
          unidadeId,
          status: StatusSenha.EM_ATENDIMENTO,
          horaChegada: MoreThanOrEqual(hoje),
        },
      }),
      this.senhaRepository.count({
        where: {
          unidadeId,
          status: StatusSenha.FINALIZADO,
          horaChegada: MoreThanOrEqual(hoje),
        },
      }),
      this.senhaRepository.count({
        where: {
          unidadeId,
          status: StatusSenha.DESISTIU,
          horaChegada: MoreThanOrEqual(hoje),
        },
      }),
    ]);

    // Calcular tempo médio de espera (da chegada até ser chamado)
    const senhasComEspera = await this.senhaRepository.find({
      where: {
        unidadeId,
        horaChegada: MoreThanOrEqual(hoje),
      },
      select: ['horaChegada', 'horaChamada'],
    });

    let tempoTotalEspera = 0;
    let countEspera = 0;
    for (const s of senhasComEspera) {
      if (s.horaChamada) {
        const diff =
          new Date(s.horaChamada).getTime() - new Date(s.horaChegada).getTime();
        tempoTotalEspera += diff / 60000; // em minutos
        countEspera++;
      }
    }
    const tempoMedioEspera =
      countEspera > 0 ? Math.round(tempoTotalEspera / countEspera) : 0;

    // Calcular tempo médio de atendimento (do início até fim)
    const senhasComAtendimento = await this.senhaRepository.find({
      where: {
        unidadeId,
        status: StatusSenha.FINALIZADO,
        horaChegada: MoreThanOrEqual(hoje),
      },
      select: ['horaInicioAtendimento', 'horaFimAtendimento'],
    });

    let tempoTotalAtendimento = 0;
    let countAtendimento = 0;
    for (const s of senhasComAtendimento) {
      if (s.horaInicioAtendimento && s.horaFimAtendimento) {
        const diff =
          new Date(s.horaFimAtendimento).getTime() -
          new Date(s.horaInicioAtendimento).getTime();
        tempoTotalAtendimento += diff / 60000;
        countAtendimento++;
      }
    }
    const tempoMedioAtendimento =
      countAtendimento > 0
        ? Math.round(tempoTotalAtendimento / countAtendimento)
        : 0;

    return {
      aguardando: {
        prioridade: aguardandoPrioridade,
        geral: aguardandoGeral,
      },
      chamados,
      emAtendimento,
      finalizados,
      desistencias,
      tempoMedioEspera,
      tempoMedioAtendimento,
    };
  }
}
