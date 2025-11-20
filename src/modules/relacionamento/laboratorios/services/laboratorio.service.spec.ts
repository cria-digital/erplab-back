import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { LaboratorioService } from './laboratorio.service';
import { Laboratorio, TipoIntegracao } from '../entities/laboratorio.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('LaboratorioService', () => {
  let service: LaboratorioService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockLaboratorioRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.LABORATORIO_APOIO,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Laboratório Teste Ltda',
    nomeFantasia: 'Lab Teste',
    emailComercial: 'contato@labteste.com.br',
    ativo: true,
  } as Empresa;

  const mockLaboratorio = {
    id: 'laboratorio-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: mockEmpresa,
    codigo_laboratorio: 'LAB001',
    responsavel_tecnico: 'Dr. João Silva',
    conselho_responsavel: 'CRF',
    numero_conselho: '12345',
    tipo_integracao: TipoIntegracao.API,
    url_integracao: 'https://api.labteste.com.br',
    token_integracao: 'token123',
    usuario_integracao: 'usuario_api',
    senha_integracao: 'senha_api',
    configuracao_adicional: '{"timeout": 30}',
    metodos_envio_resultado: ['api', 'email'],
    portal_resultados_url: 'https://resultados.labteste.com.br',
    prazo_entrega_normal: 3,
    prazo_entrega_urgente: 1,
    taxa_urgencia: 50.0,
    percentual_repasse: 80.0,
    aceita_urgencia: true,
    envia_resultado_automatico: true,
    observacoes: 'Laboratório especializado em análises clínicas',
    created_at: new Date(),
    updated_at: new Date(),
  } as Laboratorio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LaboratorioService,
        {
          provide: getRepositoryToken(Laboratorio),
          useValue: mockLaboratorioRepository,
        },
      ],
    }).compile();

    service = module.get<LaboratorioService>(LaboratorioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar lista de laboratórios ordenada por código', async () => {
      const laboratorios = [mockLaboratorio];
      mockLaboratorioRepository.find.mockResolvedValue(laboratorios);

      const result = await service.findAll();

      expect(result).toEqual(laboratorios);
      expect(mockLaboratorioRepository.find).toHaveBeenCalledWith({
        relations: ['empresa'],
        order: { codigo_laboratorio: 'ASC' },
      });
    });

    it('deve retornar lista vazia quando não há laboratórios', async () => {
      mockLaboratorioRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um laboratório por ID', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);

      const result = await service.findOne('laboratorio-uuid-1');

      expect(result).toEqual(mockLaboratorio);
      expect(mockLaboratorioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'laboratorio-uuid-1' },
      });
    });

    it('deve retornar erro quando laboratório não for encontrado', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar laboratório por código', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);

      const result = await service.findByCodigo('LAB001');

      expect(result).toEqual(mockLaboratorio);
      expect(mockLaboratorioRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_laboratorio: 'LAB001' },
        relations: ['empresa'],
      });
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INEXISTENTE')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar laboratório por CNPJ da empresa', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockLaboratorio);
      expect(mockLaboratorioRepository.findOne).toHaveBeenCalledWith({
        where: { empresa: { cnpj: '12.345.678/0001-90' } },
        relations: ['empresa'],
      });
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas laboratórios ativos', async () => {
      const laboratoriosAtivos = [mockLaboratorio];
      mockLaboratorioRepository.find.mockResolvedValue(laboratoriosAtivos);

      const result = await service.findAtivos();

      expect(result).toEqual(laboratoriosAtivos);
      expect(mockLaboratorioRepository.find).toHaveBeenCalledWith({
        where: { empresa: { ativo: true } },
        relations: ['empresa'],
        order: { codigo_laboratorio: 'ASC' },
      });
    });

    it('deve retornar lista vazia quando não há laboratórios ativos', async () => {
      mockLaboratorioRepository.find.mockResolvedValue([]);

      const result = await service.findAtivos();

      expect(result).toEqual([]);
    });
  });

  describe('findByIntegracao', () => {
    it('deve retornar laboratórios por tipo de integração', async () => {
      const laboratoriosApi = [mockLaboratorio];
      mockLaboratorioRepository.find.mockResolvedValue(laboratoriosApi);

      const result = await service.findByIntegracao('api');

      expect(result).toEqual(laboratoriosApi);
      expect(mockLaboratorioRepository.find).toHaveBeenCalledWith({
        where: {
          tipo_integracao: 'api',
          empresa: { ativo: true },
        },
        relations: ['empresa'],
        order: { codigo_laboratorio: 'ASC' },
      });
    });

    it('deve retornar laboratórios com integração webservice', async () => {
      const laboratoriosWs = [
        {
          ...mockLaboratorio,
          tipo_integracao: TipoIntegracao.WEBSERVICE,
        },
      ];
      mockLaboratorioRepository.find.mockResolvedValue(laboratoriosWs);

      const result = await service.findByIntegracao('webservice');

      expect(result).toEqual(laboratoriosWs);
      expect(mockLaboratorioRepository.find).toHaveBeenCalledWith({
        where: {
          tipo_integracao: 'webservice',
          empresa: { ativo: true },
        },
        relations: ['empresa'],
        order: { codigo_laboratorio: 'ASC' },
      });
    });

    it('deve retornar lista vazia para tipo de integração sem laboratórios', async () => {
      mockLaboratorioRepository.find.mockResolvedValue([]);

      const result = await service.findByIntegracao('ftp');

      expect(result).toEqual([]);
    });
  });

  describe('findAceitamUrgencia', () => {
    it('deve retornar apenas laboratórios que aceitam urgência', async () => {
      const laboratoriosUrgencia = [mockLaboratorio];
      mockLaboratorioRepository.find.mockResolvedValue(laboratoriosUrgencia);

      const result = await service.findAceitamUrgencia();

      expect(result).toEqual(laboratoriosUrgencia);
      expect(mockLaboratorioRepository.find).toHaveBeenCalledWith({
        where: {
          aceita_urgencia: true,
          empresa: { ativo: true },
        },
        relations: ['empresa'],
        order: { codigo_laboratorio: 'ASC' },
      });
    });

    it('deve retornar lista vazia quando não há laboratórios que aceitam urgência', async () => {
      mockLaboratorioRepository.find.mockResolvedValue([]);

      const result = await service.findAceitamUrgencia();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    const updateLaboratorioDto: UpdateLaboratorioDto = {
      responsavelTecnico: 'Dr. Maria Silva',
      prazoEntregaNormal: 2,
      percentualRepasse: 85.0,
    };

    it('deve atualizar um laboratório com sucesso', async () => {
      const laboratorioAtualizado = {
        ...mockLaboratorio,
        responsavel_tecnico: 'Dr. Maria Silva',
        prazo_entrega_normal: 2,
        percentual_repasse: 85.0,
      };

      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);
      mockLaboratorioRepository.save.mockResolvedValue(laboratorioAtualizado);

      const result = await service.update(
        'laboratorio-uuid-1',
        updateLaboratorioDto,
      );

      expect(result).toEqual(laboratorioAtualizado);
      expect(mockLaboratorioRepository.save).toHaveBeenCalled();
    });

    it('deve retornar erro quando laboratório não for encontrado', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', updateLaboratorioDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve atualizar configurações de integração', async () => {
      const updateIntegracao = {
        tipoIntegracao: TipoIntegracao.WEBSERVICE,
        urlIntegracao: 'https://nova-api.labteste.com.br',
        tokenIntegracao: 'novo-token-456',
        aceitaUrgencia: false,
      };

      const laboratorioAtualizado = {
        ...mockLaboratorio,
        tipo_integracao: TipoIntegracao.WEBSERVICE,
        url_integracao: 'https://nova-api.labteste.com.br',
        token_integracao: 'novo-token-456',
        aceita_urgencia: false,
      };

      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);
      mockLaboratorioRepository.save.mockResolvedValue(laboratorioAtualizado);

      const result = await service.update(
        'laboratorio-uuid-1',
        updateIntegracao,
      );

      expect(result.tipo_integracao).toBe(TipoIntegracao.WEBSERVICE);
      expect(result.url_integracao).toBe('https://nova-api.labteste.com.br');
      expect(result.aceita_urgencia).toBe(false);
    });

    it('deve atualizar dados financeiros', async () => {
      const updateFinanceiro = {
        taxaUrgencia: 100.0,
        percentualRepasse: 90.0,
        prazoEntregaNormal: 1,
        prazoEntregaUrgente: 0.5,
      };

      const laboratorioAtualizado = {
        ...mockLaboratorio,
        taxa_urgencia: 100.0,
        percentual_repasse: 90.0,
        prazo_entrega_normal: 1,
        prazo_entrega_urgente: 0.5,
      };

      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);
      mockLaboratorioRepository.save.mockResolvedValue(laboratorioAtualizado);

      const result = await service.update(
        'laboratorio-uuid-1',
        updateFinanceiro,
      );

      expect(result.taxa_urgencia).toBe(100.0);
      expect(result.percentual_repasse).toBe(90.0);
      expect(result.prazo_entrega_normal).toBe(1);
    });
  });

  describe('remove', () => {
    it('deve remover um laboratório com sucesso', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);
      mockLaboratorioRepository.remove.mockResolvedValue(mockLaboratorio);

      await service.remove('laboratorio-uuid-1');

      expect(mockLaboratorioRepository.remove).toHaveBeenCalledWith(
        mockLaboratorio,
      );
    });

    it('deve retornar erro quando laboratório não for encontrado', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve ativar laboratório inativo', async () => {
      const laboratorioInativo = {
        ...mockLaboratorio,
        empresa: { ...mockEmpresa, ativo: false },
      };

      const laboratorioAtivado = {
        ...mockLaboratorio,
        empresa: { ...mockEmpresa, ativo: true },
      };

      mockLaboratorioRepository.findOne.mockResolvedValue(laboratorioInativo);
      mockLaboratorioRepository.save.mockResolvedValue(laboratorioAtivado);

      const result = await service.toggleStatus('laboratorio-uuid-1');

      expect(result.empresa.ativo).toBe(true);
      expect(mockLaboratorioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'laboratorio-uuid-1' },
        relations: ['empresa'],
      });
    });

    it('deve desativar laboratório ativo', async () => {
      const laboratorioDesativado = {
        ...mockLaboratorio,
        empresa: { ...mockEmpresa, ativo: false },
      };

      mockLaboratorioRepository.findOne.mockResolvedValue(mockLaboratorio);
      mockLaboratorioRepository.save.mockResolvedValue(laboratorioDesativado);

      const result = await service.toggleStatus('laboratorio-uuid-1');

      expect(result.empresa.ativo).toBe(false);
    });

    it('deve retornar erro quando laboratório não for encontrado', async () => {
      mockLaboratorioRepository.findOne.mockResolvedValue(null);

      await expect(service.toggleStatus('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('deve buscar laboratórios por nome fantasia', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockLaboratorio]);

      const result = await service.search('Teste');

      expect(result).toEqual([mockLaboratorio]);
      expect(mockLaboratorioRepository.createQueryBuilder).toHaveBeenCalledWith(
        'laboratorio',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'laboratorio.empresa',
        'empresa',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.nomeFantasia ILIKE :query',
        { query: '%Teste%' },
      );
    });

    it('deve buscar laboratórios por razão social', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockLaboratorio]);

      await service.search('Ltda');

      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'empresa.razaoSocial ILIKE :query',
        { query: '%Ltda%' },
      );
    });

    it('deve buscar laboratórios por CNPJ', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockLaboratorio]);

      await service.search('12.345.678');

      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'empresa.cnpj LIKE :query',
        { query: '%12.345.678%' },
      );
    });

    it('deve buscar laboratórios por código', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockLaboratorio]);

      await service.search('LAB001');

      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith(
        'laboratorio.codigo_laboratorio LIKE :query',
        { query: '%LAB001%' },
      );
    });

    it('deve retornar lista vazia quando não encontrar resultados', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('inexistente');

      expect(result).toEqual([]);
    });

    it('deve ordenar resultados por nome fantasia', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockLaboratorio]);

      await service.search('Teste');

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'empresa.nomeFantasia',
        'ASC',
      );
    });
  });
});
