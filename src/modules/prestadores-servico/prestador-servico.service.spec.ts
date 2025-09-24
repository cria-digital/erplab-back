import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrestadorServicoService } from './prestador-servico.service';
import {
  PrestadorServico,
  StatusContrato,
  TipoContrato,
  FormaPagamento,
  FrequenciaPagamento,
} from './entities/prestador-servico.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CreatePrestadorServicoDto } from './dto/create-prestador-servico.dto';
import { UpdatePrestadorServicoDto } from './dto/update-prestador-servico.dto';
import { TipoEmpresaEnum } from '../empresas/enums/empresas.enum';

describe('PrestadorServicoService', () => {
  let service: PrestadorServicoService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockPrestadorRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockEmpresaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.PRESTADORES_SERVICOS,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Prestador Teste Ltda',
    nomeFantasia: 'Prestador Teste',
    ativo: true,
  };

  const mockPrestador = {
    id: 'prestador-uuid-1',
    empresaId: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigoPrestador: 'PREST001',
    categorias: [],
    tipoContrato: TipoContrato.POR_DEMANDA,
    numeroContrato: 'CONT-2024-001',
    dataInicioContrato: new Date('2024-01-01'),
    dataFimContrato: new Date('2024-12-31'),
    statusContrato: StatusContrato.ATIVO,
    valorContrato: 5000.0,
    formaPagamento: FormaPagamento.POR_SERVICO,
    frequenciaPagamento: FrequenciaPagamento.MENSAL,
    diaPagamento: 10,
    atendeUrgencia: true,
    suporte24x7: false,
    avaliacaoMedia: 4.5,
    totalAvaliacoes: 10,
    totalServicosPrestados: 50,
    renovacaoAutomatica: true,
    prazoAvisoRenovacao: 30,
    observacoes: 'Prestador de confiança',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestadorServicoService,
        {
          provide: getRepositoryToken(PrestadorServico),
          useValue: mockPrestadorRepository,
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

    service = module.get<PrestadorServicoService>(PrestadorServicoService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPrestadorDto: CreatePrestadorServicoDto = {
      codigoPrestador: 'PREST001',
      tipoContrato: TipoContrato.POR_DEMANDA,
      statusContrato: StatusContrato.ATIVO,
      formaPagamento: FormaPagamento.POR_SERVICO,
      atendeUrgencia: true,
      empresa: {
        tipoEmpresa: TipoEmpresaEnum.PRESTADORES_SERVICOS,
        cnpj: '12345678000190',
        razaoSocial: 'Prestador Teste Ltda',
        nomeFantasia: 'Prestador Teste',
        emailComercial: 'contato@prestador.com.br',
        ativo: true,
      } as any,
    };

    it('deve criar um prestador com sucesso', async () => {
      mockPrestadorRepository.findOne.mockResolvedValueOnce(null); // código único
      mockEmpresaRepository.findOne.mockResolvedValue(null); // CNPJ único
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockPrestador);
      mockPrestadorRepository.create.mockReturnValue(mockPrestador);
      mockPrestadorRepository.findOne.mockResolvedValueOnce(mockPrestador);

      const result = await service.create(createPrestadorDto);

      expect(result).toEqual(mockPrestador);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve retornar erro quando código já existir', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);

      await expect(service.create(createPrestadorDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      mockPrestadorRepository.findOne.mockResolvedValueOnce(null);
      mockEmpresaRepository.findOne.mockResolvedValue(mockEmpresa);

      await expect(service.create(createPrestadorDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar prestador com todos os campos opcionais', async () => {
      const createCompleto = {
        ...createPrestadorDto,
        numeroContrato: 'CONT-2024-001',
        dataInicioContrato: '2024-01-01',
        dataFimContrato: '2024-12-31',
        valor_contrato: 5000.0,
        suporte24x7: true,
        renovacaoAutomatica: true,
      };

      mockPrestadorRepository.findOne.mockResolvedValueOnce(null);
      mockEmpresaRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockPrestador);
      mockPrestadorRepository.create.mockReturnValue(mockPrestador);
      mockPrestadorRepository.findOne.mockResolvedValueOnce(mockPrestador);

      const result = await service.create(createCompleto);

      expect(result).toEqual(mockPrestador);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de prestadores ordenada', async () => {
      const prestadores = [mockPrestador];
      mockPrestadorRepository.find.mockResolvedValue(prestadores);

      const result = await service.findAll();

      expect(result).toEqual(prestadores);
      expect(mockPrestadorRepository.find).toHaveBeenCalledWith({
        relations: ['empresa', 'categorias'],
        order: { createdAt: 'DESC' },
      });
    });

    it('deve retornar lista vazia quando não há prestadores', async () => {
      mockPrestadorRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findActive', () => {
    it('deve retornar apenas prestadores ativos', async () => {
      const prestadoresAtivos = [mockPrestador];
      mockPrestadorRepository.find.mockResolvedValue(prestadoresAtivos);

      const result = await service.findActive();

      expect(result).toEqual(prestadoresAtivos);
      expect(mockPrestadorRepository.find).toHaveBeenCalledWith({
        where: {
          statusContrato: StatusContrato.ATIVO,
          empresa: { ativo: true },
        },
        relations: ['empresa', 'categorias'],
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um prestador por ID', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);

      const result = await service.findOne('prestador-uuid-1');

      expect(result).toEqual(mockPrestador);
      expect(mockPrestadorRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'prestador-uuid-1' },
        relations: ['empresa', 'categorias'],
      });
    });

    it('deve retornar erro quando prestador não for encontrado', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar prestador por código', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);

      const result = await service.findByCodigo('PREST001');

      expect(result).toEqual(mockPrestador);
      expect(mockPrestadorRepository.findOne).toHaveBeenCalledWith({
        where: { codigoPrestador: 'PREST001' },
        relations: ['empresa', 'categorias'],
      });
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar prestador por CNPJ', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockPrestador);
      expect(mockPrestadorRepository.findOne).toHaveBeenCalledWith({
        where: { empresa: { cnpj: '12.345.678/0001-90' } },
        relations: ['empresa', 'categorias'],
      });
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('deve buscar prestadores por termo', async () => {
      const prestadores = [mockPrestador];
      mockPrestadorRepository.find.mockResolvedValue(prestadores);

      const result = await service.search('teste');

      expect(result).toEqual(prestadores);
      expect(mockPrestadorRepository.find).toHaveBeenCalled();
    });

    it('deve retornar lista vazia para busca sem resultados', async () => {
      mockPrestadorRepository.find.mockResolvedValue([]);

      const result = await service.search('inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('findByStatus', () => {
    it('deve retornar prestadores por status', async () => {
      const prestadoresAtivos = [mockPrestador];
      mockPrestadorRepository.find.mockResolvedValue(prestadoresAtivos);

      const result = await service.findByStatus(StatusContrato.ATIVO);

      expect(result).toEqual(prestadoresAtivos);
      expect(mockPrestadorRepository.find).toHaveBeenCalledWith({
        where: { statusContrato: StatusContrato.ATIVO },
        relations: ['empresa', 'categorias'],
      });
    });

    it('deve funcionar para todos os status', async () => {
      const statusList = [
        StatusContrato.ATIVO,
        StatusContrato.INATIVO,
        StatusContrato.SUSPENSO,
        StatusContrato.EM_ANALISE,
      ];

      for (const status of statusList) {
        mockPrestadorRepository.find.mockResolvedValue([mockPrestador]);

        const result = await service.findByStatus(status);

        expect(result).toEqual([mockPrestador]);
      }
    });
  });

  describe('findByTipoContrato', () => {
    it('deve retornar prestadores por tipo de contrato', async () => {
      const prestadores = [mockPrestador];
      mockPrestadorRepository.find.mockResolvedValue(prestadores);

      const result = await service.findByTipoContrato('por_demanda');

      expect(result).toEqual(prestadores);
      expect(mockPrestadorRepository.find).toHaveBeenCalledWith({
        where: { tipoContrato: 'por_demanda' },
        relations: ['empresa', 'categorias'],
      });
    });
  });

  describe('findComUrgencia', () => {
    it('deve retornar prestadores que atendem urgência', async () => {
      const prestadoresUrgencia = [{ ...mockPrestador, atendeUrgencia: true }];
      mockPrestadorRepository.find.mockResolvedValue(prestadoresUrgencia);

      const result = await service.findComUrgencia();

      expect(result).toEqual(prestadoresUrgencia);
      expect(mockPrestadorRepository.find).toHaveBeenCalledWith({
        where: {
          atendeUrgencia: true,
          statusContrato: StatusContrato.ATIVO,
        },
        relations: ['empresa', 'categorias'],
      });
    });
  });

  describe('findCom24x7', () => {
    it('deve retornar prestadores com suporte 24x7', async () => {
      const prestadores24x7 = [{ ...mockPrestador, suporte24x7: true }];
      mockPrestadorRepository.find.mockResolvedValue(prestadores24x7);

      const result = await service.findCom24x7();

      expect(result).toEqual(prestadores24x7);
      expect(mockPrestadorRepository.find).toHaveBeenCalledWith({
        where: {
          suporte24x7: true,
          statusContrato: StatusContrato.ATIVO,
        },
        relations: ['empresa', 'categorias'],
      });
    });
  });

  describe('update', () => {
    const updatePrestadorDto: UpdatePrestadorServicoDto = {
      valor_contrato: 6000.0,
      atendeUrgencia: false,
    } as any;

    it('deve atualizar prestador com sucesso', async () => {
      const prestadorAtualizado = {
        ...mockPrestador,
        ...updatePrestadorDto,
      };

      mockPrestadorRepository.findOne
        .mockResolvedValueOnce(mockPrestador)
        .mockResolvedValueOnce(prestadorAtualizado);
      mockQueryRunner.manager.update.mockResolvedValue({});

      const result = await service.update(
        'prestador-uuid-1',
        updatePrestadorDto,
      );

      expect(result).toEqual(prestadorAtualizado);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve atualizar dados da empresa quando fornecidos', async () => {
      const updateComEmpresa = {
        empresa: {
          nomeFantasia: 'Novo Nome',
          telefone: '(11) 9999-9999',
        } as any,
      };

      mockPrestadorRepository.findOne
        .mockResolvedValueOnce(mockPrestador)
        .mockResolvedValueOnce(mockPrestador);
      mockQueryRunner.manager.update.mockResolvedValue({});

      await service.update('prestador-uuid-1', updateComEmpresa);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        Empresa,
        'empresa-uuid-1',
        updateComEmpresa.empresa,
      );
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status do contrato', async () => {
      const prestadorSuspenso = {
        ...mockPrestador,
        statusContrato: StatusContrato.SUSPENSO,
      };

      mockPrestadorRepository.findOne
        .mockResolvedValueOnce(mockPrestador)
        .mockResolvedValueOnce(prestadorSuspenso);
      mockPrestadorRepository.save.mockResolvedValue(prestadorSuspenso);

      const result = await service.updateStatus(
        'prestador-uuid-1',
        StatusContrato.SUSPENSO,
      );

      expect(result.statusContrato).toBe(StatusContrato.SUSPENSO);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status da empresa', async () => {
      const prestadorComEmpresa = {
        ...mockPrestador,
        empresa: mockEmpresa,
      };

      const prestadorInativo = {
        ...prestadorComEmpresa,
        empresa: { ...mockEmpresa, ativo: false },
      };

      // Mock para primeira chamada de findOne (dentro de toggleStatus)
      // e segunda chamada (após o update)
      mockPrestadorRepository.findOne
        .mockResolvedValueOnce(prestadorComEmpresa)
        .mockResolvedValueOnce(prestadorInativo);

      mockQueryRunner.manager.update.mockResolvedValue({});

      const result = await service.toggleStatus('prestador-uuid-1');

      expect(result.empresa.ativo).toBe(false);
      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        Empresa,
        prestadorComEmpresa.empresaId,
        { ativo: false },
      );
    });
  });

  describe('avaliar', () => {
    it('deve adicionar avaliação com sucesso', async () => {
      const prestadorAvaliado = {
        ...mockPrestador,
        avaliacaoMedia: 4.55,
        totalAvaliacoes: 11,
      };

      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockPrestadorRepository.save.mockResolvedValue(prestadorAvaliado);

      const result = await service.avaliar('prestador-uuid-1', 5);

      expect(result.totalAvaliacoes).toBe(11);
      expect(mockPrestadorRepository.save).toHaveBeenCalled();
    });

    it('deve retornar erro para avaliação inválida', async () => {
      await expect(service.avaliar('prestador-uuid-1', 6)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.avaliar('prestador-uuid-1', 0)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve calcular média corretamente', async () => {
      const prestadorSemAvaliacao = {
        ...mockPrestador,
        avaliacaoMedia: null,
        totalAvaliacoes: 0,
      };

      mockPrestadorRepository.findOne.mockResolvedValue(prestadorSemAvaliacao);
      mockPrestadorRepository.save.mockImplementation((p) =>
        Promise.resolve(p),
      );

      const result = await service.avaliar('prestador-uuid-1', 5);

      expect(result.avaliacaoMedia).toBe(5);
      expect(result.totalAvaliacoes).toBe(1);
    });
  });

  describe('incrementarServicos', () => {
    it('deve incrementar contador de serviços', async () => {
      const prestadorAtualizado = {
        ...mockPrestador,
        totalServicosPrestados: 51,
      };

      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockPrestadorRepository.save.mockResolvedValue(prestadorAtualizado);

      const result = await service.incrementarServicos('prestador-uuid-1');

      expect(result.totalServicosPrestados).toBe(51);
    });

    it('deve inicializar contador quando nulo', async () => {
      const prestadorSemServicos = {
        ...mockPrestador,
        totalServicosPrestados: null,
      };

      mockPrestadorRepository.findOne.mockResolvedValue(prestadorSemServicos);
      mockPrestadorRepository.save.mockImplementation((p) =>
        Promise.resolve(p),
      );

      const result = await service.incrementarServicos('prestador-uuid-1');

      expect(result.totalServicosPrestados).toBe(1);
    });
  });

  describe('remove', () => {
    it('deve remover prestador e empresa com sucesso', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(mockPrestador);
      mockQueryRunner.manager.delete.mockResolvedValue({});

      await service.remove('prestador-uuid-1');

      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        PrestadorServico,
        'prestador-uuid-1',
      );
      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        Empresa,
        'empresa-uuid-1',
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve retornar erro quando prestador não for encontrado', async () => {
      mockPrestadorRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas completas', async () => {
      mockPrestadorRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // ativos
        .mockResolvedValueOnce(10) // inativos
        .mockResolvedValueOnce(5) // suspensos
        .mockResolvedValueOnce(5) // em análise
        .mockResolvedValueOnce(20) // com 24x7
        .mockResolvedValueOnce(30); // com urgência

      mockPrestadorRepository.find
        .mockResolvedValueOnce([mockPrestador]) // melhores avaliados
        .mockResolvedValueOnce([mockPrestador]); // mais serviços

      const result = await service.getEstatisticas();

      expect(result.resumo).toEqual({
        total: 100,
        ativos: 80,
        inativos: 10,
        suspensos: 5,
        emAnalise: 5,
        com24x7: 20,
        comUrgencia: 30,
      });
      expect(result.melhoresAvaliados).toHaveLength(1);
      expect(result.maisServicos).toHaveLength(1);
    });
  });

  describe('getContratosVencendo', () => {
    it('deve retornar contratos vencendo nos próximos dias', async () => {
      const prestadoresVencendo = [mockPrestador];
      mockQueryBuilder.getMany.mockResolvedValue(prestadoresVencendo);

      const result = await service.getContratosVencendo(30);

      expect(result).toEqual(prestadoresVencendo);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('deve usar período padrão de 30 dias', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.getContratosVencendo();

      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });
  });

  describe('getRenovacoesAutomaticas', () => {
    it('deve retornar prestadores com renovação automática', async () => {
      const prestadorComRenovacao = {
        ...mockPrestador,
        renovacaoAutomatica: true,
        prazoAvisoRenovacao: 30,
        dataFimContrato: new Date('2024-12-31'),
      };

      mockQueryBuilder.getMany.mockResolvedValue([prestadorComRenovacao]);

      await service.getRenovacoesAutomaticas();

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'prestador.renovacaoAutomatica = :renovacao',
        { renovacao: true },
      );
    });

    it('deve filtrar prestadores que precisam de aviso', async () => {
      const hoje = new Date();
      const dataFim = new Date();
      dataFim.setDate(hoje.getDate() + 25);

      const prestadorNoPrazo = {
        ...mockPrestador,
        renovacaoAutomatica: true,
        prazoAvisoRenovacao: 30,
        dataFimContrato: dataFim,
      };

      mockQueryBuilder.getMany.mockResolvedValue([prestadorNoPrazo]);

      const result = await service.getRenovacoesAutomaticas();

      expect(result).toHaveLength(1);
    });
  });
});
