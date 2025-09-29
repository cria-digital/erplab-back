import { Test, TestingModule } from '@nestjs/testing';
import { AlternativaCampoController } from './alternativa-campo.controller';
import { AlternativaCampoService } from './alternativa-campo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatusAlternativa } from './entities/alternativa-campo.entity';
import { ParseUUIDPipe } from '@nestjs/common';

describe('AlternativaCampoController', () => {
  let controller: AlternativaCampoController;
  let service: AlternativaCampoService;

  const mockAlternativaCampoService = {
    create: jest.fn(),
    findByCampo: jest.fn(),
    findAtivas: jest.fn(),
    findPadrao: jest.fn(),
    search: jest.fn(),
    findByValor: jest.fn(),
    findByCodigo: jest.fn(),
    getEstatisticas: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    reordenar: jest.fn(),
    duplicar: jest.fn(),
    toggleStatus: jest.fn(),
    updateStatus: jest.fn(),
    definirPadrao: jest.fn(),
    removerPadrao: jest.fn(),
    importarAlternativas: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlternativaCampoController],
      providers: [
        {
          provide: AlternativaCampoService,
          useValue: mockAlternativaCampoService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AlternativaCampoController>(
      AlternativaCampoController,
    );
    service = module.get<AlternativaCampoService>(AlternativaCampoService);
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

  describe('Dados de teste', () => {
    const mockCampoId = '123e4567-e89b-12d3-a456-426614174000';
    const mockAlternativaId = '456e7890-e89b-12d3-a456-426614174001';

    const mockAlternativaCampo = {
      id: mockAlternativaId,
      campoFormularioId: mockCampoId,
      codigoAlternativa: 'ALT001',
      textoAlternativa: 'Opção 1',
      valor: 'opcao_1',
      descricao: 'Descrição da primeira opção',
      ordem: 1,
      status: StatusAlternativa.ATIVA,
      selecionadoPadrao: false,
      pontuacao: 10,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      campoFormulario: {
        id: mockCampoId,
        nome: 'Campo Teste',
        tipo: 'select',
      },
    };

    const createAlternativaDto = {
      campoFormularioId: mockCampoId,
      codigoAlternativa: 'ALT001',
      textoAlternativa: 'Opção 1',
      valor: 'opcao_1',
      descricao: 'Descrição da primeira opção',
      ordem: 1,
      pontuacao: 10,
    };

    const updateAlternativaDto = {
      textoAlternativa: 'Opção 1 Atualizada',
      descricao: 'Primeira Opção Atualizada',
      pontuacao: 15,
    };

    describe('create', () => {
      it('deveria criar uma alternativa de campo com sucesso', async () => {
        mockAlternativaCampoService.create.mockResolvedValue(
          mockAlternativaCampo,
        );

        const result = await controller.create(createAlternativaDto);

        expect(result).toEqual(mockAlternativaCampo);
        expect(service.create).toHaveBeenCalledWith(createAlternativaDto);
        expect(service.create).toHaveBeenCalledTimes(1);
      });

      it('deveria retornar erro ao criar alternativa com dados inválidos', async () => {
        const erro = new Error('Dados inválidos');
        mockAlternativaCampoService.create.mockRejectedValue(erro);

        const invalidDto = {
          campoFormularioId: 'invalid-uuid',
          codigoAlternativa: 'ALT001',
          valor: 'M',
          textoAlternativa: 'Masculino',
        } as any;

        await expect(controller.create(invalidDto)).rejects.toThrow(
          'Dados inválidos',
        );
        expect(service.create).toHaveBeenCalledWith(invalidDto);
      });

      it('deveria retornar erro ao criar alternativa com código duplicado', async () => {
        const erro = new Error('Código da alternativa já existe');
        mockAlternativaCampoService.create.mockRejectedValue(erro);

        await expect(controller.create(createAlternativaDto)).rejects.toThrow(
          'Código da alternativa já existe',
        );
      });

      it('deveria retornar erro 409 quando alternativa já existe', async () => {
        const erro = new Error('Alternativa já existe');
        erro.name = 'ConflictException';
        mockAlternativaCampoService.create.mockRejectedValue(erro);

        await expect(controller.create(createAlternativaDto)).rejects.toThrow(
          'Alternativa já existe',
        );
      });
    });

    describe('findByCampo', () => {
      it('deveria retornar alternativas de um campo', async () => {
        const mockAlternativas = [mockAlternativaCampo];
        mockAlternativaCampoService.findByCampo.mockResolvedValue(
          mockAlternativas,
        );

        const result = await controller.findByCampo(mockCampoId);

        expect(result).toEqual(mockAlternativas);
        expect(service.findByCampo).toHaveBeenCalledWith(mockCampoId);
        expect(service.findByCampo).toHaveBeenCalledTimes(1);
      });

      it('deveria retornar lista vazia quando campo não tiver alternativas', async () => {
        mockAlternativaCampoService.findByCampo.mockResolvedValue([]);

        const result = await controller.findByCampo(mockCampoId);

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });

    describe('findAtivas', () => {
      it('deveria retornar alternativas ativas de um campo', async () => {
        const mockAlternativasAtivas = [
          { ...mockAlternativaCampo, status: StatusAlternativa.ATIVA },
        ];
        mockAlternativaCampoService.findAtivas.mockResolvedValue(
          mockAlternativasAtivas,
        );

        const result = await controller.findAtivas(mockCampoId);

        expect(result).toEqual(mockAlternativasAtivas);
        expect(service.findAtivas).toHaveBeenCalledWith(mockCampoId);
        expect(
          result.every((alt) => alt.status === StatusAlternativa.ATIVA),
        ).toBe(true);
      });
    });

    describe('findPadrao', () => {
      it('deveria retornar alternativas padrão de um campo', async () => {
        const mockAlternativaPadrao = {
          ...mockAlternativaCampo,
          selecionadoPadrao: true,
        };
        mockAlternativaCampoService.findPadrao.mockResolvedValue([
          mockAlternativaPadrao,
        ]);

        const result = await controller.findPadrao(mockCampoId);

        expect(result).toEqual([mockAlternativaPadrao]);
        expect(service.findPadrao).toHaveBeenCalledWith(mockCampoId);
        expect(result[0].selecionadoPadrao).toBe(true);
      });
    });

    describe('search', () => {
      it('deveria buscar alternativas por termo', async () => {
        const termo = 'primeira';
        const mockResultadoBusca = [mockAlternativaCampo];
        mockAlternativaCampoService.search.mockResolvedValue(
          mockResultadoBusca,
        );

        const result = await controller.search(mockCampoId, termo);

        expect(result).toEqual(mockResultadoBusca);
        expect(service.search).toHaveBeenCalledWith(mockCampoId, termo);
      });

      it('deveria retornar lista vazia quando termo não encontrado', async () => {
        const termo = 'inexistente';
        mockAlternativaCampoService.search.mockResolvedValue([]);

        const result = await controller.search(mockCampoId, termo);

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });

    describe('findByValor', () => {
      it('deveria encontrar alternativa por valor', async () => {
        const valor = 'opcao_1';
        mockAlternativaCampoService.findByValor.mockResolvedValue(
          mockAlternativaCampo,
        );

        const result = await controller.findByValor(mockCampoId, valor);

        expect(result).toEqual(mockAlternativaCampo);
        expect(service.findByValor).toHaveBeenCalledWith(mockCampoId, valor);
      });

      it('deveria retornar erro 404 quando valor não encontrado', async () => {
        const valor = 'valor_inexistente';
        const erro = new Error('Alternativa não encontrada');
        mockAlternativaCampoService.findByValor.mockRejectedValue(erro);

        await expect(
          controller.findByValor(mockCampoId, valor),
        ).rejects.toThrow('Alternativa não encontrada');
      });
    });

    describe('findByCodigo', () => {
      it('deveria encontrar alternativa por código', async () => {
        const codigo = 'ALT001';
        mockAlternativaCampoService.findByCodigo.mockResolvedValue(
          mockAlternativaCampo,
        );

        const result = await controller.findByCodigo(mockCampoId, codigo);

        expect(result).toEqual(mockAlternativaCampo);
        expect(service.findByCodigo).toHaveBeenCalledWith(mockCampoId, codigo);
      });

      it('deveria retornar erro 404 quando código não encontrado', async () => {
        const codigo = 'CODIGO_INEXISTENTE';
        const erro = new Error('Alternativa não encontrada');
        mockAlternativaCampoService.findByCodigo.mockRejectedValue(erro);

        await expect(
          controller.findByCodigo(mockCampoId, codigo),
        ).rejects.toThrow('Alternativa não encontrada');
      });
    });

    describe('getEstatisticas', () => {
      it('deveria retornar estatísticas das alternativas', async () => {
        const mockEstatisticas = {
          total: 5,
          ativas: 4,
          inativas: 1,
          padrao: 1,
          porStatus: [
            { status: StatusAlternativa.ATIVA, quantidade: 4 },
            { status: StatusAlternativa.INATIVA, quantidade: 1 },
          ],
        };
        mockAlternativaCampoService.getEstatisticas.mockResolvedValue(
          mockEstatisticas,
        );

        const result = await controller.getEstatisticas(mockCampoId);

        expect(result).toEqual(mockEstatisticas);
        expect(service.getEstatisticas).toHaveBeenCalledWith(mockCampoId);
        expect(result.total).toBe(5);
        expect(result.ativas).toBe(4);
      });
    });

    describe('findOne', () => {
      it('deveria retornar alternativa por ID', async () => {
        mockAlternativaCampoService.findOne.mockResolvedValue(
          mockAlternativaCampo,
        );

        const result = await controller.findOne(mockAlternativaId);

        expect(result).toEqual(mockAlternativaCampo);
        expect(service.findOne).toHaveBeenCalledWith(mockAlternativaId);
      });

      it('deveria retornar erro 404 quando alternativa não encontrada', async () => {
        const erro = new Error('Alternativa não encontrada');
        mockAlternativaCampoService.findOne.mockRejectedValue(erro);

        await expect(controller.findOne('id-inexistente')).rejects.toThrow(
          'Alternativa não encontrada',
        );
      });
    });

    describe('update', () => {
      it('deveria atualizar alternativa com sucesso', async () => {
        const mockAlternativaAtualizada = {
          ...mockAlternativaCampo,
          ...updateAlternativaDto,
        };
        mockAlternativaCampoService.update.mockResolvedValue(
          mockAlternativaAtualizada,
        );

        const result = await controller.update(
          mockAlternativaId,
          updateAlternativaDto,
        );

        expect(result).toEqual(mockAlternativaAtualizada);
        expect(service.update).toHaveBeenCalledWith(
          mockAlternativaId,
          updateAlternativaDto,
        );
      });

      it('deveria retornar erro ao atualizar alternativa inexistente', async () => {
        const erro = new Error('Alternativa não encontrada');
        mockAlternativaCampoService.update.mockRejectedValue(erro);

        await expect(
          controller.update('id-inexistente', updateAlternativaDto),
        ).rejects.toThrow('Alternativa não encontrada');
      });

      it('deveria retornar erro 400 com dados inválidos', async () => {
        const erro = new Error('Dados inválidos');
        mockAlternativaCampoService.update.mockRejectedValue(erro);

        await expect(
          controller.update(mockAlternativaId, { textoAlternativa: '' }),
        ).rejects.toThrow('Dados inválidos');
      });
    });

    describe('reordenar', () => {
      it('deveria reordenar alternativas com sucesso', async () => {
        const ordens = [
          { id: mockAlternativaId, ordem: 2 },
          { id: '789e0123-e89b-12d3-a456-426614174002', ordem: 1 },
        ];
        const mockAlternativasReordenadas = [
          { ...mockAlternativaCampo, ordem: 2 },
        ];
        mockAlternativaCampoService.reordenar.mockResolvedValue(
          mockAlternativasReordenadas,
        );

        const result = await controller.reordenar(mockCampoId, ordens);

        expect(result).toEqual(mockAlternativasReordenadas);
        expect(service.reordenar).toHaveBeenCalledWith(mockCampoId, ordens);
      });
    });

    describe('duplicar', () => {
      it('deveria duplicar alternativa com sucesso', async () => {
        const novoCodigo = 'ALT001_COPY';
        const mockAlternativaDuplicada = {
          ...mockAlternativaCampo,
          id: 'novo-id',
          codigoAlternativa: novoCodigo,
        };
        mockAlternativaCampoService.duplicar.mockResolvedValue(
          mockAlternativaDuplicada,
        );

        const result = await controller.duplicar(mockAlternativaId, novoCodigo);

        expect(result).toEqual(mockAlternativaDuplicada);
        expect(service.duplicar).toHaveBeenCalledWith(
          mockAlternativaId,
          novoCodigo,
        );
      });

      it('deveria duplicar alternativa sem código específico', async () => {
        const mockAlternativaDuplicada = {
          ...mockAlternativaCampo,
          id: 'novo-id',
          codigoAlternativa: 'ALT001_COPY_1',
        };
        mockAlternativaCampoService.duplicar.mockResolvedValue(
          mockAlternativaDuplicada,
        );

        const result = await controller.duplicar(mockAlternativaId);

        expect(result).toEqual(mockAlternativaDuplicada);
        expect(service.duplicar).toHaveBeenCalledWith(
          mockAlternativaId,
          undefined,
        );
      });

      it('deveria retornar erro quando código já existe', async () => {
        const novoCodigo = 'ALT002';
        const erro = new Error('Código já existe');
        mockAlternativaCampoService.duplicar.mockRejectedValue(erro);

        await expect(
          controller.duplicar(mockAlternativaId, novoCodigo),
        ).rejects.toThrow('Código já existe');
      });
    });

    describe('toggleStatus', () => {
      it('deveria alternar status de ativa para inativa', async () => {
        const mockAlternativaInativa = {
          ...mockAlternativaCampo,
          status: StatusAlternativa.INATIVA,
        };
        mockAlternativaCampoService.toggleStatus.mockResolvedValue(
          mockAlternativaInativa,
        );

        const result = await controller.toggleStatus(mockAlternativaId);

        expect(result).toEqual(mockAlternativaInativa);
        expect(result.status).toBe(StatusAlternativa.INATIVA);
        expect(service.toggleStatus).toHaveBeenCalledWith(mockAlternativaId);
      });

      it('deveria alternar status de inativa para ativa', async () => {
        const mockAlternativaAtiva = {
          ...mockAlternativaCampo,
          status: StatusAlternativa.ATIVA,
        };
        mockAlternativaCampoService.toggleStatus.mockResolvedValue(
          mockAlternativaAtiva,
        );

        const result = await controller.toggleStatus(mockAlternativaId);

        expect(result).toEqual(mockAlternativaAtiva);
        expect(result.status).toBe(StatusAlternativa.ATIVA);
      });
    });

    describe('updateStatus', () => {
      it('deveria atualizar status para inativo', async () => {
        const novoStatus = StatusAlternativa.INATIVA;
        const mockAlternativaComNovoStatus = {
          ...mockAlternativaCampo,
          status: novoStatus,
        };
        mockAlternativaCampoService.updateStatus.mockResolvedValue(
          mockAlternativaComNovoStatus,
        );

        const result = await controller.updateStatus(
          mockAlternativaId,
          novoStatus,
        );

        expect(result).toEqual(mockAlternativaComNovoStatus);
        expect(service.updateStatus).toHaveBeenCalledWith(
          mockAlternativaId,
          novoStatus,
        );
      });
    });

    describe('definirPadrao', () => {
      it('deveria definir alternativa como padrão', async () => {
        const mockAlternativaPadrao = {
          ...mockAlternativaCampo,
          selecionadoPadrao: true,
        };
        mockAlternativaCampoService.definirPadrao.mockResolvedValue(
          mockAlternativaPadrao,
        );

        const result = await controller.definirPadrao(mockAlternativaId);

        expect(result).toEqual(mockAlternativaPadrao);
        expect(result.selecionadoPadrao).toBe(true);
        expect(service.definirPadrao).toHaveBeenCalledWith(mockAlternativaId);
      });
    });

    describe('removerPadrao', () => {
      it('deveria remover padrão de todas as alternativas do campo', async () => {
        const mockResultado = { affected: 2 };
        mockAlternativaCampoService.removerPadrao.mockResolvedValue(
          mockResultado,
        );

        const result = await controller.removerPadrao(mockCampoId);

        expect(result).toEqual(mockResultado);
        expect(service.removerPadrao).toHaveBeenCalledWith(mockCampoId);
      });
    });

    describe('importarAlternativas', () => {
      it('deveria importar alternativas para um campo', async () => {
        const alternativasParaImportar = [
          {
            codigo: 'IMP001',
            valor: 'imp_1',
            rotulo: 'Importada 1',
            descricao: 'Primeira alternativa importada',
            score: 5,
          },
          {
            codigo: 'IMP002',
            valor: 'imp_2',
            rotulo: 'Importada 2',
            descricao: 'Segunda alternativa importada',
            score: 8,
          },
        ];
        const mockResultadoImportacao = [
          {
            id: 'nova-alternativa-1',
            codigoAlternativa: 'IMP001',
            valor: 'imp_1',
            textoAlternativa: 'Importada 1',
            descricao: 'Primeira alternativa importada',
            pontuacao: 5,
            campoFormularioId: mockCampoId,
          },
          {
            id: 'nova-alternativa-2',
            codigoAlternativa: 'IMP002',
            valor: 'imp_2',
            textoAlternativa: 'Importada 2',
            descricao: 'Segunda alternativa importada',
            pontuacao: 8,
            campoFormularioId: mockCampoId,
          },
        ];
        mockAlternativaCampoService.importarAlternativas.mockResolvedValue(
          mockResultadoImportacao,
        );

        const result = await controller.importarAlternativas(
          mockCampoId,
          alternativasParaImportar,
        );

        expect(result).toEqual(mockResultadoImportacao);
        expect(service.importarAlternativas).toHaveBeenCalledWith(
          mockCampoId,
          alternativasParaImportar,
        );
        expect(result).toHaveLength(2);
        expect(result[0].codigoAlternativa).toBe('IMP001');
      });

      it('deveria retornar erro ao importar alternativas com dados inválidos', async () => {
        const alternativasInvalidas = [{ codigo: '', valor: '', rotulo: '' }];
        const erro = new Error('Dados inválidos');
        mockAlternativaCampoService.importarAlternativas.mockRejectedValue(
          erro,
        );

        await expect(
          controller.importarAlternativas(mockCampoId, alternativasInvalidas),
        ).rejects.toThrow('Dados inválidos');
      });
    });

    describe('remove', () => {
      it('deveria remover alternativa com sucesso', async () => {
        mockAlternativaCampoService.remove.mockResolvedValue({ affected: 1 });

        const result = await controller.remove(mockAlternativaId);

        expect(result).toEqual({ affected: 1 });
        expect(service.remove).toHaveBeenCalledWith(mockAlternativaId);
      });

      it('deveria retornar erro ao remover alternativa inexistente', async () => {
        const erro = new Error('Alternativa não encontrada');
        mockAlternativaCampoService.remove.mockRejectedValue(erro);

        await expect(controller.remove('id-inexistente')).rejects.toThrow(
          'Alternativa não encontrada',
        );
      });
    });
  });

  describe('Guards e Decorators', () => {
    it('deveria ter JwtAuthGuard aplicado', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AlternativaCampoController,
      );
      expect(guards).toBeDefined();
    });

    it('deveria ter ApiTags definido', () => {
      const tags = Reflect.getMetadata(
        'swagger/apiTags',
        AlternativaCampoController,
      );
      expect(tags).toContain('Alternativas de Campo');
    });

    it('deveria ter ApiBearerAuth definido', () => {
      const bearerAuth = Reflect.getMetadata(
        'swagger/apiBearerAuth',
        AlternativaCampoController,
      );
      expect(bearerAuth).toBeDefined();
    });
  });

  describe('Validação de UUIDs', () => {
    it('deveria validar UUID nos parâmetros de rota', () => {
      // Este teste verifica se ParseUUIDPipe está sendo usado corretamente
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
