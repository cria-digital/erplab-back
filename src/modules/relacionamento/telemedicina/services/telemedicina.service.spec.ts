import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { TelemedicinaService } from './telemedicina.service';
import {
  Telemedicina,
  TipoIntegracaoTelemedicina,
  TipoPlataforma,
  StatusIntegracao,
} from '../entities/telemedicina.entity';
import { Empresa } from '../../../cadastros/empresas/entities/empresa.entity';
import { CreateTelemedicinaDto } from '../dto/create-telemedicina.dto';
import { UpdateTelemedicinaDto } from '../dto/update-telemedicina.dto';
import { TipoEmpresaEnum } from '../../../cadastros/empresas/enums/empresas.enum';

describe('TelemedicinaService', () => {
  let service: TelemedicinaService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getRawMany: jest.fn(),
  };

  const mockTelemedicinaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockEmpresaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  const mockEmpresa = {
    id: 'empresa-uuid-1',
    tipoEmpresa: TipoEmpresaEnum.TELEMEDICINA,
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Telemedicina Teste Ltda',
    nomeFantasia: 'TeleMed Teste',
    ativo: true,
  };

  const mockTelemedicina = {
    id: 'telemedicina-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: mockEmpresa,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemedicinaService,
        {
          provide: getRepositoryToken(Telemedicina),
          useValue: mockTelemedicinaRepository,
        },
        {
          provide: getRepositoryToken(Empresa),
          useValue: mockEmpresaRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TelemedicinaService>(TelemedicinaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(null); // código único
      mockEmpresaRepository.findOne.mockResolvedValueOnce(null); // CNPJ único
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockTelemedicina);
      mockTelemedicinaRepository.create.mockReturnValue(mockTelemedicina);
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(
        mockTelemedicina,
      ); // findOne após criar

      const result = await service.create(createTelemedicinaDto);

      expect(result).toEqual(mockTelemedicina);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('deve retornar erro quando código já existir', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);

      await expect(service.create(createTelemedicinaDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('deve retornar erro quando CNPJ já existir', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(null);
      mockEmpresaRepository.findOne.mockResolvedValue(mockEmpresa);

      await expect(service.create(createTelemedicinaDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar telemedicina com todos os campos opcionais', async () => {
      const createCompleto = {
        ...createTelemedicinaDto,
        url_integracao: 'https://api.telemedicina.com',
        token_integracao: 'token123',
        especialidades_atendidas: ['cardiologia', 'neurologia'],
        tempo_consulta_padrao: 30,
        valor_consulta_particular: 150.0,
      };

      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(null);
      mockEmpresaRepository.findOne.mockResolvedValueOnce(null);
      mockEmpresaRepository.create.mockReturnValue(mockEmpresa);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockTelemedicina);
      mockTelemedicinaRepository.create.mockReturnValue(mockTelemedicina);
      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(
        mockTelemedicina,
      );

      const result = await service.create(createCompleto);

      expect(result).toEqual(mockTelemedicina);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de telemedicinas ordenada', async () => {
      const telemedicinas = [mockTelemedicina];
      mockTelemedicinaRepository.find.mockResolvedValue(telemedicinas);

      const result = await service.findAll();

      expect(result).toEqual(telemedicinas);
      expect(mockTelemedicinaRepository.find).toHaveBeenCalledWith({
        relations: ['empresa'],
      });
    });

    it('deve retornar lista vazia quando não há telemedicinas', async () => {
      mockTelemedicinaRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma telemedicina por ID', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);

      const result = await service.findOne('telemedicina-uuid-1');

      expect(result).toEqual(mockTelemedicina);
      expect(mockTelemedicinaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'telemedicina-uuid-1' },
        relations: ['empresa'],
      });
    });

    it('deve retornar erro quando telemedicina não for encontrada', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar telemedicina por código', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);

      const result = await service.findByCodigo('TELE001');

      expect(result).toEqual(mockTelemedicina);
      expect(mockTelemedicinaRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_telemedicina: 'TELE001' },
        relations: ['empresa'],
      });
    });

    it('deve retornar erro quando código não for encontrado', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCnpj', () => {
    it('deve retornar telemedicina por CNPJ', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(mockTelemedicina);

      const result = await service.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockTelemedicina);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.cnpj = :cnpj',
        { cnpj: '12.345.678/0001-90' },
      );
    });

    it('deve retornar erro quando CNPJ não for encontrado', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findByCnpj('00.000.000/0000-00')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAtivos', () => {
    it('deve retornar apenas telemedicinas ativas', async () => {
      const telemedicinaAtivas = [mockTelemedicina];
      mockQueryBuilder.getMany.mockResolvedValue(telemedicinaAtivas);

      const result = await service.findAtivos();

      expect(result).toEqual(telemedicinaAtivas);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'empresa.ativo = :ativo',
        { ativo: true },
      );
    });
  });

  describe('findByIntegracao', () => {
    it('deve retornar telemedicinas por tipo de integração', async () => {
      const telemedicinasApi = [mockTelemedicina];
      mockTelemedicinaRepository.find.mockResolvedValue(telemedicinasApi);

      const result = await service.findByIntegracao('api_rest');

      expect(result).toEqual(telemedicinasApi);
      expect(mockTelemedicinaRepository.find).toHaveBeenCalledWith({
        where: { tipo_integracao: 'api_rest' },
        relations: ['empresa'],
      });
    });
  });

  describe('findByPlataforma', () => {
    it('deve retornar telemedicinas por tipo de plataforma', async () => {
      const telemedicinasWeb = [mockTelemedicina];
      mockTelemedicinaRepository.find.mockResolvedValue(telemedicinasWeb);

      const result = await service.findByPlataforma('web');

      expect(result).toEqual(telemedicinasWeb);
      expect(mockTelemedicinaRepository.find).toHaveBeenCalledWith({
        where: { tipo_plataforma: 'web' },
        relations: ['empresa'],
      });
    });
  });

  describe('update', () => {
    const updateTelemedicinaDto: UpdateTelemedicinaDto = {
      url_plataforma: 'https://nova-plataforma.com',
      telecirurgia: true,
    };

    it('deve atualizar telemedicina com sucesso', async () => {
      const telemedicinaAtualizada = {
        ...mockTelemedicina,
        ...updateTelemedicinaDto,
      };

      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);
      mockQueryRunner.manager.save.mockResolvedValue(telemedicinaAtualizada);

      const result = await service.update(
        'telemedicina-uuid-1',
        updateTelemedicinaDto,
      );

      expect(result).toEqual(mockTelemedicina);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('deve verificar duplicidade de código ao atualizar', async () => {
      const updateComNovoCodigo = {
        codigo_telemedicina: 'TELE002',
      };

      mockTelemedicinaRepository.findOne
        .mockResolvedValueOnce(mockTelemedicina) // findOne inicial
        .mockResolvedValueOnce({ ...mockTelemedicina, id: 'outro-id' }); // código já existe

      await expect(
        service.update('telemedicina-uuid-1', updateComNovoCodigo),
      ).rejects.toThrow(ConflictException);
    });

    it('deve atualizar dados da empresa quando fornecidos', async () => {
      const updateComEmpresa = {
        empresa: {
          nomeFantasia: 'Novo Nome',
          emailComercial: 'novo@email.com',
        } as any,
      };

      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockEmpresa)
        .mockResolvedValueOnce(mockTelemedicina);

      await service.update('telemedicina-uuid-1', updateComEmpresa);

      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2);
    });

    it('deve verificar duplicidade de CNPJ ao atualizar empresa', async () => {
      const updateComNovoCnpj = {
        empresa: {
          cnpj: '98.765.432/0001-10',
        } as any,
      };

      mockTelemedicinaRepository.findOne.mockResolvedValueOnce(
        mockTelemedicina,
      );
      mockEmpresaRepository.findOne.mockResolvedValue({
        ...mockEmpresa,
        id: 'outro-id',
      });

      await expect(
        service.update('telemedicina-uuid-1', updateComNovoCnpj),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve remover telemedicina com sucesso', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(mockTelemedicina);
      mockTelemedicinaRepository.remove.mockResolvedValue(mockTelemedicina);

      await service.remove('telemedicina-uuid-1');

      expect(mockTelemedicinaRepository.remove).toHaveBeenCalledWith(
        mockTelemedicina,
      );
    });

    it('deve retornar erro quando telemedicina não for encontrada', async () => {
      mockTelemedicinaRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleStatus', () => {
    it('deve alternar status de ativo para inativo', async () => {
      const telemedicinaInativa = {
        ...mockTelemedicina,
        empresa: { ...mockEmpresa, ativo: false },
      };

      mockTelemedicinaRepository.findOne
        .mockResolvedValueOnce(mockTelemedicina)
        .mockResolvedValueOnce(telemedicinaInativa);
      mockEmpresaRepository.save.mockResolvedValue({
        ...mockEmpresa,
        ativo: false,
      });

      const result = await service.toggleStatus('telemedicina-uuid-1');

      expect(result.empresa.ativo).toBe(false);
    });

    it('deve alternar status de inativo para ativo', async () => {
      const telemedicinaInativa = {
        ...mockTelemedicina,
        empresa: { ...mockEmpresa, ativo: false },
      };

      const telemedicinaAtiva = {
        ...mockTelemedicina,
        empresa: { ...mockEmpresa, ativo: true },
      };

      mockTelemedicinaRepository.findOne
        .mockResolvedValueOnce(telemedicinaInativa)
        .mockResolvedValueOnce(telemedicinaAtiva);
      mockEmpresaRepository.save.mockResolvedValue({
        ...mockEmpresa,
        ativo: true,
      });

      const result = await service.toggleStatus('telemedicina-uuid-1');

      expect(result.empresa.ativo).toBe(true);
    });
  });

  describe('search', () => {
    it('deve buscar telemedicinas por termo', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockTelemedicina]);

      const result = await service.search('teste');

      expect(result).toEqual([mockTelemedicina]);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledTimes(3);
    });

    it('deve retornar lista vazia para busca sem resultados', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.search('inexistente');

      expect(result).toEqual([]);
    });
  });

  describe('updateStatusIntegracao', () => {
    it('deve atualizar status de integração', async () => {
      const telemedicinaAtualizada = {
        ...mockTelemedicina,
        status_integracao: StatusIntegracao.INATIVO,
      };

      mockTelemedicinaRepository.findOne
        .mockResolvedValueOnce(mockTelemedicina)
        .mockResolvedValueOnce(telemedicinaAtualizada);
      mockTelemedicinaRepository.save.mockResolvedValue(telemedicinaAtualizada);

      const result = await service.updateStatusIntegracao(
        'telemedicina-uuid-1',
        'inativo',
      );

      expect(result.status_integracao).toBe('inativo');
    });
  });

  describe('getEstatisticas', () => {
    it('deve retornar estatísticas das telemedicinas', async () => {
      mockTelemedicinaRepository.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8); // ativos

      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce([
          { tipo: 'api_rest', total: 5 },
          { tipo: 'webhook', total: 3 },
        ])
        .mockResolvedValueOnce([
          { tipo: 'web', total: 6 },
          { tipo: 'mobile', total: 4 },
        ]);

      const result = await service.getEstatisticas();

      expect(result).toEqual({
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
      });
    });
  });
});
