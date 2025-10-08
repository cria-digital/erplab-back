import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { ConveniosController } from './convenios.controller';
import { ConveniosService } from './convenios.service';
import { CreateConvenioExamesDto } from '../../exames/exames/dto/create-convenio-exames.dto';
import { UpdateConvenioExamesDto } from '../../exames/exames/dto/update-convenio-exames.dto';
import { Convenio } from './entities/convenio.entity';

describe('ConveniosController', () => {
  let controller: ConveniosController;
  let service: ConveniosService;

  const mockConveniosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAtivos: jest.fn(),
    findComIntegracao: jest.fn(),
    findByTipoFaturamento: jest.fn(),
    verificarAutorizacao: jest.fn(),
    getRegrasConvenio: jest.fn(),
  };

  const mockConvenio = {
    id: 'convenio-uuid-1',
    empresa_id: 'empresa-uuid-1',
    codigo_convenio: 'CONV001',
    nome: 'Unimed Brasília',
    registro_ans: '123456',
    tem_integracao_api: true,
    url_api: 'https://api.unimed.com.br',
    token_api: 'token123',
    requer_autorizacao: true,
    requer_senha: false,
    validade_guia_dias: 30,
    tipo_faturamento: 'tiss',
    portal_envio: 'SAVI',
    dia_fechamento: 15,
    prazo_pagamento_dias: 30,
    percentual_desconto: 10.5,
    tabela_precos: 'AMB',
    telefone: '61999999999',
    email: 'contato@unimed.com.br',
    contato_nome: 'João Silva',
    regras_especificas: {},
    status: 'ativo',
    aceita_atendimento_online: false,
    percentual_coparticipacao: null,
    valor_consulta: null,
    observacoes_convenio: null,
    criado_em: new Date(),
    atualizado_em: new Date(),
    empresa: {
      id: 'empresa-uuid-1',
      cnpj: '12345678000199',
      razao_social: 'Unimed Brasília Cooperativa',
      nome_fantasia: 'Unimed Brasília',
    } as any,
    planos: [],
    instrucoes: [],
  } as any as Convenio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConveniosController],
      providers: [
        {
          provide: ConveniosService,
          useValue: mockConveniosService,
        },
      ],
    }).compile();

    controller = module.get<ConveniosController>(ConveniosController);
    service = module.get<ConveniosService>(ConveniosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createConvenioDto: CreateConvenioExamesDto = {
      codigo: 'CONV001',
      nome: 'Unimed Brasília',
      razao_social: 'Unimed Brasília Cooperativa',
      cnpj: '12345678000199',
      email: 'contato@unimed.com.br',
      telefone: '61999999999',
    };

    it('deve criar um convênio com sucesso', async () => {
      mockConveniosService.create.mockResolvedValue(mockConvenio);

      const result = await controller.create(createConvenioDto);

      expect(result).toEqual({
        message: 'Convênio criado com sucesso',
        data: mockConvenio,
      });
      expect(service.create).toHaveBeenCalledWith(createConvenioDto);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já cadastrado');
      mockConveniosService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de convênios', async () => {
      const paginatedResult = {
        data: [mockConvenio],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      mockConveniosService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll('1', '10');

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
    });

    it('deve passar filtros para o service', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 2,
        lastPage: 0,
      };

      mockConveniosService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll('2', '5', 'Unimed', 'ativo');

      expect(service.findAll).toHaveBeenCalledWith(2, 5, 'Unimed', 'ativo');
    });

    it('deve usar valores padrão quando não fornecidos', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
      };

      mockConveniosService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar convênios ativos', async () => {
      const conveniosAtivos = [mockConvenio];
      mockConveniosService.findAtivos.mockResolvedValue(conveniosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual({
        message: 'Convênios ativos encontrados',
        data: conveniosAtivos,
      });
      expect(service.findAtivos).toHaveBeenCalled();
    });
  });

  describe('findComIntegracao', () => {
    it('deve retornar convênios com integração', async () => {
      const conveniosComApi = [{ ...mockConvenio, tem_integracao_api: true }];
      mockConveniosService.findComIntegracao.mockResolvedValue(conveniosComApi);

      const result = await controller.findComIntegracao();

      expect(result).toEqual({
        message: 'Convênios com integração encontrados',
        data: conveniosComApi,
      });
      expect(service.findComIntegracao).toHaveBeenCalled();
    });
  });

  describe('findByTipoFaturamento', () => {
    it('deve retornar convênios por tipo de faturamento', async () => {
      const conveniosMensais = [
        { ...mockConvenio, tipo_faturamento: 'mensal' },
      ];
      mockConveniosService.findByTipoFaturamento.mockResolvedValue(
        conveniosMensais,
      );

      const result = await controller.findByTipoFaturamento('mensal');

      expect(result).toEqual({
        message: 'Convênios encontrados com sucesso',
        data: conveniosMensais,
      });
      expect(service.findByTipoFaturamento).toHaveBeenCalledWith('mensal');
    });
  });

  describe('verificarAutorizacao', () => {
    it('deve retornar requisitos de autorização', async () => {
      const autorizacaoData = {
        requerAutorizacao: true,
        requerSenha: false,
      };
      mockConveniosService.verificarAutorizacao.mockResolvedValue(
        autorizacaoData,
      );

      const result = await controller.verificarAutorizacao('convenio-uuid-1');

      expect(result).toEqual({
        message: 'Requisitos de autorização verificados',
        data: autorizacaoData,
      });
      expect(service.verificarAutorizacao).toHaveBeenCalledWith(
        'convenio-uuid-1',
      );
    });
  });

  describe('getRegrasConvenio', () => {
    it('deve retornar regras do convênio', async () => {
      const regrasData = {
        percentualDesconto: 10.5,
        tabelaPrecos: 'AMB',
        validadeGuiaDias: 30,
        regrasEspecificas: {},
      };
      mockConveniosService.getRegrasConvenio.mockResolvedValue(regrasData);

      const result = await controller.getRegrasConvenio('convenio-uuid-1');

      expect(result).toEqual({
        message: 'Regras do convênio obtidas com sucesso',
        data: regrasData,
      });
      expect(service.getRegrasConvenio).toHaveBeenCalledWith('convenio-uuid-1');
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um convênio por código', async () => {
      mockConveniosService.findByCodigo.mockResolvedValue(mockConvenio);

      const result = await controller.findByCodigo('CONV001');

      expect(result).toEqual({
        message: 'Convênio encontrado com sucesso',
        data: mockConvenio,
      });
      expect(service.findByCodigo).toHaveBeenCalledWith('CONV001');
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      const notFoundError = new NotFoundException('Convênio não encontrado');
      mockConveniosService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um convênio por ID', async () => {
      mockConveniosService.findOne.mockResolvedValue(mockConvenio);

      const result = await controller.findOne('convenio-uuid-1');

      expect(result).toEqual({
        message: 'Convênio encontrado com sucesso',
        data: mockConvenio,
      });
      expect(service.findOne).toHaveBeenCalledWith('convenio-uuid-1');
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException('Convênio não encontrado');
      mockConveniosService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateConvenioDto: UpdateConvenioExamesDto = {
      nome: 'Unimed Brasília Atualizado',
      telefone: '61888888888',
    };

    it('deve atualizar um convênio com sucesso', async () => {
      const convenioAtualizado = { ...mockConvenio, ...updateConvenioDto };
      mockConveniosService.update.mockResolvedValue(convenioAtualizado);

      const result = await controller.update(
        'convenio-uuid-1',
        updateConvenioDto,
      );

      expect(result).toEqual({
        message: 'Convênio atualizado com sucesso',
        data: convenioAtualizado,
      });
      expect(service.update).toHaveBeenCalledWith(
        'convenio-uuid-1',
        updateConvenioDto,
      );
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException('Convênio não encontrado');
      mockConveniosService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateConvenioDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já existe');
      mockConveniosService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('convenio-uuid-1', { codigo: 'CONV002' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve desativar um convênio com sucesso', async () => {
      mockConveniosService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('convenio-uuid-1');

      expect(result).toEqual({
        message: 'Convênio desativado com sucesso',
      });
      expect(service.remove).toHaveBeenCalledWith('convenio-uuid-1');
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException('Convênio não encontrado');
      mockConveniosService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
