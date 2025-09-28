import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AlternativaCampoService } from './alternativa-campo.service';
import {
  AlternativaCampo,
  StatusAlternativa,
} from './entities/alternativa-campo.entity';
import { CreateAlternativaCampoDto } from './dto/create-alternativa-campo.dto';
import { UpdateAlternativaCampoDto } from './dto/update-alternativa-campo.dto';

describe('AlternativaCampoService', () => {
  let service: AlternativaCampoService;

  const mockAlternativa: AlternativaCampo = {
    id: 'alternativa-uuid-1',
    campoFormularioId: 'campo-uuid-1',
    codigoAlternativa: 'ALT001',
    textoAlternativa: 'Masculino',
    valor: 'M',
    descricao: 'Opção masculino',
    ordem: 1,
    icone: 'fas fa-male',
    cor: '#007bff',
    imagemUrl: null,
    estilosCss: null,
    selecionadoPadrao: false,
    permiteTextoAdicional: false,
    placeholderTextoAdicional: null,
    exclusiva: false,
    pontuacao: 10,
    peso: 1.0,
    acoesAoSelecionar: null,
    camposMostrar: null,
    camposOcultar: null,
    camposObrigatorios: null,
    proximaPerguntaId: null,
    validacoesCustomizadas: null,
    mensagemValidacao: null,
    codigoExterno: null,
    mapeamentoIntegracao: null,
    categoria: 'sexo',
    tags: ['demografico'],
    status: StatusAlternativa.ATIVA,
    ativo: true,
    visivelImpressao: true,
    visivelPortal: true,
    metadados: null,
    observacoes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-uuid-1',
    updatedBy: null,
    campoFormulario: null,
  } as AlternativaCampo;

  const mockQueryBuilder = {
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
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlternativaCampoService,
        {
          provide: getRepositoryToken(AlternativaCampo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AlternativaCampoService>(AlternativaCampoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateAlternativaCampoDto = {
      campoFormularioId: 'campo-uuid-1',
      codigoAlternativa: 'ALT001',
      valor: 'M',
      textoAlternativa: 'Masculino',
      ordem: 1,
      pontuacao: 10,
    };

    it('deve criar uma alternativa com sucesso', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(null) // verificação valor
        .mockResolvedValueOnce(null); // busca última alternativa
      mockRepository.create.mockReturnValue(mockAlternativa);
      mockRepository.save.mockResolvedValue(mockAlternativa);

      const result = await service.create(createDto);

      expect(result).toEqual(mockAlternativa);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAlternativa);
    });

    it('deve retornar erro quando código já existir no campo', async () => {
      mockRepository.findOne.mockResolvedValue(mockAlternativa);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          codigoAlternativa: createDto.codigoAlternativa,
          campoFormularioId: createDto.campoFormularioId,
        },
      });
    });

    it('deve retornar erro quando valor já existir no campo', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(mockAlternativa); // verificação valor

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          valor: createDto.valor,
          campoFormularioId: createDto.campoFormularioId,
        },
      });
    });

    it('deve gerar ordem automaticamente quando não fornecida', async () => {
      const createDtoSemOrdem = {
        ...createDto,
        ordem: undefined,
      };
      const ultimaAlternativa = {
        ...mockAlternativa,
        ordem: 5,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(null) // verificação valor
        .mockResolvedValueOnce(ultimaAlternativa); // busca última alternativa
      mockRepository.create.mockReturnValue(mockAlternativa);
      mockRepository.save.mockResolvedValue(mockAlternativa);

      await service.create(createDtoSemOrdem);

      expect(createDtoSemOrdem.ordem).toBe(6);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { campoFormularioId: createDto.campoFormularioId },
        order: { ordem: 'DESC' },
      });
    });

    it('deve definir ordem como 1 quando não há alternativas existentes', async () => {
      const createDtoSemOrdem = {
        ...createDto,
        ordem: undefined,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(null) // verificação valor
        .mockResolvedValueOnce(null); // busca última alternativa
      mockRepository.create.mockReturnValue(mockAlternativa);
      mockRepository.save.mockResolvedValue(mockAlternativa);

      await service.create(createDtoSemOrdem);

      expect(createDtoSemOrdem.ordem).toBe(1);
    });
  });

  describe('findByCampo', () => {
    it('deve retornar alternativas ordenadas por ordem', async () => {
      const alternativas = [mockAlternativa];
      mockRepository.find.mockResolvedValue(alternativas);

      const result = await service.findByCampo('campo-uuid-1');

      expect(result).toEqual(alternativas);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1' },
        order: { ordem: 'ASC' },
      });
    });

    it('deve retornar array vazio quando não há alternativas', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByCampo('campo-uuid-1');

      expect(result).toEqual([]);
    });
  });

  describe('findAtivas', () => {
    it('deve retornar apenas alternativas ativas', async () => {
      const alternativasAtivas = [mockAlternativa];
      mockRepository.find.mockResolvedValue(alternativasAtivas);

      const result = await service.findAtivas('campo-uuid-1');

      expect(result).toEqual(alternativasAtivas);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1', ativo: true },
        order: { ordem: 'ASC' },
      });
    });
  });

  describe('findPadrao', () => {
    it('deve retornar alternativas padrão', async () => {
      const alternativasPadrao = [
        { ...mockAlternativa, selecionadoPadrao: true },
      ];
      mockRepository.find.mockResolvedValue(alternativasPadrao);

      const result = await service.findPadrao('campo-uuid-1');

      expect(result).toEqual(alternativasPadrao);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1', selecionadoPadrao: true },
        order: { ordem: 'ASC' },
      });
    });
  });

  describe('findByValor', () => {
    it('deve retornar alternativa por valor', async () => {
      mockRepository.findOne.mockResolvedValue(mockAlternativa);

      const result = await service.findByValor('campo-uuid-1', 'M');

      expect(result).toEqual(mockAlternativa);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1', valor: 'M' },
      });
    });

    it('deve retornar erro quando valor não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByValor('campo-uuid-1', 'X')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar alternativa por código', async () => {
      mockRepository.findOne.mockResolvedValue(mockAlternativa);

      const result = await service.findByCodigo('campo-uuid-1', 'ALT001');

      expect(result).toEqual(mockAlternativa);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          campoFormularioId: 'campo-uuid-1',
          codigoAlternativa: 'ALT001',
        },
      });
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findByCodigo('campo-uuid-1', 'ALT999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('deve buscar alternativas por termo', async () => {
      const alternativas = [mockAlternativa];
      mockQueryBuilder.getMany.mockResolvedValue(alternativas);

      const result = await service.search('campo-uuid-1', 'Masculino');

      expect(result).toEqual(alternativas);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'alternativa',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'alternativa.campo_formulario_id = :campoFormularioId',
        { campoFormularioId: 'campo-uuid-1' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(alternativa.rotulo ILIKE :termo OR alternativa.valor ILIKE :termo OR alternativa.codigo_alternativa ILIKE :termo)',
        { termo: '%Masculino%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'alternativa.ordem',
        'ASC',
      );
    });

    it('deve retornar array vazio quando não encontrar resultados', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('campo-uuid-1', 'inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar alternativa por ID com relações', async () => {
      mockRepository.findOne.mockResolvedValue(mockAlternativa);

      const result = await service.findOne('alternativa-uuid-1');

      expect(result).toEqual(mockAlternativa);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'alternativa-uuid-1' },
        relations: ['campoFormulario'],
      });
    });

    it('deve retornar erro quando alternativa não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateAlternativaCampoDto = {
      textoAlternativa: 'Masculino Atualizado',
      pontuacao: 15,
    };

    it('deve atualizar alternativa com sucesso', async () => {
      const alternativaAtualizada = {
        ...mockAlternativa,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(mockAlternativa);
      mockRepository.save.mockResolvedValue(alternativaAtualizada);

      const result = await service.update('alternativa-uuid-1', updateDto);

      expect(result).toEqual(alternativaAtualizada);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
    });

    it('deve verificar duplicidade de código ao atualizar', async () => {
      const updateComNovoCodigo = {
        ...updateDto,
        codigoAlternativa: 'ALT002',
      };
      const outraAlternativa = {
        ...mockAlternativa,
        id: 'alternativa-uuid-2',
        codigoAlternativa: 'ALT002',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockAlternativa) // findOne inicial
        .mockResolvedValueOnce(outraAlternativa); // verificação duplicidade

      await expect(
        service.update('alternativa-uuid-1', updateComNovoCodigo),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve verificar duplicidade de valor ao atualizar', async () => {
      const updateComNovoValor = {
        ...updateDto,
        valor: 'F',
      };
      const outraAlternativa = {
        ...mockAlternativa,
        id: 'alternativa-uuid-2',
        valor: 'F',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockAlternativa) // findOne inicial
        .mockResolvedValueOnce(outraAlternativa); // verificação valor

      await expect(
        service.update('alternativa-uuid-1', updateComNovoValor),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve permitir atualizar com mesmo código e valor atual', async () => {
      const updateMesmosDados = {
        ...updateDto,
        codigoAlternativa: 'ALT001', // mesmo código atual
        valor: 'M', // mesmo valor atual
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockAlternativa);
      mockRepository.save.mockResolvedValue(mockAlternativa);

      await service.update('alternativa-uuid-1', updateMesmosDados);

      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('reordenar', () => {
    it('deve reordenar alternativas com sucesso', async () => {
      const ordens = [
        { id: 'alternativa-uuid-1', ordem: 2 },
        { id: 'alternativa-uuid-2', ordem: 1 },
      ];
      const alternativas = [
        mockAlternativa,
        { ...mockAlternativa, id: 'alternativa-uuid-2' },
      ];

      jest.spyOn(service, 'findByCampo').mockResolvedValue(alternativas);
      mockRepository.save.mockResolvedValue(mockAlternativa);

      await service.reordenar('campo-uuid-1', ordens);

      expect(mockRepository.save).toHaveBeenCalledTimes(2);
      expect(alternativas[0].ordem).toBe(2);
      expect(alternativas[1].ordem).toBe(1);
    });

    it('deve ignorar IDs não encontrados', async () => {
      const ordens = [
        { id: 'alternativa-uuid-1', ordem: 2 },
        { id: 'alternativa-inexistente', ordem: 3 },
      ];
      const alternativas = [mockAlternativa];

      jest.spyOn(service, 'findByCampo').mockResolvedValue(alternativas);
      mockRepository.save.mockResolvedValue(mockAlternativa);

      await service.reordenar('campo-uuid-1', ordens);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('duplicar', () => {
    it('deve duplicar alternativa com novo código fornecido', async () => {
      // Clear any previous mocks
      jest.clearAllMocks();

      const novoCodigo = 'ALT001_COPY';

      // Create fresh objects for this test
      const originalAlternativa = {
        id: 'alternativa-uuid-1',
        campoFormularioId: 'campo-uuid-1',
        codigoAlternativa: 'ALT001',
        textoAlternativa: 'Masculino',
        valor: 'M',
        ordem: 1,
        selecionadoPadrao: false,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const ultimaAlternativa = { ...originalAlternativa, ordem: 5 };
      const novaAlternativa = {
        ...originalAlternativa,
        id: undefined,
        codigoAlternativa: novoCodigo,
        textoAlternativa: 'Masculino (Cópia)',
        valor: 'M_COPY',
        ordem: 6,
        selecionadoPadrao: false,
        createdAt: undefined,
        updatedAt: undefined,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(originalAlternativa) // findOne original
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(ultimaAlternativa); // busca última alternativa
      mockRepository.create.mockReturnValue(novaAlternativa);
      mockRepository.save.mockResolvedValue(novaAlternativa);

      const result = await service.duplicar('alternativa-uuid-1', novoCodigo);

      expect(result).toEqual(novaAlternativa);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: undefined,
          codigoAlternativa: novoCodigo,
          textoAlternativa: 'Masculino (Cópia)',
          valor: 'M_COPY',
          ordem: 6,
          selecionadoPadrao: false,
          createdAt: undefined,
          updatedAt: undefined,
        }),
      );
    });

    it('deve usar código padrão quando não fornecido', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(mockAlternativa) // findOne original
        .mockResolvedValueOnce(null) // verificação código
        .mockResolvedValueOnce(null); // busca última alternativa
      mockRepository.create.mockReturnValue(mockAlternativa);
      mockRepository.save.mockResolvedValue(mockAlternativa);

      await service.duplicar('alternativa-uuid-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          codigoAlternativa: 'ALT001_COPY',
          campoFormularioId: 'campo-uuid-1',
        },
      });
    });

    it('deve retornar erro quando código já existir', async () => {
      const novoCodigo = 'ALT002';
      const alternativaExistente = {
        ...mockAlternativa,
        codigoAlternativa: novoCodigo,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockAlternativa) // findOne original
        .mockResolvedValueOnce(alternativaExistente); // verificação código

      await expect(
        service.duplicar('alternativa-uuid-1', novoCodigo),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status ativo/inativo', async () => {
      const alternativaInativa = { ...mockAlternativa, ativo: false };
      const alternativaAtivada = { ...mockAlternativa, ativo: true };

      mockRepository.findOne.mockResolvedValue(alternativaInativa);
      mockRepository.save.mockResolvedValue(alternativaAtivada);

      const result = await service.toggleStatus('alternativa-uuid-1');

      expect(result).toEqual(alternativaAtivada);
      expect(result.ativo).toBe(true);
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status da alternativa', async () => {
      const alternativaAtualizada = {
        ...mockAlternativa,
        status: StatusAlternativa.INATIVA,
      };

      mockRepository.findOne.mockResolvedValue(mockAlternativa);
      mockRepository.save.mockResolvedValue(alternativaAtualizada);

      const result = await service.updateStatus(
        'alternativa-uuid-1',
        StatusAlternativa.INATIVA,
      );

      expect(result).toEqual(alternativaAtualizada);
      expect(result.status).toBe(StatusAlternativa.INATIVA);
    });
  });

  describe('definirPadrao', () => {
    it('deve definir alternativa como padrão e remover outras', async () => {
      mockRepository.findOne.mockResolvedValue(mockAlternativa);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.save.mockResolvedValue({
        ...mockAlternativa,
        selecionadoPadrao: true,
      });

      const result = await service.definirPadrao('alternativa-uuid-1');

      expect(mockRepository.update).toHaveBeenCalledWith(
        { campoFormularioId: 'campo-uuid-1' },
        { selecionadoPadrao: false },
      );
      expect(result.selecionadoPadrao).toBe(true);
    });
  });

  describe('removerPadrao', () => {
    it('deve remover padrão de todas alternativas do campo', async () => {
      mockRepository.update.mockResolvedValue({ affected: 2 });

      await service.removerPadrao('campo-uuid-1');

      expect(mockRepository.update).toHaveBeenCalledWith(
        { campoFormularioId: 'campo-uuid-1' },
        { selecionadoPadrao: false },
      );
    });
  });

  describe('importarAlternativas', () => {
    const alternativasParaImportar = [
      {
        codigo: 'ALT002',
        valor: 'F',
        rotulo: 'Feminino',
        descricao: 'Opção feminino',
        score: 20,
      },
      {
        codigo: 'ALT003',
        valor: 'O',
        rotulo: 'Outro',
        descricao: 'Outras opções',
        score: 15,
      },
    ];

    it('deve importar novas alternativas com sucesso', async () => {
      const alternativasExistentes = [mockAlternativa];
      const novasAlternativas = [
        {
          ...mockAlternativa,
          id: 'alternativa-uuid-2',
          codigoAlternativa: 'ALT002',
          valor: 'F',
          textoAlternativa: 'Feminino',
          ordem: 2,
        },
        {
          ...mockAlternativa,
          id: 'alternativa-uuid-3',
          codigoAlternativa: 'ALT003',
          valor: 'O',
          textoAlternativa: 'Outro',
          ordem: 3,
        },
      ];

      jest
        .spyOn(service, 'findByCampo')
        .mockResolvedValue(alternativasExistentes);
      mockRepository.create
        .mockReturnValueOnce(novasAlternativas[0])
        .mockReturnValueOnce(novasAlternativas[1]);
      mockRepository.save
        .mockResolvedValueOnce(novasAlternativas[0])
        .mockResolvedValueOnce(novasAlternativas[1]);

      const result = await service.importarAlternativas(
        'campo-uuid-1',
        alternativasParaImportar,
      );

      expect(result).toHaveLength(2);
      expect(mockRepository.save).toHaveBeenCalledTimes(2);
    });

    it('deve ignorar alternativas com código ou valor duplicado', async () => {
      const alternativasExistentes = [mockAlternativa];
      const alternativasDuplicadas = [
        {
          codigo: 'ALT001', // código já existe
          valor: 'N',
          rotulo: 'Novo',
        },
        {
          codigo: 'ALT004',
          valor: 'M', // valor já existe
          rotulo: 'Masculino 2',
        },
      ];

      jest
        .spyOn(service, 'findByCampo')
        .mockResolvedValue(alternativasExistentes);

      const result = await service.importarAlternativas(
        'campo-uuid-1',
        alternativasDuplicadas,
      );

      expect(result).toHaveLength(0);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('deve calcular ordem corretamente quando já existem alternativas', async () => {
      const alternativasExistentes = [
        {
          ...mockAlternativa,
          ordem: 3,
          codigoAlternativa: 'ALT003',
          valor: 'V3',
        },
        {
          ...mockAlternativa,
          ordem: 1,
          codigoAlternativa: 'ALT001',
          valor: 'V1',
        },
        {
          ...mockAlternativa,
          ordem: 2,
          codigoAlternativa: 'ALT002',
          valor: 'V2',
        },
      ];

      const novaAlternativa = {
        ...mockAlternativa,
        id: 'nova-alternativa-uuid',
        codigoAlternativa: 'ALT004', // código único
        valor: 'F',
        textoAlternativa: 'Feminino',
        ordem: 4,
      };

      // Mock do findByCampo que é chamado internamente
      jest
        .spyOn(service, 'findByCampo')
        .mockResolvedValue(alternativasExistentes);
      mockRepository.create.mockReturnValue(novaAlternativa);
      mockRepository.save.mockResolvedValue(novaAlternativa);

      const result = await service.importarAlternativas('campo-uuid-1', [
        {
          codigo: 'ALT004', // código único
          valor: 'F',
          rotulo: 'Feminino',
        },
      ]);

      expect(result).toHaveLength(1);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ordem: 4, // máximo + 1
        }),
      );
    });
  });

  describe('remove', () => {
    it('deve remover alternativa com sucesso', async () => {
      mockRepository.findOne.mockResolvedValue(mockAlternativa);
      mockRepository.remove.mockResolvedValue(mockAlternativa);

      await service.remove('alternativa-uuid-1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockAlternativa);
    });

    it('deve retornar erro quando alternativa não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas completas', async () => {
      const mockPorStatus = [
        { status: StatusAlternativa.ATIVA, total: '3' },
        { status: StatusAlternativa.INATIVA, total: '1' },
      ];

      mockRepository.count
        .mockResolvedValueOnce(4) // total
        .mockResolvedValueOnce(3) // ativas
        .mockResolvedValueOnce(1) // inativas
        .mockResolvedValueOnce(1); // padrão

      mockQueryBuilder.getRawMany.mockResolvedValue(mockPorStatus);

      const result = await service.getEstatisticas('campo-uuid-1');

      expect(result).toEqual({
        total: 4,
        ativas: 3,
        inativas: 1,
        padrao: 1,
        porStatus: mockPorStatus,
      });
    });

    it('deve usar filtros corretos nas consultas', async () => {
      mockRepository.count.mockResolvedValue(0);
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      await service.getEstatisticas('campo-uuid-1');

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1' },
      });
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1', ativo: true },
      });
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1', ativo: false },
      });
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { campoFormularioId: 'campo-uuid-1', selecionadoPadrao: true },
      });
    });
  });
});
