import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { EmpresasService } from './empresas.service';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { TipoEmpresaEnum } from './enums/empresas.enum';

describe('EmpresasService', () => {
  let service: EmpresasService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
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
      providers: [
        EmpresasService,
        {
          provide: getRepositoryToken(Empresa),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmpresasService>(EmpresasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockEmpresa);
      mockRepository.save.mockResolvedValue(mockEmpresa);

      const result = await service.create(createEmpresaDto);

      expect(result).toEqual(mockEmpresa);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cnpj: createEmpresaDto.cnpj },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createEmpresaDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockEmpresa);
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmpresa);

      await expect(service.create(createEmpresaDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cnpj: createEmpresaDto.cnpj },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve criar empresa com dados fiscais opcionais', async () => {
      const createDtoCompleto = {
        ...createEmpresaDto,
        codigoInterno: 'EMP001',
        irrfPercentual: 1.5,
        pisPercentual: 0.65,
        reterIss: true,
        optanteSimplesNacional: false,
      };

      const empresaCompleta = { ...mockEmpresa, ...createDtoCompleto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(empresaCompleta);
      mockRepository.save.mockResolvedValue(empresaCompleta);

      const result = await service.create(createDtoCompleto);

      expect(result).toEqual(empresaCompleta);
      expect(result.irrfPercentual).toBe(1.5);
      expect(result.reterIss).toBe(true);
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

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(empresaLaboratorio);
      mockRepository.save.mockResolvedValue(empresaLaboratorio);

      const result = await service.create(createLaboratorio);

      expect(result.tipoEmpresa).toBe(TipoEmpresaEnum.LABORATORIO_APOIO);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de empresas ordenada por nome fantasia', async () => {
      const empresas = [mockEmpresa];
      mockRepository.find.mockResolvedValue(empresas);

      const result = await service.findAll();

      expect(result).toEqual(empresas);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: {
          nomeFantasia: 'ASC',
        },
      });
    });

    it('deve retornar lista vazia quando não há empresas', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma empresa por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmpresa);

      const result = await service.findOne('empresa-uuid-1');

      expect(result).toEqual(mockEmpresa);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'empresa-uuid-1' },
      });
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar empresa por CNPJ quando encontrada no banco', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmpresa);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockEmpresa);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cnpj: '12345678000190' }, // CNPJ sem formatação
      });
    });

    it('deve remover formatação do CNPJ antes de buscar', async () => {
      mockRepository.findOne.mockResolvedValue(mockEmpresa);

      await service.findByCnpj('12.345.678/0001-90');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cnpj: '12345678000190' },
      });
    });

    it('deve buscar na API CNPJA quando não encontrar no banco', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      // Mock da API CNPJA
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          taxId: '07526557011659',
          alias: 'Filial Manaus',
          company: {
            name: 'AMBEV S.A.',
            equity: 58226035176.01,
            nature: { text: 'Sociedade Anônima Aberta' },
            size: { text: 'Demais' },
            simples: { optant: false },
            simei: { optant: false },
            members: [],
          },
          status: { id: 2, text: 'Ativa' },
          statusDate: '2023-07-31',
          address: {
            zip: '69058795',
            street: 'Avenida Constantino Nery',
            number: '2575',
            district: 'Flores',
            city: 'Manaus',
            state: 'AM',
            details: null,
          },
          phones: [{ type: 'LANDLINE', area: '19', number: '33135680' }],
          emails: [
            {
              ownership: 'CORPORATE',
              address: 'opobrigaces@ambev.com.br',
            },
          ],
          mainActivity: {
            id: 1113502,
            text: 'Fabricação de cervejas e chopes',
          },
          sideActivities: [],
          registrations: [],
          founded: '2023-07-31',
          head: false,
        }),
      });

      const result = await service.findByCnpj('07526557011659');

      expect(result.isExternal).toBe(true);
      expect(result.externalSource).toBe('CNPJA');
      expect(result.cnpj).toBe('07526557011659');
      expect(result.razaoSocial).toBe('AMBEV S.A.');
      expect(result.nomeFantasia).toBe('Filial Manaus');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://open.cnpja.com/office/07526557011659',
      );
    });

    it('deve retornar erro quando CNPJ não for encontrado no banco nem na API', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      // Mock da API retornando 404
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(service.findByCnpj('00000000000000')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve retornar erro quando API CNPJA estiver indisponível', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      // Mock da API com erro de rede
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(service.findByCnpj('07526557011659')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByTipo', () => {
    it('deve retornar empresas por tipo', async () => {
      const empresasConvenio = [mockEmpresa];
      mockRepository.find.mockResolvedValue(empresasConvenio);

      const result = await service.findByTipo('CONVENIOS');

      expect(result).toEqual(empresasConvenio);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipoEmpresa: 'CONVENIOS' },
        order: {
          nomeFantasia: 'ASC',
        },
      });
    });

    it('deve retornar lista vazia para tipo sem empresas', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByTipo('TELEMEDICINA');

      expect(result).toEqual([]);
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

      mockRepository.findOne.mockResolvedValue(mockEmpresa);
      mockRepository.save.mockResolvedValue(empresaAtualizada);

      const result = await service.update('empresa-uuid-1', updateEmpresaDto);

      expect(result).toEqual(empresaAtualizada);
      expect(mockRepository.save).toHaveBeenCalledWith(empresaAtualizada);
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', updateEmpresaDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve verificar duplicidade de CNPJ ao atualizar', async () => {
      const updateComNovoCnpj = {
        ...updateEmpresaDto,
        cnpj: '98.765.432/0001-10',
      };

      const outraEmpresa = {
        ...mockEmpresa,
        id: 'empresa-uuid-2',
        cnpj: '98.765.432/0001-10',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(outraEmpresa);

      await expect(
        service.update('empresa-uuid-1', updateComNovoCnpj),
      ).rejects.toThrow(ConflictException);
    });

    it('deve permitir atualizar mesmo CNPJ atual', async () => {
      const updateMesmoCnpj = {
        ...updateEmpresaDto,
        cnpj: '12.345.678/0001-90',
      };

      const empresaAtualizada = {
        ...mockEmpresa,
        ...updateMesmoCnpj,
      };

      mockRepository.findOne.mockResolvedValue(mockEmpresa);
      mockRepository.save.mockResolvedValue(empresaAtualizada);

      const result = await service.update('empresa-uuid-1', updateMesmoCnpj);

      expect(result).toEqual(empresaAtualizada);
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

      mockRepository.findOne.mockResolvedValue(mockEmpresa);
      mockRepository.save.mockResolvedValue(empresaAtualizada);

      const result = await service.update('empresa-uuid-1', updateFiscal);

      expect(result.irrfPercentual).toBe(2.0);
      expect(result.reterIss).toBe(false);
      expect(result.optanteSimplesNacional).toBe(true);
    });
  });

  describe('remove', () => {
    it('deve fazer soft delete da empresa', async () => {
      const empresaInativa = { ...mockEmpresa, ativo: false };

      mockRepository.findOne.mockResolvedValue(mockEmpresa);
      mockRepository.save.mockResolvedValue(empresaInativa);

      await service.remove('empresa-uuid-1');

      expect(mockRepository.save).toHaveBeenCalledWith(empresaInativa);
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('activate', () => {
    it('deve ativar uma empresa', async () => {
      const empresaInativa = { ...mockEmpresa, ativo: false };
      const empresaAtiva = { ...mockEmpresa, ativo: true };

      mockRepository.findOne.mockResolvedValue(empresaInativa);
      mockRepository.save.mockResolvedValue(empresaAtiva);

      const result = await service.activate('empresa-uuid-1');

      expect(result).toEqual(empresaAtiva);
      expect(result.ativo).toBe(true);
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.activate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deactivate', () => {
    it('deve desativar uma empresa', async () => {
      const empresaInativa = { ...mockEmpresa, ativo: false };

      mockRepository.findOne.mockResolvedValue(mockEmpresa);
      mockRepository.save.mockResolvedValue(empresaInativa);

      const result = await service.deactivate('empresa-uuid-1');

      expect(result).toEqual(empresaInativa);
      expect(result.ativo).toBe(false);
    });

    it('deve retornar erro quando empresa não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deactivate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllLaboratorios', () => {
    it('deve retornar apenas empresas do tipo laboratório', async () => {
      const laboratorios = [
        {
          ...mockEmpresa,
          tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
        },
      ];

      mockRepository.find.mockResolvedValue(laboratorios);

      const result = await service.findAllLaboratorios();

      expect(result).toEqual(laboratorios);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipoEmpresa: 'LABORATORIO_APOIO' },
        order: { nomeFantasia: 'ASC' },
      });
    });
  });

  describe('findLaboratoriosAtivos', () => {
    it('deve retornar apenas laboratórios ativos', async () => {
      const laboratoriosAtivos = [
        {
          ...mockEmpresa,
          tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
          ativo: true,
        },
      ];

      mockRepository.find.mockResolvedValue(laboratoriosAtivos);

      const result = await service.findLaboratoriosAtivos();

      expect(result).toEqual(laboratoriosAtivos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          tipoEmpresa: 'LABORATORIO_APOIO',
          ativo: true,
        },
        order: { nomeFantasia: 'ASC' },
      });
    });
  });

  describe('findAllConvenios', () => {
    it('deve retornar apenas empresas do tipo convênio', async () => {
      const convenios = [mockEmpresa];

      mockRepository.find.mockResolvedValue(convenios);

      const result = await service.findAllConvenios();

      expect(result).toEqual(convenios);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipoEmpresa: 'CONVENIOS' },
        order: { nomeFantasia: 'ASC' },
      });
    });
  });

  describe('findConveniosAtivos', () => {
    it('deve retornar apenas convênios ativos', async () => {
      const conveniosAtivos = [mockEmpresa];

      mockRepository.find.mockResolvedValue(conveniosAtivos);

      const result = await service.findConveniosAtivos();

      expect(result).toEqual(conveniosAtivos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          tipoEmpresa: 'CONVENIOS',
          ativo: true,
        },
        order: { nomeFantasia: 'ASC' },
      });
    });
  });
});
