import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AmbService } from './amb.service';
import { Public } from '../../autenticacao/auth/decorators/public.decorator';

@ApiTags('AMB')
@Controller('exames/amb')
export class AmbController {
  constructor(private readonly ambService: AmbService) {}

  @Get('search')
  @Public()
  @ApiOperation({
    summary: 'Buscar códigos AMB (autocomplete)',
    description: 'Busca códigos AMB por código ou descrição do procedimento',
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
    const results = await this.ambService.search(query, limit || 20);
    return {
      data: results,
      total: results.length,
    };
  }

  @Get('codigo/:codigo')
  @Public()
  @ApiOperation({
    summary: 'Buscar AMB por código exato',
  })
  @ApiParam({
    name: 'codigo',
    description: 'Código AMB do procedimento',
  })
  async findByCodigo(@Param('codigo') codigo: string) {
    const amb = await this.ambService.findByCodigo(codigo);
    return { data: amb };
  }

  @Get('stats')
  @Public()
  @ApiOperation({
    summary: 'Estatísticas da tabela AMB',
  })
  async getStats() {
    return this.ambService.getStats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Buscar AMB por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do registro AMB',
  })
  async findById(@Param('id') id: string) {
    const amb = await this.ambService.findById(id);
    return { data: amb };
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Listar todos os códigos AMB',
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
    return this.ambService.findAll(page || 1, limit || 50);
  }
}
