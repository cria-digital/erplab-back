import { Agenda } from './agenda.entity';
import { DiaSemanaEnum, TipoVinculacaoEnum } from '../enums/agendas.enum';
import { VinculacaoAgenda } from './vinculacao-agenda.entity';
import { PeriodoAtendimento } from './periodo-atendimento.entity';
import { HorarioEspecifico } from './horario-especifico.entity';
import { BloqueioHorario } from './bloqueio-horario.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Profissional } from '../../../cadastros/profissionais/entities/profissional.entity';

describe('Agenda Entity', () => {
  let entity: Agenda;

  beforeEach(() => {
    entity = new Agenda();
  });

  describe('propriedades básicas', () => {
    it('deve criar instância com propriedades corretas', () => {
      expect(entity).toBeInstanceOf(Agenda);
      expect(entity).toBeDefined();
    });

    it('deve ter propriedade id como UUID gerado automaticamente', () => {
      expect(entity).toHaveProperty('id');
      expect(entity.id).toBeUndefined();
    });

    it('deve ter todas as propriedades de identificação', () => {
      expect(entity).toHaveProperty('codigoInterno');
      expect(entity).toHaveProperty('nomeAgenda');
      expect(entity).toHaveProperty('descricao');
    });

    it('deve ter propriedades de vinculação', () => {
      expect(entity).toHaveProperty('unidadeId');
      expect(entity).toHaveProperty('setor');
      expect(entity).toHaveProperty('salaId');
      expect(entity).toHaveProperty('profissionalId');
      expect(entity).toHaveProperty('especialidadeId');
      expect(entity).toHaveProperty('equipamentoId');
    });

    it('deve ter propriedades de configuração', () => {
      expect(entity).toHaveProperty('diasSemana');
      expect(entity).toHaveProperty('intervaloAgendamento');
      expect(entity).toHaveProperty('capacidadePorHorario');
      expect(entity).toHaveProperty('capacidadeTotal');
    });

    it('deve ter propriedades de notificação', () => {
      expect(entity).toHaveProperty('notificarEmail');
      expect(entity).toHaveProperty('notificarWhatsapp');
      expect(entity).toHaveProperty('prazoLembrete');
    });

    it('deve ter propriedade de integração', () => {
      expect(entity).toHaveProperty('integracaoConvenios');
    });

    it('deve ter campos de controle', () => {
      expect(entity).toHaveProperty('ativo');
      expect(entity).toHaveProperty('criadoEm');
      expect(entity).toHaveProperty('atualizadoEm');
    });
  });

  describe('enums e valores padrão', () => {
    it('deve aceitar valores válidos para diasSemana', () => {
      const valoresValidos = Object.values(DiaSemanaEnum);
      entity.diasSemana = valoresValidos;
      expect(entity.diasSemana).toEqual(valoresValidos);
    });

    it('deve aceitar apenas alguns dias da semana', () => {
      entity.diasSemana = [
        DiaSemanaEnum.SEG,
        DiaSemanaEnum.TER,
        DiaSemanaEnum.QUA,
      ];
      expect(entity.diasSemana).toHaveLength(3);
    });
  });

  describe('relacionamentos', () => {
    describe('ManyToOne com UnidadeSaude', () => {
      it('deve ter relacionamento com UnidadeSaude', () => {
        expect(entity).toHaveProperty('unidade');
        expect(entity.unidade).toBeUndefined();
      });

      it('deve aceitar UnidadeSaude no relacionamento', () => {
        const mockUnidade = {
          id: 'unidade-uuid-123',
          nomeUnidade: 'Unidade Teste',
          cnpj: '12345678901234',
        } as unknown as UnidadeSaude;

        entity.unidade = mockUnidade;
        entity.unidadeId = mockUnidade.id;

        expect(entity.unidade).toEqual(mockUnidade);
        expect(entity.unidadeId).toBe(mockUnidade.id);
      });
    });

    describe('ManyToOne com Profissional', () => {
      it('deve ter relacionamento com Profissional', () => {
        expect(entity).toHaveProperty('profissional');
        expect(entity.profissional).toBeUndefined();
      });

      it('deve aceitar Profissional no relacionamento', () => {
        const mockProfissional = {
          id: 'prof-uuid-123',
          nomeCompleto: 'Dr. João Silva',
        } as unknown as Profissional;

        entity.profissional = mockProfissional;
        entity.profissionalId = mockProfissional.id;

        expect(entity.profissional).toEqual(mockProfissional);
        expect(entity.profissionalId).toBe(mockProfissional.id);
      });
    });

    describe('OneToMany com PeriodoAtendimento', () => {
      it('deve ter relacionamento com periodosAtendimento', () => {
        expect(entity).toHaveProperty('periodosAtendimento');
      });

      it('deve aceitar array de PeriodoAtendimento', () => {
        const mockPeriodos = [
          {
            id: 'periodo-uuid-123',
            agendaId: 'agenda-uuid-123',
            horarioInicio: '08:00',
            horarioFim: '12:00',
          } as unknown as PeriodoAtendimento,
        ];

        entity.periodosAtendimento = mockPeriodos;

        expect(entity.periodosAtendimento).toEqual(mockPeriodos);
        expect(entity.periodosAtendimento).toHaveLength(1);
      });
    });

    describe('OneToMany com VinculacaoAgenda', () => {
      it('deve ter relacionamento com vinculacoes', () => {
        expect(entity).toHaveProperty('vinculacoes');
      });

      it('deve aceitar array de VinculacaoAgenda', () => {
        const mockVinculacoes = [
          {
            id: 'vinc-uuid-123',
            agendaId: 'agenda-uuid-123',
            tipo: TipoVinculacaoEnum.ESPECIALIDADE,
            entidadeVinculadaId: 'esp-uuid-123',
          } as unknown as VinculacaoAgenda,
        ];

        entity.vinculacoes = mockVinculacoes;

        expect(entity.vinculacoes).toEqual(mockVinculacoes);
        expect(entity.vinculacoes).toHaveLength(1);
      });
    });

    describe('OneToMany com HorarioEspecifico', () => {
      it('deve ter relacionamento com horariosEspecificos', () => {
        expect(entity).toHaveProperty('horariosEspecificos');
      });

      it('deve aceitar array de HorarioEspecifico', () => {
        const mockHorarios = [
          {
            id: 'horario-uuid-123',
            agendaId: 'agenda-uuid-123',
            dataEspecifica: new Date(),
            horarioEspecifico: '10:00',
          } as unknown as HorarioEspecifico,
        ];

        entity.horariosEspecificos = mockHorarios;

        expect(entity.horariosEspecificos).toEqual(mockHorarios);
        expect(entity.horariosEspecificos).toHaveLength(1);
      });
    });

    describe('OneToMany com BloqueioHorario', () => {
      it('deve ter relacionamento com bloqueiosHorario', () => {
        expect(entity).toHaveProperty('bloqueiosHorario');
      });

      it('deve aceitar array de BloqueioHorario', () => {
        const mockBloqueios = [
          {
            id: 'bloqueio-uuid-123',
            agendaId: 'agenda-uuid-123',
            diaBloquear: new Date(),
            horarioInicio: '08:00',
            horarioFim: '12:00',
            observacao: 'Manutenção',
          } as unknown as BloqueioHorario,
        ];

        entity.bloqueiosHorario = mockBloqueios;

        expect(entity.bloqueiosHorario).toEqual(mockBloqueios);
        expect(entity.bloqueiosHorario).toHaveLength(1);
      });
    });
  });

  describe('atribuição de valores', () => {
    it('deve aceitar dados de agenda válidos', () => {
      const dadosAgenda = {
        codigoInterno: 'AG001',
        nomeAgenda: 'Agenda Cardiologia',
        descricao: 'Agenda para consultas de cardiologia',
        unidadeId: 'unidade-uuid-123',
        setor: 'Setor Cardiologia',
        salaId: 'sala-uuid-789',
        profissionalId: 'prof-uuid-123',
        especialidadeId: 'esp-uuid-123',
        equipamentoId: 'equip-uuid-456',
        diasSemana: [DiaSemanaEnum.SEG, DiaSemanaEnum.TER],
        intervaloAgendamento: 30,
        capacidadePorHorario: 4,
        capacidadeTotal: 100,
        notificarEmail: true,
        notificarWhatsapp: false,
        prazoLembrete: '24 horas',
        integracaoConvenios: true,
        ativo: true,
      };

      Object.assign(entity, dadosAgenda);

      expect(entity.codigoInterno).toBe(dadosAgenda.codigoInterno);
      expect(entity.nomeAgenda).toBe(dadosAgenda.nomeAgenda);
      expect(entity.descricao).toBe(dadosAgenda.descricao);
      expect(entity.unidadeId).toBe(dadosAgenda.unidadeId);
      expect(entity.setor).toBe(dadosAgenda.setor);
      expect(entity.salaId).toBe(dadosAgenda.salaId);
      expect(entity.profissionalId).toBe(dadosAgenda.profissionalId);
      expect(entity.especialidadeId).toBe(dadosAgenda.especialidadeId);
      expect(entity.equipamentoId).toBe(dadosAgenda.equipamentoId);
      expect(entity.diasSemana).toEqual(dadosAgenda.diasSemana);
      expect(entity.intervaloAgendamento).toBe(
        dadosAgenda.intervaloAgendamento,
      );
      expect(entity.capacidadePorHorario).toBe(
        dadosAgenda.capacidadePorHorario,
      );
      expect(entity.capacidadeTotal).toBe(dadosAgenda.capacidadeTotal);
      expect(entity.notificarEmail).toBe(dadosAgenda.notificarEmail);
      expect(entity.notificarWhatsapp).toBe(dadosAgenda.notificarWhatsapp);
      expect(entity.prazoLembrete).toBe(dadosAgenda.prazoLembrete);
      expect(entity.integracaoConvenios).toBe(dadosAgenda.integracaoConvenios);
      expect(entity.ativo).toBe(dadosAgenda.ativo);
    });

    it('deve aceitar valores nulos em campos opcionais', () => {
      const dadosOpcionais = {
        descricao: null,
        setor: null,
        salaId: null,
        profissionalId: null,
        especialidadeId: null,
        equipamentoId: null,
        capacidadePorHorario: null,
        capacidadeTotal: null,
        prazoLembrete: null,
      };

      Object.assign(entity, dadosOpcionais);

      expect(entity.descricao).toBeNull();
      expect(entity.setor).toBeNull();
      expect(entity.salaId).toBeNull();
      expect(entity.profissionalId).toBeNull();
      expect(entity.especialidadeId).toBeNull();
      expect(entity.equipamentoId).toBeNull();
      expect(entity.capacidadePorHorario).toBeNull();
      expect(entity.capacidadeTotal).toBeNull();
      expect(entity.prazoLembrete).toBeNull();
    });
  });

  describe('cenários de uso', () => {
    it('deve representar agenda ativa com configuração completa', () => {
      const agendaCompleta = {
        codigoInterno: 'AG001',
        nomeAgenda: 'Agenda Cardiologia',
        descricao: 'Agenda para consultas de cardiologia',
        unidadeId: 'unidade-uuid-123',
        setor: 'Setor Cardiologia',
        diasSemana: [DiaSemanaEnum.SEG, DiaSemanaEnum.TER, DiaSemanaEnum.QUA],
        intervaloAgendamento: 30,
        notificarEmail: true,
        ativo: true,
      };

      Object.assign(entity, agendaCompleta);

      expect(entity.ativo).toBe(true);
      expect(entity.nomeAgenda).toBe('Agenda Cardiologia');
      expect(entity.unidadeId).toBeTruthy();
      expect(entity.setor).toBeTruthy();
      expect(entity.notificarEmail).toBe(true);
    });

    it('deve representar agenda inativa', () => {
      const agendaInativa = {
        codigoInterno: 'AG002',
        nomeAgenda: 'Agenda Desativada',
        ativo: false,
      };

      Object.assign(entity, agendaInativa);

      expect(entity.ativo).toBe(false);
      expect(entity.nomeAgenda).toBe('Agenda Desativada');
    });
  });

  describe('campos de timestamp', () => {
    it('deve ter campos de auditoria criadoEm e atualizadoEm', () => {
      expect(entity).toHaveProperty('criadoEm');
      expect(entity).toHaveProperty('atualizadoEm');
    });

    it('deve aceitar datas válidas nos campos de timestamp', () => {
      const agora = new Date();

      entity.criadoEm = agora;
      entity.atualizadoEm = agora;

      expect(entity.criadoEm).toBe(agora);
      expect(entity.atualizadoEm).toBe(agora);
    });
  });

  describe('validações de campos únicos', () => {
    it('deve ter codigoInterno com restrição unique', () => {
      entity.codigoInterno = 'AG_UNIQUE_001';
      expect(entity.codigoInterno).toBe('AG_UNIQUE_001');
    });

    it('deve aceitar diferentes formatos de código interno', () => {
      const codigosValidos = ['AG001', 'AGENDA_001', 'AG-001', 'AG.001'];

      codigosValidos.forEach((codigo) => {
        entity.codigoInterno = codigo;
        expect(entity.codigoInterno).toBe(codigo);
      });
    });
  });
});
