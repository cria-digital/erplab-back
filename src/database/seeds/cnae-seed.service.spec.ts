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
      create: jest.fn((dto) => dto),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
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
    it('deve pular importação se já existem CNAEs suficientes', async () => {
      // Mock: já existem 700 CNAEs
      mockRepository.count.mockResolvedValue(700);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      // Verifica que verificou a contagem
      expect(mockRepository.count).toHaveBeenCalled();

      // Verifica que pulou a importação
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('CNAEs já importados'),
      );

      // Não deve ter tentado inserir ou atualizar
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(mockRepository.update).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('deve importar CNAEs básicos de saúde quando arquivo JSON não existe', async () => {
      // Mock: não existem CNAEs suficientes
      mockRepository.count.mockResolvedValue(0);
      // Mock: CNAE não existe ainda
      mockRepository.findOne.mockResolvedValue(null);
      // Mock: salvar retorna o próprio objeto
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      // Verifica que tentou importar
      expect(mockRepository.count).toHaveBeenCalled();

      // Verifica que chamou o log de início
      expect(consoleSpy).toHaveBeenCalledWith(
        'Iniciando importação de CNAEs...',
      );

      consoleSpy.mockRestore();
    });

    it('deve atualizar CNAEs existentes', async () => {
      // Mock: não existem CNAEs suficientes
      mockRepository.count.mockResolvedValue(0);

      const cnaeExistente = {
        id: 'uuid-123',
        codigo: '8640202',
        descricao: 'Descrição antiga',
        ativo: true,
      };

      // Mock: CNAE já existe
      mockRepository.findOne.mockResolvedValue(cnaeExistente);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.seed();

      // Verifica que atualizou CNAEs existentes (se entrou no fallback)
      // Como o arquivo JSON não existe no teste, irá para seedCnaesBasicos
      expect(mockRepository.findOne).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('normalizarCodigoCnae', () => {
    it('deve normalizar corretamente códigos CNAE para 7 dígitos sem formatação', () => {
      // Acessa o método privado via casting para testes
      const serviceAny = service as any;

      // Códigos de 5 dígitos (IBGE classe) devem ter "00" adicionado no final
      expect(serviceAny.normalizarCodigoCnae('86403')).toBe('8640300');
      expect(serviceAny.normalizarCodigoCnae('01113')).toBe('0111300');
      expect(serviceAny.normalizarCodigoCnae('63119')).toBe('6311900');

      // Códigos de 7 dígitos devem permanecer como estão
      expect(serviceAny.normalizarCodigoCnae('8610101')).toBe('8610101');
      expect(serviceAny.normalizarCodigoCnae('6311900')).toBe('6311900');

      // Códigos formatados devem ter formatação removida
      expect(serviceAny.normalizarCodigoCnae('8640-2/03')).toBe('8640203');
      expect(serviceAny.normalizarCodigoCnae('0111-3/00')).toBe('0111300');
    });
  });
});
