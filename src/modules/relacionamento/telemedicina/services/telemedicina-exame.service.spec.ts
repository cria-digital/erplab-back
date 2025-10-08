import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { TelemedicinaExameService } from './telemedicina-exame.service';
import { TelemedicinaExame } from '../entities/telemedicina-exame.entity';
import { CreateTelemedicinaExameDto } from '../dto/create-telemedicina-exame.dto';
import { UpdateTelemedicinaExameDto } from '../dto/update-telemedicina-exame.dto';

describe('TelemedicinaExameService', () => {
  let service: TelemedicinaExameService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockTelemedicinaExameRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    query: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockTelemedicinaExame = {
    id: 'vinculo-uuid-1',
    telemedicina_id: 'telemedicina-uuid-1',
    exame_id: 'exame-uuid-1',
    codigo_telemedicina: 'EX001',
    nome_exame_telemedicina: 'Hemograma Completo',
    categoria_telemedicina: 'Hematologia',
    ativo: true,
    permite_upload_imagem: true,
    requer_especialista: false,
    tempo_laudo_padrao: 24,
    valor_laudo: 50.0,
    observacoes: 'Exame de rotina',
    created_at: new Date(),
    updated_at: new Date(),
    telemedicina: {
      id: 'telemedicina-uuid-1',
      codigo_telemedicina: 'TELE001',
      empresa: {
        id: 'empresa-uuid-1',
        nomeFantasia: 'TeleMed Teste',
      },
    },
    exame: {
      id: 'exame-uuid-1',
      codigo: 'HEM001',
      nome: 'Hemograma',
      categoria: 'Hematologia',
      ativo: true,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemedicinaExameService,
        {
          provide: getRepositoryToken(TelemedicinaExame),
          useValue: mockTelemedicinaExameRepository,
        },
      ],
    }).compile();

    service = module.get<TelemedicinaExameService>(TelemedicinaExameService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTelemedicinaExameDto: CreateTelemedicinaExameDto = {
      telemedicina_id: 'telemedicina-uuid-1',
      exame_id: 'exame-uuid-1',
      codigo_telemedicina: 'EX001',
      nome_exame_telemedicina: 'Hemograma Completo',
      categoria_telemedicina: 'Hematologia',
      ativo: true,
    };

    it('deve criar um vínculo com sucesso', async () => {
      mockTelemedicinaExameRepository.findOne.mockResolvedValue(null);
      mockTelemedicinaExameRepository.create.mockReturnValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.save.mockResolvedValue(
        mockTelemedicinaExame,
      );

      const result = await service.create(createTelemedicinaExameDto);

      expect(result).toEqual(mockTelemedicinaExame);
      expect(mockTelemedicinaExameRepository.findOne).toHaveBeenCalledWith({
        where: {
          telemedicina_id: createTelemedicinaExameDto.telemedicina_id,
          exame_id: createTelemedicinaExameDto.exame_id,
        },
      });
    });

    it('deve retornar erro quando vínculo já existir', async () => {
      mockTelemedicinaExameRepository.findOne.mockResolvedValue(
        mockTelemedicinaExame,
      );

      await expect(service.create(createTelemedicinaExameDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar vínculo com dados opcionais', async () => {
      const createComOpcionais = {
        ...createTelemedicinaExameDto,
        permite_upload_imagem: true,
        requer_especialista: true,
        tempo_laudo_padrao: 48,
        valor_laudo: 75.0,
      };

      mockTelemedicinaExameRepository.findOne.mockResolvedValue(null);
      mockTelemedicinaExameRepository.create.mockReturnValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.save.mockResolvedValue(
        mockTelemedicinaExame,
      );

      const result = await service.create(createComOpcionais);

      expect(result).toEqual(mockTelemedicinaExame);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de vínculos ordenada', async () => {
      const vinculos = [mockTelemedicinaExame];
      mockTelemedicinaExameRepository.find.mockResolvedValue(vinculos);

      const result = await service.findAll();

      expect(result).toEqual(vinculos);
      expect(mockTelemedicinaExameRepository.find).toHaveBeenCalledWith({
        relations: ['telemedicina', 'telemedicina.empresa', 'exame'],
        order: { created_at: 'DESC' },
      });
    });

    it('deve retornar lista vazia quando não há vínculos', async () => {
      mockTelemedicinaExameRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByTelemedicina', () => {
    it('deve retornar vínculos de uma telemedicina', async () => {
      const vinculos = [mockTelemedicinaExame];
      mockQueryBuilder.getMany.mockResolvedValue(vinculos);

      const result = await service.findByTelemedicina('telemedicina-uuid-1');

      expect(result).toEqual(vinculos);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'te.telemedicina_id = :telemedicinaId',
        { telemedicinaId: 'telemedicina-uuid-1' },
      );
    });

    it('deve retornar lista vazia quando telemedicina não tem vínculos', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findByTelemedicina('telemedicina-uuid-2');

      expect(result).toEqual([]);
    });
  });

  describe('findByExame', () => {
    it('deve retornar telemedicinas vinculadas a um exame', async () => {
      const vinculos = [mockTelemedicinaExame];
      mockTelemedicinaExameRepository.find.mockResolvedValue(vinculos);

      const result = await service.findByExame('exame-uuid-1');

      expect(result).toEqual(vinculos);
      expect(mockTelemedicinaExameRepository.find).toHaveBeenCalledWith({
        where: { exame_id: 'exame-uuid-1' },
        relations: ['telemedicina', 'telemedicina.empresa'],
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas vínculos ativos', async () => {
      const vinculosAtivos = [mockTelemedicinaExame];
      mockTelemedicinaExameRepository.find.mockResolvedValue(vinculosAtivos);

      const result = await service.findAtivos();

      expect(result).toEqual(vinculosAtivos);
      expect(mockTelemedicinaExameRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['telemedicina', 'telemedicina.empresa', 'exame'],
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('findSemVinculo', () => {
    it('deve retornar exames sem vínculo para uma telemedicina', async () => {
      const examesSemVinculo = [
        {
          id: 'exame-uuid-2',
          codigo: 'GLI001',
          nome: 'Glicemia',
          categoria: 'Bioquímica',
        },
      ];

      mockTelemedicinaExameRepository.query.mockResolvedValue(examesSemVinculo);

      const result = await service.findSemVinculo('telemedicina-uuid-1');

      expect(result).toEqual(examesSemVinculo);
      expect(mockTelemedicinaExameRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        ['telemedicina-uuid-1'],
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um vínculo por ID', async () => {
      mockTelemedicinaExameRepository.findOne.mockResolvedValue(
        mockTelemedicinaExame,
      );

      const result = await service.findOne('vinculo-uuid-1');

      expect(result).toEqual(mockTelemedicinaExame);
      expect(mockTelemedicinaExameRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'vinculo-uuid-1' },
        relations: ['telemedicina', 'telemedicina.empresa', 'exame'],
      });
    });

    it('deve retornar erro quando vínculo não for encontrado', async () => {
      mockTelemedicinaExameRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateTelemedicinaExameDto: UpdateTelemedicinaExameDto = {
      codigo_telemedicina: 'EX002',
      valor_laudo: 60.0,
    };

    it('deve atualizar vínculo com sucesso', async () => {
      const vinculoAtualizado = {
        ...mockTelemedicinaExame,
        ...updateTelemedicinaExameDto,
      };

      mockTelemedicinaExameRepository.findOne.mockResolvedValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.save.mockResolvedValue(vinculoAtualizado);

      const result = await service.update(
        'vinculo-uuid-1',
        updateTelemedicinaExameDto,
      );

      expect(result).toEqual(vinculoAtualizado);
    });

    it('deve verificar duplicidade ao alterar telemedicina ou exame', async () => {
      const updateComNovoExame = {
        exame_id: 'exame-uuid-2',
      };

      mockTelemedicinaExameRepository.findOne
        .mockResolvedValueOnce(mockTelemedicinaExame) // findOne inicial
        .mockResolvedValueOnce({ ...mockTelemedicinaExame, id: 'outro-id' }); // vínculo já existe

      await expect(
        service.update('vinculo-uuid-1', updateComNovoExame),
      ).rejects.toThrow(ConflictException);
    });

    it('deve permitir atualizar sem mudar o vínculo', async () => {
      const updateSemMudarVinculo = {
        tempo_laudo_padrao: 48,
        observacoes: 'Atualizado',
      };

      const vinculoAtualizado = {
        ...mockTelemedicinaExame,
        ...updateSemMudarVinculo,
      };

      mockTelemedicinaExameRepository.findOne.mockResolvedValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.save.mockResolvedValue(vinculoAtualizado);

      const result = await service.update(
        'vinculo-uuid-1',
        updateSemMudarVinculo,
      );

      expect(result).toEqual(vinculoAtualizado);
    });
  });

  describe('remove', () => {
    it('deve remover vínculo com sucesso', async () => {
      mockTelemedicinaExameRepository.findOne.mockResolvedValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.remove.mockResolvedValue(
        mockTelemedicinaExame,
      );

      await service.remove('vinculo-uuid-1');

      expect(mockTelemedicinaExameRepository.remove).toHaveBeenCalledWith(
        mockTelemedicinaExame,
      );
    });

    it('deve retornar erro quando vínculo não for encontrado', async () => {
      mockTelemedicinaExameRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const vinculoInativo = { ...mockTelemedicinaExame, ativo: false };

      mockTelemedicinaExameRepository.findOne.mockResolvedValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.save.mockResolvedValue(vinculoInativo);

      const result = await service.toggleStatus('vinculo-uuid-1');

      expect(result.ativo).toBe(false);
    });

    it('deve alternar status de inativo para ativo', async () => {
      const vinculoInativo = { ...mockTelemedicinaExame, ativo: false };
      const vinculoAtivo = { ...mockTelemedicinaExame, ativo: true };

      mockTelemedicinaExameRepository.findOne.mockResolvedValue(vinculoInativo);
      mockTelemedicinaExameRepository.save.mockResolvedValue(vinculoAtivo);

      const result = await service.toggleStatus('vinculo-uuid-1');

      expect(result.ativo).toBe(true);
    });
  });

  describe('vincularAutomaticamente', () => {
    it('deve vincular exames automaticamente', async () => {
      const examesSemVinculo = [
        {
          id: 'exame-uuid-2',
          codigo: 'GLI001',
          nome: 'Glicemia',
          categoria: 'Bioquímica',
        },
        {
          id: 'exame-uuid-3',
          codigo: 'COL001',
          nome: 'Colesterol',
          categoria: 'Bioquímica',
        },
      ];

      mockTelemedicinaExameRepository.query.mockResolvedValue(examesSemVinculo);
      mockTelemedicinaExameRepository.findOne.mockResolvedValue(null);
      mockTelemedicinaExameRepository.create.mockReturnValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.save.mockResolvedValue(
        mockTelemedicinaExame,
      );

      const result = await service.vincularAutomaticamente(
        'telemedicina-uuid-1',
      );

      expect(result).toEqual({
        vinculados: 2,
        total: 2,
      });
    });

    it('deve continuar mesmo com erro em alguns vínculos', async () => {
      const examesSemVinculo = [
        { id: 'exame-uuid-2', codigo: 'GLI001', nome: 'Glicemia' },
        { id: 'exame-uuid-3', codigo: 'COL001', nome: 'Colesterol' },
      ];

      mockTelemedicinaExameRepository.query.mockResolvedValue(examesSemVinculo);
      mockTelemedicinaExameRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockTelemedicinaExame); // segundo já existe
      mockTelemedicinaExameRepository.create.mockReturnValue(
        mockTelemedicinaExame,
      );
      mockTelemedicinaExameRepository.save
        .mockResolvedValueOnce(mockTelemedicinaExame)
        .mockRejectedValueOnce(new ConflictException());

      const result = await service.vincularAutomaticamente(
        'telemedicina-uuid-1',
      );

      expect(result.vinculados).toBe(1);
      expect(result.total).toBe(2);
    });
  });

  describe('search', () => {
    it('deve buscar vínculos por termo', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockTelemedicinaExame]);

      const result = await service.search('telemedicina-uuid-1', 'Hemograma');

      expect(result).toEqual([mockTelemedicinaExame]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'te.telemedicina_id = :telemedicinaId',
        { telemedicinaId: 'telemedicina-uuid-1' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('deve retornar lista vazia para busca sem resultados', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('telemedicina-uuid-1', 'inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas gerais', async () => {
      mockTelemedicinaExameRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // ativos
        .mockResolvedValueOnce(30) // com upload imagem
        .mockResolvedValueOnce(20); // requer especialista

      const result = await service.getEstatisticas();

      expect(result).toEqual({
        total: 100,
        ativos: 80,
        inativos: 20,
        comUploadImagem: 30,
        requerEspecialista: 20,
      });
    });

    it('deve retornar estatísticas de uma telemedicina específica', async () => {
      mockTelemedicinaExameRepository.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(45) // ativos
        .mockResolvedValueOnce(15) // com upload imagem
        .mockResolvedValueOnce(10); // requer especialista

      const result = await service.getEstatisticas('telemedicina-uuid-1');

      expect(result).toEqual({
        total: 50,
        ativos: 45,
        inativos: 5,
        comUploadImagem: 15,
        requerEspecialista: 10,
      });

      expect(mockTelemedicinaExameRepository.count).toHaveBeenCalledWith({
        where: { telemedicina_id: 'telemedicina-uuid-1' },
      });
    });
  });
});
