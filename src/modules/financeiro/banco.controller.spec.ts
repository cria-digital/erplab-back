import { Test, TestingModule } from '@nestjs/testing';
import { BancoController } from './banco.controller';
import { BancoService } from './banco.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { StatusBanco } from './entities/banco.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

describe('BancoController', () => {
  let controller: BancoController;
  let service: BancoService;

  const mockBanco = {
    id: 'banco-uuid-1',
    codigo: '001',
    codigo_interno: 'BB',
    nome: 'Banco do Brasil S.A.',
    status: StatusBanco.ATIVO,
    descricao: 'Banco do Brasil S.A. - Código FEBRABAN: 001',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockBancoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleStatus: jest.fn(),
    findByCodigo: jest.fn(),
    findAtivos: jest.fn(),
  };

  const mockUser: Partial<Usuario> = {
    id: 'user-uuid-1',
    email: 'user@test.com',
  } as Usuario;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BancoController],
      providers: [
        {
          provide: BancoService,
          useValue: mockBancoService,
        },
      ],
    }).compile();

    controller = module.get<BancoController>(BancoController);
    service = module.get<BancoService>(BancoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new banco', async () => {
      const createDto: CreateBancoDto = {
        codigo: '999',
        codigo_interno: 'NOVO',
        nome: 'Banco Novo S.A.',
        status: StatusBanco.ATIVO,
      };

      mockBancoService.create.mockResolvedValue(mockBanco);

      const result = await controller.create(createDto, mockUser as Usuario);

      expect(result).toEqual(mockBanco);
      expect(service.create).toHaveBeenCalledWith(createDto, 'user-uuid-1');
    });
  });

  describe('findAll', () => {
    it('should return an array of bancos', async () => {
      const bancos = [mockBanco];
      mockBancoService.findAll.mockResolvedValue(bancos);

      const result = await controller.findAll();

      expect(result).toEqual(bancos);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAtivos', () => {
    it('should return active bancos', async () => {
      const bancosAtivos = [mockBanco];
      mockBancoService.findAtivos.mockResolvedValue(bancosAtivos);

      const result = await controller.findAtivos();

      expect(result).toEqual(bancosAtivos);
      expect(service.findAtivos).toHaveBeenCalled();
    });
  });

  describe('findByCodigo', () => {
    it('should find banco by codigo', async () => {
      mockBancoService.findByCodigo.mockResolvedValue(mockBanco);

      const result = await controller.findByCodigo('001');

      expect(result).toEqual(mockBanco);
      expect(service.findByCodigo).toHaveBeenCalledWith('001');
    });
  });

  describe('findOne', () => {
    it('should find a banco by id', async () => {
      mockBancoService.findOne.mockResolvedValue(mockBanco);

      const result = await controller.findOne('banco-uuid-1');

      expect(result).toEqual(mockBanco);
      expect(service.findOne).toHaveBeenCalledWith('banco-uuid-1');
    });
  });

  describe('update', () => {
    it('should update a banco', async () => {
      const updateDto: UpdateBancoDto = {
        descricao: 'Banco do Brasil - Atualizado',
      };

      const updatedBanco = { ...mockBanco, ...updateDto };
      mockBancoService.update.mockResolvedValue(updatedBanco);

      const result = await controller.update(
        'banco-uuid-1',
        updateDto,
        mockUser as Usuario,
      );

      expect(result).toEqual(updatedBanco);
      expect(service.update).toHaveBeenCalledWith(
        'banco-uuid-1',
        updateDto,
        'user-uuid-1',
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle banco status', async () => {
      const bancoInativo = { ...mockBanco, status: StatusBanco.INATIVO };
      mockBancoService.toggleStatus.mockResolvedValue(bancoInativo);

      const result = await controller.toggleStatus(
        'banco-uuid-1',
        mockUser as Usuario,
      );

      expect(result).toEqual(bancoInativo);
      expect(service.toggleStatus).toHaveBeenCalledWith(
        'banco-uuid-1',
        'user-uuid-1',
      );
    });
  });

  describe('remove', () => {
    it('should remove a banco', async () => {
      mockBancoService.remove.mockResolvedValue(undefined);

      await controller.remove('banco-uuid-1', mockUser as Usuario);

      expect(service.remove).toHaveBeenCalledWith(
        'banco-uuid-1',
        'user-uuid-1',
      );
    });
  });
});
