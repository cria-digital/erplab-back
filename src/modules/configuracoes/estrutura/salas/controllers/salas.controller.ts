import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../autenticacao/auth/guards/jwt-auth.guard';
import { SalasService } from '../services/salas.service';
import { CreateSalaDto } from '../dto/create-sala.dto';
import { UpdateSalaDto } from '../dto/update-sala.dto';

@ApiTags('Estrutura - Salas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('configuracoes/estrutura/salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova sala' })
  @ApiResponse({ status: 201, description: 'Sala criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Body() createSalaDto: CreateSalaDto, @Request() req) {
    return await this.salasService.create(createSalaDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar salas com paginação e busca' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página (padrão: 1)',
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
    description: 'Buscar por nome, código interno ou setor',
  })
  @ApiQuery({
    name: 'unidadeId',
    required: false,
    type: String,
    description: 'Filtrar por unidade',
  })
  @ApiQuery({
    name: 'setor',
    required: false,
    type: String,
    description: 'Filtrar por setor',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de salas retornada',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('unidadeId') unidadeId?: string,
    @Query('setor') setor?: string,
  ) {
    return await this.salasService.findAllPaginated(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      unidadeId,
      setor,
    );
  }

  @Get('ativas')
  @ApiOperation({ summary: 'Listar salas ativas' })
  @ApiResponse({ status: 200, description: 'Lista de salas ativas retornada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAllAtivas() {
    return await this.salasService.findAllAtivas();
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das salas' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getEstatisticas() {
    return await this.salasService.getEstatisticas();
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({ summary: 'Buscar salas por unidade' })
  @ApiParam({ name: 'unidadeId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Salas encontradas' })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByUnidade(@Param('unidadeId', ParseUUIDPipe) unidadeId: string) {
    return await this.salasService.findByUnidade(unidadeId);
  }

  @Get('setor/:setor')
  @ApiOperation({ summary: 'Buscar salas por setor' })
  @ApiParam({ name: 'setor', type: 'string', description: 'Nome do setor' })
  @ApiResponse({ status: 200, description: 'Salas encontradas' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findBySetor(@Param('setor') setor: string) {
    return await this.salasService.findBySetor(setor);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar sala por código interno' })
  @ApiParam({ name: 'codigo', type: 'string' })
  @ApiResponse({ status: 200, description: 'Sala encontrada' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return await this.salasService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar sala por ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Sala encontrada' })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.salasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sala' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'UUID inválido ou dados inválidos' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalaDto: UpdateSalaDto,
    @Request() req,
  ) {
    return await this.salasService.update(id, updateSalaDto, req.user.userId);
  }

  @Patch(':id/toggle-ativo')
  @ApiOperation({ summary: 'Alternar status ativo/inativo da sala' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Status da sala alterado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async toggleAtivo(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return await this.salasService.toggleAtivo(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover sala' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Sala removida com sucesso' })
  @ApiResponse({ status: 400, description: 'UUID inválido' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.salasService.remove(id);
    return { message: 'Sala removida com sucesso' };
  }
}
