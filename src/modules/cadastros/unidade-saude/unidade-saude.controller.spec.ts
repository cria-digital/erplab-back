import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UnidadeSaudeController } from './unidade-saude.controller';
import { UnidadeSaudeService } from './unidade-saude.service';
import { CreateUnidadeSaudeDto } from './dto/create-unidade-saude.dto';
import { UpdateUnidadeSaudeDto } from './dto/update-unidade-saude.dto';
import { UnidadeSaude } from './entities/unidade-saude.entity';

describe('UnidadeSaudeController', () => {
  let controller: UnidadeSaudeController;
  let service: UnidadeSaudeService;

  const mockUnidadeSaudeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCnpj: jest.fn(),
    findByCidade: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    listActive: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnidadeSaudeController],
      providers: [
        {
          provide: UnidadeSaudeService,
          useValue: mockUnidadeSaudeService,
        },
      ],
    }).compile();

    controller = module.get<UnidadeSaudeController>(UnidadeSaudeController);
    service = module.get<UnidadeSaudeService>(UnidadeSaudeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    };

    it('deve criar uma unidade de saúde com sucesso', async () => {
      mockUnidadeSaudeService.create.mockResolvedValue(mockUnidadeSaude);

      const result = await controller.create(createUnidadeSaudeDto);

      expect(result).toEqual(mockUnidadeSaude);
      expect(service.create).toHaveBeenCalledWith(createUnidadeSaudeDto);
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      const conflictError = new ConflictException('CNPJ já cadastrado');
      mockUnidadeSaudeService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createUnidadeSaudeDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de unidades', async () => {
      const paginatedResult = {
        data: [mockUnidadeSaude],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUnidadeSaudeService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll();

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        ativo: undefined,
        cidade: undefined,
        estado: undefined,
      });
    });

    it('deve passar parâmetros de filtro para o service', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 2,
        limit: 20,
        totalPages: 0,
      };

      mockUnidadeSaudeService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll(2, 20, 'Saúde', true, 'Brasília', 'DF');

      expect(service.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        search: 'Saúde',
        ativo: true,
        cidade: 'Brasília',
        estado: 'DF',
      });
    });

    it('deve usar valores padrão quando parâmetros não fornecidos', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockUnidadeSaudeService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        ativo: undefined,
        cidade: undefined,
        estado: undefined,
      });
    });

    it('deve converter strings para números corretamente', async () => {
      const paginatedResult = {
        data: [],
        total: 0,
        page: 3,
        limit: 15,
        totalPages: 0,
      };

      mockUnidadeSaudeService.findAll.mockResolvedValue(paginatedResult);

      await controller.findAll('3' as any, '15' as any);

      expect(service.findAll).toHaveBeenCalledWith({
        page: 3,
        limit: 15,
        search: undefined,
        ativo: undefined,
        cidade: undefined,
        estado: undefined,
      });
    });
  });

  describe('listActive', () => {
    it('deve retornar lista de unidades ativas', async () => {
      const activeUnidades = [
        {
          id: 'unidade-uuid-1',
          nomeUnidade: 'Clínica A',
          nomeFantasia: 'A',
          cnpj: '12345678000199',
        },
        {
          id: 'unidade-uuid-2',
          nomeUnidade: 'Clínica B',
          nomeFantasia: 'B',
          cnpj: '98765432000111',
        },
      ];

      mockUnidadeSaudeService.listActive.mockResolvedValue(activeUnidades);

      const result = await controller.listActive();

      expect(result).toEqual(activeUnidades);
      expect(service.listActive).toHaveBeenCalled();
    });
  });

  describe('findByCidade', () => {
    it('deve retornar unidades por cidade', async () => {
      const unidadesBrasilia = [mockUnidadeSaude];
      mockUnidadeSaudeService.findByCidade.mockResolvedValue(unidadesBrasilia);

      const result = await controller.findByCidade('Brasília');

      expect(result).toEqual(unidadesBrasilia);
      expect(service.findByCidade).toHaveBeenCalledWith('Brasília');
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar unidade por CNPJ', async () => {
      mockUnidadeSaudeService.findByCnpj.mockResolvedValue(mockUnidadeSaude);

      const result = await controller.findByCnpj('12345678000199');

      expect(result).toEqual(mockUnidadeSaude);
      expect(service.findByCnpj).toHaveBeenCalledWith('12345678000199');
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      const notFoundError = new NotFoundException('Unidade não encontrada');
      mockUnidadeSaudeService.findByCnpj.mockRejectedValue(notFoundError);

      await expect(controller.findByCnpj('00000000000000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar uma unidade por ID', async () => {
      mockUnidadeSaudeService.findOne.mockResolvedValue(mockUnidadeSaude);

      const result = await controller.findOne('unidade-uuid-1');

      expect(result).toEqual(mockUnidadeSaude);
      expect(service.findOne).toHaveBeenCalledWith('unidade-uuid-1');
    });

    it('deve retornar erro quando unidade não for encontrada', async () => {
      const notFoundError = new NotFoundException('Unidade não encontrada');
      mockUnidadeSaudeService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateUnidadeSaudeDto: UpdateUnidadeSaudeDto = {
      nomeUnidade: 'Clínica Saúde Total Atualizada',
    };

    it('deve atualizar uma unidade com sucesso', async () => {
      const unidadeAtualizada = {
        ...mockUnidadeSaude,
        ...updateUnidadeSaudeDto,
      };
      mockUnidadeSaudeService.update.mockResolvedValue(unidadeAtualizada);

      const result = await controller.update(
        'unidade-uuid-1',
        updateUnidadeSaudeDto,
      );

      expect(result).toEqual(unidadeAtualizada);
      expect(service.update).toHaveBeenCalledWith(
        'unidade-uuid-1',
        updateUnidadeSaudeDto,
      );
    });

    it('deve retornar erro quando unidade não for encontrada', async () => {
      const notFoundError = new NotFoundException('Unidade não encontrada');
      mockUnidadeSaudeService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateUnidadeSaudeDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve retornar erro quando novo CNPJ já existir', async () => {
      const conflictError = new ConflictException('CNPJ já existe');
      mockUnidadeSaudeService.update.mockRejectedValue(conflictError);

      await expect(
        controller.update('unidade-uuid-1', { cnpj: '98765432000111' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve remover uma unidade com sucesso', async () => {
      mockUnidadeSaudeService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('unidade-uuid-1');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('unidade-uuid-1');
    });

    it('deve retornar erro quando unidade não for encontrada', async () => {
      const notFoundError = new NotFoundException('Unidade não encontrada');
      mockUnidadeSaudeService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('activate', () => {
    it('deve ativar uma unidade com sucesso', async () => {
      const unidadeAtiva = { ...mockUnidadeSaude, ativo: true };
      mockUnidadeSaudeService.activate.mockResolvedValue(unidadeAtiva);

      const result = await controller.activate('unidade-uuid-1');

      expect(result).toEqual(unidadeAtiva);
      expect(service.activate).toHaveBeenCalledWith('unidade-uuid-1');
    });

    it('deve retornar erro quando unidade não for encontrada', async () => {
      const notFoundError = new NotFoundException('Unidade não encontrada');
      mockUnidadeSaudeService.activate.mockRejectedValue(notFoundError);

      await expect(controller.activate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deactivate', () => {
    it('deve desativar uma unidade com sucesso', async () => {
      const unidadeInativa = { ...mockUnidadeSaude, ativo: false };
      mockUnidadeSaudeService.deactivate.mockResolvedValue(unidadeInativa);

      const result = await controller.deactivate('unidade-uuid-1');

      expect(result).toEqual(unidadeInativa);
      expect(service.deactivate).toHaveBeenCalledWith('unidade-uuid-1');
    });

    it('deve retornar erro quando unidade não for encontrada', async () => {
      const notFoundError = new NotFoundException('Unidade não encontrada');
      mockUnidadeSaudeService.deactivate.mockRejectedValue(notFoundError);

      await expect(controller.deactivate('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
