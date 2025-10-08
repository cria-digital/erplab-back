import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EnderecoResponseDto } from '../dto/endereco-response.dto';

@Injectable()
export class CepService {
  constructor(private readonly httpService: HttpService) {}

  async buscarEndereco(cep: string): Promise<EnderecoResponseDto> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new HttpException(
        'CEP inválido. O CEP deve conter 8 dígitos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`https://viacep.com.br/ws/${cepLimpo}/json/`),
      );

      if (data.erro) {
        throw new HttpException('CEP não encontrado.', HttpStatus.NOT_FOUND);
      }

      return {
        cep: data.cep.replace('-', ''), // Remove formatação do CEP
        rua: data.logradouro, // Campo compatível com UnidadeSaude
        logradouro: data.logradouro, // Mantém o campo original também
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        ibge: data.ibge,
        gia: data.gia,
        ddd: data.ddd,
        siafi: data.siafi,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Erro ao buscar informações do CEP.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
