import {
  ConsultaAuditoriaDto,
  ConsultaHistoricoDto,
} from './consulta-auditoria.dto';
import { TipoOperacao, ModuloOperacao } from '../entities/log-auditoria.entity';
import { createDtoSpec } from '../../../../../test/dto-spec-helper';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

// Testes para ConsultaAuditoriaDto
const validConsultaAuditoriaData = {
  usuarioId: '123e4567-e89b-12d3-a456-426614174000',
  modulo: ModuloOperacao.ADMIN,
  tabela: 'usuarios',
  tipoOperacao: TipoOperacao.CREATE,
  dataInicio: '2024-01-01T00:00:00Z',
  dataFim: '2024-12-31T23:59:59Z',
  operacaoSensivel: false,
  falhaOperacao: false,
  page: 1,
  limit: 50,
};

const invalidConsultaAuditoriaData = [
  {
    field: 'usuarioId',
    value: 'invalid-uuid',
    expectedError: 'must be a UUID',
  },
  {
    field: 'modulo',
    value: 'INVALID_MODULE',
  },
  {
    field: 'tipoOperacao',
    value: 'INVALID_OPERATION',
  },
  {
    field: 'dataInicio',
    value: 'invalid-date',
    expectedError: 'must be a valid ISO 8601 date string',
  },
  {
    field: 'dataFim',
    value: 'invalid-date',
    expectedError: 'must be a valid ISO 8601 date string',
  },
  {
    field: 'page',
    value: 0,
    expectedError: 'must not be less than 1',
  },
  {
    field: 'limit',
    value: 0,
    expectedError: 'must not be less than 1',
  },
  {
    field: 'limit',
    value: 101,
    expectedError: 'must not be greater than 100',
  },
];

createDtoSpec(
  ConsultaAuditoriaDto,
  'ConsultaAuditoriaDto',
  validConsultaAuditoriaData,
  invalidConsultaAuditoriaData,
);

// Testes específicos para transformações
describe('ConsultaAuditoriaDto - Transformações', () => {
  it('deve transformar strings boolean para boolean em operacaoSensivel', async () => {
    const data = { ...validConsultaAuditoriaData, operacaoSensivel: 'true' };
    const dto = plainToInstance(ConsultaAuditoriaDto, data);

    expect(dto.operacaoSensivel).toBe(true);
  });

  it('deve transformar strings boolean para boolean em falhaOperacao', async () => {
    const data = { ...validConsultaAuditoriaData, falhaOperacao: 'true' };
    const dto = plainToInstance(ConsultaAuditoriaDto, data);

    expect(dto.falhaOperacao).toBe(true);
  });

  it('deve transformar strings numéricas para number em page', async () => {
    const data = { ...validConsultaAuditoriaData, page: '2' };
    const dto = plainToInstance(ConsultaAuditoriaDto, data);

    expect(dto.page).toBe(2);
    expect(typeof dto.page).toBe('number');
  });

  it('deve transformar strings numéricas para number em limit', async () => {
    const data = { ...validConsultaAuditoriaData, limit: '25' };
    const dto = plainToInstance(ConsultaAuditoriaDto, data);

    expect(dto.limit).toBe(25);
    expect(typeof dto.limit).toBe('number');
  });

  it('deve usar valores padrão quando não fornecidos', async () => {
    const data = {};
    const dto = plainToInstance(ConsultaAuditoriaDto, data);

    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(50);
  });
});

// Testes para ConsultaHistoricoDto
const validConsultaHistoricoData = {
  usuarioId: '123e4567-e89b-12d3-a456-426614174000',
  tabelaOrigem: 'usuarios',
  registroId: '123e4567-e89b-12d3-a456-426614174000',
  campoAlterado: 'email',
  dataInicio: '2024-01-01T00:00:00Z',
  dataFim: '2024-12-31T23:59:59Z',
  alteracaoCritica: false,
  requerAprovacao: false,
  aprovada: true,
  page: 1,
  limit: 50,
};

const invalidConsultaHistoricoData = [
  {
    field: 'usuarioId',
    value: 'invalid-uuid',
    expectedError: 'must be a UUID',
  },
  {
    field: 'dataInicio',
    value: 'invalid-date',
    expectedError: 'must be a valid ISO 8601 date string',
  },
  {
    field: 'dataFim',
    value: 'invalid-date',
    expectedError: 'must be a valid ISO 8601 date string',
  },
  {
    field: 'page',
    value: 0,
    expectedError: 'must not be less than 1',
  },
  {
    field: 'limit',
    value: 0,
    expectedError: 'must not be less than 1',
  },
  {
    field: 'limit',
    value: 101,
    expectedError: 'must not be greater than 100',
  },
];

createDtoSpec(
  ConsultaHistoricoDto,
  'ConsultaHistoricoDto',
  validConsultaHistoricoData,
  invalidConsultaHistoricoData,
);

// Testes específicos para transformações do ConsultaHistoricoDto
describe('ConsultaHistoricoDto - Transformações', () => {
  it('deve transformar strings boolean para boolean em alteracaoCritica', async () => {
    const data = { ...validConsultaHistoricoData, alteracaoCritica: 'true' };
    const dto = plainToInstance(ConsultaHistoricoDto, data);

    expect(dto.alteracaoCritica).toBe(true);
  });

  it('deve transformar strings boolean para boolean em requerAprovacao', async () => {
    const data = { ...validConsultaHistoricoData, requerAprovacao: 'true' };
    const dto = plainToInstance(ConsultaHistoricoDto, data);

    expect(dto.requerAprovacao).toBe(true);
  });

  it('deve transformar strings boolean para boolean em aprovada', async () => {
    const data = { ...validConsultaHistoricoData, aprovada: 'false' };
    const dto = plainToInstance(ConsultaHistoricoDto, data);

    expect(dto.aprovada).toBe(false);
  });

  it('deve usar valores padrão quando não fornecidos', async () => {
    const data = {};
    const dto = plainToInstance(ConsultaHistoricoDto, data);

    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(50);
  });
});

// Testes de casos específicos para filtros de auditoria
describe('ConsultaAuditoriaDto - Casos Específicos', () => {
  it('deve aceitar todos os campos opcionais', async () => {
    const dto = plainToInstance(ConsultaAuditoriaDto, {});
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('deve aceitar todos os valores de enum válidos para ModuloOperacao', async () => {
    const modulos = Object.values(ModuloOperacao);

    for (const modulo of modulos) {
      const data = { ...validConsultaAuditoriaData, modulo };
      const dto = plainToInstance(ConsultaAuditoriaDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    }
  });

  it('deve aceitar todos os valores de enum válidos para TipoOperacao', async () => {
    const tipos = Object.values(TipoOperacao);

    for (const tipo of tipos) {
      const data = { ...validConsultaAuditoriaData, tipoOperacao: tipo };
      const dto = plainToInstance(ConsultaAuditoriaDto, data);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    }
  });
});

describe('ConsultaHistoricoDto - Casos Específicos', () => {
  it('deve aceitar todos os campos opcionais', async () => {
    const dto = plainToInstance(ConsultaHistoricoDto, {});
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('deve aceitar registroId não-UUID (pode ser inteiro ou string)', async () => {
    const data = { ...validConsultaHistoricoData, registroId: '12345' };
    const dto = plainToInstance(ConsultaHistoricoDto, data);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
