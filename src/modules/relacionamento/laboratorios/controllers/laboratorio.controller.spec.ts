import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { LaboratorioController } from './laboratorio.controller';
import { LaboratorioService } from '../services/laboratorio.service';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';

describe('LaboratorioController', () => {
  let controller: LaboratorioController;
  let service: LaboratorioService;

  const mockLaboratorio = {
    id: 'lab-uuid-1',
    empresa_id: 'empresa-uuid-1',
    empresa: {
      id: 'empresa-uuid-1',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Laboratório Teste Ltda',
      nomeFantasia: 'Lab Teste',
      ativo: true,
    },
    codigo_laboratorio: 'LAB001',
    integracao_id: null,
    observacoes: 'Laboratório de apoio',
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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of laboratorios', async () => {
      mockService.findAll.mockResolvedValue([mockLaboratorio]);

      const result = await controller.findAll();

      expect(result).toEqual([mockLaboratorio]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAtivos', () => {
    it('should return array of active laboratorios', async () => {
      mockService.findAtivos.mockResolvedValue([mockLaboratorio]);

      const result = await controller.findAtivos();

      expect(result).toEqual([mockLaboratorio]);
      expect(service.findAtivos).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a laboratorio by id', async () => {
      mockService.findOne.mockResolvedValue(mockLaboratorio);

      const result = await controller.findOne('lab-uuid-1');

      expect(result).toEqual(mockLaboratorio);
      expect(service.findOne).toHaveBeenCalledWith('lab-uuid-1');
    });

    it('should throw NotFoundException when laboratorio not found', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCodigo', () => {
    it('should return a laboratorio by codigo', async () => {
      mockService.findByCodigo.mockResolvedValue(mockLaboratorio);

      const result = await controller.findByCodigo('LAB001');

      expect(result).toEqual(mockLaboratorio);
      expect(service.findByCodigo).toHaveBeenCalledWith('LAB001');
    });
  });

  describe('findByCnpj', () => {
    it('should return a laboratorio by CNPJ', async () => {
      mockService.findByCnpj.mockResolvedValue(mockLaboratorio);

      const result = await controller.findByCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockLaboratorio);
      expect(service.findByCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });
  });

  describe('search', () => {
    it('should return laboratorios matching search query', async () => {
      mockService.search.mockResolvedValue([mockLaboratorio]);

      const result = await controller.search('Lab Teste');

      expect(result).toEqual([mockLaboratorio]);
      expect(service.search).toHaveBeenCalledWith('Lab Teste');
    });
  });

  describe('update', () => {
    it('should update a laboratorio', async () => {
      const updateDto: UpdateLaboratorioDto = {
        integracaoId: 'integracao-uuid',
        observacoes: 'Observações atualizadas',
      };
      const updatedLaboratorio = { ...mockLaboratorio, ...updateDto };
      mockService.update.mockResolvedValue(updatedLaboratorio);

      const result = await controller.update('lab-uuid-1', updateDto);

      expect(result).toEqual(updatedLaboratorio);
      expect(service.update).toHaveBeenCalledWith('lab-uuid-1', updateDto);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle laboratorio status', async () => {
      const toggledLaboratorio = {
        ...mockLaboratorio,
        empresa: { ...mockLaboratorio.empresa, ativo: false },
      };
      mockService.toggleStatus.mockResolvedValue(toggledLaboratorio);

      const result = await controller.toggleStatus('lab-uuid-1');

      expect(result).toEqual(toggledLaboratorio);
      expect(service.toggleStatus).toHaveBeenCalledWith('lab-uuid-1');
    });
  });

  describe('remove', () => {
    it('should remove a laboratorio', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('lab-uuid-1');

      expect(service.remove).toHaveBeenCalledWith('lab-uuid-1');
    });
  });
});
