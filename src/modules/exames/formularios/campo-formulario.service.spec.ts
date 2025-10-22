import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CampoFormularioService } from './campo-formulario.service';
import {
  CampoFormulario,
  TipoCampo,
  StatusCampo,
} from './entities/campo-formulario.entity';
import { CreateCampoFormularioDto } from './dto/create-campo-formulario.dto';
import { UpdateCampoFormularioDto } from './dto/update-campo-formulario.dto';

describe('CampoFormularioService', () => {
  let service: CampoFormularioService;

  const mockCampo: CampoFormulario = {
    id: 'campo-uuid-1',
    formularioId: 'formulario-uuid-1',
    tipoCampoPadrao: 'customizado' as any,
    codigoCampo: 'CAMPO001',
    nomeCampo: 'Nome do Paciente',
    descricao: 'Campo para nome completo',
    placeholder: 'Digite o nome completo',
    textoAjuda: 'Insira o nome sem abreviações',
    tipoCampo: TipoCampo.TEXTO,
    ordem: 1,
    obrigatorio: true,
    somenteLeitura: false,
    tamanhoMinimo: 3,
    tamanhoMaximo: 100,
    valorMinimo: null,
    valorMaximo: null,
    mascara: null,
    regex: '^[a-zA-Z\\s]+$',
    mensagemErro: 'Nome deve conter apenas letras',
    valorPadrao: null,
    opcoesSelecao: null,
    permiteMultiplaSelecao: false,
    permiteOutro: false,
    tiposArquivoAceitos: null,
    tamanhoMaximoArquivoMb: null,
    permiteMultiplosArquivos: false,
    maxArquivos: null,
    larguraColuna: 12,
    alinhamento: 'left',
    estilosCss: null,
    classesCss: ['form-control'],
    icone: 'fas fa-user',
    condicoesVisibilidade: null,
    condicoesObrigatoriedade: null,
    condicoesValidacao: null,
    formulaCalculo: null,
    camposDependentes: null,
    dependeDe: null,
    campoIntegracao: 'patient_name',
    urlBuscaDados: null,
    mapeamentoDados: null,
    unidadeMedida: null,
    valoresReferencia: null,
    status: StatusCampo.ATIVO,
    ativo: true,
    visivelImpressao: true,
    visivelPortal: true,
    alternativas: [],
    metadados: null,
    configuracoesExtras: null,
    observacoes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-uuid-1',
    updatedBy: null,
    formulario: null,
  } as CampoFormulario;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampoFormularioService,
        {
          provide: getRepositoryToken(CampoFormulario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CampoFormularioService>(CampoFormularioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore the standard mocks after each test
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockRepository.findOne.mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateCampoFormularioDto = {
      formularioId: 'formulario-uuid-1',
      codigoCampo: 'CAMPO001',
      nomeCampo: 'Nome do Paciente',
      tipoCampo: TipoCampo.TEXTO,
      obrigatorio: true,
      ordem: 1,
    };

    it('deve criar um campo com sucesso', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(null); // busca último campo
      mockRepository.create.mockReturnValue(mockCampo);
      mockRepository.save.mockResolvedValue(mockCampo);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCampo);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCampo);
    });

    it('deve retornar erro quando código já existir no formulário', async () => {
      // Clear any previous mocks and set up the specific mock for this test
      jest.clearAllMocks();

      // Create a fresh mock object for this test
      const existingCampo = {
        id: 'campo-existing-uuid',
        formularioId: 'formulario-uuid-1',
        codigoCampo: 'CAMPO001',
        nomeCampo: 'Campo Existente',
      };

      // Restore mocks properly for this test
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // Use mockImplementation to ensure the mock works correctly
      mockRepository.findOne.mockImplementation(async (options: any) => {
        // Check if this is the call to find existing by code
        if (options.where?.codigoCampo && options.where?.formularioId) {
          return existingCampo;
        }
        return null; // For other findOne calls
      });

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          codigoCampo: createDto.codigoCampo,
          formularioId: createDto.formularioId,
        },
      });
    });

    it('deve gerar ordem automaticamente quando não fornecida', async () => {
      // Clear any previous mocks
      jest.clearAllMocks();

      const createDtoSemOrdem = {
        formularioId: 'formulario-uuid-2', // usar ID diferente
        codigoCampo: 'CAMPO002',
        nomeCampo: 'Campo Teste',
        tipoCampo: TipoCampo.TEXTO,
        ordem: undefined,
      };
      const ultimoCampo = {
        ...mockCampo,
        ordem: 5,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(ultimoCampo); // busca último campo
      mockRepository.create.mockReturnValue(mockCampo);
      mockRepository.save.mockResolvedValue(mockCampo);

      await service.create(createDtoSemOrdem);

      expect(createDtoSemOrdem.ordem).toBe(6);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { formularioId: createDtoSemOrdem.formularioId },
        order: { ordem: 'DESC' },
      });
    });

    it('deve definir ordem como 1 quando não há campos existentes', async () => {
      // Clear any previous mocks
      jest.clearAllMocks();

      const createDtoSemOrdem = {
        ...createDto,
        codigoCampo: 'CAMPO003', // usar código diferente
        ordem: undefined,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(null); // busca último campo
      mockRepository.create.mockReturnValue(mockCampo);
      mockRepository.save.mockResolvedValue(mockCampo);

      await service.create(createDtoSemOrdem);

      expect(createDtoSemOrdem.ordem).toBe(1);
    });

    it('deve criar campo com configurações completas', async () => {
      const createCompleto: CreateCampoFormularioDto = {
        ...createDto,
        descricao: 'Campo para nome completo',
        placeholder: 'Digite o nome',
        textoAjuda: 'Insira sem abreviações',
        tamanhoMinimo: 3,
        tamanhoMaximo: 100,
        regex: '^[a-zA-Z\\s]+$',
        mensagemErro: 'Nome inválido',
        larguraColuna: 6,
        icone: 'fas fa-user',
        obrigatorio: true,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockRepository.create.mockReturnValue(mockCampo);
      mockRepository.save.mockResolvedValue(mockCampo);

      const result = await service.create(createCompleto);

      expect(result).toEqual(mockCampo);
      expect(mockRepository.create).toHaveBeenCalledWith(createCompleto);
    });
  });

  describe('findByFormulario', () => {
    it('deve retornar campos ordenados por ordem com alternativas', async () => {
      const campos = [mockCampo];
      mockRepository.find.mockResolvedValue(campos);

      const result = await service.findByFormulario('formulario-uuid-1');

      expect(result).toEqual(campos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1' },
        relations: ['alternativas'],
        order: { ordem: 'ASC' },
      });
    });

    it('deve retornar array vazio quando não há campos', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByFormulario('formulario-uuid-1');

      expect(result).toEqual([]);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas campos ativos', async () => {
      const camposAtivos = [mockCampo];
      mockRepository.find.mockResolvedValue(camposAtivos);

      const result = await service.findAtivos('formulario-uuid-1');

      expect(result).toEqual(camposAtivos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1', ativo: true },
        relations: ['alternativas'],
        order: { ordem: 'ASC' },
      });
    });
  });

  describe('findByTipo', () => {
    it('deve retornar campos por tipo', async () => {
      const camposTexto = [mockCampo];
      mockRepository.find.mockResolvedValue(camposTexto);

      const result = await service.findByTipo(
        'formulario-uuid-1',
        TipoCampo.TEXTO,
      );

      expect(result).toEqual(camposTexto);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          formularioId: 'formulario-uuid-1',
          tipoCampo: TipoCampo.TEXTO,
        },
        relations: ['alternativas'],
        order: { ordem: 'ASC' },
      });
    });

    it('deve funcionar com diferentes tipos de campo', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findByTipo('formulario-uuid-1', TipoCampo.SELECT);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          formularioId: 'formulario-uuid-1',
          tipoCampo: TipoCampo.SELECT,
        },
        relations: ['alternativas'],
        order: { ordem: 'ASC' },
      });
    });
  });

  describe('findObrigatorios', () => {
    it('deve retornar apenas campos obrigatórios', async () => {
      const camposObrigatorios = [mockCampo];
      mockRepository.find.mockResolvedValue(camposObrigatorios);

      const result = await service.findObrigatorios('formulario-uuid-1');

      expect(result).toEqual(camposObrigatorios);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1', obrigatorio: true },
        relations: ['alternativas'],
        order: { ordem: 'ASC' },
      });
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar campo por código', async () => {
      // Clear any previous mocks
      jest.clearAllMocks();

      // Create a fresh mock object for this test
      const campoFound = {
        ...mockCampo,
        formularioId: 'formulario-uuid-1',
        codigoCampo: 'CAMPO001',
      };

      // Restore mocks properly for this test
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // Use mockImplementation to ensure the mock works correctly
      mockRepository.findOne.mockImplementation(async (options: any) => {
        // Check if this is the findByCodigo call
        if (
          options.where?.formularioId &&
          options.where?.codigoCampo &&
          options.relations
        ) {
          return campoFound;
        }
        return null;
      });

      const result = await service.findByCodigo(
        'formulario-uuid-1',
        'CAMPO001',
      );

      expect(result).toEqual(campoFound);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1', codigoCampo: 'CAMPO001' },
        relations: ['alternativas'],
      });
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findByCodigo('formulario-uuid-1', 'CAMPO999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('deve buscar campos por termo', async () => {
      const campos = [mockCampo];
      mockQueryBuilder.getMany.mockResolvedValue(campos);

      const result = await service.search('formulario-uuid-1', 'Nome');

      expect(result).toEqual(campos);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('campo');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'campo.alternativas',
        'alternativas',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'campo.formulario_id = :formularioId',
        { formularioId: 'formulario-uuid-1' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(campo.nome_campo ILIKE :termo OR campo.descricao ILIKE :termo OR campo.codigo_campo ILIKE :termo)',
        { termo: '%Nome%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'campo.ordem',
        'ASC',
      );
    });

    it('deve retornar array vazio quando não encontrar resultados', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('formulario-uuid-1', 'inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar campo por ID com relações', async () => {
      // Clear any previous mocks
      jest.clearAllMocks();
      mockRepository.findOne.mockResolvedValue(mockCampo);

      const result = await service.findOne('campo-uuid-1');

      expect(result).toEqual(mockCampo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'campo-uuid-1' },
        relations: ['alternativas', 'formulario'],
      });
    });

    it('deve retornar erro quando campo não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateCampoFormularioDto = {
      nomeCampo: 'Nome Completo do Paciente',
      descricao: 'Campo atualizado',
      tamanhoMaximo: 150,
    };

    it('deve atualizar campo com sucesso', async () => {
      const campoAtualizado = {
        ...mockCampo,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(mockCampo);
      mockRepository.save.mockResolvedValue(campoAtualizado);

      const result = await service.update('campo-uuid-1', updateDto);

      expect(result).toEqual(campoAtualizado);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
    });

    it('deve verificar duplicidade de código ao atualizar', async () => {
      const updateComNovoCodigo = {
        ...updateDto,
        codigoCampo: 'CAMPO002',
      };
      const outroCampo = {
        ...mockCampo,
        id: 'campo-uuid-2',
        codigoCampo: 'CAMPO002',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockCampo) // findOne inicial
        .mockResolvedValueOnce(outroCampo); // verificação duplicidade

      await expect(
        service.update('campo-uuid-1', updateComNovoCodigo),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve permitir atualizar com mesmo código atual', async () => {
      const updateMesmoCodigo = {
        ...updateDto,
        codigoCampo: 'CAMPO001',
      };

      mockRepository.findOne.mockResolvedValue(mockCampo);
      mockRepository.save.mockResolvedValue(mockCampo);

      await service.update('campo-uuid-1', updateMesmoCodigo);

      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve atualizar campos específicos', async () => {
      const updateEspecifico = {
        tipoCampo: TipoCampo.EMAIL,
        obrigatorio: false,
        regex: '^[^@]+@[^@]+\\.[^@]+$',
        mensagemErro: 'Email inválido',
      };

      mockRepository.findOne.mockResolvedValue(mockCampo);
      mockRepository.save.mockResolvedValue({
        ...mockCampo,
        ...updateEspecifico,
      });

      const result = await service.update('campo-uuid-1', updateEspecifico);

      expect(result.tipoCampo).toBe(TipoCampo.EMAIL);
      expect(result.obrigatorio).toBe(false);
    });
  });

  describe('reordenar', () => {
    it('deve reordenar campos com sucesso', async () => {
      const ordens = [
        { id: 'campo-uuid-1', ordem: 2 },
        { id: 'campo-uuid-2', ordem: 1 },
      ];
      const campos = [
        mockCampo,
        { ...mockCampo, id: 'campo-uuid-2', ordem: 1 },
      ];

      jest.spyOn(service, 'findByFormulario').mockResolvedValue(campos);
      mockRepository.save.mockResolvedValue(mockCampo);

      await service.reordenar('formulario-uuid-1', ordens);

      expect(mockRepository.save).toHaveBeenCalledTimes(2);
      expect(campos[0].ordem).toBe(2);
      expect(campos[1].ordem).toBe(1);
    });

    it('deve ignorar IDs não encontrados', async () => {
      const ordens = [
        { id: 'campo-uuid-1', ordem: 2 },
        { id: 'campo-inexistente', ordem: 3 },
      ];
      const campos = [mockCampo];

      jest.spyOn(service, 'findByFormulario').mockResolvedValue(campos);
      mockRepository.save.mockResolvedValue(mockCampo);

      await service.reordenar('formulario-uuid-1', ordens);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('duplicar', () => {
    it('deve duplicar campo com novo código fornecido', async () => {
      // Clear any previous mocks
      jest.clearAllMocks();

      const novoCodigo = 'CAMPO001_COPY';

      // Create fresh objects for this test
      const originalCampo = {
        id: 'campo-uuid-1',
        formularioId: 'formulario-uuid-1',
        codigoCampo: 'CAMPO001',
        nomeCampo: 'Nome do Paciente',
        descricao: 'Campo para nome completo',
        tipoCampo: TipoCampo.TEXTO,
        ordem: 1,
        ativo: true,
        obrigatorio: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const ultimoCampo = { ...originalCampo, ordem: 5 };
      const novoCampo = {
        ...originalCampo,
        id: undefined,
        codigoCampo: novoCodigo,
        nomeCampo: 'Nome do Paciente (Cópia)',
        ordem: 6,
        createdAt: undefined,
        updatedAt: undefined,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(originalCampo) // findOne original
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(ultimoCampo); // busca último campo
      mockRepository.create.mockReturnValue(novoCampo);
      mockRepository.save.mockResolvedValue(novoCampo);

      const result = await service.duplicar('campo-uuid-1', novoCodigo);

      expect(result).toEqual(novoCampo);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: undefined,
          codigoCampo: novoCodigo,
          nomeCampo: 'Nome do Paciente (Cópia)',
          ordem: 6,
          createdAt: undefined,
          updatedAt: undefined,
        }),
      );
    });

    it('deve usar código padrão quando não fornecido', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(mockCampo) // findOne original
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(null); // busca último campo
      mockRepository.create.mockReturnValue(mockCampo);
      mockRepository.save.mockResolvedValue(mockCampo);

      await service.duplicar('campo-uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          codigoCampo: 'CAMPO001_COPY',
          formularioId: 'formulario-uuid-1',
        },
      });
    });

    it('deve retornar erro quando código já existir', async () => {
      const novoCodigo = 'CAMPO002';
      const campoExistente = {
        ...mockCampo,
        codigoCampo: novoCodigo,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockCampo) // findOne original
        .mockResolvedValueOnce(campoExistente); // verificação código

      await expect(
        service.duplicar('campo-uuid-1', novoCodigo),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status ativo/inativo', async () => {
      const campoInativo = { ...mockCampo, ativo: false };
      const campoAtivado = { ...mockCampo, ativo: true };

      mockRepository.findOne.mockResolvedValue(campoInativo);
      mockRepository.save.mockResolvedValue(campoAtivado);

      const result = await service.toggleStatus('campo-uuid-1');

      expect(result).toEqual(campoAtivado);
      expect(result.ativo).toBe(true);
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status do campo', async () => {
      const campoAtualizado = {
        ...mockCampo,
        status: StatusCampo.INATIVO,
      };

      mockRepository.findOne.mockResolvedValue(mockCampo);
      mockRepository.save.mockResolvedValue(campoAtualizado);

      const result = await service.updateStatus(
        'campo-uuid-1',
        StatusCampo.INATIVO,
      );

      expect(result).toEqual(campoAtualizado);
      expect(result.status).toBe(StatusCampo.INATIVO);
    });
  });

  describe('remove', () => {
    it('deve remover campo com sucesso', async () => {
      mockRepository.findOne.mockResolvedValue(mockCampo);
      mockRepository.remove.mockResolvedValue(mockCampo);

      await service.remove('campo-uuid-1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockCampo);
    });

    it('deve retornar erro quando campo não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas completas', async () => {
      const mockPorTipo = [
        { tipo: TipoCampo.TEXTO, total: '5' },
        { tipo: TipoCampo.SELECT, total: '3' },
        { tipo: TipoCampo.CHECKBOX, total: '2' },
      ];
      const mockPorStatus = [
        { status: StatusCampo.ATIVO, total: '8' },
        { status: StatusCampo.INATIVO, total: '2' },
      ];

      mockRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8) // ativos
        .mockResolvedValueOnce(2) // inativos
        .mockResolvedValueOnce(6); // obrigatórios

      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce(mockPorTipo)
        .mockResolvedValueOnce(mockPorStatus);

      const result = await service.getEstatisticas('formulario-uuid-1');

      expect(result).toEqual({
        total: 10,
        ativos: 8,
        inativos: 2,
        obrigatorios: 6,
        porTipo: mockPorTipo,
        porStatus: mockPorStatus,
      });
    });

    it('deve usar filtros corretos nas consultas', async () => {
      mockRepository.count.mockResolvedValue(0);
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      await service.getEstatisticas('formulario-uuid-1');

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1' },
      });
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1', ativo: true },
      });
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1', ativo: false },
      });
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { formularioId: 'formulario-uuid-1', obrigatorio: true },
      });
    });
  });

  describe('validarCampo', () => {
    it('deve validar campo SELECT com alternativas', async () => {
      const campoSelect = {
        ...mockCampo,
        tipoCampo: TipoCampo.SELECT,
        alternativas: [
          { id: 'alt-1', textoAlternativa: 'Opção 1' },
          { id: 'alt-2', textoAlternativa: 'Opção 2' },
        ],
      };

      mockRepository.findOne.mockResolvedValue(campoSelect);

      const result = await service.validarCampo('campo-uuid-1');

      expect(result).toEqual({
        valido: true,
        erros: [],
      });
    });

    it('deve retornar erro para campo SELECT sem alternativas', async () => {
      const campoSelectSemAlternativas = {
        ...mockCampo,
        tipoCampo: TipoCampo.SELECT,
        alternativas: [],
      };

      mockRepository.findOne.mockResolvedValue(campoSelectSemAlternativas);

      const result = await service.validarCampo('campo-uuid-1');

      expect(result).toEqual({
        valido: false,
        erros: ['Campo de seleção deve ter pelo menos uma alternativa'],
      });
    });

    it('deve retornar erro para campo RADIO sem alternativas', async () => {
      const campoRadioSemAlternativas = {
        ...mockCampo,
        tipoCampo: TipoCampo.RADIO,
        alternativas: null,
      };

      mockRepository.findOne.mockResolvedValue(campoRadioSemAlternativas);

      const result = await service.validarCampo('campo-uuid-1');

      expect(result).toEqual({
        valido: false,
        erros: ['Campo de rádio deve ter pelo menos uma alternativa'],
      });
    });

    it('deve validar tamanhos mínimo e máximo', async () => {
      const campoTamanhoInvalido = {
        ...mockCampo,
        tamanhoMinimo: 100,
        tamanhoMaximo: 50,
      };

      mockRepository.findOne.mockResolvedValue(campoTamanhoInvalido);

      const result = await service.validarCampo('campo-uuid-1');

      expect(result).toEqual({
        valido: false,
        erros: ['Tamanho mínimo não pode ser maior que o tamanho máximo'],
      });
    });

    it('deve validar valores mínimo e máximo', async () => {
      const campoValorInvalido = {
        ...mockCampo,
        valorMinimo: 100,
        valorMaximo: 50,
      };

      mockRepository.findOne.mockResolvedValue(campoValorInvalido);

      const result = await service.validarCampo('campo-uuid-1');

      expect(result).toEqual({
        valido: false,
        erros: ['Valor mínimo não pode ser maior que o valor máximo'],
      });
    });

    it('deve retornar múltiplos erros quando aplicável', async () => {
      const campoMultiplosErros = {
        ...mockCampo,
        tipoCampo: TipoCampo.SELECT,
        alternativas: [],
        tamanhoMinimo: 100,
        tamanhoMaximo: 50,
        valorMinimo: 200,
        valorMaximo: 100,
      };

      mockRepository.findOne.mockResolvedValue(campoMultiplosErros);

      const result = await service.validarCampo('campo-uuid-1');

      expect(result.valido).toBe(false);
      expect(result.erros).toHaveLength(3);
      expect(result.erros).toContain(
        'Campo de seleção deve ter pelo menos uma alternativa',
      );
      expect(result.erros).toContain(
        'Tamanho mínimo não pode ser maior que o tamanho máximo',
      );
      expect(result.erros).toContain(
        'Valor mínimo não pode ser maior que o valor máximo',
      );
    });

    it('deve validar campos de outros tipos sem alternativas', async () => {
      const campoTexto = {
        ...mockCampo,
        tipoCampo: TipoCampo.TEXTO,
        alternativas: null,
        tamanhoMinimo: 3,
        tamanhoMaximo: 100,
        valorMinimo: null,
        valorMaximo: null,
      };

      mockRepository.findOne.mockResolvedValue(campoTexto);

      const result = await service.validarCampo('campo-uuid-1');

      expect(result).toEqual({
        valido: true,
        erros: [],
      });
    });
  });
});
