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
import { AmostrasService } from '../services/amostras.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';
import { StatusAmostra } from '../entities/amostra.entity';

@ApiTags('Amostras')
@ApiBearerAuth()
@Controller('exames/amostras')
export class AmostrasController {
  constructor(private readonly amostrasService: AmostrasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova amostra' })
  @ApiResponse({ status: 201, description: 'Amostra criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 409,
    description: 'Amostra com este código já existe',
  })
  create(@Body() createAmostraDto: CreateAmostraDto) {
    return this.amostrasService.create(createAmostraDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as amostras' })
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
    enum: StatusAmostra,
    description: 'Filtrar por status',
  })
  @ApiResponse({ status: 200, description: 'Lista de amostras' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: StatusAmostra,
  ) {
    return this.amostrasService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
      status,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obter estatísticas das amostras' })
  @ApiResponse({ status: 200, description: 'Estatísticas das amostras' })
  getStatistics() {
    return this.amostrasService.getStatistics();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Buscar amostras por status' })
  @ApiParam({
    name: 'status',
    enum: StatusAmostra,
    description: 'Status da amostra',
  })
  @ApiResponse({ status: 200, description: 'Lista de amostras por status' })
  findByStatus(@Param('status') status: StatusAmostra) {
    return this.amostrasService.findByStatus(status);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar amostra por código interno' })
  @ApiParam({
    name: 'codigo',
    description: 'Código interno da amostra',
    example: 'AMO001',
  })
  @ApiResponse({ status: 200, description: 'Amostra encontrada' })
  @ApiResponse({ status: 404, description: 'Amostra não encontrada' })
  findByCodigo(@Param('codigo') codigo: string) {
    return this.amostrasService.findByCodigo(codigo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter amostra por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da amostra',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Amostra encontrada' })
  @ApiResponse({ status: 404, description: 'Amostra não encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.amostrasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar amostra' })
  @ApiParam({
    name: 'id',
    description: 'ID da amostra',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Amostra atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Amostra não encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAmostraDto: UpdateAmostraDto,
  ) {
    return this.amostrasService.update(id, updateAmostraDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status da amostra (ativo/inativo)' })
  @ApiParam({
    name: 'id',
    description: 'ID da amostra',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  @ApiResponse({ status: 400, description: 'Amostra em revisão' })
  @ApiResponse({ status: 404, description: 'Amostra não encontrada' })
  toggleStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.amostrasService.toggleStatus(id);
  }

  @Patch(':id/validar')
  @ApiOperation({ summary: 'Validar amostra em revisão' })
  @ApiParam({
    name: 'id',
    description: 'ID da amostra',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Amostra validada com sucesso' })
  @ApiResponse({ status: 400, description: 'Amostra não está em revisão' })
  @ApiResponse({ status: 404, description: 'Amostra não encontrada' })
  validar(@Param('id', ParseUUIDPipe) id: string) {
    return this.amostrasService.validar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover amostra' })
  @ApiParam({
    name: 'id',
    description: 'ID da amostra',
    format: 'uuid',
  })
  @ApiResponse({ status: 204, description: 'Amostra removida com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Amostra vinculada a laboratórios',
  })
  @ApiResponse({ status: 404, description: 'Amostra não encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.amostrasService.remove(id);
  }
}
