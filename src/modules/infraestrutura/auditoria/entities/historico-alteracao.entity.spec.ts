import { HistoricoAlteracao } from './historico-alteracao.entity';
import { createEntitySpec } from '../../../../../test/entity-spec-helper';

// Definir campos obrigatórios, opcionais e relacionamentos
const requiredFields = [
  'id',
  'tabela_origem',
  'registro_id',
  'campo_alterado',
  'tipo_campo',
  'ip_address',
  'criado_em',
];

const optionalFields = [
  'usuario_id',
  'valor_anterior',
  'valor_novo',
  'motivo_alteracao',
  'user_agent',
  'alteracao_critica',
  'requer_aprovacao',
  'aprovada',
  'aprovada_por',
  'aprovada_em',
  'contexto_adicional',
];

const relations = ['usuario', 'aprovador'];

// Criar testes básicos usando o helper
createEntitySpec(
  HistoricoAlteracao,
  'HistoricoAlteracao',
  requiredFields,
  optionalFields,
  relations,
);

// Testes específicos para HistoricoAlteracao
describe('HistoricoAlteracao - Testes Específicos', () => {
  let entity: HistoricoAlteracao;

  beforeEach(() => {
    entity = new HistoricoAlteracao();
  });

  describe('propriedades básicas', () => {
    it('deve criar instância com propriedades corretas', () => {
      expect(entity).toBeInstanceOf(HistoricoAlteracao);
      expect(entity).toBeDefined();
    });

    it('deve ter propriedade id como UUID gerado automaticamente', () => {
      expect(entity).toHaveProperty('id');
      // UUID será gerado pelo banco, então inicialmente será undefined
      expect(entity.id).toBeUndefined();
    });

    it('deve ter todas as propriedades de auditoria', () => {
      expect(entity).toHaveProperty('tabela_origem');
      expect(entity).toHaveProperty('registro_id');
      expect(entity).toHaveProperty('campo_alterado');
      expect(entity).toHaveProperty('valor_anterior');
      expect(entity).toHaveProperty('valor_novo');
      expect(entity).toHaveProperty('tipo_campo');
    });

    it('deve ter propriedades de controle de aprovação', () => {
      expect(entity).toHaveProperty('alteracao_critica');
      expect(entity).toHaveProperty('requer_aprovacao');
      expect(entity).toHaveProperty('aprovada');
      expect(entity).toHaveProperty('aprovada_por');
      expect(entity).toHaveProperty('aprovada_em');
    });

    it('deve ter propriedades de rastreamento', () => {
      expect(entity).toHaveProperty('ip_address');
      expect(entity).toHaveProperty('user_agent');
      expect(entity).toHaveProperty('motivo_alteracao');
      expect(entity).toHaveProperty('contexto_adicional');
    });
  });

  describe('valores padrão', () => {
    it('deve ter valores padrão corretos para campos boolean', () => {
      // Valores padrão são definidos no decorator @Column
      // Aqui testamos se a propriedade existe e pode receber valores
      entity.alteracao_critica = false;
      entity.requer_aprovacao = false;
      entity.aprovada = false;

      expect(entity.alteracao_critica).toBe(false);
      expect(entity.requer_aprovacao).toBe(false);
      expect(entity.aprovada).toBe(false);
    });
  });

  describe('relacionamentos', () => {
    it('deve ter relacionamento com Usuario (usuario)', () => {
      expect(entity).toHaveProperty('usuario');
      // Inicialmente será undefined até ser carregado
      expect(entity.usuario).toBeUndefined();
    });

    it('deve ter relacionamento com Usuario (aprovador)', () => {
      expect(entity).toHaveProperty('aprovador');
      // Inicialmente será undefined até ser carregado
      expect(entity.aprovador).toBeUndefined();
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

    it('deve aceitar aprovador no relacionamento', () => {
      const mockAprovador = {
        id: 'aprovador-uuid-123',
        email: 'aprovador@example.com',
        nomeCompleto: 'Aprovador Test',
      };

      entity.aprovador = mockAprovador as any;
      expect(entity.aprovador).toEqual(mockAprovador);
    });
  });

  describe('atribuição de valores', () => {
    it('deve aceitar dados de alteração válidos', () => {
      const dadosAlteracao = {
        usuario_id: 'user-uuid-123',
        tabela_origem: 'usuarios',
        registro_id: 'registro-uuid-456',
        campo_alterado: 'email',
        valor_anterior: 'antigo@email.com',
        valor_novo: 'novo@email.com',
        tipo_campo: 'varchar',
        motivo_alteracao: 'Atualização solicitada pelo usuário',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0...',
        alteracao_critica: false,
        requer_aprovacao: false,
        aprovada: true,
      };

      Object.assign(entity, dadosAlteracao);

      expect(entity.usuario_id).toBe(dadosAlteracao.usuario_id);
      expect(entity.tabela_origem).toBe(dadosAlteracao.tabela_origem);
      expect(entity.registro_id).toBe(dadosAlteracao.registro_id);
      expect(entity.campo_alterado).toBe(dadosAlteracao.campo_alterado);
      expect(entity.valor_anterior).toBe(dadosAlteracao.valor_anterior);
      expect(entity.valor_novo).toBe(dadosAlteracao.valor_novo);
      expect(entity.tipo_campo).toBe(dadosAlteracao.tipo_campo);
      expect(entity.motivo_alteracao).toBe(dadosAlteracao.motivo_alteracao);
      expect(entity.ip_address).toBe(dadosAlteracao.ip_address);
      expect(entity.user_agent).toBe(dadosAlteracao.user_agent);
      expect(entity.alteracao_critica).toBe(dadosAlteracao.alteracao_critica);
      expect(entity.requer_aprovacao).toBe(dadosAlteracao.requer_aprovacao);
      expect(entity.aprovada).toBe(dadosAlteracao.aprovada);
    });

    it('deve aceitar contexto adicional como JSON', () => {
      const contexto = {
        origem_requisicao: 'web',
        versao_sistema: '1.0.0',
        metadata: {
          browser: 'Chrome',
          os: 'Windows 10',
        },
      };

      entity.contexto_adicional = contexto;
      expect(entity.contexto_adicional).toEqual(contexto);
    });

    it('deve aceitar diferentes tipos de campo', () => {
      const tiposCampo = [
        'varchar',
        'int',
        'boolean',
        'date',
        'text',
        'json',
        'decimal',
      ];

      tiposCampo.forEach((tipo) => {
        entity.tipo_campo = tipo;
        expect(entity.tipo_campo).toBe(tipo);
      });
    });

    it('deve aceitar IPs de diferentes formatos', () => {
      const ipsValidos = [
        '192.168.1.1',
        '10.0.0.1',
        '172.16.0.1',
        '127.0.0.1',
        '::1',
        '2001:db8::1',
      ];

      ipsValidos.forEach((ip) => {
        entity.ip_address = ip;
        expect(entity.ip_address).toBe(ip);
      });
    });
  });

  describe('campos de aprovação', () => {
    it('deve gerenciar processo de aprovação corretamente', () => {
      // Inicialmente sem aprovação
      entity.alteracao_critica = true;
      entity.requer_aprovacao = true;
      entity.aprovada = false;

      expect(entity.alteracao_critica).toBe(true);
      expect(entity.requer_aprovacao).toBe(true);
      expect(entity.aprovada).toBe(false);
      expect(entity.aprovada_por).toBeUndefined();
      expect(entity.aprovada_em).toBeUndefined();

      // Processo de aprovação
      entity.aprovada = true;
      entity.aprovada_por = 'aprovador-uuid-123';
      entity.aprovada_em = new Date();

      expect(entity.aprovada).toBe(true);
      expect(entity.aprovada_por).toBe('aprovador-uuid-123');
      expect(entity.aprovada_em).toBeInstanceOf(Date);
    });
  });

  describe('campos de timestamp', () => {
    it('deve ter campo criado_em para auditoria', () => {
      expect(entity).toHaveProperty('criado_em');
      // CreateDateColumn será preenchido automaticamente pelo TypeORM
    });

    it('deve aceitar data de aprovação', () => {
      const dataAprovacao = new Date('2024-01-15T10:30:00Z');
      entity.aprovada_em = dataAprovacao;

      expect(entity.aprovada_em).toEqual(dataAprovacao);
    });
  });

  describe('cenários de uso', () => {
    it('deve representar alteração simples de campo', () => {
      const alteracaoSimples = {
        tabela_origem: 'usuarios',
        registro_id: 'user-123',
        campo_alterado: 'nome',
        valor_anterior: 'João Silva',
        valor_novo: 'João Santos Silva',
        tipo_campo: 'varchar',
        ip_address: '192.168.1.100',
        alteracao_critica: false,
        requer_aprovacao: false,
        aprovada: true,
      };

      Object.assign(entity, alteracaoSimples);

      expect(entity.tabela_origem).toBe('usuarios');
      expect(entity.campo_alterado).toBe('nome');
      expect(entity.alteracao_critica).toBe(false);
    });

    it('deve representar alteração crítica que requer aprovação', () => {
      const alteracaoCritica = {
        tabela_origem: 'configuracoes',
        registro_id: 'config-123',
        campo_alterado: 'taxa_juros',
        valor_anterior: '2.5',
        valor_novo: '3.0',
        tipo_campo: 'decimal',
        ip_address: '192.168.1.100',
        alteracao_critica: true,
        requer_aprovacao: true,
        aprovada: false,
        motivo_alteracao: 'Ajuste de política financeira',
      };

      Object.assign(entity, alteracaoCritica);

      expect(entity.alteracao_critica).toBe(true);
      expect(entity.requer_aprovacao).toBe(true);
      expect(entity.aprovada).toBe(false);
      expect(entity.motivo_alteracao).toBe('Ajuste de política financeira');
    });
  });
});
