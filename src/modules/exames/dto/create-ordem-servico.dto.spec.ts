import {
  CreateOrdemServicoDto,
  ExameOrdemServicoDto,
} from './create-ordem-servico.dto';
import { createCreateDtoSpec } from '../../../../test/dto-spec-helper';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Definir campos obrigatórios e opcionais para CreateOrdemServicoDto
const requiredFields = [
  'paciente_id',
  'unidade_saude_id',
  'data_atendimento',
  'canal_origem',
  'tipo_atendimento',
  'exames',
  'empresa_id',
];

const optionalFields = [
  'data_coleta_prevista',
  'prioridade',
  'convenio_id',
  'numero_guia',
  'senha_autorizacao',
  'validade_guia',
  'medico_solicitante',
  'crm_solicitante',
  'clinica_origem',
  'observacoes',
  'notas_internas',
  'orientacoes_paciente',
  'documentos_anexados',
  'forma_entrega',
  'dados_entrega',
];

// Criar testes básicos para CreateOrdemServicoDto
createCreateDtoSpec(
  CreateOrdemServicoDto,
  'CreateOrdemServicoDto',
  requiredFields,
  optionalFields,
);

// Testes específicos para CreateOrdemServicoDto
describe('CreateOrdemServicoDto - Validações Específicas', () => {
  const validExameData = {
    exame_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    quantidade: 1,
    valor_unitario: 25.0,
    valor_desconto: 0,
    observacoes: 'Exame normal',
    is_urgente: false,
  };

  const validData = {
    paciente_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    unidade_saude_id: 'f6749f41-187e-4a05-8fe7-285ef87e99f1',
    data_atendimento: '2024-01-15T10:30:00Z',
    data_coleta_prevista: '2024-01-16',
    canal_origem: 'presencial',
    prioridade: 'normal',
    tipo_atendimento: 'particular',
    convenio_id: 1,
    numero_guia: '123456789',
    senha_autorizacao: 'AUTH123',
    validade_guia: '2024-02-15',
    medico_solicitante: 'Dr. João Silva',
    crm_solicitante: 'CRM-SP 123456',
    clinica_origem: 'Hospital São Paulo',
    exames: [validExameData],
    observacoes: 'Paciente em jejum de 12 horas',
    notas_internas: 'Verificar convênio antes da coleta',
    orientacoes_paciente: 'Trazer documento com foto',
    documentos_anexados: ['https://storage.com/pedido.pdf'],
    forma_entrega: 'email',
    dados_entrega: 'paciente@email.com',
    empresa_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  };

  describe('campos obrigatórios', () => {
    it('deve aceitar dados válidos completos', async () => {
      const dto = plainToInstance(CreateOrdemServicoDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve validar paciente_id como string', async () => {
      const data = { ...validData, paciente_id: 123 };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      const errors = await validate(dto);

      const pacienteError = errors.find(
        (error) => error.property === 'paciente_id',
      );
      expect(pacienteError).toBeDefined();
      expect(pacienteError.constraints).toHaveProperty('isString');
    });

    it('deve validar unidade_saude_id como UUID', async () => {
      const data = { ...validData, unidade_saude_id: 'invalid-uuid' };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      const errors = await validate(dto);

      const unidadeError = errors.find(
        (error) => error.property === 'unidade_saude_id',
      );
      expect(unidadeError).toBeDefined();
      expect(unidadeError.constraints).toHaveProperty('isUuid');
    });

    it('deve validar data_atendimento como ISO string', async () => {
      const data = { ...validData, data_atendimento: 'invalid-date' };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      const errors = await validate(dto);

      const dataError = errors.find(
        (error) => error.property === 'data_atendimento',
      );
      expect(dataError).toBeDefined();
      expect(dataError.constraints).toHaveProperty('isDateString');
    });
  });

  describe('enums', () => {
    it('deve aceitar todos os valores válidos de canal_origem', async () => {
      const canaisValidos = [
        'presencial',
        'whatsapp',
        'telefone',
        'email',
        'portal',
        'domiciliar',
      ];

      for (const canal of canaisValidos) {
        const data = { ...validData, canal_origem: canal };
        const dto = plainToInstance(CreateOrdemServicoDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve rejeitar valores inválidos de canal_origem', async () => {
      const data = { ...validData, canal_origem: 'invalid_channel' };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      const errors = await validate(dto);

      const canalError = errors.find(
        (error) => error.property === 'canal_origem',
      );
      expect(canalError).toBeDefined();
      expect(canalError.constraints).toHaveProperty('isEnum');
    });

    it('deve aceitar todos os valores válidos de prioridade', async () => {
      const prioridadesValidas = ['normal', 'urgente', 'emergencia'];

      for (const prioridade of prioridadesValidas) {
        const data = { ...validData, prioridade };
        const dto = plainToInstance(CreateOrdemServicoDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve aceitar todos os valores válidos de tipo_atendimento', async () => {
      const tiposValidos = ['particular', 'convenio', 'sus'];

      for (const tipo of tiposValidos) {
        const data = { ...validData, tipo_atendimento: tipo };
        const dto = plainToInstance(CreateOrdemServicoDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });

    it('deve aceitar todos os valores válidos de forma_entrega', async () => {
      const formasValidas = [
        'presencial',
        'email',
        'whatsapp',
        'portal',
        'correios',
      ];

      for (const forma of formasValidas) {
        const data = { ...validData, forma_entrega: forma };
        const dto = plainToInstance(CreateOrdemServicoDto, data);
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('array de exames', () => {
    it('deve aceitar array de exames válido', async () => {
      const dto = plainToInstance(CreateOrdemServicoDto, validData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.exames).toHaveLength(1);
    });

    it('deve aceitar array vazio de exames', async () => {
      const data = { ...validData, exames: [] };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      await validate(dto);

      // O validation não vai falhar aqui pois @IsArray não valida tamanho mínimo
      // Mas vamos testar se é um array válido
      expect(dto.exames).toEqual([]);
    });

    it('deve validar múltiplos exames', async () => {
      const exame2 = {
        ...validExameData,
        exame_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
        quantidade: 2,
      };

      const data = { ...validData, exames: [validExameData, exame2] };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(dto.exames).toHaveLength(2);
    });
  });

  describe('campos opcionais', () => {
    it('deve aceitar quando campos opcionais não são fornecidos', async () => {
      const dataMinima = {
        paciente_id: validData.paciente_id,
        unidade_saude_id: validData.unidade_saude_id,
        data_atendimento: validData.data_atendimento,
        canal_origem: validData.canal_origem,
        tipo_atendimento: validData.tipo_atendimento,
        exames: validData.exames,
        empresa_id: validData.empresa_id,
      };

      const dto = plainToInstance(CreateOrdemServicoDto, dataMinima);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar convenio_id como número', async () => {
      const data = { ...validData, convenio_id: 123 };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve validar datas opcionais como ISO string', async () => {
      const data = { ...validData, data_coleta_prevista: 'invalid-date' };
      const dto = plainToInstance(CreateOrdemServicoDto, data);
      const errors = await validate(dto);

      const dataError = errors.find(
        (error) => error.property === 'data_coleta_prevista',
      );
      expect(dataError).toBeDefined();
      expect(dataError.constraints).toHaveProperty('isDateString');
    });
  });
});

// Testes específicos para ExameOrdemServicoDto
describe('ExameOrdemServicoDto - Validações Específicas', () => {
  const validExameData = {
    exame_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    quantidade: 1,
    valor_unitario: 25.0,
    valor_desconto: 5.0,
    observacoes: 'Paciente relata alergia ao látex',
    is_urgente: false,
  };

  describe('campos obrigatórios', () => {
    it('deve aceitar exame_id válido', async () => {
      const dto = plainToInstance(ExameOrdemServicoDto, validExameData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar quando exame_id está vazio', async () => {
      const data = { ...validExameData, exame_id: '' };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      const exameIdError = errors.find(
        (error) => error.property === 'exame_id',
      );
      expect(exameIdError).toBeDefined();
      expect(exameIdError.constraints).toHaveProperty('isNotEmpty');
    });

    it('deve rejeitar quando exame_id não é string', async () => {
      const data = { ...validExameData, exame_id: 123 };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      const exameIdError = errors.find(
        (error) => error.property === 'exame_id',
      );
      expect(exameIdError).toBeDefined();
      expect(exameIdError.constraints).toHaveProperty('isString');
    });
  });

  describe('quantidade', () => {
    it('deve aceitar quantidade válida', async () => {
      const data = { ...validExameData, quantidade: 5 };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar quantidade menor que 1', async () => {
      const data = { ...validExameData, quantidade: 0 };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      const qtdError = errors.find((error) => error.property === 'quantidade');
      expect(qtdError).toBeDefined();
      expect(qtdError.constraints).toHaveProperty('min');
    });

    it('deve rejeitar quantidade negativa', async () => {
      const data = { ...validExameData, quantidade: -1 };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      const qtdError = errors.find((error) => error.property === 'quantidade');
      expect(qtdError).toBeDefined();
      expect(qtdError.constraints).toHaveProperty('min');
    });

    it('deve aceitar quando quantidade não é fornecida (opcional)', async () => {
      const data = { exame_id: validExameData.exame_id };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('valores monetários', () => {
    it('deve aceitar valores monetários válidos', async () => {
      const data = {
        ...validExameData,
        valor_unitario: 100.5,
        valor_desconto: 10.25,
      };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar valores zerados', async () => {
      const data = {
        ...validExameData,
        valor_unitario: 0,
        valor_desconto: 0,
      };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve rejeitar valores não numéricos', async () => {
      const data = { ...validExameData, valor_unitario: 'não-número' };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      const valorError = errors.find(
        (error) => error.property === 'valor_unitario',
      );
      expect(valorError).toBeDefined();
      expect(valorError.constraints).toHaveProperty('isNumber');
    });
  });

  describe('campos opcionais', () => {
    it('deve aceitar apenas campos obrigatórios', async () => {
      const dataMinima = { exame_id: validExameData.exame_id };
      const dto = plainToInstance(ExameOrdemServicoDto, dataMinima);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar observacoes como string', async () => {
      const data = {
        ...validExameData,
        observacoes: 'Observação longa sobre o exame',
      };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('deve aceitar is_urgente como boolean', async () => {
      const data = { ...validExameData, is_urgente: true };
      const dto = plainToInstance(ExameOrdemServicoDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });

  describe('instanciação', () => {
    it('deve criar instância com propriedades corretas', () => {
      const dto = new ExameOrdemServicoDto();

      expect(dto).toHaveProperty('exame_id');
      expect(dto).toHaveProperty('quantidade');
      expect(dto).toHaveProperty('valor_unitario');
      expect(dto).toHaveProperty('valor_desconto');
      expect(dto).toHaveProperty('observacoes');
      expect(dto).toHaveProperty('is_urgente');
    });

    it('deve atribuir valores corretamente', () => {
      const dto = plainToInstance(ExameOrdemServicoDto, validExameData);

      expect(dto.exame_id).toBe(validExameData.exame_id);
      expect(dto.quantidade).toBe(validExameData.quantidade);
      expect(dto.valor_unitario).toBe(validExameData.valor_unitario);
      expect(dto.valor_desconto).toBe(validExameData.valor_desconto);
      expect(dto.observacoes).toBe(validExameData.observacoes);
      expect(dto.is_urgente).toBe(validExameData.is_urgente);
    });
  });
});
