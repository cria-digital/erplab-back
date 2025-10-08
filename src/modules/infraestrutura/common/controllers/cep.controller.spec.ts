import { Test, TestingModule } from '@nestjs/testing';
import { CepController } from './cep.controller';
import { CepService } from '../services/cep.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CepController', () => {
  let controller: CepController;
  let service: CepService;

  const mockCepService = {
    buscarEndereco: jest.fn(),
  };

  const mockEndereco = {
    cep: '01310-100',
    logradouro: 'Avenida Paulista',
    complemento: '',
    bairro: 'Bela Vista',
    localidade: 'São Paulo',
    uf: 'SP',
    cidade: 'São Paulo',
    estado: 'SP',
    codigoIbge: '3550308',
    ddd: '11',
    siafi: '7107',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CepController],
      providers: [
        {
          provide: CepService,
          useValue: mockCepService,
        },
      ],
    }).compile();

    controller = module.get<CepController>(CepController);
    service = module.get<CepService>(CepService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deveria estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('buscarEndereco', () => {
    it('deveria buscar endereço com sucesso', async () => {
      mockCepService.buscarEndereco.mockResolvedValue(mockEndereco);

      const result = await controller.buscarEndereco('01310100');

      expect(result).toEqual(mockEndereco);
      expect(service.buscarEndereco).toHaveBeenCalledWith('01310100');
      expect(service.buscarEndereco).toHaveBeenCalledTimes(1);
    });

    it('deveria buscar endereço com CEP formatado', async () => {
      mockCepService.buscarEndereco.mockResolvedValue(mockEndereco);

      const result = await controller.buscarEndereco('01310-100');

      expect(result).toEqual(mockEndereco);
      expect(service.buscarEndereco).toHaveBeenCalledWith('01310-100');
    });

    it('deveria tratar erro quando CEP for inválido', async () => {
      const erro = new BadRequestException(
        'CEP inválido. O CEP deve conter 8 dígitos.',
      );
      mockCepService.buscarEndereco.mockRejectedValue(erro);

      await expect(controller.buscarEndereco('123')).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.buscarEndereco('123')).rejects.toThrow(
        'CEP inválido. O CEP deve conter 8 dígitos.',
      );
    });

    it('deveria tratar erro quando CEP não for encontrado', async () => {
      const erro = new NotFoundException('CEP não encontrado.');
      mockCepService.buscarEndereco.mockRejectedValue(erro);

      await expect(controller.buscarEndereco('99999999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.buscarEndereco('99999999')).rejects.toThrow(
        'CEP não encontrado.',
      );
    });

    it('deveria retornar endereço com dados completos', async () => {
      const enderecoCompleto = {
        ...mockEndereco,
        complemento: 'até 999/1000',
        gia: '1004',
        unidade: '',
        ibge: '3550308',
      };

      mockCepService.buscarEndereco.mockResolvedValue(enderecoCompleto);

      const result = await controller.buscarEndereco('01310100');

      expect(result).toEqual(enderecoCompleto);
      expect(result.logradouro).toBe('Avenida Paulista');
      expect(result.bairro).toBe('Bela Vista');
      expect(result.cidade).toBe('São Paulo');
      expect(result.estado).toBe('SP');
    });

    it('deveria tratar erro genérico do serviço', async () => {
      const erro = new Error('Erro ao buscar CEP');
      mockCepService.buscarEndereco.mockRejectedValue(erro);

      await expect(controller.buscarEndereco('01310100')).rejects.toThrow(
        'Erro ao buscar CEP',
      );
    });
  });
});
