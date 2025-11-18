import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EstadoService } from '../services/estado.service';
import { Estado } from '../entities/estado.entity';

@ApiTags('Estados')
@Controller('infraestrutura/estados')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os estados do Brasil',
    description:
      'Retorna a lista completa de estados brasileiros ordenados por nome.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados retornada com sucesso',
    type: [Estado],
  })
  async findAll(): Promise<Estado[]> {
    return this.estadoService.findAll();
  }

  @Get('uf/:uf')
  @ApiOperation({
    summary: 'Buscar estado pela UF',
    description:
      'Retorna os dados de um estado específico pela sigla da UF, incluindo suas cidades.',
  })
  @ApiParam({
    name: 'uf',
    description: 'Sigla da UF (ex: SP, RJ, MG)',
    example: 'SP',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado encontrado com sucesso',
    type: Estado,
  })
  @ApiResponse({
    status: 404,
    description: 'Estado não encontrado',
  })
  async findByUf(@Param('uf') uf: string): Promise<Estado | null> {
    return this.estadoService.findByUf(uf);
  }
}
