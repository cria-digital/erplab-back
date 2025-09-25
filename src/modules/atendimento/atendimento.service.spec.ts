import { Test, TestingModule } from '@nestjs/testing';
import { AtendimentoService } from './services/atendimento.service';

describe('AtendimentoService', () => {
  let service: AtendimentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtendimentoService],
    }).compile();

    service = module.get<AtendimentoService>(AtendimentoService);
  });

  it('deveria estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('listarTodos', () => {
    it('deveria retornar informações sobre o módulo de atendimento', async () => {
      const result = await service.listarTodos();

      expect(result).toBeDefined();
      expect(result.message).toBe(
        'RF001-RF004: Módulo de Atendimento em desenvolvimento',
      );
      expect(result.funcionalidades).toHaveLength(4);
      expect(result.funcionalidades).toContain(
        'RF001 - Sistema de Contato Multi-canal',
      );
      expect(result.funcionalidades).toContain(
        'RF002 - Auto-atendimento com OCR',
      );
      expect(result.funcionalidades).toContain(
        'RF003 - Gestão de Fila de Atendimento',
      );
      expect(result.funcionalidades).toContain(
        'RF004 - Geração de Ordem de Serviço (OS)',
      );
      expect(result.status).toBe('em_desenvolvimento');
    });
  });

  describe('obterFila', () => {
    it('deveria retornar a fila de atendimento', async () => {
      const result = await service.obterFila();

      expect(result).toBeDefined();
      expect(result.fila).toBeDefined();
      expect(Array.isArray(result.fila)).toBe(true);
      expect(result.total_fila).toBe(2);
      expect(result.tempo_medio_espera).toBe('12 minutos');
    });

    it('deveria retornar pacientes com informações completas na fila', async () => {
      const result = await service.obterFila();
      const primeiroPaciente = result.fila[0];

      expect(primeiroPaciente.id).toBe(1);
      expect(primeiroPaciente.numero_senha).toBe('A001');
      expect(primeiroPaciente.paciente).toBe('João Silva');
      expect(primeiroPaciente.cpf).toBe('123.456.789-00');
      expect(primeiroPaciente.status).toBe('aguardando_atendimento');
      expect(primeiroPaciente.horario_chegada).toBeDefined();
      expect(primeiroPaciente.exames_solicitados).toContain('Hemograma');
      expect(primeiroPaciente.exames_solicitados).toContain('Glicemia');
    });

    it('deveria retornar paciente em atendimento', async () => {
      const result = await service.obterFila();
      const segundoPaciente = result.fila[1];

      expect(segundoPaciente.id).toBe(2);
      expect(segundoPaciente.numero_senha).toBe('A002');
      expect(segundoPaciente.paciente).toBe('Maria Santos');
      expect(segundoPaciente.cpf).toBe('987.654.321-00');
      expect(segundoPaciente.status).toBe('em_atendimento');
      expect(segundoPaciente.horario_chegada).toBeDefined();
      expect(segundoPaciente.exames_solicitados).toContain('Raio-X Tórax');
    });
  });

  describe('gerarOS', () => {
    it('deveria gerar uma OS com dados completos', async () => {
      const dados = {
        paciente: 'João da Silva',
        cpf: '123.456.789-00',
        exames: ['Hemograma', 'Glicemia'],
        valor_total: 250.0,
      };

      const result = await service.gerarOS(dados);

      expect(result).toBeDefined();
      expect(result.numero_os).toMatch(/^OS-\d+$/);
      expect(result.paciente).toBe('João da Silva');
      expect(result.cpf).toBe('123.456.789-00');
      expect(result.exames).toEqual(['Hemograma', 'Glicemia']);
      expect(result.valor_total).toBe(250.0);
      expect(result.data_criacao).toBeDefined();
      expect(result.protocolo_retirada).toMatch(/^PROT-[A-Z0-9]+$/);
      expect(result.status).toBe('criada');
      expect(result.message).toBe('OS gerada com sucesso - RF004 implementado');
    });

    it('deveria gerar uma OS com dados padrão quando não fornecidos', async () => {
      const dados = {};

      const result = await service.gerarOS(dados);

      expect(result).toBeDefined();
      expect(result.numero_os).toMatch(/^OS-\d+$/);
      expect(result.paciente).toBe('Paciente Teste');
      expect(result.cpf).toBe('000.000.000-00');
      expect(result.exames).toEqual(['Exame Teste']);
      expect(result.valor_total).toBe(150.0);
      expect(result.status).toBe('criada');
    });

    it('deveria gerar protocolos únicos', async () => {
      const result1 = await service.gerarOS({});
      // Pequeno delay para garantir timestamp diferente
      await new Promise((resolve) => setTimeout(resolve, 10));
      const result2 = await service.gerarOS({});

      expect(result1.protocolo_retirada).not.toBe(result2.protocolo_retirada);
      // OS usa timestamp então pode ser igual se executado muito rápido
      // Verificamos apenas o protocolo que usa random
    });
  });

  describe('processarOCR', () => {
    it('deveria processar OCR com sucesso', async () => {
      const result = await service.processarOCR();

      expect(result).toBeDefined();
      expect(result.status).toBe('processado');
      expect(result.message).toBe('RF002 - OCR processado com sucesso');
    });

    it('deveria extrair dados do paciente corretamente', async () => {
      const result = await service.processarOCR();

      expect(result.dados_extraidos).toBeDefined();
      expect(result.dados_extraidos.paciente_nome).toBe('João da Silva');
      expect(result.dados_extraidos.data_nascimento).toBe('1985-05-15');
      expect(result.dados_extraidos.medico_solicitante).toBe(
        'Dr. Carlos Medicina',
      );
    });

    it('deveria extrair lista de exames solicitados', async () => {
      const result = await service.processarOCR();

      expect(result.dados_extraidos.exames_solicitados).toBeDefined();
      expect(Array.isArray(result.dados_extraidos.exames_solicitados)).toBe(
        true,
      );
      expect(result.dados_extraidos.exames_solicitados).toHaveLength(3);
      expect(result.dados_extraidos.exames_solicitados).toContain(
        'Hemograma Completo',
      );
      expect(result.dados_extraidos.exames_solicitados).toContain(
        'Glicemia de Jejum',
      );
      expect(result.dados_extraidos.exames_solicitados).toContain(
        'Colesterol Total',
      );
    });

    it('deveria retornar métricas de confiança do OCR', async () => {
      const result = await service.processarOCR();

      expect(result.confianca_ocr).toBeDefined();
      expect(result.confianca_ocr).toBe(95.5);
      expect(result.necessita_validacao_manual).toBe(false);
    });
  });
});
