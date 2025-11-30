import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  TabelaPrecoService,
  PaginatedResult,
} from '../services/tabela-preco.service';
import { CreateTabelaPrecoDto } from '../dto/create-tabela-preco.dto';
import { UpdateTabelaPrecoDto } from '../dto/update-tabela-preco.dto';
import { CreateTabelaPrecoItemDto } from '../dto/create-tabela-preco-item.dto';
import { UpdateTabelaPrecoItemDto } from '../dto/update-tabela-preco-item.dto';
import { TabelaPreco, TipoTabelaPreco } from '../entities/tabela-preco.entity';
import { TabelaPrecoItem } from '../entities/tabela-preco-item.entity';

@ApiTags('Tabelas de Preços')
@Controller('relacionamento/tabelas-preco')
export class TabelaPrecoController {
  constructor(private readonly tabelaPrecoService: TabelaPrecoService) {}

  // ==========================================
  // ENDPOINTS - TABELA DE PREÇOS
  // ==========================================

  @Post()
  @ApiOperation({ summary: 'Criar nova tabela de preços' })
  @ApiResponse({
    status: 201,
    description: 'Tabela criada com sucesso',
    type: TabelaPreco,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito - Código já existente',
  })
  create(
    @Body() createTabelaPrecoDto: CreateTabelaPrecoDto,
  ): Promise<TabelaPreco> {
    return this.tabelaPrecoService.create(createTabelaPrecoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tabelas de preços' })
  @ApiQuery({ name: 'ativo', required: false, type: Boolean })
  @ApiQuery({ name: 'tipo_tabela', required: false, enum: TipoTabelaPreco })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de tabelas de preços',
    type: [TabelaPreco],
  })
  findAll(
    @Query('ativo') ativo?: string,
    @Query('tipo_tabela') tipoTabela?: TipoTabelaPreco,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TabelaPreco[] | PaginatedResult<TabelaPreco>> {
    const options: any = {};

    if (ativo !== undefined) {
      options.ativo = ativo === 'true';
    }

    if (tipoTabela) {
      options.tipo_tabela = tipoTabela;
    }

    if (search) {
      return this.tabelaPrecoService.search(search);
    }

    if (page && limit) {
      options.page = parseInt(page, 10);
      options.limit = parseInt(limit, 10);
    }

    return this.tabelaPrecoService.findAll(options);
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar tabelas de preços ativas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tabelas ativas',
    type: [TabelaPreco],
  })
  findAtivos(): Promise<TabelaPreco[]> {
    return this.tabelaPrecoService.findAtivas();
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Listar tabelas por tipo' })
  @ApiParam({
    name: 'tipo',
    enum: TipoTabelaPreco,
    description: 'Tipo da tabela',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tabelas do tipo especificado',
    type: [TabelaPreco],
  })
  findByTipo(@Param('tipo') tipo: TipoTabelaPreco): Promise<TabelaPreco[]> {
    return this.tabelaPrecoService.findByTipo(tipo);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar tabela por código interno' })
  @ApiParam({ name: 'codigo', description: 'Código interno da tabela' })
  @ApiResponse({
    status: 200,
    description: 'Tabela encontrada',
    type: TabelaPreco,
  })
  @ApiResponse({ status: 404, description: 'Tabela não encontrada' })
  findByCodigo(@Param('codigo') codigo: string): Promise<TabelaPreco> {
    return this.tabelaPrecoService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tabela por ID' })
  @ApiParam({ name: 'id', description: 'ID da tabela' })
  @ApiResponse({
    status: 200,
    description: 'Tabela encontrada',
    type: TabelaPreco,
  })
  @ApiResponse({ status: 404, description: 'Tabela não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TabelaPreco> {
    return this.tabelaPrecoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tabela de preços' })
  @ApiParam({ name: 'id', description: 'ID da tabela' })
  @ApiResponse({
    status: 200,
    description: 'Tabela atualizada',
    type: TabelaPreco,
  })
  @ApiResponse({ status: 404, description: 'Tabela não encontrada' })
  @ApiResponse({ status: 409, description: 'Conflito - Código já existente' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTabelaPrecoDto: UpdateTabelaPrecoDto,
  ): Promise<TabelaPreco> {
    return this.tabelaPrecoService.update(id, updateTabelaPrecoDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo da tabela' })
  @ApiParam({ name: 'id', description: 'ID da tabela' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado',
    type: TabelaPreco,
  })
  @ApiResponse({ status: 404, description: 'Tabela não encontrada' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string): Promise<TabelaPreco> {
    return this.tabelaPrecoService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir tabela de preços' })
  @ApiParam({ name: 'id', description: 'ID da tabela' })
  @ApiResponse({ status: 204, description: 'Tabela excluída' })
  @ApiResponse({ status: 404, description: 'Tabela não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tabelaPrecoService.remove(id);
  }

  // ==========================================
  // ENDPOINTS - ITENS DA TABELA
  // ==========================================

  @Post(':tabelaId/itens')
  @ApiOperation({ summary: 'Adicionar item à tabela de preços' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado com sucesso',
    type: TabelaPrecoItem,
  })
  @ApiResponse({ status: 404, description: 'Tabela não encontrada' })
  @ApiResponse({ status: 409, description: 'Exame já cadastrado na tabela' })
  createItem(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
    @Body() createItemDto: CreateTabelaPrecoItemDto,
  ): Promise<TabelaPrecoItem> {
    return this.tabelaPrecoService.createItem(tabelaId, createItemDto);
  }

  @Get(':tabelaId/itens')
  @ApiOperation({ summary: 'Listar itens de uma tabela de preços' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens',
    type: [TabelaPrecoItem],
  })
  @ApiResponse({ status: 404, description: 'Tabela não encontrada' })
  findAllItens(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
  ): Promise<TabelaPrecoItem[]> {
    return this.tabelaPrecoService.findAllItens(tabelaId);
  }

  @Get(':tabelaId/itens/:itemId')
  @ApiOperation({ summary: 'Buscar item específico da tabela' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiParam({ name: 'itemId', description: 'ID do item' })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado',
    type: TabelaPrecoItem,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  findOneItem(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<TabelaPrecoItem> {
    return this.tabelaPrecoService.findOneItem(tabelaId, itemId);
  }

  @Patch(':tabelaId/itens/:itemId')
  @ApiOperation({ summary: 'Atualizar item da tabela' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiParam({ name: 'itemId', description: 'ID do item' })
  @ApiResponse({
    status: 200,
    description: 'Item atualizado',
    type: TabelaPrecoItem,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  updateItem(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateItemDto: UpdateTabelaPrecoItemDto,
  ): Promise<TabelaPrecoItem> {
    return this.tabelaPrecoService.updateItem(tabelaId, itemId, updateItemDto);
  }

  @Patch(':tabelaId/itens/:itemId/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo do item' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiParam({ name: 'itemId', description: 'ID do item' })
  @ApiResponse({
    status: 200,
    description: 'Status do item alterado',
    type: TabelaPrecoItem,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  toggleItemStatus(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<TabelaPrecoItem> {
    return this.tabelaPrecoService.toggleItemStatus(tabelaId, itemId);
  }

  @Delete(':tabelaId/itens/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir item da tabela' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiParam({ name: 'itemId', description: 'ID do item' })
  @ApiResponse({ status: 204, description: 'Item excluído' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  removeItem(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<void> {
    return this.tabelaPrecoService.removeItem(tabelaId, itemId);
  }

  // ==========================================
  // UTILITÁRIOS
  // ==========================================

  @Get(':tabelaId/exame/:exameId/preco')
  @ApiOperation({ summary: 'Buscar preço de um exame na tabela' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiParam({ name: 'exameId', description: 'ID do exame' })
  @ApiResponse({
    status: 200,
    description: 'Preço encontrado ou null se não existir',
  })
  findPrecoExame(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
    @Param('exameId', ParseUUIDPipe) exameId: string,
  ): Promise<TabelaPrecoItem | null> {
    return this.tabelaPrecoService.findPrecoExame(tabelaId, exameId);
  }

  @Get(':tabelaId/count-itens')
  @ApiOperation({ summary: 'Contar quantidade de itens na tabela' })
  @ApiParam({ name: 'tabelaId', description: 'ID da tabela' })
  @ApiResponse({
    status: 200,
    description: 'Quantidade de itens',
  })
  async countItens(
    @Param('tabelaId', ParseUUIDPipe) tabelaId: string,
  ): Promise<{ count: number }> {
    const count = await this.tabelaPrecoService.countItens(tabelaId);
    return { count };
  }
}
