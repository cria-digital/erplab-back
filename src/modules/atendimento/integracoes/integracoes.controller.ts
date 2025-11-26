import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { IntegracoesService } from './integracoes.service';
import { CreateIntegracaoDto } from './dto/create-integracao.dto';
import { UpdateIntegracaoDto } from './dto/update-integracao.dto';
import { TipoIntegracao, StatusIntegracao } from './entities/integracao.entity';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';
import {
  getAllSchemas,
  getSchemaBySlug,
  getSchemasByTipo,
} from './schemas/index';
import { PaginationDto } from '../../infraestrutura/common/dto/pagination.dto';

@ApiTags('Integrações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('atendimento/integracoes')
export class IntegracoesController {
  constructor(private readonly integracoesService: IntegracoesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova integração' })
  @ApiResponse({ status: 201, description: 'Integração criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Integração já existe' })
  create(@Body() createIntegracaoDto: CreateIntegracaoDto) {
    return this.integracoesService.create(createIntegracaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as integrações' })
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
    description: 'Itens por página (padrão: 10, máximo: 100)',
  })
  @ApiResponse({ status: 200, description: 'Lista de integrações paginada' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.integracoesService.findAll(paginationDto);
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar integrações ativas' })
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
    description: 'Itens por página (padrão: 10, máximo: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de integrações ativas paginada',
  })
  findAtivos(@Query() paginationDto: PaginationDto) {
    return this.integracoesService.findAtivos(paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar integrações por termo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
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
    description: 'Itens por página (padrão: 10, máximo: 100)',
  })
  @ApiResponse({ status: 200, description: 'Resultados da busca paginada' })
  search(@Query('q') termo: string, @Query() paginationDto: PaginationDto) {
    return this.integracoesService.search(termo, paginationDto);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das integrações' })
  @ApiResponse({ status: 200, description: 'Estatísticas das integrações' })
  getEstatisticas() {
    return this.integracoesService.getEstatisticas();
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Listar integrações por tipo' })
  @ApiParam({ name: 'tipo', enum: TipoIntegracao })
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
    description: 'Itens por página (padrão: 10, máximo: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de integrações do tipo especificado paginada',
  })
  findByTipo(
    @Param('tipo') tipo: TipoIntegracao,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.integracoesService.findByTipo(tipo, paginationDto);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar integrações por status' })
  @ApiParam({ name: 'status', enum: StatusIntegracao })
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
    description: 'Itens por página (padrão: 10, máximo: 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de integrações com o status especificado paginada',
  })
  findByStatus(
    @Param('status') status: StatusIntegracao,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.integracoesService.findByStatus(status, paginationDto);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar integração por código' })
  @ApiParam({ name: 'codigo', description: 'Código da integração' })
  @ApiResponse({ status: 200, description: 'Integração encontrada' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.integracoesService.findByCodigo(codigo);
  }

  // ==========================================
  // SCHEMAS - Endpoints para frontend
  // ==========================================

  @Get('schemas')
  @ApiOperation({
    summary: 'Listar todos os schemas de integrações disponíveis',
  })
  @ApiQuery({
    name: 'tipo',
    enum: TipoIntegracao,
    required: false,
    description: 'Filtrar por tipo de integração',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de schemas disponíveis',
  })
  getSchemas(@Query('tipo') tipo?: TipoIntegracao) {
    if (tipo) {
      return getSchemasByTipo(tipo);
    }
    return getAllSchemas();
  }

  @Get('schemas/:slug')
  @ApiOperation({
    summary: 'Buscar schema de integração por slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug da integração (ex: hermes-pardini)',
  })
  @ApiResponse({
    status: 200,
    description: 'Schema encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Schema não encontrado',
  })
  getSchemaBySlug(@Param('slug') slug: string) {
    const schema = getSchemaBySlug(slug);
    if (!schema) {
      throw new Error('Schema não encontrado');
    }
    return schema;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar integração por ID' })
  @ApiParam({ name: 'id', description: 'ID da integração' })
  @ApiResponse({ status: 200, description: 'Integração encontrada' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.integracoesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar integração' })
  @ApiParam({ name: 'id', description: 'ID da integração' })
  @ApiResponse({
    status: 200,
    description: 'Integração atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIntegracaoDto: UpdateIntegracaoDto,
  ) {
    return this.integracoesService.update(id, updateIntegracaoDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo da integração' })
  @ApiParam({ name: 'id', description: 'ID da integração' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.integracoesService.toggleStatus(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da integração' })
  @ApiParam({ name: 'id', description: 'ID da integração' })
  @ApiQuery({ name: 'status', enum: StatusIntegracao })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: StatusIntegracao,
  ) {
    return this.integracoesService.updateStatus(id, status);
  }

  @Post(':id/testar-conexao')
  @ApiOperation({ summary: 'Testar conexão com a integração' })
  @ApiParam({ name: 'id', description: 'ID da integração' })
  @ApiResponse({ status: 200, description: 'Resultado do teste de conexão' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  testarConexao(@Param('id', ParseUUIDPipe) id: string) {
    return this.integracoesService.testarConexao(id);
  }

  @Post(':id/sincronizar')
  @ApiOperation({ summary: 'Sincronizar dados da integração' })
  @ApiParam({ name: 'id', description: 'ID da integração' })
  @ApiResponse({ status: 200, description: 'Resultado da sincronização' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  sincronizar(@Param('id', ParseUUIDPipe) id: string) {
    return this.integracoesService.sincronizar(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover integração' })
  @ApiParam({ name: 'id', description: 'ID da integração' })
  @ApiResponse({ status: 200, description: 'Integração removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.integracoesService.remove(id);
  }
}
