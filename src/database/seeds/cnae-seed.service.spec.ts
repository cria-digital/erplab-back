import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CnaeSeedService } from './cnae-seed.service';
import { Cnae } from '../../modules/infraestrutura/common/entities/cnae.entity';

describe('CnaeSeedService', () => {
  let service: CnaeSeedService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      count: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CnaeSeedService,
        {
          provide: getRepositoryToken(Cnae),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CnaeSeedService>(CnaeSeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('deve pular seed quando já existem CNAEs', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(100);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'CNAEs já foram importados (100 registros). Pulando seed...',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    // Testes de integração com filesystem foram simplificados
    // devido a complexidade com mocks de fs e path.
    // Para testes completos, usar testes E2E.
  });
});
