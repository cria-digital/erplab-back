import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  AuditoriaLog,
  TipoLog,
  OperacaoLog,
  NivelLog,
} from './entities/auditoria-log.entity';
import { CreateAuditoriaLogDto, FiltrosAuditoriaDto } from './dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EstatisticasAuditoria {
  totalLogs: number;
  porTipo: Record<string, number>;
  porNivel: Record<string, number>;
  porOperacao: Record<string, number>;
  acessosHoje: number;
  errosHoje: number;
  usuariosAtivos: number;
  modulosMaisAcessados: Array<{ modulo: string; acessos: number }>;
}

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(AuditoriaLog)
    private readonly auditoriaRepository: Repository<AuditoriaLog>,
  ) {}

  /**
   * Registra um log de auditoria
   * @param createAuditoriaLogDto Dados do log
   * @returns Log criado
   */
  async registrarLog(
    createAuditoriaLogDto: CreateAuditoriaLogDto,
  ): Promise<AuditoriaLog> {
    const log = this.auditoriaRepository.create({
      ...createAuditoriaLogDto,
      dataHora: new Date(),
    });

    return await this.auditoriaRepository.save(log);
  }

  /**
   * Registra log de acesso
   * @param usuarioId ID do usuário
   * @param acao Ação realizada
   * @param modulo Módulo acessado
   * @param detalhes Detalhes adicionais
   * @param ipAddress IP do usuário
   * @param userAgent User Agent
   */
  async registrarAcesso(
    usuarioId: string,
    acao: string,
    modulo: string,
    detalhes?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditoriaLog> {
    return this.registrarLog({
      tipoLog: TipoLog.ACESSO,
      usuarioId,
      acao,
      modulo,
      detalhes,
      ipAddress,
      userAgent,
      nivel: NivelLog.INFO,
    });
  }

  /**
   * Registra log de alteração
   * @param usuarioId ID do usuário que fez a alteração
   * @param entidade Nome da entidade
   * @param entidadeId ID da entidade
   * @param operacao Tipo de operação
   * @param dadosAlteracao Dados antes e depois
   * @param modulo Módulo do sistema
   */
  async registrarAlteracao(
    usuarioId: string,
    entidade: string,
    entidadeId: string,
    operacao: OperacaoLog,
    dadosAlteracao?: any,
    modulo?: string,
  ): Promise<AuditoriaLog> {
    return this.registrarLog({
      tipoLog: TipoLog.ALTERACAO,
      usuarioId,
      entidade,
      entidadeId,
      operacao,
      dadosAlteracao,
      modulo,
      nivel: NivelLog.INFO,
    });
  }

  /**
   * Registra log de erro
   * @param usuarioId ID do usuário
   * @param erro Descrição do erro
   * @param modulo Módulo onde ocorreu
   * @param detalhes Detalhes adicionais
   * @param nivel Nível de severidade
   */
  async registrarErro(
    usuarioId: string,
    erro: string,
    modulo?: string,
    detalhes?: string,
    nivel: NivelLog = NivelLog.ERROR,
  ): Promise<AuditoriaLog> {
    return this.registrarLog({
      tipoLog: TipoLog.ERRO,
      usuarioId,
      modulo,
      detalhes: `${erro}${detalhes ? ' - ' + detalhes : ''}`,
      nivel,
    });
  }

  /**
   * Registra tentativa de login
   * @param email Email do usuário
   * @param sucesso Se o login foi bem-sucedido
   * @param ipAddress IP do usuário
   * @param userAgent User Agent
   * @param usuarioId ID do usuário (se login bem-sucedido)
   */
  async registrarTentativaLogin(
    email: string,
    sucesso: boolean,
    ipAddress?: string,
    userAgent?: string,
    usuarioId?: string,
  ): Promise<AuditoriaLog> {
    if (!sucesso) {
      // Para falhas, cria um log sem usuarioId válido
      return this.registrarLog({
        tipoLog: TipoLog.ACESSO,
        usuarioId: '00000000-0000-0000-0000-000000000000', // UUID nulo para falhas
        operacao: OperacaoLog.LOGIN_FALHA,
        detalhes: `Tentativa de login falhou para: ${email}`,
        ipAddress,
        userAgent,
        nivel: NivelLog.WARNING,
      });
    }

    return this.registrarLog({
      tipoLog: TipoLog.ACESSO,
      usuarioId,
      operacao: OperacaoLog.LOGIN,
      detalhes: `Login bem-sucedido`,
      ipAddress,
      userAgent,
      nivel: NivelLog.INFO,
    });
  }

  /**
   * Busca logs com filtros e paginação
   * @param filtros Filtros de busca
   * @returns Lista paginada de logs
   */
  async buscarLogs(
    filtros: FiltrosAuditoriaDto,
  ): Promise<PaginatedResult<AuditoriaLog>> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'dataHora',
      orderDirection = 'DESC',
      dataInicio,
      dataFim,
      ...whereFilters
    } = filtros;

    const skip = (page - 1) * limit;

    const query = this.auditoriaRepository.createQueryBuilder('log');

    // Aplicar filtros
    if (whereFilters.tipoLog) {
      query.andWhere('log.tipoLog = :tipoLog', {
        tipoLog: whereFilters.tipoLog,
      });
    }

    if (whereFilters.nivel) {
      query.andWhere('log.nivel = :nivel', { nivel: whereFilters.nivel });
    }

    if (whereFilters.operacao) {
      query.andWhere('log.operacao = :operacao', {
        operacao: whereFilters.operacao,
      });
    }

    if (whereFilters.usuarioId) {
      query.andWhere('log.usuarioId = :usuarioId', {
        usuarioId: whereFilters.usuarioId,
      });
    }

    if (whereFilters.unidadeSaudeId) {
      query.andWhere('log.unidadeSaudeId = :unidadeSaudeId', {
        unidadeSaudeId: whereFilters.unidadeSaudeId,
      });
    }

    if (whereFilters.modulo) {
      query.andWhere('log.modulo ILIKE :modulo', {
        modulo: `%${whereFilters.modulo}%`,
      });
    }

    if (whereFilters.entidade) {
      query.andWhere('log.entidade = :entidade', {
        entidade: whereFilters.entidade,
      });
    }

    if (whereFilters.entidadeId) {
      query.andWhere('log.entidadeId = :entidadeId', {
        entidadeId: whereFilters.entidadeId,
      });
    }

    if (whereFilters.ipAddress) {
      query.andWhere('log.ipAddress = :ipAddress', {
        ipAddress: whereFilters.ipAddress,
      });
    }

    // Filtro de datas
    if (dataInicio && dataFim) {
      query.andWhere('log.dataHora BETWEEN :dataInicio AND :dataFim', {
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim + ' 23:59:59'),
      });
    } else if (dataInicio) {
      query.andWhere('log.dataHora >= :dataInicio', {
        dataInicio: new Date(dataInicio),
      });
    } else if (dataFim) {
      query.andWhere('log.dataHora <= :dataFim', {
        dataFim: new Date(dataFim + ' 23:59:59'),
      });
    }

    // Incluir relações
    query.leftJoinAndSelect('log.usuario', 'usuario');
    query.leftJoinAndSelect('log.usuarioAlterou', 'usuarioAlterou');
    query.leftJoinAndSelect('log.unidadeSaude', 'unidadeSaude');

    // Ordenação e paginação
    query.orderBy(`log.${orderBy}`, orderDirection);
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca logs de um usuário específico
   * @param usuarioId ID do usuário
   * @param limit Limite de resultados
   * @returns Lista de logs
   */
  async buscarLogsPorUsuario(
    usuarioId: string,
    limit: number = 50,
  ): Promise<AuditoriaLog[]> {
    return await this.auditoriaRepository.find({
      where: { usuarioId },
      order: { dataHora: 'DESC' },
      take: limit,
      relations: ['unidadeSaude'],
    });
  }

  /**
   * Busca logs de uma entidade específica
   * @param entidade Nome da entidade
   * @param entidadeId ID da entidade
   * @returns Lista de logs
   */
  async buscarLogsPorEntidade(
    entidade: string,
    entidadeId: string,
  ): Promise<AuditoriaLog[]> {
    return await this.auditoriaRepository.find({
      where: { entidade, entidadeId },
      order: { dataHora: 'DESC' },
      relations: ['usuario', 'usuarioAlterou'],
    });
  }

  /**
   * Retorna estatísticas de auditoria
   * @param unidadeSaudeId ID da unidade (opcional)
   * @returns Estatísticas
   */
  async obterEstatisticas(
    unidadeSaudeId?: string,
  ): Promise<EstatisticasAuditoria> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const whereConditions: any = {};
    if (unidadeSaudeId) {
      whereConditions.unidadeSaudeId = unidadeSaudeId;
    }

    // Total de logs
    const totalLogs = await this.auditoriaRepository.count({
      where: whereConditions,
    });

    // Logs por tipo
    const porTipo = await this.auditoriaRepository
      .createQueryBuilder('log')
      .select('log.tipoLog', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .where(unidadeSaudeId ? 'log.unidadeSaudeId = :unidadeSaudeId' : '1=1', {
        unidadeSaudeId,
      })
      .groupBy('log.tipoLog')
      .getRawMany();

    // Logs por nível
    const porNivel = await this.auditoriaRepository
      .createQueryBuilder('log')
      .select('log.nivel', 'nivel')
      .addSelect('COUNT(*)', 'total')
      .where(unidadeSaudeId ? 'log.unidadeSaudeId = :unidadeSaudeId' : '1=1', {
        unidadeSaudeId,
      })
      .groupBy('log.nivel')
      .getRawMany();

    // Logs por operação
    const porOperacao = await this.auditoriaRepository
      .createQueryBuilder('log')
      .select('log.operacao', 'operacao')
      .addSelect('COUNT(*)', 'total')
      .where('log.operacao IS NOT NULL')
      .andWhere(
        unidadeSaudeId ? 'log.unidadeSaudeId = :unidadeSaudeId' : '1=1',
        {
          unidadeSaudeId,
        },
      )
      .groupBy('log.operacao')
      .getRawMany();

    // Acessos hoje
    const acessosHoje = await this.auditoriaRepository.count({
      where: {
        ...whereConditions,
        tipoLog: TipoLog.ACESSO,
        dataHora: Between(hoje, new Date()),
      },
    });

    // Erros hoje
    const errosHoje = await this.auditoriaRepository.count({
      where: {
        ...whereConditions,
        tipoLog: TipoLog.ERRO,
        dataHora: Between(hoje, new Date()),
      },
    });

    // Usuários ativos hoje
    const usuariosAtivosQuery = this.auditoriaRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.usuarioId)', 'total')
      .where('log.dataHora >= :hoje', { hoje });

    if (unidadeSaudeId) {
      usuariosAtivosQuery.andWhere('log.unidadeSaudeId = :unidadeSaudeId', {
        unidadeSaudeId,
      });
    }

    const usuariosAtivosResult = await usuariosAtivosQuery.getRawOne();
    const usuariosAtivos = parseInt(usuariosAtivosResult.total) || 0;

    // Módulos mais acessados
    const modulosMaisAcessados = await this.auditoriaRepository
      .createQueryBuilder('log')
      .select('log.modulo', 'modulo')
      .addSelect('COUNT(*)', 'acessos')
      .where('log.modulo IS NOT NULL')
      .andWhere('log.tipoLog = :tipo', { tipo: TipoLog.ACESSO })
      .andWhere(
        unidadeSaudeId ? 'log.unidadeSaudeId = :unidadeSaudeId' : '1=1',
        {
          unidadeSaudeId,
        },
      )
      .groupBy('log.modulo')
      .orderBy('acessos', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalLogs,
      porTipo: porTipo.reduce((acc, curr) => {
        acc[curr.tipo] = parseInt(curr.total);
        return acc;
      }, {}),
      porNivel: porNivel.reduce((acc, curr) => {
        acc[curr.nivel] = parseInt(curr.total);
        return acc;
      }, {}),
      porOperacao: porOperacao.reduce((acc, curr) => {
        acc[curr.operacao] = parseInt(curr.total);
        return acc;
      }, {}),
      acessosHoje,
      errosHoje,
      usuariosAtivos,
      modulosMaisAcessados: modulosMaisAcessados.map((m) => ({
        modulo: m.modulo,
        acessos: parseInt(m.acessos),
      })),
    };
  }

  /**
   * Limpa logs antigos
   * @param diasRetencao Número de dias para manter os logs
   * @returns Número de logs removidos
   */
  async limparLogsAntigos(diasRetencao: number = 90): Promise<number> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasRetencao);

    const resultado = await this.auditoriaRepository
      .createQueryBuilder()
      .delete()
      .where('dataHora < :dataLimite', { dataLimite })
      .execute();

    return resultado.affected || 0;
  }
}
