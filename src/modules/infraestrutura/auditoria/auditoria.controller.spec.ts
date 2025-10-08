import { Test, TestingModule } from '@nestjs/testing';

import { AuditoriaController } from './auditoria.controller';
import { AuditoriaService } from './auditoria.service';
import { CreateAuditoriaLogDto, FiltrosAuditoriaDto } from './dto';
import {
  AuditoriaLog,
  TipoLog,
  NivelLog,
  OperacaoLog,
} from './entities/auditoria-log.entity';

describe('AuditoriaController', () => {
  let controller: AuditoriaController;
  let service: AuditoriaService;

  const mockAuditoriaService = {
    registrarLog: jest.fn(),
    buscarLogs: jest.fn(),
    buscarLogsPorUsuario: jest.fn(),
    buscarLogsPorEntidade: jest.fn(),
    obterEstatisticas: jest.fn(),
    registrarAcesso: jest.fn(),
    registrarErro: jest.fn(),
  };

  const mockUser = {
    id: 'user-uuid-1',
    empresa_id: 1,
    unidade_id: 'unidade-uuid-1',
  };

  const mockRequest = {
    user: mockUser,
    ip: '192.168.1.1',
    headers: {
      'user-agent': 'Mozilla/5.0',
    },
  } as any;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriaController],
      providers: [
        {
          provide: AuditoriaService,
          useValue: mockAuditoriaService,
        },
      ],
    }).compile();

    controller = module.get<AuditoriaController>(AuditoriaController);
    service = module.get<AuditoriaService>(AuditoriaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      mockAuditoriaService.registrarLog.mockResolvedValue(mockAuditoriaLog);

      const result = await controller.registrarLog(
        createAuditoriaLogDto,
        mockRequest,
      );

      expect(result).toEqual({
        message: 'Log registrado com sucesso',
        data: mockAuditoriaLog,
      });
      expect(service.registrarLog).toHaveBeenCalledWith(createAuditoriaLogDto);
    });

    it('deve adicionar informações da requisição quando não fornecidas', async () => {
      const dtoSemInfo = { ...createAuditoriaLogDto };
      delete dtoSemInfo.usuarioId;

      mockAuditoriaService.registrarLog.mockResolvedValue(mockAuditoriaLog);

      await controller.registrarLog(dtoSemInfo, mockRequest);

      expect(dtoSemInfo.ipAddress).toBe('192.168.1.1');
      expect(dtoSemInfo.userAgent).toBe('Mozilla/5.0');
      expect(dtoSemInfo.usuarioId).toBe('user-uuid-1');
    });

    it('deve manter informações já fornecidas no DTO', async () => {
      const dtoComInfo = {
        ...createAuditoriaLogDto,
        ipAddress: '10.0.0.1',
        userAgent: 'Custom Agent',
        usuarioId: 'outro-usuario',
      };

      mockAuditoriaService.registrarLog.mockResolvedValue(mockAuditoriaLog);

      await controller.registrarLog(dtoComInfo, mockRequest);

      expect(dtoComInfo.ipAddress).toBe('10.0.0.1');
      expect(dtoComInfo.userAgent).toBe('Custom Agent');
      expect(dtoComInfo.usuarioId).toBe('outro-usuario');
    });
  });

  describe('buscarLogs', () => {
    const filtros: FiltrosAuditoriaDto = {
      page: 1,
      limit: 10,
      tipoLog: TipoLog.ACESSO,
    };

    const paginatedResult = {
      data: [mockAuditoriaLog],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it('deve buscar logs com filtros', async () => {
      mockAuditoriaService.buscarLogs.mockResolvedValue(paginatedResult);

      const result = await controller.buscarLogs(filtros, mockRequest);

      expect(result).toEqual(paginatedResult);
      expect(service.buscarLogs).toHaveBeenCalledWith({
        ...filtros,
        unidadeSaudeId: 'unidade-uuid-1',
      });
    });

    it('deve buscar logs sem adicionar filtro de unidade quando usuário não tem unidade', async () => {
      const requestSemUnidade = {
        ...mockRequest,
        user: { ...mockUser, unidade_id: undefined },
      };

      mockAuditoriaService.buscarLogs.mockResolvedValue(paginatedResult);

      await controller.buscarLogs(filtros, requestSemUnidade);

      expect(service.buscarLogs).toHaveBeenCalledWith(filtros);
    });

    it('deve sobrescrever filtro de unidade quando presente no request', async () => {
      const filtrosComUnidade = {
        ...filtros,
        unidadeSaudeId: 'outra-unidade',
      };

      mockAuditoriaService.buscarLogs.mockResolvedValue(paginatedResult);

      await controller.buscarLogs(filtrosComUnidade, mockRequest);

      expect(service.buscarLogs).toHaveBeenCalledWith({
        ...filtrosComUnidade,
        unidadeSaudeId: 'unidade-uuid-1',
      });
    });
  });

  describe('buscarLogsPorUsuario', () => {
    it('deve buscar logs por usuário com limite padrão', async () => {
      const logs = [mockAuditoriaLog];
      mockAuditoriaService.buscarLogsPorUsuario.mockResolvedValue(logs);

      const result = await controller.buscarLogsPorUsuario('user-uuid-1');

      expect(result).toEqual(logs);
      expect(service.buscarLogsPorUsuario).toHaveBeenCalledWith(
        'user-uuid-1',
        50,
      );
    });

    it('deve buscar logs por usuário com limite personalizado', async () => {
      const logs = [mockAuditoriaLog];
      mockAuditoriaService.buscarLogsPorUsuario.mockResolvedValue(logs);

      const result = await controller.buscarLogsPorUsuario('user-uuid-1', 25);

      expect(result).toEqual(logs);
      expect(service.buscarLogsPorUsuario).toHaveBeenCalledWith(
        'user-uuid-1',
        25,
      );
    });

    it('deve usar limite padrão quando limit for 0', async () => {
      const logs = [mockAuditoriaLog];
      mockAuditoriaService.buscarLogsPorUsuario.mockResolvedValue(logs);

      const result = await controller.buscarLogsPorUsuario('user-uuid-1', 0);

      expect(result).toEqual(logs);
      expect(service.buscarLogsPorUsuario).toHaveBeenCalledWith(
        'user-uuid-1',
        50,
      );
    });
  });

  describe('buscarLogsPorEntidade', () => {
    it('deve buscar logs por entidade', async () => {
      const logs = [mockAuditoriaLog];
      mockAuditoriaService.buscarLogsPorEntidade.mockResolvedValue(logs);

      const result = await controller.buscarLogsPorEntidade(
        'Paciente',
        'paciente-uuid-1',
      );

      expect(result).toEqual(logs);
      expect(service.buscarLogsPorEntidade).toHaveBeenCalledWith(
        'Paciente',
        'paciente-uuid-1',
      );
    });
  });

  describe('obterEstatisticas', () => {
    const estatisticas = {
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
      acessosHoje: 25,
      errosHoje: 5,
      usuariosAtivos: 10,
      modulosMaisAcessados: [
        { modulo: 'Pacientes', acessos: 30 },
        { modulo: 'Usuários', acessos: 20 },
      ],
    };

    it('deve obter estatísticas com filtro de unidade', async () => {
      mockAuditoriaService.obterEstatisticas.mockResolvedValue(estatisticas);

      const result = await controller.obterEstatisticas(mockRequest);

      expect(result).toEqual(estatisticas);
      expect(service.obterEstatisticas).toHaveBeenCalledWith('unidade-uuid-1');
    });

    it('deve obter estatísticas sem filtro quando usuário não tem unidade', async () => {
      const requestSemUnidade = {
        ...mockRequest,
        user: { ...mockUser, unidade_id: undefined },
      };

      mockAuditoriaService.obterEstatisticas.mockResolvedValue(estatisticas);

      const result = await controller.obterEstatisticas(requestSemUnidade);

      expect(result).toEqual(estatisticas);
      expect(service.obterEstatisticas).toHaveBeenCalledWith(undefined);
    });
  });

  describe('registrarAcesso', () => {
    const bodyAcesso = {
      acao: 'Visualizar Lista',
      modulo: 'Pacientes',
      detalhes: 'Lista filtrada por status ativo',
    };

    it('deve registrar acesso com sucesso', async () => {
      mockAuditoriaService.registrarAcesso.mockResolvedValue(mockAuditoriaLog);

      const result = await controller.registrarAcesso(bodyAcesso, mockRequest);

      expect(result).toEqual({
        message: 'Acesso registrado com sucesso',
        data: mockAuditoriaLog,
      });
      expect(service.registrarAcesso).toHaveBeenCalledWith(
        'user-uuid-1',
        'Visualizar Lista',
        'Pacientes',
        'Lista filtrada por status ativo',
        '192.168.1.1',
        'Mozilla/5.0',
      );
    });

    it('deve registrar acesso sem detalhes', async () => {
      const bodySemDetalhes = {
        acao: 'Login',
        modulo: 'Auth',
      };

      mockAuditoriaService.registrarAcesso.mockResolvedValue(mockAuditoriaLog);

      const result = await controller.registrarAcesso(
        bodySemDetalhes,
        mockRequest,
      );

      expect(result).toEqual({
        message: 'Acesso registrado com sucesso',
        data: mockAuditoriaLog,
      });
      expect(service.registrarAcesso).toHaveBeenCalledWith(
        'user-uuid-1',
        'Login',
        'Auth',
        undefined,
        '192.168.1.1',
        'Mozilla/5.0',
      );
    });

    it('deve registrar acesso com user-agent undefined', async () => {
      const requestSemUserAgent = {
        ...mockRequest,
        headers: {},
      };

      mockAuditoriaService.registrarAcesso.mockResolvedValue(mockAuditoriaLog);

      await controller.registrarAcesso(bodyAcesso, requestSemUserAgent);

      expect(service.registrarAcesso).toHaveBeenCalledWith(
        'user-uuid-1',
        'Visualizar Lista',
        'Pacientes',
        'Lista filtrada por status ativo',
        '192.168.1.1',
        undefined,
      );
    });
  });

  describe('registrarErro', () => {
    const bodyErro = {
      erro: 'Falha ao processar pagamento',
      modulo: 'Financeiro',
      detalhes: 'Gateway de pagamento indisponível',
    };

    it('deve registrar erro com sucesso', async () => {
      mockAuditoriaService.registrarErro.mockResolvedValue(mockAuditoriaLog);

      const result = await controller.registrarErro(bodyErro, mockRequest);

      expect(result).toEqual({
        message: 'Erro registrado com sucesso',
        data: mockAuditoriaLog,
      });
      expect(service.registrarErro).toHaveBeenCalledWith(
        'user-uuid-1',
        'Falha ao processar pagamento',
        'Financeiro',
        'Gateway de pagamento indisponível',
      );
    });

    it('deve registrar erro sem módulo e detalhes', async () => {
      const bodySimples = {
        erro: 'Erro genérico',
      };

      mockAuditoriaService.registrarErro.mockResolvedValue(mockAuditoriaLog);

      const result = await controller.registrarErro(bodySimples, mockRequest);

      expect(result).toEqual({
        message: 'Erro registrado com sucesso',
        data: mockAuditoriaLog,
      });
      expect(service.registrarErro).toHaveBeenCalledWith(
        'user-uuid-1',
        'Erro genérico',
        undefined,
        undefined,
      );
    });

    it('deve registrar erro apenas com módulo', async () => {
      const bodyComModulo = {
        erro: 'Falha na validação',
        modulo: 'Pacientes',
      };

      mockAuditoriaService.registrarErro.mockResolvedValue(mockAuditoriaLog);

      const result = await controller.registrarErro(bodyComModulo, mockRequest);

      expect(result).toEqual({
        message: 'Erro registrado com sucesso',
        data: mockAuditoriaLog,
      });
      expect(service.registrarErro).toHaveBeenCalledWith(
        'user-uuid-1',
        'Falha na validação',
        'Pacientes',
        undefined,
      );
    });
  });
});
