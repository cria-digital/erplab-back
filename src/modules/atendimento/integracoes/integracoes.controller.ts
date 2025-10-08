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
  @ApiResponse({ status: 200, description: 'Lista de integrações' })
  findAll() {
    return this.integracoesService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar integrações ativas' })
  @ApiResponse({ status: 200, description: 'Lista de integrações ativas' })
  findAtivos() {
    return this.integracoesService.findAtivos();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar integrações por termo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  search(@Query('q') termo: string) {
    return this.integracoesService.search(termo);
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
  @ApiResponse({
    status: 200,
    description: 'Lista de integrações do tipo especificado',
  })
  findByTipo(@Param('tipo') tipo: TipoIntegracao) {
    return this.integracoesService.findByTipo(tipo);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar integrações por status' })
  @ApiParam({ name: 'status', enum: StatusIntegracao })
  @ApiResponse({
    status: 200,
    description: 'Lista de integrações com o status especificado',
  })
  findByStatus(@Param('status') status: StatusIntegracao) {
    return this.integracoesService.findByStatus(status);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Listar integrações por unidade de saúde' })
  @ApiParam({ name: 'unidadeId', description: 'ID da unidade de saúde' })
  @ApiResponse({ status: 200, description: 'Lista de integrações da unidade' })
  findByUnidadeSaude(@Param('unidadeId', ParseUUIDPipe) unidadeId: string) {
    return this.integracoesService.findByUnidadeSaude(unidadeId);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar integração por código' })
  @ApiParam({ name: 'codigo', description: 'Código da integração' })
  @ApiResponse({ status: 200, description: 'Integração encontrada' })
  @ApiResponse({ status: 404, description: 'Integração não encontrada' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.integracoesService.findByCodigo(codigo);
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
