import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { LaboratorioController } from './laboratorio.controller';
import { LaboratorioService } from '../services/laboratorio.service';
import { CreateLaboratorioDto } from '../dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';
import { TipoIntegracao } from '../entities/laboratorio.entity';

describe('LaboratorioController', () => {
  let controller: LaboratorioController;
  let service: LaboratorioService;

  const mockLaboratorio = {
    id: 'lab-uuid-1',
    empresa: {
      id: 'empresa-uuid-1',
      cnpj: '12.345.678/0001-90',
      razao_social: 'Laboratório Teste Ltda',
      nome_fantasia: 'Lab Teste',
      ativo: true,
    },
    codigo: 'LAB001',
    responsavel_tecnico: 'Dr. João Silva',
    conselho_responsavel: 'CRF',
    numero_conselho: '12345',
    tipo_integracao: TipoIntegracao.API,
    url_integracao: 'https://api.labteste.com.br',
    aceita_urgencia: true,
    prazo_entrega_normal: 3,
    prazo_entrega_urgente: 1,
    percentual_repasse: 30.0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    findAceitamUrgencia: jest.fn(),
    search: jest.fn(),
    findByIntegracao: jest.fn(),
    findByCodigo: jest.fn(),
    findByCnpj: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaboratorioController],
      providers: [
        {
          provide: LaboratorioService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LaboratorioController>(LaboratorioController);
    service = module.get<LaboratorioService>(LaboratorioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createLaboratorioDto: CreateLaboratorioDto = {
      cnpj: '12345678000190',
      razao_social: 'Laboratório Teste Ltda',
      nome_fantasia: 'Lab Teste',
      endereco: 'Rua Teste, 123',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01234567',
      telefone_principal: '11987654321',
      email_principal: 'contato@labteste.com.br',
      codigo: 'LAB001',
      responsavel_tecnico: 'Dr. João Silva',
      conselho_responsavel: 'CRF',
      numero_conselho: '12345',
      tipo_integracao: TipoIntegracao.API,
      ativo: true,
    };

    it('deve criar um laboratório com sucesso', async () => {
      mockService.create.mockResolvedValue(mockLaboratorio);

      const result = await controller.create(createLaboratorioDto);

      expect(result).toEqual(mockLaboratorio);
      expect(service.create).toHaveBeenCalledWith(createLaboratorioDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conflito do service', async () => {
      const conflictError = new BadRequestException('Código já existente');
      mockService.create.mockRejectedValue(conflictError);

      await expect(controller.create(createLaboratorioDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(createLaboratorioDto);
    });

    it('deve criar laboratório com dados de integração', async () => {
      const createComIntegracao = {
        ...createLaboratorioDto,
        url_integracao: 'https://api.labteste.com.br',
        token_integracao: 'token123',
        usuario_integracao: 'usuario',
        senha_integracao: 'senha123',
      };

      const laboratorioComIntegracao = {
        ...mockLaboratorio,
        url_integracao: 'https://api.labteste.com.br',
        token_integracao: 'token123',
      };

      mockService.create.mockResolvedValue(laboratorioComIntegracao);

      const result = await controller.create(createComIntegracao);

      expect(result).toEqual(laboratorioComIntegracao);
      expect(service.create).toHaveBeenCalledWith(createComIntegracao);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de laboratórios', async () => {
      const laboratorios = [mockLaboratorio];
      mockService.findAll.mockResolvedValue(laboratorios);

      const result = await controller.findAll();

      expect(result).toEqual(laboratorios);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há laboratórios', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas laboratórios ativos', async () => {
      const laboratoriosAtivos = [mockLaboratorio];
      mockService.findAtivos.mockResolvedValue(laboratoriosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual(laboratoriosAtivos);
      expect(service.findAtivos).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há laboratórios ativos', async () => {
      mockService.findAtivos.mockResolvedValue([]);

      const result = await controller.findAtivos();

      expect(result).toEqual([]);
    });
  });

  describe('findAceitamUrgencia', () => {
    it('deve retornar laboratórios que aceitam urgência', async () => {
      const laboratoriosUrgencia = [
        { ...mockLaboratorio, aceita_urgencia: true },
      ];
      mockService.findAceitamUrgencia.mockResolvedValue(laboratoriosUrgencia);

      const result = await controller.findAceitamUrgencia();

      expect(result).toEqual(laboratoriosUrgencia);
      expect(service.findAceitamUrgencia).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando nenhum aceita urgência', async () => {
      mockService.findAceitamUrgencia.mockResolvedValue([]);

      const result = await controller.findAceitamUrgencia();

      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('deve buscar laboratórios por termo', async () => {
      const termoBusca = 'Lab Teste';
      const laboratoriosEncontrados = [mockLaboratorio];
      mockService.search.mockResolvedValue(laboratoriosEncontrados);

      const result = await controller.search(termoBusca);

      expect(result).toEqual(laboratoriosEncontrados);
      expect(service.search).toHaveBeenCalledWith(termoBusca);
    });

    it('deve retornar lista vazia para termo não encontrado', async () => {
      mockService.search.mockResolvedValue([]);

      const result = await controller.search('termo inexistente');

      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith('termo inexistente');
    });

    it('deve buscar por CNPJ', async () => {
      const cnpj = '12.345.678/0001-90';
      mockService.search.mockResolvedValue([mockLaboratorio]);

      const result = await controller.search(cnpj);

      expect(result).toEqual([mockLaboratorio]);
      expect(service.search).toHaveBeenCalledWith(cnpj);
    });

    it('deve buscar por código', async () => {
      const codigo = 'LAB001';
      mockService.search.mockResolvedValue([mockLaboratorio]);

      const result = await controller.search(codigo);

      expect(result).toEqual([mockLaboratorio]);
      expect(service.search).toHaveBeenCalledWith(codigo);
    });
  });

  describe('findByIntegracao', () => {
    it('deve retornar laboratórios por tipo de integração', async () => {
      const tipo = 'api';
      const laboratoriosApi = [mockLaboratorio];
      mockService.findByIntegracao.mockResolvedValue(laboratoriosApi);

      const result = await controller.findByIntegracao(tipo);

      expect(result).toEqual(laboratoriosApi);
      expect(service.findByIntegracao).toHaveBeenCalledWith(tipo);
    });

    it('deve funcionar para todos os tipos de integração', async () => {
      const tipos = ['api', 'webservice', 'manual', 'ftp', 'email'];

      for (const tipo of tipos) {
        mockService.findByIntegracao.mockResolvedValue([mockLaboratorio]);

        const result = await controller.findByIntegracao(tipo);

        expect(result).toEqual([mockLaboratorio]);
        expect(service.findByIntegracao).toHaveBeenCalledWith(tipo);
      }
    });

    it('deve retornar lista vazia para tipo sem laboratórios', async () => {
      mockService.findByIntegracao.mockResolvedValue([]);

      const result = await controller.findByIntegracao('manual');

      expect(result).toEqual([]);
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar laboratório por código', async () => {
      const codigo = 'LAB001';
      mockService.findByCodigo.mockResolvedValue(mockLaboratorio);

      const result = await controller.findByCodigo(codigo);

      expect(result).toEqual(mockLaboratorio);
      expect(service.findByCodigo).toHaveBeenCalledWith(codigo);
    });

    it('deve propagar erro quando código não for encontrado', async () => {
      const codigo = 'LAB999';
      const notFoundError = new NotFoundException('Laboratório não encontrado');
      mockService.findByCodigo.mockRejectedValue(notFoundError);

      await expect(controller.findByCodigo(codigo)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCodigo).toHaveBeenCalledWith(codigo);
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar laboratório por CNPJ', async () => {
      const cnpj = '12.345.678/0001-90';
      mockService.findByCnpj.mockResolvedValue(mockLaboratorio);

      const result = await controller.findByCnpj(cnpj);

      expect(result).toEqual(mockLaboratorio);
      expect(service.findByCnpj).toHaveBeenCalledWith(cnpj);
    });

    it('deve propagar erro quando CNPJ não for encontrado', async () => {
      const cnpj = '00.000.000/0000-00';
      const notFoundError = new NotFoundException('Laboratório não encontrado');
      mockService.findByCnpj.mockRejectedValue(notFoundError);

      await expect(controller.findByCnpj(cnpj)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByCnpj).toHaveBeenCalledWith(cnpj);
    });

    it('deve funcionar com CNPJ sem formatação', async () => {
      const cnpjSemFormato = '12345678000190';
      mockService.findByCnpj.mockResolvedValue(mockLaboratorio);

      const result = await controller.findByCnpj(cnpjSemFormato);

      expect(result).toEqual(mockLaboratorio);
      expect(service.findByCnpj).toHaveBeenCalledWith(cnpjSemFormato);
    });
  });

  describe('findOne', () => {
    it('deve retornar laboratório por ID', async () => {
      const id = 'lab-uuid-1';
      mockService.findOne.mockResolvedValue(mockLaboratorio);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockLaboratorio);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('deve propagar erro quando ID não for encontrado', async () => {
      const id = 'invalid-uuid';
      const notFoundError = new NotFoundException('Laboratório não encontrado');
      mockService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const updateLaboratorioDto: UpdateLaboratorioDto = {
      nome_fantasia: 'Lab Teste Atualizado',
      responsavel_tecnico: 'Dr. Maria Silva',
      aceita_urgencia: false,
    };

    it('deve atualizar laboratório com sucesso', async () => {
      const laboratorioAtualizado = {
        ...mockLaboratorio,
        ...updateLaboratorioDto,
      };

      mockService.update.mockResolvedValue(laboratorioAtualizado);

      const result = await controller.update(
        'lab-uuid-1',
        updateLaboratorioDto,
      );

      expect(result).toEqual(laboratorioAtualizado);
      expect(service.update).toHaveBeenCalledWith(
        'lab-uuid-1',
        updateLaboratorioDto,
      );
    });

    it('deve propagar erro quando laboratório não for encontrado', async () => {
      const notFoundError = new NotFoundException('Laboratório não encontrado');
      mockService.update.mockRejectedValue(notFoundError);

      await expect(
        controller.update('invalid-id', updateLaboratorioDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar dados de integração', async () => {
      const updateIntegracao = {
        tipo_integracao: TipoIntegracao.WEBSERVICE,
        url_integracao: 'https://ws.novolab.com.br',
        token_integracao: 'novotoken123',
      };

      const laboratorioComNovaIntegracao = {
        ...mockLaboratorio,
        ...updateIntegracao,
      };

      mockService.update.mockResolvedValue(laboratorioComNovaIntegracao);

      const result = await controller.update('lab-uuid-1', updateIntegracao);

      expect(result).toEqual(laboratorioComNovaIntegracao);
      expect(service.update).toHaveBeenCalledWith(
        'lab-uuid-1',
        updateIntegracao,
      );
    });

    it('deve atualizar prazos de entrega', async () => {
      const updatePrazos = {
        prazo_entrega_normal: 5,
        prazo_entrega_urgente: 2,
        taxa_urgencia: 50.0,
      };

      const laboratorioComNovosPrazos = {
        ...mockLaboratorio,
        ...updatePrazos,
      };

      mockService.update.mockResolvedValue(laboratorioComNovosPrazos);

      const result = await controller.update('lab-uuid-1', updatePrazos);

      expect(result).toEqual(laboratorioComNovosPrazos);
      expect(result.prazo_entrega_normal).toBe(5);
      expect(result.prazo_entrega_urgente).toBe(2);
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const laboratorioInativo = {
        ...mockLaboratorio,
        empresa: { ...mockLaboratorio.empresa, ativo: false },
      };

      mockService.toggleStatus.mockResolvedValue(laboratorioInativo);

      const result = await controller.toggleStatus('lab-uuid-1');

      expect(result).toEqual(laboratorioInativo);
      expect(result.empresa.ativo).toBe(false);
      expect(service.toggleStatus).toHaveBeenCalledWith('lab-uuid-1');
    });

    it('deve alternar status de inativo para ativo', async () => {
      const laboratorioAtivo = {
        ...mockLaboratorio,
        empresa: { ...mockLaboratorio.empresa, ativo: true },
      };

      mockService.toggleStatus.mockResolvedValue(laboratorioAtivo);

      const result = await controller.toggleStatus('lab-uuid-1');

      expect(result).toEqual(laboratorioAtivo);
      expect(result.empresa.ativo).toBe(true);
    });

    it('deve propagar erro quando laboratório não for encontrado', async () => {
      const notFoundError = new NotFoundException('Laboratório não encontrado');
      mockService.toggleStatus.mockRejectedValue(notFoundError);

      await expect(controller.toggleStatus('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover laboratório com sucesso', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('lab-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('lab-uuid-1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro quando laboratório não for encontrado', async () => {
      const notFoundError = new NotFoundException('Laboratório não encontrado');
      mockService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith('invalid-id');
    });

    it('deve retornar void quando remoção for bem-sucedida', async () => {
      mockService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('lab-uuid-1');

      expect(result).toBeUndefined();
    });
  });
});
