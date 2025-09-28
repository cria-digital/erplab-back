import { LoginDto } from './login.dto';
import { createCreateDtoSpec } from '../../../../test/dto-spec-helper';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Definir campos obrigatórios e opcionais
const requiredFields = ['email', 'senha'];
const optionalFields = ['codigo2FA'];

// Criar testes básicos usando o helper
createCreateDtoSpec(LoginDto, 'LoginDto', requiredFields, optionalFields);

// Testes específicos para LoginDto
describe('LoginDto - Validações Específicas', () => {
  const validData = {
    email: 'usuario@example.com',
    senha: 'SenhaSegura123!',
    codigo2FA: '123456',
  };

  describe('email', () => {
    it('deve aceitar email válido', async () => {
      const dto = plainToInstance(LoginDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar vários formatos de email válidos', async () => {
      const emailsValidos = [
        'user@domain.com',
        'test.email@example.org',
        'nome+tag@empresa.co.uk',
        'usuario123@test-domain.com.br',
        'admin@example.local',
        'user.name@sub.domain.com',
      ];

      for (const email of emailsValidos) {
        const data = { ...validData, email };
        const dto = plainToInstance(LoginDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve rejeitar quando email está vazio', async () => {
      const data = { ...validData, email: '' };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      const emailError = errors.find((error) => error.property === 'email');
      expect(emailError).toBeDefined();
      expect(emailError.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve rejeitar emails com formato inválido', async () => {
      const emailsInvalidos = [
        'email-sem-arroba',
        '@domain.com',
        'email@',
        'email@domain',
        'email.domain.com',
        'email@.com',
        'email@domain.',
        'email space@domain.com',
        'email@@domain.com',
      ];

      for (const email of emailsInvalidos) {
        const data = { ...validData, email };
        const dto = plainToInstance(LoginDto, data);
        const errors = await validate(dto);

        const emailError = errors.find((error) => error.property === 'email');
        expect(emailError).toBeDefined();
        expect(emailError.constraints).toHaveProperty('isEmail');
      }
    });

    it('deve converter email para minúsculo e remover espaços', async () => {
      const data = { ...validData, email: '  USER@EXAMPLE.COM  ' };
      const dto = plainToInstance(LoginDto, data);

      expect(dto.email).toBe('user@example.com');
    });

    it('deve transformar email preservando + e outros caracteres válidos', async () => {
      const data = { ...validData, email: '  User+Tag@EXAMPLE.COM  ' };
      const dto = plainToInstance(LoginDto, data);

      expect(dto.email).toBe('user+tag@example.com');
    });
  });

  describe('senha', () => {
    it('deve aceitar senha válida', async () => {
      const dto = plainToInstance(LoginDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar qualquer string como senha (sem validação de complexidade)', async () => {
      const senhas = [
        'senha123',
        'SenhaSimples',
        'SenhaComplexa123!@#',
        '123456',
        'abc',
        'senha muito longa com espaços e caracteres especiais !@#$%',
      ];

      for (const senha of senhas) {
        const data = { ...validData, senha };
        const dto = plainToInstance(LoginDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve rejeitar quando senha está vazia', async () => {
      const data = { ...validData, senha: '' };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      const senhaError = errors.find((error) => error.property === 'senha');
      expect(senhaError).toBeDefined();
      expect(senhaError.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve rejeitar quando senha não é string', async () => {
      const data = { ...validData, senha: 123456 };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      const senhaError = errors.find((error) => error.property === 'senha');
      expect(senhaError).toBeDefined();
      expect(senhaError.constraints).toHaveProperty('isString');
    });
  });

  describe('codigo2FA', () => {
    it('deve aceitar código 2FA válido', async () => {
      const dto = plainToInstance(LoginDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar vários formatos de código 2FA', async () => {
      const codigos = [
        '123456', // 6 dígitos
        '1234', // 4 dígitos
        '12345678', // 8 dígitos
        'ABC123', // alfanumérico
        'a1b2c3', // minúsculas e números
        '123-456', // com hífen
        'CODE123', // código alfabético
      ];

      for (const codigo2FA of codigos) {
        const data = { ...validData, codigo2FA };
        const dto = plainToInstance(LoginDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve aceitar quando código2FA não é fornecido (opcional)', async () => {
      const data = { email: validData.email, senha: validData.senha };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.codigo2FA).toBeUndefined();
    });

    it('deve aceitar código2FA vazio', async () => {
      const data = { ...validData, codigo2FA: '' };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar quando codigo2FA não é string', async () => {
      const data = { ...validData, codigo2FA: 123456 };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      const codigoError = errors.find(
        (error) => error.property === 'codigo2FA',
      );
      expect(codigoError).toBeDefined();
      expect(codigoError.constraints).toHaveProperty('isString');
    });
  });

  describe('Instanciação', () => {
    it('deve criar instância com propriedades corretas', () => {
      const dto = new LoginDto();

      expect(dto).toHaveProperty('email');
      expect(dto).toHaveProperty('senha');
      expect(dto).toHaveProperty('codigo2FA');
    });

    it('deve atribuir valores corretamente', () => {
      const dto = plainToInstance(LoginDto, validData);

      expect(dto.email).toBe(validData.email);
      expect(dto.senha).toBe(validData.senha);
      expect(dto.codigo2FA).toBe(validData.codigo2FA);
    });
  });

  describe('Casos de uso reais', () => {
    it('deve validar login básico sem 2FA', async () => {
      const data = {
        email: 'admin@empresa.com',
        senha: 'MinhaSenh@123',
      };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.codigo2FA).toBeUndefined();
    });

    it('deve validar login com 2FA', async () => {
      const data = {
        email: 'admin@empresa.com',
        senha: 'MinhaSenh@123',
        codigo2FA: '123456',
      };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.codigo2FA).toBe('123456');
    });

    it('deve validar login de setup inicial', async () => {
      const data = {
        email: 'diegosoek@gmail.com',
        senha: 'Admin123!',
      };
      const dto = plainToInstance(LoginDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('Transformações', () => {
    it('deve aplicar transformação de email mantendo senha inalterada', async () => {
      const data = {
        email: '  ADMIN@COMPANY.COM  ',
        senha: '  SenhaComEspaços  ',
        codigo2FA: 'ABC123',
      };
      const dto = plainToInstance(LoginDto, data);

      expect(dto.email).toBe('admin@company.com');
      expect(dto.senha).toBe('  SenhaComEspaços  '); // Senha não deve ser transformada
      expect(dto.codigo2FA).toBe('ABC123');
    });
  });

  describe('Validação completa de objeto', () => {
    it('deve validar objeto completo com todos os campos', async () => {
      const dto = plainToInstance(LoginDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);

      // Verificar se todos os campos foram atribuídos corretamente
      expect(dto.email).toBe('usuario@example.com');
      expect(dto.senha).toBe('SenhaSegura123!');
      expect(dto.codigo2FA).toBe('123456');
    });

    it('deve falhar quando campos obrigatórios estão ausentes', async () => {
      const dto = plainToInstance(LoginDto, {});
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);

      const emailError = errors.find((error) => error.property === 'email');
      const senhaError = errors.find((error) => error.property === 'senha');

      expect(emailError).toBeDefined();
      expect(senhaError).toBeDefined();
    });
  });
});
