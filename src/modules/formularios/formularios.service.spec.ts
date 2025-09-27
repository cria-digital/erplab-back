import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { FormulariosService } from './formularios.service';
import {
  Formulario,
  TipoFormulario,
  StatusFormulario,
} from './entities/formulario.entity';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';

describe('FormulariosService', () => {
  let service: FormulariosService;

  const mockFormulario = {
    id: 'formulario-uuid-1',
    codigoFormulario: 'FORM001',
    nomeFormulario: 'Formulário de Anamnese',
    descricao: 'Formulário para coleta de dados de anamnese',
    tipo: TipoFormulario.ANAMNESE,
    versao: 1,
    status: StatusFormulario.RASCUNHO,
    ativo: true,
    unidadeSaudeId: 'unidade-uuid-1',
    campos: [],
    respostas: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      getMany: jest.fn(),
      getOne: jest.fn(),
      getCount: jest.fn(),
    })),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormulariosService,
        {
          provide: getRepositoryToken(Formulario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FormulariosService>(FormulariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createFormularioDto: CreateFormularioDto = {
      codigoFormulario: 'FORM001',
      nomeFormulario: 'Formulário de Anamnese',
      descricao: 'Formulário para coleta de dados de anamnese',
      tipo: TipoFormulario.ANAMNESE,
      unidadeSaudeId: 'unidade-uuid-1',
    };

    it('should create a new form successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockFormulario);
      mockRepository.save.mockResolvedValue(mockFormulario);

      const result = await service.create(createFormularioDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoFormulario: createFormularioDto.codigoFormulario },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createFormularioDto,
        versao: 1,
        status: StatusFormulario.RASCUNHO,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockFormulario);
      expect(result).toEqual(mockFormulario);
    });

    it('should throw BadRequestException if form code already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockFormulario);

      await expect(service.create(createFormularioDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoFormulario: createFormularioDto.codigoFormulario },
      });
    });

    it('should set default version and status if not provided', async () => {
      const dtoWithoutDefaults = {
        codigoFormulario: 'FORM002',
        nomeFormulario: 'Teste',
        tipo: TipoFormulario.QUESTIONARIO,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockFormulario);
      mockRepository.save.mockResolvedValue(mockFormulario);

      await service.create(dtoWithoutDefaults);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dtoWithoutDefaults,
        versao: 1,
        status: StatusFormulario.RASCUNHO,
      });
    });
  });

  describe('findAll', () => {
    it('should return all forms', async () => {
      const formularios = [mockFormulario];
      mockRepository.find.mockResolvedValue(formularios);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['campos', 'respostas'],
        order: { nomeFormulario: 'ASC' },
      });
      expect(result).toEqual(formularios);
    });
  });

  describe('findOne', () => {
    it('should return a form by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockFormulario);

      const result = await service.findOne('formulario-uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'formulario-uuid-1' },
        relations: ['campos', 'campos.alternativas', 'respostas'],
      });
      expect(result).toEqual(mockFormulario);
    });

    it('should throw NotFoundException if form not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('should return form by code', async () => {
      mockRepository.findOne.mockResolvedValue(mockFormulario);

      const result = await service.findByCodigo('FORM001');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigoFormulario: 'FORM001' },
        relations: ['campos', 'campos.alternativas'],
      });
      expect(result).toEqual(mockFormulario);
    });

    it('should throw NotFoundException if form code not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('should return active forms', async () => {
      const formularios = [mockFormulario];
      mockRepository.find.mockResolvedValue(formularios);

      const result = await service.findAtivos();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { ativo: true },
        relations: ['campos'],
        order: { nomeFormulario: 'ASC' },
      });
      expect(result).toEqual(formularios);
    });
  });

  describe('findPublicados', () => {
    it('should return published forms', async () => {
      const formularios = [mockFormulario];
      mockRepository.find.mockResolvedValue(formularios);

      const result = await service.findPublicados();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: StatusFormulario.PUBLICADO, ativo: true },
        relations: ['campos'],
        order: { nomeFormulario: 'ASC' },
      });
      expect(result).toEqual(formularios);
    });
  });

  describe('findByTipo', () => {
    it('should return forms by type', async () => {
      const formularios = [mockFormulario];
      mockRepository.find.mockResolvedValue(formularios);

      const result = await service.findByTipo(TipoFormulario.ANAMNESE);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipo: TipoFormulario.ANAMNESE },
        relations: ['campos'],
        order: { nomeFormulario: 'ASC' },
      });
      expect(result).toEqual(formularios);
    });
  });

  describe('update', () => {
    const updateFormularioDto: UpdateFormularioDto = {
      nomeFormulario: 'Formulário Atualizado',
      descricao: 'Descrição atualizada',
    };

    it('should update a form successfully', async () => {
      const updatedFormulario = { ...mockFormulario, ...updateFormularioDto };
      mockRepository.findOne.mockResolvedValue(mockFormulario);
      mockRepository.save.mockResolvedValue(updatedFormulario);

      const result = await service.update(
        'formulario-uuid-1',
        updateFormularioDto,
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'formulario-uuid-1' },
        relations: ['campos', 'campos.alternativas', 'respostas'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedFormulario);
      expect(result).toEqual(updatedFormulario);
    });

    it('should throw BadRequestException if new code already exists', async () => {
      const updateWithCode = { codigoFormulario: 'EXISTING_CODE' };
      const existingFormulario = { ...mockFormulario, id: 'different-id' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockFormulario) // findOne for update
        .mockResolvedValueOnce(existingFormulario); // findOne for code check

      await expect(
        service.update('formulario-uuid-1', updateWithCode),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('publicar', () => {
    it('should publish a form successfully', async () => {
      const formWithFields = {
        ...mockFormulario,
        campos: [{ id: 'campo-1' }],
      };
      const publishedForm = {
        ...formWithFields,
        status: StatusFormulario.PUBLICADO,
        ativo: true,
      };

      mockRepository.findOne.mockResolvedValue(formWithFields);
      mockRepository.save.mockResolvedValue(publishedForm);

      const result = await service.publicar('formulario-uuid-1');

      expect(result.status).toBe(StatusFormulario.PUBLICADO);
      expect(result.ativo).toBe(true);
    });

    it('should throw BadRequestException if form is already published', async () => {
      const publishedForm = {
        ...mockFormulario,
        status: StatusFormulario.PUBLICADO,
      };

      mockRepository.findOne.mockResolvedValue(publishedForm);

      await expect(service.publicar('formulario-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if form has no fields', async () => {
      const formWithoutFields = {
        ...mockFormulario,
        campos: [],
      };

      mockRepository.findOne.mockResolvedValue(formWithoutFields);

      await expect(service.publicar('formulario-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('criarVersao', () => {
    it('should create a new version of a form', async () => {
      const novoFormulario = {
        ...mockFormulario,
        id: 'new-form-uuid',
        codigoFormulario: 'FORM001_V2',
        versao: 2,
        status: StatusFormulario.RASCUNHO,
        formularioPaiId: 'formulario-uuid-1',
      };

      mockRepository.findOne.mockResolvedValue(mockFormulario);
      mockRepository.create.mockReturnValue(novoFormulario);
      mockRepository.save.mockResolvedValue(novoFormulario);

      const result = await service.criarVersao('formulario-uuid-1');

      expect(result.versao).toBe(2);
      expect(result.codigoFormulario).toBe('FORM001_V2');
      expect(result.status).toBe(StatusFormulario.RASCUNHO);
      expect(result.formularioPaiId).toBe('formulario-uuid-1');
    });
  });

  describe('remove', () => {
    it('should remove a form successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockFormulario);
      mockRepository.remove.mockResolvedValue(mockFormulario);

      await service.remove('formulario-uuid-1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockFormulario);
    });

    it('should throw BadRequestException if form is published', async () => {
      const publishedForm = {
        ...mockFormulario,
        status: StatusFormulario.PUBLICADO,
      };

      mockRepository.findOne.mockResolvedValue(publishedForm);

      await expect(service.remove('formulario-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('search', () => {
    it('should search forms by term', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockFormulario]),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        leftJoin: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getCount: jest.fn(),
      };

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.search('Anamnese');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'formulario',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'formulario.campos',
        'campos',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'formulario.nome_formulario ILIKE :termo',
        { termo: '%Anamnese%' },
      );
      expect(result).toEqual([mockFormulario]);
    });
  });

  describe('validarFormulario', () => {
    it('should validate form with fields successfully', async () => {
      const formWithValidFields = {
        ...mockFormulario,
        campos: [
          { id: 'campo-1', codigoCampo: 'CAMPO1', obrigatorio: true },
          { id: 'campo-2', codigoCampo: 'CAMPO2', obrigatorio: false },
        ],
      };

      mockRepository.findOne.mockResolvedValue(formWithValidFields);

      const result = await service.validarFormulario('formulario-uuid-1');

      expect(result.valido).toBe(true);
      expect(result.erros).toHaveLength(0);
    });

    it('should return validation errors for form without fields', async () => {
      const formWithoutFields = {
        ...mockFormulario,
        campos: [],
      };

      mockRepository.findOne.mockResolvedValue(formWithoutFields);

      const result = await service.validarFormulario('formulario-uuid-1');

      expect(result.valido).toBe(false);
      expect(result.erros).toContain('Formulário deve ter pelo menos um campo');
      expect(result.erros).toContain(
        'Formulário deve ter pelo menos um campo obrigatório',
      );
    });

    it('should return validation errors for duplicate field codes', async () => {
      const formWithDuplicateCodes = {
        ...mockFormulario,
        campos: [
          { id: 'campo-1', codigoCampo: 'CAMPO1', obrigatorio: true },
          { id: 'campo-2', codigoCampo: 'CAMPO1', obrigatorio: false },
        ],
      };

      mockRepository.findOne.mockResolvedValue(formWithDuplicateCodes);

      const result = await service.validarFormulario('formulario-uuid-1');

      expect(result.valido).toBe(false);
      expect(result.erros).toContain('Códigos de campos duplicados: CAMPO1');
    });
  });

  describe('getEstatisticas', () => {
    it('should return form statistics', async () => {
      const mockPorTipo = [
        { tipo: TipoFormulario.ANAMNESE, total: '5' },
        { tipo: TipoFormulario.QUESTIONARIO, total: '3' },
      ];
      const mockPorStatus = [
        { status: StatusFormulario.PUBLICADO, total: '5' },
        { status: StatusFormulario.RASCUNHO, total: '3' },
      ];

      mockRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8) // ativos
        .mockResolvedValueOnce(2) // inativos
        .mockResolvedValueOnce(5); // publicados

      // Configure mock to return different values on each call
      let callCount = 0;
      mockRepository.createQueryBuilder.mockImplementation(() => {
        const qb = {
          select: jest.fn().mockReturnThis(),
          addSelect: jest.fn().mockReturnThis(),
          groupBy: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orWhere: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          leftJoin: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getMany: jest.fn(),
          getOne: jest.fn(),
          getCount: jest.fn().mockResolvedValue(3),
          getRawMany: jest.fn(() => {
            if (callCount === 0) {
              callCount++;
              return Promise.resolve(mockPorTipo);
            } else if (callCount === 1) {
              callCount++;
              return Promise.resolve(mockPorStatus);
            }
            return Promise.resolve([]);
          }),
        };
        return qb;
      });

      const result = await service.getEstatisticas();

      expect(result).toEqual({
        total: 10,
        ativos: 8,
        inativos: 2,
        publicados: 5,
        comRespostas: 3,
        porTipo: mockPorTipo,
        porStatus: mockPorStatus,
      });
      expect(mockRepository.count).toHaveBeenCalledTimes(4);
    });
  });
});
