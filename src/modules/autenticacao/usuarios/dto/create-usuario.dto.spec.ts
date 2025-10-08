import { CreateUsuarioDto } from './create-usuario.dto';
import { createCreateDtoSpec } from '../../../../../test/dto-spec-helper';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Definir campos obrigatórios e opcionais
const requiredFields = ['nomeCompleto', 'email', 'senha'];
const optionalFields = [
  'codigoInterno',
  'cpf',
  'telefone',
  'celularWhatsapp',
  'cargoFuncao',
  'cnpjAssociado',
  'dadosAdmissao',
  'fotoUrl',
  'resetarSenha',
  'validacao2Etapas',
  'metodoValidacao',
  'perguntaRecuperacao',
  'respostaRecuperacao',
  'ativo',
  'unidadesIds',
  'permissoesIds',
];

// Criar testes básicos usando o helper
createCreateDtoSpec(
  CreateUsuarioDto,
  'CreateUsuarioDto',
  requiredFields,
  optionalFields,
);

// Testes específicos para CreateUsuarioDto
describe('CreateUsuarioDto - Validações Específicas', () => {
  const validData = {
    codigoInterno: 'USR123456',
    nomeCompleto: 'João da Silva Santos',
    cpf: '12345678901',
    telefone: '1133334444',
    celularWhatsapp: '11999998888',
    cargoFuncao: 'Analista de Sistemas',
    cnpjAssociado: '12345678000190',
    dadosAdmissao: 'Admitido em 01/01/2024 - CLT',
    fotoUrl: 'https://example.com/photos/user123.jpg',
    email: 'joao.silva@example.com',
    senha: 'SenhaSegura123!',
    resetarSenha: false,
    validacao2Etapas: false,
    metodoValidacao: 'EMAIL',
    perguntaRecuperacao: 'Qual o nome do seu primeiro animal de estimação?',
    respostaRecuperacao: 'Rex',
    ativo: true,
    unidadesIds: ['uuid-unidade-1', 'uuid-unidade-2'],
    permissoesIds: ['uuid-permissao-1', 'uuid-permissao-2'],
  };

  describe('nomeCompleto', () => {
    it('deve aceitar nome válido', async () => {
      const dto = plainToInstance(CreateUsuarioDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar nome muito curto', async () => {
      const data = { ...validData, nomeCompleto: 'A' };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      const nomeError = errors.find(
        (error) => error.property === 'nomeCompleto',
      );
      expect(nomeError).toBeDefined();
    });

    it('deve rejeitar nome muito longo', async () => {
      const data = { ...validData, nomeCompleto: 'A'.repeat(256) };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      const nomeError = errors.find(
        (error) => error.property === 'nomeCompleto',
      );
      expect(nomeError).toBeDefined();
    });

    it('deve remover espaços em branco do início e fim', async () => {
      const data = { ...validData, nomeCompleto: '  João Silva  ' };
      const dto = plainToInstance(CreateUsuarioDto, data);

      expect(dto.nomeCompleto).toBe('João Silva');
    });
  });

  describe('email', () => {
    it('deve aceitar email válido', async () => {
      const emails = [
        'usuario@example.com',
        'test.email@domain.co.uk',
        'nome+tag@empresa.org',
        'user123@test-domain.com',
      ];

      for (const email of emails) {
        const data = { ...validData, email };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve rejeitar email inválido', async () => {
      const emailsInvalidos = [
        'email-sem-arroba',
        '@domain.com',
        'email@',
        'email@domain',
        'email.domain.com',
      ];

      for (const email of emailsInvalidos) {
        const data = { ...validData, email };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        const emailError = errors.find((error) => error.property === 'email');
        expect(emailError).toBeDefined();
      }
    });

    it('deve converter email para minúsculo e remover espaços', async () => {
      const data = { ...validData, email: '  USER@EXAMPLE.COM  ' };
      const dto = plainToInstance(CreateUsuarioDto, data);

      expect(dto.email).toBe('user@example.com');
    });
  });

  describe('senha', () => {
    it('deve aceitar senha válida', async () => {
      const dto = plainToInstance(CreateUsuarioDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar senha muito curta', async () => {
      const data = { ...validData, senha: 'Abc1@' };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      const senhaError = errors.find((error) => error.property === 'senha');
      expect(senhaError).toBeDefined();
      expect(senhaError.constraints).toHaveProperty('minLength');
    });

    it('deve rejeitar senha sem complexidade', async () => {
      const senhasInvalidas = [
        'senhasimples', // sem maiúscula, número e especial
        'SENHAGRANDE', // sem minúscula, número e especial
        'SenhaSimples', // sem número e especial
        'SenhaSimples123', // sem especial
        'SenhaSimples!', // sem número
      ];

      for (const senha of senhasInvalidas) {
        const data = { ...validData, senha };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        const senhaError = errors.find((error) => error.property === 'senha');
        expect(senhaError).toBeDefined();
        expect(senhaError.constraints).toHaveProperty('matches');
      }
    });
  });

  describe('cpf', () => {
    it('deve aceitar CPF válido (11 dígitos)', async () => {
      const data = { ...validData, cpf: '12345678901' };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar CPF com formato inválido', async () => {
      const cpfsInvalidos = [
        '123456789', // 9 dígitos
        '123456789012', // 12 dígitos
        'abcdefghijk', // letras
        '', // vazio
      ];

      for (const cpf of cpfsInvalidos) {
        const data = { ...validData, cpf };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        const cpfError = errors.find((error) => error.property === 'cpf');
        expect(cpfError).toBeDefined();
      }
    });

    it('deve remover caracteres não numéricos do CPF', async () => {
      const data = { ...validData, cpf: '123.456.789-01' };
      const dto = plainToInstance(CreateUsuarioDto, data);

      expect(dto.cpf).toBe('12345678901');
    });
  });

  describe('cnpjAssociado', () => {
    it('deve aceitar CNPJ válido (14 dígitos)', async () => {
      const data = { ...validData, cnpjAssociado: '12345678000190' };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar CNPJ com formato inválido', async () => {
      const cnpjsInvalidos = [
        '12345678000', // 11 dígitos
        '123456780001901', // 15 dígitos
        '', // vazio
        'abcdefghijklmn', // letras
      ];

      for (const cnpj of cnpjsInvalidos) {
        const data = { ...validData, cnpjAssociado: cnpj };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        const cnpjError = errors.find(
          (error) => error.property === 'cnpjAssociado',
        );
        expect(cnpjError).toBeDefined();
      }
    });

    it('deve remover caracteres não numéricos do CNPJ', async () => {
      const data = { ...validData, cnpjAssociado: '12.345.678/0001-90' };
      const dto = plainToInstance(CreateUsuarioDto, data);

      expect(dto.cnpjAssociado).toBe('12345678000190');
    });
  });

  describe('telefone e celularWhatsapp', () => {
    it('deve aceitar telefones válidos', async () => {
      const data = {
        ...validData,
        telefone: '1133334444',
        celularWhatsapp: '11999998888',
      };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar telefones muito curtos ou longos', async () => {
      const telefonesInvalidos = [
        '123456789', // 9 dígitos (muito curto)
        '123456789012345678901', // 21 dígitos (muito longo)
      ];

      for (const telefone of telefonesInvalidos) {
        const data = { ...validData, telefone };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        const telefoneError = errors.find(
          (error) => error.property === 'telefone',
        );
        expect(telefoneError).toBeDefined();
      }
    });

    it('deve remover caracteres não numéricos dos telefones', async () => {
      const data = {
        ...validData,
        telefone: '(11) 3333-4444',
        celularWhatsapp: '(11) 99999-8888',
      };
      const dto = plainToInstance(CreateUsuarioDto, data);

      expect(dto.telefone).toBe('1133334444');
      expect(dto.celularWhatsapp).toBe('11999998888');
    });
  });

  describe('fotoUrl', () => {
    it('deve aceitar URL válida', async () => {
      const urlsValidas = [
        'https://example.com/photo.jpg',
        'http://domain.com/image.png',
        'https://cdn.example.org/users/123/avatar.gif',
      ];

      for (const fotoUrl of urlsValidas) {
        const data = { ...validData, fotoUrl };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve rejeitar URL inválida', async () => {
      const urlsInvalidas = [
        'not-a-url',
        'invalid-url-format',
        'http://', // URL incompleta
      ];

      for (const fotoUrl of urlsInvalidas) {
        const data = { ...validData, fotoUrl };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        const fotoError = errors.find((error) => error.property === 'fotoUrl');
        expect(fotoError).toBeDefined();
      }
    });
  });

  describe('metodoValidacao', () => {
    it('deve aceitar métodos válidos', async () => {
      const metodosValidos = ['SMS', 'EMAIL', 'APP'];

      for (const metodo of metodosValidos) {
        const data = { ...validData, metodoValidacao: metodo };
        const dto = plainToInstance(CreateUsuarioDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve rejeitar método inválido', async () => {
      const data = { ...validData, metodoValidacao: 'INVALID' };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      const metodoError = errors.find(
        (error) => error.property === 'metodoValidacao',
      );
      expect(metodoError).toBeDefined();
      expect(metodoError.constraints).toHaveProperty('isEnum');
    });
  });

  describe('arrays', () => {
    it('deve aceitar arrays de IDs válidos', async () => {
      const data = {
        ...validData,
        unidadesIds: ['uuid-1', 'uuid-2', 'uuid-3'],
        permissoesIds: ['perm-1', 'perm-2'],
      };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar arrays com elementos não-string', async () => {
      const data = {
        ...validData,
        unidadesIds: ['uuid-1', 123, 'uuid-3'], // 123 não é string
      };
      const dto = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(dto);

      const unidadesError = errors.find(
        (error) => error.property === 'unidadesIds',
      );
      expect(unidadesError).toBeDefined();
    });
  });

  describe('valores padrão', () => {
    it('deve aplicar valores padrão corretos', async () => {
      const dto = new CreateUsuarioDto();

      expect(dto.resetarSenha).toBe(false);
      expect(dto.validacao2Etapas).toBe(false);
      expect(dto.ativo).toBe(true);
    });
  });

  describe('transformações', () => {
    it('deve aplicar todas as transformações corretamente', async () => {
      const data = {
        ...validData,
        nomeCompleto: '  João Silva  ',
        email: '  JOAO@EXAMPLE.COM  ',
        cpf: '123.456.789-01',
        telefone: '(11) 3333-4444',
        celularWhatsapp: '(11) 99999-8888',
        cargoFuncao: '  Analista  ',
        cnpjAssociado: '12.345.678/0001-90',
      };

      const dto = plainToInstance(CreateUsuarioDto, data);

      expect(dto.nomeCompleto).toBe('João Silva');
      expect(dto.email).toBe('joao@example.com');
      expect(dto.cpf).toBe('12345678901');
      expect(dto.telefone).toBe('1133334444');
      expect(dto.celularWhatsapp).toBe('11999998888');
      expect(dto.cargoFuncao).toBe('Analista');
      expect(dto.cnpjAssociado).toBe('12345678000190');
    });
  });
});
