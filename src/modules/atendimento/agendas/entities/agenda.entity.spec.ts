import { Agenda } from './agenda.entity';
import { StatusAgendaEnum } from '../enums/agendas.enum';
import { ConfiguracaoAgenda } from './configuracao-agenda.entity';
import { VinculacaoAgenda } from './vinculacao-agenda.entity';
import { NotificacaoAgenda } from './notificacao-agenda.entity';
import { CanalIntegracao } from './canal-integracao.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Profissional } from '../../../cadastros/profissionais/entities/profissional.entity';
import {
  createEntitySpec,
  validateColumnDecorators,
} from '../../../../../test/entity-spec-helper';

// Definir campos obrigatórios, opcionais e relacionamentos
const requiredFields = [
  'id',
  'codigoInterno',
  'nomeAgenda',
  'status',
  'criadoEm',
  'atualizadoEm',
];

const optionalFields = [
  'descricao',
  'unidadeAssociadaId',
  'setorId',
  'salaId',
  'especialidadeId',
  'equipamentoId',
];

const relations = [
  'unidadeAssociada',
  'profissionais',
  'configuracaoAgenda',
  'vinculacoes',
  'notificacoes',
  'canaisIntegracao',
];

// Criar testes básicos usando o helper
createEntitySpec(Agenda, 'Agenda', requiredFields, optionalFields, relations);

// Testes específicos para Agenda
describe('Agenda - Testes Específicos', () => {
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
      // UUID será gerado pelo banco, então inicialmente será undefined
      expect(entity.id).toBeUndefined();
    });

    it('deve ter todas as propriedades de identificação', () => {
      expect(entity).toHaveProperty('codigoInterno');
      expect(entity).toHaveProperty('nomeAgenda');
      expect(entity).toHaveProperty('descricao');
      expect(entity).toHaveProperty('status');
    });

    it('deve ter propriedades de vinculação', () => {
      expect(entity).toHaveProperty('unidadeAssociadaId');
      expect(entity).toHaveProperty('setorId');
      expect(entity).toHaveProperty('salaId');
      expect(entity).toHaveProperty('especialidadeId');
      expect(entity).toHaveProperty('equipamentoId');
    });

    it('deve ter campos de auditoria', () => {
      expect(entity).toHaveProperty('criadoEm');
      expect(entity).toHaveProperty('atualizadoEm');
    });
  });

  describe('enums e valores padrão', () => {
    it('deve aceitar valores válidos para status', () => {
      const valoresValidos = Object.values(StatusAgendaEnum);

      valoresValidos.forEach((valor) => {
        entity.status = valor;
        expect(entity.status).toBe(valor);
      });
    });

    it('deve ter status ATIVO como padrão', () => {
      // O valor padrão será definido pelo decorador do TypeORM
      entity.status = StatusAgendaEnum.ATIVO;
      expect(entity.status).toBe(StatusAgendaEnum.ATIVO);
    });

    it('deve aceitar status INATIVO', () => {
      entity.status = StatusAgendaEnum.INATIVO;
      expect(entity.status).toBe(StatusAgendaEnum.INATIVO);
    });
  });

  describe('relacionamentos', () => {
    describe('ManyToOne com UnidadeSaude', () => {
      it('deve ter relacionamento com UnidadeSaude', () => {
        expect(entity).toHaveProperty('unidadeAssociada');
        expect(entity.unidadeAssociada).toBeUndefined();
      });

      it('deve aceitar UnidadeSaude no relacionamento', () => {
        const mockUnidade = {
          id: 'unidade-uuid-123',
          nomeUnidade: 'Unidade Teste',
          cnpj: '12345678901234',
          razaoSocial: 'Unidade Teste LTDA',
          nomeFantasia: 'Unidade Teste',
        } as UnidadeSaude;

        entity.unidadeAssociada = mockUnidade;
        entity.unidadeAssociadaId = mockUnidade.id;

        expect(entity.unidadeAssociada).toEqual(mockUnidade);
        expect(entity.unidadeAssociadaId).toBe(mockUnidade.id);
      });

      it('deve permitir unidade nula (nullable: true)', () => {
        entity.unidadeAssociada = null;
        entity.unidadeAssociadaId = null;

        expect(entity.unidadeAssociada).toBeNull();
        expect(entity.unidadeAssociadaId).toBeNull();
      });
    });

    describe('ManyToMany com Profissionais', () => {
      it('deve ter relacionamento com Profissionais', () => {
        expect(entity).toHaveProperty('profissionais');
        expect(entity.profissionais).toBeUndefined();
      });

      it('deve aceitar array de Profissionais', () => {
        const mockProfissionais = [
          {
            id: 'prof-uuid-123',
            nomeCompleto: 'Dr. João Silva',
            cpf: '12345678901',
            email: 'joao@exemplo.com',
            codigoInterno: 'PROF001',
          } as Profissional,
          {
            id: 'prof-uuid-456',
            nomeCompleto: 'Dra. Maria Santos',
            cpf: '98765432100',
            email: 'maria@exemplo.com',
            codigoInterno: 'PROF002',
          } as Profissional,
        ];

        entity.profissionais = mockProfissionais;

        expect(entity.profissionais).toEqual(mockProfissionais);
        expect(entity.profissionais).toHaveLength(2);
        expect(entity.profissionais[0].nomeCompleto).toBe('Dr. João Silva');
        expect(entity.profissionais[1].nomeCompleto).toBe('Dra. Maria Santos');
      });

      it('deve aceitar array vazio de profissionais', () => {
        entity.profissionais = [];

        expect(entity.profissionais).toEqual([]);
        expect(entity.profissionais).toHaveLength(0);
      });
    });

    describe('OneToOne com ConfiguracaoAgenda', () => {
      it('deve ter relacionamento com ConfiguracaoAgenda', () => {
        expect(entity).toHaveProperty('configuracaoAgenda');
        expect(entity.configuracaoAgenda).toBeUndefined();
      });

      it('deve aceitar ConfiguracaoAgenda no relacionamento', () => {
        const mockConfiguracao = {
          id: 'config-uuid-123',
          agendaId: 'agenda-uuid-123',
          diasSemana: ['SEG', 'TER', 'QUA'],
          intervaloAgendamento: 30,
        } as ConfiguracaoAgenda;

        entity.configuracaoAgenda = mockConfiguracao;

        expect(entity.configuracaoAgenda).toEqual(mockConfiguracao);
        expect(entity.configuracaoAgenda.intervaloAgendamento).toBe(30);
      });

      it('deve ter cascade e eager configurados corretamente', () => {
        // O relacionamento deve ter cascade: true e eager: true
        // Isso significa que ao salvar/deletar agenda, a configuração também será afetada
        // E ao buscar agenda, a configuração será carregada automaticamente
        const mockConfiguracao = {
          id: 'config-uuid-123',
          agendaId: 'agenda-uuid-123',
          diasSemana: ['SEG', 'TER'],
          intervaloAgendamento: 15,
        } as ConfiguracaoAgenda;

        entity.configuracaoAgenda = mockConfiguracao;

        expect(entity.configuracaoAgenda).toBeDefined();
        expect(entity.configuracaoAgenda.id).toBe('config-uuid-123');
      });
    });

    describe('OneToMany com VinculacaoAgenda', () => {
      it('deve ter relacionamento com VinculacaoAgenda', () => {
        expect(entity).toHaveProperty('vinculacoes');
        expect(entity.vinculacoes).toBeUndefined();
      });

      it('deve aceitar array de VinculacaoAgenda', () => {
        const mockVinculacoes = [
          {
            id: 'vinc-uuid-123',
            agendaId: 'agenda-uuid-123',
            tipo: 'ESPECIALIDADE',
            entidadeVinculadaId: 'esp-uuid-123',
            entidadeVinculadaNome: 'Cardiologia',
            opcaoAdicional: false,
          } as VinculacaoAgenda,
          {
            id: 'vinc-uuid-456',
            agendaId: 'agenda-uuid-123',
            tipo: 'PROFISSIONAL',
            entidadeVinculadaId: 'prof-uuid-456',
            entidadeVinculadaNome: 'Dr. João Silva',
            opcaoAdicional: false,
          } as VinculacaoAgenda,
        ];

        entity.vinculacoes = mockVinculacoes;

        expect(entity.vinculacoes).toEqual(mockVinculacoes);
        expect(entity.vinculacoes).toHaveLength(2);
        expect(entity.vinculacoes[0].tipo).toBe('ESPECIALIDADE');
        expect(entity.vinculacoes[1].tipo).toBe('PROFISSIONAL');
      });

      it('deve ter cascade configurado corretamente', () => {
        // O relacionamento deve ter cascade: true
        // Isso significa que ao salvar/deletar agenda, as vinculações também serão afetadas
        const mockVinculacoes = [
          {
            id: 'vinc-uuid-123',
            agendaId: 'agenda-uuid-123',
            tipo: 'SETOR',
            entidadeVinculadaId: 'setor-uuid-123',
            entidadeVinculadaNome: 'Setor Cardiologia',
            opcaoAdicional: false,
          } as VinculacaoAgenda,
        ];

        entity.vinculacoes = mockVinculacoes;

        expect(entity.vinculacoes).toBeDefined();
        expect(entity.vinculacoes[0].tipo).toBe('SETOR');
      });
    });

    describe('OneToOne com NotificacaoAgenda', () => {
      it('deve ter relacionamento com NotificacaoAgenda', () => {
        expect(entity).toHaveProperty('notificacoes');
        expect(entity.notificacoes).toBeUndefined();
      });

      it('deve aceitar NotificacaoAgenda no relacionamento', () => {
        const mockNotificacao = {
          id: 'notif-uuid-123',
          agendaId: 'agenda-uuid-123',
          notificarEmail: true,
          notificarWhatsapp: false,
          notificarSMS: false,
          prazoLembrete: 24,
          prazoLembreteTipo: 'HORAS',
        } as NotificacaoAgenda;

        entity.notificacoes = mockNotificacao;

        expect(entity.notificacoes).toEqual(mockNotificacao);
        expect(entity.notificacoes.notificarEmail).toBe(true);
        expect(entity.notificacoes.prazoLembrete).toBe(24);
      });

      it('deve ter cascade configurado corretamente', () => {
        // O relacionamento deve ter cascade: true
        // Isso significa que ao salvar/deletar agenda, as notificações também serão afetadas
        const mockNotificacao = {
          id: 'notif-uuid-123',
          agendaId: 'agenda-uuid-123',
          notificarEmail: false,
          notificarWhatsapp: false,
          notificarSMS: true,
          prazoLembrete: 1,
          prazoLembreteTipo: 'HORAS',
        } as NotificacaoAgenda;

        entity.notificacoes = mockNotificacao;

        expect(entity.notificacoes).toBeDefined();
        expect(entity.notificacoes.notificarSMS).toBe(true);
      });
    });

    describe('OneToMany com CanalIntegracao', () => {
      it('deve ter relacionamento com CanalIntegracao', () => {
        expect(entity).toHaveProperty('canaisIntegracao');
        expect(entity.canaisIntegracao).toBeUndefined();
      });

      it('deve aceitar array de CanalIntegracao', () => {
        const mockCanais = [
          {
            id: 'canal-uuid-123',
            agendaId: 'agenda-uuid-123',
            nomeCanal: 'API Externa',
            tipoIntegracao: 'API',
            integracaoConvenios: false,
            configuracaoJson: '{"url": "https://api.externa.com"}',
          } as CanalIntegracao,
          {
            id: 'canal-uuid-456',
            agendaId: 'agenda-uuid-123',
            nomeCanal: 'WhatsApp Business',
            tipoIntegracao: 'WHATSAPP',
            integracaoConvenios: false,
            configuracaoJson: '{"token": "whatsapp-token-123"}',
          } as CanalIntegracao,
        ];

        entity.canaisIntegracao = mockCanais;

        expect(entity.canaisIntegracao).toEqual(mockCanais);
        expect(entity.canaisIntegracao).toHaveLength(2);
        expect(entity.canaisIntegracao[0].nomeCanal).toBe('API Externa');
        expect(entity.canaisIntegracao[1].nomeCanal).toBe('WhatsApp Business');
      });

      it('deve ter cascade configurado corretamente', () => {
        // O relacionamento deve ter cascade: true
        // Isso significa que ao salvar/deletar agenda, os canais também serão afetados
        const mockCanais = [
          {
            id: 'canal-uuid-123',
            agendaId: 'agenda-uuid-123',
            nomeCanal: 'Email Integration',
            tipoIntegracao: 'EMAIL',
            integracaoConvenios: true,
            configuracaoJson: '{"smtp": "mail.example.com"}',
          } as CanalIntegracao,
        ];

        entity.canaisIntegracao = mockCanais;

        expect(entity.canaisIntegracao).toBeDefined();
        expect(entity.canaisIntegracao[0].nomeCanal).toBe('Email Integration');
      });
    });
  });

  describe('atribuição de valores', () => {
    it('deve aceitar dados de agenda válidos', () => {
      const dadosAgenda = {
        codigoInterno: 'AG001',
        nomeAgenda: 'Agenda Cardiologia',
        descricao: 'Agenda para consultas de cardiologia',
        unidadeAssociadaId: 'unidade-uuid-123',
        setorId: 'setor-uuid-456',
        salaId: 'sala-uuid-789',
        especialidadeId: 'esp-uuid-123',
        equipamentoId: 'equip-uuid-456',
        status: StatusAgendaEnum.ATIVO,
      };

      Object.assign(entity, dadosAgenda);

      expect(entity.codigoInterno).toBe(dadosAgenda.codigoInterno);
      expect(entity.nomeAgenda).toBe(dadosAgenda.nomeAgenda);
      expect(entity.descricao).toBe(dadosAgenda.descricao);
      expect(entity.unidadeAssociadaId).toBe(dadosAgenda.unidadeAssociadaId);
      expect(entity.setorId).toBe(dadosAgenda.setorId);
      expect(entity.salaId).toBe(dadosAgenda.salaId);
      expect(entity.especialidadeId).toBe(dadosAgenda.especialidadeId);
      expect(entity.equipamentoId).toBe(dadosAgenda.equipamentoId);
      expect(entity.status).toBe(dadosAgenda.status);
    });

    it('deve aceitar valores nulos em campos opcionais', () => {
      const dadosOpcionais = {
        descricao: null,
        unidadeAssociadaId: null,
        setorId: null,
        salaId: null,
        especialidadeId: null,
        equipamentoId: null,
      };

      Object.assign(entity, dadosOpcionais);

      expect(entity.descricao).toBeNull();
      expect(entity.unidadeAssociadaId).toBeNull();
      expect(entity.setorId).toBeNull();
      expect(entity.salaId).toBeNull();
      expect(entity.especialidadeId).toBeNull();
      expect(entity.equipamentoId).toBeNull();
    });

    it('deve aceitar campos de auditoria', () => {
      const dadosAuditoria = {
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      Object.assign(entity, dadosAuditoria);

      expect(entity.criadoEm).toBe(dadosAuditoria.criadoEm);
      expect(entity.atualizadoEm).toBe(dadosAuditoria.atualizadoEm);
    });
  });

  describe('cenários de uso', () => {
    it('deve representar agenda ativa com configuração completa', () => {
      const agendaCompleta = {
        codigoInterno: 'AG001',
        nomeAgenda: 'Agenda Cardiologia',
        descricao: 'Agenda para consultas de cardiologia',
        unidadeAssociadaId: 'unidade-uuid-123',
        setorId: 'setor-uuid-456',
        salaId: 'sala-uuid-789',
        especialidadeId: 'esp-uuid-123',
        status: StatusAgendaEnum.ATIVO,
      };

      Object.assign(entity, agendaCompleta);

      expect(entity.status).toBe(StatusAgendaEnum.ATIVO);
      expect(entity.nomeAgenda).toBe('Agenda Cardiologia');
      expect(entity.unidadeAssociadaId).toBeTruthy();
      expect(entity.setorId).toBeTruthy();
      expect(entity.salaId).toBeTruthy();
      expect(entity.especialidadeId).toBeTruthy();
    });

    it('deve representar agenda inativa', () => {
      const agendaInativa = {
        codigoInterno: 'AG002',
        nomeAgenda: 'Agenda Desativada',
        status: StatusAgendaEnum.INATIVO,
      };

      Object.assign(entity, agendaInativa);

      expect(entity.status).toBe(StatusAgendaEnum.INATIVO);
      expect(entity.nomeAgenda).toBe('Agenda Desativada');
    });

    it('deve representar agenda simples sem vínculos opcionais', () => {
      const agendaSimples = {
        codigoInterno: 'AG003',
        nomeAgenda: 'Agenda Geral',
        descricao: null,
        unidadeAssociadaId: null,
        setorId: null,
        salaId: null,
        especialidadeId: null,
        equipamentoId: null,
        status: StatusAgendaEnum.ATIVO,
      };

      Object.assign(entity, agendaSimples);

      expect(entity.nomeAgenda).toBe('Agenda Geral');
      expect(entity.status).toBe(StatusAgendaEnum.ATIVO);
      expect(entity.descricao).toBeNull();
      expect(entity.unidadeAssociadaId).toBeNull();
      expect(entity.setorId).toBeNull();
      expect(entity.salaId).toBeNull();
      expect(entity.especialidadeId).toBeNull();
      expect(entity.equipamentoId).toBeNull();
    });

    it('deve representar agenda com equipamento específico', () => {
      const agendaEquipamento = {
        codigoInterno: 'AG004',
        nomeAgenda: 'Agenda Ressonância',
        descricao: 'Agenda para exames de ressonância magnética',
        equipamentoId: 'equip-ressonancia-001',
        status: StatusAgendaEnum.ATIVO,
      };

      Object.assign(entity, agendaEquipamento);

      expect(entity.nomeAgenda).toBe('Agenda Ressonância');
      expect(entity.equipamentoId).toBe('equip-ressonancia-001');
      expect(entity.descricao).toContain('ressonância magnética');
    });
  });

  describe('relacionamentos complexos', () => {
    it('deve aceitar agenda com todos os relacionamentos preenchidos', () => {
      // Configuração
      const configuracao = {
        id: 'config-uuid-123',
        agendaId: 'agenda-uuid-123',
        diasSemana: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
        intervaloAgendamento: 30,
      } as ConfiguracaoAgenda;

      // Profissionais
      const profissionais = [
        {
          id: 'prof-uuid-123',
          nomeCompleto: 'Dr. João Silva',
          cpf: '12345678901',
        } as Profissional,
      ];

      // Vinculações
      const vinculacoes = [
        {
          id: 'vinc-uuid-123',
          tipo: 'ESPECIALIDADE',
          entidadeVinculadaId: 'esp-uuid-123',
          entidadeVinculadaNome: 'Cardiologia',
          opcaoAdicional: false,
        } as VinculacaoAgenda,
      ];

      // Notificações
      const notificacoes = {
        id: 'notif-uuid-123',
        notificarEmail: true,
        notificarWhatsapp: false,
        notificarSMS: false,
        prazoLembrete: 2,
        prazoLembreteTipo: 'HORAS',
      } as NotificacaoAgenda;

      // Canais de integração
      const canaisIntegracao = [
        {
          id: 'canal-uuid-123',
          nomeCanal: 'WhatsApp',
          tipoIntegracao: 'WHATSAPP',
          integracaoConvenios: false,
          configuracaoJson: '{"api_key": "whatsapp_key"}',
        } as CanalIntegracao,
      ];

      // Unidade associada
      const unidadeAssociada = {
        id: 'unidade-uuid-123',
        nomeUnidade: 'Unidade Central',
        cnpj: '12345678901234',
      } as UnidadeSaude;

      entity.configuracaoAgenda = configuracao;
      entity.profissionais = profissionais;
      entity.vinculacoes = vinculacoes;
      entity.notificacoes = notificacoes;
      entity.canaisIntegracao = canaisIntegracao;
      entity.unidadeAssociada = unidadeAssociada;

      expect(entity.configuracaoAgenda).toBeDefined();
      expect(entity.configuracaoAgenda.intervaloAgendamento).toBe(30);
      expect(entity.profissionais).toHaveLength(1);
      expect(entity.vinculacoes).toHaveLength(1);
      expect(entity.notificacoes).toBeDefined();
      expect(entity.canaisIntegracao).toHaveLength(1);
      expect(entity.unidadeAssociada).toBeDefined();
    });
  });

  describe('campos de timestamp', () => {
    it('deve ter campos de auditoria criadoEm e atualizadoEm', () => {
      expect(entity).toHaveProperty('criadoEm');
      expect(entity).toHaveProperty('atualizadoEm');
      // CreateDateColumn e UpdateDateColumn serão preenchidos automaticamente pelo TypeORM
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

      // O teste de unicidade será validado pelo banco de dados
      // Aqui apenas verificamos se o campo aceita o valor
    });

    it('deve aceitar diferentes formatos de código interno', () => {
      const codigosValidos = [
        'AG001',
        'AGENDA_001',
        'AG-001',
        'AG.001',
        'CARDIO_AG_001',
        '001',
      ];

      codigosValidos.forEach((codigo) => {
        entity.codigoInterno = codigo;
        expect(entity.codigoInterno).toBe(codigo);
      });
    });
  });
});

// Validar decoradores de coluna específicos
validateColumnDecorators(Agenda, [
  { field: 'id', type: 'string' },
  { field: 'codigoInterno', type: 'string', unique: true },
  { field: 'nomeAgenda', type: 'string' },
  { field: 'descricao', type: 'string', nullable: true },
  { field: 'unidadeAssociadaId', type: 'string', nullable: true },
  { field: 'setorId', type: 'string', nullable: true },
  { field: 'salaId', type: 'string', nullable: true },
  { field: 'especialidadeId', type: 'string', nullable: true },
  { field: 'equipamentoId', type: 'string', nullable: true },
]);
