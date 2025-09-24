import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto, UpdatePacienteDto } from './dto';

describe('PacientesService', () => {
  let service: PacientesService;
  let mockQueryBuilder;

  const mockPacienteRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockPaciente = {
    id: 'paciente-uuid-1',
    codigo_interno: 'PAC123456',
    nome: 'João da Silva',
    cpf: '12345678901',
    email: 'joao@email.com',
    status: 'ativo',
    empresa_id: 'empresa-uuid-1',
    criado_por: 'user-uuid-1',
    data_nascimento: new Date('1990-01-01'),
    criado_em: new Date(),
    atualizado_em: new Date(),
  };

  beforeEach(async () => {
    // Reset mockQueryBuilder before each test
    mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: getRepositoryToken(Paciente),
          useValue: mockPacienteRepository,
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um paciente com sucesso', async () => {
      const createDto: CreatePacienteDto = {
        nome: 'João da Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        data_nascimento: '1990-01-01',
        empresa_id: 'empresa-uuid-1',
        sexo: 'M',
        nome_mae: 'Maria Silva',
        rg: '123456789',
        estado_civil: 'solteiro',
        contatos: '11999999999',
        cep: '01310100',
        numero: '100',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        profissao: 'Engenheiro',
      };

      mockPacienteRepository.findOne.mockResolvedValue(null); // Nenhum paciente existente
      mockPacienteRepository.create.mockReturnValue(mockPaciente);
      mockPacienteRepository.save.mockResolvedValue(mockPaciente);

      const result = await service.create(createDto, 'user-uuid-1');

      expect(result).toEqual(mockPaciente);
      expect(mockPacienteRepository.save).toHaveBeenCalledWith(mockPaciente);
    });

    it('deve lançar erro ao criar paciente com CPF duplicado', async () => {
      const createDto: CreatePacienteDto = {
        nome: 'João da Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        data_nascimento: '1990-01-01',
        empresa_id: 'empresa-uuid-1',
        sexo: 'M',
        nome_mae: 'Maria Silva',
        rg: '123456789',
        estado_civil: 'solteiro',
        contatos: '11999999999',
        cep: '01310100',
        numero: '100',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        profissao: 'Engenheiro',
      };

      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);

      await expect(service.create(createDto, 'user-uuid-1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve gerar código interno automaticamente se não fornecido', async () => {
      const createDto: CreatePacienteDto = {
        nome: 'João da Silva',
        cpf: '98765432100',
        email: 'joao2@email.com',
        data_nascimento: '1990-01-01',
        empresa_id: 'empresa-uuid-1',
        sexo: 'M',
        nome_mae: 'Maria Silva',
        rg: '123456789',
        estado_civil: 'solteiro',
        contatos: '11999999999',
        cep: '01310100',
        numero: '100',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        profissao: 'Engenheiro',
      };

      mockPacienteRepository.findOne.mockResolvedValue(null);
      mockPacienteRepository.create.mockImplementation((dto) => ({
        ...dto,
        id: 'new-id',
      }));
      mockPacienteRepository.save.mockImplementation((paciente) => paciente);

      await service.create(createDto, 'user-uuid-1');

      expect(mockPacienteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          codigo_interno: expect.stringContaining('PAC'),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de pacientes sem filtros', async () => {
      const pacientes = [mockPaciente];
      mockPacienteRepository.find.mockResolvedValue(pacientes);
      mockPacienteRepository.count.mockResolvedValue(1);

      const result = await service.findAll('empresa-uuid-1', {
        page: 1,
        limit: 10,
      });

      expect(result).toEqual({
        data: pacientes,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockPacienteRepository.find).toHaveBeenCalledWith({
        where: { empresa_id: 'empresa-uuid-1' },
        order: { criado_em: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve aplicar filtros corretamente', async () => {
      const pacientes = [mockPaciente];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([pacientes, 1]);

      const result = await service.findAll('empresa-uuid-1', {
        page: 1,
        limit: 10,
        nome: 'João',
        status: 'ativo',
      });

      expect(result).toEqual({
        data: pacientes,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2); // nome e status
    });

    it('deve calcular paginação corretamente', async () => {
      const pacientes = Array(25).fill(mockPaciente);
      mockPacienteRepository.find.mockResolvedValue(pacientes.slice(10, 20));
      mockPacienteRepository.count.mockResolvedValue(25);

      const result = await service.findAll('empresa-uuid-1', {
        page: 2,
        limit: 10,
      });

      expect(result).toEqual({
        data: pacientes.slice(10, 20),
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });
      expect(mockPacienteRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('deve retornar array vazio quando não houver pacientes', async () => {
      mockPacienteRepository.find.mockResolvedValue([]);
      mockPacienteRepository.count.mockResolvedValue(0);

      const result = await service.findAll('empresa-uuid-1', {
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('findOne', () => {
    it('deve retornar um paciente pelo ID', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findOne('paciente-uuid-1', 'empresa-uuid-1');

      expect(result).toEqual(mockPaciente);
      expect(mockPacienteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'paciente-uuid-1', empresa_id: 'empresa-uuid-1' },
      });
    });

    it('deve lançar NotFoundException quando paciente não existir', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent', 'empresa-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCpf', () => {
    it('deve retornar um paciente pelo CPF', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findByCpf('12345678901', 'empresa-uuid-1');

      expect(result).toEqual(mockPaciente);
      expect(mockPacienteRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901', empresa_id: 'empresa-uuid-1' },
      });
    });

    it('deve retornar null se CPF não existir', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCpf('00000000000', 'empresa-uuid-1');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar um paciente com sucesso', async () => {
      const updateDto: UpdatePacienteDto = {
        nome: 'João Silva Atualizado',
        email: 'joao.novo@email.com',
      };

      const pacienteAtualizado = {
        ...mockPaciente,
        ...updateDto,
      };

      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPacienteRepository.save.mockResolvedValue(pacienteAtualizado);

      const result = await service.update(
        'paciente-uuid-1',
        'empresa-uuid-1',
        updateDto,
        'user-uuid-1',
      );

      expect(result).toEqual(pacienteAtualizado);
      expect(mockPacienteRepository.save).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException ao atualizar paciente inexistente', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(
          'non-existent',
          'empresa-uuid-1',
          { nome: 'New' },
          'user-uuid-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve converter datas corretamente na atualização', async () => {
      const updateDto: UpdatePacienteDto = {
        data_nascimento: '1991-02-02',
        validade: '2025-12-31',
      };

      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPacienteRepository.save.mockImplementation((paciente) => paciente);

      await service.update(
        'paciente-uuid-1',
        'empresa-uuid-1',
        updateDto,
        'user-uuid-1',
      );

      expect(mockPacienteRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          data_nascimento: expect.any(Date),
          validade: expect.any(Date),
        }),
      );
    });
  });

  describe('remove', () => {
    it('deve desativar um paciente (soft delete)', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPacienteRepository.save.mockResolvedValue({
        ...mockPaciente,
        status: 'inativo',
      });

      await service.remove('paciente-uuid-1', 'empresa-uuid-1', 'user-uuid-1');

      expect(mockPacienteRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'inativo',
          atualizado_por: 'user-uuid-1',
        }),
      );
    });

    it('deve lançar NotFoundException ao remover paciente inexistente', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove('non-existent', 'empresa-uuid-1', 'user-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('activate', () => {
    it('deve ativar um paciente inativo', async () => {
      const pacienteInativo = { ...mockPaciente, status: 'inativo' };
      mockPacienteRepository.findOne.mockResolvedValue(pacienteInativo);
      mockPacienteRepository.save.mockResolvedValue({
        ...pacienteInativo,
        status: 'ativo',
      });

      const result = await service.activate(
        'paciente-uuid-1',
        'empresa-uuid-1',
        'user-uuid-1',
      );

      expect(result.status).toBe('ativo');
      expect(mockPacienteRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ativo',
          atualizado_por: 'user-uuid-1',
        }),
      );
    });
  });

  describe('block', () => {
    it('deve bloquear um paciente', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPacienteRepository.save.mockResolvedValue({
        ...mockPaciente,
        status: 'bloqueado',
      });

      const result = await service.block(
        'paciente-uuid-1',
        'empresa-uuid-1',
        'user-uuid-1',
      );

      expect(result.status).toBe('bloqueado');
      expect(mockPacienteRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'bloqueado',
          atualizado_por: 'user-uuid-1',
        }),
      );
    });
  });

  describe('searchByName', () => {
    it('deve buscar pacientes por nome', async () => {
      const pacientes = [mockPaciente, { ...mockPaciente, id: '2' }];
      mockQueryBuilder.getMany.mockResolvedValue(pacientes);

      const result = await service.searchByName('João', 'empresa-uuid-1', 5);

      expect(result).toEqual(pacientes);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'paciente.nome ILIKE :nome',
        { nome: '%João%' },
      );
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });

    it('deve usar limite padrão de 10', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.searchByName('Test', 'empresa-uuid-1');

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
    });

    it('deve buscar apenas pacientes ativos', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.searchByName('João', 'empresa-uuid-1');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'paciente.status = :status',
        { status: 'ativo' },
      );
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas dos pacientes', async () => {
      mockPacienteRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // ativos
        .mockResolvedValueOnce(15) // inativos
        .mockResolvedValueOnce(5); // bloqueados

      mockQueryBuilder.getCount
        .mockResolvedValueOnce(30) // com convênio
        .mockResolvedValueOnce(70); // sem convênio

      const result = await service.getStats('empresa-uuid-1');

      expect(result).toEqual({
        total: 100,
        status: {
          ativo: 80,
          inativo: 15,
          bloqueado: 5,
        },
        convenio: {
          com_convenio: 30,
          sem_convenio: 70,
        },
      });
      expect(mockPacienteRepository.count).toHaveBeenCalledTimes(4);
      expect(mockPacienteRepository.createQueryBuilder).toHaveBeenCalledTimes(
        2,
      );
    });

    it('deve retornar estatísticas com convênio', async () => {
      mockPacienteRepository.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(25) // ativos
        .mockResolvedValueOnce(20) // inativos
        .mockResolvedValueOnce(5); // bloqueados

      mockQueryBuilder.getCount
        .mockResolvedValueOnce(30) // com convênio
        .mockResolvedValueOnce(20); // sem convênio

      const result = await service.getStats('empresa-uuid-1');

      expect(result.status.ativo).toBe(25);
      expect(result.status.inativo).toBe(20);
      expect(result.status.bloqueado).toBe(5);
      expect(result.convenio.com_convenio).toBe(30);
      expect(result.convenio.sem_convenio).toBe(20);
    });

    it('deve retornar zeros quando não houver pacientes', async () => {
      mockPacienteRepository.count
        .mockResolvedValueOnce(0) // total
        .mockResolvedValueOnce(0) // ativos
        .mockResolvedValueOnce(0) // inativos
        .mockResolvedValueOnce(0); // bloqueados

      mockQueryBuilder.getCount
        .mockResolvedValueOnce(0) // com convênio
        .mockResolvedValueOnce(0); // sem convênio

      const result = await service.getStats('empresa-uuid-1');

      expect(result.total).toBe(0);
      expect(result.status.ativo).toBe(0);
      expect(result.convenio.com_convenio).toBe(0);
      expect(result.convenio.sem_convenio).toBe(0);
    });
  });
});
