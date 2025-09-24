import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { TelemedicinaController } from './telemedicina.controller';
import { TelemedicinaService } from '../services/telemedicina.service';
import { CreateTelemedicinaDto } from '../dto/create-telemedicina.dto';
import { UpdateTelemedicinaDto } from '../dto/update-telemedicina.dto';
import {
  TipoIntegracaoTelemedicina,
  TipoPlataforma,
  StatusIntegracao,
} from '../entities/telemedicina.entity';
import { TipoEmpresaEnum } from '../../empresas/enums/empresas.enum';

describe('TelemedicinaController', () => {
  let controller: TelemedicinaController;
  let service: TelemedicinaService;

  const mockTelemedicina = {
    id: 'telemedicina-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: {
      id: 'empresa-uuid-1',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Telemedicina Teste Ltda',
      nomeFantasia: 'TeleMed Teste',
      ativo: true,
    },
    codigo_telemedicina: 'TELE001',
    tipo_integracao: TipoIntegracaoTelemedicina.API_REST,
    url_integracao: 'https://api.telemedicina.com',
    status_integracao: StatusIntegracao.ATIVO,
    tipo_plataforma: TipoPlataforma.WEB,
    url_plataforma: 'https://plataforma.telemedicina.com',
    especialidades_atendidas: ['cardiologia', 'neurologia'],
    teleconsulta: true,
    telediagnostico: true,
    telecirurgia: false,
    telemonitoramento: true,
    permite_agendamento_online: true,
    suporte_gravacao: true,
    criptografia_end_to_end: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    search: jest.fn(),
    getEstatisticas: jest.fn(),
    findByIntegracao: jest.fn(),
    findByPlataforma: jest.fn(),
    findByCodigo: jest.fn(),
    findByCnpj: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    updateStatusIntegracao: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemedicinaController],
      providers: [
        {
          provide: TelemedicinaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TelemedicinaController>(TelemedicinaController);
    service = module.get<TelemedicinaService>(TelemedicinaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTelemedicinaDto: CreateTelemedicinaDto = {
      codigo_telemedicina: 'TELE001',
      tipo_integracao: TipoIntegracaoTelemedicina.API_REST,
      tipo_plataforma: TipoPlataforma.WEB,
      teleconsulta: true,
      telediagnostico: true,
      empresa: {
        tipoEmpresa: TipoEmpresaEnum.TELEMEDICINA,
        cnpj: '12345678000190',
        razaoSocial: 'Telemedicina Teste Ltda',
        nomeFantasia: 'TeleMed Teste',
        emailComercial: 'contato@telemed.com.br',
        ativo: true,
      } as any,
    };

    it('deve criar uma telemedicina com sucesso', async () => {
      mockService.create.mockResolvedValue(mockTelemedicina);

      const result = await controller.create(createTelemedicinaDto);

      expect(result).toEqual(mockTelemedicina);
      expect(service.create).toHaveBeenCalledWith(createTelemedicinaDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conflito do service', async () => {
      const conflictError = new BadRequestException('Código já existente');
      mockService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createTelemedicinaDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(createTelemedicinaDto);
    });

    it('deve criar telemedicina com dados completos', async () => {
      const createCompleto = {
        ...createTelemedicinaDto,
        url_integracao: 'https://api.telemedicina.com',
        token_integracao: 'token123',
        especialidades_atendidas: ['cardiologia'],
        tempo_consulta_padrao: 30,
        valor_consulta_particular: 150.0,
        empresa: {
          ...createTelemedicinaDto.empresa,
          endereco: 'Rua Teste, 123',
          telefone: '(11) 1234-5678',
        },
      };

      mockService.create.mockResolvedValue(mockTelemedicina);

      const result = await controller.create(createCompleto);

      expect(result).toEqual(mockTelemedicina);
      expect(service.create).toHaveBeenCalledWith(createCompleto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de telemedicinas', async () => {
      const telemedicinas = [mockTelemedicina];
      mockService.findAll.mockResolvedValue(telemedicinas);

      const result = await controller.findAll();

      expect(result).toEqual(telemedicinas);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há telemedicinas', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas telemedicinas ativas', async () => {
      const telemedicinaAtivas = [mockTelemedicina];
      mockService.findAtivos.mockResolvedValue(telemedicinaAtivas);

      const result = await controller.findAtivos();

      expect(result).toEqual(telemedicinaAtivas);
      expect(service.findAtivos).toHaveBeenCalledTimes(1);
    });
  });

  describe('search', () => {
    it('deve buscar telemedicinas por termo', async () => {
      const termoBusca = 'TeleMed';
      const telemedicinaEncontradas = [mockTelemedicina];
      mockService.search.mockResolvedValue(telemedicinaEncontradas);

      const result = await controller.search(termoBusca);

      expect(result).toEqual(telemedicinaEncontradas);
      expect(service.search).toHaveBeenCalledWith(termoBusca);
    });

    it('deve retornar lista vazia para termo não encontrado', async () => {
      mockService.search.mockResolvedValue([]);

      const result = await controller.search('termo inexistente');

      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith('termo inexistente');
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas das telemedicinas', async () => {
      const estatisticas = {
        total: 10,
        ativos: 8,
        inativos: 2,
        porTipoIntegracao: [
          { tipo: 'api_rest', total: 5 },
          { tipo: 'webhook', total: 3 },
        ],
        porTipoPlataforma: [
          { tipo: 'web', total: 6 },
          { tipo: 'mobile', total: 4 },
        ],
      };

      mockService.getEstatisticas.mockResolvedValue(estatisticas);

      const result = await controller.getEstatisticas();

      expect(result).toEqual(estatisticas);
      expect(service.getEstatisticas).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByIntegracao', () => {
    it('deve retornar telemedicinas por tipo de integração', async () => {
      const tipo = 'api_rest';
      const telemedicinaApi = [mockTelemedicina];
      mockService.findByIntegracao.mockResolvedValue(telemedicinaApi);

      const result = await controller.findByIntegracao(tipo);

      expect(result).toEqual(telemedicinaApi);
      expect(service.findByIntegracao).toHaveBeenCalledWith(tipo);
    });

    it('deve funcionar para todos os tipos de integração', async () => {
      const tipos = ['api_rest', 'webhook', 'hl7', 'fhir', 'dicom', 'manual'];

      for (const tipo of tipos) {
        mockService.findByIntegracao.mockResolvedValue([mockTelemedicina]);

        const result = await controller.findByIntegracao(tipo);

        expect(result).toEqual([mockTelemedicina]);
        expect(service.findByIntegracao).toHaveBeenCalledWith(tipo);
      }
    });
  });

  describe('findByPlataforma', () => {
    it('deve retornar telemedicinas por tipo de plataforma', async () => {
      const tipo = 'web';
      const telemedicinasWeb = [mockTelemedicina];
      mockService.findByPlataforma.mockResolvedValue(telemedicinasWeb);

      const result = await controller.findByPlataforma(tipo);

      expect(result).toEqual(telemedicinasWeb);
      expect(service.findByPlataforma).toHaveBeenCalledWith(tipo);
    });

    it('deve funcionar para todos os tipos de plataforma', async () => {
      const tipos = ['web', 'mobile', 'desktop', 'hibrida'];

      for (const tipo of tipos) {
        mockService.findByPlataforma.mockResolvedValue([mockTelemedicina]);

        const result = await controller.findByPlataforma(tipo);

        expect(result).toEqual([mockTelemedicina]);
        expect(service.findByPlataforma).toHaveBeenCalledWith(tipo);
      }
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar telemedicina por código', async () => {
      const codigo = 'TELE001';
      mockService.findByCodigo.mockResolvedValue(mockTelemedicina);

      const result = await controller.findByCodigo(codigo);

      expect(result).toEqual(mockTelemedicina);
      expect(service.findByCodigo).toHaveBeenCalledWith(codigo);
    });

    it('deve propagar erro quando código não for encontrado', async () => {
      const codigo = 'TELE999';
      const notFoundError = new NotFoundException(
        'Telemedicina não encontrada',
      );
      mockService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo(codigo)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCodigo).toHaveBeenCalledWith(codigo);
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar telemedicina por CNPJ', async () => {
      const cnpj = '12.345.678/0001-90';
      mockService.findByCnpj.mockResolvedValue(mockTelemedicina);

      const result = await controller.findByCnpj(cnpj);

      expect(result).toEqual(mockTelemedicina);
      expect(service.findByCnpj).toHaveBeenCalledWith(cnpj);
    });

    it('deve propagar erro quando CNPJ não for encontrado', async () => {
      const cnpj = '00.000.000/0000-00';
      const notFoundError = new NotFoundException(
        'Telemedicina não encontrada',
      );
      mockService.findByCnpj.mockRejectedValue(notFoundError);

      await expect(controller.findByCnpj(cnpj)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCnpj).toHaveBeenCalledWith(cnpj);
    });
  });

  describe('findOne', () => {
    it('deve retornar telemedicina por ID', async () => {
      const id = 'telemedicina-uuid-1';
      mockService.findOne.mockResolvedValue(mockTelemedicina);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockTelemedicina);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('deve propagar erro quando ID não for encontrado', async () => {
      const id = 'invalid-uuid';
      const notFoundError = new NotFoundException(
        'Telemedicina não encontrada',
      );
      mockService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const updateTelemedicinaDto: UpdateTelemedicinaDto = {
      url_plataforma: 'https://nova-plataforma.com',
      telecirurgia: true,
      tempo_consulta_padrao: 45,
    };

    it('deve atualizar telemedicina com sucesso', async () => {
      const telemedicinaAtualizada = {
        ...mockTelemedicina,
        ...updateTelemedicinaDto,
      };

      mockService.update.mockResolvedValue(telemedicinaAtualizada);

      const result = await controller.update(
        'telemedicina-uuid-1',
        updateTelemedicinaDto,
      );

      expect(result).toEqual(telemedicinaAtualizada);
      expect(service.update).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
        updateTelemedicinaDto,
      );
    });

    it('deve propagar erro quando telemedicina não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Telemedicina não encontrada',
      );
      mockService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateTelemedicinaDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar dados da empresa', async () => {
      const updateComEmpresa = {
        empresa: {
          nomeFantasia: 'Novo Nome TeleMed',
          telefone: '(11) 9999-9999',
        } as any,
      };

      mockService.update.mockResolvedValue(mockTelemedicina);

      const result = await controller.update(
        'telemedicina-uuid-1',
        updateComEmpresa,
      );

      expect(result).toEqual(mockTelemedicina);
      expect(service.update).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
        updateComEmpresa,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const telemedicinaInativa = {
        ...mockTelemedicina,
        empresa: { ...mockTelemedicina.empresa, ativo: false },
      };

      mockService.toggleStatus.mockResolvedValue(telemedicinaInativa);

      const result = await controller.toggleStatus('telemedicina-uuid-1');

      expect(result).toEqual(telemedicinaInativa);
      expect(result.empresa.ativo).toBe(false);
      expect(service.toggleStatus).toHaveBeenCalledWith('telemedicina-uuid-1');
    });

    it('deve alternar status de inativo para ativo', async () => {
      const telemedicinaAtiva = {
        ...mockTelemedicina,
        empresa: { ...mockTelemedicina.empresa, ativo: true },
      };

      mockService.toggleStatus.mockResolvedValue(telemedicinaAtiva);

      const result = await controller.toggleStatus('telemedicina-uuid-1');

      expect(result).toEqual(telemedicinaAtiva);
      expect(result.empresa.ativo).toBe(true);
    });
  });

  describe('updateStatusIntegracao', () => {
    it('deve atualizar status de integração', async () => {
      const novoStatus = 'inativo';
      const telemedicinaAtualizada = {
        ...mockTelemedicina,
        status_integracao: novoStatus,
      };

      mockService.updateStatusIntegracao.mockResolvedValue(
        telemedicinaAtualizada,
      );

      const result = await controller.updateStatusIntegracao(
        'telemedicina-uuid-1',
        novoStatus,
      );

      expect(result).toEqual(telemedicinaAtualizada);
      expect(result.status_integracao).toBe(novoStatus);
      expect(service.updateStatusIntegracao).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
        novoStatus,
      );
    });

    it('deve funcionar para todos os status válidos', async () => {
      const statusValidos = ['ativo', 'inativo', 'pendente', 'erro'];

      for (const status of statusValidos) {
        const atualizado = { ...mockTelemedicina, status_integracao: status };
        mockService.updateStatusIntegracao.mockResolvedValue(atualizado);

        const result = await controller.updateStatusIntegracao(
          'telemedicina-uuid-1',
          status,
        );

        expect(result.status_integracao).toBe(status);
      }
    });
  });

  describe('remove', () => {
    it('deve remover telemedicina com sucesso', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('telemedicina-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('telemedicina-uuid-1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando telemedicina não for encontrada', async () => {
      const notFoundError = new NotFoundException(
        'Telemedicina não encontrada',
      );
      mockService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalid-id');
    });
  });
});
