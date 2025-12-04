import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LaboratorioApoioService } from './laboratorio-apoio.service';
import { CreateLaboratorioApoioDto } from './dto/create-laboratorio-apoio.dto';
import { UpdateLaboratorioApoioDto } from './dto/update-laboratorio-apoio.dto';

@ApiTags('Exames - Laboratórios de Apoio (Cadastro)')
@ApiBearerAuth()
@Controller('exames/laboratorios-apoio')
export class LaboratorioApoioController {
  constructor(private readonly service: LaboratorioApoioService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar laboratório de apoio',
    description: 'Cadastra um novo laboratório de apoio para envio de exames',
  })
  @ApiResponse({
    status: 201,
    description: 'Laboratório criado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe laboratório com este código',
  })
  async create(@Body() dto: CreateLaboratorioApoioDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Laboratório de apoio criado com sucesso',
      data,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar laboratórios de apoio',
    description: 'Lista todos os laboratórios de apoio com paginação e filtros',
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
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por nome',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ativo', 'inativo', 'suspenso'],
    description: 'Filtrar por status',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de laboratórios de apoio',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(page || 1, limit || 10, search, status);
  }

  @Get('ativos')
  @ApiOperation({
    summary: 'Listar laboratórios de apoio ativos',
    description:
      'Lista apenas laboratórios ativos para uso em seleção de exames',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de laboratórios ativos',
  })
  async findAtivos() {
    const data = await this.service.findAtivos();
    return {
      message: 'Laboratórios de apoio ativos listados com sucesso',
      data,
      total: data.length,
    };
  }

  @Get('codigo/:codigo')
  @ApiOperation({
    summary: 'Buscar laboratório por código',
  })
  @ApiResponse({
    status: 200,
    description: 'Laboratório encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Laboratório não encontrado',
  })
  async findByCodigo(@Param('codigo') codigo: string) {
    const data = await this.service.findByCodigo(codigo);
    return {
      message: 'Laboratório de apoio encontrado',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar laboratório por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Laboratório encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Laboratório não encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.findOne(id);
    return {
      message: 'Laboratório de apoio encontrado',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar laboratório de apoio',
  })
  @ApiResponse({
    status: 200,
    description: 'Laboratório atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Laboratório não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe laboratório com este código',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLaboratorioApoioDto,
  ) {
    const data = await this.service.update(id, dto);
    return {
      message: 'Laboratório de apoio atualizado com sucesso',
      data,
    };
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Ativar/Desativar laboratório de apoio',
  })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
  })
  async toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.service.toggleStatus(id);
    return {
      message: `Laboratório ${data.status === 'ativo' ? 'ativado' : 'desativado'} com sucesso`,
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover laboratório de apoio',
    description: 'Desativa o laboratório (soft delete)',
  })
  @ApiResponse({
    status: 200,
    description: 'Laboratório removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Laboratório não encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return {
      message: 'Laboratório de apoio removido com sucesso',
    };
  }
}
