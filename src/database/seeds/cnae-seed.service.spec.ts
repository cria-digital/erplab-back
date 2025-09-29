import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CnaeSeedService } from './cnae-seed.service';
import { Cnae } from '../../modules/common/entities/cnae.entity';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('CnaeSeedService', () => {
  let service: CnaeSeedService;
  let mockRepository: any;
  let mockFs: jest.Mocked<typeof fs>;
  let mockPath: jest.Mocked<typeof path>;

  beforeEach(async () => {
    mockRepository = {
      count: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    mockFs = fs as jest.Mocked<typeof fs>;
    mockPath = path as jest.Mocked<typeof path>;

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
      expect(mockPath.join).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('deve criar CNAEs de saúde quando arquivo não existe', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockPath.join = jest.fn().mockReturnValue('/fake/path/cnaes.json');
      mockFs.existsSync = jest.fn().mockReturnValue(false);

      const mockCnae = {
        id: 'cnae-uuid-1',
        codigo: '8610-1/01',
        descricao: 'Atividades de atendimento hospitalar',
        secao: 'Q',
        ativo: true,
      };

      mockRepository.create = jest.fn().mockReturnValue(mockCnae);
      mockRepository.save = jest.fn().mockResolvedValue(mockCnae);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockPath.join).toHaveBeenCalledWith(
        process.cwd(),
        'src',
        'database',
        'seeds',
        'data',
        'cnaes.json',
      );
      expect(mockFs.existsSync).toHaveBeenCalledWith('/fake/path/cnaes.json');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Arquivo de CNAEs não encontrado. Baixe de https://servicodados.ibge.gov.br/api/v2/cnae/classes',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Criando alguns CNAEs de exemplo para área de saúde...',
      );
      expect(mockRepository.create).toHaveBeenCalledTimes(12);
      expect(mockRepository.save).toHaveBeenCalledTimes(12);
      expect(consoleSpy).toHaveBeenCalledWith(
        '12 CNAEs de saúde importados com sucesso!',
      );

      consoleSpy.mockRestore();
    });

    it('deve importar CNAEs do arquivo JSON quando existe', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockPath.join = jest.fn().mockReturnValue('/fake/path/cnaes.json');
      mockFs.existsSync = jest.fn().mockReturnValue(true);

      const mockJsonData = [
        {
          id: '0111-3/01',
          descricao: 'Cultivo de cereais',
          grupo: {
            id: '011',
            descricao: 'Produção de lavouras temporárias',
            divisao: {
              id: '01',
              descricao: 'Agricultura, pecuária e serviços relacionados',
              secao: {
                id: 'A',
                descricao:
                  'AGRICULTURA, PECUÁRIA, PRODUÇÃO FLORESTAL, PESCA E AQUICULTURA',
              },
            },
          },
        },
        {
          id: '0121-8/99',
          descricao: 'Cultivo de outras frutas de lavoura permanente',
          grupo: {
            id: '012',
            descricao: 'Horticultura e floricultura',
            divisao: {
              id: '01',
              descricao: 'Agricultura, pecuária e serviços relacionados',
              secao: {
                id: 'A',
                descricao:
                  'AGRICULTURA, PECUÁRIA, PRODUÇÃO FLORESTAL, PESCA E AQUICULTURA',
              },
            },
          },
          observacoes: ['Observação 1', 'Observação 2'],
        },
      ];

      mockFs.readFileSync = jest
        .fn()
        .mockReturnValue(JSON.stringify(mockJsonData));

      const mockCnae = {
        id: 'cnae-uuid-1',
        codigo: '0111-3/01',
        descricao: 'Cultivo de cereais',
        secao: 'A',
        ativo: true,
      };

      mockRepository.create = jest.fn().mockReturnValue(mockCnae);
      mockRepository.save = jest.fn().mockResolvedValue([mockCnae]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        '/fake/path/cnaes.json',
        'utf8',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Iniciando importação de CNAEs...',
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        '2 CNAEs importados com sucesso!',
      );

      consoleSpy.mockRestore();
    });

    it('deve processar CNAEs em chunks quando arquivo é grande', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockPath.join = jest.fn().mockReturnValue('/fake/path/cnaes.json');
      mockFs.existsSync = jest.fn().mockReturnValue(true);

      const largeMockData = Array.from({ length: 1200 }, (_, i) => ({
        id: `${i.toString().padStart(4, '0')}-1/01`,
        descricao: `Descrição ${i}`,
        grupo: {
          id: '011',
          descricao: 'Grupo teste',
          divisao: {
            id: '01',
            descricao: 'Divisão teste',
            secao: {
              id: 'A',
              descricao: 'Seção teste',
            },
          },
        },
      }));

      mockFs.readFileSync = jest
        .fn()
        .mockReturnValue(JSON.stringify(largeMockData));

      const mockCnae = {
        id: 'cnae-uuid-1',
        codigo: '0000-1/01',
        descricao: 'Descrição 0',
        secao: 'A',
        ativo: true,
      };

      mockRepository.create = jest.fn().mockReturnValue(mockCnae);
      mockRepository.save = jest.fn().mockResolvedValue([mockCnae]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockRepository.save).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenCalledWith(
        '1200 CNAEs importados com sucesso!',
      );

      consoleSpy.mockRestore();
    });

    it('deve tratar dados com estrutura incompleta no JSON', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockPath.join = jest.fn().mockReturnValue('/fake/path/cnaes.json');
      mockFs.existsSync = jest.fn().mockReturnValue(true);

      const incompleteMockData = [
        {
          id: '0111-3/01',
          descricao: 'Cultivo de cereais',
        },
      ];

      mockFs.readFileSync = jest
        .fn()
        .mockReturnValue(JSON.stringify(incompleteMockData));

      const mockCnae = {
        id: 'cnae-uuid-1',
        codigo: '0111-3/01',
        descricao: 'Cultivo de cereais',
        secao: 'A',
        ativo: true,
      };

      mockRepository.create = jest.fn().mockReturnValue(mockCnae);
      mockRepository.save = jest.fn().mockResolvedValue([mockCnae]);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          codigo: '0111-3/01',
          descricao: 'Cultivo de cereais',
          secao: 'A',
          descricaoSecao: 'NÃO ESPECIFICADO',
          divisao: '01',
          descricaoDivisao: 'NÃO ESPECIFICADO',
          grupo: '011',
          descricaoGrupo: 'NÃO ESPECIFICADO',
          classe: '0111',
          descricaoClasse: 'Cultivo de cereais',
          subclasse: '0111-3/01',
          descricaoSubclasse: 'Cultivo de cereais',
          ativo: true,
          observacoes: null,
        }),
      );

      consoleSpy.mockRestore();
    });

    it('deve tratar erro ao ler arquivo JSON', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockPath.join = jest.fn().mockReturnValue('/fake/path/cnaes.json');
      mockFs.existsSync = jest.fn().mockReturnValue(true);
      mockFs.readFileSync = jest.fn().mockImplementation(() => {
        throw new Error('Erro ao ler arquivo');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.seed()).rejects.toThrow('Erro ao ler arquivo');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao importar CNAEs:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('deve tratar erro durante criação de CNAEs de saúde', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockPath.join = jest.fn().mockReturnValue('/fake/path/cnaes.json');
      mockFs.existsSync = jest.fn().mockReturnValue(false);
      mockRepository.create = jest.fn().mockImplementation(() => {
        throw new Error('Erro ao criar CNAE');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.seed()).rejects.toThrow('Erro ao criar CNAE');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao importar CNAEs:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('deve tratar JSON inválido', async () => {
      mockRepository.count = jest.fn().mockResolvedValue(0);
      mockPath.join = jest.fn().mockReturnValue('/fake/path/cnaes.json');
      mockFs.existsSync = jest.fn().mockReturnValue(true);
      mockFs.readFileSync = jest.fn().mockReturnValue('json inválido');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.seed()).rejects.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao importar CNAEs:',
        expect.any(SyntaxError),
      );

      consoleSpy.mockRestore();
    });
  });
});
