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
import { CampoFormularioService } from './campo-formulario.service';
import { CreateCampoFormularioDto } from './dto/create-campo-formulario.dto';
import { UpdateCampoFormularioDto } from './dto/update-campo-formulario.dto';
import {
  TipoCampo,
  StatusCampo,
  CamposPadraoSistema,
} from './entities/campo-formulario.entity';
import { JwtAuthGuard } from '../../autenticacao/auth/guards/jwt-auth.guard';

@ApiTags('Campos de Formulário')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exames/campos-formulario')
export class CampoFormularioController {
  constructor(
    private readonly campoFormularioService: CampoFormularioService,
  ) {}

  // ========== ENDPOINTS PARA CAMPOS PADRÃO DO SISTEMA ==========

  @Get('campos-padrao')
  @ApiOperation({
    summary: 'Listar todos os campos padrão do sistema',
    description:
      'Retorna lista de campos padrão (UNIDADE_MEDIDA, TIPO_SANGUE, etc) que podem ser usados em formulários',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de campos padrão do sistema',
    schema: {
      example: {
        campos: [
          {
            codigo: 'UNIDADE_MEDIDA',
            nome: 'Unidade de Medida',
            descricao: 'Usado nos formulários de exames',
            categoria: 'Unidades de Medida e Quantidades',
          },
          {
            codigo: 'TIPO_SANGUE',
            nome: 'Tipo Sanguíneo',
            descricao: 'Tipo sanguíneo do paciente (A+, B-, O+, etc)',
            categoria: 'Dados do Paciente',
          },
        ],
        total: 27,
      },
    },
  })
  getCamposPadrao() {
    return this.campoFormularioService.getCamposPadrao();
  }

  @Get('campos-padrao/:codigo')
  @ApiOperation({
    summary: 'Buscar informações de um campo padrão específico',
    description:
      'Retorna detalhes sobre um campo padrão do sistema pelo código',
  })
  @ApiParam({
    name: 'codigo',
    description: 'Código do campo padrão',
    enum: CamposPadraoSistema,
  })
  @ApiResponse({ status: 200, description: 'Informações do campo padrão' })
  @ApiResponse({ status: 404, description: 'Campo padrão não encontrado' })
  getCampoPadraoByCodigo(@Param('codigo') codigo: CamposPadraoSistema) {
    return this.campoFormularioService.getCampoPadraoByCodigo(codigo);
  }

  @Get('tipos-campo')
  @ApiOperation({
    summary: 'Listar todos os tipos de campo disponíveis',
    description:
      'Retorna lista de tipos de campo (SELECT, RADIO, TEXTO, etc) que podem ser usados ao criar campos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de campo',
    schema: {
      example: {
        tipos: [
          {
            valor: 'select',
            label: 'Seleção (Dropdown)',
            categoria: 'Campos de seleção',
            permiteAlternativas: true,
          },
          {
            valor: 'texto',
            label: 'Texto Curto',
            categoria: 'Campos de texto',
            permiteAlternativas: false,
          },
        ],
        total: 39,
      },
    },
  })
  getTiposCampo() {
    return this.campoFormularioService.getTiposCampo();
  }

  @Get('campos-padrao/categoria/:categoria')
  @ApiOperation({
    summary: 'Listar campos padrão por categoria',
    description:
      'Retorna campos padrão filtrados por categoria (ex: "Dados do Paciente", "Resultados")',
  })
  @ApiParam({
    name: 'categoria',
    description: 'Categoria dos campos',
    example: 'Dados do Paciente',
  })
  @ApiResponse({ status: 200, description: 'Lista de campos da categoria' })
  getCamposPadraoPorCategoria(@Param('categoria') categoria: string) {
    return this.campoFormularioService.getCamposPadraoPorCategoria(categoria);
  }

  // ========== ENDPOINTS CRUD NORMAIS ==========

  @Post()
  @ApiOperation({ summary: 'Criar novo campo de formulário' })
  @ApiResponse({ status: 201, description: 'Campo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Campo já existe' })
  create(@Body() createCampoDto: CreateCampoFormularioDto) {
    return this.campoFormularioService.create(createCampoDto);
  }

  @Get('formulario/:formularioId')
  @ApiOperation({ summary: 'Listar campos de um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Lista de campos do formulário' })
  findByFormulario(@Param('formularioId', ParseUUIDPipe) formularioId: string) {
    return this.campoFormularioService.findByFormulario(formularioId);
  }

  @Get('formulario/:formularioId/ativos')
  @ApiOperation({ summary: 'Listar campos ativos de um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de campos ativos do formulário',
  })
  findAtivos(@Param('formularioId', ParseUUIDPipe) formularioId: string) {
    return this.campoFormularioService.findAtivos(formularioId);
  }

  @Get('formulario/:formularioId/obrigatorios')
  @ApiOperation({ summary: 'Listar campos obrigatórios de um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de campos obrigatórios do formulário',
  })
  findObrigatorios(@Param('formularioId', ParseUUIDPipe) formularioId: string) {
    return this.campoFormularioService.findObrigatorios(formularioId);
  }

  @Get('formulario/:formularioId/tipo/:tipo')
  @ApiOperation({ summary: 'Listar campos por tipo em um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiParam({ name: 'tipo', enum: TipoCampo })
  @ApiResponse({
    status: 200,
    description: 'Lista de campos do tipo especificado',
  })
  findByTipo(
    @Param('formularioId', ParseUUIDPipe) formularioId: string,
    @Param('tipo') tipo: TipoCampo,
  ) {
    return this.campoFormularioService.findByTipo(formularioId, tipo);
  }

  @Get('formulario/:formularioId/search')
  @ApiOperation({ summary: 'Buscar campos em um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  search(
    @Param('formularioId', ParseUUIDPipe) formularioId: string,
    @Query('q') termo: string,
  ) {
    return this.campoFormularioService.search(formularioId, termo);
  }

  @Get('formulario/:formularioId/codigo/:codigo')
  @ApiOperation({ summary: 'Buscar campo por código em um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiParam({ name: 'codigo', description: 'Código do campo' })
  @ApiResponse({ status: 200, description: 'Campo encontrado' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  findByCodigo(
    @Param('formularioId', ParseUUIDPipe) formularioId: string,
    @Param('codigo') codigo: string,
  ) {
    return this.campoFormularioService.findByCodigo(formularioId, codigo);
  }

  @Get('formulario/:formularioId/estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas dos campos de um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos campos' })
  getEstatisticas(@Param('formularioId', ParseUUIDPipe) formularioId: string) {
    return this.campoFormularioService.getEstatisticas(formularioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar campo por ID' })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Campo encontrado' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.campoFormularioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campo' })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Campo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCampoDto: UpdateCampoFormularioDto,
  ) {
    return this.campoFormularioService.update(id, updateCampoDto);
  }

  @Patch('formulario/:formularioId/reordenar')
  @ApiOperation({ summary: 'Reordenar campos de um formulário' })
  @ApiParam({ name: 'formularioId', description: 'ID do formulário' })
  @ApiResponse({ status: 200, description: 'Campos reordenados com sucesso' })
  reordenar(
    @Param('formularioId', ParseUUIDPipe) formularioId: string,
    @Body() ordens: { id: string; ordem: number }[],
  ) {
    return this.campoFormularioService.reordenar(formularioId, ordens);
  }

  @Post(':id/duplicar')
  @ApiOperation({ summary: 'Duplicar campo' })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiQuery({
    name: 'codigo',
    description: 'Novo código do campo',
    required: false,
  })
  @ApiResponse({ status: 201, description: 'Campo duplicado com sucesso' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  @ApiResponse({ status: 400, description: 'Código já existe' })
  duplicar(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('codigo') novoCodigoCampo?: string,
  ) {
    return this.campoFormularioService.duplicar(id, novoCodigoCampo);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status ativo/inativo do campo' })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.campoFormularioService.toggleStatus(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do campo' })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiQuery({ name: 'status', enum: StatusCampo })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: StatusCampo,
  ) {
    return this.campoFormularioService.updateStatus(id, status);
  }

  @Post(':id/validar')
  @ApiOperation({ summary: 'Validar campo' })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Resultado da validação' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  validarCampo(@Param('id', ParseUUIDPipe) id: string) {
    return this.campoFormularioService.validarCampo(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover campo' })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Campo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.campoFormularioService.remove(id);
  }
}
