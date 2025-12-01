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
import { AdquirenteService, FiltroAdquirente } from './adquirente.service';
import {
  CreateAdquirenteDto,
  RestricaoAdquirenteDto,
} from './dto/create-adquirente.dto';
import { UpdateAdquirenteDto } from './dto/update-adquirente.dto';
import { StatusAdquirente } from './entities/adquirente.entity';

@ApiTags('Adquirentes')
@ApiBearerAuth()
@Controller('financeiro/adquirentes')
export class AdquirenteController {
  constructor(private readonly service: AdquirenteService) {}

  // =============================================
  // CRUD BÁSICO
  // =============================================

  @Post()
  @ApiOperation({ summary: 'Criar novo adquirente' })
  @ApiResponse({
    status: 201,
    description: 'Adquirente criado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe adquirente com o mesmo código interno',
  })
  create(@Body() createDto: CreateAdquirenteDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os adquirentes com filtros opcionais e paginação',
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
    name: 'status',
    required: false,
    enum: StatusAdquirente,
    description: 'Filtrar por status',
  })
  @ApiQuery({
    name: 'unidade',
    required: false,
    description: 'Filtrar por unidade de saúde (ID)',
  })
  @ApiQuery({
    name: 'pesquisar',
    required: false,
    description: 'Pesquisar por nome ou código',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de adquirentes retornada com sucesso',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: StatusAdquirente,
    @Query('unidade') unidade?: string,
    @Query('pesquisar') pesquisar?: string,
  ) {
    const filtros: FiltroAdquirente = {};
    if (page) filtros.page = parseInt(page, 10);
    if (limit) filtros.limit = parseInt(limit, 10);
    if (status) filtros.status = status;
    if (unidade) filtros.unidade = unidade;
    if (pesquisar) filtros.pesquisar = pesquisar;

    return this.service.findAll(filtros);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos adquirentes' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  getEstatisticas() {
    return this.service.getEstatisticas();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar adquirentes por status' })
  @ApiParam({
    name: 'status',
    description: 'Status do adquirente',
    enum: StatusAdquirente,
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirentes encontrados com sucesso',
  })
  findByStatus(@Param('status') status: StatusAdquirente) {
    return this.service.findByStatus(status);
  }

  @Get('unidade/:unidadeSaudeId')
  @ApiOperation({ summary: 'Buscar adquirentes por unidade de saúde' })
  @ApiParam({
    name: 'unidadeSaudeId',
    description: 'ID da unidade de saúde',
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirentes encontrados com sucesso',
  })
  findByUnidade(
    @Param('unidadeSaudeId', ParseUUIDPipe) unidadeSaudeId: string,
  ) {
    return this.service.findByUnidade(unidadeSaudeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar adquirente por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirente encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Adquirente atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAdquirenteDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 204,
    description: 'Adquirente excluído com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  // =============================================
  // AÇÕES DE STATUS
  // =============================================

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do adquirente (ativo/inativo)' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.toggleStatus(id);
  }

  // =============================================
  // INTEGRAÇÃO (ABA INTEGRAÇÃO DO FIGMA)
  // =============================================

  @Post(':id/testar-conexao')
  @ApiOperation({ summary: 'Testar conexão com a integração vinculada' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado do teste de conexão',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  testarConexao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.testarConexao(id);
  }

  @Patch(':id/vincular-integracao')
  @ApiOperation({
    summary: 'Vincular integração ao adquirente com config de API',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Integração vinculada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente ou integração não encontrado',
  })
  vincularIntegracao(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      integracao_id: string;
      validade_configuracao_api?: string;
      chave_contingencia?: string;
    },
  ) {
    return this.service.vincularIntegracao(
      id,
      body.integracao_id,
      body.validade_configuracao_api,
      body.chave_contingencia,
    );
  }

  @Delete(':id/desvincular-integracao')
  @ApiOperation({ summary: 'Remover vínculo de integração do adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Integração desvinculada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Adquirente não encontrado',
  })
  desvincularIntegracao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.desvincularIntegracao(id);
  }

  // =============================================
  // UNIDADES ASSOCIADAS
  // =============================================

  @Post(':id/unidades/:unidadeSaudeId')
  @ApiOperation({ summary: 'Adicionar unidade ao adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiParam({
    name: 'unidadeSaudeId',
    description: 'ID da unidade de saúde',
  })
  @ApiResponse({
    status: 200,
    description: 'Unidade adicionada com sucesso',
  })
  adicionarUnidade(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('unidadeSaudeId', ParseUUIDPipe) unidadeSaudeId: string,
  ) {
    return this.service.adicionarUnidade(id, unidadeSaudeId);
  }

  @Delete(':id/unidades/:unidadeSaudeId')
  @ApiOperation({ summary: 'Remover unidade do adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiParam({
    name: 'unidadeSaudeId',
    description: 'ID da unidade de saúde',
  })
  @ApiResponse({
    status: 200,
    description: 'Unidade removida com sucesso',
  })
  removerUnidade(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('unidadeSaudeId', ParseUUIDPipe) unidadeSaudeId: string,
  ) {
    return this.service.removerUnidade(id, unidadeSaudeId);
  }

  // =============================================
  // RESTRIÇÕES
  // =============================================

  @Post(':id/restricoes')
  @ApiOperation({ summary: 'Adicionar restrição ao adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiResponse({
    status: 200,
    description: 'Restrição adicionada com sucesso',
  })
  adicionarRestricao(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() restricaoDto: RestricaoAdquirenteDto,
  ) {
    return this.service.adicionarRestricao(id, restricaoDto);
  }

  @Delete(':id/restricoes/:restricaoId')
  @ApiOperation({ summary: 'Remover restrição do adquirente' })
  @ApiParam({
    name: 'id',
    description: 'ID do adquirente',
  })
  @ApiParam({
    name: 'restricaoId',
    description: 'ID da restrição',
  })
  @ApiResponse({
    status: 200,
    description: 'Restrição removida com sucesso',
  })
  removerRestricao(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('restricaoId', ParseUUIDPipe) restricaoId: string,
  ) {
    return this.service.removerRestricao(id, restricaoId);
  }
}
