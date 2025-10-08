import { Test, TestingModule } from '@nestjs/testing';
import { RespostaFormularioController } from './resposta-formulario.controller';
import { RespostaFormularioService } from './resposta-formulario.service';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';
import { StatusResposta } from './entities/resposta-formulario.entity';
import { ParseUUIDPipe } from '@nestjs/common';

describe('RespostaFormularioController', () => {
  let controller: RespostaFormularioController;
  let service: RespostaFormularioService;

  const mockRespostaFormularioService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findCompletas: jest.fn(),
    findPendentesRevisao: jest.fn(),
    findAssinadasDigitalmente: jest.fn(),
    search: jest.fn(),
    getEstatisticas: jest.fn(),
    findByFormulario: jest.fn(),
    findByPaciente: jest.fn(),
    findByUsuario: jest.fn(),
    findByStatus: jest.fn(),
    findByUnidadeSaude: jest.fn(),
    findByOrdemServico: jest.fn(),
    findByCodigo: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    finalizar: jest.fn(),
    assinarDigitalmente: jest.fn(),
    calcularPercentualCompleto: jest.fn(),
    duplicar: jest.fn(),
    validarResposta: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RespostaFormularioController],
      providers: [
        {
          provide: RespostaFormularioService,
          useValue: mockRespostaFormularioService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<RespostaFormularioController>(
      RespostaFormularioController,
    );
    service = module.get<RespostaFormularioService>(RespostaFormularioService);
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
    const mockFormularioId = '123e4567-e89b-12d3-a456-426614174000';
    const mockPacienteId = '456e7890-e89b-12d3-a456-426614174001';
    const mockUsuarioId = '789e0123-e89b-12d3-a456-426614174002';
    const mockUnidadeId = 'abc12345-e89b-12d3-a456-426614174003';
    const mockOrdemId = 'def67890-e89b-12d3-a456-426614174004';
    const mockRespostaId = 'ghi01234-e89b-12d3-a456-426614174005';

    const mockRespostaFormulario = {
      id: mockRespostaId,
      codigoResposta: 'RESP001',
      formularioId: mockFormularioId,
      pacienteId: mockPacienteId,
      usuarioId: mockUsuarioId,
      unidadeSaudeId: mockUnidadeId,
      ordemServicoId: mockOrdemId,
      status: StatusResposta.EM_PREENCHIMENTO,
      dataInicio: new Date('2025-01-01T10:00:00Z'),
      dataConclusao: null,
      percentualCompleto: 75.5,
      assinaturaDigital: null,
      hashAssinatura: null,
      certificadoDigital: null,
      dataAssinatura: null,
      observacoes: 'Resposta em andamento',
      metadados: {
        dispositivoUtilizado: 'tablet',
        localizacao: 'São Paulo, SP',
        versaoFormulario: '1.0',
      },
      created_at: new Date(),
      updated_at: new Date(),
      formulario: {
        id: mockFormularioId,
        nome: 'Formulário de Anamnese',
        descricao: 'Formulário para coleta de dados do paciente',
      },
      paciente: {
        id: mockPacienteId,
        nomeCompleto: 'João da Silva',
        cpf: '123.456.789-00',
      },
      usuario: {
        id: mockUsuarioId,
        nomeCompleto: 'Dr. Maria Santos',
        email: 'maria.santos@clinica.com',
      },
      respostasCampos: [],
    };

    const createRespostaDto = {
      formularioId: mockFormularioId,
      pacienteId: mockPacienteId,
      usuarioId: mockUsuarioId,
      unidadeSaudeId: mockUnidadeId,
      ordemServicoId: mockOrdemId,
      observacoes: 'Nova resposta iniciada',
      metadados: {
        dispositivoUtilizado: 'tablet',
        localizacao: 'São Paulo, SP',
      },
    };

    const updateRespostaDto = {
      observacoes: 'Resposta atualizada',
      metadados: {
        dispositivoUtilizado: 'desktop',
        localizacao: 'Rio de Janeiro, RJ',
      },
    };

    describe('create', () => {
      it('deveria criar uma resposta de formulário com sucesso', async () => {
        mockRespostaFormularioService.create.mockResolvedValue(
          mockRespostaFormulario,
        );

        const result = await controller.create(createRespostaDto);

        expect(result).toEqual(mockRespostaFormulario);
        expect(service.create).toHaveBeenCalledWith(createRespostaDto);
        expect(service.create).toHaveBeenCalledTimes(1);
      });

      it('deveria retornar erro ao criar resposta com dados inválidos', async () => {
        const erro = new Error('Dados inválidos');
        mockRespostaFormularioService.create.mockRejectedValue(erro);

        const invalidDto = {
          formularioId: 'invalid-uuid',
        } as any;

        await expect(controller.create(invalidDto)).rejects.toThrow(
          'Dados inválidos',
        );
        expect(service.create).toHaveBeenCalledWith(invalidDto);
      });

      it('deveria retornar erro ao criar resposta para formulário inexistente', async () => {
        const erro = new Error('Formulário não encontrado');
        mockRespostaFormularioService.create.mockRejectedValue(erro);

        await expect(controller.create(createRespostaDto)).rejects.toThrow(
          'Formulário não encontrado',
        );
      });
    });

    describe('findAll', () => {
      it('deveria retornar todas as respostas', async () => {
        const mockRespostas = [mockRespostaFormulario];
        mockRespostaFormularioService.findAll.mockResolvedValue(mockRespostas);

        const result = await controller.findAll();

        expect(result).toEqual(mockRespostas);
        expect(service.findAll).toHaveBeenCalled();
        expect(service.findAll).toHaveBeenCalledTimes(1);
      });

      it('deveria retornar lista vazia quando não há respostas', async () => {
        mockRespostaFormularioService.findAll.mockResolvedValue([]);

        const result = await controller.findAll();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });

    describe('findCompletas', () => {
      it('deveria retornar respostas completas', async () => {
        const mockRespostasCompletas = [
          {
            ...mockRespostaFormulario,
            status: StatusResposta.CONCLUIDO,
            percentualCompleto: 100,
          },
        ];
        mockRespostaFormularioService.findCompletas.mockResolvedValue(
          mockRespostasCompletas,
        );

        const result = await controller.findCompletas();

        expect(result).toEqual(mockRespostasCompletas);
        expect(service.findCompletas).toHaveBeenCalled();
        expect(result.every((r) => r.status === StatusResposta.CONCLUIDO)).toBe(
          true,
        );
      });
    });

    describe('findPendentesRevisao', () => {
      it('deveria retornar respostas pendentes de revisão', async () => {
        const mockRespostasPendentes = [
          { ...mockRespostaFormulario, status: StatusResposta.REVISAO },
        ];
        mockRespostaFormularioService.findPendentesRevisao.mockResolvedValue(
          mockRespostasPendentes,
        );

        const result = await controller.findPendentesRevisao();

        expect(result).toEqual(mockRespostasPendentes);
        expect(service.findPendentesRevisao).toHaveBeenCalled();
        expect(result.every((r) => r.status === StatusResposta.REVISAO)).toBe(
          true,
        );
      });
    });

    describe('findAssinadasDigitalmente', () => {
      it('deveria retornar respostas assinadas digitalmente', async () => {
        const mockRespostasAssinadas = [
          {
            ...mockRespostaFormulario,
            assinaturaDigital: 'hash_assinatura_digital',
            dataAssinatura: new Date(),
          },
        ];
        mockRespostaFormularioService.findAssinadasDigitalmente.mockResolvedValue(
          mockRespostasAssinadas,
        );

        const result = await controller.findAssinadasDigitalmente();

        expect(result).toEqual(mockRespostasAssinadas);
        expect(service.findAssinadasDigitalmente).toHaveBeenCalled();
        expect(result.every((r) => r.assinaturaDigital !== null)).toBe(true);
      });
    });

    describe('search', () => {
      it('deveria buscar respostas por termo', async () => {
        const termo = 'joão';
        const mockResultadoBusca = [mockRespostaFormulario];
        mockRespostaFormularioService.search.mockResolvedValue(
          mockResultadoBusca,
        );

        const result = await controller.search(termo);

        expect(result).toEqual(mockResultadoBusca);
        expect(service.search).toHaveBeenCalledWith(termo);
      });

      it('deveria retornar lista vazia quando termo não encontrado', async () => {
        const termo = 'inexistente';
        mockRespostaFormularioService.search.mockResolvedValue([]);

        const result = await controller.search(termo);

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
    });

    describe('getEstatisticas', () => {
      it('deveria retornar estatísticas das respostas', async () => {
        const mockEstatisticas = {
          total: 150,
          completas: 120,
          incompletas: 25,
          concluidas: 120,
          assinadas: 100,
          porStatus: [
            { status: StatusResposta.CONCLUIDO, quantidade: 120 },
            { status: StatusResposta.EM_PREENCHIMENTO, quantidade: 25 },
            { status: StatusResposta.REVISAO, quantidade: 5 },
          ],
          porFormulario: [
            {
              formularioId: mockFormularioId,
              nome: 'Anamnese',
              quantidade: 75,
            },
          ],
        };
        mockRespostaFormularioService.getEstatisticas.mockResolvedValue(
          mockEstatisticas,
        );

        const result = await controller.getEstatisticas();

        expect(result).toEqual(mockEstatisticas);
        expect(service.getEstatisticas).toHaveBeenCalled();
        expect(result.total).toBe(150);
        expect(result.completas).toBe(120);
      });
    });

    describe('findByFormulario', () => {
      it('deveria retornar respostas de um formulário', async () => {
        const mockRespostas = [mockRespostaFormulario];
        mockRespostaFormularioService.findByFormulario.mockResolvedValue(
          mockRespostas,
        );

        const result = await controller.findByFormulario(mockFormularioId);

        expect(result).toEqual(mockRespostas);
        expect(service.findByFormulario).toHaveBeenCalledWith(mockFormularioId);
      });
    });

    describe('findByPaciente', () => {
      it('deveria retornar respostas de um paciente', async () => {
        const mockRespostas = [mockRespostaFormulario];
        mockRespostaFormularioService.findByPaciente.mockResolvedValue(
          mockRespostas,
        );

        const result = await controller.findByPaciente(mockPacienteId);

        expect(result).toEqual(mockRespostas);
        expect(service.findByPaciente).toHaveBeenCalledWith(mockPacienteId);
      });
    });

    describe('findByUsuario', () => {
      it('deveria retornar respostas de um usuário', async () => {
        const mockRespostas = [mockRespostaFormulario];
        mockRespostaFormularioService.findByUsuario.mockResolvedValue(
          mockRespostas,
        );

        const result = await controller.findByUsuario(mockUsuarioId);

        expect(result).toEqual(mockRespostas);
        expect(service.findByUsuario).toHaveBeenCalledWith(mockUsuarioId);
      });
    });

    describe('findByStatus', () => {
      it('deveria retornar respostas por status', async () => {
        const status = StatusResposta.CONCLUIDO;
        const mockRespostas = [{ ...mockRespostaFormulario, status }];
        mockRespostaFormularioService.findByStatus.mockResolvedValue(
          mockRespostas,
        );

        const result = await controller.findByStatus(status);

        expect(result).toEqual(mockRespostas);
        expect(service.findByStatus).toHaveBeenCalledWith(status);
        expect(result.every((r) => r.status === status)).toBe(true);
      });
    });

    describe('findByUnidadeSaude', () => {
      it('deveria retornar respostas de uma unidade de saúde', async () => {
        const mockRespostas = [mockRespostaFormulario];
        mockRespostaFormularioService.findByUnidadeSaude.mockResolvedValue(
          mockRespostas,
        );

        const result = await controller.findByUnidadeSaude(mockUnidadeId);

        expect(result).toEqual(mockRespostas);
        expect(service.findByUnidadeSaude).toHaveBeenCalledWith(mockUnidadeId);
      });
    });

    describe('findByOrdemServico', () => {
      it('deveria retornar respostas de uma ordem de serviço', async () => {
        const mockRespostas = [mockRespostaFormulario];
        mockRespostaFormularioService.findByOrdemServico.mockResolvedValue(
          mockRespostas,
        );

        const result = await controller.findByOrdemServico(mockOrdemId);

        expect(result).toEqual(mockRespostas);
        expect(service.findByOrdemServico).toHaveBeenCalledWith(mockOrdemId);
      });
    });

    describe('findByCodigo', () => {
      it('deveria encontrar resposta por código', async () => {
        const codigo = 'RESP001';
        mockRespostaFormularioService.findByCodigo.mockResolvedValue(
          mockRespostaFormulario,
        );

        const result = await controller.findByCodigo(codigo);

        expect(result).toEqual(mockRespostaFormulario);
        expect(service.findByCodigo).toHaveBeenCalledWith(codigo);
      });

      it('deveria retornar erro 404 quando código não encontrado', async () => {
        const codigo = 'CODIGO_INEXISTENTE';
        const erro = new Error('Resposta não encontrada');
        mockRespostaFormularioService.findByCodigo.mockRejectedValue(erro);

        await expect(controller.findByCodigo(codigo)).rejects.toThrow(
          'Resposta não encontrada',
        );
      });
    });

    describe('findOne', () => {
      it('deveria retornar resposta por ID', async () => {
        mockRespostaFormularioService.findOne.mockResolvedValue(
          mockRespostaFormulario,
        );

        const result = await controller.findOne(mockRespostaId);

        expect(result).toEqual(mockRespostaFormulario);
        expect(service.findOne).toHaveBeenCalledWith(mockRespostaId);
      });

      it('deveria retornar erro 404 quando resposta não encontrada', async () => {
        const erro = new Error('Resposta não encontrada');
        mockRespostaFormularioService.findOne.mockRejectedValue(erro);

        await expect(controller.findOne('id-inexistente')).rejects.toThrow(
          'Resposta não encontrada',
        );
      });
    });

    describe('update', () => {
      it('deveria atualizar resposta com sucesso', async () => {
        const mockRespostaAtualizada = {
          ...mockRespostaFormulario,
          ...updateRespostaDto,
        };
        mockRespostaFormularioService.update.mockResolvedValue(
          mockRespostaAtualizada,
        );

        const result = await controller.update(
          mockRespostaId,
          updateRespostaDto,
        );

        expect(result).toEqual(mockRespostaAtualizada);
        expect(service.update).toHaveBeenCalledWith(
          mockRespostaId,
          updateRespostaDto,
        );
      });

      it('deveria retornar erro ao atualizar resposta inexistente', async () => {
        const erro = new Error('Resposta não encontrada');
        mockRespostaFormularioService.update.mockRejectedValue(erro);

        await expect(
          controller.update('id-inexistente', updateRespostaDto),
        ).rejects.toThrow('Resposta não encontrada');
      });

      it('deveria retornar erro quando resposta não pode ser editada', async () => {
        const erro = new Error('Resposta não pode ser editada');
        mockRespostaFormularioService.update.mockRejectedValue(erro);

        await expect(
          controller.update(mockRespostaId, updateRespostaDto),
        ).rejects.toThrow('Resposta não pode ser editada');
      });
    });

    describe('updateStatus', () => {
      it('deveria atualizar status da resposta', async () => {
        const novoStatus = StatusResposta.REVISAO;
        const observacoes = 'Enviado para revisão médica';
        const mockRespostaComNovoStatus = {
          ...mockRespostaFormulario,
          status: novoStatus,
          observacoes,
        };
        mockRespostaFormularioService.updateStatus.mockResolvedValue(
          mockRespostaComNovoStatus,
        );

        const result = await controller.updateStatus(
          mockRespostaId,
          novoStatus,
          observacoes,
        );

        expect(result).toEqual(mockRespostaComNovoStatus);
        expect(service.updateStatus).toHaveBeenCalledWith(
          mockRespostaId,
          novoStatus,
          observacoes,
        );
      });

      it('deveria atualizar status sem observações', async () => {
        const novoStatus = StatusResposta.APROVADO;
        const mockRespostaAprovada = {
          ...mockRespostaFormulario,
          status: novoStatus,
        };
        mockRespostaFormularioService.updateStatus.mockResolvedValue(
          mockRespostaAprovada,
        );

        const result = await controller.updateStatus(
          mockRespostaId,
          novoStatus,
        );

        expect(result).toEqual(mockRespostaAprovada);
        expect(service.updateStatus).toHaveBeenCalledWith(
          mockRespostaId,
          novoStatus,
          undefined,
        );
      });

      it('deveria retornar erro quando status não pode ser alterado', async () => {
        const erro = new Error('Status não pode ser alterado');
        mockRespostaFormularioService.updateStatus.mockRejectedValue(erro);

        await expect(
          controller.updateStatus(mockRespostaId, StatusResposta.APROVADO),
        ).rejects.toThrow('Status não pode ser alterado');
      });
    });

    describe('finalizar', () => {
      it('deveria finalizar resposta com sucesso', async () => {
        const mockRespostaFinalizada = {
          ...mockRespostaFormulario,
          status: StatusResposta.CONCLUIDO,
          dataConclusao: new Date(),
          percentualCompleto: 100,
        };
        mockRespostaFormularioService.finalizar.mockResolvedValue(
          mockRespostaFinalizada,
        );

        const result = await controller.finalizar(mockRespostaId);

        expect(result).toEqual(mockRespostaFinalizada);
        expect(service.finalizar).toHaveBeenCalledWith(mockRespostaId);
        expect(result.status).toBe(StatusResposta.CONCLUIDO);
        expect(result.percentualCompleto).toBe(100);
      });

      it('deveria retornar erro quando resposta não pode ser finalizada', async () => {
        const erro = new Error('Resposta não pode ser finalizada');
        mockRespostaFormularioService.finalizar.mockRejectedValue(erro);

        await expect(controller.finalizar(mockRespostaId)).rejects.toThrow(
          'Resposta não pode ser finalizada',
        );
      });
    });

    describe('assinarDigitalmente', () => {
      it('deveria assinar resposta digitalmente com sucesso', async () => {
        const dadosAssinatura = {
          hashAssinatura: 'hash_da_assinatura_digital_12345',
          certificadoDigital: 'certificado_digital_xyz789',
        };
        const mockRespostaAssinada = {
          ...mockRespostaFormulario,
          assinaturaDigital: dadosAssinatura.hashAssinatura,
          certificadoDigital: dadosAssinatura.certificadoDigital,
          dataAssinatura: new Date(),
        };
        mockRespostaFormularioService.assinarDigitalmente.mockResolvedValue(
          mockRespostaAssinada,
        );

        const result = await controller.assinarDigitalmente(
          mockRespostaId,
          dadosAssinatura,
        );

        expect(result).toEqual(mockRespostaAssinada);
        expect(service.assinarDigitalmente).toHaveBeenCalledWith(
          mockRespostaId,
          dadosAssinatura.hashAssinatura,
          dadosAssinatura.certificadoDigital,
        );
        expect(result.assinaturaDigital).toBeDefined();
        expect(result.dataAssinatura).toBeDefined();
      });

      it('deveria retornar erro quando resposta não pode ser assinada', async () => {
        const dadosAssinatura = {
          hashAssinatura: 'hash_da_assinatura',
          certificadoDigital: 'certificado_digital',
        };
        const erro = new Error('Resposta não pode ser assinada');
        mockRespostaFormularioService.assinarDigitalmente.mockRejectedValue(
          erro,
        );

        await expect(
          controller.assinarDigitalmente(mockRespostaId, dadosAssinatura),
        ).rejects.toThrow('Resposta não pode ser assinada');
      });
    });

    describe('calcularPercentualCompleto', () => {
      it('deveria calcular percentual de completude', async () => {
        const mockCalculoPercentual = {
          percentualCompleto: 85.5,
          camposPreenchidos: 17,
          totalCampos: 20,
          camposObrigatoriosPreenchidos: 12,
          totalCamposObrigatorios: 12,
          detalhes: {
            camposPendentes: ['telefone', 'endereço', 'observações'],
            camposComErros: [],
          },
        };
        mockRespostaFormularioService.calcularPercentualCompleto.mockResolvedValue(
          mockCalculoPercentual,
        );

        const result =
          await controller.calcularPercentualCompleto(mockRespostaId);

        expect(result).toEqual(mockCalculoPercentual);
        expect(service.calcularPercentualCompleto).toHaveBeenCalledWith(
          mockRespostaId,
        );
        expect((result as any).percentualCompleto).toBe(85.5);
        expect((result as any).camposPreenchidos).toBe(17);
      });
    });

    describe('duplicar', () => {
      it('deveria duplicar resposta com sucesso', async () => {
        const novoPacienteId = 'novo-paciente-id';
        const mockRespostaDuplicada = {
          ...mockRespostaFormulario,
          id: 'nova-resposta-id',
          codigoResposta: 'RESP002',
          pacienteId: novoPacienteId,
          status: StatusResposta.RASCUNHO,
          percentualCompleto: 0,
        };
        mockRespostaFormularioService.duplicar.mockResolvedValue(
          mockRespostaDuplicada,
        );

        const result = await controller.duplicar(
          mockRespostaId,
          novoPacienteId,
        );

        expect(result).toEqual(mockRespostaDuplicada);
        expect(service.duplicar).toHaveBeenCalledWith(
          mockRespostaId,
          novoPacienteId,
        );
      });

      it('deveria duplicar resposta sem especificar novo paciente', async () => {
        const mockRespostaDuplicada = {
          ...mockRespostaFormulario,
          id: 'nova-resposta-id',
          codigoResposta: 'RESP002',
          status: StatusResposta.RASCUNHO,
        };
        mockRespostaFormularioService.duplicar.mockResolvedValue(
          mockRespostaDuplicada,
        );

        const result = await controller.duplicar(mockRespostaId);

        expect(result).toEqual(mockRespostaDuplicada);
        expect(service.duplicar).toHaveBeenCalledWith(
          mockRespostaId,
          undefined,
        );
      });
    });

    describe('validarResposta', () => {
      it('deveria validar resposta com sucesso', async () => {
        const mockValidacao = {
          valida: true,
          erros: [],
          avisos: [],
          camposValidados: 20,
          camposComErros: 0,
          percentualValidacao: 100,
          detalhes: {
            camposObrigatoriosFaltando: [],
            camposComFormatosInvalidos: [],
            regrasNegocioVioladas: [],
          },
        };
        mockRespostaFormularioService.validarResposta.mockResolvedValue(
          mockValidacao,
        );

        const result = await controller.validarResposta(mockRespostaId);

        expect(result).toEqual(mockValidacao);
        expect(service.validarResposta).toHaveBeenCalledWith(mockRespostaId);
        expect(result.valida).toBe(true);
        expect(result.erros).toHaveLength(0);
      });

      it('deveria retornar erros de validação', async () => {
        const mockValidacao = {
          valida: false,
          erros: [
            'Campo "email" é obrigatório',
            'Campo "telefone" tem formato inválido',
          ],
          avisos: ['Campo "observações" está vazio'],
          camposValidados: 18,
          camposComErros: 2,
          percentualValidacao: 90,
          detalhes: {
            camposObrigatoriosFaltando: ['email'],
            camposComFormatosInvalidos: ['telefone'],
            regrasNegocioVioladas: [],
          },
        };
        mockRespostaFormularioService.validarResposta.mockResolvedValue(
          mockValidacao,
        );

        const result = await controller.validarResposta(mockRespostaId);

        expect(result).toEqual(mockValidacao);
        expect(result.valida).toBe(false);
        expect(result.erros).toHaveLength(2);
        expect((result as any).avisos).toHaveLength(1);
      });
    });

    describe('remove', () => {
      it('deveria remover resposta com sucesso', async () => {
        mockRespostaFormularioService.remove.mockResolvedValue({ affected: 1 });

        const result = await controller.remove(mockRespostaId);

        expect(result).toEqual({ affected: 1 });
        expect(service.remove).toHaveBeenCalledWith(mockRespostaId);
      });

      it('deveria retornar erro ao remover resposta inexistente', async () => {
        const erro = new Error('Resposta não encontrada');
        mockRespostaFormularioService.remove.mockRejectedValue(erro);

        await expect(controller.remove('id-inexistente')).rejects.toThrow(
          'Resposta não encontrada',
        );
      });

      it('deveria retornar erro quando resposta não pode ser removida', async () => {
        const erro = new Error('Resposta não pode ser removida');
        mockRespostaFormularioService.remove.mockRejectedValue(erro);

        await expect(controller.remove(mockRespostaId)).rejects.toThrow(
          'Resposta não pode ser removida',
        );
      });
    });
  });

  describe('Status de Resposta Específicos', () => {
    it('deveria lidar com diferentes status de resposta', async () => {
      const statusList = [
        StatusResposta.RASCUNHO,
        StatusResposta.EM_PREENCHIMENTO,
        StatusResposta.CONCLUIDO,
        StatusResposta.REVISAO,
        StatusResposta.APROVADO,
        StatusResposta.REJEITADO,
        StatusResposta.CANCELADO,
      ];

      for (const status of statusList) {
        const mockRespostaComStatus = {
          id: 'ghi01234-e89b-12d3-a456-426614174005',
          codigoResposta: 'RESP001',
          status,
        };
        mockRespostaFormularioService.findByStatus.mockResolvedValue([
          mockRespostaComStatus,
        ]);

        const result = await controller.findByStatus(status);

        expect(result[0].status).toBe(status);
      }
    });
  });

  describe('Guards e Decorators', () => {
    it('deveria ter JwtAuthGuard aplicado', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        RespostaFormularioController,
      );
      expect(guards).toBeDefined();
    });

    it('deveria ter ApiTags definido', () => {
      const tags = Reflect.getMetadata(
        'swagger/apiTags',
        RespostaFormularioController,
      );
      expect(tags).toContain('Respostas de Formulário');
    });

    it('deveria ter ApiBearerAuth definido', () => {
      const bearerAuth = Reflect.getMetadata(
        'swagger/apiBearerAuth',
        RespostaFormularioController,
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
