import { Test, TestingModule } from '@nestjs/testing';
import { CampoFormularioController } from './campo-formulario.controller';
import { CampoFormularioService } from './campo-formulario.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TipoCampo, StatusCampo } from './entities/campo-formulario.entity';
import { ParseUUIDPipe } from '@nestjs/common';

describe('CampoFormularioController', () => {
  let controller: CampoFormularioController;
  let service: CampoFormularioService;

  const mockCampoFormularioService = {
    create: jest.fn(),
    findByFormulario: jest.fn(),
    findAtivos: jest.fn(),
    findObrigatorios: jest.fn(),
    findByTipo: jest.fn(),
    search: jest.fn(),
    findByCodigo: jest.fn(),
    getEstatisticas: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    reordenar: jest.fn(),
    duplicar: jest.fn(),
    toggleStatus: jest.fn(),
    updateStatus: jest.fn(),
    validarCampo: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampoFormularioController],
      providers: [
        {
          provide: CampoFormularioService,
          useValue: mockCampoFormularioService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<CampoFormularioController>(
      CampoFormularioController,
    );
    service = module.get<CampoFormularioService>(CampoFormularioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deveria ter o service injetado', () => {
    expect(service).toBeDefined();
  });

  const mockFormularioId = '123e4567-e89b-12d3-a456-426614174000';
  const mockCampoId = '456e7890-e89b-12d3-a456-426614174001';

  const mockCampoFormulario = {
    id: mockCampoId,
    formularioId: mockFormularioId,
    codigoCampo: 'CAMPO001',
    nomeCampo: 'Nome Completo',
    tipoCampo: TipoCampo.TEXTO,
    rotuloCampo: 'Nome Completo do Paciente',
    descricaoCampo: 'Campo para inserir o nome completo do paciente',
    ordem: 1,
    obrigatorio: true,
    visivel: true,
    editavel: true,
    status: StatusCampo.ATIVO,
    valorPadrao: '',
    placeholderCampo: 'Digite o nome completo',
    dica: 'Insira nome e sobrenome',
    regrasValidacao: {
      minLength: 2,
      maxLength: 100,
      pattern: '^[a-zA-ZÀ-ÿ\\s]+$',
    },
    configuracaoCondicional: null,
    metadados: {
      autoComplete: 'name',
      autocapitalize: 'words',
    },
    created_at: new Date(),
    updated_at: new Date(),
    formulario: {
      id: mockFormularioId,
      nome: 'Formulário de Teste',
      descricao: 'Formulário para testes',
    },
    alternativas: [],
  };

  const createCampoDto = {
    formularioId: mockFormularioId,
    codigoCampo: 'CAMPO001',
    nomeCampo: 'Nome Completo',
    tipoCampo: TipoCampo.TEXTO,
    rotuloCampo: 'Nome Completo do Paciente',
    descricaoCampo: 'Campo para inserir o nome completo do paciente',
    ordem: 1,
    obrigatorio: true,
    valorPadrao: '',
    placeholderCampo: 'Digite o nome completo',
    dica: 'Insira nome e sobrenome',
    regrasValidacao: {
      minLength: 2,
      maxLength: 100,
      pattern: '^[a-zA-ZÀ-ÿ\\s]+$',
    },
  };

  const updateCampoDto = {
    rotuloCampo: 'Nome Completo do Cliente',
    descricaoCampo: 'Campo para inserir o nome completo do cliente',
    dica: 'Insira nome e sobrenome completos',
  };

  describe('create', () => {
    it('deveria criar um campo de formulário com sucesso', async () => {
      mockCampoFormularioService.create.mockResolvedValue(mockCampoFormulario);

      const result = await controller.create(createCampoDto);

      expect(result).toEqual(mockCampoFormulario);
      expect(service.create).toHaveBeenCalledWith(createCampoDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar erro ao criar campo com dados inválidos', async () => {
      const erro = new Error('Dados inválidos');
      mockCampoFormularioService.create.mockRejectedValue(erro);

      await expect(controller.create({} as any)).rejects.toThrow(
        'Dados inválidos',
      );
      expect(service.create).toHaveBeenCalledWith({});
    });

    it('deveria retornar erro ao criar campo com código duplicado', async () => {
      const erro = new Error('Código do campo já existe');
      mockCampoFormularioService.create.mockRejectedValue(erro);

      await expect(controller.create(createCampoDto)).rejects.toThrow(
        'Código do campo já existe',
      );
    });

    it('deveria retornar erro 409 quando campo já existe', async () => {
      const erro = new Error('Campo já existe');
      erro.name = 'ConflictException';
      mockCampoFormularioService.create.mockRejectedValue(erro);

      await expect(controller.create(createCampoDto)).rejects.toThrow(
        'Campo já existe',
      );
    });
  });

  describe('findByFormulario', () => {
    it('deveria retornar campos de um formulário', async () => {
      const mockCampos = [mockCampoFormulario];
      mockCampoFormularioService.findByFormulario.mockResolvedValue(mockCampos);

      const result = await controller.findByFormulario(mockFormularioId);

      expect(result).toEqual(mockCampos);
      expect(service.findByFormulario).toHaveBeenCalledWith(mockFormularioId);
      expect(service.findByFormulario).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar lista vazia quando formulário não tiver campos', async () => {
      mockCampoFormularioService.findByFormulario.mockResolvedValue([]);

      const result = await controller.findByFormulario(mockFormularioId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAtivos', () => {
    it('deveria retornar campos ativos de um formulário', async () => {
      const mockCamposAtivos = [
        { ...mockCampoFormulario, status: StatusCampo.ATIVO },
      ];
      mockCampoFormularioService.findAtivos.mockResolvedValue(mockCamposAtivos);

      const result = await controller.findAtivos(mockFormularioId);

      expect(result).toEqual(mockCamposAtivos);
      expect(service.findAtivos).toHaveBeenCalledWith(mockFormularioId);
      expect(result.every((campo) => campo.status === StatusCampo.ATIVO)).toBe(
        true,
      );
    });
  });

  describe('findObrigatorios', () => {
    it('deveria retornar campos obrigatórios de um formulário', async () => {
      const mockCamposObrigatorios = [
        { ...mockCampoFormulario, obrigatorio: true },
      ];
      mockCampoFormularioService.findObrigatorios.mockResolvedValue(
        mockCamposObrigatorios,
      );

      const result = await controller.findObrigatorios(mockFormularioId);

      expect(result).toEqual(mockCamposObrigatorios);
      expect(service.findObrigatorios).toHaveBeenCalledWith(mockFormularioId);
      expect(result.every((campo) => campo.obrigatorio)).toBe(true);
    });
  });

  describe('findByTipo', () => {
    it('deveria retornar campos por tipo em um formulário', async () => {
      const tipo = TipoCampo.TEXTO;
      const mockCamposPorTipo = [{ ...mockCampoFormulario, tipoCampo: tipo }];
      mockCampoFormularioService.findByTipo.mockResolvedValue(
        mockCamposPorTipo,
      );

      const result = await controller.findByTipo(mockFormularioId, tipo);

      expect(result).toEqual(mockCamposPorTipo);
      expect(service.findByTipo).toHaveBeenCalledWith(mockFormularioId, tipo);
      expect(result.every((campo) => campo.tipoCampo === tipo)).toBe(true);
    });

    it('deveria retornar campos do tipo EMAIL', async () => {
      const tipo = TipoCampo.EMAIL;
      const mockCampoEmail = {
        ...mockCampoFormulario,
        tipoCampo: tipo,
        codigoCampo: 'EMAIL001',
        nomeCampo: 'E-mail',
        rotuloCampo: 'Endereço de E-mail',
      };
      mockCampoFormularioService.findByTipo.mockResolvedValue([mockCampoEmail]);

      const result = await controller.findByTipo(mockFormularioId, tipo);

      expect(result).toEqual([mockCampoEmail]);
      expect(result[0].tipoCampo).toBe(TipoCampo.EMAIL);
    });

    it('deveria retornar campos do tipo SELECT', async () => {
      const tipo = TipoCampo.SELECT;
      const mockCampoSelect = {
        ...mockCampoFormulario,
        tipoCampo: tipo,
        codigoCampo: 'SELECT001',
        nomeCampo: 'Estado Civil',
        rotuloCampo: 'Selecione o Estado Civil',
      };
      mockCampoFormularioService.findByTipo.mockResolvedValue([
        mockCampoSelect,
      ]);

      const result = await controller.findByTipo(mockFormularioId, tipo);

      expect(result).toEqual([mockCampoSelect]);
      expect(result[0].tipoCampo).toBe(TipoCampo.SELECT);
    });
  });

  describe('search', () => {
    it('deveria buscar campos por termo', async () => {
      const termo = 'nome';
      const mockResultadoBusca = [mockCampoFormulario];
      mockCampoFormularioService.search.mockResolvedValue(mockResultadoBusca);

      const result = await controller.search(mockFormularioId, termo);

      expect(result).toEqual(mockResultadoBusca);
      expect(service.search).toHaveBeenCalledWith(mockFormularioId, termo);
    });

    it('deveria retornar lista vazia quando termo não encontrado', async () => {
      const termo = 'inexistente';
      mockCampoFormularioService.search.mockResolvedValue([]);

      const result = await controller.search(mockFormularioId, termo);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findByCodigo', () => {
    it('deveria encontrar campo por código', async () => {
      const codigo = 'CAMPO001';
      mockCampoFormularioService.findByCodigo.mockResolvedValue(
        mockCampoFormulario,
      );

      const result = await controller.findByCodigo(mockFormularioId, codigo);

      expect(result).toEqual(mockCampoFormulario);
      expect(service.findByCodigo).toHaveBeenCalledWith(
        mockFormularioId,
        codigo,
      );
    });

    it('deveria retornar erro 404 quando código não encontrado', async () => {
      const codigo = 'CODIGO_INEXISTENTE';
      const erro = new Error('Campo não encontrado');
      mockCampoFormularioService.findByCodigo.mockRejectedValue(erro);

      await expect(
        controller.findByCodigo(mockFormularioId, codigo),
      ).rejects.toThrow('Campo não encontrado');
    });
  });

  describe('getEstatisticas', () => {
    it('deveria retornar estatísticas dos campos', async () => {
      const mockEstatisticas = {
        total: 10,
        ativos: 8,
        inativos: 2,
        obrigatorios: 5,
        porTipo: [
          { tipo: TipoCampo.TEXTO, quantidade: 4 },
          { tipo: TipoCampo.EMAIL, quantidade: 2 },
          { tipo: TipoCampo.SELECT, quantidade: 3 },
          { tipo: TipoCampo.DATA, quantidade: 1 },
        ],
        porStatus: [{ status: StatusCampo.ATIVO, quantidade: 8 }],
      };
      mockCampoFormularioService.getEstatisticas.mockResolvedValue(
        mockEstatisticas,
      );

      const result = await controller.getEstatisticas(mockFormularioId);

      expect(result).toEqual(mockEstatisticas);
      expect(service.getEstatisticas).toHaveBeenCalledWith(mockFormularioId);
      expect(result.total).toBe(10);
      expect(result.ativos).toBe(8);
      expect(result.porTipo).toHaveLength(4);
    });
  });

  describe('findOne', () => {
    it('deveria retornar campo por ID', async () => {
      mockCampoFormularioService.findOne.mockResolvedValue(mockCampoFormulario);

      const result = await controller.findOne(mockCampoId);

      expect(result).toEqual(mockCampoFormulario);
      expect(service.findOne).toHaveBeenCalledWith(mockCampoId);
    });

    it('deveria retornar erro 404 quando campo não encontrado', async () => {
      const erro = new Error('Campo não encontrado');
      mockCampoFormularioService.findOne.mockRejectedValue(erro);

      await expect(controller.findOne('id-inexistente')).rejects.toThrow(
        'Campo não encontrado',
      );
    });
  });

  describe('update', () => {
    it('deveria atualizar campo com sucesso', async () => {
      const mockCampoAtualizado = {
        ...mockCampoFormulario,
        ...updateCampoDto,
      };
      mockCampoFormularioService.update.mockResolvedValue(mockCampoAtualizado);

      const result = await controller.update(
        mockCampoId,
        updateCampoDto as any,
      );

      expect(result).toEqual(mockCampoAtualizado);
      expect(service.update).toHaveBeenCalledWith(mockCampoId, updateCampoDto);
    });

    it('deveria retornar erro ao atualizar campo inexistente', async () => {
      const erro = new Error('Campo não encontrado');
      mockCampoFormularioService.update.mockRejectedValue(erro);

      await expect(
        controller.update('id-inexistente', updateCampoDto as any),
      ).rejects.toThrow('Campo não encontrado');
    });

    it('deveria retornar erro 400 com dados inválidos', async () => {
      const erro = new Error('Dados inválidos');
      mockCampoFormularioService.update.mockRejectedValue(erro);

      await expect(
        controller.update(mockCampoId, { nomeCampo: '' }),
      ).rejects.toThrow('Dados inválidos');
    });
  });

  describe('reordenar', () => {
    it('deveria reordenar campos com sucesso', async () => {
      const ordens = [
        { id: mockCampoId, ordem: 2 },
        { id: '789e0123-e89b-12d3-a456-426614174002', ordem: 1 },
      ];
      const mockCamposReordenados = [{ ...mockCampoFormulario, ordem: 2 }];
      mockCampoFormularioService.reordenar.mockResolvedValue(
        mockCamposReordenados,
      );

      const result = await controller.reordenar(mockFormularioId, ordens);

      expect(result).toEqual(mockCamposReordenados);
      expect(service.reordenar).toHaveBeenCalledWith(mockFormularioId, ordens);
    });
  });

  describe('duplicar', () => {
    it('deveria duplicar campo com sucesso', async () => {
      const novoCodigo = 'CAMPO001_COPY';
      const mockCampoDuplicado = {
        ...mockCampoFormulario,
        id: 'novo-id',
        codigoCampo: novoCodigo,
      };
      mockCampoFormularioService.duplicar.mockResolvedValue(mockCampoDuplicado);

      const result = await controller.duplicar(mockCampoId, novoCodigo);

      expect(result).toEqual(mockCampoDuplicado);
      expect(service.duplicar).toHaveBeenCalledWith(mockCampoId, novoCodigo);
    });

    it('deveria duplicar campo sem código específico', async () => {
      const mockCampoDuplicado = {
        ...mockCampoFormulario,
        id: 'novo-id',
        codigoCampo: 'CAMPO001_COPY_1',
      };
      mockCampoFormularioService.duplicar.mockResolvedValue(mockCampoDuplicado);

      const result = await controller.duplicar(mockCampoId);

      expect(result).toEqual(mockCampoDuplicado);
      expect(service.duplicar).toHaveBeenCalledWith(mockCampoId, undefined);
    });

    it('deveria retornar erro quando código já existe', async () => {
      const novoCodigo = 'CAMPO002';
      const erro = new Error('Código já existe');
      mockCampoFormularioService.duplicar.mockRejectedValue(erro);

      await expect(
        controller.duplicar(mockCampoId, novoCodigo),
      ).rejects.toThrow('Código já existe');
    });
  });

  describe('toggleStatus', () => {
    it('deveria alternar status de ativo para inativo', async () => {
      const mockCampoInativo = {
        ...mockCampoFormulario,
        status: StatusCampo.INATIVO,
      };
      mockCampoFormularioService.toggleStatus.mockResolvedValue(
        mockCampoInativo,
      );

      const result = await controller.toggleStatus(mockCampoId);

      expect(result).toEqual(mockCampoInativo);
      expect(result.status).toBe(StatusCampo.INATIVO);
      expect(service.toggleStatus).toHaveBeenCalledWith(mockCampoId);
    });

    it('deveria alternar status de inativo para ativo', async () => {
      const mockCampoAtivo = {
        ...mockCampoFormulario,
        status: StatusCampo.ATIVO,
      };
      mockCampoFormularioService.toggleStatus.mockResolvedValue(mockCampoAtivo);

      const result = await controller.toggleStatus(mockCampoId);

      expect(result).toEqual(mockCampoAtivo);
      expect(result.status).toBe(StatusCampo.ATIVO);
    });
  });

  describe('updateStatus', () => {
    it('deveria atualizar status para inativo', async () => {
      const novoStatus = StatusCampo.INATIVO;
      const mockCampoComNovoStatus = {
        ...mockCampoFormulario,
        status: novoStatus,
      };
      mockCampoFormularioService.updateStatus.mockResolvedValue(
        mockCampoComNovoStatus,
      );

      const result = await controller.updateStatus(mockCampoId, novoStatus);

      expect(result).toEqual(mockCampoComNovoStatus);
      expect(service.updateStatus).toHaveBeenCalledWith(
        mockCampoId,
        novoStatus,
      );
    });

    it('deveria atualizar status para oculto', async () => {
      const novoStatus = StatusCampo.OCULTO;
      const mockCampoOculto = {
        ...mockCampoFormulario,
        status: novoStatus,
      };
      mockCampoFormularioService.updateStatus.mockResolvedValue(
        mockCampoOculto,
      );

      const result = await controller.updateStatus(mockCampoId, novoStatus);

      expect(result).toEqual(mockCampoOculto);
      expect(result.status).toBe(StatusCampo.OCULTO);
    });
  });

  describe('validarCampo', () => {
    it('deveria validar campo com sucesso', async () => {
      const mockValidacao = {
        valido: true,
        erros: [],
        avisos: [],
        regrasValidacao: {
          formatoOk: true,
          tamanhoOk: true,
          obrigatoriedadeOk: true,
        },
      };
      mockCampoFormularioService.validarCampo.mockResolvedValue(mockValidacao);

      const result = await controller.validarCampo(mockCampoId);

      expect(result).toEqual(mockValidacao);
      expect(service.validarCampo).toHaveBeenCalledWith(mockCampoId);
      expect(result.valido).toBe(true);
      expect(result.erros).toHaveLength(0);
    });

    it('deveria retornar erros de validação', async () => {
      const mockValidacao = {
        valido: false,
        erros: ['Código do campo é obrigatório', 'Tipo de campo inválido'],
        regrasValidacao: {
          formatoOk: false,
          tamanhoOk: true,
          obrigatoriedadeOk: false,
        },
      };
      mockCampoFormularioService.validarCampo.mockResolvedValue(mockValidacao);

      const result = await controller.validarCampo(mockCampoId);

      expect(result).toEqual(mockValidacao);
      expect(result.valido).toBe(false);
      expect(result.erros).toHaveLength(2);
    });

    it('deveria retornar erro 404 quando campo não encontrado', async () => {
      const erro = new Error('Campo não encontrado');
      mockCampoFormularioService.validarCampo.mockRejectedValue(erro);

      await expect(controller.validarCampo('id-inexistente')).rejects.toThrow(
        'Campo não encontrado',
      );
    });
  });

  describe('remove', () => {
    it('deveria remover campo com sucesso', async () => {
      mockCampoFormularioService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(mockCampoId);

      expect(result).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith(mockCampoId);
    });

    it('deveria retornar erro ao remover campo inexistente', async () => {
      const erro = new Error('Campo não encontrado');
      mockCampoFormularioService.remove.mockRejectedValue(erro);

      await expect(controller.remove('id-inexistente')).rejects.toThrow(
        'Campo não encontrado',
      );
    });

    it('deveria retornar erro ao remover campo com respostas vinculadas', async () => {
      const erro = new Error(
        'Não é possível remover campo com respostas vinculadas',
      );
      mockCampoFormularioService.remove.mockRejectedValue(erro);

      await expect(controller.remove(mockCampoId)).rejects.toThrow(
        'Não é possível remover campo com respostas vinculadas',
      );
    });
  });

  describe('Tipos de Campo Específicos', () => {
    it('deveria lidar com campos de diferentes tipos', async () => {
      const tipos = [
        TipoCampo.TEXTO,
        TipoCampo.EMAIL,
        TipoCampo.NUMERO,
        TipoCampo.DATA,
        TipoCampo.SELECT,
        TipoCampo.CHECKBOX,
        TipoCampo.ARQUIVO,
        TipoCampo.ASSINATURA,
      ];

      for (const tipo of tipos) {
        const mockCampoTipo = {
          ...mockCampoFormulario,
          tipoCampo: tipo,
          codigoCampo: `CAMPO_${tipo.toUpperCase()}`,
        };
        mockCampoFormularioService.findByTipo.mockResolvedValue([
          mockCampoTipo,
        ]);

        const result = await controller.findByTipo(mockFormularioId, tipo);

        expect(result[0].tipoCampo).toBe(tipo);
      }
    });
  });

  describe('Guards e Decorators', () => {
    it('deveria ter JwtAuthGuard aplicado', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        CampoFormularioController,
      );
      expect(guards).toBeDefined();
    });

    it('deveria ter ApiTags definido', () => {
      const tags = Reflect.getMetadata(
        'swagger/apiTags',
        CampoFormularioController,
      );
      expect(tags).toContain('Campos de Formulário');
    });

    it('deveria ter ApiBearerAuth definido', () => {
      const bearerAuth = Reflect.getMetadata(
        'swagger/apiBearerAuth',
        CampoFormularioController,
      );
      expect(bearerAuth).toBeDefined();
    });
  });

  describe('Validação de UUIDs', () => {
    it('deveria validar UUID nos parâmetros de rota', () => {
      expect(() => {
        const pipe = new ParseUUIDPipe();
        pipe.transform('uuid-invalido', { type: 'param', data: 'id' });
      }).toThrow();
    });

    it('deveria aceitar UUID válido', () => {
      const pipe = new ParseUUIDPipe();
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';

      expect(() => {
        pipe.transform(validUuid, { type: 'param', data: 'id' });
      }).not.toThrow();
    });
  });
});
