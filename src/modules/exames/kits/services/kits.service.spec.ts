import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { KitsService } from './kits.service';
import { Kit, StatusKitEnum, TipoKitEnum } from '../entities/kit.entity';
import { KitExame } from '../entities/kit-exame.entity';
import { KitUnidade } from '../entities/kit-unidade.entity';
import { KitConvenio } from '../entities/kit-convenio.entity';
import { Exame } from '../../exames/entities/exame.entity';
import { UnidadeSaude } from '../../../cadastros/unidade-saude/entities/unidade-saude.entity';
import { Convenio } from '../../../relacionamento/convenios/entities/convenio.entity';
import { CreateKitDto } from '../dto/create-kit.dto';
import { UpdateKitDto } from '../dto/update-kit.dto';

describe('KitsService', () => {
  let service: KitsService;
  let kitRepository: Repository<Kit>;
  let kitExameRepository: Repository<KitExame>;
  let kitUnidadeRepository: Repository<KitUnidade>;
  let kitConvenioRepository: Repository<KitConvenio>;
  let exameRepository: Repository<Exame>;
  let unidadeRepository: Repository<UnidadeSaude>;
  let convenioRepository: Repository<Convenio>;
  let queryRunner: QueryRunner;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KitsService,
        {
          provide: getRepositoryToken(Kit),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(KitExame),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(KitUnidade),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(KitConvenio),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(Exame),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(UnidadeSaude),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(Convenio),
          useValue: { ...mockRepository },
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<KitsService>(KitsService);
    kitRepository = module.get<Repository<Kit>>(getRepositoryToken(Kit));
    kitExameRepository = module.get<Repository<KitExame>>(
      getRepositoryToken(KitExame),
    );
    kitUnidadeRepository = module.get<Repository<KitUnidade>>(
      getRepositoryToken(KitUnidade),
    );
    kitConvenioRepository = module.get<Repository<KitConvenio>>(
      getRepositoryToken(KitConvenio),
    );
    exameRepository = module.get<Repository<Exame>>(getRepositoryToken(Exame));
    unidadeRepository = module.get<Repository<UnidadeSaude>>(
      getRepositoryToken(UnidadeSaude),
    );
    convenioRepository = module.get<Repository<Convenio>>(
      getRepositoryToken(Convenio),
    );
    queryRunner = mockQueryRunner as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createKitDto: CreateKitDto = {
      codigoInterno: 'KIT001',
      nomeKit: 'Kit Check-up Básico',
      descricao: 'Kit básico para check-up',
      tipoKit: TipoKitEnum.CHECK_UP,
      statusKit: StatusKitEnum.ATIVO,
      empresaId: 'empresa-uuid',
      prazoPadraoEntrega: 3,
      valorTotal: 350.0,
      precoKit: 400.0,
      observacoes: 'Kit especial',
      exames: [
        {
          exameId: 'exame-uuid',
          quantidade: 1,
          ordemInsercao: 1,
          observacoes: 'Jejum 12h',
        },
      ],
      unidades: [
        {
          unidadeId: 'unidade-uuid',
          disponivel: true,
          observacoes: 'Disponível',
        },
      ],
      convenios: [
        {
          convenioId: 'convenio-uuid',
          valorConvenio: 300.0,
          disponivel: true,
          requerAutorizacao: false,
          observacoes: 'Aceito',
        },
      ],
    };

    const mockKit = {
      id: 'kit-uuid',
      ...createKitDto,
      dataCriacao: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockExame = {
      id: 'exame-uuid',
      codigo_tuss: '40301010',
      nome: 'Hemograma Completo',
      prazo_entrega_dias: 1,
    };

    const mockUnidade = {
      id: 'unidade-uuid',
      nome: 'Unidade Central',
    };

    const mockConvenio = {
      id: 'convenio-uuid',
      codigo_convenio: 'CONV001',
    };

    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockKit as Kit);
    });

    it('deve criar um kit com sucesso', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockReturnValue(mockKit);
      queryRunner.manager.save = jest.fn().mockResolvedValue(mockKit);

      exameRepository.findOne = jest.fn().mockResolvedValue(mockExame);
      unidadeRepository.findOne = jest.fn().mockResolvedValue(mockUnidade);
      convenioRepository.findOne = jest.fn().mockResolvedValue(mockConvenio);

      kitExameRepository.create = jest.fn().mockReturnValue({
        kitId: mockKit.id,
        exameId: mockExame.id,
        codigoTuss: mockExame.codigo_tuss,
        nomeExame: mockExame.nome,
        prazoEntrega: mockExame.prazo_entrega_dias,
        quantidade: 1,
        ordemInsercao: 1,
        observacoes: 'Jejum 12h',
      });

      kitUnidadeRepository.create = jest.fn().mockReturnValue({
        kitId: mockKit.id,
        unidadeId: mockUnidade.id,
        disponivel: true,
        observacoes: 'Disponível',
      });

      kitConvenioRepository.create = jest.fn().mockReturnValue({
        kitId: mockKit.id,
        convenioId: mockConvenio.id,
        valorConvenio: 300.0,
        disponivel: true,
        requerAutorizacao: false,
        observacoes: 'Aceito',
      });

      // Act
      const result = await service.create(createKitDto);

      // Assert
      expect(result).toEqual(mockKit);
      expect(kitRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createKitDto.codigoInterno },
      });
      expect(kitRepository.create).toHaveBeenCalled();
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando código interno já existe', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(mockKit);

      // Act & Assert
      await expect(service.create(createKitDto)).rejects.toThrow(
        ConflictException,
      );
      expect(kitRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: createKitDto.codigoInterno },
      });
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando exame não existe', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockReturnValue(mockKit);
      queryRunner.manager.save = jest.fn().mockResolvedValue(mockKit);
      exameRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createKitDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(exameRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'exame-uuid' },
      });
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando unidade não existe', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockReturnValue(mockKit);
      queryRunner.manager.save = jest.fn().mockResolvedValue(mockKit);
      exameRepository.findOne = jest.fn().mockResolvedValue(mockExame);
      unidadeRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createKitDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(unidadeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'unidade-uuid' },
      });
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando convênio não existe', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockReturnValue(mockKit);
      queryRunner.manager.save = jest.fn().mockResolvedValue(mockKit);
      exameRepository.findOne = jest.fn().mockResolvedValue(mockExame);
      unidadeRepository.findOne = jest.fn().mockResolvedValue(mockUnidade);
      convenioRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createKitDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(convenioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'convenio-uuid' },
      });
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('deve fazer rollback da transação em caso de erro', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockReturnValue(mockKit);
      queryRunner.manager.save = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.create(createKitDto)).rejects.toThrow(
        'Database error',
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de kits com relações', async () => {
      // Arrange
      const kits = [
        { id: '1', nomeKit: 'Kit 1' },
        { id: '2', nomeKit: 'Kit 2' },
      ];

      kitRepository.find = jest.fn().mockResolvedValue(kits);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(kits);
      expect(kitRepository.find).toHaveBeenCalledWith({
        relations: [
          'empresa',
          'kitExames',
          'kitExames.exame',
          'kitUnidades',
          'kitUnidades.unidade',
          'kitConvenios',
          'kitConvenios.convenio',
        ],
        order: {
          nomeKit: 'ASC',
          kitExames: {
            ordemInsercao: 'ASC',
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um kit pelo ID', async () => {
      // Arrange
      const kit = {
        id: 'kit-uuid',
        nomeKit: 'Kit Test',
      };

      kitRepository.findOne = jest.fn().mockResolvedValue(kit);

      // Mock o método para não criar loop infinito
      jest.spyOn(service, 'findOne').mockRestore();

      // Act
      const result = await service.findOne('kit-uuid');

      // Assert
      expect(result).toEqual(kit);
      expect(kitRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'kit-uuid' },
        relations: [
          'empresa',
          'kitExames',
          'kitExames.exame',
          'kitUnidades',
          'kitUnidades.unidade',
          'kitConvenios',
          'kitConvenios.convenio',
        ],
        order: {
          kitExames: {
            ordemInsercao: 'ASC',
          },
        },
      });
    });

    it('deve lançar NotFoundException quando kit não existe', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(null);

      // Mock o método para não criar loop infinito
      jest.spyOn(service, 'findOne').mockRestore();

      // Act & Assert
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um kit pelo código interno', async () => {
      // Arrange
      const kit = {
        id: 'kit-uuid',
        codigoInterno: 'KIT001',
        nomeKit: 'Kit Test',
      };

      kitRepository.findOne = jest.fn().mockResolvedValue(kit);

      // Act
      const result = await service.findByCodigo('KIT001');

      // Assert
      expect(result).toEqual(kit);
      expect(kitRepository.findOne).toHaveBeenCalledWith({
        where: { codigoInterno: 'KIT001' },
        relations: [
          'empresa',
          'kitExames',
          'kitExames.exame',
          'kitUnidades',
          'kitUnidades.unidade',
          'kitConvenios',
          'kitConvenios.convenio',
        ],
      });
    });

    it('deve lançar NotFoundException quando kit não existe', async () => {
      // Arrange
      kitRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUnidade', () => {
    it('deve retornar kits disponíveis em uma unidade', async () => {
      // Arrange
      const kitUnidades = [
        {
          kit: { id: '1', nomeKit: 'Kit 1' },
        },
        {
          kit: { id: '2', nomeKit: 'Kit 2' },
        },
      ];

      kitUnidadeRepository.find = jest.fn().mockResolvedValue(kitUnidades);

      // Act
      const result = await service.findByUnidade('unidade-uuid');

      // Assert
      expect(result).toEqual([
        { id: '1', nomeKit: 'Kit 1' },
        { id: '2', nomeKit: 'Kit 2' },
      ]);
      expect(kitUnidadeRepository.find).toHaveBeenCalledWith({
        where: {
          unidadeId: 'unidade-uuid',
          disponivel: true,
        },
        relations: [
          'kit',
          'kit.empresa',
          'kit.kitExames',
          'kit.kitExames.exame',
        ],
      });
    });
  });

  describe('findByConvenio', () => {
    it('deve retornar kits aceitos por um convênio', async () => {
      // Arrange
      const kitConvenios = [
        {
          kit: { id: '1', nomeKit: 'Kit 1' },
        },
        {
          kit: { id: '2', nomeKit: 'Kit 2' },
        },
      ];

      kitConvenioRepository.find = jest.fn().mockResolvedValue(kitConvenios);

      // Act
      const result = await service.findByConvenio('convenio-uuid');

      // Assert
      expect(result).toEqual([
        { id: '1', nomeKit: 'Kit 1' },
        { id: '2', nomeKit: 'Kit 2' },
      ]);
      expect(kitConvenioRepository.find).toHaveBeenCalledWith({
        where: {
          convenioId: 'convenio-uuid',
          disponivel: true,
        },
        relations: [
          'kit',
          'kit.empresa',
          'kit.kitExames',
          'kit.kitExames.exame',
        ],
      });
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas kits ativos', async () => {
      // Arrange
      const kits = [
        { id: '1', nomeKit: 'Kit 1', statusKit: StatusKitEnum.ATIVO },
        { id: '2', nomeKit: 'Kit 2', statusKit: StatusKitEnum.ATIVO },
      ];

      kitRepository.find = jest.fn().mockResolvedValue(kits);

      // Act
      const result = await service.findAtivos();

      // Assert
      expect(result).toEqual(kits);
      expect(kitRepository.find).toHaveBeenCalledWith({
        where: { statusKit: StatusKitEnum.ATIVO },
        relations: [
          'empresa',
          'kitExames',
          'kitExames.exame',
          'kitUnidades',
          'kitUnidades.unidade',
          'kitConvenios',
          'kitConvenios.convenio',
        ],
        order: {
          nomeKit: 'ASC',
        },
      });
    });
  });

  describe('update', () => {
    const updateKitDto: UpdateKitDto = {
      nomeKit: 'Kit Atualizado',
      descricao: 'Descrição atualizada',
    };

    const existingKit = {
      id: 'kit-uuid',
      nomeKit: 'Kit Original',
      descricao: 'Descrição original',
      statusKit: StatusKitEnum.ATIVO,
    };

    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(existingKit as Kit);
    });

    it('deve atualizar um kit com sucesso', async () => {
      // Arrange
      const updatedKit = {
        ...existingKit,
        ...updateKitDto,
      };

      queryRunner.manager.save = jest.fn().mockResolvedValue(updatedKit);

      // Act
      const result = await service.update('kit-uuid', updateKitDto);

      // Assert
      expect(result).toEqual(existingKit); // Retorna do findOne mockado
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando kit não existe', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(
        service.update('non-existent', updateKitDto),
      ).rejects.toThrow(NotFoundException);
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('deve fazer rollback em caso de erro', async () => {
      // Arrange
      queryRunner.manager.save = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.update('kit-uuid', updateKitDto)).rejects.toThrow(
        'Database error',
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover um kit', async () => {
      // Arrange
      const kit = { id: 'kit-uuid', nomeKit: 'Kit Test' };
      jest.spyOn(service, 'findOne').mockResolvedValue(kit as Kit);
      kitRepository.remove = jest.fn().mockResolvedValue(undefined);

      // Act
      await service.remove('kit-uuid');

      // Assert
      expect(service.findOne).toHaveBeenCalledWith('kit-uuid');
      expect(kitRepository.remove).toHaveBeenCalledWith(kit);
    });

    it('deve lançar NotFoundException quando kit não existe', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alterar status de ATIVO para INATIVO', async () => {
      // Arrange
      const kit = {
        id: 'kit-uuid',
        statusKit: StatusKitEnum.ATIVO,
      };

      const updatedKit = {
        ...kit,
        statusKit: StatusKitEnum.INATIVO,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(kit as Kit);
      kitRepository.save = jest.fn().mockResolvedValue(updatedKit);

      // Act
      const result = await service.toggleStatus('kit-uuid');

      // Assert
      expect(result).toEqual(updatedKit);
      expect(kit.statusKit).toBe(StatusKitEnum.INATIVO);
      expect(kitRepository.save).toHaveBeenCalledWith(kit);
    });

    it('deve alterar status de INATIVO para ATIVO', async () => {
      // Arrange
      const kit = {
        id: 'kit-uuid',
        statusKit: StatusKitEnum.INATIVO,
      };

      const updatedKit = {
        ...kit,
        statusKit: StatusKitEnum.ATIVO,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(kit as Kit);
      kitRepository.save = jest.fn().mockResolvedValue(updatedKit);

      // Act
      const result = await service.toggleStatus('kit-uuid');

      // Assert
      expect(result).toEqual(updatedKit);
      expect(kit.statusKit).toBe(StatusKitEnum.ATIVO);
      expect(kitRepository.save).toHaveBeenCalledWith(kit);
    });
  });

  describe('duplicateKit', () => {
    const originalKit = {
      id: 'original-kit-uuid',
      codigoInterno: 'KIT001',
      nomeKit: 'Kit Original',
      descricao: 'Descrição original',
      tipoKit: TipoKitEnum.CHECK_UP,
      statusKit: StatusKitEnum.ATIVO,
      empresaId: 'empresa-uuid',
      prazoPadraoEntrega: 3,
      valorTotal: 350.0,
      precoKit: 400.0,
      observacoes: 'Observações',
      kitExames: [
        {
          exameId: 'exame-uuid',
          quantidade: 1,
          ordemInsercao: 1,
          observacoes: 'Jejum 12h',
        },
      ],
      kitUnidades: [
        {
          unidadeId: 'unidade-uuid',
          disponivel: true,
          observacoes: 'Disponível',
        },
      ],
      kitConvenios: [
        {
          convenioId: 'convenio-uuid',
          valorConvenio: 300.0,
          disponivel: true,
          requerAutorizacao: false,
          observacoes: 'Aceito',
        },
      ],
    };

    const duplicatedKit = {
      id: 'duplicated-kit-uuid',
      codigoInterno: 'KIT002',
      nomeKit: 'Kit Original (Cópia)',
      statusKit: StatusKitEnum.EM_REVISAO,
    };

    it('deve duplicar um kit com sucesso', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockResolvedValue(originalKit as Kit);
      jest.spyOn(service, 'create').mockResolvedValue(duplicatedKit as Kit);

      // Act
      const result = await service.duplicateKit('original-kit-uuid', 'KIT002');

      // Assert
      expect(result).toEqual(duplicatedKit);
      expect(service.findOne).toHaveBeenCalledWith('original-kit-uuid');
      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          codigoInterno: 'KIT002',
          nomeKit: 'Kit Original (Cópia)',
          statusKit: StatusKitEnum.EM_REVISAO,
          exames: originalKit.kitExames,
          unidades: originalKit.kitUnidades,
          convenios: originalKit.kitConvenios,
        }),
      );
    });

    it('deve lançar NotFoundException quando kit original não existe', async () => {
      // Arrange
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(
        service.duplicateKit('non-existent', 'KIT002'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('tratamento de erros', () => {
    it('deve tratar erro de conexão com banco de dados', async () => {
      // Arrange
      kitRepository.find = jest
        .fn()
        .mockRejectedValue(new Error('Connection timeout'));

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow('Connection timeout');
    });

    it('deve tratar erro de constraint violation na criação', async () => {
      // Arrange
      const createKitDto: CreateKitDto = {
        codigoInterno: 'KIT001',
        nomeKit: 'Kit Test',
        tipoKit: TipoKitEnum.CHECK_UP,
        empresaId: 'empresa-uuid',
      };

      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockReturnValue(createKitDto);
      queryRunner.manager.save = jest.fn().mockRejectedValue({
        code: '23505',
        detail: 'Key already exists',
      });

      // Act & Assert
      await expect(service.create(createKitDto)).rejects.toEqual(
        expect.objectContaining({ code: '23505' }),
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('validações de negócio', () => {
    it('deve aplicar status padrão quando não fornecido na criação', async () => {
      // Arrange
      const createKitDto: CreateKitDto = {
        codigoInterno: 'KIT001',
        nomeKit: 'Kit Test',
        tipoKit: TipoKitEnum.CHECK_UP,
        empresaId: 'empresa-uuid',
        // statusKit não fornecido
      };

      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockImplementation((data) => {
        return {
          ...data,
          statusKit: data.statusKit || StatusKitEnum.ATIVO,
        };
      });

      queryRunner.manager.save = jest
        .fn()
        .mockResolvedValue({ id: 'kit-uuid' });
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ statusKit: StatusKitEnum.ATIVO } as Kit);

      // Act
      await service.create(createKitDto);

      // Assert
      expect(kitRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          statusKit: StatusKitEnum.ATIVO,
        }),
      );
    });

    it('deve validar estrutura de dados antes de salvar', async () => {
      // Arrange
      const createKitDto: CreateKitDto = {
        codigoInterno: 'KIT001',
        nomeKit: 'Kit Test',
        tipoKit: TipoKitEnum.CHECK_UP,
        empresaId: 'empresa-uuid',
      };

      kitRepository.findOne = jest.fn().mockResolvedValue(null);
      kitRepository.create = jest.fn().mockReturnValue(createKitDto);
      queryRunner.manager.save = jest
        .fn()
        .mockResolvedValue({ id: 'kit-uuid' });
      jest.spyOn(service, 'findOne').mockResolvedValue({} as Kit);

      // Act
      await service.create(createKitDto);

      // Assert
      expect(kitRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          codigoInterno: 'KIT001',
          nomeKit: 'Kit Test',
          tipoKit: TipoKitEnum.CHECK_UP,
          empresaId: 'empresa-uuid',
        }),
      );
    });
  });
});
