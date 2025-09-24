import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { TipoEmpresaEnum } from './enums/empresas.enum';

describe('EmpresasController', () => {
  let controller: EmpresasController;
  let service: EmpresasService;

  const mockEmpresasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCnpj: jest.fn(),
    findByTipo: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
    codigoInterno: 'EMP001',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Empresa Teste Ltda',
    nomeFantasia: 'Empresa Teste',
    inscricaoEstadual: '123456789',
    inscricaoMunicipal: '987654321',
    telefoneFixo: '(11) 1234-5678',
    celular: '(11) 99999-9999',
    emailComercial: 'contato@empresateste.com.br',
    siteEmpresa: 'https://www.empresateste.com.br',
    cep: '01234-567',
    rua: 'Rua Teste, 123',
    numero: '123',
    bairro: 'Centro',
    complemento: 'Sala 10',
    estado: 'SP',
    cidade: 'São Paulo',
    nomeResponsavel: 'João Silva',
    cargoResponsavel: 'Diretor',
    contatoResponsavel: '(11) 98765-4321',
    emailResponsavel: 'joao@empresateste.com.br',
    irrfPercentual: 1.5,
    pisPercentual: 0.65,
    cofinsPercentual: 3.0,
    csllPercentual: 1.0,
    issPercentual: 5.0,
    ibsPercentual: 2.0,
    cbsPercentual: 1.2,
    reterIss: true,
    reterIr: true,
    reterPcc: false,
    reterIbs: false,
    reterCbs: false,
    optanteSimplesNacional: false,
    banco: '001',
    agencia: '1234',
    contaCorrente: '567890-1',
    formaPagamento: 'PIX',
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  } as Empresa;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresasController],
      providers: [
        {
          provide: EmpresasService,
          useValue: mockEmpresasService,
        },
      ],
    }).compile();

    controller = module.get<EmpresasController>(EmpresasController);
    service = module.get<EmpresasService>(EmpresasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createEmpresaDto: CreateEmpresaDto = {
      tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Empresa Teste Ltda',
      nomeFantasia: 'Empresa Teste',
      emailComercial: 'contato@empresateste.com.br',
      ativo: true,
    };

    it('deve criar uma empresa com sucesso', async () => {
      mockEmpresasService.create.mockResolvedValue(mockEmpresa);

      const result = await controller.create(createEmpresaDto);

      expect(result).toEqual(mockEmpresa);
      expect(service.create).toHaveBeenCalledWith(createEmpresaDto);
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      const conflictError = new ConflictException('CNPJ já cadastrado');
      mockEmpresasService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createEmpresaDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(createEmpresaDto);
    });

    it('deve criar empresa do tipo laboratório', async () => {
      const createLaboratorio = {
        ...createEmpresaDto,
        tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
        cnpj: '98.765.432/0001-10',
      };

      const empresaLaboratorio = {
        ...mockEmpresa,
        tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
        cnpj: '98.765.432/0001-10',
      };

      mockEmpresasService.create.mockResolvedValue(empresaLaboratorio);

      const result = await controller.create(createLaboratorio);

      expect(result).toEqual(empresaLaboratorio);
      expect(result.tipoEmpresa).toBe(TipoEmpresaEnum.LABORATORIO_APOIO);
    });

    it('deve criar empresa com dados fiscais completos', async () => {
      const createCompleto = {
        ...createEmpresaDto,
        codigoInterno: 'EMP001',
        irrfPercentual: 1.5,
        pisPercentual: 0.65,
        reterIss: true,
        optanteSimplesNacional: false,
        banco: '001',
        agencia: '1234',
      };

      const empresaCompleta = { ...mockEmpresa, ...createCompleto };

      mockEmpresasService.create.mockResolvedValue(empresaCompleta);

      const result = await controller.create(createCompleto);

      expect(result).toEqual(empresaCompleta);
      expect(result.irrfPercentual).toBe(1.5);
      expect(result.reterIss).toBe(true);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de empresas', async () => {
      const empresas = [mockEmpresa];
      mockEmpresasService.findAll.mockResolvedValue(empresas);

      const result = await controller.findAll();

      expect(result).toEqual(empresas);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há empresas', async () => {
      mockEmpresasService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findByTipo', () => {
    it('deve retornar empresas por tipo convênio', async () => {
      const convenios = [mockEmpresa];
      mockEmpresasService.findByTipo.mockResolvedValue(convenios);

      const result = await controller.findByTipo('CONVENIOS');

      expect(result).toEqual(convenios);
      expect(service.findByTipo).toHaveBeenCalledWith('CONVENIOS');
    });

    it('deve retornar empresas por tipo laboratório', async () => {
      const laboratorios = [
        {
          ...mockEmpresa,
          tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
        },
      ];
      mockEmpresasService.findByTipo.mockResolvedValue(laboratorios);

      const result = await controller.findByTipo('LABORATORIO_APOIO');

      expect(result).toEqual(laboratorios);
      expect(service.findByTipo).toHaveBeenCalledWith('LABORATORIO_APOIO');
    });

    it('deve retornar lista vazia para tipo sem empresas', async () => {
      mockEmpresasService.findByTipo.mockResolvedValue([]);

      const result = await controller.findByTipo('TELEMEDICINA');

      expect(result).toEqual([]);
      expect(service.findByTipo).toHaveBeenCalledWith('TELEMEDICINA');
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar empresa por CNPJ', async () => {
      mockEmpresasService.findByCnpj.mockResolvedValue(mockEmpresa);

      const result = await controller.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockEmpresa);
      expect(service.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      const notFoundError = new NotFoundException(
        'Empresa com CNPJ 00.000.000/0000-00 não encontrada',
      );
      mockEmpresasService.findByCnpj.mockRejectedValue(notFoundError);

      await expect(controller.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCnpj).toHaveBeenCalledWith('00.000.000/0000-00');
    });

    it('deve buscar CNPJ com formatação diferente', async () => {
      mockEmpresasService.findByCnpj.mockResolvedValue(mockEmpresa);

      const result = await controller.findByCnpj('12345678000190');

      expect(result).toEqual(mockEmpresa);
      expect(service.findByCnpj).toHaveBeenCalledWith('12345678000190');
    });
  });

  describe('findOne', () => {
    it('deve retornar uma empresa por ID', async () => {
      mockEmpresasService.findOne.mockResolvedValue(mockEmpresa);

      const result = await controller.findOne('empresa-uuid-1');

      expect(result).toEqual(mockEmpresa);
      expect(service.findOne).toHaveBeenCalledWith('empresa-uuid-1');
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Empresa com ID invalid-id não encontrada',
      );
      mockEmpresasService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    const updateEmpresaDto: UpdateEmpresaDto = {
      nomeFantasia: 'Empresa Teste Atualizada',
      emailComercial: 'novo@empresateste.com.br',
    };

    it('deve atualizar uma empresa com sucesso', async () => {
      const empresaAtualizada = {
        ...mockEmpresa,
        ...updateEmpresaDto,
      };
      mockEmpresasService.update.mockResolvedValue(empresaAtualizada);

      const result = await controller.update(
        'empresa-uuid-1',
        updateEmpresaDto,
      );

      expect(result).toEqual(empresaAtualizada);
      expect(service.update).toHaveBeenCalledWith(
        'empresa-uuid-1',
        updateEmpresaDto,
      );
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Empresa com ID invalid-id não encontrada',
      );
      mockEmpresasService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateEmpresaDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        'invalid-id',
        updateEmpresaDto,
      );
    });

    it('deve retornar erro quando novo CNPJ já existir', async () => {
      const updateComNovoCnpj = {
        ...updateEmpresaDto,
        cnpj: '98.765.432/0001-10',
      };
      const conflictError = new ConflictException(
        'CNPJ já cadastrado para outra empresa',
      );
      mockEmpresasService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('empresa-uuid-1', updateComNovoCnpj),
      ).rejects.toThrow(ConflictException);
    });

    it('deve atualizar dados fiscais', async () => {
      const updateFiscal = {
        irrfPercentual: 2.0,
        reterIss: false,
        optanteSimplesNacional: true,
      };

      const empresaAtualizada = {
        ...mockEmpresa,
        ...updateFiscal,
      };

      mockEmpresasService.update.mockResolvedValue(empresaAtualizada);

      const result = await controller.update('empresa-uuid-1', updateFiscal);

      expect(result).toEqual(empresaAtualizada);
      expect(result.irrfPercentual).toBe(2.0);
      expect(result.reterIss).toBe(false);
      expect(result.optanteSimplesNacional).toBe(true);
    });

    it('deve atualizar endereço da empresa', async () => {
      const updateEndereco = {
        cep: '01234-567',
        rua: 'Nova Rua, 456',
        numero: '456',
        bairro: 'Novo Bairro',
        cidade: 'Nova Cidade',
        estado: 'RJ',
      };

      const empresaAtualizada = {
        ...mockEmpresa,
        ...updateEndereco,
      };

      mockEmpresasService.update.mockResolvedValue(empresaAtualizada);

      const result = await controller.update('empresa-uuid-1', updateEndereco);

      expect(result).toEqual(empresaAtualizada);
      expect(result.cidade).toBe('Nova Cidade');
      expect(result.estado).toBe('RJ');
    });
  });

  describe('remove', () => {
    it('deve remover uma empresa com sucesso', async () => {
      mockEmpresasService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('empresa-uuid-1');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('empresa-uuid-1');
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Empresa com ID invalid-id não encontrada',
      );
      mockEmpresasService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('activate', () => {
    it('deve ativar uma empresa com sucesso', async () => {
      const empresaAtiva = { ...mockEmpresa, ativo: true };
      mockEmpresasService.activate.mockResolvedValue(empresaAtiva);

      const result = await controller.activate('empresa-uuid-1');

      expect(result).toEqual(empresaAtiva);
      expect(result.ativo).toBe(true);
      expect(service.activate).toHaveBeenCalledWith('empresa-uuid-1');
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Empresa com ID invalid-id não encontrada',
      );
      mockEmpresasService.activate.mockRejectedValue(notFoundError);

      await expect(controller.activate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.activate).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('deactivate', () => {
    it('deve desativar uma empresa com sucesso', async () => {
      const empresaInativa = { ...mockEmpresa, ativo: false };
      mockEmpresasService.deactivate.mockResolvedValue(empresaInativa);

      const result = await controller.deactivate('empresa-uuid-1');

      expect(result).toEqual(empresaInativa);
      expect(result.ativo).toBe(false);
      expect(service.deactivate).toHaveBeenCalledWith('empresa-uuid-1');
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Empresa com ID invalid-id não encontrada',
      );
      mockEmpresasService.deactivate.mockRejectedValue(notFoundError);

      await expect(controller.deactivate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.deactivate).toHaveBeenCalledWith('invalid-id');
    });
  });
});
