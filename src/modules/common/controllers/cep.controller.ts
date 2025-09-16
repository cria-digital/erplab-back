import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { CepService } from '../services/cep.service';
import { EnderecoResponseDto } from '../dto/endereco-response.dto';

@ApiTags('CEP - Consulta de Endereços')
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  @Public()
  @ApiOperation({
    summary: 'Buscar endereço completo por CEP',
    description:
      'Retorna o endereço completo através do CEP informado. Os dados são obtidos através da API ViaCEP e formatados para compatibilidade com o cadastro de unidades.',
  })
  @ApiParam({
    name: 'cep',
    description: 'CEP com ou sem formatação (ex: 01310-100 ou 01310100)',
    example: '01310100',
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado com sucesso',
    type: EnderecoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'CEP inválido - deve conter 8 dígitos',
    schema: {
      example: {
        statusCode: 400,
        message: 'CEP inválido. O CEP deve conter 8 dígitos.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'CEP não encontrado na base de dados',
    schema: {
      example: {
        statusCode: 404,
        message: 'CEP não encontrado.',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar informações do CEP',
  })
  async buscarEndereco(
    @Param('cep') cep: string,
  ): Promise<EnderecoResponseDto> {
    return this.cepService.buscarEndereco(cep);
  }
}
