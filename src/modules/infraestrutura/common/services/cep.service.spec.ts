import { Test, TestingModule } from '@nestjs/testing';
import { CepService } from './cep.service';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('CepService', () => {
  let service: CepService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockViaCepResponse = {
    cep: '01310-100',
    logradouro: 'Avenida Paulista',
    complemento: 'de 612 a 1510 - lado par',
    bairro: 'Bela Vista',
    localidade: 'São Paulo',
    uf: 'SP',
    ibge: '3550308',
    gia: '1004',
    ddd: '11',
    siafi: '7107',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CepService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<CepService>(CepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buscarEndereco', () => {
    it('should return address for valid CEP', async () => {
      const cep = '01310-100';
      mockHttpService.get.mockReturnValue(of({ data: mockViaCepResponse }));

      const result = await service.buscarEndereco(cep);

      expect(result).toEqual({
        cep: '01310100',
        rua: 'Avenida Paulista',
        logradouro: 'Avenida Paulista',
        complemento: 'de 612 a 1510 - lado par',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        ibge: '3550308',
        gia: '1004',
        ddd: '11',
        siafi: '7107',
      });

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/01310100/json/',
      );
    });

    it('should handle CEP with only numbers', async () => {
      const cep = '01310100';
      mockHttpService.get.mockReturnValue(of({ data: mockViaCepResponse }));

      const result = await service.buscarEndereco(cep);

      expect(result.cep).toBe('01310100');
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/01310100/json/',
      );
    });

    it('should remove special characters from CEP', async () => {
      const cep = '01.310-100';
      mockHttpService.get.mockReturnValue(of({ data: mockViaCepResponse }));

      const result = await service.buscarEndereco(cep);

      expect(result.cep).toBe('01310100');
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/01310100/json/',
      );
    });

    it('should throw error for invalid CEP length', async () => {
      const invalidCep = '12345';

      await expect(service.buscarEndereco(invalidCep)).rejects.toThrow(
        new HttpException(
          'CEP inválido. O CEP deve conter 8 dígitos.',
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(mockHttpService.get).not.toHaveBeenCalled();
    });

    it('should throw error for CEP with more than 8 digits', async () => {
      const invalidCep = '123456789';

      await expect(service.buscarEndereco(invalidCep)).rejects.toThrow(
        new HttpException(
          'CEP inválido. O CEP deve conter 8 dígitos.',
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(mockHttpService.get).not.toHaveBeenCalled();
    });

    it('should throw error when CEP is not found', async () => {
      const cep = '99999999';
      mockHttpService.get.mockReturnValue(of({ data: { erro: true } }));

      await expect(service.buscarEndereco(cep)).rejects.toThrow(
        new HttpException('CEP não encontrado.', HttpStatus.NOT_FOUND),
      );
    });

    it('should handle API connection errors', async () => {
      const cep = '01310100';
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      await expect(service.buscarEndereco(cep)).rejects.toThrow(
        new HttpException(
          'Erro ao buscar informações do CEP.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should rethrow HttpException', async () => {
      const cep = '01310100';
      const customError = new HttpException(
        'Custom error',
        HttpStatus.GATEWAY_TIMEOUT,
      );
      mockHttpService.get.mockReturnValue(throwError(() => customError));

      await expect(service.buscarEndereco(cep)).rejects.toThrow(customError);
    });

    it('should handle empty complemento field', async () => {
      const cep = '01310100';
      const responseWithoutComplemento = {
        ...mockViaCepResponse,
        complemento: '',
      };
      mockHttpService.get.mockReturnValue(
        of({ data: responseWithoutComplemento }),
      );

      const result = await service.buscarEndereco(cep);

      expect(result.complemento).toBe('');
    });

    it('should handle response with null fields', async () => {
      const cep = '01310100';
      const responseWithNulls = {
        ...mockViaCepResponse,
        complemento: null,
        gia: null,
        siafi: null,
      };
      mockHttpService.get.mockReturnValue(of({ data: responseWithNulls }));

      const result = await service.buscarEndereco(cep);

      expect(result.complemento).toBeNull();
      expect(result.gia).toBeNull();
      expect(result.siafi).toBeNull();
    });
  });
});
