import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  HierarquiaCfoService,
  FiltroHierarquiaCfo,
} from './hierarquia-cfo.service';
import {
  CreateHierarquiaCfoDto,
  ClasseCfoDto,
} from './dto/create-hierarquia-cfo.dto';
import { UpdateHierarquiaCfoDto } from './dto/update-hierarquia-cfo.dto';

@ApiTags('Hierarquia CFO')
@ApiBearerAuth()
@Controller('financeiro/hierarquias-cfo')
export class HierarquiaCfoController {
  constructor(private readonly service: HierarquiaCfoService) {}

  // =============================================
  // CRUD BÁSICO
  // =============================================

  @Post()
  @ApiOperation({ summary: 'Criar nova hierarquia CFO' })
  @ApiResponse({
    status: 201,
    description: 'Hierarquia criada com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe hierarquia com o mesmo código interno',
  })
  create(@Body() createDto: CreateHierarquiaCfoDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Listar todas as hierarquias CFO com filtros opcionais e paginação',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @ApiQuery({
    name: 'ativo',
    required: false,
    type: Boolean,
    description: 'Filtrar por status ativo/inativo',
  })
  @ApiQuery({
    name: 'pesquisar',
    required: false,
    description: 'Pesquisar por descrição ou código',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de hierarquias retornada com sucesso',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('ativo') ativo?: string,
    @Query('pesquisar') pesquisar?: string,
  ) {
    const filtros: FiltroHierarquiaCfo = {};
    if (page) filtros.page = parseInt(page, 10);
    if (limit) filtros.limit = parseInt(limit, 10);
    if (ativo !== undefined) filtros.ativo = ativo === 'true';
    if (pesquisar) filtros.pesquisar = pesquisar;

    return this.service.findAll(filtros);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das hierarquias CFO' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  getEstatisticas() {
    return this.service.getEstatisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar hierarquia CFO por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiResponse({
    status: 200,
    description: 'Hierarquia encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Hierarquia não encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/arvore')
  @ApiOperation({ summary: 'Buscar hierarquia CFO em formato de árvore' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiResponse({
    status: 200,
    description: 'Hierarquia em formato de árvore retornada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Hierarquia não encontrada',
  })
  findAsTree(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findAsTree(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar hierarquia CFO' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiResponse({
    status: 200,
    description: 'Hierarquia atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Hierarquia não encontrada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateHierarquiaCfoDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir hierarquia CFO' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiResponse({
    status: 204,
    description: 'Hierarquia excluída com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Hierarquia não encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  // =============================================
  // AÇÕES DE STATUS
  // =============================================

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status da hierarquia (ativo/inativo)' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Hierarquia não encontrada',
  })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.toggleStatus(id);
  }

  // =============================================
  // CLASSES
  // =============================================

  @Post(':id/classes')
  @ApiOperation({ summary: 'Adicionar classe à hierarquia CFO' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiResponse({
    status: 200,
    description: 'Classe adicionada com sucesso',
  })
  adicionarClasse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() classeDto: ClasseCfoDto,
  ) {
    return this.service.adicionarClasse(id, classeDto);
  }

  @Patch(':id/classes/:classeId')
  @ApiOperation({ summary: 'Atualizar classe da hierarquia CFO' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiParam({
    name: 'classeId',
    description: 'ID da classe',
  })
  @ApiResponse({
    status: 200,
    description: 'Classe atualizada com sucesso',
  })
  atualizarClasse(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('classeId', ParseUUIDPipe) classeId: string,
    @Body() classeDto: Partial<ClasseCfoDto>,
  ) {
    return this.service.atualizarClasse(id, classeId, classeDto);
  }

  @Delete(':id/classes/:classeId')
  @ApiOperation({ summary: 'Remover classe da hierarquia CFO' })
  @ApiParam({
    name: 'id',
    description: 'ID da hierarquia',
  })
  @ApiParam({
    name: 'classeId',
    description: 'ID da classe',
  })
  @ApiResponse({
    status: 200,
    description: 'Classe removida com sucesso',
  })
  removerClasse(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('classeId', ParseUUIDPipe) classeId: string,
  ) {
    return this.service.removerClasse(id, classeId);
  }
}
