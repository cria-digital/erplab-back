import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { TiposExameController } from './tipos-exame.controller';
import { TiposExameService } from './tipos-exame.service';
import { CreateTipoExameDto } from './dto/create-tipo-exame.dto';
import { UpdateTipoExameDto } from './dto/update-tipo-exame.dto';
import { TipoExame } from './entities/tipo-exame.entity';

describe('TiposExameController', () => {
  let controller: TiposExameController;
  let service: TiposExameService;

  const mockTiposExameService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAtivos: jest.fn(),
    findComAgendamento: jest.fn(),
    findComAutorizacao: jest.fn(),
    findDomiciliares: jest.fn(),
  };

  const mockTipoExame = {
    id: 'tipo-uuid-1',
    codigo: 'TIPO001',
    nome: 'Laboratorial',
    descricao: 'Exames laboratoriais',
    ordem: 1,
    requer_agendamento: false,
    requer_autorizacao: false,
    permite_domiciliar: true,
    cor: '#FF0000',
    icone: 'flask',
    configuracoes: {},
    status: 'ativo',
    criado_em: new Date(),
    atualizado_em: new Date(),
    exames: [],
  } as TipoExame;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposExameController],
      providers: [
        {
          provide: TiposExameService,
          useValue: mockTiposExameService,
        },
      ],
    }).compile();

    controller = module.get<TiposExameController>(TiposExameController);
    service = module.get<TiposExameService>(TiposExameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTipoExameDto: CreateTipoExameDto = {
      codigo: 'TIPO001',
      nome: 'Laboratorial',
      descricao: 'Exames laboratoriais',
      ordem: 1,
      cor: '#FF0000',
    };

    it('deve criar um tipo de exame com sucesso', async () => {
      mockTiposExameService.create.mockResolvedValue(mockTipoExame);

      const result = await controller.create(createTipoExameDto);

      expect(result).toEqual({
        success: true,
        message: 'Tipo de exame criado com sucesso',
        data: mockTipoExame,
      });
      expect(service.create).toHaveBeenCalledWith(createTipoExameDto);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já cadastrado');
      mockTiposExameService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createTipoExameDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de tipos de exame', async () => {
      const paginatedResult = {
        data: [mockTipoExame],
        total: 1,
        page: 1,
        lastPage: 1,
      };

      mockTiposExameService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll('1', '10');

      expect(result).toEqual({
        success: true,
        message: 'Tipos de exame listados com sucesso',
        data: paginatedResult,
      });
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('deve passar filtros para o service', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 2,
        lastPage: 0,
      };

      mockTiposExameService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll('2', '5', 'ativo');

      expect(service.findAll).toHaveBeenCalledWith(2, 5, 'ativo');
    });

    it('deve usar valores padrão quando não fornecidos', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
      };

      mockTiposExameService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar tipos de exame ativos', async () => {
      const tiposAtivos = [mockTipoExame];
      mockTiposExameService.findAtivos.mockResolvedValue(tiposAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual({
        success: true,
        message: 'Tipos de exame ativos listados com sucesso',
        data: tiposAtivos,
      });
      expect(service.findAtivos).toHaveBeenCalled();
    });
  });

  describe('findComAgendamento', () => {
    it('deve retornar tipos que requerem agendamento', async () => {
      const tipos = [{ ...mockTipoExame, requer_agendamento: true }];
      mockTiposExameService.findComAgendamento.mockResolvedValue(tipos);

      const result = await controller.findComAgendamento();

      expect(result).toEqual({
        success: true,
        message: 'Tipos com agendamento listados com sucesso',
        data: tipos,
      });
      expect(service.findComAgendamento).toHaveBeenCalled();
    });
  });

  describe('findComAutorizacao', () => {
    it('deve retornar tipos que requerem autorização', async () => {
      const tipos = [{ ...mockTipoExame, requer_autorizacao: true }];
      mockTiposExameService.findComAutorizacao.mockResolvedValue(tipos);

      const result = await controller.findComAutorizacao();

      expect(result).toEqual({
        success: true,
        message: 'Tipos com autorização listados com sucesso',
        data: tipos,
      });
      expect(service.findComAutorizacao).toHaveBeenCalled();
    });
  });

  describe('findDomiciliares', () => {
    it('deve retornar tipos que permitem coleta domiciliar', async () => {
      const tipos = [{ ...mockTipoExame, permite_domiciliar: true }];
      mockTiposExameService.findDomiciliares.mockResolvedValue(tipos);

      const result = await controller.findDomiciliares();

      expect(result).toEqual({
        success: true,
        message: 'Tipos domiciliares listados com sucesso',
        data: tipos,
      });
      expect(service.findDomiciliares).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um tipo de exame por ID', async () => {
      mockTiposExameService.findOne.mockResolvedValue(mockTipoExame);

      const result = await controller.findOne('tipo-uuid-1');

      expect(result).toEqual({
        success: true,
        message: 'Tipo de exame encontrado',
        data: mockTipoExame,
      });
      expect(service.findOne).toHaveBeenCalledWith('tipo-uuid-1');
    });

    it('deve retornar erro quando tipo não for encontrado', async () => {
      const notFoundError = new NotFoundException('Tipo não encontrado');
      mockTiposExameService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um tipo de exame por código', async () => {
      mockTiposExameService.findByCodigo.mockResolvedValue(mockTipoExame);

      const result = await controller.findByCodigo('TIPO001');

      expect(result).toEqual({
        success: true,
        message: 'Tipo de exame encontrado',
        data: mockTipoExame,
      });
      expect(service.findByCodigo).toHaveBeenCalledWith('TIPO001');
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      const notFoundError = new NotFoundException('Código não encontrado');
      mockTiposExameService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateTipoExameDto: UpdateTipoExameDto = {
      nome: 'Laboratorial Atualizado',
      descricao: 'Nova descrição',
    };

    it('deve atualizar um tipo de exame com sucesso', async () => {
      const tipoAtualizado = { ...mockTipoExame, ...updateTipoExameDto };
      mockTiposExameService.update.mockResolvedValue(tipoAtualizado);

      const result = await controller.update('tipo-uuid-1', updateTipoExameDto);

      expect(result).toEqual({
        success: true,
        message: 'Tipo de exame atualizado com sucesso',
        data: tipoAtualizado,
      });
      expect(service.update).toHaveBeenCalledWith(
        'tipo-uuid-1',
        updateTipoExameDto,
      );
    });

    it('deve retornar erro quando tipo não for encontrado', async () => {
      const notFoundError = new NotFoundException('Tipo não encontrado');
      mockTiposExameService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateTipoExameDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve retornar erro quando código já existir', async () => {
      const conflictError = new ConflictException('Código já existe');
      mockTiposExameService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('tipo-uuid-1', { codigo: 'TIPO002' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve desativar um tipo de exame com sucesso', async () => {
      mockTiposExameService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('tipo-uuid-1');

      expect(result).toEqual({
        success: true,
        message: 'Tipo de exame desativado com sucesso',
      });
      expect(service.remove).toHaveBeenCalledWith('tipo-uuid-1');
    });

    it('deve retornar erro quando tipo não for encontrado', async () => {
      const notFoundError = new NotFoundException('Tipo não encontrado');
      mockTiposExameService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve retornar erro quando houver exames vinculados', async () => {
      const conflictError = new ConflictException('Exames vinculados');
      mockTiposExameService.remove.mockRejectedValue(conflictError);

      await expect(controller.remove('tipo-uuid-1')).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
