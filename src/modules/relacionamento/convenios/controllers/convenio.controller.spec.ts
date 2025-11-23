import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { ConvenioController } from './convenio.controller';
import { ConvenioService } from '../services/convenio.service';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';
import { Convenio } from '../entities/convenio.entity';
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
    nome: 'Convênio Teste',
    registro_ans: '123456',
    matricula: null,
    tipo_convenio_id: null,
    forma_liquidacao_id: null,
    envio_faturamento_id: null,
    tabela_servico_id: null,
    tabela_base_id: null,
    tabela_material_id: null,
    integracao_id: null,
    valor_ch: 100.0,
    valor_filme: 50.0,
    codigo_tiss: null,
    versao_tiss: null,
    url_tiss: null,
    autorizacao_online: false,
    fatura_ate_dia: 20,
    dia_vencimento: 10,
    data_contrato: null,
    data_ultimo_ajuste: null,
    instrucoes_faturamento: null,
    cnes: null,
    co_participacao: false,
    nota_fiscal_exige_fatura: false,
    contato: null,
    instrucoes: null,
    observacoes_gerais: null,
    ativo: true,
    criado_em: new Date(),
    atualizado_em: new Date(),
    planos: [],
    instrucoes_historico: [],
  } as any as Convenio;

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
      nome: 'Convênio Teste',
      registro_ans: '123456',
      matricula: null,
    };

    it('deve criar um convênio com sucesso', async () => {
      mockConvenioService.create.mockResolvedValue(mockConvenio);

      const result = await controller.create(createConvenioDto);

      expect(result).toEqual(mockConvenio);
      expect(service.create).toHaveBeenCalledWith(createConvenioDto);
    });

    // Convênios agora são criados pelo EmpresaService
    it.skip('deve retornar erro quando código já existir', async () => {
      // Teste obsoleto - campo codigo removido
      expect(true).toBe(true);
    });

    it.skip('deve retornar erro quando CNPJ já existir', async () => {
      // Teste obsoleto - validação feita no EmpresaService
      expect(true).toBe(true);
    });

    // TODO: Refatorar após migration - campos antigos removidos
    it.skip('deve criar convênio com dados completos', async () => {
      const createCompleto = {
        ...createConvenioDto,
        registro_ans: '123456',
        integracao_id: 'uuid-integracao',
        valor_ch: 100.0,
        valor_filme: 50.0,
      };

      const convenioCompleto = { ...mockConvenio, ...createCompleto };
      mockConvenioService.create.mockResolvedValue(convenioCompleto);

      const result = await controller.create(createCompleto);

      expect(result).toEqual(convenioCompleto);
      expect(result.integracao_id).toBe('uuid-integracao');
    });

    it('deve criar convênio com diferentes tipos de faturamento', async () => {
      const createSemanal = {
        ...createConvenioDto,
        fatura_ate_dia: 7,
      };

      const convenioSemanal = {
        ...mockConvenio,
        envioFaturamento: { textoAlternativa: 'Semanal' } as any,
        fatura_ate_dia: 7,
      };

      mockConvenioService.create.mockResolvedValue(convenioSemanal);

      const result = await controller.create(createSemanal);

      expect(result.envioFaturamento).toBeDefined();
      expect(result.fatura_ate_dia).toBe(7);
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

  // TODO: Refatorar após migration - método findByCodigo comentado
  describe.skip('findByCodigo', () => {
    it('deve retornar convênio por código', async () => {
      // mockConvenioService.findByCodigo.mockResolvedValue(mockConvenio);
      // const result = await controller.findByCodigo('CONV001');
      expect(mockConvenio).toBeDefined();
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      expect(true).toBe(true);
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
      registro_ans: '654321',
      valor_ch: 150.0,
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

    // TODO: Refatorar após migration - campos antigos removidos
    it.skip('deve atualizar configurações de integração', async () => {
      const updateIntegracao = {
        nome: 'Convênio Atualizado',
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

      expect(result.nome).toBe('Convênio Atualizado');
    });

    // TODO: Refatorar após migration - campos antigos removidos
    it.skip('deve atualizar dados financeiros', async () => {
      const updateFinanceiro = {
        nome: 'Convênio Financeiro Atualizado',
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

      expect(result.nome).toBe('Convênio Financeiro Atualizado');
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
