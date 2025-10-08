import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { ConvenioController } from './convenio.controller';
import { ConvenioService } from '../services/convenio.service';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';
import {
  Convenio,
  TipoFaturamento,
  StatusConvenio,
} from '../entities/convenio.entity';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('ConvenioController', () => {
  let controller: ConvenioController;
  let service: ConvenioService;

  const mockConvenioService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    search: jest.fn(),
    findByCodigo: jest.fn(),
    findByCnpj: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    remove: jest.fn(),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Convênio Teste Ltda',
    nomeFantasia: 'Convênio Teste',
    emailComercial: 'contato@convenioteste.com.br',
    ativo: true,
  };

  const mockConvenio = {
    id: 'convenio-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigo_convenio: 'CONV001',
    nome: 'Convênio Teste',
    registro_ans: '123456',
    tem_integracao_api: false,
    url_api: null,
    token_api: null,
    requer_autorizacao: true,
    requer_senha: false,
    validade_guia_dias: 30,
    tipo_faturamento: TipoFaturamento.MENSAL,
    portal_envio: 'https://portal.convenio.com.br',
    dia_fechamento: 15,
    prazo_pagamento_dias: 30,
    percentual_desconto: 5.0,
    tabela_precos: 'TUSS',
    telefone: '(11) 1234-5678',
    email: 'faturamento@convenio.com.br',
    contato_nome: 'João Silva',
    regras_especificas: null,
    status: StatusConvenio.ATIVO,
    aceita_atendimento_online: false,
    percentual_coparticipacao: 20.0,
    valor_consulta: 150.0,
    observacoes_convenio: 'Convênio para testes',
    criado_em: new Date(),
    atualizado_em: new Date(),
    planos: [],
    instrucoes: [],
  } as Convenio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvenioController],
      providers: [
        {
          provide: ConvenioService,
          useValue: mockConvenioService,
        },
      ],
    }).compile();

    controller = module.get<ConvenioController>(ConvenioController);
    service = module.get<ConvenioService>(ConvenioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createConvenioDto: CreateConvenioDto = {
      empresa: {
        tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'Convênio Teste Ltda',
        nomeFantasia: 'Convênio Teste',
        emailComercial: 'contato@convenioteste.com.br',
      },
      codigo_convenio: 'CONV001',
      nome: 'Convênio Teste',
      requer_autorizacao: true,
      prazo_pagamento_dias: 30,
    };

    it('deve criar um convênio com sucesso', async () => {
      mockConvenioService.create.mockResolvedValue(mockConvenio);

      const result = await controller.create(createConvenioDto);

      expect(result).toEqual(mockConvenio);
      expect(service.create).toHaveBeenCalledWith(createConvenioDto);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException(
        'Já existe um convênio com este código',
      );
      mockConvenioService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(createConvenioDto);
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      const conflictError = new ConflictException(
        'Já existe uma empresa com este CNPJ',
      );
      mockConvenioService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar convênio com dados completos', async () => {
      const createCompleto = {
        ...createConvenioDto,
        registro_ans: '123456',
        tem_integracao_api: true,
        url_api: 'https://api.convenio.com.br',
        token_api: 'token123',
        validade_guia_dias: 60,
        tipo_faturamento: TipoFaturamento.QUINZENAL,
        percentual_desconto: 10.0,
        aceita_atendimento_online: true,
      };

      const convenioCompleto = { ...mockConvenio, ...createCompleto };
      mockConvenioService.create.mockResolvedValue(convenioCompleto);

      const result = await controller.create(createCompleto);

      expect(result).toEqual(convenioCompleto);
      expect(result.tem_integracao_api).toBe(true);
      expect(result.aceita_atendimento_online).toBe(true);
    });

    it('deve criar convênio com diferentes tipos de faturamento', async () => {
      const createSemanal = {
        ...createConvenioDto,
        tipo_faturamento: TipoFaturamento.SEMANAL,
        dia_fechamento: 7,
      };

      const convenioSemanal = {
        ...mockConvenio,
        tipo_faturamento: TipoFaturamento.SEMANAL,
        dia_fechamento: 7,
      };

      mockConvenioService.create.mockResolvedValue(convenioSemanal);

      const result = await controller.create(createSemanal);

      expect(result.tipo_faturamento).toBe(TipoFaturamento.SEMANAL);
      expect(result.dia_fechamento).toBe(7);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de convênios', async () => {
      const convenios = [mockConvenio];
      mockConvenioService.findAll.mockResolvedValue(convenios);

      const result = await controller.findAll();

      expect(result).toEqual(convenios);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há convênios', async () => {
      mockConvenioService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve retornar convênios ordenados por nome fantasia', async () => {
      const convenio1 = {
        ...mockConvenio,
        id: 'conv-1',
        empresa: { ...mockEmpresa, nomeFantasia: 'B Convênio' },
      };
      const convenio2 = {
        ...mockConvenio,
        id: 'conv-2',
        empresa: { ...mockEmpresa, nomeFantasia: 'A Convênio' },
      };

      mockConvenioService.findAll.mockResolvedValue([convenio1, convenio2]);

      const result = await controller.findAll();

      expect(result).toEqual([convenio1, convenio2]);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas convênios ativos', async () => {
      const conveniosAtivos = [mockConvenio];
      mockConvenioService.findAtivos.mockResolvedValue(conveniosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual(conveniosAtivos);
      expect(service.findAtivos).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há convênios ativos', async () => {
      mockConvenioService.findAtivos.mockResolvedValue([]);

      const result = await controller.findAtivos();

      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('deve buscar convênios por termo', async () => {
      const resultados = [mockConvenio];
      mockConvenioService.search.mockResolvedValue(resultados);

      const result = await controller.search('Teste');

      expect(result).toEqual(resultados);
      expect(service.search).toHaveBeenCalledWith('Teste');
    });

    it('deve buscar convênios por código', async () => {
      const resultados = [mockConvenio];
      mockConvenioService.search.mockResolvedValue(resultados);

      const result = await controller.search('CONV001');

      expect(result).toEqual(resultados);
      expect(service.search).toHaveBeenCalledWith('CONV001');
    });

    it('deve buscar convênios por CNPJ', async () => {
      const resultados = [mockConvenio];
      mockConvenioService.search.mockResolvedValue(resultados);

      const result = await controller.search('12.345.678');

      expect(result).toEqual(resultados);
      expect(service.search).toHaveBeenCalledWith('12.345.678');
    });

    it('deve retornar lista vazia quando não encontrar resultados', async () => {
      mockConvenioService.search.mockResolvedValue([]);

      const result = await controller.search('inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar convênio por código', async () => {
      mockConvenioService.findByCodigo.mockResolvedValue(mockConvenio);

      const result = await controller.findByCodigo('CONV001');

      expect(result).toEqual(mockConvenio);
      expect(service.findByCodigo).toHaveBeenCalledWith('CONV001');
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Convênio com código INEXISTENTE não encontrado',
      );
      mockConvenioService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo('INEXISTENTE')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCodigo).toHaveBeenCalledWith('INEXISTENTE');
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar convênio por CNPJ', async () => {
      mockConvenioService.findByCnpj.mockResolvedValue(mockConvenio);

      const result = await controller.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockConvenio);
      expect(service.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Convênio com CNPJ 00.000.000/0000-00 não encontrado',
      );
      mockConvenioService.findByCnpj.mockRejectedValue(notFoundError);

      await expect(controller.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCnpj).toHaveBeenCalledWith('00.000.000/0000-00');
    });

    it('deve buscar CNPJ com formatação diferente', async () => {
      mockConvenioService.findByCnpj.mockResolvedValue(mockConvenio);

      const result = await controller.findByCnpj('12345678000190');

      expect(result).toEqual(mockConvenio);
      expect(service.findByCnpj).toHaveBeenCalledWith('12345678000190');
    });
  });

  describe('findOne', () => {
    it('deve retornar um convênio por ID', async () => {
      mockConvenioService.findOne.mockResolvedValue(mockConvenio);

      const result = await controller.findOne('convenio-uuid-1');

      expect(result).toEqual(mockConvenio);
      expect(service.findOne).toHaveBeenCalledWith('convenio-uuid-1');
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Convênio com ID invalid-id não encontrado',
      );
      mockConvenioService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    const updateConvenioDto: UpdateConvenioDto = {
      nome: 'Convênio Atualizado',
      prazo_pagamento_dias: 45,
    };

    it('deve atualizar um convênio com sucesso', async () => {
      const convenioAtualizado = {
        ...mockConvenio,
        ...updateConvenioDto,
      };
      mockConvenioService.update.mockResolvedValue(convenioAtualizado);

      const result = await controller.update(
        'convenio-uuid-1',
        updateConvenioDto,
      );

      expect(result).toEqual(convenioAtualizado);
      expect(service.update).toHaveBeenCalledWith(
        'convenio-uuid-1',
        updateConvenioDto,
      );
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Convênio com ID invalid-id não encontrado',
      );
      mockConvenioService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateConvenioDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        'invalid-id',
        updateConvenioDto,
      );
    });

    it('deve retornar erro quando novo código já existir', async () => {
      const updateComNovoCodigo = {
        ...updateConvenioDto,
        codigo_convenio: 'CONV002',
      };
      const conflictError = new ConflictException(
        'Já existe um convênio com este código',
      );
      mockConvenioService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('convenio-uuid-1', updateComNovoCodigo),
      ).rejects.toThrow(ConflictException);
    });

    it('deve atualizar dados da empresa', async () => {
      const updateComEmpresa = {
        ...updateConvenioDto,
        empresa: {
          tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Empresa Atualizada Ltda',
          nomeFantasia: 'Empresa Atualizada',
          emailComercial: 'novo@email.com',
        },
      };

      const convenioAtualizado = {
        ...mockConvenio,
        ...updateComEmpresa,
        empresa: {
          ...mockEmpresa,
          nomeFantasia: 'Empresa Atualizada',
          emailComercial: 'novo@email.com',
        },
      };

      mockConvenioService.update.mockResolvedValue(convenioAtualizado);

      const result = await controller.update(
        'convenio-uuid-1',
        updateComEmpresa,
      );

      expect(result).toEqual(convenioAtualizado);
      expect(result.empresa.nomeFantasia).toBe('Empresa Atualizada');
    });

    it('deve atualizar configurações de integração', async () => {
      const updateIntegracao = {
        tem_integracao_api: true,
        url_api: 'https://nova-api.convenio.com.br',
        token_api: 'novo-token-123',
        requer_autorizacao: false,
      };

      const convenioAtualizado = {
        ...mockConvenio,
        ...updateIntegracao,
      };

      mockConvenioService.update.mockResolvedValue(convenioAtualizado);

      const result = await controller.update(
        'convenio-uuid-1',
        updateIntegracao,
      );

      expect(result.tem_integracao_api).toBe(true);
      expect(result.url_api).toBe('https://nova-api.convenio.com.br');
      expect(result.requer_autorizacao).toBe(false);
    });

    it('deve atualizar dados financeiros', async () => {
      const updateFinanceiro = {
        tipo_faturamento: TipoFaturamento.QUINZENAL,
        dia_fechamento: 20,
        prazo_pagamento_dias: 60,
        percentual_desconto: 15.0,
        percentual_coparticipacao: 25.0,
        valor_consulta: 200.0,
      };

      const convenioAtualizado = {
        ...mockConvenio,
        ...updateFinanceiro,
      };

      mockConvenioService.update.mockResolvedValue(convenioAtualizado);

      const result = await controller.update(
        'convenio-uuid-1',
        updateFinanceiro,
      );

      expect(result.tipo_faturamento).toBe(TipoFaturamento.QUINZENAL);
      expect(result.percentual_desconto).toBe(15.0);
      expect(result.valor_consulta).toBe(200.0);
    });
  });

  describe('toggleStatus', () => {
    it('deve ativar convênio inativo', async () => {
      const convenioAtivado = {
        ...mockConvenio,
        empresa: { ...mockEmpresa, ativo: true },
      };
      mockConvenioService.toggleStatus.mockResolvedValue(convenioAtivado);

      const result = await controller.toggleStatus('convenio-uuid-1');

      expect(result).toEqual(convenioAtivado);
      expect(result.empresa.ativo).toBe(true);
      expect(service.toggleStatus).toHaveBeenCalledWith('convenio-uuid-1');
    });

    it('deve desativar convênio ativo', async () => {
      const convenioDesativado = {
        ...mockConvenio,
        empresa: { ...mockEmpresa, ativo: false },
      };
      mockConvenioService.toggleStatus.mockResolvedValue(convenioDesativado);

      const result = await controller.toggleStatus('convenio-uuid-1');

      expect(result).toEqual(convenioDesativado);
      expect(result.empresa.ativo).toBe(false);
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Convênio com ID invalid-id não encontrado',
      );
      mockConvenioService.toggleStatus.mockRejectedValue(notFoundError);

      await expect(controller.toggleStatus('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.toggleStatus).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('remove', () => {
    it('deve remover um convênio com sucesso', async () => {
      mockConvenioService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('convenio-uuid-1');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('convenio-uuid-1');
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Convênio com ID invalid-id não encontrado',
      );
      mockConvenioService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalid-id');
    });
  });
});
