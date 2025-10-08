import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BancoSeedService } from './banco-seed.service';
import {
  Banco,
  StatusBanco,
} from '../../modules/financeiro/core/entities/banco.entity';

describe('BancoSeedService', () => {
  let service: BancoSeedService;
  let mockRepository: Partial<Repository<Banco>>;

  beforeEach(async () => {
    mockRepository = {
      count: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BancoSeedService,
        {
          provide: getRepositoryToken(Banco),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BancoSeedService>(BancoSeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('deve pular seed quando já existem bancos', async () => {
      // Simula que já existem bancos
      mockRepository.count = jest.fn().mockResolvedValue(10);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Bancos já foram importados (10 registros). Pulando seed...',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('deve criar bancos quando não existem registros', async () => {
      // Simula que não existem bancos
      mockRepository.count = jest.fn().mockResolvedValue(0);

      const mockBanco = {
        id: 'banco-uuid-1',
        codigo: '001',
        nome: 'Banco do Brasil S.A.',
        codigoInterno: 'BB',
        status: StatusBanco.ATIVO,
      };

      mockRepository.create = jest.fn().mockReturnValue(mockBanco);
      mockRepository.save = jest
        .fn()
        .mockImplementation((entities) =>
          Promise.resolve(Array.isArray(entities) ? entities : [entities]),
        );

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Iniciando importação de Bancos...',
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('bancos importados com sucesso'),
      );

      consoleSpy.mockRestore();
    });

    it('deve tratar erros durante o seed', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockRepository.create = jest.fn().mockImplementation(() => {
        throw new Error('Erro de teste');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.seed()).rejects.toThrow('Erro de teste');

      expect(consoleSpy).toHaveBeenCalledWith(
        '❌ Erro ao importar bancos:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('deve importar todos os bancos predefinidos', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);

      const mockBanco = {
        id: 'banco-uuid-1',
        codigo: '001',
        nome: 'Banco do Brasil S.A.',
        codigoInterno: 'BB',
        status: StatusBanco.ATIVO,
      };

      mockRepository.create = jest.fn().mockReturnValue(mockBanco);
      mockRepository.save = jest.fn().mockResolvedValue([mockBanco]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      // Deve criar bancos para cada entrada na lista
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();

      // Verifica se o log de sucesso foi chamado
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('bancos importados com sucesso'),
      );

      consoleSpy.mockRestore();
    });
  });
});
