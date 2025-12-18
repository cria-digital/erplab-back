import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TussService } from './tuss.service';
import { Public } from '../../autenticacao/auth/decorators/public.decorator';

@ApiTags('TUSS')
@Controller('exames/tuss')
export class TussController {
  constructor(private readonly tussService: TussService) {}

  @Get('search')
  @Public()
  @ApiOperation({
    summary: 'Buscar códigos TUSS (autocomplete)',
    description: 'Busca códigos TUSS por código ou descrição do procedimento',
  })
  @ApiQuery({
    name: 'q',
    description: 'Termo de busca (mínimo 2 caracteres)',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limite de resultados',
    required: false,
    type: Number,
  })
  async search(@Query('q') query: string, @Query('limit') limit?: number) {
    const results = await this.tussService.search(query, limit || 20);
    return {
      data: results,
      total: results.length,
    };
  }

  @Get('codigo/:codigo')
  @Public()
  @ApiOperation({
    summary: 'Buscar TUSS por código exato',
  })
  @ApiParam({
    name: 'codigo',
    description: 'Código TUSS (8 dígitos)',
  })
  async findByCodigo(@Param('codigo') codigo: string) {
    const tuss = await this.tussService.findByCodigo(codigo);
    return { data: tuss };
  }

  @Get('stats')
  @Public()
  @ApiOperation({
    summary: 'Estatísticas da tabela TUSS',
  })
  async getStats() {
    return this.tussService.getStats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Buscar TUSS por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do registro TUSS',
  })
  async findById(@Param('id') id: string) {
    const tuss = await this.tussService.findById(id);
    return { data: tuss };
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Listar todos os códigos TUSS',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.tussService.findAll(page || 1, limit || 50);
  }
}
