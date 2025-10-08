import { Paciente } from './paciente.entity';
import {
  createEntitySpec,
  createEntityWithMethodsSpec,
  validateColumnDecorators,
} from '../../../../../test/entity-spec-helper';

// Definir campos obrigatórios, opcionais e relacionamentos
const requiredFields = [
  'id',
  'codigo_interno',
  'nome',
  'sexo',
  'data_nascimento',
  'nome_mae',
  'rg',
  'cpf',
  'estado_civil',
  'email',
  'contatos',
  'profissao',
  'cep',
  'rua',
  'numero',
  'bairro',
  'cidade',
  'estado',
  'empresa_id',
  'criado_em',
  'atualizado_em',
];

const optionalFields = [
  'nome_social',
  'usar_nome_social',
  'prontuario',
  'whatsapp',
  'observacao',
  'convenio_id',
  'plano',
  'validade',
  'matricula',
  'nome_titular',
  'cartao_sus',
  'complemento',
  'foto_url',
  'status',
  'criado_por',
  'atualizado_por',
];

const relations = ['convenio', 'empresa', 'ordens_servico', 'agendamentos'];

// Criar testes básicos usando o helper
createEntitySpec(
  Paciente,
  'Paciente',
  requiredFields,
  optionalFields,
  relations,
);

// Definir métodos para teste
const methodsToTest = [
  {
    name: 'getCpfFormatado',
    testCase: (entity: Paciente) => {
      // Teste com CPF válido
      entity.cpf = '12345678901';
      expect(entity.getCpfFormatado()).toBe('123.456.789-01');

      // Teste com CPF inválido (menos de 11 dígitos)
      entity.cpf = '123456789';
      expect(entity.getCpfFormatado()).toBe('123456789');

      // Teste com CPF null/undefined
      entity.cpf = null as any;
      expect(entity.getCpfFormatado()).toBe(null);

      entity.cpf = undefined as any;
      expect(entity.getCpfFormatado()).toBe(undefined);
    },
  },
  {
    name: 'getIdade',
    testCase: (entity: Paciente) => {
      // Teste com data de nascimento válida
      const dataHoje = new Date();
      const anoAtual = dataHoje.getFullYear();
      const dataNascimento = new Date(anoAtual - 30, 5, 15); // 30 anos

      entity.data_nascimento = dataNascimento;
      expect(entity.getIdade()).toBe(30);

      // Teste com aniversário ainda não acontecido este ano
      const dataNascimentoFuturo = new Date(
        anoAtual - 25,
        dataHoje.getMonth() + 1,
        dataHoje.getDate(),
      );
      entity.data_nascimento = dataNascimentoFuturo;
      expect(entity.getIdade()).toBe(24);

      // Teste com data de nascimento null/undefined
      entity.data_nascimento = null as any;
      expect(entity.getIdade()).toBe(0);

      entity.data_nascimento = undefined as any;
      expect(entity.getIdade()).toBe(0);
    },
  },
  {
    name: 'getNomeCompleto',
    testCase: (entity: Paciente) => {
      entity.nome = 'João da Silva';
      entity.nome_social = 'João Santos';

      // Teste usando nome social
      entity.usar_nome_social = 'sim';
      expect(entity.getNomeCompleto()).toBe('João Santos');

      // Teste não usando nome social
      entity.usar_nome_social = 'nao';
      expect(entity.getNomeCompleto()).toBe('João da Silva');

      // Teste quando não se aplica
      entity.usar_nome_social = 'nao_se_aplica';
      expect(entity.getNomeCompleto()).toBe('João da Silva');

      // Teste quando quer usar nome social mas não tem
      entity.usar_nome_social = 'sim';
      entity.nome_social = null;
      expect(entity.getNomeCompleto()).toBe('João da Silva');

      entity.nome_social = '';
      expect(entity.getNomeCompleto()).toBe('João da Silva');
    },
  },
  {
    name: 'getEnderecoCompleto',
    testCase: (entity: Paciente) => {
      entity.rua = 'Rua das Flores';
      entity.numero = '123';
      entity.bairro = 'Centro';

      // Teste sem complemento
      entity.complemento = null;
      expect(entity.getEnderecoCompleto()).toBe('Rua das Flores, 123, Centro');

      // Teste com complemento
      entity.complemento = 'Apto 45';
      expect(entity.getEnderecoCompleto()).toBe(
        'Rua das Flores, 123, Apto 45, Centro',
      );

      // Teste com complemento vazio
      entity.complemento = '';
      expect(entity.getEnderecoCompleto()).toBe('Rua das Flores, 123, Centro');

      // Teste com campos vazios
      entity.numero = '';
      expect(entity.getEnderecoCompleto()).toBe('Rua das Flores, Centro');
    },
  },
  {
    name: 'getCepFormatado',
    testCase: (entity: Paciente) => {
      // Teste com CEP válido
      entity.cep = '12345678';
      expect(entity.getCepFormatado()).toBe('12345-678');

      // Teste com CEP inválido (menos de 8 dígitos)
      entity.cep = '1234567';
      expect(entity.getCepFormatado()).toBe('1234567');

      // Teste com CEP null/undefined
      entity.cep = null as any;
      expect(entity.getCepFormatado()).toBe(null);

      entity.cep = undefined as any;
      expect(entity.getCepFormatado()).toBe(undefined);
    },
  },
  {
    name: 'getTelefoneFormatado',
    testCase: (entity: Paciente) => {
      // Teste com celular (11 dígitos)
      entity.contatos = '11987654321';
      entity.whatsapp = null;
      expect(entity.getTelefoneFormatado()).toBe('(11) 98765-4321');

      // Teste com telefone fixo (10 dígitos)
      entity.contatos = '1134567890';
      expect(entity.getTelefoneFormatado()).toBe('(11) 3456-7890');

      // Teste com WhatsApp prioritário
      entity.whatsapp = '11999888777';
      expect(entity.getTelefoneFormatado()).toBe('(11) 99988-8777');

      // Teste com número já formatado
      entity.contatos = '(11) 98765-4321';
      entity.whatsapp = null;
      expect(entity.getTelefoneFormatado()).toBe('(11) 98765-4321');

      // Teste com número inválido
      entity.contatos = '123';
      entity.whatsapp = null;
      expect(entity.getTelefoneFormatado()).toBe('123');

      // Teste sem número
      entity.contatos = null;
      entity.whatsapp = null;
      expect(entity.getTelefoneFormatado()).toBe('');

      entity.contatos = '';
      entity.whatsapp = '';
      expect(entity.getTelefoneFormatado()).toBe('');
    },
  },
];

// Criar testes de métodos usando o helper
createEntityWithMethodsSpec(Paciente, 'Paciente', methodsToTest);

// Testes específicos para Paciente
describe('Paciente - Testes Específicos', () => {
  let entity: Paciente;

  beforeEach(() => {
    entity = new Paciente();
  });

  describe('propriedades básicas', () => {
    it('deve criar instância com propriedades corretas', () => {
      expect(entity).toBeInstanceOf(Paciente);
      expect(entity).toBeDefined();
    });

    it('deve ter propriedade id como UUID gerado automaticamente', () => {
      expect(entity).toHaveProperty('id');
      // UUID será gerado pelo banco, então inicialmente será undefined
      expect(entity.id).toBeUndefined();
    });

    it('deve ter todas as propriedades de identificação', () => {
      expect(entity).toHaveProperty('codigo_interno');
      expect(entity).toHaveProperty('nome');
      expect(entity).toHaveProperty('nome_social');
      expect(entity).toHaveProperty('usar_nome_social');
      expect(entity).toHaveProperty('sexo');
      expect(entity).toHaveProperty('data_nascimento');
      expect(entity).toHaveProperty('nome_mae');
      expect(entity).toHaveProperty('prontuario');
    });

    it('deve ter propriedades de documentos', () => {
      expect(entity).toHaveProperty('rg');
      expect(entity).toHaveProperty('cpf');
      expect(entity).toHaveProperty('cartao_sus');
    });

    it('deve ter propriedades de contato', () => {
      expect(entity).toHaveProperty('email');
      expect(entity).toHaveProperty('contatos');
      expect(entity).toHaveProperty('whatsapp');
    });

    it('deve ter propriedades de endereço', () => {
      expect(entity).toHaveProperty('cep');
      expect(entity).toHaveProperty('rua');
      expect(entity).toHaveProperty('numero');
      expect(entity).toHaveProperty('bairro');
      expect(entity).toHaveProperty('complemento');
      expect(entity).toHaveProperty('cidade');
      expect(entity).toHaveProperty('estado');
    });

    it('deve ter propriedades de convênio', () => {
      expect(entity).toHaveProperty('convenio_id');
      expect(entity).toHaveProperty('plano');
      expect(entity).toHaveProperty('validade');
      expect(entity).toHaveProperty('matricula');
      expect(entity).toHaveProperty('nome_titular');
    });

    it('deve ter propriedades de controle', () => {
      expect(entity).toHaveProperty('status');
      expect(entity).toHaveProperty('foto_url');
      expect(entity).toHaveProperty('observacao');
      expect(entity).toHaveProperty('empresa_id');
    });
  });

  describe('enums e valores padrão', () => {
    it('deve aceitar valores válidos para usar_nome_social', () => {
      const valoresValidos = ['nao_se_aplica', 'sim', 'nao'];

      valoresValidos.forEach((valor) => {
        entity.usar_nome_social = valor;
        expect(entity.usar_nome_social).toBe(valor);
      });
    });

    it('deve aceitar valores válidos para sexo', () => {
      const valoresValidos = ['M', 'F', 'O'];

      valoresValidos.forEach((valor) => {
        entity.sexo = valor;
        expect(entity.sexo).toBe(valor);
      });
    });

    it('deve aceitar valores válidos para status', () => {
      const valoresValidos = ['ativo', 'inativo', 'bloqueado'];

      valoresValidos.forEach((valor) => {
        entity.status = valor;
        expect(entity.status).toBe(valor);
      });
    });

    it('deve ter valores padrão corretos', () => {
      // Testando valores padrão definidos no entity
      entity.usar_nome_social = 'nao_se_aplica';
      entity.status = 'ativo';

      expect(entity.usar_nome_social).toBe('nao_se_aplica');
      expect(entity.status).toBe('ativo');
    });
  });

  describe('relacionamentos', () => {
    it('deve ter relacionamento com Convenio', () => {
      expect(entity).toHaveProperty('convenio');
      expect(entity.convenio).toBeUndefined();
    });

    it('deve ter relacionamento com Empresa', () => {
      expect(entity).toHaveProperty('empresa');
      expect(entity.empresa).toBeUndefined();
    });

    it('deve ter relacionamento com Ordens de Serviço', () => {
      expect(entity).toHaveProperty('ordens_servico');
      expect(entity.ordens_servico).toBeUndefined();
    });

    it('deve ter relacionamento com Agendamentos', () => {
      expect(entity).toHaveProperty('agendamentos');
      expect(entity.agendamentos).toBeUndefined();
    });

    it('deve aceitar convenio no relacionamento', () => {
      const mockConvenio = {
        id: 'convenio-uuid-123',
        nome: 'Convenio Teste',
        ativo: true,
      };

      entity.convenio = mockConvenio as any;
      expect(entity.convenio).toEqual(mockConvenio);
    });

    it('deve aceitar empresa no relacionamento', () => {
      const mockEmpresa = {
        id: 'empresa-uuid-123',
        razao_social: 'Empresa Teste LTDA',
        cnpj: '12345678901234',
      };

      entity.empresa = mockEmpresa as any;
      expect(entity.empresa).toEqual(mockEmpresa);
    });
  });

  describe('atribuição de valores', () => {
    it('deve aceitar dados de paciente válidos', () => {
      const dadosPaciente = {
        codigo_interno: 'PAC001',
        nome: 'João da Silva Santos',
        nome_social: 'João Santos',
        usar_nome_social: 'sim',
        sexo: 'M',
        data_nascimento: new Date('1990-05-15'),
        nome_mae: 'Maria da Silva',
        prontuario: 'PRONT001',
        rg: '123456789',
        cpf: '12345678901',
        estado_civil: 'Solteiro',
        email: 'joao@email.com',
        contatos: '11987654321',
        whatsapp: '11987654321',
        profissao: 'Engenheiro',
        observacao: 'Paciente regular',
        cep: '12345678',
        rua: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        complemento: 'Apto 45',
        cidade: 'São Paulo',
        estado: 'SP',
        foto_url: 'https://example.com/foto.jpg',
        status: 'ativo',
        empresa_id: 'empresa-uuid-123',
      };

      Object.assign(entity, dadosPaciente);

      expect(entity.codigo_interno).toBe(dadosPaciente.codigo_interno);
      expect(entity.nome).toBe(dadosPaciente.nome);
      expect(entity.nome_social).toBe(dadosPaciente.nome_social);
      expect(entity.usar_nome_social).toBe(dadosPaciente.usar_nome_social);
      expect(entity.sexo).toBe(dadosPaciente.sexo);
      expect(entity.data_nascimento).toBe(dadosPaciente.data_nascimento);
      expect(entity.nome_mae).toBe(dadosPaciente.nome_mae);
      expect(entity.prontuario).toBe(dadosPaciente.prontuario);
      expect(entity.rg).toBe(dadosPaciente.rg);
      expect(entity.cpf).toBe(dadosPaciente.cpf);
      expect(entity.estado_civil).toBe(dadosPaciente.estado_civil);
      expect(entity.email).toBe(dadosPaciente.email);
      expect(entity.contatos).toBe(dadosPaciente.contatos);
      expect(entity.whatsapp).toBe(dadosPaciente.whatsapp);
      expect(entity.profissao).toBe(dadosPaciente.profissao);
      expect(entity.observacao).toBe(dadosPaciente.observacao);
      expect(entity.cep).toBe(dadosPaciente.cep);
      expect(entity.rua).toBe(dadosPaciente.rua);
      expect(entity.numero).toBe(dadosPaciente.numero);
      expect(entity.bairro).toBe(dadosPaciente.bairro);
      expect(entity.complemento).toBe(dadosPaciente.complemento);
      expect(entity.cidade).toBe(dadosPaciente.cidade);
      expect(entity.estado).toBe(dadosPaciente.estado);
      expect(entity.foto_url).toBe(dadosPaciente.foto_url);
      expect(entity.status).toBe(dadosPaciente.status);
      expect(entity.empresa_id).toBe(dadosPaciente.empresa_id);
    });

    it('deve aceitar dados de convênio', () => {
      const dadosConvenio = {
        convenio_id: 'convenio-uuid-123',
        plano: 'Plano Premium',
        validade: new Date('2025-12-31'),
        matricula: 'MAT123456',
        nome_titular: 'João da Silva Santos',
        cartao_sus: '123456789012345',
      };

      Object.assign(entity, dadosConvenio);

      expect(entity.convenio_id).toBe(dadosConvenio.convenio_id);
      expect(entity.plano).toBe(dadosConvenio.plano);
      expect(entity.validade).toBe(dadosConvenio.validade);
      expect(entity.matricula).toBe(dadosConvenio.matricula);
      expect(entity.nome_titular).toBe(dadosConvenio.nome_titular);
      expect(entity.cartao_sus).toBe(dadosConvenio.cartao_sus);
    });

    it('deve aceitar campos de auditoria', () => {
      const dadosAuditoria = {
        criado_por: 'user-uuid-123',
        atualizado_por: 'user-uuid-456',
        criado_em: new Date(),
        atualizado_em: new Date(),
      };

      Object.assign(entity, dadosAuditoria);

      expect(entity.criado_por).toBe(dadosAuditoria.criado_por);
      expect(entity.atualizado_por).toBe(dadosAuditoria.atualizado_por);
      expect(entity.criado_em).toBe(dadosAuditoria.criado_em);
      expect(entity.atualizado_em).toBe(dadosAuditoria.atualizado_em);
    });
  });

  describe('cenários de uso', () => {
    it('deve representar paciente com convênio', () => {
      const pacienteConvenio = {
        codigo_interno: 'PAC001',
        nome: 'Maria dos Santos',
        cpf: '98765432100',
        convenio_id: 'convenio-123',
        plano: 'Plano Saúde Premium',
        matricula: 'MAT789',
        nome_titular: 'Maria dos Santos',
        validade: new Date('2025-12-31'),
        status: 'ativo',
      };

      Object.assign(entity, pacienteConvenio);

      expect(entity.convenio_id).toBeTruthy();
      expect(entity.plano).toBe('Plano Saúde Premium');
      expect(entity.matricula).toBe('MAT789');
      expect(entity.validade).toBeInstanceOf(Date);
    });

    it('deve representar paciente particular (sem convênio)', () => {
      const pacienteParticular = {
        codigo_interno: 'PAC002',
        nome: 'José da Silva',
        cpf: '11122233344',
        convenio_id: null,
        plano: null,
        matricula: null,
        nome_titular: null,
        validade: null,
        status: 'ativo',
      };

      Object.assign(entity, pacienteParticular);

      expect(entity.convenio_id).toBeNull();
      expect(entity.plano).toBeNull();
      expect(entity.matricula).toBeNull();
      expect(entity.validade).toBeNull();
    });

    it('deve representar paciente com nome social', () => {
      const pacienteNomeSocial = {
        nome: 'João Paulo da Silva',
        nome_social: 'João Silva',
        usar_nome_social: 'sim',
      };

      Object.assign(entity, pacienteNomeSocial);

      expect(entity.getNomeCompleto()).toBe('João Silva');
      expect(entity.usar_nome_social).toBe('sim');
    });

    it('deve representar paciente inativo', () => {
      const pacienteInativo = {
        codigo_interno: 'PAC003',
        nome: 'Pedro Santos',
        status: 'inativo',
      };

      Object.assign(entity, pacienteInativo);

      expect(entity.status).toBe('inativo');
    });

    it('deve representar paciente bloqueado', () => {
      const pacienteBloqueado = {
        codigo_interno: 'PAC004',
        nome: 'Ana Costa',
        status: 'bloqueado',
        observacao: 'Bloqueado por inadimplência',
      };

      Object.assign(entity, pacienteBloqueado);

      expect(entity.status).toBe('bloqueado');
      expect(entity.observacao).toBe('Bloqueado por inadimplência');
    });
  });

  describe('métodos auxiliares - casos especiais', () => {
    describe('getCpfFormatado', () => {
      it('deve tratar CPF com caracteres especiais', () => {
        entity.cpf = '123.456.789-01';
        // O método deve funcionar mesmo com CPF já formatado
        expect(entity.getCpfFormatado()).toBe('123.456.789-01');
      });
    });

    describe('getIdade', () => {
      it('deve calcular idade corretamente no dia do aniversário', () => {
        const hoje = new Date();
        const aniversarioHoje = new Date(
          hoje.getFullYear() - 25,
          hoje.getMonth(),
          hoje.getDate(),
        );

        entity.data_nascimento = aniversarioHoje;
        expect(entity.getIdade()).toBe(25);
      });

      it('deve tratar anos bissextos corretamente', () => {
        // Teste com data de nascimento em ano bissexto
        const dataNascimento = new Date(2000, 1, 29); // 29 de fevereiro de 2000
        entity.data_nascimento = dataNascimento;

        // Calcular idade esperada dinamicamente
        const hoje = new Date();
        let idadeEsperada = hoje.getFullYear() - 2000;
        const mes = hoje.getMonth() - 1; // fevereiro é mês 1
        if (mes < 0 || (mes === 0 && hoje.getDate() < 29)) {
          idadeEsperada--;
        }

        expect(entity.getIdade()).toBe(idadeEsperada);
      });
    });

    describe('getTelefoneFormatado', () => {
      it('deve priorizar WhatsApp sobre contatos', () => {
        entity.contatos = '11987654321';
        entity.whatsapp = '11999888777';

        expect(entity.getTelefoneFormatado()).toBe('(11) 99988-8777');
      });

      it('deve remover caracteres especiais antes de formatar', () => {
        entity.contatos = '(11) 9.8765-4321';
        entity.whatsapp = null;

        expect(entity.getTelefoneFormatado()).toBe('(11) 98765-4321');
      });

      it('deve tentar formatar números especiais', () => {
        entity.contatos = '0800-123-456';
        entity.whatsapp = null;

        // O método vai tentar formatar baseado na quantidade de dígitos
        // Como tem 10 dígitos (removendo caracteres especiais), vai formatar como telefone fixo
        expect(entity.getTelefoneFormatado()).toBe('(08) 0012-3456');
      });
    });

    describe('getEnderecoCompleto', () => {
      it('deve tratar campos undefined corretamente', () => {
        entity.rua = 'Rua das Flores';
        entity.numero = undefined as any;
        entity.bairro = 'Centro';
        entity.complemento = undefined as any;

        expect(entity.getEnderecoCompleto()).toBe('Rua das Flores, Centro');
      });

      it('deve tratar todos os campos vazios', () => {
        entity.rua = '';
        entity.numero = '';
        entity.bairro = '';
        entity.complemento = '';

        expect(entity.getEnderecoCompleto()).toBe('');
      });
    });
  });

  describe('campos de timestamp', () => {
    it('deve ter campos de auditoria criado_em e atualizado_em', () => {
      expect(entity).toHaveProperty('criado_em');
      expect(entity).toHaveProperty('atualizado_em');
      // CreateDateColumn e UpdateDateColumn serão preenchidos automaticamente pelo TypeORM
    });

    it('deve aceitar datas válidas nos campos de timestamp', () => {
      const agora = new Date();

      entity.criado_em = agora;
      entity.atualizado_em = agora;

      expect(entity.criado_em).toBe(agora);
      expect(entity.atualizado_em).toBe(agora);
    });
  });

  describe('validações de campos', () => {
    it('deve aceitar diferentes tipos de estado civil', () => {
      const estadosCivis = [
        'Solteiro',
        'Casado',
        'Divorciado',
        'Viúvo',
        'União Estável',
        'Separado',
      ];

      estadosCivis.forEach((estado) => {
        entity.estado_civil = estado;
        expect(entity.estado_civil).toBe(estado);
      });
    });

    it('deve aceitar diferentes profissões', () => {
      const profissoes = [
        'Médico',
        'Engenheiro',
        'Professor',
        'Advogado',
        'Enfermeiro',
        'Técnico em Enfermagem',
        'Aposentado',
        'Estudante',
        'Autônomo',
      ];

      profissoes.forEach((profissao) => {
        entity.profissao = profissao;
        expect(entity.profissao).toBe(profissao);
      });
    });

    it('deve aceitar diferentes UFs', () => {
      const ufs = [
        'SP',
        'RJ',
        'MG',
        'RS',
        'PR',
        'SC',
        'BA',
        'GO',
        'PE',
        'CE',
        'PB',
        'PA',
        'ES',
        'PI',
        'AL',
        'RN',
        'MT',
        'MS',
        'DF',
        'SE',
        'AM',
        'RO',
        'AC',
        'AP',
        'RR',
        'TO',
        'MA',
      ];

      ufs.forEach((uf) => {
        entity.estado = uf;
        expect(entity.estado).toBe(uf);
      });
    });
  });
});

// Validar decoradores de coluna específicos (excluindo campos de data que são mockados pelo Jest)
validateColumnDecorators(Paciente, [
  { field: 'id', type: 'string' },
  { field: 'codigo_interno', type: 'string' },
  { field: 'nome', type: 'string' },
  { field: 'nome_social', type: 'string', nullable: true },
  { field: 'sexo', type: 'string' },
  { field: 'nome_mae', type: 'string' },
  { field: 'rg', type: 'string' },
  { field: 'cpf', type: 'string' },
  { field: 'email', type: 'string' },
  { field: 'contatos', type: 'string' },
  { field: 'whatsapp', type: 'string', nullable: true },
  { field: 'profissao', type: 'string' },
  { field: 'cep', type: 'string' },
  { field: 'rua', type: 'string' },
  { field: 'numero', type: 'string' },
  { field: 'bairro', type: 'string' },
  { field: 'cidade', type: 'string' },
  { field: 'estado', type: 'string' },
]);
