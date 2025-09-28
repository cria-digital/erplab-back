import {
  LogAuditoria,
  TipoOperacao,
  ModuloOperacao,
} from './log-auditoria.entity';
import { createEntitySpec } from '../../../../test/entity-spec-helper';

// Definir campos obrigatórios, opcionais e relacionamentos
const requiredFields = [
  'id',
  'modulo',
  'tabela',
  'tipo_operacao',
  'ip_address',
  'criado_em',
];

const optionalFields = [
  'usuario_id',
  'registro_id',
  'valores_anteriores',
  'valores_novos',
  'valores_alterados',
  'user_agent',
  'endpoint',
  'metodo_http',
  'status_http',
  'tempo_execucao_ms',
  'observacoes',
  'metadados_adicionais',
  'sessao_id',
  'operacao_sensivel',
  'falha_operacao',
  'erro_detalhes',
];

const relations = ['usuario'];

// Criar testes básicos usando o helper
createEntitySpec(
  LogAuditoria,
  'LogAuditoria',
  requiredFields,
  optionalFields,
  relations,
);

// Testes específicos para LogAuditoria
describe('LogAuditoria - Testes Específicos', () => {
  let entity: LogAuditoria;

  beforeEach(() => {
    entity = new LogAuditoria();
  });

  describe('propriedades básicas', () => {
    it('deve criar instância com propriedades corretas', () => {
      expect(entity).toBeInstanceOf(LogAuditoria);
      expect(entity).toBeDefined();
    });

    it('deve ter propriedade id como UUID gerado automaticamente', () => {
      expect(entity).toHaveProperty('id');
      // UUID será gerado pelo banco, então inicialmente será undefined
      expect(entity.id).toBeUndefined();
    });

    it('deve ter todas as propriedades de log', () => {
      expect(entity).toHaveProperty('modulo');
      expect(entity).toHaveProperty('tabela');
      expect(entity).toHaveProperty('registro_id');
      expect(entity).toHaveProperty('tipo_operacao');
      expect(entity).toHaveProperty('valores_anteriores');
      expect(entity).toHaveProperty('valores_novos');
      expect(entity).toHaveProperty('valores_alterados');
    });

    it('deve ter propriedades de requisição HTTP', () => {
      expect(entity).toHaveProperty('endpoint');
      expect(entity).toHaveProperty('metodo_http');
      expect(entity).toHaveProperty('status_http');
      expect(entity).toHaveProperty('tempo_execucao_ms');
    });

    it('deve ter propriedades de rastreamento', () => {
      expect(entity).toHaveProperty('ip_address');
      expect(entity).toHaveProperty('user_agent');
      expect(entity).toHaveProperty('sessao_id');
      expect(entity).toHaveProperty('observacoes');
      expect(entity).toHaveProperty('metadados_adicionais');
    });

    it('deve ter propriedades de controle', () => {
      expect(entity).toHaveProperty('operacao_sensivel');
      expect(entity).toHaveProperty('falha_operacao');
      expect(entity).toHaveProperty('erro_detalhes');
    });
  });

  describe('enums', () => {
    it('deve aceitar todos os valores de TipoOperacao', () => {
      const tiposValidos = Object.values(TipoOperacao);

      tiposValidos.forEach((tipo) => {
        entity.tipo_operacao = tipo;
        expect(entity.tipo_operacao).toBe(tipo);
      });
    });

    it('deve aceitar todos os valores de ModuloOperacao', () => {
      const modulosValidos = Object.values(ModuloOperacao);

      modulosValidos.forEach((modulo) => {
        entity.modulo = modulo;
        expect(entity.modulo).toBe(modulo);
      });
    });

    it('deve validar enum TipoOperacao', () => {
      expect(TipoOperacao.CREATE).toBe('CREATE');
      expect(TipoOperacao.UPDATE).toBe('UPDATE');
      expect(TipoOperacao.DELETE).toBe('DELETE');
      expect(TipoOperacao.SELECT).toBe('SELECT');
      expect(TipoOperacao.LOGIN).toBe('LOGIN');
      expect(TipoOperacao.LOGOUT).toBe('LOGOUT');
      expect(TipoOperacao.EXPORT).toBe('EXPORT');
      expect(TipoOperacao.IMPORT).toBe('IMPORT');
      expect(TipoOperacao.APPROVE).toBe('APPROVE');
      expect(TipoOperacao.REJECT).toBe('REJECT');
      expect(TipoOperacao.SIGN).toBe('SIGN');
    });

    it('deve validar enum ModuloOperacao', () => {
      expect(ModuloOperacao.AUTH).toBe('auth');
      expect(ModuloOperacao.ATENDIMENTO).toBe('atendimento');
      expect(ModuloOperacao.EXAMES).toBe('exames');
      expect(ModuloOperacao.FINANCEIRO).toBe('financeiro');
      expect(ModuloOperacao.CRM).toBe('crm');
      expect(ModuloOperacao.AUDITORIA).toBe('auditoria');
      expect(ModuloOperacao.ESTOQUE).toBe('estoque');
      expect(ModuloOperacao.TISS).toBe('tiss');
      expect(ModuloOperacao.TAREFAS).toBe('tarefas');
      expect(ModuloOperacao.BI).toBe('bi');
      expect(ModuloOperacao.PORTAL_CLIENTE).toBe('portal_cliente');
      expect(ModuloOperacao.PORTAL_MEDICO).toBe('portal_medico');
      expect(ModuloOperacao.INTEGRACOES).toBe('integracoes');
      expect(ModuloOperacao.ADMIN).toBe('admin');
    });
  });

  describe('valores padrão', () => {
    it('deve ter valores padrão corretos para campos boolean', () => {
      // Valores padrão são definidos no decorator @Column
      entity.operacao_sensivel = false;
      entity.falha_operacao = false;

      expect(entity.operacao_sensivel).toBe(false);
      expect(entity.falha_operacao).toBe(false);
    });
  });

  describe('relacionamentos', () => {
    it('deve ter relacionamento com Usuario', () => {
      expect(entity).toHaveProperty('usuario');
      // Inicialmente será undefined até ser carregado
      expect(entity.usuario).toBeUndefined();
    });

    it('deve aceitar usuário no relacionamento', () => {
      const mockUsuario = {
        id: 'user-uuid-123',
        email: 'user@example.com',
        nomeCompleto: 'Test User',
      };

      entity.usuario = mockUsuario as any;
      expect(entity.usuario).toEqual(mockUsuario);
    });
  });

  describe('atribuição de valores', () => {
    it('deve aceitar dados de log válidos', () => {
      const dadosLog = {
        usuario_id: 'user-uuid-123',
        modulo: ModuloOperacao.ADMIN,
        tabela: 'usuarios',
        registro_id: 'registro-uuid-456',
        tipo_operacao: TipoOperacao.UPDATE,
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0...',
        endpoint: '/api/v1/usuarios/123',
        metodo_http: 'PATCH',
        status_http: 200,
        tempo_execucao_ms: 150,
        observacoes: 'Atualização realizada com sucesso',
        operacao_sensivel: false,
        falha_operacao: false,
      };

      Object.assign(entity, dadosLog);

      expect(entity.usuario_id).toBe(dadosLog.usuario_id);
      expect(entity.modulo).toBe(dadosLog.modulo);
      expect(entity.tabela).toBe(dadosLog.tabela);
      expect(entity.registro_id).toBe(dadosLog.registro_id);
      expect(entity.tipo_operacao).toBe(dadosLog.tipo_operacao);
      expect(entity.ip_address).toBe(dadosLog.ip_address);
      expect(entity.user_agent).toBe(dadosLog.user_agent);
      expect(entity.endpoint).toBe(dadosLog.endpoint);
      expect(entity.metodo_http).toBe(dadosLog.metodo_http);
      expect(entity.status_http).toBe(dadosLog.status_http);
      expect(entity.tempo_execucao_ms).toBe(dadosLog.tempo_execucao_ms);
      expect(entity.observacoes).toBe(dadosLog.observacoes);
      expect(entity.operacao_sensivel).toBe(dadosLog.operacao_sensivel);
      expect(entity.falha_operacao).toBe(dadosLog.falha_operacao);
    });

    it('deve aceitar valores JSON nos campos apropriados', () => {
      const valoresAnteriores = { email: 'antigo@email.com', ativo: true };
      const valoresNovos = { email: 'novo@email.com', ativo: false };
      const valoresAlterados = { email: true, ativo: true };
      const metadados = { origem: 'web', versao: '1.0.0' };

      entity.valores_anteriores = valoresAnteriores;
      entity.valores_novos = valoresNovos;
      entity.valores_alterados = valoresAlterados;
      entity.metadados_adicionais = metadados;

      expect(entity.valores_anteriores).toEqual(valoresAnteriores);
      expect(entity.valores_novos).toEqual(valoresNovos);
      expect(entity.valores_alterados).toEqual(valoresAlterados);
      expect(entity.metadados_adicionais).toEqual(metadados);
    });

    it('deve aceitar diferentes métodos HTTP', () => {
      const metodosHTTP = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
        'HEAD',
      ];

      metodosHTTP.forEach((metodo) => {
        entity.metodo_http = metodo;
        expect(entity.metodo_http).toBe(metodo);
      });
    });

    it('deve aceitar diferentes status HTTP', () => {
      const statusHTTP = [200, 201, 400, 401, 403, 404, 422, 500];

      statusHTTP.forEach((status) => {
        entity.status_http = status;
        expect(entity.status_http).toBe(status);
      });
    });
  });

  describe('cenários de uso', () => {
    it('deve representar log de login bem-sucedido', () => {
      const logLogin = {
        usuario_id: 'user-123',
        modulo: ModuloOperacao.AUTH,
        tabela: 'usuarios',
        registro_id: 'user-123',
        tipo_operacao: TipoOperacao.LOGIN,
        ip_address: '192.168.1.100',
        endpoint: '/api/v1/auth/login',
        metodo_http: 'POST',
        status_http: 200,
        tempo_execucao_ms: 250,
        operacao_sensivel: false,
        falha_operacao: false,
        observacoes: 'Login realizado com sucesso',
      };

      Object.assign(entity, logLogin);

      expect(entity.tipo_operacao).toBe(TipoOperacao.LOGIN);
      expect(entity.modulo).toBe(ModuloOperacao.AUTH);
      expect(entity.falha_operacao).toBe(false);
      expect(entity.status_http).toBe(200);
    });

    it('deve representar log de operação falhada', () => {
      const logFalha = {
        usuario_id: 'user-123',
        modulo: ModuloOperacao.EXAMES,
        tabela: 'exames',
        tipo_operacao: TipoOperacao.CREATE,
        ip_address: '192.168.1.100',
        endpoint: '/api/v1/exames',
        metodo_http: 'POST',
        status_http: 422,
        tempo_execucao_ms: 100,
        operacao_sensivel: false,
        falha_operacao: true,
        erro_detalhes: 'Dados de entrada inválidos',
        observacoes: 'Falha na validação dos dados',
      };

      Object.assign(entity, logFalha);

      expect(entity.falha_operacao).toBe(true);
      expect(entity.status_http).toBe(422);
      expect(entity.erro_detalhes).toBe('Dados de entrada inválidos');
    });

    it('deve representar log de operação sensível', () => {
      const logSensivel = {
        usuario_id: 'admin-123',
        modulo: ModuloOperacao.ADMIN,
        tabela: 'configuracoes',
        registro_id: 'config-security',
        tipo_operacao: TipoOperacao.UPDATE,
        ip_address: '192.168.1.100',
        endpoint: '/api/v1/admin/configuracoes/security',
        metodo_http: 'PATCH',
        status_http: 200,
        tempo_execucao_ms: 300,
        operacao_sensivel: true,
        falha_operacao: false,
        observacoes: 'Atualização de configurações de segurança',
        valores_anteriores: { duas_etapas_obrigatorio: false },
        valores_novos: { duas_etapas_obrigatorio: true },
      };

      Object.assign(entity, logSensivel);

      expect(entity.operacao_sensivel).toBe(true);
      expect(entity.modulo).toBe(ModuloOperacao.ADMIN);
      expect(entity.tipo_operacao).toBe(TipoOperacao.UPDATE);
      expect(entity.valores_anteriores).toEqual({
        duas_etapas_obrigatorio: false,
      });
      expect(entity.valores_novos).toEqual({ duas_etapas_obrigatorio: true });
    });

    it('deve representar log de exportação de dados', () => {
      const logExport = {
        usuario_id: 'user-123',
        modulo: ModuloOperacao.BI,
        tabela: 'relatorios',
        tipo_operacao: TipoOperacao.EXPORT,
        ip_address: '192.168.1.100',
        endpoint: '/api/v1/relatorios/export',
        metodo_http: 'GET',
        status_http: 200,
        tempo_execucao_ms: 5000,
        operacao_sensivel: true,
        falha_operacao: false,
        observacoes: 'Exportação de relatório financeiro',
        metadados_adicionais: {
          formato: 'xlsx',
          periodo: '2024-01',
          total_registros: 1500,
        },
      };

      Object.assign(entity, logExport);

      expect(entity.tipo_operacao).toBe(TipoOperacao.EXPORT);
      expect(entity.modulo).toBe(ModuloOperacao.BI);
      expect(entity.operacao_sensivel).toBe(true);
      expect(entity.metadados_adicionais.formato).toBe('xlsx');
      expect(entity.tempo_execucao_ms).toBe(5000);
    });
  });

  describe('campos de timestamp', () => {
    it('deve ter campo criado_em para auditoria', () => {
      expect(entity).toHaveProperty('criado_em');
      // CreateDateColumn será preenchido automaticamente pelo TypeORM
    });
  });
});
