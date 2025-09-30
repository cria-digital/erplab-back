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
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MetodosService } from './metodos.service';
import { CreateMetodoDto } from './dto/create-metodo.dto';
import { UpdateMetodoDto } from './dto/update-metodo.dto';
import { StatusMetodo } from './entities/metodo.entity';

@ApiTags('Métodos')
@ApiBearerAuth()
@Controller('metodos')
export class MetodosController {
  constructor(private readonly metodosService: MetodosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo método' })
  @ApiResponse({ status: 201, description: 'Método criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Método com este código já existe' })
  create(@Body() createMetodoDto: CreateMetodoDto) {
    return this.metodosService.create(createMetodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os métodos' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: StatusMetodo,
    description: 'Filtrar por status',
  })
  @ApiResponse({ status: 200, description: 'Lista de métodos' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: StatusMetodo,
  ) {
    return this.metodosService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      status,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obter estatísticas dos métodos' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos métodos' })
  getStatistics() {
    return this.metodosService.getStatistics();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar métodos por status' })
  @ApiParam({
    name: 'status',
    enum: StatusMetodo,
    description: 'Status do método',
  })
  @ApiResponse({ status: 200, description: 'Lista de métodos por status' })
  findByStatus(@Param('status') status: StatusMetodo) {
    return this.metodosService.findByStatus(status);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar métodos por termo' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Termo de busca',
  })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  search(@Query('q') term: string) {
    return this.metodosService.search(term);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar método por código interno' })
  @ApiParam({
    name: 'codigo',
    description: 'Código interno do método',
    example: 'MET123',
  })
  @ApiResponse({ status: 200, description: 'Método encontrado' })
  @ApiResponse({ status: 404, description: 'Método não encontrado' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.metodosService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter método por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do método',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Método encontrado' })
  @ApiResponse({ status: 404, description: 'Método não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.metodosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar método' })
  @ApiParam({
    name: 'id',
    description: 'ID do método',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Método atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Método não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMetodoDto: UpdateMetodoDto,
  ) {
    return this.metodosService.update(id, updateMetodoDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do método (ativo/inativo)' })
  @ApiParam({
    name: 'id',
    description: 'ID do método',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 400, description: 'Método em validação' })
  @ApiResponse({ status: 404, description: 'Método não encontrado' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.metodosService.toggleStatus(id);
  }

  @Patch(':id/validar')
  @ApiOperation({ summary: 'Validar método em validação' })
  @ApiParam({
    name: 'id',
    description: 'ID do método',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Método validado com sucesso' })
  @ApiResponse({ status: 400, description: 'Método não está em validação' })
  @ApiResponse({ status: 404, description: 'Método não encontrado' })
  validar(@Param('id', ParseUUIDPipe) id: string) {
    return this.metodosService.validar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover método' })
  @ApiParam({
    name: 'id',
    description: 'ID do método',
    format: 'uuid',
  })
  @ApiResponse({ status: 204, description: 'Método removido com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Método vinculado a laboratórios',
  })
  @ApiResponse({ status: 404, description: 'Método não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.metodosService.remove(id);
  }
}
