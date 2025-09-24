import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UnidadeSaudeService } from './unidade-saude.service';
import { UnidadeSaude } from './entities/unidade-saude.entity';
import { HorarioAtendimento } from './entities/horario-atendimento.entity';
import { DadoBancario } from './entities/dado-bancario.entity';
import { CnaeSecundario } from './entities/cnae-secundario.entity';
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
    dadosBancarios: [],
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

  const mockDadoBancario = {
    id: 'banco-uuid-1',
    unidadeSaudeId: 'unidade-uuid-1',
    banco: 'Banco do Brasil',
    codigoBanco: '001',
    agencia: '1234',
    digitoAgencia: '5',
    contaCorrente: '567890',
    digitoConta: '1',
    tipoConta: 'CORRENTE',
    principal: true,
    ativo: true,
    observacoes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    unidadeSaude: null,
  } as DadoBancario;

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

  const mockDadoBancarioRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCnaeSecundarioRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
          provide: getRepositoryToken(DadoBancario),
          useValue: mockDadoBancarioRepository,
        },
        {
          provide: getRepositoryToken(CnaeSecundario),
          useValue: mockCnaeSecundarioRepository,
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
      dadosBancarios: [
        {
          banco: 'Banco do Brasil',
          agencia: '1234',
          contaCorrente: '567890',
          principal: true,
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
      mockDadoBancarioRepository.create.mockReturnValue(mockDadoBancario);

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

    it('deve definir primeiro dado bancário como principal quando nenhum for especificado', async () => {
      const dtoSemPrincipal = {
        ...createUnidadeSaudeDto,
        dadosBancarios: [
          {
            banco: 'Banco do Brasil',
            agencia: '1234',
            contaCorrente: '567890',
            principal: false,
          },
        ],
      };

      mockUnidadeSaudeRepository.findOne.mockResolvedValue(null);
      mockUnidadeSaudeRepository.create.mockReturnValue(mockUnidadeSaude);
      mockQueryRunner.manager.save.mockResolvedValue(mockUnidadeSaude);

      await service.create(dtoSemPrincipal);

      expect(dtoSemPrincipal.dadosBancarios[0].principal).toBe(true);
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
        where: {},
        relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
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
          { nomeUnidade: expect.objectContaining({ _type: 'ilike' }) },
          { nomeFantasia: expect.objectContaining({ _type: 'ilike' }) },
          { cnpj: expect.objectContaining({ _type: 'ilike' }) },
          { razaoSocial: expect.objectContaining({ _type: 'ilike' }) },
        ],
        relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
        order: { nomeUnidade: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve aplicar filtro por status ativo', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ ativo: true });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
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
          cidade: expect.objectContaining({ _type: 'ilike' }),
          estado: 'DF',
        },
        relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
        order: { nomeUnidade: 'ASC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve calcular paginação corretamente', async () => {
      mockUnidadeSaudeRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ page: 3, limit: 20 });

      expect(mockUnidadeSaudeRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
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
        relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
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
        relations: ['horariosAtendimento', 'dadosBancarios', 'cnaeSecundarios'],
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

    it('deve atualizar dados bancários', async () => {
      const updateDto = {
        dadosBancarios: [
          {
            banco: 'Bradesco',
            agencia: '5678',
            contaCorrente: '123456',
            principal: true,
          },
        ],
      };

      mockDadoBancarioRepository.create.mockReturnValue(mockDadoBancario);

      await service.update('unidade-uuid-1', updateDto);

      expect(mockQueryRunner.manager.delete).toHaveBeenCalledWith(
        DadoBancario,
        { unidadeSaudeId: 'unidade-uuid-1' },
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        DadoBancario,
        expect.any(Array),
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
});
