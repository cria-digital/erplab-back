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
import { FormulariosService } from './formularios.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { TipoFormulario, StatusFormulario } from './entities/formulario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Formulários')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/formularios')
export class FormulariosController {
  constructor(private readonly formulariosService: FormulariosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo formulário' })
  @ApiResponse({ status: 201, description: 'Formulário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Formulário já existe' })
  create(@Body() createFormularioDto: CreateFormularioDto) {
    return this.formulariosService.create(createFormularioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os formulários' })
  @ApiResponse({ status: 200, description: 'Lista de formulários' })
  findAll() {
    return this.formulariosService.findAll();
  }

  @Get('ativos')
  @ApiOperation({ summary: 'Listar formulários ativos' })
  @ApiResponse({ status: 200, description: 'Lista de formulários ativos' })
  findAtivos() {
    return this.formulariosService.findAtivos();
  }

  @Get('publicados')
  @ApiOperation({ summary: 'Listar formulários publicados' })
  @ApiResponse({ status: 200, description: 'Lista de formulários publicados' })
  findPublicados() {
    return this.formulariosService.findPublicados();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar formulários por termo' })
  @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  search(@Query('q') termo: string) {
    return this.formulariosService.search(termo);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos formulários' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos formulários' })
  getEstatisticas() {
    return this.formulariosService.getEstatisticas();
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Listar formulários por tipo' })
  @ApiParam({ name: 'tipo', enum: TipoFormulario })
  @ApiResponse({
    status: 200,
    description: 'Lista de formulários do tipo especificado',
  })
  findByTipo(@Param('tipo') tipo: TipoFormulario) {
    return this.formulariosService.findByTipo(tipo);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar formulários por status' })
  @ApiParam({ name: 'status', enum: StatusFormulario })
  @ApiResponse({
    status: 200,
    description: 'Lista de formulários com o status especificado',
  })
  findByStatus(@Param('status') status: StatusFormulario) {
    return this.formulariosService.findByStatus(status);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Listar formulários por unidade de saúde' })
  @ApiParam({ name: 'unidadeId', description: 'ID da unidade de saúde' })
  @ApiResponse({ status: 200, description: 'Lista de formulários da unidade' })
  findByUnidadeSaude(@Param('unidadeId', ParseUUIDPipe) unidadeId: string) {
    return this.formulariosService.findByUnidadeSaude(unidadeId);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar formulário por código' })
  @ApiParam({ name: 'codigo', description: 'Código do formulário' })
  @ApiResponse({ status: 200, description: 'Formulário encontrado' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.formulariosService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar formulário por ID' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Formulário encontrado' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar formulário' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiResponse({
    status: 200,
    description: 'Formulário atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFormularioDto: UpdateFormularioDto,
  ) {
    return this.formulariosService.update(id, updateFormularioDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo do formulário' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulariosService.toggleStatus(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do formulário' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiQuery({ name: 'status', enum: StatusFormulario })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: StatusFormulario,
  ) {
    return this.formulariosService.updateStatus(id, status);
  }

  @Post(':id/publicar')
  @ApiOperation({ summary: 'Publicar formulário' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Formulário publicado com sucesso' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  @ApiResponse({
    status: 400,
    description: 'Formulário não pode ser publicado',
  })
  publicar(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulariosService.publicar(id);
  }

  @Post(':id/criar-versao')
  @ApiOperation({ summary: 'Criar nova versão do formulário' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiResponse({ status: 201, description: 'Nova versão criada com sucesso' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  criarVersao(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulariosService.criarVersao(id);
  }

  @Post(':id/validar')
  @ApiOperation({ summary: 'Validar formulário' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Resultado da validação' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  validarFormulario(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulariosService.validarFormulario(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover formulário' })
  @ApiParam({ name: 'id', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Formulário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Formulário não encontrado' })
  @ApiResponse({ status: 400, description: 'Formulário não pode ser removido' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.formulariosService.remove(id);
  }
}
