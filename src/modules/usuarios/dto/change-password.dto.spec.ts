import { ChangePasswordDto } from './change-password.dto';
import { createCreateDtoSpec } from '../../../../test/dto-spec-helper';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Definir campos obrigatórios e opcionais
const requiredFields = ['senhaAtual', 'novaSenha', 'confirmacaoSenha'];
const optionalFields: string[] = [];

// Criar testes básicos usando o helper
createCreateDtoSpec(
  ChangePasswordDto,
  'ChangePasswordDto',
  requiredFields,
  optionalFields,
);

// Testes específicos para ChangePasswordDto
describe('ChangePasswordDto - Validações Específicas', () => {
  const validData = {
    senhaAtual: 'SenhaAtual123!',
    novaSenha: 'NovaSenhaSegura123!',
    confirmacaoSenha: 'NovaSenhaSegura123!',
  };

  describe('senhaAtual', () => {
    it('deve aceitar senha atual válida', async () => {
      const dto = plainToInstance(ChangePasswordDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar quando senhaAtual está vazia', async () => {
      const data = { ...validData, senhaAtual: '' };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const senhaAtualError = errors.find(
        (error) => error.property === 'senhaAtual',
      );
      expect(senhaAtualError).toBeDefined();
      expect(senhaAtualError.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve rejeitar quando senhaAtual não é string', async () => {
      const data = { ...validData, senhaAtual: 123456 };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const senhaAtualError = errors.find(
        (error) => error.property === 'senhaAtual',
      );
      expect(senhaAtualError).toBeDefined();
      expect(senhaAtualError.constraints).toHaveProperty('isString');
    });
  });

  describe('novaSenha', () => {
    it('deve aceitar nova senha com 8 caracteres', async () => {
      const data = {
        ...validData,
        novaSenha: 'Senha12!',
        confirmacaoSenha: 'Senha12!',
      };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar nova senha com menos de 8 caracteres', async () => {
      const data = {
        ...validData,
        novaSenha: 'Sen12!',
        confirmacaoSenha: 'Sen12!',
      };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const novaSenhaError = errors.find(
        (error) => error.property === 'novaSenha',
      );
      expect(novaSenhaError).toBeDefined();
      expect(novaSenhaError.constraints).toHaveProperty('minLength');
    });

    it('deve rejeitar nova senha sem letra minúscula', async () => {
      const data = {
        ...validData,
        novaSenha: 'SENHA123!',
        confirmacaoSenha: 'SENHA123!',
      };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const novaSenhaError = errors.find(
        (error) => error.property === 'novaSenha',
      );
      expect(novaSenhaError).toBeDefined();
      expect(novaSenhaError.constraints).toHaveProperty('matches');
    });

    it('deve rejeitar nova senha sem letra maiúscula', async () => {
      const data = {
        ...validData,
        novaSenha: 'senha123!',
        confirmacaoSenha: 'senha123!',
      };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const novaSenhaError = errors.find(
        (error) => error.property === 'novaSenha',
      );
      expect(novaSenhaError).toBeDefined();
      expect(novaSenhaError.constraints).toHaveProperty('matches');
    });

    it('deve rejeitar nova senha sem números', async () => {
      const data = {
        ...validData,
        novaSenha: 'SenhaSemNumero!',
        confirmacaoSenha: 'SenhaSemNumero!',
      };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const novaSenhaError = errors.find(
        (error) => error.property === 'novaSenha',
      );
      expect(novaSenhaError).toBeDefined();
      expect(novaSenhaError.constraints).toHaveProperty('matches');
    });

    it('deve rejeitar nova senha sem caracteres especiais', async () => {
      const data = {
        ...validData,
        novaSenha: 'SenhaSemEspecial123',
        confirmacaoSenha: 'SenhaSemEspecial123',
      };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const novaSenhaError = errors.find(
        (error) => error.property === 'novaSenha',
      );
      expect(novaSenhaError).toBeDefined();
      expect(novaSenhaError.constraints).toHaveProperty('matches');
    });

    it('deve aceitar nova senha com todos os requisitos', async () => {
      const senhasValidas = [
        'MinhaSenh@123',
        'Outr@Senha456',
        'Segur@nça2024!',
        'P@ssw0rd123',
      ];

      for (const novaSenha of senhasValidas) {
        const data = { ...validData, novaSenha, confirmacaoSenha: novaSenha };
        const dto = plainToInstance(ChangePasswordDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('confirmacaoSenha', () => {
    it('deve aceitar confirmação igual à nova senha', async () => {
      const dto = plainToInstance(ChangePasswordDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar quando confirmacaoSenha está vazia', async () => {
      const data = { ...validData, confirmacaoSenha: '' };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const confirmacaoError = errors.find(
        (error) => error.property === 'confirmacaoSenha',
      );
      expect(confirmacaoError).toBeDefined();
      expect(confirmacaoError.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve rejeitar quando confirmacaoSenha não é string', async () => {
      const data = { ...validData, confirmacaoSenha: 123456 };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      const confirmacaoError = errors.find(
        (error) => error.property === 'confirmacaoSenha',
      );
      expect(confirmacaoError).toBeDefined();
      expect(confirmacaoError.constraints).toHaveProperty('isString');
    });

    // Nota: A validação de igualdade entre novaSenha e confirmacaoSenha
    // normalmente seria feita no service ou com um validator customizado
    // Aqui testamos apenas as validações básicas do DTO
  });

  describe('Instanciação', () => {
    it('deve criar instância com propriedades corretas', () => {
      const dto = new ChangePasswordDto();

      expect(dto).toHaveProperty('senhaAtual');
      expect(dto).toHaveProperty('novaSenha');
      expect(dto).toHaveProperty('confirmacaoSenha');
    });

    it('deve atribuir valores corretamente', () => {
      const dto = plainToInstance(ChangePasswordDto, validData);

      expect(dto.senhaAtual).toBe(validData.senhaAtual);
      expect(dto.novaSenha).toBe(validData.novaSenha);
      expect(dto.confirmacaoSenha).toBe(validData.confirmacaoSenha);
    });
  });

  describe('Caracteres especiais aceitos', () => {
    it('deve aceitar vários caracteres especiais na nova senha', async () => {
      const caracteresEspeciais = ['@', '$', '!', '%', '*', '?', '&'];

      for (const char of caracteresEspeciais) {
        const novaSenha = `MinhaSenh${char}123`;
        const data = { ...validData, novaSenha, confirmacaoSenha: novaSenha };
        const dto = plainToInstance(ChangePasswordDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('Casos limite', () => {
    it('deve aceitar senha exatamente com 8 caracteres e todos os requisitos', async () => {
      const novaSenha = 'Teste1@!';
      const data = { ...validData, novaSenha, confirmacaoSenha: novaSenha };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar senha muito longa com todos os requisitos', async () => {
      const novaSenha =
        'MinhaSuper LongaSenhaSegura123!ComMuitosCaracteres@2024';
      const data = { ...validData, novaSenha, confirmacaoSenha: novaSenha };
      const dto = plainToInstance(ChangePasswordDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
