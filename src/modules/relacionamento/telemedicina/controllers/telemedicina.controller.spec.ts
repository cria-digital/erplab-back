import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TelemedicinaController } from './telemedicina.controller';
import { TelemedicinaService } from '../services/telemedicina.service';
import { UpdateTelemedicinaDto } from '../dto/update-telemedicina.dto';

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
    integracao_id: null,
    observacoes: 'Plataforma de telemedicina',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockService = {
    findAll: jest.fn(),
    findAtivos: jest.fn(),
    findOne: jest.fn(),
    findByCodigo: jest.fn(),
    findByCnpj: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of telemedicinas', async () => {
      mockService.findAll.mockResolvedValue([mockTelemedicina]);

      const result = await controller.findAll();

      expect(result).toEqual([mockTelemedicina]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAtivos', () => {
    it('should return array of active telemedicinas', async () => {
      mockService.findAtivos.mockResolvedValue([mockTelemedicina]);

      const result = await controller.findAtivos();

      expect(result).toEqual([mockTelemedicina]);
      expect(service.findAtivos).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a telemedicina by id', async () => {
      mockService.findOne.mockResolvedValue(mockTelemedicina);

      const result = await controller.findOne('telemedicina-uuid-1');

      expect(result).toEqual(mockTelemedicina);
      expect(service.findOne).toHaveBeenCalledWith('telemedicina-uuid-1');
    });

    it('should throw NotFoundException when telemedicina not found', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('should return a telemedicina by codigo', async () => {
      mockService.findByCodigo.mockResolvedValue(mockTelemedicina);

      const result = await controller.findByCodigo('TELE001');

      expect(result).toEqual(mockTelemedicina);
      expect(service.findByCodigo).toHaveBeenCalledWith('TELE001');
    });
  });

  describe('findByCnpj', () => {
    it('should return a telemedicina by CNPJ', async () => {
      mockService.findByCnpj.mockResolvedValue(mockTelemedicina);

      const result = await controller.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockTelemedicina);
      expect(service.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });
  });

  describe('search', () => {
    it('should return telemedicinas matching search query', async () => {
      mockService.search.mockResolvedValue([mockTelemedicina]);

      const result = await controller.search('TeleMed');

      expect(result).toEqual([mockTelemedicina]);
      expect(service.search).toHaveBeenCalledWith('TeleMed');
    });
  });

  describe('update', () => {
    it('should update a telemedicina', async () => {
      const updateDto: UpdateTelemedicinaDto = {
        integracaoId: 'integracao-uuid',
        observacoes: 'Observações atualizadas',
      };
      const updatedTelemedicina = { ...mockTelemedicina, ...updateDto };
      mockService.update.mockResolvedValue(updatedTelemedicina);

      const result = await controller.update('telemedicina-uuid-1', updateDto);

      expect(result).toEqual(updatedTelemedicina);
      expect(service.update).toHaveBeenCalledWith(
        'telemedicina-uuid-1',
        updateDto,
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle telemedicina status', async () => {
      const toggledTelemedicina = {
        ...mockTelemedicina,
        empresa: { ...mockTelemedicina.empresa, ativo: false },
      };
      mockService.toggleStatus.mockResolvedValue(toggledTelemedicina);

      const result = await controller.toggleStatus('telemedicina-uuid-1');

      expect(result).toEqual(toggledTelemedicina);
      expect(service.toggleStatus).toHaveBeenCalledWith('telemedicina-uuid-1');
    });
  });

  describe('remove', () => {
    it('should remove a telemedicina', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('telemedicina-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('telemedicina-uuid-1');
    });
  });
});
