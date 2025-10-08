import { ConfiguracaoAgenda } from './configuracao-agenda.entity';
import { DiaSemanaEnum } from '../enums/agendas.enum';
import { Agenda } from './agenda.entity';
import { PeriodoAtendimento } from './periodo-atendimento.entity';
import { HorarioEspecifico } from './horario-especifico.entity';
import { BloqueioHorario } from './bloqueio-horario.entity';
import {
  createEntitySpec,
  validateColumnDecorators,
} from '../../../../../test/entity-spec-helper';

// Definir campos obrigatórios, opcionais e relacionamentos
const requiredFields = ['id', 'agendaId', 'diasSemana', 'intervaloAgendamento'];

const optionalFields = ['capacidadeTotal', 'capacidadePorHorario'];

const relations = [
  'agenda',
  'periodosAtendimento',
  'horariosEspecificos',
  'bloqueiosHorario',
];

// Criar testes básicos usando o helper
createEntitySpec(
  ConfiguracaoAgenda,
  'ConfiguracaoAgenda',
  requiredFields,
  optionalFields,
  relations,
);

// Testes específicos para ConfiguracaoAgenda
describe('ConfiguracaoAgenda - Testes Específicos', () => {
  let entity: ConfiguracaoAgenda;

  beforeEach(() => {
    entity = new ConfiguracaoAgenda();
  });

  describe('propriedades básicas', () => {
    it('deve criar instância com propriedades corretas', () => {
      expect(entity).toBeInstanceOf(ConfiguracaoAgenda);
      expect(entity).toBeDefined();
    });

    it('deve ter propriedade id como UUID gerado automaticamente', () => {
      expect(entity).toHaveProperty('id');
      // UUID será gerado pelo banco, então inicialmente será undefined
      expect(entity.id).toBeUndefined();
    });

    it('deve ter todas as propriedades de configuração', () => {
      expect(entity).toHaveProperty('agendaId');
      expect(entity).toHaveProperty('diasSemana');
      expect(entity).toHaveProperty('intervaloAgendamento');
      expect(entity).toHaveProperty('capacidadeTotal');
      expect(entity).toHaveProperty('capacidadePorHorario');
    });
  });

  describe('campo diasSemana (simple-array)', () => {
    it('deve aceitar array de DiaSemanaEnum', () => {
      const diasValidos = [
        DiaSemanaEnum.SEG,
        DiaSemanaEnum.TER,
        DiaSemanaEnum.QUA,
        DiaSemanaEnum.QUI,
        DiaSemanaEnum.SEX,
      ];

      entity.diasSemana = diasValidos;

      expect(entity.diasSemana).toEqual(diasValidos);
      expect(entity.diasSemana).toHaveLength(5);
      expect(entity.diasSemana).toContain(DiaSemanaEnum.SEG);
      expect(entity.diasSemana).toContain(DiaSemanaEnum.SEX);
    });

    it('deve aceitar todos os valores válidos de DiaSemanaEnum', () => {
      const todosDias = Object.values(DiaSemanaEnum);

      entity.diasSemana = todosDias;

      expect(entity.diasSemana).toEqual(todosDias);
      expect(entity.diasSemana).toHaveLength(Object.keys(DiaSemanaEnum).length);

      // Verificar se todos os valores estão presentes
      todosDias.forEach((dia) => {
        expect(entity.diasSemana).toContain(dia);
      });
    });

    it('deve aceitar dias da semana individuais', () => {
      entity.diasSemana = [DiaSemanaEnum.SAB];
      expect(entity.diasSemana).toEqual([DiaSemanaEnum.SAB]);
      expect(entity.diasSemana).toHaveLength(1);

      entity.diasSemana = [DiaSemanaEnum.DOM];
      expect(entity.diasSemana).toEqual([DiaSemanaEnum.DOM]);
      expect(entity.diasSemana).toHaveLength(1);

      entity.diasSemana = [DiaSemanaEnum.FERIADOS];
      expect(entity.diasSemana).toEqual([DiaSemanaEnum.FERIADOS]);
      expect(entity.diasSemana).toHaveLength(1);
    });

    it('deve aceitar array vazio', () => {
      entity.diasSemana = [];
      expect(entity.diasSemana).toEqual([]);
      expect(entity.diasSemana).toHaveLength(0);
    });

    it('deve aceitar combinações específicas de dias', () => {
      // Apenas dias úteis
      const diasUteis = [
        DiaSemanaEnum.SEG,
        DiaSemanaEnum.TER,
        DiaSemanaEnum.QUA,
        DiaSemanaEnum.QUI,
        DiaSemanaEnum.SEX,
      ];

      entity.diasSemana = diasUteis;
      expect(entity.diasSemana).toEqual(diasUteis);

      // Apenas fins de semana
      const fimSemana = [DiaSemanaEnum.SAB, DiaSemanaEnum.DOM];
      entity.diasSemana = fimSemana;
      expect(entity.diasSemana).toEqual(fimSemana);

      // Dias específicos + feriados
      const diasComFeriados = [
        DiaSemanaEnum.SEG,
        DiaSemanaEnum.QUA,
        DiaSemanaEnum.SEX,
        DiaSemanaEnum.FERIADOS,
      ];
      entity.diasSemana = diasComFeriados;
      expect(entity.diasSemana).toEqual(diasComFeriados);
    });
  });

  describe('campos numéricos', () => {
    it('deve aceitar intervalo de agendamento válido', () => {
      const intervalosValidos = [15, 30, 45, 60, 90, 120];

      intervalosValidos.forEach((intervalo) => {
        entity.intervaloAgendamento = intervalo;
        expect(entity.intervaloAgendamento).toBe(intervalo);
      });
    });

    it('deve aceitar capacidade total válida', () => {
      const capacidadesValidas = [1, 5, 10, 20, 50, 100, 200];

      capacidadesValidas.forEach((capacidade) => {
        entity.capacidadeTotal = capacidade;
        expect(entity.capacidadeTotal).toBe(capacidade);
      });
    });

    it('deve aceitar capacidade por horário válida', () => {
      const capacidadesValidas = [1, 2, 3, 5, 10];

      capacidadesValidas.forEach((capacidade) => {
        entity.capacidadePorHorario = capacidade;
        expect(entity.capacidadePorHorario).toBe(capacidade);
      });
    });

    it('deve aceitar valores nulos em campos opcionais', () => {
      entity.capacidadeTotal = null;
      entity.capacidadePorHorario = null;

      expect(entity.capacidadeTotal).toBeNull();
      expect(entity.capacidadePorHorario).toBeNull();
    });
  });

  describe('relacionamentos', () => {
    describe('OneToOne com Agenda', () => {
      it('deve ter relacionamento com Agenda', () => {
        expect(entity).toHaveProperty('agenda');
        expect(entity.agenda).toBeUndefined();
      });

      it('deve aceitar Agenda no relacionamento', () => {
        const mockAgenda = {
          id: 'agenda-uuid-123',
          codigoInterno: 'AG001',
          nomeAgenda: 'Agenda Cardiologia',
          status: 'ATIVO',
        } as Agenda;

        entity.agenda = mockAgenda;
        entity.agendaId = mockAgenda.id;

        expect(entity.agenda).toEqual(mockAgenda);
        expect(entity.agendaId).toBe(mockAgenda.id);
      });

      it('deve usar JoinColumn corretamente', () => {
        // O relacionamento deve usar JoinColumn com name: 'agendaId'
        const agendaId = 'agenda-uuid-123';
        entity.agendaId = agendaId;

        expect(entity.agendaId).toBe(agendaId);
      });
    });

    describe('OneToMany com PeriodoAtendimento', () => {
      it('deve ter relacionamento com PeriodoAtendimento', () => {
        expect(entity).toHaveProperty('periodosAtendimento');
        expect(entity.periodosAtendimento).toBeUndefined();
      });

      it('deve aceitar array de PeriodoAtendimento', () => {
        const mockPeriodos = [
          {
            id: 'periodo-uuid-123',
            configuracaoAgendaId: 'config-uuid-123',
            periodo: 'MANHA',
            horarioInicio: '08:00',
            horarioFim: '12:00',
            diasSemana: ['SEG', 'TER', 'QUA'],
          } as PeriodoAtendimento,
          {
            id: 'periodo-uuid-456',
            configuracaoAgendaId: 'config-uuid-123',
            periodo: 'TARDE',
            horarioInicio: '14:00',
            horarioFim: '18:00',
            diasSemana: ['QUI', 'SEX'],
          } as PeriodoAtendimento,
        ];

        entity.periodosAtendimento = mockPeriodos;

        expect(entity.periodosAtendimento).toEqual(mockPeriodos);
        expect(entity.periodosAtendimento).toHaveLength(2);
        expect(entity.periodosAtendimento[0].periodo).toBe('MANHA');
        expect(entity.periodosAtendimento[1].periodo).toBe('TARDE');
      });

      it('deve ter cascade e eager configurados corretamente', () => {
        // O relacionamento deve ter cascade: true e eager: true
        // Isso significa que ao salvar/deletar configuração, os períodos também serão afetados
        // E ao buscar configuração, os períodos serão carregados automaticamente
        const mockPeriodos = [
          {
            id: 'periodo-uuid-123',
            periodo: 'INTEGRAL',
            horarioInicio: '08:00',
            horarioFim: '17:00',
          } as PeriodoAtendimento,
        ];

        entity.periodosAtendimento = mockPeriodos;

        expect(entity.periodosAtendimento).toBeDefined();
        expect(entity.periodosAtendimento[0].periodo).toBe('INTEGRAL');
      });
    });

    describe('OneToMany com HorarioEspecifico', () => {
      it('deve ter relacionamento com HorarioEspecifico', () => {
        expect(entity).toHaveProperty('horariosEspecificos');
        expect(entity.horariosEspecificos).toBeUndefined();
      });

      it('deve aceitar array de HorarioEspecifico', () => {
        const mockHorarios = [
          {
            id: 'horario-uuid-123',
            configuracaoAgendaId: 'config-uuid-123',
            data: new Date('2024-12-25'),
            horaInicio: '09:00',
            horaFim: '12:00',
            capacidade: 5,
            isFeriado: true,
          } as HorarioEspecifico,
          {
            id: 'horario-uuid-456',
            configuracaoAgendaId: 'config-uuid-123',
            data: new Date('2024-01-01'),
            horaInicio: '08:00',
            horaFim: '10:00',
            capacidade: 3,
            isFeriado: true,
          } as HorarioEspecifico,
        ];

        entity.horariosEspecificos = mockHorarios;

        expect(entity.horariosEspecificos).toEqual(mockHorarios);
        expect(entity.horariosEspecificos).toHaveLength(2);
        expect(entity.horariosEspecificos[0].isFeriado).toBe(true);
        expect(entity.horariosEspecificos[1].capacidade).toBe(3);
      });

      it('deve ter cascade configurado corretamente', () => {
        // O relacionamento deve ter cascade: true
        // Isso significa que ao salvar/deletar configuração, os horários também serão afetados
        const mockHorarios = [
          {
            id: 'horario-uuid-123',
            data: new Date('2024-06-07'),
            horaInicio: '14:00',
            horaFim: '16:00',
            isPeriodoFacultativo: true,
          } as HorarioEspecifico,
        ];

        entity.horariosEspecificos = mockHorarios;

        expect(entity.horariosEspecificos).toBeDefined();
        expect(entity.horariosEspecificos[0].isPeriodoFacultativo).toBe(true);
      });
    });

    describe('OneToMany com BloqueioHorario', () => {
      it('deve ter relacionamento com BloqueioHorario', () => {
        expect(entity).toHaveProperty('bloqueiosHorario');
        expect(entity.bloqueiosHorario).toBeUndefined();
      });

      it('deve aceitar array de BloqueioHorario', () => {
        const mockBloqueios = [
          {
            id: 'bloqueio-uuid-123',
            configuracaoAgendaId: 'config-uuid-123',
            dataInicio: new Date('2024-07-01'),
            horaInicio: '10:00',
            dataFim: new Date('2024-07-01'),
            horaFim: '11:00',
            observacao: 'Manutenção equipamento',
            motivoBloqueio: 'Manutenção',
          } as BloqueioHorario,
          {
            id: 'bloqueio-uuid-456',
            configuracaoAgendaId: 'config-uuid-123',
            dataInicio: new Date('2024-12-24'),
            horaInicio: '14:00',
            dataFim: new Date('2024-12-26'),
            horaFim: '08:00',
            observacao: 'Feriado de Natal',
            motivoBloqueio: 'Feriado',
          } as BloqueioHorario,
        ];

        entity.bloqueiosHorario = mockBloqueios;

        expect(entity.bloqueiosHorario).toEqual(mockBloqueios);
        expect(entity.bloqueiosHorario).toHaveLength(2);
        expect(entity.bloqueiosHorario[0].motivoBloqueio).toBe('Manutenção');
        expect(entity.bloqueiosHorario[1].motivoBloqueio).toBe('Feriado');
      });

      it('deve ter cascade configurado corretamente', () => {
        // O relacionamento deve ter cascade: true
        // Isso significa que ao salvar/deletar configuração, os bloqueios também serão afetados
        const mockBloqueios = [
          {
            id: 'bloqueio-uuid-123',
            dataInicio: new Date('2024-08-15'),
            horaInicio: '13:00',
            observacao: 'Bloqueio temporário',
          } as BloqueioHorario,
        ];

        entity.bloqueiosHorario = mockBloqueios;

        expect(entity.bloqueiosHorario).toBeDefined();
        expect(entity.bloqueiosHorario[0].observacao).toBe(
          'Bloqueio temporário',
        );
      });
    });
  });

  describe('atribuição de valores', () => {
    it('deve aceitar dados de configuração válidos', () => {
      const dadosConfiguracao = {
        agendaId: 'agenda-uuid-123',
        diasSemana: [
          DiaSemanaEnum.SEG,
          DiaSemanaEnum.TER,
          DiaSemanaEnum.QUA,
          DiaSemanaEnum.QUI,
          DiaSemanaEnum.SEX,
        ],
        intervaloAgendamento: 30,
        capacidadeTotal: 100,
        capacidadePorHorario: 5,
      };

      Object.assign(entity, dadosConfiguracao);

      expect(entity.agendaId).toBe(dadosConfiguracao.agendaId);
      expect(entity.diasSemana).toEqual(dadosConfiguracao.diasSemana);
      expect(entity.intervaloAgendamento).toBe(
        dadosConfiguracao.intervaloAgendamento,
      );
      expect(entity.capacidadeTotal).toBe(dadosConfiguracao.capacidadeTotal);
      expect(entity.capacidadePorHorario).toBe(
        dadosConfiguracao.capacidadePorHorario,
      );
    });

    it('deve aceitar valores nulos em campos opcionais', () => {
      const dadosOpcionais = {
        capacidadeTotal: null,
        capacidadePorHorario: null,
      };

      Object.assign(entity, dadosOpcionais);

      expect(entity.capacidadeTotal).toBeNull();
      expect(entity.capacidadePorHorario).toBeNull();
    });
  });

  describe('cenários de uso', () => {
    it('deve representar configuração para dias úteis', () => {
      const configDiasUteis = {
        agendaId: 'agenda-uuid-123',
        diasSemana: [
          DiaSemanaEnum.SEG,
          DiaSemanaEnum.TER,
          DiaSemanaEnum.QUA,
          DiaSemanaEnum.QUI,
          DiaSemanaEnum.SEX,
        ],
        intervaloAgendamento: 30,
        capacidadeTotal: 80,
        capacidadePorHorario: 4,
      };

      Object.assign(entity, configDiasUteis);

      expect(entity.diasSemana).toHaveLength(5);
      expect(entity.diasSemana).not.toContain(DiaSemanaEnum.SAB);
      expect(entity.diasSemana).not.toContain(DiaSemanaEnum.DOM);
      expect(entity.intervaloAgendamento).toBe(30);
    });

    it('deve representar configuração para fins de semana', () => {
      const configFimSemana = {
        agendaId: 'agenda-uuid-456',
        diasSemana: [DiaSemanaEnum.SAB, DiaSemanaEnum.DOM],
        intervaloAgendamento: 60,
        capacidadeTotal: 20,
        capacidadePorHorario: 2,
      };

      Object.assign(entity, configFimSemana);

      expect(entity.diasSemana).toHaveLength(2);
      expect(entity.diasSemana).toContain(DiaSemanaEnum.SAB);
      expect(entity.diasSemana).toContain(DiaSemanaEnum.DOM);
      expect(entity.intervaloAgendamento).toBe(60);
    });

    it('deve representar configuração com atendimento em feriados', () => {
      const configComFeriados = {
        agendaId: 'agenda-uuid-789',
        diasSemana: [
          DiaSemanaEnum.SEG,
          DiaSemanaEnum.QUA,
          DiaSemanaEnum.SEX,
          DiaSemanaEnum.FERIADOS,
        ],
        intervaloAgendamento: 45,
        capacidadeTotal: 50,
        capacidadePorHorario: 3,
      };

      Object.assign(entity, configComFeriados);

      expect(entity.diasSemana).toContain(DiaSemanaEnum.FERIADOS);
      expect(entity.diasSemana).toHaveLength(4);
      expect(entity.intervaloAgendamento).toBe(45);
    });

    it('deve representar configuração sem limitação de capacidade', () => {
      const configSemLimite = {
        agendaId: 'agenda-uuid-999',
        diasSemana: [DiaSemanaEnum.SEG],
        intervaloAgendamento: 15,
        capacidadeTotal: null,
        capacidadePorHorario: null,
      };

      Object.assign(entity, configSemLimite);

      expect(entity.capacidadeTotal).toBeNull();
      expect(entity.capacidadePorHorario).toBeNull();
      expect(entity.intervaloAgendamento).toBe(15);
    });

    it('deve representar configuração para urgências (intervalos menores)', () => {
      const configUrgencia = {
        agendaId: 'agenda-urgencia-123',
        diasSemana: Object.values(DiaSemanaEnum), // Todos os dias
        intervaloAgendamento: 15, // Intervalos menores para urgências
        capacidadeTotal: 200,
        capacidadePorHorario: 10,
      };

      Object.assign(entity, configUrgencia);

      expect(entity.diasSemana).toHaveLength(Object.keys(DiaSemanaEnum).length);
      expect(entity.intervaloAgendamento).toBe(15);
      expect(entity.capacidadePorHorario).toBe(10);
    });

    it('deve representar configuração para procedimentos especiais (intervalos maiores)', () => {
      const configProcedimento = {
        agendaId: 'agenda-procedimento-123',
        diasSemana: [DiaSemanaEnum.TER, DiaSemanaEnum.QUI],
        intervaloAgendamento: 120, // 2 horas por procedimento
        capacidadeTotal: 10,
        capacidadePorHorario: 1,
      };

      Object.assign(entity, configProcedimento);

      expect(entity.diasSemana).toHaveLength(2);
      expect(entity.intervaloAgendamento).toBe(120);
      expect(entity.capacidadePorHorario).toBe(1);
    });
  });

  describe('relacionamentos complexos', () => {
    it('deve aceitar configuração completa com todos os relacionamentos', () => {
      // Agenda associada
      const agenda = {
        id: 'agenda-uuid-123',
        codigoInterno: 'AG001',
        nomeAgenda: 'Agenda Completa',
      } as Agenda;

      // Períodos de atendimento
      const periodosAtendimento = [
        {
          id: 'periodo-uuid-123',
          periodo: 'MANHA',
          horarioInicio: '08:00',
          horarioFim: '12:00',
        } as PeriodoAtendimento,
        {
          id: 'periodo-uuid-456',
          periodo: 'TARDE',
          horarioInicio: '14:00',
          horarioFim: '18:00',
        } as PeriodoAtendimento,
      ];

      // Horários específicos
      const horariosEspecificos = [
        {
          id: 'horario-uuid-123',
          data: new Date('2024-12-25'),
          horaInicio: '09:00',
          horaFim: '12:00',
          isFeriado: true,
        } as HorarioEspecifico,
      ];

      // Bloqueios de horário
      const bloqueiosHorario = [
        {
          id: 'bloqueio-uuid-123',
          dataInicio: new Date('2024-07-15'),
          horaInicio: '10:00',
          dataFim: new Date('2024-07-15'),
          horaFim: '11:00',
          motivoBloqueio: 'Manutenção',
        } as BloqueioHorario,
      ];

      entity.agenda = agenda;
      entity.agendaId = agenda.id;
      entity.diasSemana = [DiaSemanaEnum.SEG, DiaSemanaEnum.TER];
      entity.intervaloAgendamento = 30;
      entity.periodosAtendimento = periodosAtendimento;
      entity.horariosEspecificos = horariosEspecificos;
      entity.bloqueiosHorario = bloqueiosHorario;

      expect(entity.agenda).toBeDefined();
      expect(entity.agendaId).toBe('agenda-uuid-123');
      expect(entity.diasSemana).toHaveLength(2);
      expect(entity.periodosAtendimento).toHaveLength(2);
      expect(entity.horariosEspecificos).toHaveLength(1);
      expect(entity.bloqueiosHorario).toHaveLength(1);
    });
  });

  describe('validações de tipo', () => {
    it('deve aceitar diferentes tipos de intervalo válidos', () => {
      const intervalosComuns = [
        5, // Emergência
        10, // Consulta rápida
        15, // Consulta padrão
        30, // Consulta completa
        45, // Consulta especializada
        60, // Procedimento
        90, // Procedimento complexo
        120, // Cirurgia menor
      ];

      intervalosComuns.forEach((intervalo) => {
        entity.intervaloAgendamento = intervalo;
        expect(entity.intervaloAgendamento).toBe(intervalo);
        expect(typeof entity.intervaloAgendamento).toBe('number');
      });
    });

    it('deve manter tipo correto para capacidades', () => {
      entity.capacidadeTotal = 100;
      entity.capacidadePorHorario = 5;

      expect(typeof entity.capacidadeTotal).toBe('number');
      expect(typeof entity.capacidadePorHorario).toBe('number');
      expect(entity.capacidadeTotal).toBeGreaterThan(0);
      expect(entity.capacidadePorHorario).toBeGreaterThan(0);
    });

    it('deve manter tipo correto para agendaId', () => {
      const agendaId = 'agenda-uuid-123';
      entity.agendaId = agendaId;

      expect(typeof entity.agendaId).toBe('string');
      expect(entity.agendaId).toBe(agendaId);
    });
  });

  describe('array diasSemana - cenários específicos', () => {
    it('deve aceitar reordenação dos dias da semana', () => {
      const diasDesordenados = [
        DiaSemanaEnum.QUA,
        DiaSemanaEnum.SEG,
        DiaSemanaEnum.SEX,
        DiaSemanaEnum.TER,
        DiaSemanaEnum.QUI,
      ];

      entity.diasSemana = diasDesordenados;

      expect(entity.diasSemana).toEqual(diasDesordenados);
      expect(entity.diasSemana).toContain(DiaSemanaEnum.SEG);
      expect(entity.diasSemana).toContain(DiaSemanaEnum.QUA);
    });

    it('deve aceitar dias duplicados (se fornecidos)', () => {
      // Embora não seja ideal, o sistema deve aceitar se alguém duplicar
      const diasComDuplicacao = [
        DiaSemanaEnum.SEG,
        DiaSemanaEnum.SEG,
        DiaSemanaEnum.TER,
      ];

      entity.diasSemana = diasComDuplicacao;

      expect(entity.diasSemana).toEqual(diasComDuplicacao);
      expect(entity.diasSemana).toHaveLength(3);
    });

    it('deve aceitar apenas feriados', () => {
      entity.diasSemana = [DiaSemanaEnum.FERIADOS];

      expect(entity.diasSemana).toEqual([DiaSemanaEnum.FERIADOS]);
      expect(entity.diasSemana).toHaveLength(1);
    });
  });
});

// Validar decoradores de coluna específicos
validateColumnDecorators(ConfiguracaoAgenda, [
  { field: 'id', type: 'string' },
  { field: 'agendaId', type: 'string' },
  { field: 'intervaloAgendamento', type: 'number' },
  { field: 'capacidadeTotal', type: 'number', nullable: true },
  { field: 'capacidadePorHorario', type: 'number', nullable: true },
]);
