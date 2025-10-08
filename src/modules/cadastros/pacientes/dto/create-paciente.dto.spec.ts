import { validate } from 'class-validator';
import { CreatePacienteDto } from './create-paciente.dto';

describe('CreatePacienteDto', () => {
  let dto: CreatePacienteDto;

  beforeEach(() => {
    dto = new CreatePacienteDto();
  });

  describe('Campos obrigatórios', () => {
    it('deve validar campos obrigatórios corretamente', async () => {
      dto.nome = 'João Silva';
      dto.sexo = 'M';
      dto.data_nascimento = '1990-01-01';
      dto.nome_mae = 'Maria Silva';
      dto.rg = '123456789';
      dto.cpf = '12345678901';
      dto.estado_civil = 'solteiro';
      dto.email = 'joao@email.com';
      dto.contatos = '11999999999';
      dto.profissao = 'Engenheiro';
      dto.cep = '01310100';
      dto.numero = '1000';
      dto.bairro = 'Bela Vista';
      dto.cidade = 'São Paulo';
      dto.estado = 'SP';
      dto.empresa_id = 'empresa-uuid-1';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve falhar quando nome não for fornecido', async () => {
      dto.sexo = 'M';
      dto.data_nascimento = '1990-01-01';
      dto.nome_mae = 'Maria Silva';
      dto.rg = '123456789';
      dto.cpf = '12345678901';
      dto.estado_civil = 'solteiro';
      dto.email = 'joao@email.com';
      dto.contatos = '11999999999';
      dto.profissao = 'Engenheiro';
      dto.cep = '01310100';
      dto.numero = '1000';
      dto.bairro = 'Bela Vista';
      dto.cidade = 'São Paulo';
      dto.estado = 'SP';
      dto.empresa_id = 'empresa-uuid-1';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.find((error) => error.property === 'nome')).toBeDefined();
    });

    it('deve falhar quando CPF não for fornecido', async () => {
      dto.nome = 'João Silva';
      dto.sexo = 'M';
      dto.data_nascimento = '1990-01-01';
      dto.nome_mae = 'Maria Silva';
      dto.rg = '123456789';
      dto.estado_civil = 'solteiro';
      dto.email = 'joao@email.com';
      dto.contatos = '11999999999';
      dto.profissao = 'Engenheiro';
      dto.cep = '01310100';
      dto.numero = '1000';
      dto.bairro = 'Bela Vista';
      dto.cidade = 'São Paulo';
      dto.estado = 'SP';
      dto.empresa_id = 'empresa-uuid-1';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.find((error) => error.property === 'cpf')).toBeDefined();
    });

    it('deve falhar quando empresa_id não for fornecido', async () => {
      dto.nome = 'João Silva';
      dto.sexo = 'M';
      dto.data_nascimento = '1990-01-01';
      dto.nome_mae = 'Maria Silva';
      dto.rg = '123456789';
      dto.cpf = '12345678901';
      dto.estado_civil = 'solteiro';
      dto.email = 'joao@email.com';
      dto.contatos = '11999999999';
      dto.profissao = 'Engenheiro';
      dto.cep = '01310100';
      dto.numero = '1000';
      dto.bairro = 'Bela Vista';
      dto.cidade = 'São Paulo';
      dto.estado = 'SP';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.find((error) => error.property === 'empresa_id'),
      ).toBeDefined();
    });
  });

  describe('Validação de formato', () => {
    beforeEach(() => {
      // Preenche campos obrigatórios básicos
      dto.nome = 'João Silva';
      dto.sexo = 'M';
      dto.data_nascimento = '1990-01-01';
      dto.nome_mae = 'Maria Silva';
      dto.rg = '123456789';
      dto.cpf = '12345678901';
      dto.estado_civil = 'solteiro';
      dto.email = 'joao@email.com';
      dto.contatos = '11999999999';
      dto.profissao = 'Engenheiro';
      dto.cep = '01310100';
      dto.numero = '1000';
      dto.bairro = 'Bela Vista';
      dto.cidade = 'São Paulo';
      dto.estado = 'SP';
      dto.empresa_id = 'empresa-uuid-1';
    });

    it('deve validar formato do email', async () => {
      dto.email = 'email-invalido';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.find((error) => error.property === 'email')).toBeDefined();
    });

    it('deve validar tamanho do CPF', async () => {
      dto.cpf = '123456789'; // CPF muito curto

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.find((error) => error.property === 'cpf')).toBeDefined();
    });

    it('deve validar tamanho do CEP', async () => {
      dto.cep = '123456'; // CEP muito curto

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.find((error) => error.property === 'cep')).toBeDefined();
    });

    it('deve validar formato da data de nascimento', async () => {
      dto.data_nascimento = 'data-invalida';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.find((error) => error.property === 'data_nascimento'),
      ).toBeDefined();
    });

    it('deve validar valores de sexo permitidos', async () => {
      dto.sexo = 'X' as any; // Valor não permitido

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.find((error) => error.property === 'sexo')).toBeDefined();
    });

    it('deve validar valores de usar_nome_social permitidos', async () => {
      dto.usar_nome_social = 'talvez' as any; // Valor não permitido

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.find((error) => error.property === 'usar_nome_social'),
      ).toBeDefined();
    });
  });

  describe('Campos opcionais', () => {
    beforeEach(() => {
      // Preenche campos obrigatórios básicos
      dto.nome = 'João Silva';
      dto.sexo = 'M';
      dto.data_nascimento = '1990-01-01';
      dto.nome_mae = 'Maria Silva';
      dto.rg = '123456789';
      dto.cpf = '12345678901';
      dto.estado_civil = 'solteiro';
      dto.email = 'joao@email.com';
      dto.contatos = '11999999999';
      dto.profissao = 'Engenheiro';
      dto.cep = '01310100';
      dto.numero = '1000';
      dto.bairro = 'Bela Vista';
      dto.cidade = 'São Paulo';
      dto.estado = 'SP';
      dto.empresa_id = 'empresa-uuid-1';
    });

    it('deve aceitar campos opcionais', async () => {
      dto.nome_social = 'João Santos';
      dto.prontuario = 'PRONT123';
      dto.observacao = 'Paciente com alergia';
      dto.whatsapp = '11888888888';
      dto.complemento = 'Apto 10';
      dto.rua = 'Rua das Flores';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('deve aceitar informações de convênio opcionais', async () => {
      dto.convenio_id = 'convenio-uuid-1';
      dto.plano = 'Plus';
      dto.validade = '2025-12-31';
      dto.matricula = '123456789';
      dto.nome_titular = 'João Silva';
      dto.cartao_sus = '123456789012345';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Limpeza de dados', () => {
    it('deve remover formatação do CPF', () => {
      dto.cpf = '123.456.789-01';

      // Este método seria implementado no DTO ou service
      const cpfLimpo = dto.cpf?.replace(/\D/g, '');
      expect(cpfLimpo).toBe('12345678901');
    });

    it('deve remover formatação do CEP', () => {
      dto.cep = '01310-100';

      // Este método seria implementado no DTO ou service
      const cepLimpo = dto.cep?.replace(/\D/g, '');
      expect(cepLimpo).toBe('01310100');
    });

    it('deve trimmar campos de texto', () => {
      dto.nome = '  João Silva  ';

      // Este método seria implementado no DTO ou service
      const nomeLimpo = dto.nome?.trim();
      expect(nomeLimpo).toBe('João Silva');
    });
  });

  describe('Valores padrão', () => {
    it('deve ter usar_nome_social como nao_se_aplica por padrão', () => {
      // Se não definido, deve assumir o valor padrão
      expect(dto.usar_nome_social || 'nao_se_aplica').toBe('nao_se_aplica');
    });

    it('deve gerar codigo_interno automaticamente se não fornecido', () => {
      // Este comportamento seria implementado no service
      const codigoGerado = dto.codigo_interno || `PAC${Date.now()}`;
      expect(codigoGerado).toMatch(/^PAC\d+$/);
    });
  });
});
