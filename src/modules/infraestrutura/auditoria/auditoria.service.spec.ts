import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuditoriaService } from './auditoria.service';
import {
  AuditoriaLog,
  TipoLog,
  NivelLog,
  OperacaoLog,
} from './entities/auditoria-log.entity';
import { CreateAuditoriaLogDto, FiltrosAuditoriaDto } from './dto';

describe('AuditoriaService', () => {
  let service: AuditoriaService;

  const mockAuditoriaLog = {
    id: 'log-uuid-1',
    tipoLog: TipoLog.ACESSO,
    usuarioId: 'user-uuid-1',
    dataHora: new Date(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    unidadeSaudeId: 'unidade-uuid-1',
    modulo: 'Pacientes',
    acao: 'Visualizar',
    entidade: null,
    entidadeId: null,
    operacao: null,
    dadosAlteracao: null,
    detalhes: 'Usuário acessou lista de pacientes',
    nivel: NivelLog.INFO,
    usuario: null,
    usuarioAlterou: null,
    unidadeSaude: null,
  } as AuditoriaLog;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
    delete: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriaService,
        {
          provide: getRepositoryToken(AuditoriaLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditoriaService>(AuditoriaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registrarLog', () => {
    const createAuditoriaLogDto: CreateAuditoriaLogDto = {
      tipoLog: TipoLog.ACESSO,
      usuarioId: 'user-uuid-1',
      modulo: 'Pacientes',
      acao: 'Visualizar',
      detalhes: 'Usuário visualizou lista',
      nivel: NivelLog.INFO,
    };

    it('deve registrar um log com sucesso', async () => {
      const logComData = {
        ...createAuditoriaLogDto,
        dataHora: expect.any(Date),
      };
      mockRepository.create.mockReturnValue(mockAuditoriaLog);
      mockRepository.save.mockResolvedValue(mockAuditoriaLog);

      const result = await service.registrarLog(createAuditoriaLogDto);

      expect(result).toEqual(mockAuditoriaLog);
      expect(mockRepository.create).toHaveBeenCalledWith(logComData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAuditoriaLog);
    });
  });

  describe('registrarAcesso', () => {
    it('deve registrar um log de acesso', async () => {
      mockRepository.create.mockReturnValue(mockAuditoriaLog);
      mockRepository.save.mockResolvedValue(mockAuditoriaLog);

      const result = await service.registrarAcesso(
        'user-uuid-1',
        'Visualizar',
        'Pacientes',
        'Detalhes do acesso',
        '192.168.1.1',
        'Mozilla/5.0',
      );

      expect(result).toEqual(mockAuditoriaLog);
      expect(mockRepository.create).toHaveBeenCalledWith({
        tipoLog: TipoLog.ACESSO,
        usuarioId: 'user-uuid-1',
        acao: 'Visualizar',
        modulo: 'Pacientes',
        detalhes: 'Detalhes do acesso',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        nivel: NivelLog.INFO,
        dataHora: expect.any(Date),
      });
    });
  });

  describe('registrarAlteracao', () => {
    it('deve registrar um log de alteração', async () => {
      const dadosAlteracao = {
        before: { nome: 'João' },
        after: { nome: 'João Silva' },
      };
      mockRepository.create.mockReturnValue(mockAuditoriaLog);
      mockRepository.save.mockResolvedValue(mockAuditoriaLog);

      const result = await service.registrarAlteracao(
        'user-uuid-1',
        'Paciente',
        'paciente-uuid-1',
        OperacaoLog.UPDATE,
        dadosAlteracao,
        'Pacientes',
      );

      expect(result).toEqual(mockAuditoriaLog);
      expect(mockRepository.create).toHaveBeenCalledWith({
        tipoLog: TipoLog.ALTERACAO,
        usuarioId: 'user-uuid-1',
        entidade: 'Paciente',
        entidadeId: 'paciente-uuid-1',
        operacao: OperacaoLog.UPDATE,
        dadosAlteracao,
        modulo: 'Pacientes',
        nivel: NivelLog.INFO,
        dataHora: expect.any(Date),
      });
    });
  });

  describe('registrarErro', () => {
    it('deve registrar um log de erro', async () => {
      mockRepository.create.mockReturnValue(mockAuditoriaLog);
      mockRepository.save.mockResolvedValue(mockAuditoriaLog);

      const result = await service.registrarErro(
        'user-uuid-1',
        'Erro de validação',
        'Pacientes',
        'CPF inválido',
        NivelLog.ERROR,
      );

      expect(result).toEqual(mockAuditoriaLog);
      expect(mockRepository.create).toHaveBeenCalledWith({
        tipoLog: TipoLog.ERRO,
        usuarioId: 'user-uuid-1',
        modulo: 'Pacientes',
        detalhes: 'Erro de validação - CPF inválido',
        nivel: NivelLog.ERROR,
        dataHora: expect.any(Date),
      });
    });

    it('deve registrar erro sem detalhes adicionais', async () => {
      mockRepository.create.mockReturnValue(mockAuditoriaLog);
      mockRepository.save.mockResolvedValue(mockAuditoriaLog);

      await service.registrarErro('user-uuid-1', 'Erro simples');

      expect(mockRepository.create).toHaveBeenCalledWith({
        tipoLog: TipoLog.ERRO,
        usuarioId: 'user-uuid-1',
        modulo: undefined,
        detalhes: 'Erro simples',
        nivel: NivelLog.ERROR,
        dataHora: expect.any(Date),
      });
    });
  });

  describe('registrarTentativaLogin', () => {
    it('deve registrar login bem-sucedido', async () => {
      mockRepository.create.mockReturnValue(mockAuditoriaLog);
      mockRepository.save.mockResolvedValue(mockAuditoriaLog);

      const result = await service.registrarTentativaLogin(
        'usuario@email.com',
        true,
        '192.168.1.1',
        'Mozilla/5.0',
        'user-uuid-1',
      );

      expect(result).toEqual(mockAuditoriaLog);
      expect(mockRepository.create).toHaveBeenCalledWith({
        tipoLog: TipoLog.ACESSO,
        usuarioId: 'user-uuid-1',
        operacao: OperacaoLog.LOGIN,
        detalhes: 'Login bem-sucedido',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        nivel: NivelLog.INFO,
        dataHora: expect.any(Date),
      });
    });

    it('deve registrar tentativa de login falhada', async () => {
      mockRepository.create.mockReturnValue(mockAuditoriaLog);
      mockRepository.save.mockResolvedValue(mockAuditoriaLog);

      const result = await service.registrarTentativaLogin(
        'usuario@email.com',
        false,
        '192.168.1.1',
        'Mozilla/5.0',
      );

      expect(result).toEqual(mockAuditoriaLog);
      expect(mockRepository.create).toHaveBeenCalledWith({
        tipoLog: TipoLog.ACESSO,
        usuarioId: '00000000-0000-0000-0000-000000000000',
        operacao: OperacaoLog.LOGIN_FALHA,
        detalhes: 'Tentativa de login falhou para: usuario@email.com',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        nivel: NivelLog.WARNING,
        dataHora: expect.any(Date),
      });
    });
  });

  describe('buscarLogs', () => {
    const filtros: FiltrosAuditoriaDto = {
      page: 1,
      limit: 10,
      tipoLog: TipoLog.ACESSO,
      usuarioId: 'user-uuid-1',
    };

    it('deve buscar logs com filtros', async () => {
      const logs = [mockAuditoriaLog];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([logs, 1]);

      const result = await service.buscarLogs(filtros);

      expect(result).toEqual({
        data: logs,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('log');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.tipoLog = :tipoLog',
        {
          tipoLog: TipoLog.ACESSO,
        },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.usuarioId = :usuarioId',
        {
          usuarioId: 'user-uuid-1',
        },
      );
    });

    it('deve aplicar filtros de data', async () => {
      const filtrosComData: FiltrosAuditoriaDto = {
        ...filtros,
        dataInicio: '2024-01-01',
        dataFim: '2024-01-31',
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.buscarLogs(filtrosComData);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.dataHora BETWEEN :dataInicio AND :dataFim',
        {
          dataInicio: new Date('2024-01-01'),
          dataFim: new Date('2024-01-31 23:59:59'),
        },
      );
    });

    it('deve aplicar apenas data início', async () => {
      const filtrosComDataInicio: FiltrosAuditoriaDto = {
        ...filtros,
        dataInicio: '2024-01-01',
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.buscarLogs(filtrosComDataInicio);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.dataHora >= :dataInicio',
        {
          dataInicio: new Date('2024-01-01'),
        },
      );
    });

    it('deve aplicar paginação corretamente', async () => {
      const filtrosPagina2: FiltrosAuditoriaDto = {
        page: 2,
        limit: 20,
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.buscarLogs(filtrosPagina2);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('buscarLogsPorUsuario', () => {
    it('deve buscar logs de um usuário específico', async () => {
      const logs = [mockAuditoriaLog];
      mockRepository.find.mockResolvedValue(logs);

      const result = await service.buscarLogsPorUsuario('user-uuid-1', 25);

      expect(result).toEqual(logs);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { usuarioId: 'user-uuid-1' },
        order: { dataHora: 'DESC' },
        take: 25,
        relations: ['unidadeSaude'],
      });
    });

    it('deve usar limite padrão quando não especificado', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.buscarLogsPorUsuario('user-uuid-1');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { usuarioId: 'user-uuid-1' },
        order: { dataHora: 'DESC' },
        take: 50,
        relations: ['unidadeSaude'],
      });
    });
  });

  describe('buscarLogsPorEntidade', () => {
    it('deve buscar logs de uma entidade específica', async () => {
      const logs = [mockAuditoriaLog];
      mockRepository.find.mockResolvedValue(logs);

      const result = await service.buscarLogsPorEntidade(
        'Paciente',
        'paciente-uuid-1',
      );

      expect(result).toEqual(logs);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { entidade: 'Paciente', entidadeId: 'paciente-uuid-1' },
        order: { dataHora: 'DESC' },
        relations: ['usuario', 'usuarioAlterou'],
      });
    });
  });

  describe('obterEstatisticas', () => {
    beforeEach(() => {
      // Mock para contadores
      mockRepository.count.mockResolvedValue(100);

      // Mock para queries agregadas - por tipo
      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce([
          { tipo: TipoLog.ACESSO, total: '50' },
          { tipo: TipoLog.ALTERACAO, total: '30' },
          { tipo: TipoLog.ERRO, total: '20' },
        ])
        // Mock para queries agregadas - por nível
        .mockResolvedValueOnce([
          { nivel: NivelLog.INFO, total: '70' },
          { nivel: NivelLog.WARNING, total: '20' },
          { nivel: NivelLog.ERROR, total: '10' },
        ])
        // Mock para queries agregadas - por operação
        .mockResolvedValueOnce([
          { operacao: OperacaoLog.INSERT, total: '40' },
          { operacao: OperacaoLog.UPDATE, total: '30' },
          { operacao: OperacaoLog.DELETE, total: '30' },
        ])
        // Mock para módulos mais acessados
        .mockResolvedValueOnce([
          { modulo: 'Pacientes', acessos: '30' },
          { modulo: 'Usuários', acessos: '20' },
        ]);

      mockQueryBuilder.getRawOne.mockResolvedValue({ total: '5' });
    });

    it('deve retornar estatísticas gerais', async () => {
      const result = await service.obterEstatisticas();

      expect(result).toEqual({
        totalLogs: 100,
        porTipo: {
          [TipoLog.ACESSO]: 50,
          [TipoLog.ALTERACAO]: 30,
          [TipoLog.ERRO]: 20,
        },
        porNivel: {
          [NivelLog.INFO]: 70,
          [NivelLog.WARNING]: 20,
          [NivelLog.ERROR]: 10,
        },
        porOperacao: {
          [OperacaoLog.INSERT]: 40,
          [OperacaoLog.UPDATE]: 30,
          [OperacaoLog.DELETE]: 30,
        },
        acessosHoje: 100,
        errosHoje: 100,
        usuariosAtivos: 5,
        modulosMaisAcessados: [
          { modulo: 'Pacientes', acessos: 30 },
          { modulo: 'Usuários', acessos: 20 },
        ],
      });

      expect(mockRepository.count).toHaveBeenCalledTimes(3); // total, acessos hoje, erros hoje
    });

    it('deve filtrar por unidade de saúde', async () => {
      await service.obterEstatisticas('unidade-uuid-1');

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { unidadeSaudeId: 'unidade-uuid-1' },
      });
    });
  });

  describe('limparLogsAntigos', () => {
    it('deve remover logs antigos', async () => {
      mockQueryBuilder.execute.mockResolvedValue({ affected: 50 });

      const result = await service.limparLogsAntigos(30);

      expect(result).toBe(50);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'dataHora < :dataLimite',
        { dataLimite: expect.any(Date) },
      );
    });

    it('deve usar 90 dias como padrão', async () => {
      mockQueryBuilder.execute.mockResolvedValue({ affected: 10 });

      const result = await service.limparLogsAntigos();

      expect(result).toBe(10);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'dataHora < :dataLimite',
        { dataLimite: expect.any(Date) },
      );
    });

    it('deve retornar 0 se nenhum log foi afetado', async () => {
      mockQueryBuilder.execute.mockResolvedValue({ affected: null });

      const result = await service.limparLogsAntigos(60);

      expect(result).toBe(0);
    });
  });
});
