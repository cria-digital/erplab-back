import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UnidadeSaudeService } from './unidade-saude.service';
import { UnidadeSaude } from './entities/unidade-saude.entity';
import { HorarioAtendimento } from './entities/horario-atendimento.entity';
import { CnaeSecundario } from './entities/cnae-secundario.entity';
import { ContaBancaria } from '../../financeiro/core/entities/conta-bancaria.entity';
import { ContaBancariaUnidade } from '../../financeiro/core/entities/conta-bancaria-unidade.entity';
import { Cnae } from '../../infraestrutura/common/entities/cnae.entity';
import { CreateUnidadeSaudeDto } from './dto/create-unidade-saude.dto';
import { UpdateUnidadeSaudeDto } from './dto/update-unidade-saude.dto';

describe('UnidadeSaudeService', () => {
  let service: UnidadeSaudeService;

  const mockUnidadeSaude = {
    id: 'unidade-uuid-1',
    nomeUnidade: 'Clínica Saúde Total',
    cnpj: '12345678000199',
    razaoSocial: 'Clínica Saúde Total Ltda',
    nomeFantasia: 'Saúde Total',
    cidade: 'Brasília',
    estado: 'DF',
    ativo: true,
    horariosAtendimento: [],
    contas_bancarias: [],
    cnaeSecundarios: [],
  } as UnidadeSaude;

  const mockHorarioAtendimento = {
    id: 'horario-uuid-1',
    unidadeSaudeId: 'unidade-uuid-1',
    diaSemana: 'SEGUNDA' as any,
    horarioInicio: '08:00',
    horarioFim: '18:00',
    intervaloInicio: '12:00',
    intervaloFim: '13:00',
    semIntervalo: false,
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    unidadeSaude: null,
  } as HorarioAtendimento;

  const mockContaBancaria = {
    id: 'conta-uuid-1',
    banco_id: 'banco-uuid-1',
    agencia: '1234',
    digito_agencia: '5',
    numero_conta: '567890',
    digito_conta: '1',
    tipo_conta: 'corrente',
    pix_tipo: null,
    pix_chave: null,
    status: 'ativa',
    saldo_inicial: 0,
    observacoes: null,
    ativo: true,
    created_at: new Date(),
    updated_at: new Date(),
    banco: {
      id: 'banco-uuid-1',
      codigo: '001',
      nome: 'Banco do Brasil',
    },
  } as any as ContaBancaria;

  const _mockContaBancariaUnidade = {
    id: 'vinculo-uuid-1',
    conta_bancaria_id: 'conta-uuid-1',
    unidade_saude_id: 'unidade-uuid-1',
    ativo: true,
    created_at: new Date(),
    conta_bancaria: mockContaBancaria,
  } as ContaBancariaUnidade;

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
      findOne: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  const mockUnidadeSaudeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
  };

  const mockHorarioAtendimentoRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockContaBancariaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockContaBancariaUnidadeRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCnaeSecundarioRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCnaeRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnidadeSaudeService,
        {
          provide: getRepositoryToken(UnidadeSaude),
          useValue: mockUnidadeSaudeRepository,
        },
        {
          provide: getRepositoryToken(HorarioAtendimento),
          useValue: mockHorarioAtendimentoRepository,
        },
        {
          provide: getRepositoryToken(CnaeSecundario),
          useValue: mockCnaeSecundarioRepository,
        },
        {
          provide: getRepositoryToken(Cnae),
          useValue: mockCnaeRepository,
        },
        {
          provide: getRepositoryToken(ContaBancaria),
          useValue: mockContaBancariaRepository,
        },
        {
          provide: getRepositoryToken(ContaBancariaUnidade),
          useValue: mockContaBancariaUnidadeRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UnidadeSaudeService>(UnidadeSaudeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    // Reset query runner mocks to default behavior
    mockQueryRunner.connect.mockResolvedValue(undefined);
    mockQueryRunner.startTransaction.mockResolvedValue(undefined);
    mockQueryRunner.commitTransaction.mockResolvedValue(undefined);
    mockQueryRunner.rollbackTransaction.mockResolvedValue(undefined);
    mockQueryRunner.release.mockResolvedValue(undefined);
    mockQueryRunner.manager.save.mockResolvedValue(undefined);
    mockQueryRunner.manager.update.mockResolvedValue(undefined);
    // Reset repository mocks
    mockContaBancariaRepository.findOne.mockResolvedValue(null);
    mockCnaeRepository.findOne.mockResolvedValue({
      id: 'cnae-uuid',
      codigo: '8640-2/03',
    });
    mockQueryRunner.manager.delete.mockResolvedValue(undefined);
    mockQueryRunner.manager.findOne.mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUnidadeSaudeDto: CreateUnidadeSaudeDto = {
      nomeUnidade: 'Clínica Saúde Total',
      cnpj: '12345678000199',
      razaoSocial: 'Clínica Saúde Total Ltda',
      nomeFantasia: 'Saúde Total',
      cep: '70000000',
      rua: 'Rua das Flores, 123',
      numero: '123',
      bairro: 'Centro',
      cidade: 'Brasília',
      estado: 'DF',
      email: 'contato@saudetotal.com.br',
      horariosAtendimento: [
        {
          diaSemana: 'SEGUNDA' as any,
          horarioInicio: '08:00',
          horarioFim: '18:00',
        },
      ],
      contas_bancarias: [
        {
          conta_bancaria_id: 'conta-uuid-1',
        },
      ],
      cnaeSecundarios: [
        {
          cnaeId: 'cnae-uuid-2',
        },
      ],
    };

    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);
    });

    it('deve criar uma unidade de saúde com sucesso', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValue(mockUnidadeSaude);
      mockHorarioAtendimentoRepository.create.mockReturnValue(
        mockHorarioAtendimento,
      );
      mockContaBancariaRepository.findOne.mockResolvedValue(mockContaBancaria);

      const result = await service.create(createUnidadeSaudeDto);

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando CNPJ já existir', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(mockUnidadeSaude);

      await expect(service.create(createUnidadeSaudeDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve vincular conta bancária existente', async () => {
      const dtoComConta = {
        ...createUnidadeSaudeDto,
        contas_bancarias: [
          {
            conta_bancaria_id: 'conta-uuid-1',
          },
        ],
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValue(mockUnidadeSaude);
      mockContaBancariaRepository.findOne.mockResolvedValue(mockContaBancaria);

      await service.create(dtoComConta);

      // Verifica que a conta bancária foi vinculada corretamente
      expect(mockQueryRunner.manager.save).toHaveBeenCalled();
    });

    it('deve fazer rollback em caso de erro', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createUnidadeSaudeDto)).rejects.toThrow(
        'Database error',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve criar unidade sem relacionamentos opcionais', async () => {
      const dtoSimples = {
        nomeUnidade: 'Clínica Simples',
        cnpj: '98765432000111',
        razaoSocial: 'Clínica Simples Ltda',
        nomeFantasia: 'Simples',
        cep: '70000000',
        rua: 'Rua A',
        numero: '1',
        bairro: 'Centro',
        cidade: 'Brasília',
        estado: 'DF',
        email: 'contato@simples.com.br',
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValue(mockUnidadeSaude);

      const result = await service.create(dtoSimples);

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve listar unidades com paginação', async () => {
      const paginatedResult = {
        data: [mockUnidadeSaude],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([
        [mockUnidadeSaude],
        1,
      ]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(paginatedResult);
      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: [
          'horariosAtendimento',
          'contas_bancarias',
          'contas_bancarias.conta_bancaria',
          'contas_bancarias.conta_bancaria.banco',
          'contas_bancarias.unidade_saude',
          'cnaeSecundarios',
        ],
        order: { nomeUnidade: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve aplicar filtros de busca', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ search: 'Saúde' });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith({
        where: [
          {
            ativo: true,
            nomeUnidade: expect.objectContaining({ _type: 'ilike' }),
          },
          {
            ativo: true,
            nomeFantasia: expect.objectContaining({ _type: 'ilike' }),
          },
          {
            ativo: true,
            cnpj: expect.objectContaining({ _type: 'ilike' }),
          },
          {
            ativo: true,
            razaoSocial: expect.objectContaining({ _type: 'ilike' }),
          },
        ],
        relations: [
          'horariosAtendimento',
          'contas_bancarias',
          'contas_bancarias.conta_bancaria',
          'contas_bancarias.conta_bancaria.banco',
          'contas_bancarias.unidade_saude',
          'cnaeSecundarios',
        ],
        order: { nomeUnidade: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve aplicar filtro por status ativo (padrão quando incluirInativos é false)', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ incluirInativos: false });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: [
          'horariosAtendimento',
          'contas_bancarias',
          'contas_bancarias.conta_bancaria',
          'contas_bancarias.conta_bancaria.banco',
          'contas_bancarias.unidade_saude',
          'cnaeSecundarios',
        ],
        order: { nomeUnidade: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve aplicar filtros por cidade e estado', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ cidade: 'Brasília', estado: 'df' });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          ativo: true,
          cidade: expect.objectContaining({ _type: 'ilike' }),
          estado: 'DF',
        },
        relations: [
          'horariosAtendimento',
          'contas_bancarias',
          'contas_bancarias.conta_bancaria',
          'contas_bancarias.conta_bancaria.banco',
          'contas_bancarias.unidade_saude',
          'cnaeSecundarios',
        ],
        order: { nomeUnidade: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve calcular paginação corretamente', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ page: 3, limit: 20 });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: [
          'horariosAtendimento',
          'contas_bancarias',
          'contas_bancarias.conta_bancaria',
          'contas_bancarias.conta_bancaria.banco',
          'contas_bancarias.unidade_saude',
          'cnaeSecundarios',
        ],
        order: { nomeUnidade: 'ASC' },
        skip: 40,
        take: 20,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma unidade por ID', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(mockUnidadeSaude);

      const result = await service.findOne('unidade-uuid-1');

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockUnidadeSaudeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'unidade-uuid-1' },
        relations: [
          'horariosAtendimento',
          'contas_bancarias',
          'contas_bancarias.conta_bancaria',
          'contas_bancarias.conta_bancaria.banco',
          'contas_bancarias.unidade_saude',
          'cnaeSecundarios',
        ],
      });
    });

    it('deve lançar NotFoundException quando unidade não for encontrada', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar uma unidade por CNPJ', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(mockUnidadeSaude);

      const result = await service.findByCnpj('12345678000199');

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockUnidadeSaudeRepository.findOne).toHaveBeenCalledWith({
        where: { cnpj: '12345678000199' },
        relations: [
          'horariosAtendimento',
          'contas_bancarias',
          'contas_bancarias.conta_bancaria',
          'contas_bancarias.conta_bancaria.banco',
          'contas_bancarias.unidade_saude',
          'cnaeSecundarios',
        ],
      });
    });

    it('deve lançar NotFoundException quando CNPJ não for encontrado', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00000000000000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateUnidadeSaudeDto: UpdateUnidadeSaudeDto = {
      nomeUnidade: 'Clínica Saúde Total Atualizada',
    };

    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);
    });

    it('deve atualizar uma unidade com sucesso', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(
        'unidade-uuid-1',
        updateUnidadeSaudeDto,
      );

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        UnidadeSaude,
        { id: 'unidade-uuid-1' },
        {
          nomeUnidade: 'Clínica Saúde Total Atualizada',
          cnaePrincipalId: undefined,
        },
      );
    });

    it('deve lançar ConflictException quando novo CNPJ já existir', async () => {
      const updateDto = { cnpj: '98765432000111' };
      const existingUnidade = { ...mockUnidadeSaude, id: 'outro-id' };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(existingUnidade);

      await expect(service.update('unidade-uuid-1', updateDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('deve permitir atualizar mantendo o mesmo CNPJ', async () => {
      const updateDto = { cnpj: '12345678000199' };

      const result = await service.update('unidade-uuid-1', updateDto);

      expect(result).toEqual(mockUnidadeSaude);
    });

    it('deve atualizar horários de atendimento', async () => {
      const updateDto = {
        horariosAtendimento: [
          {
            diaSemana: 'TERCA' as any,
            horarioInicio: '09:00',
            horarioFim: '17:00',
          },
        ],
      };

      mockHorarioAtendimentoRepository.create.mockReturnValue(
        mockHorarioAtendimento,
      );

      await service.update('unidade-uuid-1', updateDto);

      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        HorarioAtendimento,
        { unidadeSaudeId: 'unidade-uuid-1' },
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        HorarioAtendimento,
        expect.any(Array),
      );
    });

    it('deve atualizar vínculos de contas bancárias', async () => {
      const updateDto = {
        contas_bancarias: [
          {
            conta_bancaria_id: 'conta-uuid-2',
          },
        ],
      };

      // Mock findOne to return conta existente
      mockContaBancariaRepository.findOne.mockResolvedValue(mockContaBancaria);
      mockContaBancariaUnidadeRepository.create.mockReturnValue({
        conta_bancaria_id: 'conta-uuid-2',
        unidade_saude_id: 'unidade-uuid-1',
        ativo: true,
      });

      await service.update('unidade-uuid-1', updateDto);

      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        ContaBancariaUnidade,
        { unidade_saude_id: 'unidade-uuid-1' },
      );
      // Verifica que ContaBancariaUnidade foi salva
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        ContaBancariaUnidade,
        expect.any(Object),
      );
    });

    it('deve atualizar CNAEs secundários', async () => {
      const updateDto = {
        cnaeSecundarios: [
          {
            cnaeId: 'cnae-uuid-3',
          },
        ],
      };

      await service.update('unidade-uuid-1', updateDto);

      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        CnaeSecundario,
        { unidadeSaudeId: 'unidade-uuid-1' },
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        CnaeSecundario,
        expect.any(Array),
      );
    });

    it('deve fazer rollback em caso de erro', async () => {
      mockQueryRunner.manager.update.mockRejectedValue(
        new Error('Update error'),
      );

      await expect(
        service.update('unidade-uuid-1', updateUnidadeSaudeDto),
      ).rejects.toThrow('Update error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve desativar uma unidade (soft delete)', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);
      mockUnidadeSaudeRepository.update.mockResolvedValue({ affected: 1 });

      await service.remove('unidade-uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('unidade-uuid-1');
      expect(mockUnidadeSaudeRepository.update).toHaveBeenCalledWith(
        'unidade-uuid-1',
        { ativo: false },
      );
    });
  });

  describe('activate', () => {
    it('deve ativar uma unidade', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);
      mockUnidadeSaudeRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.activate('unidade-uuid-1');

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockUnidadeSaudeRepository.update).toHaveBeenCalledWith(
        'unidade-uuid-1',
        { ativo: true },
      );
    });
  });

  describe('deactivate', () => {
    it('deve desativar uma unidade', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);
      mockUnidadeSaudeRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.deactivate('unidade-uuid-1');

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockUnidadeSaudeRepository.update).toHaveBeenCalledWith(
        'unidade-uuid-1',
        { ativo: false },
      );
    });
  });

  describe('listActive', () => {
    it('deve listar unidades ativas para dropdown', async () => {
      const activeUnidades = [
        {
          id: 'unidade-uuid-1',
          nomeUnidade: 'Clínica A',
          nomeFantasia: 'A',
          cnpj: '12345678000199',
        },
      ];

      mockUnidadeSaudeRepository.find.mockResolvedValue(activeUnidades);

      const result = await service.listActive();

      expect(result).toEqual(activeUnidades);
      expect(mockUnidadeSaudeRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        select: ['id', 'nomeUnidade', 'nomeFantasia', 'cnpj'],
        order: { nomeUnidade: 'ASC' },
      });
    });
  });

  describe('findByCidade', () => {
    it('deve buscar unidades por cidade', async () => {
      const unidadesBrasilia = [mockUnidadeSaude];
      mockUnidadeSaudeRepository.find.mockResolvedValue(unidadesBrasilia);

      const result = await service.findByCidade('Brasília');

      expect(result).toEqual(unidadesBrasilia);
      expect(mockUnidadeSaudeRepository.find).toHaveBeenCalledWith({
        where: {
          cidade: expect.objectContaining({ _type: 'ilike' }),
          ativo: true,
        },
        relations: ['horariosAtendimento'],
        order: { nomeUnidade: 'ASC' },
      });
    });
  });

  describe('update - casos adicionais de contas bancárias', () => {
    it('deve vincular múltiplas contas bancárias existentes', async () => {
      const updateDto = {
        contas_bancarias: [
          {
            conta_bancaria_id: 'conta-uuid-1',
          },
          {
            conta_bancaria_id: 'conta-uuid-2',
          },
        ],
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockContaBancariaRepository.findOne.mockResolvedValue(mockContaBancaria);
      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      mockQueryRunner.manager.delete.mockResolvedValue({});
      mockQueryRunner.manager.save.mockResolvedValue(mockUnidadeSaude);
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);

      await service.update('uuid-123', updateDto);

      // Verifica que as contas bancárias foram vinculadas
      expect(mockQueryRunner.manager.save).toHaveBeenCalled();
    });
  });

  describe('validateCnpj', () => {
    it('deve validar CNPJ válido', () => {
      const testService = new UnidadeSaudeService(
        mockUnidadeSaudeRepository as any,
        mockHorarioAtendimentoRepository as any,
        mockCnaeSecundarioRepository as any,
        mockContaBancariaRepository as any,
        mockContaBancariaUnidadeRepository as any,
        mockCnaeRepository as any,
        mockDataSource as any,
      );

      // Testa CNPJ válido
      const result = testService['validateCnpj']('11.222.333/0001-81');
      expect(result).toBe(true);
    });

    it('deve rejeitar CNPJ com tamanho incorreto', () => {
      const testService = new UnidadeSaudeService(
        mockUnidadeSaudeRepository as any,
        mockHorarioAtendimentoRepository as any,
        mockCnaeSecundarioRepository as any,
        mockContaBancariaRepository as any,
        mockContaBancariaUnidadeRepository as any,
        mockCnaeRepository as any,
        mockDataSource as any,
      );

      const result = testService['validateCnpj']('12345678');
      expect(result).toBe(false);
    });

    it('deve rejeitar CNPJ com todos dígitos iguais', () => {
      const testService = new UnidadeSaudeService(
        mockUnidadeSaudeRepository as any,
        mockHorarioAtendimentoRepository as any,
        mockCnaeSecundarioRepository as any,
        mockContaBancariaRepository as any,
        mockContaBancariaUnidadeRepository as any,
        mockCnaeRepository as any,
        mockDataSource as any,
      );

      const result = testService['validateCnpj']('11111111111111');
      expect(result).toBe(false);
    });

    it('deve rejeitar CNPJ com dígitos verificadores inválidos', () => {
      const testService = new UnidadeSaudeService(
        mockUnidadeSaudeRepository as any,
        mockHorarioAtendimentoRepository as any,
        mockCnaeSecundarioRepository as any,
        mockContaBancariaRepository as any,
        mockContaBancariaUnidadeRepository as any,
        mockCnaeRepository as any,
        mockDataSource as any,
      );

      const result = testService['validateCnpj']('11.222.333/0001-99');
      expect(result).toBe(false);
    });

    it('deve validar CNPJ removendo caracteres especiais', () => {
      const testService = new UnidadeSaudeService(
        mockUnidadeSaudeRepository as any,
        mockHorarioAtendimentoRepository as any,
        mockCnaeSecundarioRepository as any,
        mockContaBancariaRepository as any,
        mockContaBancariaUnidadeRepository as any,
        mockCnaeRepository as any,
        mockDataSource as any,
      );

      // CNPJ válido com formatação
      const result = testService['validateCnpj']('11.222.333/0001-81');
      expect(result).toBe(true);
    });

    it('deve validar corretamente CNPJ com soma que resulta em resto menor que 2', () => {
      const testService = new UnidadeSaudeService(
        mockUnidadeSaudeRepository as any,
        mockHorarioAtendimentoRepository as any,
        mockCnaeSecundarioRepository as any,
        mockContaBancariaRepository as any,
        mockContaBancariaUnidadeRepository as any,
        mockCnaeRepository as any,
        mockDataSource as any,
      );

      // CNPJ que resulta em resto < 2 no cálculo
      const result = testService['validateCnpj']('11.444.777/0001-61');
      expect(result).toBe(true);
    });
  });

  describe('findByCnpj', () => {
    it('deve lançar erro quando CNPJ não é encontrado', async () => {
      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCnpj('12.345.678/0001-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Comprehensive test cases for better coverage
  describe('create - comprehensive error scenarios', () => {
    const createDto: CreateUnidadeSaudeDto = {
      nomeUnidade: 'Clínica Teste',
      cnpj: '12345678000199',
      razaoSocial: 'Clínica Teste Ltda',
      nomeFantasia: 'Teste',
      cep: '70000000',
      rua: 'Rua A',
      numero: '1',
      bairro: 'Centro',
      cidade: 'Brasília',
      estado: 'DF',
      email: 'test@test.com',
    };

    beforeEach(() => {
      // Reset all mocks to clean state for create tests
      jest.clearAllMocks();
      mockQueryRunner.connect.mockResolvedValue(undefined);
      mockQueryRunner.startTransaction.mockResolvedValue(undefined);
      mockQueryRunner.commitTransaction.mockResolvedValue(undefined);
      mockQueryRunner.rollbackTransaction.mockResolvedValue(undefined);
      mockQueryRunner.release.mockResolvedValue(undefined);
      mockQueryRunner.manager.save.mockResolvedValue(undefined);
      mockQueryRunner.manager.update.mockResolvedValue(undefined);
      mockQueryRunner.manager.delete.mockResolvedValue(undefined);
      mockQueryRunner.manager.findOne.mockResolvedValue(undefined);
    });

    it('deve fazer rollback quando falha ao salvar horários de atendimento', async () => {
      const dtoComHorarios = {
        ...createDto,
        horariosAtendimento: [
          {
            diaSemana: 'SEGUNDA' as any,
            horarioInicio: '08:00',
            horarioFim: '18:00',
          },
        ],
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockRejectedValueOnce(
        new Error('Horário save error'),
      );

      await expect(service.create(dtoComHorarios)).rejects.toThrow(
        'Horário save error',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve fazer rollback quando falha ao vincular contas bancárias', async () => {
      const dtoComContas = {
        ...createDto,
        contas_bancarias: [
          {
            conta_bancaria_id: 'conta-uuid-1',
          },
        ],
      };

      mockContaBancariaRepository.findOne.mockResolvedValue(mockContaBancaria);

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockRejectedValueOnce(
        new Error('Erro ao vincular conta bancária'),
      );

      await expect(service.create(dtoComContas)).rejects.toThrow(
        'Erro ao vincular conta bancária',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve fazer rollback quando falha ao salvar CNAEs secundários', async () => {
      const dtoComCnaes = {
        ...createDto,
        cnaeSecundarios: [
          {
            cnaeId: 'cnae-uuid-1',
          },
        ],
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockRejectedValueOnce(
        new Error('CNAE save error'),
      );

      await expect(service.create(dtoComCnaes)).rejects.toThrow(
        'CNAE save error',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve tratar erro na conexão do query runner', async () => {
      mockQueryRunner.connect.mockRejectedValue(new Error('Connection error'));

      await expect(service.create(createDto)).rejects.toThrow(
        'Connection error',
      );

      // Se a conexão falha antes do try, rollback e release não são chamados
      expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).not.toHaveBeenCalled();
    });

    it('deve tratar erro no início da transação', async () => {
      mockQueryRunner.startTransaction.mockRejectedValue(
        new Error('Transaction start error'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        'Transaction start error',
      );

      // Se startTransaction falha antes do try, rollback e release não são chamados
      expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.release).not.toHaveBeenCalled();
    });

    it('deve criar unidade com cnaePrincipalId definido', async () => {
      const dtoComCnae = {
        ...createDto,
        cnaePrincipalId: 'cnae-principal-uuid',
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValue(mockUnidadeSaude);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);

      const result = await service.create(dtoComCnae);

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockUnidadeSaudeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          cnaePrincipalId: 'cnae-principal-uuid',
        }),
      );
    });

    it('deve criar unidade com arrays vazios de relacionamentos', async () => {
      const dtoComArraysVazios = {
        ...createDto,
        horariosAtendimento: [],
        contas_bancarias: [],
        cnaeSecundarios: [],
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValue(mockUnidadeSaude);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);

      const result = await service.create(dtoComArraysVazios);

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(1); // Apenas a unidade
    });
  });

  describe('findAll - comprehensive scenarios', () => {
    it('deve retornar lista vazia quando não há dados', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });

    it('deve aplicar paginação com valores extremos', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ page: 1, limit: 1 });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 1,
        }),
      );
    });

    it('deve combinar múltiplos filtros', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({
        search: 'clinica',
        incluirInativos: false,
        cidade: 'Brasília',
        estado: 'DF',
      });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: [
            expect.objectContaining({ ativo: true }),
            expect.objectContaining({ ativo: true }),
            expect.objectContaining({ ativo: true }),
            expect.objectContaining({ ativo: true }),
          ],
        }),
      );
    });

    it('deve calcular totalPages corretamente', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([
        [mockUnidadeSaude],
        25,
      ]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.totalPages).toBe(3); // Math.ceil(25/10)
    });

    it('deve incluir inativos quando incluirInativos é true', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ incluirInativos: true });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });

    it('deve normalizar estado para uppercase', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ estado: 'sp' });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { ativo: true, estado: 'SP' },
        }),
      );
    });
  });

  describe('update - comprehensive error scenarios', () => {
    const updateDto: UpdateUnidadeSaudeDto = {
      nomeUnidade: 'Nome Atualizado',
    };

    beforeEach(() => {
      // Reset all mocks to clean state
      jest.clearAllMocks();
      mockQueryRunner.connect.mockResolvedValue(undefined);
      mockQueryRunner.startTransaction.mockResolvedValue(undefined);
      mockQueryRunner.commitTransaction.mockResolvedValue(undefined);
      mockQueryRunner.rollbackTransaction.mockResolvedValue(undefined);
      mockQueryRunner.release.mockResolvedValue(undefined);
      mockQueryRunner.manager.save.mockResolvedValue(undefined);
      mockQueryRunner.manager.update.mockResolvedValue(undefined);
      mockQueryRunner.manager.delete.mockResolvedValue(undefined);
      mockQueryRunner.manager.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);
    });

    it('deve falhar se findOne lançar exceção no início', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Unidade não encontrada'));

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve tratar erro ao deletar horários existentes', async () => {
      const updateDtoComHorarios = {
        horariosAtendimento: [
          {
            diaSemana: 'SEGUNDA' as any,
            horarioInicio: '09:00',
            horarioFim: '17:00',
          },
        ],
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      mockQueryRunner.manager.delete.mockRejectedValue(
        new Error('Delete horários error'),
      );

      await expect(
        service.update('unidade-uuid-1', updateDtoComHorarios),
      ).rejects.toThrow('Delete horários error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve tratar erro ao salvar novos horários', async () => {
      const updateDtoComHorarios = {
        horariosAtendimento: [
          {
            diaSemana: 'SEGUNDA' as any,
            horarioInicio: '09:00',
            horarioFim: '17:00',
          },
        ],
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      mockQueryRunner.manager.delete.mockResolvedValue({});
      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Save horários error'),
      );

      await expect(
        service.update('unidade-uuid-1', updateDtoComHorarios),
      ).rejects.toThrow('Save horários error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve atualizar com dados bancários vazios', async () => {
      const updateDtoComDadosVazios = {
        contas_bancarias: [],
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      mockQueryRunner.manager.delete.mockResolvedValue({});
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);

      const result = await service.update(
        'unidade-uuid-1',
        updateDtoComDadosVazios,
      );

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        ContaBancariaUnidade,
        { unidade_saude_id: 'unidade-uuid-1' },
      );
      expect(mockQueryRunner.manager.save).not.toHaveBeenCalledWith(
        ContaBancaria,
        expect.any(Array),
      );
    });

    it('deve atualizar com horários vazios', async () => {
      const updateDtoComHorariosVazios = {
        horariosAtendimento: [],
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      mockQueryRunner.manager.delete.mockResolvedValue({});
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);

      const result = await service.update(
        'unidade-uuid-1',
        updateDtoComHorariosVazios,
      );

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        HorarioAtendimento,
        { unidadeSaudeId: 'unidade-uuid-1' },
      );
      expect(mockQueryRunner.manager.save).not.toHaveBeenCalledWith(
        HorarioAtendimento,
        expect.any(Array),
      );
    });

    it('deve atualizar com CNAEs vazios', async () => {
      const updateDtoComCnaesVazios = {
        cnaeSecundarios: [],
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      mockQueryRunner.manager.delete.mockResolvedValue({});
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);

      const result = await service.update(
        'unidade-uuid-1',
        updateDtoComCnaesVazios,
      );

      expect(result).toEqual(mockUnidadeSaude);
      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        CnaeSecundario,
        { unidadeSaudeId: 'unidade-uuid-1' },
      );
      expect(mockQueryRunner.manager.save).not.toHaveBeenCalledWith(
        CnaeSecundario,
        expect.any(Array),
      );
    });

    it('deve manter cnaePrincipalId undefined quando não fornecido', async () => {
      const updateDtoSemCnae = {
        nomeUnidade: 'Novo Nome',
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);

      await service.update('unidade-uuid-1', updateDtoSemCnae);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        UnidadeSaude,
        { id: 'unidade-uuid-1' },
        {
          nomeUnidade: 'Novo Nome',
          cnaePrincipalId: undefined,
        },
      );
    });

    it('deve atualizar cnaePrincipalId quando fornecido', async () => {
      const updateDtoComCnae = {
        nomeUnidade: 'Novo Nome',
        cnaePrincipalId: 'cnae-novo-uuid',
      };

      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);

      await service.update('unidade-uuid-1', updateDtoComCnae);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        UnidadeSaude,
        { id: 'unidade-uuid-1' },
        {
          nomeUnidade: 'Novo Nome',
          cnaePrincipalId: 'cnae-novo-uuid',
        },
      );
    });
  });

  describe('remove - additional scenarios', () => {
    it('deve falhar se unidade não for encontrada', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Unidade não encontrada'));

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUnidadeSaudeRepository.update).not.toHaveBeenCalled();
    });

    it('deve falhar se update retornar affected = 0', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUnidadeSaude);
      mockUnidadeSaudeRepository.update.mockResolvedValue({ affected: 0 });

      // O método não verifica affected, então isso não causará erro
      await service.remove('unidade-uuid-1');

      expect(mockUnidadeSaudeRepository.update).toHaveBeenCalledWith(
        'unidade-uuid-1',
        { ativo: false },
      );
    });
  });

  describe('activate/deactivate - error scenarios', () => {
    it('activate deve falhar se unidade não for encontrada', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException('Unidade não encontrada'));

      await expect(service.activate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUnidadeSaudeRepository.update).not.toHaveBeenCalled();
    });

    it('deactivate deve falhar se unidade não for encontrada', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException('Unidade não encontrada'));

      await expect(service.deactivate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUnidadeSaudeRepository.update).not.toHaveBeenCalled();
    });

    it('activate deve retornar unidade atualizada mesmo se update falhar', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);
      mockUnidadeSaudeRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.activate('unidade-uuid-1');

      expect(result).toEqual(mockUnidadeSaude);
    });

    it('deactivate deve retornar unidade atualizada mesmo se update falhar', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockUnidadeSaude)
        .mockResolvedValueOnce(mockUnidadeSaude);
      mockUnidadeSaudeRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.deactivate('unidade-uuid-1');

      expect(result).toEqual(mockUnidadeSaude);
    });
  });

  describe('listActive - comprehensive scenarios', () => {
    it('deve retornar array vazio quando não há unidades ativas', async () => {
      mockUnidadeSaudeRepository.find.mockResolvedValue([]);

      const result = await service.listActive();

      expect(result).toEqual([]);
      expect(mockUnidadeSaudeRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        select: ['id', 'nomeUnidade', 'nomeFantasia', 'cnpj'],
        order: { nomeUnidade: 'ASC' },
      });
    });

    it('deve retornar apenas campos selecionados', async () => {
      const unidadesSimplificadas = [
        {
          id: 'uuid-1',
          nomeUnidade: 'Unidade A',
          nomeFantasia: 'A',
          cnpj: '12345678000199',
        },
      ];

      mockUnidadeSaudeRepository.find.mockResolvedValue(unidadesSimplificadas);

      const result = await service.listActive();

      expect(result).toEqual(unidadesSimplificadas);
      expect(result[0]).not.toHaveProperty('razaoSocial');
      expect(result[0]).not.toHaveProperty('cidade');
    });
  });

  describe('findByCidade - comprehensive scenarios', () => {
    it('deve retornar array vazio quando não há unidades na cidade', async () => {
      mockUnidadeSaudeRepository.find.mockResolvedValue([]);

      const result = await service.findByCidade('Cidade Inexistente');

      expect(result).toEqual([]);
      expect(mockUnidadeSaudeRepository.find).toHaveBeenCalledWith({
        where: {
          cidade: expect.objectContaining({ _type: 'ilike' }),
          ativo: true,
        },
        relations: ['horariosAtendimento'],
        order: { nomeUnidade: 'ASC' },
      });
    });

    it('deve buscar cidade com case insensitive', async () => {
      mockUnidadeSaudeRepository.find.mockResolvedValue([mockUnidadeSaude]);

      await service.findByCidade('brasília');

      expect(mockUnidadeSaudeRepository.find).toHaveBeenCalledWith({
        where: {
          cidade: expect.objectContaining({ _type: 'ilike' }),
          ativo: true,
        },
        relations: ['horariosAtendimento'],
        order: { nomeUnidade: 'ASC' },
      });
    });

    it('deve incluir apenas relação horariosAtendimento', async () => {
      mockUnidadeSaudeRepository.find.mockResolvedValue([mockUnidadeSaude]);

      await service.findByCidade('Brasília');

      const call = mockUnidadeSaudeRepository.find.mock.calls[0][0];
      expect(call.relations).toEqual(['horariosAtendimento']);
      expect(call.relations).not.toContain('contas_bancarias');
      expect(call.relations).not.toContain('cnaeSecundarios');
    });
  });

  describe('validateCnpj - comprehensive edge cases', () => {
    let localService: UnidadeSaudeService;

    beforeEach(() => {
      localService = new UnidadeSaudeService(
        mockUnidadeSaudeRepository as any,
        mockHorarioAtendimentoRepository as any,
        mockCnaeSecundarioRepository as any,
        mockContaBancariaRepository as any,
        mockContaBancariaUnidadeRepository as any,
        mockCnaeRepository as any,
        mockDataSource as any,
      );
    });

    it('deve rejeitar CNPJ vazio', () => {
      const result = localService['validateCnpj']('');
      expect(result).toBe(false);
    });

    it('deve rejeitar CNPJ null/undefined', () => {
      const result1 = localService['validateCnpj'](null as any);
      const result2 = localService['validateCnpj'](undefined as any);
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('deve rejeitar CNPJ com apenas letras', () => {
      const result = localService['validateCnpj']('abcdefghijklmn');
      expect(result).toBe(false);
    });

    it('deve rejeitar CNPJ com 15 dígitos', () => {
      const result = localService['validateCnpj']('123456789012345');
      expect(result).toBe(false);
    });

    it('deve rejeitar CNPJ com 13 dígitos', () => {
      const result = localService['validateCnpj']('1234567890123');
      expect(result).toBe(false);
    });

    it('deve validar CNPJ real válido', () => {
      // CNPJ da Receita Federal (público)
      const result = localService['validateCnpj']('00.394.460/0058-87');
      expect(result).toBe(true);
    });

    it('deve rejeitar CNPJ com primeiro dígito verificador inválido', () => {
      const result = localService['validateCnpj']('00.394.460/0058-97'); // último dígito alterado
      expect(result).toBe(false);
    });

    it('deve rejeitar CNPJ com segundo dígito verificador inválido', () => {
      const result = localService['validateCnpj']('00.394.460/0058-89'); // penúltimo dígito alterado
      expect(result).toBe(false);
    });

    it('deve remover todos os caracteres não numéricos', () => {
      const result = localService['validateCnpj'](
        '00abc.394xyz.460/0058-87!!!',
      );
      expect(result).toBe(true); // Deve validar após remover caracteres
    });

    it('deve rejeitar sequências conhecidas inválidas', () => {
      const invalidCnpjs = [
        '00000000000000',
        '11111111111111',
        '22222222222222',
        '33333333333333',
        '44444444444444',
        '55555555555555',
        '66666666666666',
        '77777777777777',
        '88888888888888',
        '99999999999999',
      ];

      invalidCnpjs.forEach((cnpj) => {
        const result = localService['validateCnpj'](cnpj);
        expect(result).toBe(false);
      });
    });

    it('deve tratar casos onde resto da divisão é exatamente 2', () => {
      // Teste específico para caso onde soma % 11 = 2 (dígito deve ser 0)
      const result = localService['validateCnpj']('11.222.333/0001-81');
      expect(result).toBe(true);
    });

    it('deve tratar casos onde resto da divisão é maior que 2', () => {
      // Teste específico para caso onde soma % 11 > 2 (dígito = 11 - resto)
      const result = localService['validateCnpj']('00.394.460/0058-87');
      expect(result).toBe(true);
    });
  });
});
