import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CidadeService } from '../services/cidade.service';
import { Cidade } from '../entities/cidade.entity';

@ApiTags('Cidades')
@Controller('infraestrutura/cidades')
export class CidadeController {
  constructor(private readonly cidadeService: CidadeService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar cidades por estado (UF)',
    description:
      'Retorna a lista de cidades de um estado específico através da UF.',
  })
  @ApiQuery({
    name: 'uf',
    description: 'Sigla da UF para filtrar cidades (ex: SP, RJ, MG)',
    example: 'SP',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cidades retornada com sucesso',
    type: [Cidade],
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetro UF não fornecido',
  })
  async findByEstado(@Query('uf') uf: string): Promise<Cidade[]> {
    if (!uf) {
      throw new Error('Parâmetro UF é obrigatório');
    }
    return this.cidadeService.findByEstadoUf(uf);
  }

  @Get('estado/:estadoId')
  @ApiOperation({
    summary: 'Listar cidades por ID do estado',
    description:
      'Retorna a lista de cidades de um estado específico através do ID.',
  })
  @ApiParam({
    name: 'estadoId',
    description: 'ID do estado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cidades retornada com sucesso',
    type: [Cidade],
  })
  async findByEstadoId(@Param('estadoId') estadoId: string): Promise<Cidade[]> {
    return this.cidadeService.findByEstadoId(estadoId);
  }
}
