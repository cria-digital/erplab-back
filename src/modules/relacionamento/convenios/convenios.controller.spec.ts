import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { ConveniosController } from './convenios.controller';
import { ConvenioService } from './services/convenio.service';
import { CreateConvenioExamesDto } from '../../exames/exames/dto/create-convenio-exames.dto';
import { UpdateConvenioExamesDto } from '../../exames/exames/dto/update-convenio-exames.dto';
import { Convenio } from './entities/convenio.entity';

describe('ConveniosController', () => {
  let controller: ConveniosController;
  let service: ConvenioService;

  const mockConvenioService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    // findByCodigo: jest.fn(), // TODO: Removido após migration
    update: jest.fn(),
    remove: jest.fn(),
    findAtivos: jest.fn(),
    // findComIntegracao: jest.fn(), // TODO: Removido após migration
    // findByTipoFaturamento: jest.fn(), // TODO: Removido após migration
    // verificarAutorizacao: jest.fn(), // TODO: Removido após migration
    // getRegrasConvenio: jest.fn(), // TODO: Removido após migration
  };

  const mockConvenio = {
    id: 'convenio-uuid-1',
    empresa_id: 'empresa-uuid-1',
    nome: 'Unimed Brasília',
    registro_ans: '123456',
    matricula: null,
    tipo_convenio_id: null,
    forma_liquidacao_id: null,
    valor_ch: null,
    valor_filme: null,
    tiss: false,
    versao_tiss: null,
    codigo_operadora_tiss: null,
    codigo_operadora_autorizacao: null,
    codigo_prestador: null,
    envio_faturamento_id: null,
    fatura_ate_dia: null,
    dia_vencimento: null,
    data_contrato: null,
    data_ultimo_ajuste: null,
    instrucoes_faturamento: null,
    tabela_servico_id: null,
    tabela_base_id: null,
    tabela_material_id: null,
    cnes: null,
    co_participacao: false,
    nota_fiscal_exige_fatura: false,
    contato: null,
    instrucoes: null,
    observacoes_gerais: null,
    integracao_id: null,
    ativo: true,
    criado_em: new Date(),
    atualizado_em: new Date(),
    empresa: {
      id: 'empresa-uuid-1',
      cnpj: '12345678000199',
      razao_social: 'Unimed Brasília Cooperativa',
      nome_fantasia: 'Unimed Brasília',
    } as any,
    planos: [],
    instrucoes_historico: [],
  } as any as Convenio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConveniosController],
      providers: [
        {
          provide: ConvenioService,
          useValue: mockConvenioService,
        },
      ],
    }).compile();

    controller = module.get<ConveniosController>(ConveniosController);
    service = module.get<ConvenioService>(ConvenioService);
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
      mockConvenioService.create.mockResolvedValue(mockConvenio);

      const result = await controller.create(createConvenioDto);

      expect(result).toEqual({
        message: 'Convênio criado com sucesso',
        data: mockConvenio,
      });
      expect(service.create).toHaveBeenCalledWith(createConvenioDto);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já cadastrado');
      mockConvenioService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de convênios', async () => {
      const convenios = [mockConvenio];
      mockConvenioService.findAll.mockResolvedValue(convenios);

      const result = await controller.findAll();

      expect(result).toEqual({
        message: 'Convênios encontrados',
        data: convenios,
      });
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('deve ignorar parâmetros de paginação (service refatorado)', async () => {
      const convenios = [mockConvenio];
      mockConvenioService.findAll.mockResolvedValue(convenios);

      const result = await controller.findAll('2', '5', 'Unimed');

      expect(result).toEqual({
        message: 'Convênios encontrados',
        data: convenios,
      });
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('deve retornar lista vazia quando não há convênios', async () => {
      mockConvenioService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual({
        message: 'Convênios encontrados',
        data: [],
      });
    });
  });

  describe('findAtivos', () => {
    it('deve retornar convênios ativos', async () => {
      const conveniosAtivos = [mockConvenio];
      mockConvenioService.findAtivos.mockResolvedValue(conveniosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual({
        message: 'Convênios ativos encontrados',
        data: conveniosAtivos,
      });
      expect(service.findAtivos).toHaveBeenCalled();
    });
  });

  // TODO: Refatorar após migration - métodos removidos
  // describe('findComIntegracao', () => {
  //   it('deve retornar convênios com integração', async () => {
  //     const conveniosComApi = [{ ...mockConvenio, integracao_id: 'integracao-1' }];
  //     mockConvenioService.findComIntegracao.mockResolvedValue(conveniosComApi);

  //     const result = await controller.findComIntegracao();

  //     expect(result).toEqual({
  //       message: 'Convênios com integração encontrados',
  //       data: conveniosComApi,
  //     });
  //     expect(service.findComIntegracao).toHaveBeenCalled();
  //   });
  // });

  // describe('findByTipoFaturamento', () => {
  //   it('deve retornar convênios por tipo de faturamento', async () => {
  //     const conveniosMensais = [mockConvenio];
  //     mockConvenioService.findByTipoFaturamento.mockResolvedValue(
  //       conveniosMensais,
  //     );

  //     const result = await controller.findByTipoFaturamento('mensal');

  //     expect(result).toEqual({
  //       message: 'Convênios encontrados com sucesso',
  //       data: conveniosMensais,
  //     });
  //     expect(service.findByTipoFaturamento).toHaveBeenCalledWith('mensal');
  //   });
  // });

  // describe('verificarAutorizacao', () => {
  //   it('deve retornar requisitos de autorização', async () => {
  //     const autorizacaoData = {
  //       requerAutorizacao: true,
  //       requerSenha: false,
  //     };
  //     mockConvenioService.verificarAutorizacao.mockResolvedValue(
  //       autorizacaoData,
  //     );

  //     const result = await controller.verificarAutorizacao('convenio-uuid-1');

  //     expect(result).toEqual({
  //       message: 'Requisitos de autorização verificados',
  //       data: autorizacaoData,
  //     });
  //     expect(service.verificarAutorizacao).toHaveBeenCalledWith(
  //       'convenio-uuid-1',
  //     );
  //   });
  // });

  // describe('getRegrasConvenio', () => {
  //   it('deve retornar regras do convênio', async () => {
  //     const regrasData = {
  //       percentualDesconto: 10.5,
  //       tabelaPrecos: 'AMB',
  //       validadeGuiaDias: 30,
  //       regrasEspecificas: {},
  //     };
  //     mockConvenioService.getRegrasConvenio.mockResolvedValue(regrasData);

  //     const result = await controller.getRegrasConvenio('convenio-uuid-1');

  //     expect(result).toEqual({
  //       message: 'Regras do convênio obtidas com sucesso',
  //       data: regrasData,
  //     });
  //     expect(service.getRegrasConvenio).toHaveBeenCalledWith('convenio-uuid-1');
  //   });
  // });

  // describe('findByCodigo', () => {
  //   it('deve retornar um convênio por código', async () => {
  //     mockConvenioService.findByCodigo.mockResolvedValue(mockConvenio);

  //     const result = await controller.findByCodigo('CONV001');

  //     expect(result).toEqual({
  //       message: 'Convênio encontrado com sucesso',
  //       data: mockConvenio,
  //     });
  //     expect(service.findByCodigo).toHaveBeenCalledWith('CONV001');
  //   });

  //   it('deve retornar erro quando código não for encontrado', async () => {
  //     const notFoundError = new NotFoundException('Convênio não encontrado');
  //     mockConvenioService.findByCodigo.mockRejectedValue(notFoundError);

  //     await expect(controller.findByCodigo('INVALID')).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });
  // });

  describe('findOne', () => {
    it('deve retornar um convênio por ID', async () => {
      mockConvenioService.findOne.mockResolvedValue(mockConvenio);

      const result = await controller.findOne('convenio-uuid-1');

      expect(result).toEqual({
        message: 'Convênio encontrado com sucesso',
        data: mockConvenio,
      });
      expect(service.findOne).toHaveBeenCalledWith('convenio-uuid-1');
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException('Convênio não encontrado');
      mockConvenioService.findOne.mockRejectedValue(notFoundError);

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
      mockConvenioService.update.mockResolvedValue(convenioAtualizado);

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
      mockConvenioService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateConvenioDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já existe');
      mockConvenioService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('convenio-uuid-1', { codigo: 'CONV002' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve desativar um convênio com sucesso', async () => {
      mockConvenioService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('convenio-uuid-1');

      expect(result).toEqual({
        message: 'Convênio desativado com sucesso',
      });
      expect(service.remove).toHaveBeenCalledWith('convenio-uuid-1');
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      const notFoundError = new NotFoundException('Convênio não encontrado');
      mockConvenioService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
