import { Test, TestingModule } from '@nestjs/testing';
import { MetodosController } from './metodos.controller';
import { MetodosService } from './metodos.service';
import { StatusMetodo } from './entities/metodo.entity';

describe('MetodosController', () => {
  let controller: MetodosController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleStatus: jest.fn(),
    validar: jest.fn(),
    findByStatus: jest.fn(),
    search: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodosController],
      providers: [
        {
          provide: MetodosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MetodosController>(MetodosController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo método', async () => {
      const createDto = {
        nome: 'ELISA',
        codigoInterno: 'MET001',
        descricao: 'Método ELISA',
      };

      const expectedResult = { id: 'uuid', ...createDto };
      mockService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de métodos', async () => {
      const expectedResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };

      mockService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(
        '1',
        '10',
        'search',
        StatusMetodo.ATIVO,
      );

      expect(result).toEqual(expectedResult);
      expect(mockService.findAll).toHaveBeenCalledWith(
        1,
        10,
        'search',
        StatusMetodo.ATIVO,
      );
    });

    it('deve usar valores padrão quando parâmetros não fornecidos', async () => {
      mockService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });

      await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalledWith(
        1,
        10,
        undefined,
        undefined,
      );
    });
  });

  describe('getStatistics', () => {
    it('deve retornar estatísticas dos métodos', async () => {
      const expectedStats = {
        total: 10,
        ativos: 5,
        inativos: 2,
        emValidacao: 3,
      };

      mockService.getStatistics.mockResolvedValue(expectedStats);

      const result = await controller.getStatistics();

      expect(result).toEqual(expectedStats);
      expect(mockService.getStatistics).toHaveBeenCalled();
    });
  });

  describe('findByStatus', () => {
    it('deve retornar métodos por status', async () => {
      const metodos = [
        { id: '1', status: StatusMetodo.ATIVO },
        { id: '2', status: StatusMetodo.ATIVO },
      ];

      mockService.findByStatus.mockResolvedValue(metodos);

      const result = await controller.findByStatus(StatusMetodo.ATIVO);

      expect(result).toEqual(metodos);
      expect(mockService.findByStatus).toHaveBeenCalledWith(StatusMetodo.ATIVO);
    });
  });

  describe('search', () => {
    it('deve buscar métodos por termo', async () => {
      const metodos = [{ id: '1', nome: 'ELISA' }];
      mockService.search.mockResolvedValue(metodos);

      const result = await controller.search('ELISA');

      expect(result).toEqual(metodos);
      expect(mockService.search).toHaveBeenCalledWith('ELISA');
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar método por código interno', async () => {
      const metodo = {
        id: 'uuid',
        codigoInterno: 'MET001',
        nome: 'ELISA',
      };

      mockService.findByCodigo.mockResolvedValue(metodo);

      const result = await controller.findByCodigo('MET001');

      expect(result).toEqual(metodo);
      expect(mockService.findByCodigo).toHaveBeenCalledWith('MET001');
    });
  });

  describe('findOne', () => {
    it('deve retornar método por ID', async () => {
      const metodo = { id: 'uuid', nome: 'ELISA' };
      mockService.findOne.mockResolvedValue(metodo);

      const result = await controller.findOne('uuid');

      expect(result).toEqual(metodo);
      expect(mockService.findOne).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('deve atualizar um método', async () => {
      const updateDto = { nome: 'ELISA Atualizado' };
      const metodo = { id: 'uuid', ...updateDto };

      mockService.update.mockResolvedValue(metodo);

      const result = await controller.update('uuid', updateDto);

      expect(result).toEqual(metodo);
      expect(mockService.update).toHaveBeenCalledWith('uuid', updateDto);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status do método', async () => {
      const metodo = {
        id: 'uuid',
        status: StatusMetodo.INATIVO,
      };

      mockService.toggleStatus.mockResolvedValue(metodo);

      const result = await controller.toggleStatus('uuid');

      expect(result).toEqual(metodo);
      expect(mockService.toggleStatus).toHaveBeenCalledWith('uuid');
    });
  });

  describe('validar', () => {
    it('deve validar método em validação', async () => {
      const metodo = {
        id: 'uuid',
        status: StatusMetodo.ATIVO,
      };

      mockService.validar.mockResolvedValue(metodo);

      const result = await controller.validar('uuid');

      expect(result).toEqual(metodo);
      expect(mockService.validar).toHaveBeenCalledWith('uuid');
    });
  });

  describe('remove', () => {
    it('deve remover um método', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('uuid');

      expect(mockService.remove).toHaveBeenCalledWith('uuid');
    });
  });
});
