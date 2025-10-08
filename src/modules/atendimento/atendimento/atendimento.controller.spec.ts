import { Test, TestingModule } from '@nestjs/testing';
import { AtendimentoController } from './controllers/atendimento.controller';
import { AtendimentoService } from './services/atendimento.service';

describe('AtendimentoController', () => {
  let controller: AtendimentoController;
  let service: AtendimentoService;

  const mockAtendimentoService = {
    listarTodos: jest.fn(),
    obterFila: jest.fn(),
    gerarOS: jest.fn(),
    processarOCR: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtendimentoController],
      providers: [
        {
          provide: AtendimentoService,
          useValue: mockAtendimentoService,
        },
      ],
    }).compile();

    controller = module.get<AtendimentoController>(AtendimentoController);
    service = module.get<AtendimentoService>(AtendimentoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('listarAtendimentos', () => {
    it('deveria retornar lista de atendimentos', async () => {
      const mockResult = {
        message: 'RF001-RF004: Módulo de Atendimento em desenvolvimento',
        funcionalidades: [
          'RF001 - Sistema de Contato Multi-canal',
          'RF002 - Auto-atendimento com OCR',
          'RF003 - Gestão de Fila de Atendimento',
          'RF004 - Geração de Ordem de Serviço (OS)',
        ],
        status: 'em_desenvolvimento',
      };

      mockAtendimentoService.listarTodos.mockResolvedValue(mockResult);

      const result = await controller.listarAtendimentos();

      expect(result).toEqual(mockResult);
      expect(service.listarTodos).toHaveBeenCalled();
      expect(service.listarTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('obterFilaAtendimento', () => {
    it('deveria retornar a fila de atendimento', async () => {
      const mockFila = {
        fila: [
          {
            id: 1,
            numero_senha: 'A001',
            paciente: 'João Silva',
            cpf: '123.456.789-00',
            status: 'aguardando_atendimento',
            horario_chegada: new Date(),
            exames_solicitados: ['Hemograma', 'Glicemia'],
          },
          {
            id: 2,
            numero_senha: 'A002',
            paciente: 'Maria Santos',
            cpf: '987.654.321-00',
            status: 'em_atendimento',
            horario_chegada: new Date(),
            exames_solicitados: ['Raio-X Tórax'],
          },
        ],
        total_fila: 2,
        tempo_medio_espera: '12 minutos',
      };

      mockAtendimentoService.obterFila.mockResolvedValue(mockFila);

      const result = await controller.obterFilaAtendimento();

      expect(result).toEqual(mockFila);
      expect(service.obterFila).toHaveBeenCalled();
      expect(service.obterFila).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar fila vazia quando não houver pacientes', async () => {
      const mockFilaVazia = {
        fila: [],
        total_fila: 0,
        tempo_medio_espera: '0 minutos',
      };

      mockAtendimentoService.obterFila.mockResolvedValue(mockFilaVazia);

      const result = await controller.obterFilaAtendimento();

      expect(result).toEqual(mockFilaVazia);
      expect(result.fila).toHaveLength(0);
      expect(result.total_fila).toBe(0);
    });
  });

  describe('gerarOrdemServico', () => {
    it('deveria gerar uma ordem de serviço com dados completos', async () => {
      const dadosOS = {
        paciente: 'João da Silva',
        cpf: '123.456.789-00',
        exames: ['Hemograma', 'Glicemia'],
        valor_total: 250.0,
      };

      const mockOS = {
        numero_os: 'OS-123456789',
        paciente: 'João da Silva',
        cpf: '123.456.789-00',
        exames: ['Hemograma', 'Glicemia'],
        valor_total: 250.0,
        data_criacao: new Date(),
        protocolo_retirada: 'PROT-ABC123',
        status: 'criada',
        message: 'OS gerada com sucesso - RF004 implementado',
      };

      mockAtendimentoService.gerarOS.mockResolvedValue(mockOS);

      const result = await controller.gerarOrdemServico(dadosOS);

      expect(result).toEqual(mockOS);
      expect(service.gerarOS).toHaveBeenCalledWith(dadosOS);
      expect(service.gerarOS).toHaveBeenCalledTimes(1);
    });

    it('deveria gerar OS com dados vazios', async () => {
      const dadosVazios = {};

      const mockOSPadrao = {
        numero_os: 'OS-987654321',
        paciente: 'Paciente Teste',
        cpf: '000.000.000-00',
        exames: ['Exame Teste'],
        valor_total: 150.0,
        data_criacao: new Date(),
        protocolo_retirada: 'PROT-XYZ789',
        status: 'criada',
        message: 'OS gerada com sucesso - RF004 implementado',
      };

      mockAtendimentoService.gerarOS.mockResolvedValue(mockOSPadrao);

      const result = await controller.gerarOrdemServico(dadosVazios);

      expect(result).toEqual(mockOSPadrao);
      expect(service.gerarOS).toHaveBeenCalledWith(dadosVazios);
    });

    it('deveria tratar erro ao gerar OS', async () => {
      const dadosOS = { paciente: 'Teste' };
      const erro = new Error('Erro ao gerar OS');

      mockAtendimentoService.gerarOS.mockRejectedValue(erro);

      await expect(controller.gerarOrdemServico(dadosOS)).rejects.toThrow(
        'Erro ao gerar OS',
      );
      expect(service.gerarOS).toHaveBeenCalledWith(dadosOS);
    });
  });

  describe('processarPedidoOCR', () => {
    it('deveria processar pedido médico com OCR', async () => {
      const mockOCR = {
        status: 'processado',
        dados_extraidos: {
          paciente_nome: 'João da Silva',
          data_nascimento: '1985-05-15',
          medico_solicitante: 'Dr. Carlos Medicina',
          exames_solicitados: [
            'Hemograma Completo',
            'Glicemia de Jejum',
            'Colesterol Total',
          ],
        },
        confianca_ocr: 95.5,
        necessita_validacao_manual: false,
        message: 'RF002 - OCR processado com sucesso',
      };

      mockAtendimentoService.processarOCR.mockResolvedValue(mockOCR);

      const result = await controller.processarPedidoOCR();

      expect(result).toEqual(mockOCR);
      expect(service.processarOCR).toHaveBeenCalled();
      expect(service.processarOCR).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar resultado com baixa confiança', async () => {
      const mockOCRBaixaConfianca = {
        status: 'processado',
        dados_extraidos: {
          paciente_nome: 'Nome Ilegível',
          data_nascimento: null,
          medico_solicitante: 'Médico Desconhecido',
          exames_solicitados: [],
        },
        confianca_ocr: 45.0,
        necessita_validacao_manual: true,
        message: 'RF002 - OCR processado mas requer validação',
      };

      mockAtendimentoService.processarOCR.mockResolvedValue(
        mockOCRBaixaConfianca,
      );

      const result = await controller.processarPedidoOCR();

      expect(result).toEqual(mockOCRBaixaConfianca);
      expect(result.necessita_validacao_manual).toBe(true);
      expect(result.confianca_ocr).toBeLessThan(50);
    });

    it('deveria tratar erro no processamento OCR', async () => {
      const erro = new Error('Erro ao processar imagem');

      mockAtendimentoService.processarOCR.mockRejectedValue(erro);

      await expect(controller.processarPedidoOCR()).rejects.toThrow(
        'Erro ao processar imagem',
      );
      expect(service.processarOCR).toHaveBeenCalled();
    });
  });
});
