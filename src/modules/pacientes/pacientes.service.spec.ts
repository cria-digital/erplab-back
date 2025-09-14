import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { PacientesService } from './pacientes.service';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto, UpdatePacienteDto } from './dto';

describe('PacientesService', () => {
  let service: PacientesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPaciente: Partial<Paciente> = {
    id: 1,
    codigo_interno: 'PAC123456',
    nome: 'João da Silva',
    sexo: 'M',
    data_nascimento: new Date('1990-01-01'),
    nome_mae: 'Maria Silva',
    rg: '123456789',
    cpf: '12345678901',
    estado_civil: 'solteiro',
    email: 'joao@email.com',
    contatos: '11999999999',
    profissao: 'Engenheiro',
    cep: '01310100',
    numero: '100',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    empresa_id: 1,
    status: 'ativo',
    criado_em: new Date(),
    atualizado_em: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: getRepositoryToken(Paciente),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPacienteDto: CreatePacienteDto = {
      nome: 'João da Silva',
      sexo: 'M',
      data_nascimento: '1990-01-01',
      nome_mae: 'Maria Silva',
      rg: '123456789',
      cpf: '12345678901',
      estado_civil: 'solteiro',
      email: 'joao@email.com',
      contatos: '11999999999',
      profissao: 'Engenheiro',
      cep: '01310100',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      empresa_id: 1,
    };

    it('deve criar um paciente com sucesso', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      const result = await service.create(createPacienteDto, 1);

      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          cpf: createPacienteDto.cpf,
          empresa_id: createPacienteDto.empresa_id,
        },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createPacienteDto,
          codigo_interno: expect.stringMatching(/^PAC\d+$/),
          data_nascimento: new Date(createPacienteDto.data_nascimento),
          criado_por: 1,
          atualizado_por: 1,
        }),
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve gerar código interno automaticamente quando não fornecido', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      await service.create(createPacienteDto, 1);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          codigo_interno: expect.stringMatching(/^PAC\d+$/),
        }),
      );
    });

    it('deve usar código interno fornecido quando presente', async () => {
      const dtoComCodigo = {
        ...createPacienteDto,
        codigo_interno: 'PAC999999',
      };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      await service.create(dtoComCodigo, 1);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          codigo_interno: 'PAC999999',
        }),
      );
    });

    it('deve lançar ConflictException quando CPF já existir na empresa', async () => {
      mockRepository.findOne.mockResolvedValue(mockPaciente);

      await expect(service.create(createPacienteDto, 1)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          cpf: createPacienteDto.cpf,
          empresa_id: createPacienteDto.empresa_id,
        },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve converter string de data para Date object', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      await service.create(createPacienteDto, 1);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data_nascimento: new Date('1990-01-01'),
        }),
      );
    });

    it('deve converter validade de convênio para Date quando fornecida', async () => {
      const dtoComConvenio = {
        ...createPacienteDto,
        convenio_id: 1,
        validade: '2025-12-31',
      };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      await service.create(dtoComConvenio, 1);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          validade: new Date('2025-12-31'),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de pacientes com paginação', async () => {
      const pacientes = [mockPaciente];
      mockRepository.find.mockResolvedValue(pacientes);
      mockRepository.count.mockResolvedValue(1);

      const result = await service.findAll(1, { page: 1, limit: 10 });

      expect(result).toEqual({
        data: pacientes,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { empresa_id: 1 },
        order: { criado_em: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { empresa_id: 1 },
      });
    });

    it('deve filtrar por nome quando fornecido', async () => {
      const pacientes = [mockPaciente];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([pacientes, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(1, {
        page: 1,
        limit: 10,
        nome: 'João',
      });

      expect(result.data).toEqual(pacientes);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'paciente.nome ILIKE :nome',
        { nome: '%João%' },
      );
    });

    it('deve filtrar por CPF quando fornecido', async () => {
      const pacientes = [mockPaciente];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([pacientes, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll(1, { page: 1, limit: 10, cpf: '12345678901' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'paciente.cpf = :cpf',
        { cpf: '12345678901' },
      );
    });

    it('deve filtrar por status quando fornecido', async () => {
      const pacientes = [mockPaciente];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([pacientes, 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll(1, { page: 1, limit: 10, status: 'ativo' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'paciente.status = :status',
        { status: 'ativo' },
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um paciente por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, empresa_id: 1 },
      });
    });

    it('deve lançar NotFoundException quando paciente não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, empresa_id: 1 },
      });
    });
  });

  describe('findByCpf', () => {
    it('deve retornar um paciente por CPF e empresa', async () => {
      mockRepository.findOne.mockResolvedValue(mockPaciente);

      const result = await service.findByCpf('12345678901', 1);

      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901', empresa_id: 1 },
      });
    });

    it('deve retornar null quando paciente não for encontrado por CPF', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCpf('99999999999', 1);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updatePacienteDto: UpdatePacienteDto = {
      nome: 'João Santos Silva',
      email: 'joao.santos@email.com',
    };

    it('deve atualizar um paciente com sucesso', async () => {
      const pacienteAtualizado = { ...mockPaciente, ...updatePacienteDto };
      mockRepository.findOne.mockResolvedValue(mockPaciente);
      mockRepository.save.mockResolvedValue(pacienteAtualizado);

      const result = await service.update(1, 1, updatePacienteDto, 2);

      expect(result).toEqual(pacienteAtualizado);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, empresa_id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockPaciente,
          ...updatePacienteDto,
          atualizado_por: 2,
        }),
      );
    });

    it('deve lançar NotFoundException quando paciente não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, 1, updatePacienteDto, 2),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve converter string de data para Date ao atualizar', async () => {
      const updateDto = { data_nascimento: '1985-05-15' };
      mockRepository.findOne.mockResolvedValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      await service.update(1, 1, updateDto, 2);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          data_nascimento: new Date('1985-05-15'),
        }),
      );
    });
  });

  describe('remove', () => {
    it('deve remover um paciente (soft delete - inativar)', async () => {
      const pacienteInativo = { ...mockPaciente, status: 'inativo' };
      mockRepository.findOne.mockResolvedValue(mockPaciente);
      mockRepository.save.mockResolvedValue(pacienteInativo);

      await service.remove(1, 1, 2);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, empresa_id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockPaciente,
          status: 'inativo',
          atualizado_por: 2,
        }),
      );
    });

    it('deve lançar NotFoundException quando paciente não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999, 1, 2)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
