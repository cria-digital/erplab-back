import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { PacientesController } from './pacientes.controller';
import { PacientesService, PaginatedResult } from './pacientes.service';
import { CreatePacienteDto, UpdatePacienteDto } from './dto';
import { Paciente } from './entities/paciente.entity';

describe('PacientesController', () => {
  let controller: PacientesController;
  let service: PacientesService;

  const mockPacientesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCpf: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    block: jest.fn(),
    searchByName: jest.fn(),
    getStats: jest.fn(),
  };

  const mockPaciente: Paciente = {
    id: 1,
    codigo_interno: 'PAC123456',
    nome: 'João da Silva',
    nome_social: null,
    usar_nome_social: 'nao_se_aplica',
    sexo: 'M',
    data_nascimento: new Date('1990-01-01'),
    nome_mae: 'Maria Silva',
    prontuario: null,
    rg: '123456789',
    cpf: '12345678901',
    estado_civil: 'solteiro',
    email: 'joao@email.com',
    contatos: '11999999999',
    whatsapp: null,
    profissao: 'Engenheiro',
    observacao: null,
    convenio_id: null,
    plano: null,
    validade: null,
    matricula: null,
    nome_titular: null,
    cartao_sus: null,
    cep: '01310100',
    rua: 'Rua das Flores',
    numero: '100',
    bairro: 'Centro',
    complemento: null,
    cidade: 'São Paulo',
    estado: 'SP',
    foto_url: null,
    status: 'ativo',
    empresa_id: 1,
    criado_em: new Date(),
    atualizado_em: new Date(),
    criado_por: 1,
    atualizado_por: 1,
    // Métodos da entity
    getCpfFormatado: () => '123.456.789-01',
    getIdade: () => 33,
    getNomeCompleto: () => 'João da Silva',
    getEnderecoCompleto: () => 'Rua das Flores, 100, Centro',
    getCepFormatado: () => '01310-100',
    getTelefoneFormatado: () => '(11) 99999-9999',
  } as any;

  const mockRequest = {
    user: { id: 1, empresa_id: 1 },
    headers: { 'x-empresa-id': '1' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacientesController],
      providers: [
        {
          provide: PacientesService,
          useValue: mockPacientesService,
        },
      ],
    }).compile();

    controller = module.get<PacientesController>(PacientesController);
    service = module.get<PacientesService>(PacientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      mockPacientesService.create.mockResolvedValue(mockPaciente);

      const result = await controller.create(createPacienteDto, mockRequest as any);

      expect(result).toEqual({
        message: 'Paciente criado com sucesso',
        data: mockPaciente,
      });
      expect(service.create).toHaveBeenCalledWith(createPacienteDto, 1);
    });

    it('deve retornar erro quando CPF já existir', async () => {
      const conflictError = new ConflictException('CPF já cadastrado');
      mockPacientesService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createPacienteDto, mockRequest as any))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de pacientes', async () => {
      const paginatedResult: PaginatedResult<Paciente> = {
        data: [mockPaciente],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockPacientesService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(
        mockRequest as any,
        { page: 1, limit: 10 }
      );

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith(1, { page: 1, limit: 10 });
    });

    it('deve passar filtros para o service', async () => {
      const filters = { page: 2, limit: 5, nome: 'João', status: 'ativo' };
      const paginatedResult: PaginatedResult<Paciente> = {
        data: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0,
      };

      mockPacientesService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll(mockRequest as any, filters);

      expect(service.findAll).toHaveBeenCalledWith(1, filters);
    });
  });

  describe('findOne', () => {
    it('deve retornar um paciente por ID', async () => {
      mockPacientesService.findOne.mockResolvedValue(mockPaciente);

      const result = await controller.findOne('1', mockRequest as any);

      expect(result).toEqual(mockPaciente);
      expect(service.findOne).toHaveBeenCalledWith(1, 1);
    });

    it('deve retornar erro quando paciente não for encontrado', async () => {
      const notFoundError = new NotFoundException('Paciente não encontrado');
      mockPacientesService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('999', mockRequest as any))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCpf', () => {
    it('deve retornar um paciente por CPF', async () => {
      mockPacientesService.findByCpf.mockResolvedValue(mockPaciente);

      const result = await controller.findByCpf('12345678901', mockRequest as any);

      expect(result).toEqual(mockPaciente);
      expect(service.findByCpf).toHaveBeenCalledWith('12345678901', 1);
    });

    it('deve retornar null quando paciente não for encontrado por CPF', async () => {
      mockPacientesService.findByCpf.mockResolvedValue(null);

      const result = await controller.findByCpf('99999999999', mockRequest as any);

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
      mockPacientesService.update.mockResolvedValue(pacienteAtualizado);

      const result = await controller.update('1', updatePacienteDto, mockRequest as any);

      expect(result).toEqual({
        message: 'Paciente atualizado com sucesso',
        data: pacienteAtualizado,
      });
      expect(service.update).toHaveBeenCalledWith(1, 1, updatePacienteDto, 1);
    });

    it('deve retornar erro quando paciente não for encontrado para atualização', async () => {
      const notFoundError = new NotFoundException('Paciente não encontrado');
      mockPacientesService.update.mockRejectedValue(notFoundError);

      await expect(controller.update('999', updatePacienteDto, mockRequest as any))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um paciente com sucesso', async () => {
      mockPacientesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1', mockRequest as any);

      expect(result).toEqual({
        message: 'Paciente removido com sucesso',
      });
      expect(service.remove).toHaveBeenCalledWith(1, 1, 1);
    });

    it('deve retornar erro quando paciente não for encontrado para remoção', async () => {
      const notFoundError = new NotFoundException('Paciente não encontrado');
      mockPacientesService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('999', mockRequest as any))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('activate', () => {
    it('deve ativar um paciente com sucesso', async () => {
      const pacienteAtivado = { ...mockPaciente, status: 'ativo' };
      mockPacientesService.activate.mockResolvedValue(pacienteAtivado);

      const result = await controller.activate('1', mockRequest as any);

      expect(result).toEqual({
        message: 'Paciente ativado com sucesso',
        data: pacienteAtivado,
      });
      expect(service.activate).toHaveBeenCalledWith(1, 1, 1);
    });
  });

  describe('block', () => {
    it('deve bloquear um paciente com sucesso', async () => {
      const pacienteBloqueado = { ...mockPaciente, status: 'bloqueado' };
      mockPacientesService.block.mockResolvedValue(pacienteBloqueado);

      const result = await controller.block('1', mockRequest as any);

      expect(result).toEqual({
        message: 'Paciente bloqueado com sucesso',
        data: pacienteBloqueado,
      });
      expect(service.block).toHaveBeenCalledWith(1, 1, 1);
    });
  });

  describe('search', () => {
    it('deve buscar pacientes por nome', async () => {
      const pacientes = [mockPaciente];
      mockPacientesService.searchByName.mockResolvedValue(pacientes);

      const result = await controller.search('João', mockRequest as any, { limit: 5 });

      expect(result).toEqual(pacientes);
      expect(service.searchByName).toHaveBeenCalledWith('João', 1, 5);
    });

    it('deve usar limite padrão quando não fornecido', async () => {
      mockPacientesService.searchByName.mockResolvedValue([]);

      await controller.search('João', mockRequest as any, {});

      expect(service.searchByName).toHaveBeenCalledWith('João', 1, 10);
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas dos pacientes', async () => {
      const stats = {
        total: 100,
        status: {
          ativo: 80,
          inativo: 15,
          bloqueado: 5,
        },
        convenio: {
          com_convenio: 60,
          sem_convenio: 40,
        },
      };

      mockPacientesService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats(mockRequest as any);

      expect(result).toEqual(stats);
      expect(service.getStats).toHaveBeenCalledWith(1);
    });
  });
});