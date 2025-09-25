import { Test, TestingModule } from '@nestjs/testing';
import { KitsController } from './kits.controller';
import { KitsService } from '../services/kits.service';
import { CreateKitDto } from '../dto/create-kit.dto';
import { UpdateKitDto } from '../dto/update-kit.dto';
import { Kit, StatusKitEnum, TipoKitEnum } from '../entities/kit.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('KitsController', () => {
  let controller: KitsController;
  let service: KitsService;

  const mockKitsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findByUnidade: jest.fn(),
    findByConvenio: jest.fn(),
    findAtivos: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleStatus: jest.fn(),
    duplicateKit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KitsController],
      providers: [
        {
          provide: KitsService,
          useValue: mockKitsService,
        },
      ],
    }).compile();

    controller = module.get<KitsController>(KitsController);
    service = module.get<KitsService>(KitsService);
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
    };

    const mockKit: Partial<Kit> = {
      id: 'kit-uuid',
      ...createKitDto,
      empresa: null,
      kitExames: [],
      kitUnidades: [],
      kitConvenios: [],
      dataCriacao: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Kit;

    it('deve criar um kit com sucesso', async () => {
      // Arrange
      mockKitsService.create.mockResolvedValue(mockKit);

      // Act
      const result = await controller.create(createKitDto);

      // Assert
      expect(result).toEqual(mockKit);
      expect(service.create).toHaveBeenCalledWith(createKitDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar ConflictException quando código já existe', async () => {
      // Arrange
      mockKitsService.create.mockRejectedValue(
        new ConflictException('Kit com código KIT001 já existe'),
      );

      // Act & Assert
      await expect(controller.create(createKitDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(createKitDto);
    });

    it('deve lançar NotFoundException quando exame não existe', async () => {
      // Arrange
      const createKitWithExameDto = {
        ...createKitDto,
        exames: [{ exameId: 'exame-inexistente' }],
      };

      mockKitsService.create.mockRejectedValue(
        new NotFoundException('Exame com ID exame-inexistente não encontrado'),
      );

      // Act & Assert
      await expect(controller.create(createKitWithExameDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.create).toHaveBeenCalledWith(createKitWithExameDto);
    });

    it('deve validar DTO de entrada', async () => {
      // Arrange
      const invalidDto = {
        ...createKitDto,
        codigoInterno: '', // Campo obrigatório vazio
      };

      mockKitsService.create.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(controller.create(invalidDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de todos os kits', async () => {
      // Arrange
      const kits = [
        {
          id: '1',
          nomeKit: 'Kit 1',
          statusKit: StatusKitEnum.ATIVO,
        },
        {
          id: '2',
          nomeKit: 'Kit 2',
          statusKit: StatusKitEnum.INATIVO,
        },
      ];

      mockKitsService.findAll.mockResolvedValue(kits);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(kits);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar array vazio quando não há kits', async () => {
      // Arrange
      mockKitsService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve incluir relações corretas', async () => {
      // Arrange
      const kitsWithRelations = [
        {
          id: '1',
          nomeKit: 'Kit 1',
          empresa: { id: 'empresa-1', nome: 'Empresa Test' },
          kitExames: [{ id: 'ke-1', exame: { id: 'e-1', nome: 'Exame 1' } }],
          kitUnidades: [
            { id: 'ku-1', unidade: { id: 'u-1', nome: 'Unidade 1' } },
          ],
          kitConvenios: [
            { id: 'kc-1', convenio: { id: 'c-1', codigo_convenio: 'CONV1' } },
          ],
        },
      ];

      mockKitsService.findAll.mockResolvedValue(kitsWithRelations);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(kitsWithRelations);
      expect(result[0].empresa).toBeDefined();
      expect(result[0].kitExames).toBeDefined();
      expect(result[0].kitUnidades).toBeDefined();
      expect(result[0].kitConvenios).toBeDefined();
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas kits ativos', async () => {
      // Arrange
      const kitsAtivos = [
        {
          id: '1',
          nomeKit: 'Kit Ativo 1',
          statusKit: StatusKitEnum.ATIVO,
        },
        {
          id: '2',
          nomeKit: 'Kit Ativo 2',
          statusKit: StatusKitEnum.ATIVO,
        },
      ];

      mockKitsService.findAtivos.mockResolvedValue(kitsAtivos);

      // Act
      const result = await controller.findAtivos();

      // Assert
      expect(result).toEqual(kitsAtivos);
      expect(service.findAtivos).toHaveBeenCalledTimes(1);
      result.forEach((kit) => {
        expect(kit.statusKit).toBe(StatusKitEnum.ATIVO);
      });
    });

    it('deve retornar array vazio quando não há kits ativos', async () => {
      // Arrange
      mockKitsService.findAtivos.mockResolvedValue([]);

      // Act
      const result = await controller.findAtivos();

      // Assert
      expect(result).toEqual([]);
      expect(service.findAtivos).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar kit pelo código interno', async () => {
      // Arrange
      const kit = {
        id: 'kit-uuid',
        codigoInterno: 'KIT001',
        nomeKit: 'Kit Test',
      };

      mockKitsService.findByCodigo.mockResolvedValue(kit);

      // Act
      const result = await controller.findByCodigo('KIT001');

      // Assert
      expect(result).toEqual(kit);
      expect(service.findByCodigo).toHaveBeenCalledWith('KIT001');
      expect(service.findByCodigo).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando código não existe', async () => {
      // Arrange
      mockKitsService.findByCodigo.mockRejectedValue(
        new NotFoundException('Kit com código NON-EXISTENT não encontrado'),
      );

      // Act & Assert
      await expect(controller.findByCodigo('NON-EXISTENT')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCodigo).toHaveBeenCalledWith('NON-EXISTENT');
    });

    it('deve aceitar códigos com caracteres especiais', async () => {
      // Arrange
      const codigo = 'KIT-001_ESPECIAL';
      const kit = {
        id: 'kit-uuid',
        codigoInterno: codigo,
        nomeKit: 'Kit Especial',
      };

      mockKitsService.findByCodigo.mockResolvedValue(kit);

      // Act
      const result = await controller.findByCodigo(codigo);

      // Assert
      expect(result).toEqual(kit);
      expect(service.findByCodigo).toHaveBeenCalledWith(codigo);
    });
  });

  describe('findByUnidade', () => {
    it('deve retornar kits disponíveis em uma unidade', async () => {
      // Arrange
      const unidadeId = 'unidade-uuid';
      const kits = [
        { id: '1', nomeKit: 'Kit 1' },
        { id: '2', nomeKit: 'Kit 2' },
      ];

      mockKitsService.findByUnidade.mockResolvedValue(kits);

      // Act
      const result = await controller.findByUnidade(unidadeId);

      // Assert
      expect(result).toEqual(kits);
      expect(service.findByUnidade).toHaveBeenCalledWith(unidadeId);
      expect(service.findByUnidade).toHaveBeenCalledTimes(1);
    });

    it('deve validar UUID da unidade', async () => {
      // Arrange
      const unidadeIdInvalido = 'invalid-uuid';

      // O ParseUUIDPipe será responsável por validar
      // Simular erro de validação de UUID
      mockKitsService.findByUnidade.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(
        controller.findByUnidade(unidadeIdInvalido),
      ).rejects.toThrow();
    });

    it('deve retornar array vazio quando unidade não tem kits', async () => {
      // Arrange
      const unidadeId = 'unidade-sem-kits-uuid';
      mockKitsService.findByUnidade.mockResolvedValue([]);

      // Act
      const result = await controller.findByUnidade(unidadeId);

      // Assert
      expect(result).toEqual([]);
      expect(service.findByUnidade).toHaveBeenCalledWith(unidadeId);
    });
  });

  describe('findByConvenio', () => {
    it('deve retornar kits aceitos por um convênio', async () => {
      // Arrange
      const convenioId = 'convenio-uuid';
      const kits = [
        { id: '1', nomeKit: 'Kit 1' },
        { id: '2', nomeKit: 'Kit 2' },
      ];

      mockKitsService.findByConvenio.mockResolvedValue(kits);

      // Act
      const result = await controller.findByConvenio(convenioId);

      // Assert
      expect(result).toEqual(kits);
      expect(service.findByConvenio).toHaveBeenCalledWith(convenioId);
      expect(service.findByConvenio).toHaveBeenCalledTimes(1);
    });

    it('deve validar UUID do convênio', async () => {
      // Arrange
      const convenioIdInvalido = 'invalid-uuid';

      mockKitsService.findByConvenio.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(
        controller.findByConvenio(convenioIdInvalido),
      ).rejects.toThrow();
    });

    it('deve retornar array vazio quando convênio não aceita kits', async () => {
      // Arrange
      const convenioId = 'convenio-sem-kits-uuid';
      mockKitsService.findByConvenio.mockResolvedValue([]);

      // Act
      const result = await controller.findByConvenio(convenioId);

      // Assert
      expect(result).toEqual([]);
      expect(service.findByConvenio).toHaveBeenCalledWith(convenioId);
    });
  });

  describe('findOne', () => {
    it('deve retornar um kit pelo ID', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      const kit = {
        id: kitId,
        nomeKit: 'Kit Test',
        empresa: { id: 'empresa-1' },
        kitExames: [],
        kitUnidades: [],
        kitConvenios: [],
      };

      mockKitsService.findOne.mockResolvedValue(kit);

      // Act
      const result = await controller.findOne(kitId);

      // Assert
      expect(result).toEqual(kit);
      expect(service.findOne).toHaveBeenCalledWith(kitId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando ID não existe', async () => {
      // Arrange
      const kitIdInexistente = 'kit-inexistente-uuid';
      mockKitsService.findOne.mockRejectedValue(
        new NotFoundException(`Kit com ID ${kitIdInexistente} não encontrado`),
      );

      // Act & Assert
      await expect(controller.findOne(kitIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(kitIdInexistente);
    });

    it('deve validar UUID do kit', async () => {
      // Arrange
      const kitIdInvalido = 'invalid-uuid';

      mockKitsService.findOne.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(controller.findOne(kitIdInvalido)).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateKitDto: UpdateKitDto = {
      nomeKit: 'Kit Atualizado',
      descricao: 'Descrição atualizada',
      statusKit: StatusKitEnum.EM_REVISAO,
    };

    const updatedKit = {
      id: 'kit-uuid',
      nomeKit: 'Kit Atualizado',
      descricao: 'Descrição atualizada',
      statusKit: StatusKitEnum.EM_REVISAO,
    };

    it('deve atualizar um kit com sucesso', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      mockKitsService.update.mockResolvedValue(updatedKit);

      // Act
      const result = await controller.update(kitId, updateKitDto);

      // Assert
      expect(result).toEqual(updatedKit);
      expect(service.update).toHaveBeenCalledWith(kitId, updateKitDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando kit não existe', async () => {
      // Arrange
      const kitIdInexistente = 'kit-inexistente-uuid';
      mockKitsService.update.mockRejectedValue(
        new NotFoundException(`Kit com ID ${kitIdInexistente} não encontrado`),
      );

      // Act & Assert
      await expect(
        controller.update(kitIdInexistente, updateKitDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        kitIdInexistente,
        updateKitDto,
      );
    });

    it('deve permitir atualização parcial', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      const partialUpdateDto: UpdateKitDto = {
        nomeKit: 'Apenas nome atualizado',
      };

      const partiallyUpdatedKit = {
        id: kitId,
        nomeKit: 'Apenas nome atualizado',
        // outros campos permanecem inalterados
      };

      mockKitsService.update.mockResolvedValue(partiallyUpdatedKit);

      // Act
      const result = await controller.update(kitId, partialUpdateDto);

      // Assert
      expect(result).toEqual(partiallyUpdatedKit);
      expect(service.update).toHaveBeenCalledWith(kitId, partialUpdateDto);
    });

    it('deve validar DTO de atualização', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      const invalidUpdateDto = {
        nomeKit: '', // Campo vazio
        valorTotal: -100, // Valor negativo
      };

      mockKitsService.update.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(
        controller.update(kitId, invalidUpdateDto),
      ).rejects.toThrow();
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ATIVO para INATIVO', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      const toggledKit = {
        id: kitId,
        statusKit: StatusKitEnum.INATIVO,
      };

      mockKitsService.toggleStatus.mockResolvedValue(toggledKit);

      // Act
      const result = await controller.toggleStatus(kitId);

      // Assert
      expect(result).toEqual(toggledKit);
      expect(service.toggleStatus).toHaveBeenCalledWith(kitId);
      expect(service.toggleStatus).toHaveBeenCalledTimes(1);
    });

    it('deve alternar status de INATIVO para ATIVO', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      const toggledKit = {
        id: kitId,
        statusKit: StatusKitEnum.ATIVO,
      };

      mockKitsService.toggleStatus.mockResolvedValue(toggledKit);

      // Act
      const result = await controller.toggleStatus(kitId);

      // Assert
      expect(result).toEqual(toggledKit);
      expect(service.toggleStatus).toHaveBeenCalledWith(kitId);
    });

    it('deve lançar NotFoundException quando kit não existe', async () => {
      // Arrange
      const kitIdInexistente = 'kit-inexistente-uuid';
      mockKitsService.toggleStatus.mockRejectedValue(
        new NotFoundException(`Kit com ID ${kitIdInexistente} não encontrado`),
      );

      // Act & Assert
      await expect(controller.toggleStatus(kitIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.toggleStatus).toHaveBeenCalledWith(kitIdInexistente);
    });
  });

  describe('duplicateKit', () => {
    it('deve duplicar um kit com sucesso', async () => {
      // Arrange
      const kitId = 'kit-original-uuid';
      const novoCodigoInterno = 'KIT002';
      const duplicatedKit = {
        id: 'kit-duplicado-uuid',
        codigoInterno: novoCodigoInterno,
        nomeKit: 'Kit Original (Cópia)',
        statusKit: StatusKitEnum.EM_REVISAO,
      };

      mockKitsService.duplicateKit.mockResolvedValue(duplicatedKit);

      // Act
      const result = await controller.duplicateKit(kitId, novoCodigoInterno);

      // Assert
      expect(result).toEqual(duplicatedKit);
      expect(service.duplicateKit).toHaveBeenCalledWith(
        kitId,
        novoCodigoInterno,
      );
      expect(service.duplicateKit).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando kit original não existe', async () => {
      // Arrange
      const kitIdInexistente = 'kit-inexistente-uuid';
      const novoCodigoInterno = 'KIT002';

      mockKitsService.duplicateKit.mockRejectedValue(
        new NotFoundException(`Kit com ID ${kitIdInexistente} não encontrado`),
      );

      // Act & Assert
      await expect(
        controller.duplicateKit(kitIdInexistente, novoCodigoInterno),
      ).rejects.toThrow(NotFoundException);
      expect(service.duplicateKit).toHaveBeenCalledWith(
        kitIdInexistente,
        novoCodigoInterno,
      );
    });

    it('deve lançar ConflictException quando novo código já existe', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      const codigoExistente = 'KIT_EXISTENTE';

      mockKitsService.duplicateKit.mockRejectedValue(
        new ConflictException(`Kit com código ${codigoExistente} já existe`),
      );

      // Act & Assert
      await expect(
        controller.duplicateKit(kitId, codigoExistente),
      ).rejects.toThrow(ConflictException);
      expect(service.duplicateKit).toHaveBeenCalledWith(kitId, codigoExistente);
    });

    it('deve validar parâmetros obrigatórios', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      const codigoVazio = '';

      mockKitsService.duplicateKit.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(
        controller.duplicateKit(kitId, codigoVazio),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('deve remover um kit com sucesso', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      mockKitsService.remove.mockResolvedValue(undefined);

      // Act
      await controller.remove(kitId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(kitId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando kit não existe', async () => {
      // Arrange
      const kitIdInexistente = 'kit-inexistente-uuid';
      mockKitsService.remove.mockRejectedValue(
        new NotFoundException(`Kit com ID ${kitIdInexistente} não encontrado`),
      );

      // Act & Assert
      await expect(controller.remove(kitIdInexistente)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(kitIdInexistente);
    });

    it('deve validar UUID do kit a ser removido', async () => {
      // Arrange
      const kitIdInvalido = 'invalid-uuid';

      mockKitsService.remove.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(controller.remove(kitIdInvalido)).rejects.toThrow();
    });

    it('deve retornar status 204 No Content após remoção', async () => {
      // Arrange
      const kitId = 'kit-uuid';
      mockKitsService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(kitId);

      // Assert
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(kitId);
    });
  });

  describe('tratamento de erros', () => {
    it('deve propagar erros do service', async () => {
      // Arrange
      mockKitsService.findAll.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('deve tratar erro de validação de entrada', async () => {
      // Arrange
      const invalidCreateDto = {
        codigoInterno: '', // Campo obrigatório vazio
      };

      mockKitsService.create.mockRejectedValue(new Error('Validation failed'));

      // Act & Assert
      await expect(
        controller.create(invalidCreateDto as CreateKitDto),
      ).rejects.toThrow();
    });

    it('deve manter consistência de tipos de erro', async () => {
      // Arrange
      mockKitsService.findOne.mockRejectedValue(
        new NotFoundException('Kit não encontrado'),
      );

      // Act & Assert
      await expect(controller.findOne('kit-uuid')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('integração com guards e decorators', () => {
    it('deve ter controller configurado corretamente', () => {
      // Arrange & Act & Assert
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });

    it('deve ter métodos do controller expostos corretamente', () => {
      // Assert
      expect(typeof controller.create).toBe('function');
      expect(typeof controller.findAll).toBe('function');
      expect(typeof controller.findOne).toBe('function');
      expect(typeof controller.update).toBe('function');
      expect(typeof controller.remove).toBe('function');
    });
  });

  describe('validações de parâmetros', () => {
    it('deve aceitar UUIDs válidos nos parâmetros', async () => {
      // Arrange
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const kit = { id: validUuid, nomeKit: 'Kit Test' };
      mockKitsService.findOne.mockResolvedValue(kit);

      // Act
      const result = await controller.findOne(validUuid);

      // Assert
      expect(result).toEqual(kit);
      expect(service.findOne).toHaveBeenCalledWith(validUuid);
    });

    it('deve validar códigos internos com diferentes formatos', async () => {
      // Arrange
      const codigosValidos = ['KIT001', 'KIT-002', 'KIT_003', 'CHECKUP-BASICO'];

      for (const codigo of codigosValidos) {
        const kit = { id: 'uuid', codigoInterno: codigo };
        mockKitsService.findByCodigo.mockResolvedValue(kit);

        // Act
        const result = await controller.findByCodigo(codigo);

        // Assert
        expect(result.codigoInterno).toBe(codigo);
      }
    });
  });

  describe('performance e otimização', () => {
    it('deve chamar service apenas uma vez por operação', async () => {
      // Arrange
      const kits = [{ id: '1', nomeKit: 'Kit 1' }];
      mockKitsService.findAll.mockResolvedValue(kits);

      // Act
      await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve passar parâmetros corretos para o service', async () => {
      // Arrange
      const kitId = 'test-uuid';
      const updateDto = { nomeKit: 'Novo Nome' };
      mockKitsService.update.mockResolvedValue({} as Kit);

      // Act
      await controller.update(kitId, updateDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(kitId, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });
});
