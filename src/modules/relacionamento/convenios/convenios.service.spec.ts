import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { ConveniosService } from './convenios.service';
import { Convenio } from './entities/convenio.entity';
import { CreateConvenioExamesDto } from '../../exames/exames/dto/create-convenio-exames.dto';
import { UpdateConvenioExamesDto } from '../../exames/exames/dto/update-convenio-exames.dto';

describe('ConveniosService', () => {
  let service: ConveniosService;

  const mockConvenio = {
    id: 'convenio-uuid-1',
    empresa_id: 'empresa-uuid-1',
    codigo_convenio: 'CONV001',
    nome: 'Unimed Brasília',
    registro_ans: '123456',
    tem_integracao_api: true,
    url_api: 'https://api.unimed.com.br',
    token_api: 'token123',
    requer_autorizacao: true,
    requer_senha: false,
    validade_guia_dias: 30,
    tipo_faturamento: 'tiss',
    portal_envio: 'SAVI',
    dia_fechamento: 15,
    prazo_pagamento_dias: 30,
    percentual_desconto: 10.5,
    tabela_precos: 'AMB',
    telefone: '61999999999',
    email: 'contato@unimed.com.br',
    contato_nome: 'João Silva',
    regras_especificas: {},
    status: 'ativo',
    aceita_atendimento_online: false,
    percentual_coparticipacao: null,
    valor_consulta: null,
    observacoes_convenio: null,
    criado_em: new Date(),
    atualizado_em: new Date(),
    empresa: {
      id: 'empresa-uuid-1',
      cnpj: '12345678000199',
      razao_social: 'Unimed Brasília Cooperativa',
      nome_fantasia: 'Unimed Brasília',
    } as any,
    planos: [],
    instrucoes: [],
  } as any as Convenio;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConveniosService,
        {
          provide: getRepositoryToken(Convenio),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ConveniosService>(ConveniosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createConvenioDto: CreateConvenioExamesDto = {
      codigo: 'CONV001',
      nome: 'Unimed Brasília',
      razao_social: 'Unimed Brasília Cooperativa',
      cnpj: '12345678000199',
      email: 'contato@unimed.com.br',
      telefone: '61999999999',
    };

    it('deve criar um convênio com sucesso', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockConvenio);
      mockRepository.save.mockResolvedValue(mockConvenio);

      const result = await service.create(createConvenioDto);

      expect(result).toEqual(mockConvenio);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: createConvenioDto.codigo },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createConvenioDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockConvenio);
    });

    it('deve lançar ConflictException quando código já existir', async () => {
      mockRepository.findOne.mockResolvedValue(mockConvenio);

      await expect(service.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar ConflictException quando CNPJ já existir', async () => {
      mockRepository.findOne
        .mockResolvedValueOnce(null) // Para verificação de código
        .mockResolvedValueOnce(mockConvenio); // Para verificação de CNPJ

      await expect(service.create(createConvenioDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve criar convênio sem CNPJ', async () => {
      const dtoSemCnpj = { ...createConvenioDto };
      delete dtoSemCnpj.cnpj;

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockConvenio);
      mockRepository.save.mockResolvedValue(mockConvenio);

      const result = await service.create(dtoSemCnpj);

      expect(result).toEqual(mockConvenio);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1); // Só verifica código
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de convênios', async () => {
      const mockConvenios = [mockConvenio];
      mockRepository.findAndCount.mockResolvedValue([mockConvenios, 1]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockConvenios,
        total: 1,
        page: 1,
        lastPage: 1,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { nome: 'ASC' },
      });
    });

    it('deve filtrar por busca de nome', async () => {
      const mockConvenios = [mockConvenio];
      mockRepository.findAndCount.mockResolvedValue([mockConvenios, 1]);

      await service.findAll(1, 10, 'Unimed');

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { nome: expect.objectContaining({ _type: 'like' }) },
        skip: 0,
        take: 10,
        order: { nome: 'ASC' },
      });
    });

    it('deve filtrar por status', async () => {
      const mockConvenios = [mockConvenio];
      mockRepository.findAndCount.mockResolvedValue([mockConvenios, 1]);

      await service.findAll(1, 10, null, 'ativo');

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: 'ativo' },
        skip: 0,
        take: 10,
        order: { nome: 'ASC' },
      });
    });

    it('deve aplicar paginação corretamente', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll(3, 20);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 40,
        take: 20,
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um convênio por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockConvenio);

      const result = await service.findOne('convenio-uuid-1');

      expect(result).toEqual(mockConvenio);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'convenio-uuid-1' },
      });
    });

    it('deve lançar NotFoundException quando convênio não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um convênio por código', async () => {
      mockRepository.findOne.mockResolvedValue(mockConvenio);

      const result = await service.findByCodigo('CONV001');

      expect(result).toEqual(mockConvenio);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: 'CONV001' },
      });
    });

    it('deve lançar NotFoundException quando código não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByCodigo('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateConvenioDto: UpdateConvenioExamesDto = {
      nome: 'Unimed Brasília Atualizado',
      telefone: '61888888888',
    };

    it('deve atualizar um convênio com sucesso', async () => {
      const convenioAtualizado = { ...mockConvenio, ...updateConvenioDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockConvenio);
      mockRepository.save.mockResolvedValue(convenioAtualizado);

      const result = await service.update('convenio-uuid-1', updateConvenioDto);

      expect(result).toEqual(convenioAtualizado);
      expect(service.findOne).toHaveBeenCalledWith('convenio-uuid-1');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando novo código já existir', async () => {
      const updateDto: UpdateConvenioExamesDto = {
        codigo: 'CONV002',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockConvenio);
      mockRepository.findOne.mockResolvedValue({ id: 'outro-convenio' });

      await expect(
        service.update('convenio-uuid-1', updateDto),
      ).rejects.toThrow(ConflictException);
    });

    it('deve lançar ConflictException quando novo CNPJ já existir', async () => {
      const updateDto: UpdateConvenioExamesDto = {
        cnpj: '98765432000188',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockConvenio);
      mockRepository.findOne.mockResolvedValue({ id: 'outro-convenio' });

      await expect(
        service.update('convenio-uuid-1', updateDto),
      ).rejects.toThrow(ConflictException);
    });

    it('deve permitir atualizar mantendo o mesmo código', async () => {
      const updateDto: UpdateConvenioExamesDto = {
        codigo: 'CONV001',
        nome: 'Novo Nome',
      };

      const convenioAtualizado = { ...mockConvenio, nome: 'Novo Nome' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockConvenio);
      mockRepository.save.mockResolvedValue(convenioAtualizado);

      const result = await service.update('convenio-uuid-1', updateDto);

      expect(result).toEqual(convenioAtualizado);
    });
  });

  describe('remove', () => {
    it('deve desativar um convênio (soft delete)', async () => {
      const convenioInativo = { ...mockConvenio, status: 'inativo' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockConvenio);
      mockRepository.save.mockResolvedValue(convenioInativo);

      await service.remove('convenio-uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('convenio-uuid-1');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'inativo' }),
      );
    });
  });

  describe('findAtivos', () => {
    it('deve retornar convênios ativos', async () => {
      const conveniosAtivos = [mockConvenio];
      mockRepository.find.mockResolvedValue(conveniosAtivos);

      const result = await service.findAtivos();

      expect(result).toEqual(conveniosAtivos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'ativo' },
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findComIntegracao', () => {
    it('deve retornar convênios com integração API', async () => {
      const conveniosComApi = [{ ...mockConvenio, tem_integracao_api: true }];
      mockRepository.find.mockResolvedValue(conveniosComApi);

      const result = await service.findComIntegracao();

      expect(result).toEqual(conveniosComApi);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tem_integracao_api: true, status: 'ativo' },
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findByTipoFaturamento', () => {
    it('deve retornar convênios por tipo de faturamento', async () => {
      const conveniosMensais = [
        { ...mockConvenio, tipo_faturamento: 'mensal' },
      ];
      mockRepository.find.mockResolvedValue(conveniosMensais);

      const result = await service.findByTipoFaturamento('mensal');

      expect(result).toEqual(conveniosMensais);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipo_faturamento: 'mensal', status: 'ativo' },
        order: { nome: 'ASC' },
      });
    });
  });

  describe('verificarAutorizacao', () => {
    it('deve retornar configurações de autorização do convênio', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockConvenio);

      const result = await service.verificarAutorizacao('convenio-uuid-1');

      expect(result).toEqual({
        requerAutorizacao: true,
        requerSenha: false,
      });
      expect(service.findOne).toHaveBeenCalledWith('convenio-uuid-1');
    });
  });

  describe('getRegrasConvenio', () => {
    it('deve retornar regras específicas do convênio', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockConvenio);

      const result = await service.getRegrasConvenio('convenio-uuid-1');

      expect(result).toEqual({
        percentualDesconto: 10.5,
        tabelaPrecos: 'AMB',
        validadeGuiaDias: 30,
        regrasEspecificas: {},
      });
      expect(service.findOne).toHaveBeenCalledWith('convenio-uuid-1');
    });
  });
});
