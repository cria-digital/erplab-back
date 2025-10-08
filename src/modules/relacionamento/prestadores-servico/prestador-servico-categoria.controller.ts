import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PrestadorServicoCategoriaService } from './prestador-servico-categoria.service';
import { CreatePrestadorServicoCategoriaDto } from './dto/create-prestador-servico-categoria.dto';
import { UpdatePrestadorServicoCategoriaDto } from './dto/update-prestador-servico-categoria.dto';
import {
  PrestadorServicoCategoria,
  TipoServicoCategoria,
} from './entities/prestador-servico-categoria.entity';

@ApiTags('Prestadores de Serviço - Categorias')
@Controller('prestador-servico-categorias')
export class PrestadorServicoCategoriaController {
  constructor(
    private readonly categoriaService: PrestadorServicoCategoriaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova categoria de serviço' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  @ApiResponse({ status: 409, description: 'Categoria já existe' })
  create(
    @Body() createDto: CreatePrestadorServicoCategoriaDto,
  ): Promise<PrestadorServicoCategoria> {
    return this.categoriaService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias' })
  findAll(): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaService.findAll();
  }

  @Get('ativas')
  @ApiOperation({ summary: 'Listar categorias ativas' })
  @ApiResponse({ status: 200, description: 'Lista de categorias ativas' })
  findActive(): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaService.findActive();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas por tipo de serviço' })
  @ApiResponse({ status: 200, description: 'Estatísticas' })
  getEstatisticasPorTipo(): Promise<any> {
    return this.categoriaService.getEstatisticasPorTipo();
  }

  @Get('prestador/:prestadorId')
  @ApiOperation({ summary: 'Listar categorias de um prestador' })
  @ApiParam({ name: 'prestadorId', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Categorias do prestador' })
  findByPrestador(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
  ): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaService.findByPrestador(prestadorId);
  }

  @Get('prestador/:prestadorId/ativas')
  @ApiOperation({ summary: 'Listar categorias ativas de um prestador' })
  @ApiParam({ name: 'prestadorId', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Categorias ativas do prestador' })
  findActiveByPrestador(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
  ): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaService.findActiveByPrestador(prestadorId);
  }

  @Get('prestador/:prestadorId/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas de categorias de um prestador' })
  @ApiParam({ name: 'prestadorId', description: 'ID do prestador' })
  @ApiResponse({ status: 200, description: 'Estatísticas do prestador' })
  getEstatisticasPrestador(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
  ): Promise<any> {
    return this.categoriaService.getEstatisticasPrestador(prestadorId);
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Listar categorias por tipo de serviço' })
  @ApiParam({ name: 'tipo', enum: TipoServicoCategoria })
  @ApiResponse({ status: 200, description: 'Categorias do tipo' })
  findByTipo(
    @Param('tipo') tipo: TipoServicoCategoria,
  ): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaService.findByTipo(tipo);
  }

  @Get('tipo/:tipo/prestadores')
  @ApiOperation({ summary: 'Listar prestadores por tipo de categoria' })
  @ApiParam({ name: 'tipo', enum: TipoServicoCategoria })
  @ApiResponse({ status: 200, description: 'Prestadores com a categoria' })
  getPrestadoresPorCategoria(
    @Param('tipo') tipo: TipoServicoCategoria,
  ): Promise<any[]> {
    return this.categoriaService.getPrestadoresPorCategoria(tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PrestadorServicoCategoria> {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePrestadorServicoCategoriaDto,
  ): Promise<PrestadorServicoCategoria> {
    return this.categoriaService.update(id, updateDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo da categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 200, description: 'Status alternado' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PrestadorServicoCategoria> {
    return this.categoriaService.toggleStatus(id);
  }

  @Post('importar/:prestadorId')
  @ApiOperation({ summary: 'Importar categorias em lote para um prestador' })
  @ApiParam({ name: 'prestadorId', description: 'ID do prestador' })
  @ApiResponse({ status: 201, description: 'Categorias importadas' })
  @ApiResponse({ status: 404, description: 'Prestador não encontrado' })
  importarCategorias(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
    @Body() categorias: Partial<CreatePrestadorServicoCategoriaDto>[],
  ): Promise<PrestadorServicoCategoria[]> {
    return this.categoriaService.importarCategorias(prestadorId, categorias);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria' })
  @ApiResponse({ status: 204, description: 'Categoria removida' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoriaService.remove(id);
  }

  @Delete('prestador/:prestadorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover todas as categorias de um prestador' })
  @ApiParam({ name: 'prestadorId', description: 'ID do prestador' })
  @ApiResponse({ status: 204, description: 'Categorias removidas' })
  removeByPrestador(
    @Param('prestadorId', ParseUUIDPipe) prestadorId: string,
  ): Promise<void> {
    return this.categoriaService.removeByPrestador(prestadorId);
  }
}
