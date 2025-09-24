import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { TiposExameService } from './tipos-exame.service';
import { TipoExame } from './entities/tipo-exame.entity';
import { CreateTipoExameDto } from './dto/create-tipo-exame.dto';
import { UpdateTipoExameDto } from './dto/update-tipo-exame.dto';

describe('TiposExameService', () => {
  let service: TiposExameService;

  const mockTipoExame = {
    id: 'tipo-uuid-1',
    codigo: 'TIPO001',
    nome: 'Laboratorial',
    descricao: 'Exames laboratoriais',
    ordem: 1,
    requer_agendamento: false,
    requer_autorizacao: false,
    permite_domiciliar: true,
    cor: '#FF0000',
    icone: 'flask',
    configuracoes: {},
    status: 'ativo',
    criado_em: new Date(),
    atualizado_em: new Date(),
    exames: [],
  } as TipoExame;

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
        TiposExameService,
        {
          provide: getRepositoryToken(TipoExame),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TiposExameService>(TiposExameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTipoExameDto: CreateTipoExameDto = {
      codigo: 'TIPO001',
      nome: 'Laboratorial',
      descricao: 'Exames laboratoriais',
      ordem: 1,
      cor: '#FF0000',
    };

    it('deve criar um tipo de exame com sucesso', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockTipoExame);
      mockRepository.save.mockResolvedValue(mockTipoExame);

      const result = await service.create(createTipoExameDto);

      expect(result).toEqual(mockTipoExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: createTipoExameDto.codigo },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createTipoExameDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTipoExame);
    });

    it('deve lançar ConflictException quando código já existir', async () => {
      mockRepository.findOne.mockResolvedValue(mockTipoExame);

      await expect(service.create(createTipoExameDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de tipos de exame', async () => {
      const mockTipos = [mockTipoExame];
      mockRepository.findAndCount.mockResolvedValue([mockTipos, 1]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockTipos,
        total: 1,
        page: 1,
        lastPage: 1,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { ordem: 'ASC', nome: 'ASC' },
      });
    });

    it('deve filtrar por status', async () => {
      const mockTipos = [mockTipoExame];
      mockRepository.findAndCount.mockResolvedValue([mockTipos, 1]);

      await service.findAll(1, 10, 'ativo');

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { status: 'ativo' },
        skip: 0,
        take: 10,
        order: { ordem: 'ASC', nome: 'ASC' },
      });
    });

    it('deve aplicar paginação corretamente', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll(2, 5);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        order: { ordem: 'ASC', nome: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um tipo de exame por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockTipoExame);

      const result = await service.findOne('tipo-uuid-1');

      expect(result).toEqual(mockTipoExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'tipo-uuid-1' },
        relations: ['exames'],
      });
    });

    it('deve lançar NotFoundException quando tipo não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('deve retornar um tipo de exame por código', async () => {
      mockRepository.findOne.mockResolvedValue(mockTipoExame);

      const result = await service.findByCodigo('TIPO001');

      expect(result).toEqual(mockTipoExame);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: 'TIPO001' },
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
    const updateTipoExameDto: UpdateTipoExameDto = {
      nome: 'Laboratorial Atualizado',
      descricao: 'Nova descrição',
    };

    it('deve atualizar um tipo de exame com sucesso', async () => {
      const tipoAtualizado = { ...mockTipoExame, ...updateTipoExameDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTipoExame);
      mockRepository.save.mockResolvedValue(tipoAtualizado);

      const result = await service.update('tipo-uuid-1', updateTipoExameDto);

      expect(result).toEqual(tipoAtualizado);
      expect(service.findOne).toHaveBeenCalledWith('tipo-uuid-1');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando novo código já existir', async () => {
      const updateDto: UpdateTipoExameDto = {
        codigo: 'TIPO002',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTipoExame);
      mockRepository.findOne.mockResolvedValue({ id: 'outro-tipo' });

      await expect(service.update('tipo-uuid-1', updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve permitir atualizar mantendo o mesmo código', async () => {
      const updateDto: UpdateTipoExameDto = {
        codigo: 'TIPO001',
        nome: 'Novo Nome',
      };

      const tipoAtualizado = { ...mockTipoExame, nome: 'Novo Nome' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTipoExame);
      mockRepository.save.mockResolvedValue(tipoAtualizado);

      const result = await service.update('tipo-uuid-1', updateDto);

      expect(result).toEqual(tipoAtualizado);
    });
  });

  describe('remove', () => {
    it('deve desativar um tipo de exame sem exames vinculados', async () => {
      const tipoSemExames = { ...mockTipoExame, exames: [] };
      const tipoInativo = { ...tipoSemExames, status: 'inativo' };

      jest.spyOn(service, 'findOne').mockResolvedValue(tipoSemExames);
      mockRepository.save.mockResolvedValue(tipoInativo);

      await service.remove('tipo-uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('tipo-uuid-1');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'inativo' }),
      );
    });

    it('deve lançar ConflictException quando houver exames vinculados', async () => {
      const tipoComExames = {
        ...mockTipoExame,
        exames: [{ id: 'exame-1' } as any, { id: 'exame-2' } as any],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(tipoComExames);

      await expect(service.remove('tipo-uuid-1')).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAtivos', () => {
    it('deve retornar tipos de exame ativos', async () => {
      const tiposAtivos = [mockTipoExame];
      mockRepository.find.mockResolvedValue(tiposAtivos);

      const result = await service.findAtivos();

      expect(result).toEqual(tiposAtivos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'ativo' },
        order: { ordem: 'ASC', nome: 'ASC' },
      });
    });
  });

  describe('findComAgendamento', () => {
    it('deve retornar tipos que requerem agendamento', async () => {
      const tipos = [{ ...mockTipoExame, requer_agendamento: true }];
      mockRepository.find.mockResolvedValue(tipos);

      const result = await service.findComAgendamento();

      expect(result).toEqual(tipos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { requer_agendamento: true, status: 'ativo' },
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findComAutorizacao', () => {
    it('deve retornar tipos que requerem autorização', async () => {
      const tipos = [{ ...mockTipoExame, requer_autorizacao: true }];
      mockRepository.find.mockResolvedValue(tipos);

      const result = await service.findComAutorizacao();

      expect(result).toEqual(tipos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { requer_autorizacao: true, status: 'ativo' },
        order: { nome: 'ASC' },
      });
    });
  });

  describe('findDomiciliares', () => {
    it('deve retornar tipos que permitem atendimento domiciliar', async () => {
      const tipos = [{ ...mockTipoExame, permite_domiciliar: true }];
      mockRepository.find.mockResolvedValue(tipos);

      const result = await service.findDomiciliares();

      expect(result).toEqual(tipos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { permite_domiciliar: true, status: 'ativo' },
        order: { nome: 'ASC' },
      });
    });
  });
});
