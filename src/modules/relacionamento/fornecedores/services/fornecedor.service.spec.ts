import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FornecedorService } from './fornecedor.service';
import {
  Fornecedor,
  StatusFornecedor,
  CategoriaInsumo,
  MetodoTransporte,
  FormaPagamentoFornecedor,
} from '../entities/fornecedor.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { CreateFornecedorDto } from '../dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from '../dto/update-fornecedor.dto';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('FornecedorService', () => {
  let service: FornecedorService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  const mockFornecedorRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getRawOne: jest.fn(),
    })),
  };

  const mockEmpresaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.FORNECEDORES,
    codigoInterno: 'EMP001',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Fornecedor Teste Ltda',
    nomeFantasia: 'Fornecedor Teste',
    inscricaoEstadual: '123456789',
    inscricaoMunicipal: '987654321',
    telefoneFixo: '(11) 1234-5678',
    celular: '(11) 91234-5678',
    emailComercial: 'contato@fornecedorteste.com.br',
    siteEmpresa: 'https://fornecedorteste.com.br',
    logo: null,
    cep: '01234-567',
    rua: 'Rua Teste',
    numero: '123',
    bairro: 'Centro',
    complemento: 'Sala 45',
    estado: 'SP',
    cidade: 'São Paulo',
    nomeResponsavel: 'João Silva',
    cargoResponsavel: 'Gerente',
    contatoResponsavel: '(11) 98765-4321',
    emailResponsavel: 'joao@fornecedorteste.com.br',
    irrfPercentual: 1.5,
    pisPercentual: 0.65,
    cofinsPercentual: 3.0,
    csllPercentual: 1.08,
    issPercentual: 5.0,
    ibsPercentual: 2.0,
    cbsPercentual: 1.5,
    reterIss: true,
    reterIr: false,
    reterPcc: true,
    reterIbs: false,
    reterCbs: false,
    optanteSimplesNacional: true,
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    contaCorrente: '12345-6',
    formaPagamento: 'Transferência Bancária',
    contasBancarias: [],
    ativo: true,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };

  const mockFornecedor = {
    id: 'fornecedor-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigo_fornecedor: 'FORN001',
    categorias_fornecidas: [CategoriaInsumo.REAGENTES_INSUMOS],
    metodos_transporte: [MetodoTransporte.CORREIOS],
    formas_pagamento_aceitas: [FormaPagamentoFornecedor.BOLETO],
    prazo_entrega_padrao: 7,
    prazo_entrega_urgente: 2,
    orcamento_minimo: 100.0,
    orcamento_maximo: 10000.0,
    desconto_padrao: 5.0,
    avaliacao_media: 4.5,
    total_avaliacoes: 10,
    status_fornecedor: StatusFornecedor.ATIVO,
    certificacoes: ['ISO 9001'],
    possui_certificacao_iso: true,
    possui_licenca_anvisa: false,
    data_vencimento_licencas: null,
    representante_comercial: 'João Silva',
    telefone_comercial: '(11) 1234-5678',
    email_comercial: 'comercial@fornecedor.com.br',
    gerente_conta: 'Maria Santos',
    aceita_pedido_urgente: true,
    entrega_sabado: false,
    entrega_domingo: false,
    horario_inicio_entrega: '08:00',
    horario_fim_entrega: '17:00',
    estados_atendidos: ['SP', 'RJ'],
    cidades_atendidas: ['São Paulo', 'Rio de Janeiro'],
    atende_todo_brasil: false,
    observacoes: 'Fornecedor confiável',
    condicoes_especiais: 'Desconto para grandes volumes',
    historico_problemas: null,
    data_ultimo_pedido: new Date(),
    data_proxima_avaliacao: new Date(),
    aprovado_por: 'admin-uuid',
    data_aprovacao: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  } as Fornecedor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FornecedorService,
        {
          provide: getRepositoryToken(Fornecedor),
          useValue: mockFornecedorRepository,
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

    service = module.get<FornecedorService>(FornecedorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createFornecedorDto: CreateFornecedorDto = {
      empresa: {
        tipoEmpresa: TipoEmpresaEnum.FORNECEDORES,
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'Fornecedor Teste Ltda',
        nomeFantasia: 'Fornecedor Teste',
        emailComercial: 'contato@fornecedorteste.com.br',
      },
      codigo_fornecedor: 'FORN001',
      categorias_fornecidas: [CategoriaInsumo.REAGENTES_INSUMOS],
      metodos_transporte: [MetodoTransporte.CORREIOS],
      formas_pagamento_aceitas: [FormaPagamentoFornecedor.BOLETO],
      prazo_entrega_padrao: 7,
    };

    it('deve criar um fornecedor com sucesso', async () => {
      mockFornecedorRepository.findOne.mockResolvedValueOnce(null); // Código não existe
      mockEmpresaRepository.findOne.mockResolvedValue(null); // CNPJ não existe
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockFornecedor);
      mockFornecedorRepository.create.mockReturnValue(mockFornecedor);

      // Mock do findOne para retornar o fornecedor criado
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedor);

      const result = await service.create(createFornecedorDto);

      expect(result).toEqual(mockFornecedor);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(mockFornecedorRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_fornecedor: createFornecedorDto.codigo_fornecedor },
      });
      expect(mockEmpresaRepository.findOne).toHaveBeenCalledWith({
        where: { cnpj: createFornecedorDto.empresa.cnpj },
      });
    });

    it('deve lançar ConflictException quando código já existir', async () => {
      mockFornecedorRepository.findOne.mockResolvedValue(mockFornecedor); // Código já existe

      await expect(service.create(createFornecedorDto)).rejects.toThrow(
        new ConflictException('Já existe um fornecedor com este código'),
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando CNPJ já existir', async () => {
      mockFornecedorRepository.findOne.mockResolvedValue(null); // Código não existe
      mockEmpresaRepository.findOne.mockResolvedValue(mockEmpresa); // CNPJ já existe

      await expect(service.create(createFornecedorDto)).rejects.toThrow(
        new ConflictException('Já existe uma empresa com este CNPJ'),
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve fazer rollback em caso de erro', async () => {
      mockFornecedorRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createFornecedorDto)).rejects.toThrow(
        'Database error',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de fornecedores ordenados por nome fantasia', async () => {
      const fornecedores = [
        {
          ...mockFornecedor,
          empresa: { ...mockEmpresa, nomeFantasia: 'B Fornecedor' },
        },
        {
          ...mockFornecedor,
          empresa: { ...mockEmpresa, nomeFantasia: 'A Fornecedor' },
        },
      ];

      mockFornecedorRepository.find.mockResolvedValue(fornecedores);

      const result = await service.findAll();

      expect(result).toEqual(fornecedores);
      expect(mockFornecedorRepository.find).toHaveBeenCalledWith({
        relations: ['empresa'],
      });
    });

    it('deve retornar lista vazia quando não há fornecedores', async () => {
      mockFornecedorRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um fornecedor por ID', async () => {
      mockFornecedorRepository.findOne.mockResolvedValue(mockFornecedor);

      const result = await service.findOne('fornecedor-uuid-1');

      expect(result).toEqual(mockFornecedor);
      expect(mockFornecedorRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'fornecedor-uuid-1' },
        relations: ['empresa'],
      });
    });

    it('deve lançar NotFoundException quando fornecedor não existir', async () => {
      mockFornecedorRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException('Fornecedor com ID invalid-id não encontrado'),
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um fornecedor por código', async () => {
      mockFornecedorRepository.findOne.mockResolvedValue(mockFornecedor);

      const result = await service.findByCodigo('FORN001');

      expect(result).toEqual(mockFornecedor);
      expect(mockFornecedorRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_fornecedor: 'FORN001' },
        relations: ['empresa'],
      });
    });

    it('deve lançar NotFoundException quando código não existir', async () => {
      mockFornecedorRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INEXISTENTE')).rejects.toThrow(
        new NotFoundException(
          'Fornecedor com código INEXISTENTE não encontrado',
        ),
      );
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar um fornecedor por CNPJ', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockFornecedor),
        getMany: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockFornecedorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockFornecedor);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'fornecedor.empresa',
        'empresa',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith('empresa.cnpj = :cnpj', {
        cnpj: '12.345.678/0001-90',
      });
    });

    it('deve lançar NotFoundException quando CNPJ não existir', async () => {
      const queryBuilder = mockFornecedorRepository.createQueryBuilder();
      queryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        new NotFoundException(
          'Fornecedor com CNPJ 00.000.000/0000-00 não encontrado',
        ),
      );
    });
  });

  describe('findAtivos', () => {
    it('deve retornar fornecedores ativos', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockFornecedor]),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockFornecedorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAtivos();

      expect(result).toEqual([mockFornecedor]);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'fornecedor.empresa',
        'empresa',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'empresa.ativo = :ativo',
        { ativo: true },
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'empresa.nomeFantasia',
        'ASC',
      );
    });
  });

  describe('findByStatus', () => {
    it('deve retornar fornecedores por status', async () => {
      mockFornecedorRepository.find.mockResolvedValue([mockFornecedor]);

      const result = await service.findByStatus('ativo');

      expect(result).toEqual([mockFornecedor]);
      expect(mockFornecedorRepository.find).toHaveBeenCalledWith({
        where: { status_fornecedor: 'ativo' },
        relations: ['empresa'],
      });
    });
  });

  describe('findByCategoria', () => {
    it('deve retornar fornecedores por categoria', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockFornecedor]),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockFornecedorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findByCategoria(
        CategoriaInsumo.REAGENTES_INSUMOS,
      );

      expect(result).toEqual([mockFornecedor]);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        ':categoria = ANY(fornecedor.categorias_fornecidas)',
        {
          categoria: CategoriaInsumo.REAGENTES_INSUMOS,
        },
      );
    });
  });

  describe('findByRegiao', () => {
    it('deve retornar fornecedores por região', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockFornecedor]),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockFornecedorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findByRegiao(['SP', 'RJ']);

      expect(result).toEqual([mockFornecedor]);
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'fornecedor.atende_todo_brasil = true OR fornecedor.estados_atendidos && :estados',
        { estados: ['SP', 'RJ'] },
      );
    });
  });

  describe('findPendentesAprovacao', () => {
    it('deve retornar fornecedores pendentes de aprovação', async () => {
      const fornecedorPendente = {
        ...mockFornecedor,
        status_fornecedor: StatusFornecedor.PENDENTE_APROVACAO,
      };
      mockFornecedorRepository.find.mockResolvedValue([fornecedorPendente]);

      const result = await service.findPendentesAprovacao();

      expect(result).toEqual([fornecedorPendente]);
      expect(mockFornecedorRepository.find).toHaveBeenCalledWith({
        where: { status_fornecedor: 'pendente_aprovacao' },
        relations: ['empresa'],
        order: { created_at: 'ASC' },
      });
    });
  });

  describe('update', () => {
    const updateFornecedorDto: UpdateFornecedorDto = {
      codigo_fornecedor: 'FORN002',
      prazo_entrega_padrao: 10,
    };

    it('deve atualizar um fornecedor com sucesso', async () => {
      const updatedFornecedor = {
        ...mockFornecedor,
        codigo_fornecedor: updateFornecedorDto.codigo_fornecedor,
        prazo_entrega_padrao: updateFornecedorDto.prazo_entrega_padrao,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockFornecedor)
        .mockResolvedValueOnce(updatedFornecedor);
      mockFornecedorRepository.findOne.mockResolvedValueOnce(null); // Código não existe
      mockQueryRunner.manager.save.mockResolvedValue(updatedFornecedor);

      const result = await service.update(
        'fornecedor-uuid-1',
        updateFornecedorDto,
      );

      expect(result).toEqual(updatedFornecedor);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando novo código já existir', async () => {
      const fornecedorAtual = {
        ...mockFornecedor,
        codigo_fornecedor: 'FORN001',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(fornecedorAtual);

      // Simula que já existe outro fornecedor com o novo código
      mockFornecedorRepository.findOne.mockResolvedValue({
        id: 'outro-id',
        codigo_fornecedor: 'FORN002',
      });

      await expect(
        service.update('fornecedor-uuid-1', updateFornecedorDto),
      ).rejects.toThrow('Já existe um fornecedor com este código');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve atualizar dados da empresa quando fornecidos', async () => {
      const updateComEmpresa = {
        ...updateFornecedorDto,
        empresa: {
          tipoEmpresa: TipoEmpresaEnum.FORNECEDORES,
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Fornecedor Teste Ltda',
          nomeFantasia: 'Novo Nome',
          emailComercial: 'novo@email.com',
        },
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockFornecedor)
        .mockResolvedValueOnce(mockFornecedor);
      mockFornecedorRepository.findOne.mockResolvedValue(null);
      mockEmpresaRepository.findOne.mockResolvedValue(null);
      mockQueryRunner.manager.save.mockResolvedValue(mockFornecedor);

      await service.update('fornecedor-uuid-1', updateComEmpresa);

      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2); // empresa + fornecedor
    });

    it('deve fazer rollback em caso de erro', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedor);
      mockFornecedorRepository.findOne.mockResolvedValue(null);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.update('fornecedor-uuid-1', updateFornecedorDto),
      ).rejects.toThrow('Database error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um fornecedor com sucesso', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFornecedor);
      mockFornecedorRepository.remove.mockResolvedValue(mockFornecedor);

      await service.remove('fornecedor-uuid-1');

      expect(mockFornecedorRepository.remove).toHaveBeenCalledWith(
        mockFornecedor,
      );
    });

    it('deve lançar NotFoundException quando fornecedor não existir', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException('Fornecedor com ID invalid-id não encontrado'),
        );

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockFornecedor)
        .mockResolvedValueOnce({
          ...mockFornecedor,
          empresa: { ...mockEmpresa, ativo: false },
        });
      mockEmpresaRepository.save.mockResolvedValue({
        ...mockEmpresa,
        ativo: false,
      });

      const result = await service.toggleStatus('fornecedor-uuid-1');

      expect(result.empresa.ativo).toBe(false);
      expect(mockEmpresaRepository.save).toHaveBeenCalled();
    });

    it('deve alternar status de inativo para ativo', async () => {
      const fornecedorInativo = {
        ...mockFornecedor,
        empresa: { ...mockEmpresa, ativo: false },
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(fornecedorInativo)
        .mockResolvedValueOnce({
          ...mockFornecedor,
          empresa: { ...mockEmpresa, ativo: true },
        });
      mockEmpresaRepository.save.mockResolvedValue({
        ...mockEmpresa,
        ativo: true,
      });

      const result = await service.toggleStatus('fornecedor-uuid-1');

      expect(result.empresa.ativo).toBe(true);
      expect(mockEmpresaRepository.save).toHaveBeenCalled();
    });
  });

  describe('aprovarFornecedor', () => {
    it('deve aprovar um fornecedor com sucesso', async () => {
      const fornecedorPendente = {
        ...mockFornecedor,
        status_fornecedor: StatusFornecedor.PENDENTE_APROVACAO,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(fornecedorPendente)
        .mockResolvedValueOnce({
          ...fornecedorPendente,
          status_fornecedor: StatusFornecedor.ATIVO,
          aprovado_por: 'admin-uuid',
          data_aprovacao: expect.any(Date),
        });
      mockFornecedorRepository.save.mockResolvedValue({
        ...fornecedorPendente,
        status_fornecedor: StatusFornecedor.ATIVO,
      });

      const result = await service.aprovarFornecedor(
        'fornecedor-uuid-1',
        'admin-uuid',
      );

      expect(result.status_fornecedor).toBe(StatusFornecedor.ATIVO);
      expect(result.aprovado_por).toBe('admin-uuid');
      expect(mockFornecedorRepository.save).toHaveBeenCalled();
    });
  });

  describe('reprovarFornecedor', () => {
    it('deve reprovar um fornecedor com sucesso', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockFornecedor)
        .mockResolvedValueOnce({
          ...mockFornecedor,
          status_fornecedor: StatusFornecedor.BLOQUEADO,
        });
      mockFornecedorRepository.save.mockResolvedValue({
        ...mockFornecedor,
        status_fornecedor: StatusFornecedor.BLOQUEADO,
      });

      const result = await service.reprovarFornecedor('fornecedor-uuid-1');

      expect(result.status_fornecedor).toBe(StatusFornecedor.BLOQUEADO);
      expect(mockFornecedorRepository.save).toHaveBeenCalled();
    });
  });

  describe('atualizarAvaliacao', () => {
    it('deve atualizar avaliação de um fornecedor', async () => {
      const fornecedorSemAvaliacao = {
        ...mockFornecedor,
        avaliacao_media: 0,
        total_avaliacoes: 0,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(fornecedorSemAvaliacao)
        .mockResolvedValueOnce({
          ...fornecedorSemAvaliacao,
          avaliacao_media: 4.0,
          total_avaliacoes: 1,
        });
      mockFornecedorRepository.save.mockResolvedValue(fornecedorSemAvaliacao);

      const result = await service.atualizarAvaliacao('fornecedor-uuid-1', 4);

      expect(result.avaliacao_media).toBe(4.0);
      expect(result.total_avaliacoes).toBe(1);
      expect(mockFornecedorRepository.save).toHaveBeenCalled();
    });

    it('deve calcular nova média com avaliações existentes', async () => {
      const fornecedorComAvaliacoes = {
        ...mockFornecedor,
        avaliacao_media: 4.0,
        total_avaliacoes: 2,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(fornecedorComAvaliacoes)
        .mockResolvedValueOnce({
          ...fornecedorComAvaliacoes,
          avaliacao_media: 4.33,
          total_avaliacoes: 3,
        });
      mockFornecedorRepository.save.mockResolvedValue(fornecedorComAvaliacoes);

      const result = await service.atualizarAvaliacao('fornecedor-uuid-1', 5);

      // Média esperada: (4.0 * 2 + 5) / 3 = 4.33 (arredondado)
      expect(result.avaliacao_media).toBe(4.33);
      expect(result.total_avaliacoes).toBe(3);
    });
  });

  describe('search', () => {
    it('deve buscar fornecedores por termo', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn().mockResolvedValue([mockFornecedor]),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockFornecedorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.search('Teste');

      expect(result).toEqual([mockFornecedor]);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'fornecedor.empresa',
        'empresa',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'empresa.nomeFantasia ILIKE :query',
        { query: '%Teste%' },
      );
      expect(queryBuilder.orWhere).toHaveBeenCalledTimes(4); // razãoSocial, cnpj, código, representante
    });

    it('deve retornar lista vazia quando não encontrar resultados', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn().mockResolvedValue([]),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockFornecedorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.search('inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas dos fornecedores', async () => {
      const mockEstatisticas = {
        total: 10,
        ativos: 8,
        inativos: 2,
        porStatus: [
          { status: 'ativo', total: '8' },
          { status: 'bloqueado', total: '2' },
        ],
        porCategoria: [
          { categoria: 'reagentes_insumos', total: '5' },
          { categoria: 'equipamentos_medicos', total: '3' },
        ],
        avaliacaoGeral: 4.2,
      };

      mockFornecedorRepository.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(8);

      const queryBuilder1 = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockEstatisticas.porStatus),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      const queryBuilder2 = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockEstatisticas.porCategoria),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      const queryBuilder3 = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        getRawOne: jest.fn().mockResolvedValue({ media: 4.2 }),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockFornecedorRepository.createQueryBuilder
        .mockReturnValueOnce(queryBuilder1)
        .mockReturnValueOnce(queryBuilder2)
        .mockReturnValueOnce(queryBuilder3);

      const result = await service.getEstatisticas();

      expect(result).toEqual(mockEstatisticas);
      expect(mockFornecedorRepository.count).toHaveBeenCalledTimes(2);
    });
  });

  describe('getFornecedoresPorRegiao', () => {
    it('deve retornar fornecedores por região', async () => {
      const mockRegiao = {
        nacionais: 3,
        regionais: [
          { estado: 'SP', total: '5' },
          { estado: 'RJ', total: '2' },
        ],
      };

      mockFornecedorRepository.count.mockResolvedValue(3);

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockRegiao.regionais),
        getRawOne: jest.fn(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockFornecedorRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getFornecedoresPorRegiao();

      expect(result).toEqual(mockRegiao);
      expect(mockFornecedorRepository.count).toHaveBeenCalledWith({
        where: { atende_todo_brasil: true },
      });
    });
  });
});
