import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { ConvenioService } from './convenio.service';
import {
  Convenio,
  TipoFaturamento,
  StatusConvenio,
} from '../entities/convenio.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('ConvenioService', () => {
  let service: ConvenioService;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  };

  const mockConvenioRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockEmpresaRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Convênio Teste Ltda',
    nomeFantasia: 'Convênio Teste',
    emailComercial: 'contato@convenioteste.com.br',
    ativo: true,
  } as Empresa;

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
      providers: [
        ConvenioService,
        {
          provide: getRepositoryToken(Convenio),
          useValue: mockConvenioRepository,
        },
        {
          provide: getRepositoryToken(Empresa),
          useValue: mockEmpresaRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ConvenioService>(ConvenioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockConvenioRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(mockConvenio); // findOne final
      mockEmpresaRepository.findOne.mockResolvedValue(null); // verificação CNPJ
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockConvenioRepository.create.mockReturnValue(mockConvenio);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa) // save empresa
        .mockResolvedValueOnce(mockConvenio); // save convenio

      const result = await service.create(createConvenioDto);

      expect(result).toEqual(mockConvenio);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve retornar erro quando código do convênio já existir', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);

      await expect(service.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.findOne.mockResolvedValue(mockEmpresa);

      await expect(service.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('deve fazer rollback em caso de erro', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createConvenioDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
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
      };

      mockConvenioRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockConvenio);
      mockEmpresaRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockConvenioRepository.create.mockReturnValue(mockConvenio);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockConvenio);

      const result = await service.create(createCompleto);

      expect(result).toEqual(mockConvenio);
      expect(mockConvenioRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          codigo_convenio: 'CONV001',
          tem_integracao_api: true,
          url_api: 'https://api.convenio.com.br',
          empresa_id: 'empresa-uuid-1',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de convênios ordenada por nome fantasia', async () => {
      const convenios = [mockConvenio];
      mockConvenioRepository.find.mockResolvedValue(convenios);

      const result = await service.findAll();

      expect(result).toEqual(convenios);
      expect(mockConvenioRepository.find).toHaveBeenCalledWith({
        relations: ['empresa', 'planos', 'instrucoes'],
      });
    });

    it('deve ordenar convênios por nome fantasia da empresa', async () => {
      const convenio1 = {
        ...mockConvenio,
        id: 'conv-1',
        empresa: { ...mockEmpresa, nomeFantasia: 'Z Convênio' },
      };
      const convenio2 = {
        ...mockConvenio,
        id: 'conv-2',
        empresa: { ...mockEmpresa, nomeFantasia: 'A Convênio' },
      };

      mockConvenioRepository.find.mockResolvedValue([convenio1, convenio2]);

      const result = await service.findAll();

      expect(result[0].empresa.nomeFantasia).toBe('A Convênio');
      expect(result[1].empresa.nomeFantasia).toBe('Z Convênio');
    });

    it('deve retornar lista vazia quando não há convênios', async () => {
      mockConvenioRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um convênio por ID', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);

      const result = await service.findOne('convenio-uuid-1');

      expect(result).toEqual(mockConvenio);
      expect(mockConvenioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'convenio-uuid-1' },
        relations: ['empresa', 'planos', 'instrucoes'],
      });
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar convênio por código', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);

      const result = await service.findByCodigo('CONV001');

      expect(result).toEqual(mockConvenio);
      expect(mockConvenioRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_convenio: 'CONV001' },
        relations: ['empresa', 'planos', 'instrucoes'],
      });
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INEXISTENTE')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar convênio por CNPJ usando QueryBuilder', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockConvenio);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockConvenio);
      expect(mockConvenioRepository.createQueryBuilder).toHaveBeenCalledWith(
        'convenio',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'convenio.empresa',
        'empresa',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.cnpj = :cnpj',
        { cnpj: '12.345.678/0001-90' },
      );
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas convênios ativos', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockConvenio]);

      const result = await service.findAtivos();

      expect(result).toEqual([mockConvenio]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.ativo = :ativo',
        { ativo: true },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'empresa.nomeFantasia',
        'ASC',
      );
    });

    it('deve retornar lista vazia quando não há convênios ativos', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findAtivos();

      expect(result).toEqual([]);
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

      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);
      mockQueryRunner.manager.save.mockResolvedValue(convenioAtualizado);

      const result = await service.update('convenio-uuid-1', updateConvenioDto);

      expect(result).toEqual(convenioAtualizado);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve atualizar dados da empresa quando fornecidos', async () => {
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

      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa) // save empresa
        .mockResolvedValueOnce(mockConvenio); // save convenio

      await service.update('convenio-uuid-1', updateComEmpresa);

      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2);
    });

    it('deve verificar duplicidade de código ao atualizar', async () => {
      const updateComNovoCodigo = {
        ...updateConvenioDto,
        codigo_convenio: 'CONV002',
      };

      const outroConvenio = {
        ...mockConvenio,
        id: 'convenio-uuid-2',
        codigo_convenio: 'CONV002',
      };

      mockConvenioRepository.findOne
        .mockResolvedValueOnce(mockConvenio) // findOne inicial
        .mockResolvedValueOnce(outroConvenio); // verificação duplicidade

      await expect(
        service.update('convenio-uuid-1', updateComNovoCodigo),
      ).rejects.toThrow(ConflictException);
    });

    it('deve verificar duplicidade de CNPJ ao atualizar empresa', async () => {
      const updateComNovoCnpj = {
        ...updateConvenioDto,
        empresa: {
          tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
          cnpj: '98.765.432/0001-10',
          razaoSocial: 'Empresa Nova Ltda',
          nomeFantasia: 'Empresa Nova',
          emailComercial: 'nova@empresa.com',
        },
      };

      const outraEmpresa = {
        ...mockEmpresa,
        id: 'empresa-uuid-2',
        cnpj: '98.765.432/0001-10',
      };

      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);
      mockEmpresaRepository.findOne.mockResolvedValue(outraEmpresa);

      await expect(
        service.update('convenio-uuid-1', updateComNovoCnpj),
      ).rejects.toThrow(ConflictException);
    });

    it('deve permitir atualizar mesmo CNPJ da empresa atual', async () => {
      const updateMesmoCnpj = {
        ...updateConvenioDto,
        empresa: {
          tipoEmpresa: TipoEmpresaEnum.CONVENIOS,
          cnpj: '12.345.678/0001-90', // mesmo CNPJ atual
          razaoSocial: 'Razão Social Atualizada',
          nomeFantasia: 'Nome Atualizado',
          emailComercial: 'atualizado@empresa.com',
        },
      };

      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);
      mockEmpresaRepository.findOne.mockResolvedValue(mockEmpresa);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockConvenio);

      await service.update('convenio-uuid-1', updateMesmoCnpj);

      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve fazer rollback em caso de erro', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);
      mockQueryRunner.manager.save.mockRejectedValue(new Error('Update error'));

      await expect(
        service.update('convenio-uuid-1', updateConvenioDto),
      ).rejects.toThrow('Update error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um convênio com sucesso', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(mockConvenio);
      mockConvenioRepository.remove.mockResolvedValue(mockConvenio);

      await service.remove('convenio-uuid-1');

      expect(mockConvenioRepository.remove).toHaveBeenCalledWith(mockConvenio);
    });

    it('deve retornar erro quando convênio não for encontrado', async () => {
      mockConvenioRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve ativar convênio inativo', async () => {
      const convenioInativo = {
        ...mockConvenio,
        empresa: { ...mockEmpresa, ativo: false },
      };

      mockConvenioRepository.findOne
        .mockResolvedValueOnce(convenioInativo)
        .mockResolvedValueOnce({
          ...convenioInativo,
          empresa: { ...mockEmpresa, ativo: true },
        });
      mockEmpresaRepository.save.mockResolvedValue(mockEmpresa);

      await service.toggleStatus('convenio-uuid-1');

      expect(mockEmpresaRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ ativo: true }),
      );
    });

    it('deve desativar convênio ativo', async () => {
      mockConvenioRepository.findOne
        .mockResolvedValueOnce(mockConvenio)
        .mockResolvedValueOnce({
          ...mockConvenio,
          empresa: { ...mockEmpresa, ativo: false },
        });
      mockEmpresaRepository.save.mockResolvedValue({
        ...mockEmpresa,
        ativo: false,
      });

      await service.toggleStatus('convenio-uuid-1');

      expect(mockEmpresaRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ ativo: false }),
      );
    });
  });

  describe('search', () => {
    it('deve buscar convênios por nome fantasia', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockConvenio]);

      const result = await service.search('Teste');

      expect(result).toEqual([mockConvenio]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.nomeFantasia ILIKE :query',
        { query: '%Teste%' },
      );
    });

    it('deve buscar convênios por razão social', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockConvenio]);

      await service.search('Ltda');

      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'empresa.razaoSocial ILIKE :query',
        { query: '%Ltda%' },
      );
    });

    it('deve buscar convênios por CNPJ', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockConvenio]);

      await service.search('12.345.678');

      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'empresa.cnpj LIKE :query',
        { query: '%12.345.678%' },
      );
    });

    it('deve buscar convênios por código', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockConvenio]);

      await service.search('CONV001');

      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'convenio.codigo_convenio LIKE :query',
        { query: '%CONV001%' },
      );
    });

    it('deve retornar lista vazia quando não encontrar resultados', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('inexistente');

      expect(result).toEqual([]);
    });

    it('deve ordenar resultados por nome fantasia', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockConvenio]);

      await service.search('Teste');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'empresa.nomeFantasia',
        'ASC',
      );
    });
  });
});
