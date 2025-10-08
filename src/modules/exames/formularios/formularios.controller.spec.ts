import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { FormulariosController } from './formularios.controller';
import { FormulariosService } from './formularios.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { TipoFormulario, StatusFormulario } from './entities/formulario.entity';

describe('FormulariosController', () => {
  let controller: FormulariosController;
  let service: FormulariosService;

  const mockFormulariosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findAtivos: jest.fn(),
    findPublicados: jest.fn(),
    findByTipo: jest.fn(),
    findByStatus: jest.fn(),
    findByUnidadeSaude: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
    toggleStatus: jest.fn(),
    updateStatus: jest.fn(),
    publicar: jest.fn(),
    criarVersao: jest.fn(),
    getEstatisticas: jest.fn(),
    validarFormulario: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormulariosController],
      providers: [
        {
          provide: FormulariosService,
          useValue: mockFormulariosService,
        },
      ],
    }).compile();

    controller = module.get<FormulariosController>(FormulariosController);
    service = module.get<FormulariosService>(FormulariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createFormularioDto: CreateFormularioDto = {
      codigoFormulario: 'FORM001',
      nomeFormulario: 'Formulário de Anamnese',
      descricao: 'Formulário para coleta de dados de anamnese',
      tipo: TipoFormulario.ANAMNESE,
      unidadeSaudeId: 'unidade-uuid-1',
    };

    it('should create a new form', async () => {
      mockFormulariosService.create.mockResolvedValue(mockFormulario);

      const result = await controller.create(createFormularioDto);

      expect(service.create).toHaveBeenCalledWith(createFormularioDto);
      expect(result).toEqual(mockFormulario);
    });

    it('should handle creation conflicts', async () => {
      mockFormulariosService.create.mockRejectedValue(
        new BadRequestException('Já existe um formulário com o código FORM001'),
      );

      await expect(controller.create(createFormularioDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all forms', async () => {
      const formularios = [mockFormulario];
      mockFormulariosService.findAll.mockResolvedValue(formularios);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(formularios);
    });
  });

  describe('findAtivos', () => {
    it('should return active forms', async () => {
      const formularios = [mockFormulario];
      mockFormulariosService.findAtivos.mockResolvedValue(formularios);

      const result = await controller.findAtivos();

      expect(service.findAtivos).toHaveBeenCalled();
      expect(result).toEqual(formularios);
    });
  });

  describe('findPublicados', () => {
    it('should return published forms', async () => {
      const formularios = [mockFormulario];
      mockFormulariosService.findPublicados.mockResolvedValue(formularios);

      const result = await controller.findPublicados();

      expect(service.findPublicados).toHaveBeenCalled();
      expect(result).toEqual(formularios);
    });
  });

  describe('findByTipo', () => {
    it('should return forms by type', async () => {
      const formularios = [mockFormulario];
      mockFormulariosService.findByTipo.mockResolvedValue(formularios);

      const result = await controller.findByTipo(TipoFormulario.ANAMNESE);

      expect(service.findByTipo).toHaveBeenCalledWith(TipoFormulario.ANAMNESE);
      expect(result).toEqual(formularios);
    });
  });

  describe('findByStatus', () => {
    it('should return forms by status', async () => {
      const formularios = [mockFormulario];
      mockFormulariosService.findByStatus.mockResolvedValue(formularios);

      const result = await controller.findByStatus(StatusFormulario.RASCUNHO);

      expect(service.findByStatus).toHaveBeenCalledWith(
        StatusFormulario.RASCUNHO,
      );
      expect(result).toEqual(formularios);
    });
  });

  describe('findByUnidadeSaude', () => {
    it('should return forms by unidade saude', async () => {
      const formularios = [mockFormulario];
      mockFormulariosService.findByUnidadeSaude.mockResolvedValue(formularios);

      const result = await controller.findByUnidadeSaude('unidade-uuid-1');

      expect(service.findByUnidadeSaude).toHaveBeenCalledWith('unidade-uuid-1');
      expect(result).toEqual(formularios);
    });
  });

  describe('search', () => {
    it('should search forms', async () => {
      const formularios = [mockFormulario];
      mockFormulariosService.search.mockResolvedValue(formularios);

      const result = await controller.search('Anamnese');

      expect(service.search).toHaveBeenCalledWith('Anamnese');
      expect(result).toEqual(formularios);
    });
  });

  describe('getEstatisticas', () => {
    it('should return form statistics', async () => {
      const mockStats = {
        total: 10,
        ativos: 8,
        inativos: 2,
        publicados: 5,
        comRespostas: 3,
        porTipo: [],
        porStatus: [],
      };
      mockFormulariosService.getEstatisticas.mockResolvedValue(mockStats);

      const result = await controller.getEstatisticas();

      expect(service.getEstatisticas).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('findByCodigo', () => {
    it('should return form by code', async () => {
      mockFormulariosService.findByCodigo.mockResolvedValue(mockFormulario);

      const result = await controller.findByCodigo('FORM001');

      expect(service.findByCodigo).toHaveBeenCalledWith('FORM001');
      expect(result).toEqual(mockFormulario);
    });

    it('should handle not found form', async () => {
      mockFormulariosService.findByCodigo.mockRejectedValue(
        new NotFoundException('Formulário com código FORM001 não encontrado'),
      );

      await expect(controller.findByCodigo('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return form by id', async () => {
      mockFormulariosService.findOne.mockResolvedValue(mockFormulario);

      const result = await controller.findOne('formulario-uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('formulario-uuid-1');
      expect(result).toEqual(mockFormulario);
    });

    it('should handle not found form', async () => {
      mockFormulariosService.findOne.mockRejectedValue(
        new NotFoundException(
          'Formulário com ID formulario-uuid-1 não encontrado',
        ),
      );

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateFormularioDto: UpdateFormularioDto = {
      nomeFormulario: 'Formulário Atualizado',
      descricao: 'Descrição atualizada',
    };

    it('should update a form', async () => {
      const updatedFormulario = { ...mockFormulario, ...updateFormularioDto };
      mockFormulariosService.update.mockResolvedValue(updatedFormulario);

      const result = await controller.update(
        'formulario-uuid-1',
        updateFormularioDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        'formulario-uuid-1',
        updateFormularioDto,
      );
      expect(result).toEqual(updatedFormulario);
    });

    it('should handle not found form for update', async () => {
      mockFormulariosService.update.mockRejectedValue(
        new NotFoundException('Formulário não encontrado'),
      );

      await expect(
        controller.update('nonexistent-id', updateFormularioDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle form status', async () => {
      const toggledFormulario = { ...mockFormulario, ativo: false };
      mockFormulariosService.toggleStatus.mockResolvedValue(toggledFormulario);

      const result = await controller.toggleStatus('formulario-uuid-1');

      expect(service.toggleStatus).toHaveBeenCalledWith('formulario-uuid-1');
      expect(result).toEqual(toggledFormulario);
    });
  });

  describe('updateStatus', () => {
    it('should update form status', async () => {
      const updatedFormulario = {
        ...mockFormulario,
        status: StatusFormulario.PUBLICADO,
      };
      mockFormulariosService.updateStatus.mockResolvedValue(updatedFormulario);

      const result = await controller.updateStatus(
        'formulario-uuid-1',
        StatusFormulario.PUBLICADO,
      );

      expect(service.updateStatus).toHaveBeenCalledWith(
        'formulario-uuid-1',
        StatusFormulario.PUBLICADO,
      );
      expect(result).toEqual(updatedFormulario);
    });
  });

  describe('publicar', () => {
    it('should publish a form', async () => {
      const publishedFormulario = {
        ...mockFormulario,
        status: StatusFormulario.PUBLICADO,
        ativo: true,
      };
      mockFormulariosService.publicar.mockResolvedValue(publishedFormulario);

      const result = await controller.publicar('formulario-uuid-1');

      expect(service.publicar).toHaveBeenCalledWith('formulario-uuid-1');
      expect(result).toEqual(publishedFormulario);
    });

    it('should handle publish validation errors', async () => {
      mockFormulariosService.publicar.mockRejectedValue(
        new BadRequestException(
          'Não é possível publicar formulário sem campos',
        ),
      );

      await expect(controller.publicar('formulario-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('criarVersao', () => {
    it('should create a new version of a form', async () => {
      const novaVersao = {
        ...mockFormulario,
        id: 'new-form-uuid',
        codigoFormulario: 'FORM001_V2',
        versao: 2,
        status: StatusFormulario.RASCUNHO,
        formularioPaiId: 'formulario-uuid-1',
      };
      mockFormulariosService.criarVersao.mockResolvedValue(novaVersao);

      const result = await controller.criarVersao('formulario-uuid-1');

      expect(service.criarVersao).toHaveBeenCalledWith('formulario-uuid-1');
      expect(result).toEqual(novaVersao);
    });
  });

  describe('validarFormulario', () => {
    it('should validate a form', async () => {
      const validationResult = {
        valido: true,
        erros: [],
      };
      mockFormulariosService.validarFormulario.mockResolvedValue(
        validationResult,
      );

      const result = await controller.validarFormulario('formulario-uuid-1');

      expect(service.validarFormulario).toHaveBeenCalledWith(
        'formulario-uuid-1',
      );
      expect(result).toEqual(validationResult);
    });

    it('should return validation errors', async () => {
      const validationResult = {
        valido: false,
        erros: ['Formulário deve ter pelo menos um campo'],
      };
      mockFormulariosService.validarFormulario.mockResolvedValue(
        validationResult,
      );

      const result = await controller.validarFormulario('formulario-uuid-1');

      expect(result).toEqual(validationResult);
      expect(result.valido).toBe(false);
      expect(result.erros).toContain('Formulário deve ter pelo menos um campo');
    });
  });

  describe('remove', () => {
    it('should remove a form', async () => {
      mockFormulariosService.remove.mockResolvedValue(undefined);

      await controller.remove('formulario-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('formulario-uuid-1');
    });

    it('should handle removal validation errors', async () => {
      mockFormulariosService.remove.mockRejectedValue(
        new BadRequestException('Não é possível excluir formulário publicado'),
      );

      await expect(controller.remove('formulario-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle not found form for removal', async () => {
      mockFormulariosService.remove.mockRejectedValue(
        new NotFoundException('Formulário não encontrado'),
      );

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
