import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CampoFormularioService } from '../services/campo-formulario.service';
import { CreateCampoFormularioDto } from '../dto/create-campo-formulario.dto';
import { UpdateCampoFormularioDto } from '../dto/update-campo-formulario.dto';
import { SearchCampoFormularioDto } from '../dto/search-campo-formulario.dto';
import { NomeCampoFormulario } from '../entities/campo-formulario.entity';

@ApiTags('Campos de Formulário')
@Controller('infraestrutura/campos-formulario')
@ApiBearerAuth()
export class CampoFormularioController {
  constructor(
    private readonly campoFormularioService: CampoFormularioService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo campo de formulário',
    description: 'Cria um novo campo global que pode ser usado em formulários',
  })
  @ApiResponse({ status: 201, description: 'Campo criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Campo já existe' })
  create(@Body() createDto: CreateCampoFormularioDto, @Request() req: any) {
    return this.campoFormularioService.create(createDto, req.user?.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os campos',
    description: 'Retorna todos os campos de formulário com suas alternativas',
  })
  @ApiResponse({ status: 200, description: 'Lista de campos' })
  findAll() {
    return this.campoFormularioService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar campos com filtros e paginação',
    description:
      'Busca campos de formulário com filtros opcionais (termo, nomeCampo, ativo) e paginação (page, limit)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de campos encontrados',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'object' },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 50 },
            totalPages: { type: 'number', example: 5 },
            hasPrevPage: { type: 'boolean', example: false },
            hasNextPage: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  search(@Query() searchDto: SearchCampoFormularioDto) {
    return this.campoFormularioService.search(searchDto);
  }

  @Get('ativos')
  @ApiOperation({
    summary: 'Listar apenas campos ativos',
    description: 'Retorna apenas campos ativos com suas alternativas',
  })
  @ApiResponse({ status: 200, description: 'Lista de campos ativos' })
  findAtivos() {
    return this.campoFormularioService.findAtivos();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar campo por ID',
    description: 'Retorna um campo específico com suas alternativas',
  })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Campo encontrado' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.campoFormularioService.findOne(id);
  }

  @Get('nome/:nomeCampo')
  @ApiOperation({
    summary: 'Buscar campo por nome',
    description: 'Retorna um campo específico pelo nome (enum)',
  })
  @ApiParam({
    name: 'nomeCampo',
    enum: NomeCampoFormulario,
    description: 'Nome do campo (enum)',
  })
  @ApiResponse({ status: 200, description: 'Campo encontrado' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  findByNome(@Param('nomeCampo') nomeCampo: NomeCampoFormulario) {
    return this.campoFormularioService.findByNome(nomeCampo);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar campo',
    description: 'Atualiza as informações de um campo',
  })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Campo atualizado' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCampoFormularioDto,
    @Request() req: any,
  ) {
    return this.campoFormularioService.update(id, updateDto, req.user?.id);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Alternar status ativo/inativo',
    description: 'Ativa ou desativa um campo',
  })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 200, description: 'Status alterado' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.campoFormularioService.toggleStatus(id, req.user?.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover campo',
    description: 'Remove um campo (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'ID do campo' })
  @ApiResponse({ status: 204, description: 'Campo removido' })
  @ApiResponse({ status: 404, description: 'Campo não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.campoFormularioService.remove(id);
  }
}
