import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { ExamesService } from './exames.service';
import { Exame } from './entities/exame.entity';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';

describe('ExamesService', () => {
  let service: ExamesService;

  const mockExame = {
    id: 'exame-uuid-1',
    codigo_interno: 'EXM001',
    nome: 'Hemograma Completo',
    sinonimos: ['CBC', 'Hemograma'],
    codigo_tuss: '40311010',
    codigo_cbhpm: '40304361',
    codigo_amb: '2.02.02.03-8',
    codigo_loinc: '58410-2',
    codigo_sus: '0202020380',
    tipo_exame_id: 'tipo-uuid-1',
    categoria: 'laboratorio',
    subgrupo_id: 'subgrupo-uuid-1',
    setor_id: 'setor-uuid-1',
    laboratorio_apoio_id: null,
    metodologia_id: 'metodologia-uuid-1',
    especialidade_id: null,
    grupo_id: null,
    unidade_medida_id: 'unidade-medida-uuid-1',
    amostra_id: 'amostra-uuid-1',
    amostra_enviar_id: null,
    tipo_recipiente_id: 'recipiente-uuid-1',
    regiao_coleta_ids: null,
    estabilidade_id: null,
    volume_minimo_id: null,
    formato_laudo_id: null,
    volume_min: 3,
    volume_ideal: 5,
    requer_peso: false,
    requer_altura: false,
    requer_volume: true,
    termo_consentimento: false,
    necessita_preparo: 'não',
    requisitos: null,
    prazo_entrega_dias: 1,
    formato_prazo: '1 dia útil',
    peso: 1,
    status: 'ativo',
    empresa_id: 'empresa-uuid-1',
    criado_em: new Date(),
    atualizado_em: new Date(),
    especialidade_requerida: 'nao',
    altura_min: null,
    altura_max: null,
    tipo_realizacao: 'interno',
    telemedicina_id: null,
    unidade_destino_id: null,
    envio_automatico: 'nao',
    tem_valores_referencia: 'sim',
    valores_referencia: {},
    tecnica_coleta: null,
    distribuicao: null,
    rejeicao: null,
    processamento_entrega: null,
    links_uteis: null,
    requisitos_anvisa: null,
    formularios_atendimento: null,
    preparo_geral: null,
    preparo_feminino: null,
    preparo_infantil: null,
    coleta_geral: null,
    coleta_feminino: null,
    coleta_infantil: null,
    lembrete_coletora: null,
    lembrete_recepcionista_agendamento: null,
    lembrete_recepcionista_os: null,
    criado_por: null,
    atualizado_por: null,
    tipoExameAlternativa: null,
    subgrupo: null,
    setor: null,
    laboratorioApoio: null,
    unidades: [],
    getCodigoFormatado: () => 'EXM001 - Hemograma Completo',
    getDescricaoCompleta: () => 'Hemograma Completo (CBC) - Automação',
    getPrazoFormatado: () => '1 dia útil',
    isExterno: () => false,
    requiresPreparo: () => false,
  } as unknown as Exame;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamesService,
        {
          provide: getRepositoryToken(Exame),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExamesService>(ExamesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createExameDto: CreateExameDto = {
      codigo_interno: 'EXM001',
      nome: 'Hemograma Completo',
      categoria: 'laboratorio',
      prazo_entrega_dias: 1,
    };

    it('deve criar um exame com sucesso', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockExame);
      mockRepository.save.mockResolvedValue(mockExame);

      const result = await service.create(createExameDto);

      expect(result).toEqual(mockExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_interno: createExameDto.codigo_interno },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createExameDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockExame);
    });

    it('deve lançar ConflictException quando código já existir', async () => {
      mockRepository.findOne.mockResolvedValue(mockExame);

      await expect(service.create(createExameDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_interno: createExameDto.codigo_interno },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de exames', async () => {
      const mockExames = [mockExame];
      mockRepository.findAndCount.mockResolvedValue([mockExames, 1]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockExames,
        total: 1,
        page: 1,
        lastPage: 1,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: [
          'tipoExameAlternativa',
          'subgrupo',
          'setor',
          'laboratorioApoio',
        ],
        skip: 0,
        take: 10,
        order: { nome: 'ASC' },
      });
    });

    it('deve filtrar por busca de nome', async () => {
      const mockExames = [mockExame];
      mockRepository.findAndCount.mockResolvedValue([mockExames, 1]);

      await service.findAll(1, 10, 'Hemograma');

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { nome: expect.objectContaining({ _type: 'like' }) },
        relations: [
          'tipoExameAlternativa',
          'subgrupo',
          'setor',
          'laboratorioApoio',
        ],
        skip: 0,
        take: 10,
        order: { nome: 'ASC' },
      });
    });

    it('deve filtrar por categoria', async () => {
      const mockExames = [mockExame];
      mockRepository.findAndCount.mockResolvedValue([mockExames, 1]);

      await service.findAll(1, 10, null, 'laboratorio');

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { categoria: 'laboratorio' },
        relations: [
          'tipoExameAlternativa',
          'subgrupo',
          'setor',
          'laboratorioApoio',
        ],
        skip: 0,
        take: 10,
        order: { nome: 'ASC' },
      });
    });

    it('deve filtrar por status', async () => {
      const mockExames = [mockExame];
      mockRepository.findAndCount.mockResolvedValue([mockExames, 1]);

      await service.findAll(1, 10, null, null, 'ativo');

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: 'ativo' },
        relations: [
          'tipoExameAlternativa',
          'subgrupo',
          'setor',
          'laboratorioApoio',
        ],
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
        relations: [
          'tipoExameAlternativa',
          'subgrupo',
          'setor',
          'laboratorioApoio',
        ],
        skip: 40,
        take: 20,
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um exame por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockExame);

      const result = await service.findOne('exame-uuid-1');

      expect(result).toEqual(mockExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'exame-uuid-1' },
        relations: [
          'tipoExameAlternativa',
          'subgrupo',
          'setor',
          'laboratorioApoio',
        ],
      });
    });

    it('deve lançar NotFoundException quando exame não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um exame por código interno', async () => {
      mockRepository.findOne.mockResolvedValue(mockExame);

      const result = await service.findByCodigo('EXM001');

      expect(result).toEqual(mockExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo_interno: 'EXM001' },
        relations: [
          'tipoExameAlternativa',
          'subgrupo',
          'setor',
          'laboratorioApoio',
        ],
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
    const updateExameDto: UpdateExameDto = {
      nome: 'Hemograma Completo Atualizado',
      prazo_entrega_dias: 2,
    };

    it('deve atualizar um exame com sucesso', async () => {
      const exameAtualizado = { ...mockExame, ...updateExameDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockExame);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(exameAtualizado);

      const result = await service.update('exame-uuid-1', updateExameDto);

      expect(result).toEqual(exameAtualizado);
      expect(service.findOne).toHaveBeenCalledWith('exame-uuid-1');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando novo código já existir', async () => {
      const updateDto: UpdateExameDto = {
        codigo_interno: 'EXM002',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockExame);
      mockRepository.findOne.mockResolvedValue({ id: 'outro-exame' });

      await expect(service.update('exame-uuid-1', updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve permitir atualizar mantendo o mesmo código', async () => {
      const updateDto: UpdateExameDto = {
        codigo_interno: 'EXM001',
        nome: 'Novo Nome',
      };

      const exameAtualizado = { ...mockExame, nome: 'Novo Nome' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockExame);
      mockRepository.save.mockResolvedValue(exameAtualizado);

      const result = await service.update('exame-uuid-1', updateDto);

      expect(result).toEqual(exameAtualizado);
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve desativar um exame (soft delete)', async () => {
      const exameInativo = { ...mockExame, status: 'inativo' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockExame);
      mockRepository.save.mockResolvedValue(exameInativo);

      await service.remove('exame-uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('exame-uuid-1');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'inativo' }),
      );
    });
  });

  describe('findByCategoria', () => {
    it('deve retornar exames por categoria', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.findByCategoria('laboratorio');

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { categoria: 'laboratorio', status: 'ativo' },
        relations: ['tipoExameAlternativa'],
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findByTipo', () => {
    it('deve retornar exames por tipo', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.findByTipo('tipo-uuid-1');

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tipo_exame_id: 'tipo-uuid-1', status: 'ativo' },
        relations: ['tipoExameAlternativa', 'subgrupo', 'setor'],
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findByLaboratorioApoio', () => {
    it('deve retornar exames por laboratório de apoio', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.findByLaboratorioApoio('lab-uuid-1');

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { laboratorio_apoio_id: 'lab-uuid-1', status: 'ativo' },
        relations: ['laboratorioApoio'],
        order: { nome: 'ASC' },
      });
    });
  });

  describe('searchByName', () => {
    it('deve buscar exames por nome ou sinônimos', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.searchByName('Hemograma');

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [
          { nome: expect.objectContaining({ _type: 'like' }), status: 'ativo' },
          {
            sinonimos: expect.objectContaining({ _type: 'like' }),
            status: 'ativo',
          },
        ],
        relations: ['tipoExameAlternativa'],
        take: 20,
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findByCodigos', () => {
    it('deve buscar exames por código TUSS', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.findByCodigos('40311010');

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'ativo', codigo_tuss: '40311010' },
        relations: ['tipoExameAlternativa'],
      });
    });

    it('deve buscar exames por código AMB', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.findByCodigos(null, '2.02.02.03-8');

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'ativo', codigo_amb: '2.02.02.03-8' },
        relations: ['tipoExameAlternativa'],
      });
    });

    it('deve buscar exames por código SUS', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.findByCodigos(null, null, '0202020380');

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'ativo', codigo_sus: '0202020380' },
        relations: ['tipoExameAlternativa'],
      });
    });

    it('deve buscar com múltiplos códigos', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.findByCodigos(
        '40311010',
        '2.02.02.03-8',
        '0202020380',
      );

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          status: 'ativo',
          codigo_tuss: '40311010',
          codigo_amb: '2.02.02.03-8',
          codigo_sus: '0202020380',
        },
        relations: ['tipoExameAlternativa'],
      });
    });
  });

  describe('bulkUpdateStatus', () => {
    it('deve atualizar status de múltiplos exames', async () => {
      const ids = ['id1', 'id2', 'id3'];
      mockRepository.update.mockResolvedValue({ affected: 3 });

      await service.bulkUpdateStatus(ids, 'inativo');

      expect(mockRepository.update).toHaveBeenCalledWith(ids, {
        status: 'inativo',
      });
    });

    it('deve rejeitar status inválido', async () => {
      const ids = ['id1', 'id2'];

      await expect(service.bulkUpdateStatus(ids, 'invalido')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('getExamesComPreparo', () => {
    it('deve retornar exames que necessitam preparo', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.getExamesComPreparo();

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { necessita_preparo: 'sim', status: 'ativo' },
        relations: ['tipoExameAlternativa'],
        order: { nome: 'ASC' },
      });
    });
  });

  describe('getExamesUrgentes', () => {
    it('deve retornar exames urgentes ordenados por peso', async () => {
      const mockExames = [mockExame];
      mockRepository.find.mockResolvedValue(mockExames);

      const result = await service.getExamesUrgentes();

      expect(result).toEqual(mockExames);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'ativo' },
        relations: ['tipoExameAlternativa'],
        order: { peso: 'DESC', nome: 'ASC' },
        take: 50,
      });
    });
  });
});
